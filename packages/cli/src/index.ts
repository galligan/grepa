// ::: tldr Main CLI implementation using Commander.js
import { Command } from 'commander';
import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';
import { 
  WaymarkParser, 
  WaymarkSearch,
  WaymarkLinter, 
  success, 
  failure, 
  makeError, 
  humanise, 
  parseCommandOptionsSchema, 
  searchCommandOptionsSchema, 
  listCommandOptionsSchema, 
  fromZod,
  filePathSchema
} from '@waymark/core';
import type { Result, AppError } from '@waymark/core';
import { FormatterFactory } from '@waymark/formatters';

// ::: sec rate limiting configuration
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Command Line Interface for Waymark parsing and search tool.
 * 
 * Features:
 * - Parse files for waymarks with comprehensive validation
 * - Search for specific anchors across multiple files and patterns
 * - List all anchors with filtering and formatting options
 * - Advanced security: path validation, content scanning, rate limiting
 * - Multiple output formats: terminal, JSON, CSV
 * - Large file support with streaming
 * 
 * @example
 * ```typescript
 * const cli = new CLI();
 * await cli.run();
 * ```
 */
export class CLI {
  private program: Command;
  private rateLimiter: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly rateLimit: RateLimitConfig = {
    maxRequests: 100, // Max 100 operations per window
    windowMs: 60000   // 1 minute window
  };

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  // ::: api configure CLI commands and options
  private setupCommands(): void {
    this.program
      .name('waymark')
      .description('Waymark parser and search tool')
      .version('0.2.0');

    // ::: api parse command to analyze files for waymarks
    this.program
      .command('parse')
      .description('Parse file(s) for waymarks')
      .argument('<files...>', 'Files to parse')
      .option('-j, --json', 'Output as JSON')
      .option('-v, --verbose', 'Show parsing errors')
      .option('-f, --format <format>', 'Output format (terminal, json, csv)', 'terminal')
      .action(async (files: string[], options) => {
        const result = await this.parseCommand(files, options);
        this.handleCommandResult(result);
      });

    // ::: api search command to find specific waymarks
    this.program
      .command('search')
      .description('Search for waymarks by context')
      .argument('<context>', 'Context to search for')
      .argument('[patterns...]', 'File patterns to search (default: current directory)')
      .option('-j, --json', 'Output as JSON')
      .option('-c, --context-lines <lines>', 'Show context lines', '0')
      .option('-f, --format <format>', 'Output format (terminal, json, csv)', 'terminal')
      .option('--no-gitignore', 'Do not respect .gitignore files')
      .option('--exclude <patterns...>', 'Patterns to exclude')
      .action(async (context: string, patterns: string[], options) => {
        const result = await this.searchCommand(context, patterns, options);
        this.handleCommandResult(result);
      });

    // ::: api list command to show all waymarks
    this.program
      .command('list')
      .description('List all waymarks in file(s)')
      .argument('[patterns...]', 'File patterns to analyze (default: current directory)')
      .option('-j, --json', 'Output as JSON')
      .option('-c, --contexts', 'Show only contexts')
      .option('-f, --format <format>', 'Output format (terminal, json, csv)', 'terminal')
      .option('--no-gitignore', 'Do not respect .gitignore files')
      .option('--exclude <patterns...>', 'Patterns to exclude')
      .action(async (patterns: string[], options) => {
        const result = await this.listCommand(patterns, options);
        this.handleCommandResult(result);
      });

    // ::: api lint command to validate and migrate waymark syntax
    this.program
      .command('lint')
      .description('Lint files for waymark syntax issues')
      .argument('[patterns...]', 'File patterns to lint (default: current directory)')
      .option('-f, --fix', 'Auto-fix issues (migrate old syntax to v1.0)')
      .option('--no-gitignore', 'Do not respect .gitignore files')
      .option('--exclude <patterns...>', 'Patterns to exclude')
      .action(async (patterns: string[], options) => {
        const result = await this.lintCommand(patterns, options);
        this.handleCommandResult(result);
      });
  }

  // ::: api main CLI entry point
  async run(): Promise<void> {
    try {
      await this.program.parseAsync();
    } catch (error) {
      const appError = makeError(
        'cli.invalidCommand',
        error instanceof Error ? error.message : 'Invalid command',
        error
      );
      this.handleCommandResult(failure(appError));
    }
  }

  // ::: api handle command result with proper error display
  private handleCommandResult<T>(result: Result<T>): void {
    if (!result.ok) {
      console.error(chalk.red(`Error: ${humanise(result.error)}`));
      if (process.env['DEBUG'] === 'true') {
        console.error(chalk.gray('Debug info:'), result.error);
      }
      process.exit(1);
    }
  }

