# Grepa Scripts

This directory contains tools and scripts for working with grep-anchors.

## grepa-list

The `grepa-list` script discovers all grep-anchors in your codebase and generates an inventory report. Available in both Python and JavaScript versions.

### Quick Start

```bash
# Run with default settings
python3 .grepa/scripts/grepa-list.py

# Or using Node.js
node .grepa/scripts/grepa-list.js

# Ignore documentation files
python3 .grepa/scripts/grepa-list.py --ignore docs

# Ignore markdown files and code examples
python3 .grepa/scripts/grepa-list.py --ignore md --ignore-examples
```

### Configuration

The script can be configured using `.grepa/grepa-list.config.json`. This allows you to set default ignore patterns, output settings, and display preferences.

#### Configuration File Format

```json
{
  "anchor": ":ga:",              // Default anchor pattern
  
  "ignore": {
    "patterns": {                // Named pattern aliases
      "docs": {
        "description": "Ignore all documentation files",
        "globs": ["*.txt", "*.md", "*.markdown", "*.mdx"],
        "active": true          // Enable this pattern by default
      },
      "md": {
        "description": "Ignore markdown files",
        "globs": ["*.md", "*.markdown", "*.mdx"],
        "active": false         // Available but not active
      }
    },
    "custom": [],               // Custom glob patterns to always ignore
    "respectGitignore": true    // Respect .gitignore patterns
  },
  
  "examples": {
    "ignore": false,            // Ignore anchors in code examples
    "detectCodeBlocks": true,   // Detect indented code blocks
    "detectCodeFences": true    // Detect ``` code fences
  },
  
  "output": {
    "file": ".grepa/inventory.generated.json",  // Output file path
    "format": "json",                           // Output format
    "indent": 2                                 // JSON indentation
  },
  
  "display": {
    "showProgress": true,       // Show progress indicators
    "showSummary": true,        // Show summary after generation
    "topTagsCount": 5,          // Number of top tags to display
    "topFilesCount": 10         // Number of top files in report
  }
}
```

### Command Line Options

- `anchor` - Custom anchor pattern (default: `:ga:`)
- `--ignore <pattern>` - Add ignore pattern (can be used multiple times)
- `--ignore-examples` - Ignore grep-anchors inside code blocks
- `--no-gitignore` - Do not respect .gitignore patterns (overrides config)
- `--config <path>` - Use custom config file

### Ignore Patterns

You can ignore files using:

1. **Named aliases** - Predefined patterns like `docs`, `md` (set `active: true` to enable by default)
2. **Glob patterns** - Standard glob patterns like `*.test.js`, `src/temp/*`
3. **Config file** - Set patterns as active in config or add to `custom` array
4. **Gitignore** - Automatically respect `.gitignore` patterns when `respectGitignore` is true

Examples:
```bash
# Ignore all documentation
python3 .grepa/scripts/grepa-list.py --ignore docs

# Ignore test files
python3 .grepa/scripts/grepa-list.py --ignore "*.test.js"

# Multiple ignores
python3 .grepa/scripts/grepa-list.py --ignore md --ignore "*.spec.ts"

# Override gitignore respect from config
python3 .grepa/scripts/grepa-list.py --no-gitignore
```

### Output

The script generates a JSON report containing:
- Total anchor count and unique tags
- Tag frequency and distribution
- File-by-file anchor inventory
- Top tags and files by usage

Example output structure:
```json
{
  "_comment": ":ga:meta Generated grep-anchor inventory",
  "generated": "2025-05-24T12:00:00Z",
  "anchor": ":ga:",
  "summary": {
    "totalAnchors": 123,
    "uniqueTags": 45,
    "filesWithAnchors": 20
  },
  "tags": {
    "todo": {
      "count": 15,
      "files": { ... },
      "firstSeen": { ... }
    }
  },
  "files": { ... },
  "topTags": [ ... ],
  "topFiles": [ ... ]
}
```