# Waymark CLI Reference
<!-- tldr ::: Command-line interface documentation for waymark -->

The waymark CLI provides commands for searching and managing waymarks in your codebase.

## Installation
<!-- fix ::: @claude this should actually just be `npm install -g waymark` -->
```bash
# Global installation
npm install -g @waymark/cli

# Or use directly with npx
npx @waymark/cli

# Or in a project
pnpm add -D @waymark/cli
```

## Commands

### `waymark search [patterns...]`

Search for waymarks in files matching the given patterns.
<!-- fix ::: @claude we are using `find` now. See `search-patterns.md` -->
```bash
# Search all JavaScript files
waymark search "src/**/*.js"

# Search for specific contexts
waymark search "src/" --contexts todo,fix

# Search with context lines
waymark search "lib/" --context 3

# Output as JSON
waymark search "src/" --format json
```

**Options:**
- `--contexts <items>` - Filter by specific contexts (comma-separated)
- `--context <number>` - Number of context lines to show (default: 0)
- `--format <format>` - Output format: terminal, json, csv (default: terminal)
- `--no-color` - Disable colored output
- `--recursive` - Search recursively (default: true)

### `waymark parse <file>`

Parse a single file and display all waymarks.

```bash
# Parse a single file
waymark parse src/index.js

# Parse with JSON output
waymark parse src/app.ts --format json

# Show detailed validation
waymark parse config.yml --verbose
```

**Options:**
- `--format <format>` - Output format: terminal, json, csv (default: terminal)
- `--no-color` - Disable colored output
- `--verbose` - Show detailed parsing information

### `waymark list [patterns...]`

List all waymarks in files matching patterns.

```bash
# List all waymarks in src/
waymark list "src/**/*"

# List only todos and bugs
waymark list "src/" --contexts todo,bug

# Group by context
waymark list "src/" --group-by context

# Output as CSV
waymark list "src/" --format csv > waymarks.csv
```

**Options:**
- `--contexts <items>` - Filter by specific contexts
- `--format <format>` - Output format: terminal, json, csv
- `--group-by <field>` - Group results by: context, file
- `--no-color` - Disable colored output

## Output Formats

### Terminal (default)

Human-readable colored output:

```
src/index.js:42:3
  // todo ::: implement error handling
  Contexts: todo
  
src/auth.js:15:5  
  // alert ::: validate token expiry +security
  Contexts: alert
```

### JSON

Machine-readable JSON output:

```json
[
  {
    "file": "src/index.js",
    "line": 42,
    "column": 3,
    "raw": "// todo ::: implement error handling",
    "contexts": ["todo"],
    "prose": "implement error handling"
  }
]
```

### CSV

Spreadsheet-compatible CSV output:

```csv
file,line,column,contexts,prose
src/index.js,42,3,todo,implement error handling
src/auth.js,15,5,sec,validate token expiry
```

## Common Usage Patterns

### Find All TODOs

```bash
waymark search "**/*.{js,ts}" --contexts todo
```

### Security Audit

```bash
waymark search "src/" --contexts sec,security,auth --context 5
```

### Export to Spreadsheet

```bash
waymark list "**/*" --format csv > waymarks-report.csv
```

### AI Task List

```bash
waymark search "src/" --contexts "@agent,@claude,@cursor" --format json
```

### Find High Priority Items

```bash
waymark search "src/" | grep -E "priority:(high|critical)"
```

## Configuration

The CLI respects `.gitignore` patterns by default. To include ignored files:

```bash
waymark search "src/" --no-respect-gitignore
```

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - File not found
- `3` - Parse error
- `4` - No results found

## Examples

### Project-Wide Search

```bash
# Find all waymarks in a project
waymark search "."

# Find waymarks with specific patterns
waymark search "src/" "lib/" "test/"
```

### Integration with Other Tools

```bash
# Count waymarks by type
waymark list "src/" --format json | jq '.[] | .contexts[]' | sort | uniq -c

# Find files with most waymarks
waymark list "src/" --format json | jq -r '.file' | sort | uniq -c | sort -nr

# Create GitHub issues from todos
waymark search "src/" --contexts todo --format json | \
  jq -r '.[] | "gh issue create --title \"" + .prose + "\" --body \"Found in " + .file + ":" + (.line|tostring) + "\""'
```

### CI/CD Integration

```bash
# Fail if critical security waymarks exist
if waymark search "src/" --contexts "sec,critical" | grep -q .; then
  echo "Critical security waymarks found!"
  exit 1
fi

# Generate waymark report
waymark list "src/" --format json > waymarks-report.json
```

## Performance Tips

1. **Use specific patterns**: `src/**/*.js` is faster than `**/*`
2. **Filter contexts early**: Use `--contexts` to reduce processing
3. **Limit context lines**: Large `--context` values slow down output
4. **Use JSON for processing**: Terminal format is slower for large results

## Troubleshooting

### No waymarks found

Check your pattern syntax:
- Use quotes around glob patterns: `"src/**/*.js"`
- Ensure files exist: `ls src/**/*.js`
- Check waymark syntax: `:::` with optional prefix

### Permission denied

The CLI validates file paths for security. Ensure:
- Files are within the current directory
- No symbolic links point outside the project
- Files are readable by current user

### Large file warning

Files over 10MB are skipped by default. To include them:
```bash
waymark search "large-file.sql" --max-file-size 50mb
```

## Security Features

The CLI includes security protections:
- Path traversal prevention
- File size limits (10MB default)
- Rate limiting (100 operations/minute)
- Input validation and sanitization
- No execution of file contents

For more details, see the [API documentation](./API.md).