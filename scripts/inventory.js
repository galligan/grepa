#!/usr/bin/env node

// :ga:meta inventory script - discovers all grep-anchors in your codebase

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { argv, exit } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DEFAULT_ANCHOR = ':ga:';
const CONFIG_FILE = join(process.cwd(), '.grepa', 'inventory.config.json');
const DEFAULT_OUTPUT_FILE = join(process.cwd(), '.grepa', 'grepa-list.json');

// Precompiled regex patterns for performance
const INLINE_CODE_PATTERN = /(?<!`)`(?!``)[^`]+`(?!`)/g;
const LINK_PATTERN = /\[([^\]]+)\]\([^\)]+\)/g;
const BLOCKQUOTE_PATTERN = /^\s*>/;
const HEADING_PATTERN = /^#{1,6}\s+/;

// Load configuration
function loadConfig() {
  if (existsSync(CONFIG_FILE)) {
    try {
      const content = readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      console.warn(`⚠️  Warning: Could not load config file: ${e.message}`);
    }
  }
  return {};
}

// Parse command line arguments
function parseArgs(config) {
  const args = {
    anchor: config.anchor || DEFAULT_ANCHOR,
    ignorePatterns: [],
    ignoreExamples: false,
    configPath: null
  };
  
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--ignore' && i + 1 < argv.length) {
      args.ignorePatterns.push(argv[++i]);
    } else if (argv[i] === '--ignore-examples') {
      args.ignoreExamples = true;
    } else if (argv[i] === '--config' && i + 1 < argv.length) {
      args.configPath = argv[++i];
    } else if (!argv[i].startsWith('--')) {
      args.anchor = argv[i];
    }
  }
  
  return args;
}

// Resolve ignore patterns from aliases and custom patterns
function resolveIgnorePatterns(patterns, config) {
  const globs = [];
  const ignoreConfig = config.ignore || {};
  const patternDefs = ignoreConfig.patterns || {};
  
  for (const pattern of patterns) {
    if (patternDefs[pattern]) {
      // It's a predefined pattern alias
      globs.push(...(patternDefs[pattern].globs || []));
    } else {
      // It's a custom pattern
      globs.push(pattern);
    }
  }
  
  return globs;
}

function isInMarkdownConstruct(filename, lineNum, anchorMatch, config, fileCache = null) {
  // Only check markdown files
  if (!filename.match(/\.(md|markdown|mdx)$/)) {
    return false;
  }
  
  try {
    // Use cached file contents if available
    let lines;
    if (fileCache && fileCache[filename]) {
      lines = fileCache[filename];
    } else {
      const content = readFileSync(filename, 'utf8');
      lines = content.split('\n');
      if (fileCache) {
        fileCache[filename] = lines;
      }
    }
    
    if (lineNum > lines.length) {
      return false;
    }
    
    const currentLine = lines[lineNum - 1];
    const docsExamplesConfig = config.docsExamples || {};
    
    // Get include/exclude lists
    const includeList = docsExamplesConfig.include || [];
    const excludeList = docsExamplesConfig.exclude || [];
    
    // Check code fences (```)
    if (excludeList.includes('codeFences')) {
      let inCodeFence = false;
      for (let i = 0; i < lineNum - 1; i++) {
        if (lines[i].trim().startsWith('```')) {
          inCodeFence = !inCodeFence;
        }
      }
      if (inCodeFence) {
        return true;
      }
    }
    
    // Check code blocks (4-space indentation)
    if (excludeList.includes('codeBlocks')) {
      if (currentLine.startsWith('    ') && currentLine.includes(anchorMatch)) {
        return true;
      }
    }
    
    // Check headings (lines starting with #)
    if (excludeList.includes('headings')) {
      if (HEADING_PATTERN.test(currentLine)) {
        return true;
      }
    }
    
    // Check inline code (text between backticks)
    if (excludeList.includes('inlineCode')) {
      const anchorPos = currentLine.indexOf(anchorMatch);
      if (anchorPos !== -1) {
        const matches = [...currentLine.matchAll(INLINE_CODE_PATTERN)];
        for (const match of matches) {
          if (match.index <= anchorPos && anchorPos <= match.index + match[0].length) {
            return true;
          }
        }
      }
    }
    
    // Check links [text](url)
    if (excludeList.includes('links')) {
      const anchorPos = currentLine.indexOf(anchorMatch);
      if (anchorPos !== -1) {
        const matches = [...currentLine.matchAll(LINK_PATTERN)];
        for (const match of matches) {
          if (match.index <= anchorPos && anchorPos <= match.index + match[0].length) {
            return true;
          }
        }
      }
    }
    
    // Check blockquotes (lines starting with >)
    if (excludeList.includes('blockquotes')) {
      if (BLOCKQUOTE_PATTERN.test(currentLine)) {
        return true;
      }
    }
    
    // Check HTML comments (only if NOT in include list)
    if (!includeList.includes('htmlComments')) {
      // Check if we're inside an HTML comment
      const fullText = lines.slice(0, lineNum).join('\n');
      const commentCount = (fullText.match(/<!--/g) || []).length;
      const commentEndCount = (fullText.match(/-->/g) || []).length;
      if (commentCount > commentEndCount) {
        return true;
      }
      // Also check if the current line has a comment
      if (currentLine.includes('<!--') && currentLine.includes(anchorMatch)) {
        const commentStart = currentLine.indexOf('<!--');
        const anchorPos = currentLine.indexOf(anchorMatch);
        const commentEnd = currentLine.indexOf('-->', commentStart);
        if (commentEnd === -1) {  // Comment continues on next line
          if (anchorPos > commentStart) {
            return true;
          }
        } else if (commentStart < anchorPos && anchorPos < commentEnd) {
          return true;
        }
      }
    }
    
    // Check front matter (only if NOT in include list)
    if (!includeList.includes('frontMatter')) {
      if (lineNum === 1) {
        return false;
      }
      // Check if we're in front matter
      if (lines[0].trim() === '---' || lines[0].trim() === '+++') {
        const delimiter = lines[0].trim();
        for (let i = 1; i < lineNum - 1; i++) {
          if (lines[i].trim() === delimiter) {
            return false;  // We passed the end of front matter
          }
        }
        return true;  // Still in front matter
      }
    }
    
    return false;
  } catch {
    // If we can't read the file, assume it's not in a special construct
    return false;
  }
}

