#!/usr/bin/env python3

# :ga:meta inventory script - discovers all grep-anchors in your codebase

import json
import subprocess
import sys
import re
import argparse
from datetime import datetime
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple, Any, Optional

# Configuration
DEFAULT_ANCHOR = ':ga:'
CONFIG_FILE = Path.cwd() / '.grepa' / 'inventory.config.json'
OUTPUT_FILE = Path.cwd() / '.grepa' / 'inventory.generated.json'

# Precompiled regex patterns for performance
INLINE_CODE_PATTERN = re.compile(r'(?<!`)`(?!``)[^`]+`(?!`)')
LINK_PATTERN = re.compile(r'\[([^\]]+)\]\([^\)]+\)')
BLOCKQUOTE_PATTERN = re.compile(r'^\s*>')
HEADING_PATTERN = re.compile(r'^#{1,6}\s+')


def load_config() -> Dict[str, Any]:
    """Load configuration from inventory.config.json if it exists."""
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f'⚠️  Warning: Could not load config file: {e}')
    return {}


def is_in_markdown_construct(filename: str, line_num: int, anchor_match: str, config: Dict[str, Any], file_cache: Dict[str, List[str]] = None) -> bool:
    """Check if a match is inside various markdown constructs that should be ignored."""
    # Only check markdown files
    if not filename.endswith(('.md', '.markdown', '.mdx')):
        return False
    
    try:
        # Use cached file contents if available
        if file_cache is not None and filename in file_cache:
            lines = file_cache[filename]
        else:
            with open(filename, 'r') as f:
                lines = f.readlines()
                if file_cache is not None:
                    file_cache[filename] = lines
        
        if line_num > len(lines):
            return False
            
        current_line = lines[line_num - 1]
        docs_examples_config = config.get('docsExamples', {})
        
        # Get include/exclude lists
        include_list = docs_examples_config.get('include', [])
        exclude_list = docs_examples_config.get('exclude', [])
        
        # Check code fences (```)
        if 'codeFences' in exclude_list:
            in_code_fence = False
            for i, line in enumerate(lines[:line_num], 1):
                if line.strip().startswith('```'):
                    in_code_fence = not in_code_fence
            if in_code_fence:
                return True
        
        # Check code blocks (4-space indentation)
        if 'codeBlocks' in exclude_list:
            if current_line.startswith('    ') and anchor_match in current_line:
                return True
        
        # Check headings (lines starting with #)
        if 'headings' in exclude_list:
            if HEADING_PATTERN.match(current_line):
                return True
        
        # Check inline code (text between backticks)
        if 'inlineCode' in exclude_list:
            anchor_pos = current_line.find(anchor_match)
            if anchor_pos != -1:  # Only check if anchor is found
                for match in INLINE_CODE_PATTERN.finditer(current_line):
                    if match.start() <= anchor_pos <= match.end():
                        return True
        
        # Check links [text](url)
        if 'links' in exclude_list:
            anchor_pos = current_line.find(anchor_match)
            if anchor_pos != -1:  # Only check if anchor is found
                for match in LINK_PATTERN.finditer(current_line):
                    if match.start() <= anchor_pos <= match.end():
                        return True
        
        # Check blockquotes (lines starting with >)
        if 'blockquotes' in exclude_list:
            if BLOCKQUOTE_PATTERN.match(current_line):
                return True
        
        # Check HTML comments (only if NOT in include list)
        if 'htmlComments' not in include_list:
            # Check if we're inside an HTML comment
            full_text = ''.join(lines[:line_num])
            in_comment = full_text.count('<!--') > full_text.count('-->')
            if in_comment:
                return True
            # Also check if the current line has a comment
            if '<!--' in current_line and anchor_match in current_line:
                comment_start = current_line.find('<!--')
                anchor_pos = current_line.find(anchor_match)
                comment_end = current_line.find('-->', comment_start)
                if comment_end == -1:  # Comment continues on next line
                    if anchor_pos > comment_start:
                        return True
                elif comment_start < anchor_pos < comment_end:
                    return True
        
        # Check front matter (only if NOT in include list)
        if 'frontMatter' not in include_list:
            if line_num == 1:
                return False
            # Check if we're in front matter
            if lines[0].strip() in ['---', '+++']:
                delimiter = lines[0].strip()
                for i, line in enumerate(lines[1:line_num], 2):
                    if line.strip() == delimiter:
                        return False  # We passed the end of front matter
                return True  # Still in front matter
        
        return False
    except:
        # If we can't read the file, assume it's not in a special construct
        return False


def resolve_ignore_patterns(patterns: List[str], config: Dict[str, Any]) -> List[str]:
    """Resolve ignore patterns from aliases and custom patterns."""
    globs = []
    ignore_config = config.get('ignore', {})
    pattern_defs = ignore_config.get('patterns', {})
    
    for pattern in patterns:
        if pattern in pattern_defs:
            # It's a predefined pattern alias
            globs.extend(pattern_defs[pattern].get('globs', []))
        else:
            # It's a custom pattern
            globs.append(pattern)
    
    return globs