  /**
   * Checks rate limit for CLI operations to prevent abuse.
   * 
   * @param operation - The operation type (parse, search, list)
   * @returns Result indicating if operation is within rate limits
   * 
   * @example
   * ```typescript
   * const result = this.checkRateLimit('search');
   * if (!result.ok) {
   *   console.error('Rate limit exceeded');
   * }
   * ```
   */
  // ::: sec check rate limit for operations
  private checkRateLimit(operation: string): Result<void> {
    const now = Date.now();
    const key = `${operation}-${process.cwd()}`;
    
    const limit = this.rateLimiter.get(key);
    if (limit) {
      if (now < limit.resetTime) {
        if (limit.count >= this.rateLimit.maxRequests) {
          return failure(makeError(
            'security.rateLimitExceeded',
            `Rate limit exceeded for ${operation}. Please wait ${Math.ceil((limit.resetTime - now) / 1000)} seconds.`
          ));
        }
        limit.count++;
      } else {
        // Reset the window
        this.rateLimiter.set(key, { count: 1, resetTime: now + this.rateLimit.windowMs });
      }
    } else {
      this.rateLimiter.set(key, { count: 1, resetTime: now + this.rateLimit.windowMs });
    }
    
    return success(undefined);
  }

  /**
   * Validates file paths for security vulnerabilities including:
   * - Directory traversal attacks (../../../etc/passwd)
   * - Symlink attacks that escape working directory
   * - Invalid file path formats
   * 
   * @param files - Array of file paths to validate
   * @returns Promise resolving to validated file paths or security error
   * 
   * @security This method prevents access outside the working directory
   * @example
   * ```typescript
   * const result = await this.validateFilePaths(['./src/file.ts', '/etc/passwd']);
   * // Returns error for /etc/passwd (outside working directory)
   * ```
   */
  // ::: api validate file paths for security
  private async validateFilePaths(files: string[]): Promise<Result<string[]>> {
    const validatedPaths: string[] = [];
    const cwd = process.cwd();
    
    for (const file of files) {
      // ::: sec validate file path format
      const validation = filePathSchema.safeParse(file);
      if (!validation.success) {
        return failure(makeError(
          'file.invalidPath',
          `Invalid file path: ${file}`
        ));
      }
      
      // ::: sec prevent directory traversal attacks
      const absolutePath = isAbsolute(file) ? file : resolve(cwd, file);
      const normalizedPath = resolve(absolutePath);
      
      // ::: critical remove the vulnerability that allowed any absolute path starting with '/'
      // Only allow paths within the current working directory
      // ::: sec handle Windows case-insensitive drive letters
      const withinCwd = process.platform === 'win32'
        ? normalizedPath.toLowerCase().startsWith(cwd.toLowerCase())
        : normalizedPath.startsWith(cwd);
        
      if (!withinCwd) {
        return failure(makeError(
          'file.accessDenied',
          `Access denied: ${file} is outside the working directory`
        ));
      }
      
      // ::: sec resolve symlinks to prevent bypass attacks
      try {
        // Check if file exists before trying to resolve real path
        if (existsSync(normalizedPath)) {
          const { realpath } = await import('fs/promises');
          const realPath = await realpath(normalizedPath);
          
          // Verify the real path is also within bounds
          const realPathWithinCwd = process.platform === 'win32'
            ? realPath.toLowerCase().startsWith(cwd.toLowerCase())
            : realPath.startsWith(cwd);
            
          if (!realPathWithinCwd) {
            return failure(makeError(
              'file.accessDenied',
              `Access denied: ${file} resolves to a path outside the working directory`
            ));
          }
        }
      } catch (error) {
        // File doesn't exist yet, which is OK for write operations
        // The normalized path check above is sufficient
      }
      
      validatedPaths.push(file);
    }
    
    return success(validatedPaths);
  }