function findGrepAnchors(anchor = DEFAULT_ANCHOR, ignorePatterns = [], ignoreExamples = false, config = {}) {
  try {
    // Create file cache for markdown construct detection
    const fileCache = {};
    
    // Run ripgrep to find all anchors
    // -n: line numbers, -o: only matching, --no-heading: compact format
    // Always exclude .git directory
    // Use same pattern as Python version
    const args = ['rg', '-n', '-o', `${anchor}[^\\s]*`, '--no-heading', '-g', '!.git/'];
    let rgCommand = args.join(' ');
    
    // Always respect .gitignore and other VCS ignore files by default.
    // Let ripgrep use its default behavior for discovering and respecting ignore files.
    // Explicitly add the root .gitignore if it exists to ensure it's considered.
    const gitignorePath = join(process.cwd(), '.gitignore');
    if (existsSync(gitignorePath)) {
      rgCommand += ` --ignore-file "${gitignorePath}"`;
    }
    // ripgrep will also look for other standard ignore files like .rgignore, .git/info/exclude,
    // and .gitignore files in parent directories as per its default behavior.
    
    // Resolve ignore patterns from config and command line
    const allPatterns = [];
    
    // Add active patterns from config file
    const ignoreConfig = config.ignore || {};
    const patternDefs = ignoreConfig.patterns || {};
    for (const [patternName, patternDef] of Object.entries(patternDefs)) {
      if (patternDef.active) {
        allPatterns.push(patternName);
      }
    }
    
    // Add custom patterns
    allPatterns.push(...(ignoreConfig.custom || []));
    
    // Add patterns from command line (override config)
    allPatterns.push(...ignorePatterns);
    
    // Resolve all patterns to globs
    if (allPatterns.length > 0) {
      const globs = resolveIgnorePatterns(allPatterns, config);
      for (const glob of globs) {
        rgCommand += ` -g "!${glob}"`;
      }
    }
    
    const output = execSync(rgCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    
    if (!output.trim()) {
      return { tags: {}, files: {}, totalAnchors: 0 };
    }
    
    const lines = output.trim().split('\n');
    const tags = {};
    const files = {};
    
    lines.forEach(line => {
      // Parse format: filename:line:match
      const match = line.match(/^(.+?):(\d+):(.+)$/);
      if (!match) return;
      
      const [, filename, lineNum, fullMatch] = match;
      
      // Skip if we're ignoring examples and this is in a markdown construct
      if (ignoreExamples && isInMarkdownConstruct(filename, parseInt(lineNum), fullMatch, config, fileCache)) {
        return;
      }
      
      // Extract the tag from the full match
      const tagMatch = fullMatch.match(new RegExp(`${anchor}([^\\s,\\]\\}]+)`));
      if (!tagMatch) return;
      
      const tag = tagMatch[1];
      
      // Update tag statistics
      if (!tags[tag]) {
        tags[tag] = {
          count: 0,
          files: {},
          firstSeen: { file: filename, line: parseInt(lineNum) }
        };
      }
      
      tags[tag].count++;
      
      // Track files for this tag
      if (!tags[tag].files[filename]) {
        tags[tag].files[filename] = [];
      }
      tags[tag].files[filename].push(parseInt(lineNum));
      
      // Update file statistics
      if (!files[filename]) {
        files[filename] = {
          totalAnchors: 0,
          tags: {},
          lines: []
        };
      }
      
      files[filename].totalAnchors++;
      files[filename].tags[tag] = (files[filename].tags[tag] || 0) + 1;
      files[filename].lines.push(parseInt(lineNum));
    });
    
    // Sort lines in each file
    Object.values(files).forEach(file => {
      file.lines.sort((a, b) => a - b);
    });
    
    // Sort lines in each tag's files
    Object.values(tags).forEach(tag => {
      Object.values(tag.files).forEach(lines => {
        lines.sort((a, b) => a - b);
      });
    });
    
    return {
      tags,
      files,
      totalAnchors: lines.length,
      anchor
    };
    
  } catch (error) {
    if (error.status === 1) {
      // No matches found
      return { tags: {}, files: {}, totalAnchors: 0, anchor };
    }
    throw error;
  }
}

function generateReport(data) {
  const { tags, files, totalAnchors, anchor } = data;
  
  // Sort tags by count (descending)
  const sortedTags = Object.entries(tags)
    .sort(([, a], [, b]) => b.count - a.count);
  
  // Sort files by anchor count (descending)
  const sortedFiles = Object.entries(files)
    .sort(([, a], [, b]) => b.totalAnchors - a.totalAnchors);
  
  const report = {
    _comment: ":ga:meta Generated grep-anchor inventory - DO NOT EDIT MANUALLY",
    generated: new Date().toISOString(),
    anchor: anchor,
    summary: {
      totalAnchors,
      uniqueTags: Object.keys(tags).length,
      filesWithAnchors: Object.keys(files).length
    },
    tags: Object.fromEntries(sortedTags),
    files: Object.fromEntries(sortedFiles),
    topTags: sortedTags.slice(0, 10).map(([tag, data]) => ({
      tag,
      count: data.count,
      fileCount: Object.keys(data.files).length
    })),
    topFiles: sortedFiles.slice(0, 10).map(([file, data]) => ({
      file,
      anchors: data.totalAnchors,
      uniqueTags: Object.keys(data.tags).length
    }))
  };
  
  return report;
}

// Main execution
function main() {
  console.log('🔍 Searching for grep-anchors...');
  
  try {
    // Load configuration
    let config = loadConfig();
    
    // Parse command line arguments
    const args = parseArgs(config);
    
    // Load custom config if specified
    if (args.configPath) {
      if (existsSync(args.configPath)) {
        try {
          const content = readFileSync(args.configPath, 'utf8');
          config = JSON.parse(content);
        } catch (e) {
          console.error(`❌ Error loading custom config: ${e.message}`);
          exit(1);
        }
      }
    }
    
    // Override config with command line args
    const ignoreExamples = args.ignoreExamples || (config.docsExamples?.ignore || false);
    
    const data = findGrepAnchors(args.anchor, args.ignorePatterns, ignoreExamples, config);
    const report = generateReport(data);
    
    // Get output file from config or use default
    const outputConfig = config.output || {};
    const outputFile = join(process.cwd(), outputConfig.file || '.grepa/inventory.generated.json');
    const indent = outputConfig.indent || 2;
    
    // Ensure output directory exists
    const outputDir = dirname(outputFile);
    execSync(`mkdir -p "${outputDir}"`, { stdio: 'ignore' });
    
    // Write JSONC file with pretty printing
    const jsonContent = JSON.stringify(report, null, indent);
    writeFileSync(outputFile, jsonContent);
    
    // Gather all active patterns for display
    const allActivePatterns = [];
    const ignoreConfig = config.ignore || {};
    const patternDefs = ignoreConfig.patterns || {};
    
    // Add active named patterns
    for (const [patternName, patternDef] of Object.entries(patternDefs)) {
      if (patternDef.active) {
        allActivePatterns.push(patternName);
      }
    }
    
    // Add custom patterns
    allActivePatterns.push(...(ignoreConfig.custom || []));
    allActivePatterns.push(...args.ignorePatterns);
    
    // Print summary
    const displayConfig = config.display || {};
    if (displayConfig.showSummary !== false) {
      console.log(`\n✅ Grep-anchor inventory generated!`);
      console.log(`📍 Anchor pattern: ${args.anchor}`);
      if (config.ignore?.respectGitignore) {
        console.log(`📁 Respecting .gitignore patterns`);
      }
      if (allActivePatterns.length > 0) {
        console.log(`🚫 Ignored patterns: ${allActivePatterns.join(', ')}`);
      }
      if (ignoreExamples) {
        console.log(`🚫 Ignored code examples`);
      }
      console.log(`📊 Found ${report.summary.totalAnchors} anchors across ${report.summary.filesWithAnchors} files`);
      console.log(`🏷️  Discovered ${report.summary.uniqueTags} unique tags`);
      console.log(`📄 Inventory saved to: ${outputFile}`);
    
      if (report.topTags.length > 0) {
        const topCount = displayConfig.topTagsCount || 5;
        console.log(`\n🔝 Top ${topCount} tags:`);
        report.topTags.slice(0, topCount).forEach(({ tag, count, fileCount }) => {
          console.log(`   ${tag}: ${count} uses in ${fileCount} file(s)`);
        });
      }
    }
    
  } catch (error) {
    if (error.code === 'ENOENT' && error.message.includes('rg')) {
      console.error('❌ Error: ripgrep (rg) is not installed or not in PATH');
      console.error('   Install it from: https://github.com/BurntSushi/ripgrep');
      process.exit(1);
    }
    
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 