def find_grep_anchors(anchor: str = DEFAULT_ANCHOR, ignore_patterns: List[str] = None, 
                     ignore_examples: bool = False, config: Dict[str, Any] = None) -> Dict[str, Any]:
    """Find all grep-anchors in the codebase using ripgrep."""
    try:
        # Run ripgrep to find all anchors
        # -n: line numbers, -o: only matching, --no-heading: compact format
        # Always exclude .git directory
        cmd = ['rg', '-n', '-o', f'{anchor}[^\\s]*', '--no-heading', '-g', '!.git/']
        
        # Check if we should respect gitignore
        if config:
            ignore_config = config.get('ignore', {})
            if ignore_config.get('respectGitignore', False):
                # Check if .gitignore exists
                gitignore_path = Path.cwd() / '.gitignore'
                if gitignore_path.exists():
                    # Add --no-ignore-vcs to override ripgrep's default behavior
                    # Then explicitly add .gitignore patterns
                    cmd.append('--ignore-file')
                    cmd.append(str(gitignore_path))
                else:
                    # If no .gitignore, use ripgrep's default VCS ignore
                    pass  # ripgrep respects .gitignore by default
            else:
                # Explicitly disable gitignore
                cmd.append('--no-ignore-vcs')
        else:
            # Default behavior - disable gitignore
            cmd.append('--no-ignore-vcs')
        
        # Resolve ignore patterns from config and command line
        all_patterns = []
        
        # Add active patterns from config file
        if config:
            ignore_config = config.get('ignore', {})
            pattern_defs = ignore_config.get('patterns', {})
            
            # Add active named patterns
            for pattern_name, pattern_def in pattern_defs.items():
                if pattern_def.get('active', False):
                    all_patterns.append(pattern_name)
            
            # Add custom patterns
            custom_patterns = ignore_config.get('custom', [])
            all_patterns.extend(custom_patterns)
        
        # Add patterns from command line (override config)
        if ignore_patterns:
            all_patterns.extend(ignore_patterns)
        
        # Resolve all patterns to globs
        if all_patterns:
            globs = resolve_ignore_patterns(all_patterns, config or {})
            for glob in globs:
                cmd.extend(['-g', f'!{glob}'])
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 1:
            # No matches found
            return {'tags': {}, 'files': {}, 'totalAnchors': 0, 'anchor': anchor}
        elif result.returncode != 0:
            # Other error
            raise subprocess.CalledProcessError(result.returncode, cmd, result.stderr)
        
        output = result.stdout.strip()
        if not output:
            return {'tags': {}, 'files': {}, 'totalAnchors': 0, 'anchor': anchor}
        
        lines = output.split('\n')
        tags = defaultdict(lambda: {
            'count': 0,
            'files': defaultdict(list),
            'firstSeen': None
        })
        files = defaultdict(lambda: {
            'totalAnchors': 0,
            'tags': defaultdict(int),
            'lines': []
        })
        
        # Compile regex for tag extraction
        tag_pattern = re.compile(f'{re.escape(anchor)}([^\\s,\\]\\}}]+)')
        
        # Create file cache for markdown construct detection
        file_cache = {}
        
        for line in lines:
            # Parse format: filename:line:match
            match = re.match(r'^(.+?):(\d+):(.+)$', line)
            if not match:
                continue
            
            filename, line_num, full_match = match.groups()
            line_num = int(line_num)
            
            # Skip if we're ignoring examples and this is in a markdown construct
            if ignore_examples and is_in_markdown_construct(filename, line_num, full_match, config or {}, file_cache):
                continue
            
            # Extract the tag from the full match
            tag_match = tag_pattern.match(full_match)
            if not tag_match:
                continue
            
            tag = tag_match.group(1)
            
            # Update tag statistics
            tags[tag]['count'] += 1
            tags[tag]['files'][filename].append(line_num)
            
            if tags[tag]['firstSeen'] is None:
                tags[tag]['firstSeen'] = {'file': filename, 'line': line_num}
            
            # Update file statistics
            files[filename]['totalAnchors'] += 1
            files[filename]['tags'][tag] += 1
            files[filename]['lines'].append(line_num)
        
        # Convert defaultdicts to regular dicts and sort lines
        tags_dict = {}
        for tag, data in tags.items():
            tags_dict[tag] = {
                'count': data['count'],
                'files': {f: sorted(lines) for f, lines in data['files'].items()},
                'firstSeen': data['firstSeen']
            }
        
        files_dict = {}
        for filename, data in files.items():
            files_dict[filename] = {
                'totalAnchors': data['totalAnchors'],
                'tags': dict(data['tags']),
                'lines': sorted(data['lines'])
            }
        
        return {
            'tags': tags_dict,
            'files': files_dict,
            'totalAnchors': len(lines),
            'anchor': anchor
        }
        
    except FileNotFoundError:
        print('❌ Error: ripgrep (rg) is not installed or not in PATH')
        print('   Install it from: https://github.com/BurntSushi/ripgrep')
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f'❌ Error running ripgrep: {e.stderr}')
        sys.exit(1)