  // ::: sec validate file content for security threats
  private validateFileContent(content: string, filename: string): Result<void> {
    // ::: sec check for null bytes (common attack vector)
    if (content.includes('\0')) {
      return failure(makeError(
        'security.maliciousContent',
        `File ${filename} contains null bytes, which may indicate malicious content`
      ));
    }

    // ::: sec check for excessive file size in memory
    const contentSize = Buffer.byteLength(content, 'utf8');
    if (contentSize > 50 * 1024 * 1024) { // 50MB limit for in-memory processing
      return failure(makeError(
        'security.contentTooLarge',
        `File ${filename} content is too large for safe processing (${Math.round(contentSize / 1024 / 1024)}MB)`
      ));
    }

    // ::: sec check for suspicious patterns (no global flag to avoid state issues)
    const suspiciousPatterns = [
      /eval\s*\(/i,                    // eval() calls
      /Function\s*\(/i,                // Function constructor
      /<script[\s>]/i,                 // Script tags
      /javascript:/i,                  // JavaScript protocol
      /on\w+\s*=/i,                   // Event handlers
      /\bexec\s*\(/i,                 // exec() calls
      /require\s*\(\s*['"`][^'"]+['"`]\s*\)\s*\(/i  // Dynamic require
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        // ::: ctx log suspicious content for audit
        if (process.env['WAYMARK_SECURITY_LOG'] === 'true') {
          console.warn(chalk.yellow(`Security warning: Suspicious pattern detected in ${filename}`));
        }
        // Don't block, just warn - the user might be legitimately searching security code
      }
    }

    return success(undefined);
  }

  // ::: api handle parse command with Result pattern
  private async parseCommand(
    files: string[],
    options: unknown
  ): Promise<Result<void>> {
    // ::: sec check rate limit
    const rateLimitCheck = this.checkRateLimit('parse');
    if (!rateLimitCheck.ok) {
      return rateLimitCheck;
    }

    // ::: ctx validate options
    const optionsValidation = parseCommandOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    const validOptions = optionsValidation.data;

    // ::: ctx validate file paths
    const pathValidation = await this.validateFilePaths(files);
    if (!pathValidation.ok) {
      return pathValidation;
    }

    const formatter = FormatterFactory.create(validOptions.format || 'terminal');
    const results: Array<{ file: string; anchors: any[]; errors: any[] }> = [];
    const errors: AppError[] = [];

    for (const file of pathValidation.data) {
      if (!existsSync(file)) {
        errors.push(makeError('file.notFound', `File not found: ${file}`));
        continue;
      }

      try {
        // ::: ctx use async file reading
        const content = await readFile(file, 'utf-8');
        
        // ::: sec validate content before processing
        const contentValidation = this.validateFileContent(content, file);
        if (!contentValidation.ok) {
          errors.push(contentValidation.error);
          continue;
        }
        
        const parseResult = WaymarkParser.parseWithResult(content, file);

        if (!parseResult.ok) {
          errors.push(parseResult.error);
          continue;
        }

        if (validOptions.format === 'json' || validOptions.json) {
          results.push({ file, ...parseResult.data });
        } else {
          const output = formatter.format({
            type: 'parse',
            data: { file, result: parseResult.data }
          });
          console.log(output);
        }
      } catch (error) {
        errors.push(makeError(
          'file.readError',
          `Cannot read file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`
        ));
      }
    }

    if (validOptions.format === 'json' || validOptions.json) {
      console.log(JSON.stringify(results, null, 2));
    }

    if (errors.length > 0 && validOptions.verbose) {
      errors.forEach(error => {
        console.error(chalk.red(`${error.code}: ${error.message}`));
      });
      return failure(errors[0]!);
    }

    return success(undefined);
  }

  // ::: api handle search command with Result pattern
  private async searchCommand(
    context: string,
    patterns: string[],
    options: Record<string, unknown>
  ): Promise<Result<void>> {
    // ::: sec check rate limit
    const rateLimitCheck = this.checkRateLimit('search');
    if (!rateLimitCheck.ok) {
      return rateLimitCheck;
    }

    // ::: ctx validate options
    const optionsValidation = searchCommandOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    const validOptions = optionsValidation.data;
    
    // ::: ctx validate marker
    if (!context || context.trim().length === 0) {
      return failure(makeError(
        'cli.missingArgument',
        'Marker cannot be empty'
      ));
    }

    // ::: ctx use current directory if no patterns specified
    const searchPatterns = patterns.length > 0 ? patterns : ['./**/*'];
    
    const searchOptions = {
      contexts: [context],
      context: (() => {
        const parsed = parseInt(validOptions.contextLines ?? '0', 10);
        return isNaN(parsed) || parsed < 0 ? 0 : parsed;
      })(),
      respectGitignore: validOptions.gitignore !== false,
      exclude: (options['exclude'] as string[] | undefined) || []
    };

    // ::: ctx use new async search method
    const searchResult = await WaymarkSearch.search(searchPatterns, searchOptions);
    if (!searchResult.ok) {
      return searchResult;
    }

    const formatter = FormatterFactory.create(
      validOptions.format
        ? validOptions.format
        : options['json']
          ? 'json'
          : 'terminal'
    );
    const output = formatter.format({
      type: 'search',
      data: searchResult.data
    });
    console.log(output);

    return success(undefined);
  }

  // ::: api handle list command with Result pattern
  private async listCommand(
    patterns: string[],
    options: Record<string, unknown>
  ): Promise<Result<void>> {
    // ::: sec check rate limit
    const rateLimitCheck = this.checkRateLimit('list');
    if (!rateLimitCheck.ok) {
      return rateLimitCheck;
    }

    // ::: ctx validate options
    const optionsValidation = listCommandOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    const validOptions = optionsValidation.data;

    // ::: ctx use current directory if no patterns specified
    const searchPatterns = patterns.length > 0 ? patterns : ['./**/*'];

    // ::: ctx search for all waymarks
    const searchResult = await WaymarkSearch.search(searchPatterns, {
      respectGitignore: validOptions.gitignore !== false,
      exclude: (options['exclude'] as string[] | undefined) || []
    });

    if (!searchResult.ok) {
      return searchResult;
    }

    const formatter = FormatterFactory.create(
      validOptions.format
        ? validOptions.format
        : options['json']
          ? 'json'
          : 'terminal'
    );
    
    if (validOptions.contexts) {
      // ::: ctx show only unique markers
      const uniqueContexts = WaymarkSearch.getUniqueContexts(searchResult.data);
      const output = formatter.format({
        type: 'contexts',
        data: uniqueContexts
      });
      console.log(output);
    } else {
      const output = formatter.format({
        type: 'list',
        data: searchResult.data
      });
      console.log(output);
    }

    return success(undefined);
  }

  // ::: api handle lint command with Result pattern
  private async lintCommand(
    patterns: string[],
    options: Record<string, unknown>
  ): Promise<Result<void>> {
    // ::: sec check rate limit
    const rateLimitCheck = this.checkRateLimit('lint');
    if (!rateLimitCheck.ok) {
      return rateLimitCheck;
    }

    // ::: ctx use current directory if no patterns specified
    const searchPatterns = patterns.length > 0 ? patterns : ['./**/*'];

    // ::: ctx resolve files to lint
    const searchOptions = {
      respectGitignore: options['gitignore'] !== false,
      exclude: (options['exclude'] as string[] | undefined) || []
    };

    // ::: ctx use globby to resolve files
    const { globby } = await import('globby');
    const globOptions = {
      absolute: true,
      onlyFiles: true,
      dot: false,
      gitignore: searchOptions.respectGitignore !== false,
      ignore: [
        '**/node_modules/**',
        '**/.git/**',
        ...(searchOptions.exclude || [])
      ]
    };

    const files = await globby(searchPatterns, globOptions);
    const filteredFiles = files.filter((file: string) => {
      const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
      return ['.ts', '.js', '.jsx', '.tsx', '.md', '.txt', '.py', '.java', '.c', '.cpp', '.h', '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.scala'].includes(ext);
    });

    if (filteredFiles.length === 0) {
      return failure(makeError(
        'search.noResults',
        'No files found matching the specified patterns'
      ));
    }

    const filesResult = { ok: true as const, data: filteredFiles };

    let totalIssues = 0;
    let totalFixed = 0;
    let filesWithIssues = 0;

    // ::: ctx lint each file
    for (const file of filesResult.data) {
      const lintResult = await WaymarkLinter.lintFile(file, options['fix'] === true);
      
      if (!lintResult.ok) {
        console.error(chalk.red(`Error linting ${file}: ${lintResult.error.message}`));
        continue;
      }

      if (lintResult.data.issues.length > 0) {
        filesWithIssues++;
        totalIssues += lintResult.data.issues.length;
        
        if (lintResult.data.fixedCount) {
          totalFixed += lintResult.data.fixedCount;
        }

        // ::: ctx display issues
        console.log(chalk.bold(`\n${file}:`));
        for (const issue of lintResult.data.issues) {
          const color = issue.type === 'error' ? chalk.red : issue.type === 'warning' ? chalk.yellow : chalk.blue;
          console.log(`  ${color(`${issue.line}:${issue.column}`)} ${issue.message}`);
          if (issue.fix && !options['fix']) {
            console.log(chalk.gray(`    Suggested fix: Replace "${issue.fix.old}" with "${issue.fix.new}"`));
          }
        }
      }
    }

    // ::: ctx display summary
    console.log(chalk.bold(`\n✨ Lint Summary:`));
    console.log(`Files checked: ${filesResult.data.length}`);
    console.log(`Files with issues: ${filesWithIssues}`);
    console.log(`Total issues: ${totalIssues}`);
    
    if (options['fix'] && totalFixed > 0) {
      console.log(chalk.green(`Fixed: ${totalFixed} issues`));
    } else if (totalIssues > 0 && !options['fix']) {
      console.log(chalk.yellow(`\nTip: Use --fix to automatically fix ${totalIssues} issues`));
    }

    if (totalIssues > 0 && totalFixed < totalIssues) {
      return failure(makeError(
        'lint.hasIssues',
        `Found ${totalIssues - totalFixed} unresolved issues`
      ));
    }

    return success(undefined);
  }
}