def generate_report(data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a comprehensive report from the anchor data."""
    tags = data['tags']
    files = data['files']
    total_anchors = data['totalAnchors']
    anchor = data['anchor']
    
    # Sort tags by count (descending)
    sorted_tags = sorted(tags.items(), key=lambda x: x[1]['count'], reverse=True)
    
    # Sort files by anchor count (descending)
    sorted_files = sorted(files.items(), key=lambda x: x[1]['totalAnchors'], reverse=True)
    
    report = {
        '_comment': ':ga:meta Generated grep-anchor inventory - DO NOT EDIT MANUALLY',
        'generated': datetime.now().isoformat(),
        'anchor': anchor,
        'summary': {
            'totalAnchors': total_anchors,
            'uniqueTags': len(tags),
            'filesWithAnchors': len(files)
        },
        'tags': dict(sorted_tags),
        'files': dict(sorted_files),
        'topTags': [
            {
                'tag': tag,
                'count': data['count'],
                'fileCount': len(data['files'])
            }
            for tag, data in sorted_tags[:10]
        ],
        'topFiles': [
            {
                'file': filename,
                'anchors': data['totalAnchors'],
                'uniqueTags': len(data['tags'])
            }
            for filename, data in sorted_files[:10]
        ]
    }
    
    return report


def main():
    """Main execution function."""
    # Load configuration
    config = load_config()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Generate inventory of all grep-anchors in your codebase')
    parser.add_argument('anchor', nargs='?', default=config.get('anchor', DEFAULT_ANCHOR), 
                        help=f'Custom anchor pattern (default: {config.get("anchor", DEFAULT_ANCHOR)})')
    parser.add_argument('--ignore', action='append', dest='ignore_patterns',
                        help='Patterns to ignore (e.g., "md", "*.txt", "docs" for all documentation)')
    parser.add_argument('--ignore-examples', action='store_true',
                        help='Ignore grep-anchors inside code blocks and code fences')
    parser.add_argument('--no-gitignore', action='store_true',
                        help='Do not respect .gitignore patterns')
    parser.add_argument('--config', type=str, help='Path to custom config file')
    
    args = parser.parse_args()
    
    # Load custom config if specified
    if args.config:
        custom_config_path = Path(args.config)
        if custom_config_path.exists():
            try:
                with open(custom_config_path, 'r') as f:
                    config = json.load(f)
            except Exception as e:
                print(f'❌ Error loading custom config: {e}')
                sys.exit(1)
    
    # Override config with command line args
    ignore_examples = args.ignore_examples or config.get('docsExamples', {}).get('ignore', False)
    
    # Handle gitignore override
    if args.no_gitignore:
        config.setdefault('ignore', {})['respectGitignore'] = False
    
    print('🔍 Searching for grep-anchors...')
    
    data = find_grep_anchors(args.anchor, args.ignore_patterns, ignore_examples, config)
    report = generate_report(data)
    
    # Get output file from config or use default
    output_config = config.get('output', {})
    output_file = Path.cwd() / output_config.get('file', '.grepa/inventory.generated.json')
    indent = output_config.get('indent', 2)
    
    # Ensure output directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Write JSONC file with pretty printing
    with open(output_file, 'w') as f:
        json.dump(report, f, indent=indent)
    
    # Gather all active patterns for display
    all_active_patterns = []
    if config:
        ignore_config = config.get('ignore', {})
        pattern_defs = ignore_config.get('patterns', {})
        
        # Add active named patterns
        for pattern_name, pattern_def in pattern_defs.items():
            if pattern_def.get('active', False):
                all_active_patterns.append(pattern_name)
        
        # Add custom patterns
        all_active_patterns.extend(ignore_config.get('custom', []))
    if args.ignore_patterns:
        all_active_patterns.extend(args.ignore_patterns)
    
    # Print summary
    display_config = config.get('display', {})
    if display_config.get('showSummary', True):
        print(f'\n✅ Grep-anchor inventory generated!')
        print(f'📍 Anchor pattern: {args.anchor}')
        if config.get('ignore', {}).get('respectGitignore', False):
            print(f'📁 Respecting .gitignore patterns')
        if all_active_patterns:
            print(f'🚫 Ignored patterns: {", ".join(all_active_patterns)}')
        if ignore_examples:
            print(f'🚫 Ignored code examples')
        print(f'📊 Found {report["summary"]["totalAnchors"]} anchors across {report["summary"]["filesWithAnchors"]} files')
        print(f'🏷️  Discovered {report["summary"]["uniqueTags"]} unique tags')
        print(f'📄 Inventory saved to: {output_file}')
    
    if report['topTags'] and display_config.get('showSummary', True):
        top_count = display_config.get('topTagsCount', 5)
        print(f'\n🔝 Top {top_count} tags:')
        for item in report['topTags'][:top_count]:
            print(f'   {item["tag"]}: {item["count"]} uses in {item["fileCount"]} file(s)')


if __name__ == '__main__':
    main() 