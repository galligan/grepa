# Waymark CLI Design

<!-- ::: tldr Waymark CLI design focused on ripgrep-style ergonomics with special category commands -->

This document defines the user-facing design of the waymark CLI, emphasizing familiarity for ripgrep users and powerful search capabilities.

## Core Philosophy

1. **ripgrep-first**: Mirror ripgrep's flags and behavior wherever possible
2. **find is primary**: Most searches go through `waymark find`
3. **Special commands are special**: Only top-level categories get dedicated commands with custom formatting
4. **Configuration over complexity**: Use config files for customization, not flags

## Commands Overview

### Core Command: `waymark find`

The primary search interface, handling 90% of use cases.

```bash
waymark find [PATTERN] [OPTIONS]

# Examples
waymark find                     # List all waymarks
waymark find "auth"              # Find "auth" in waymark content
waymark find -p todo             # Find all todo markers
waymark find -p todo "auth"      # Find "auth" in todo markers
```

### Category Commands

Special commands for top-level marker categories with custom formatting:

```bash
waymark task [OPTIONS]           # Task-related waymarks (todo, fix, done, etc.)
waymark info [OPTIONS]           # Information waymarks (note, docs, why, etc.)
waymark alert [OPTIONS]          # Alerts/warnings (warn, crit, unsafe, etc.)
waymark tldr [OPTIONS]           # Special: tldr summaries with tree view
```

## Flag Reference

### Search Filters

```bash
# Marker filtering
-p, --prefix PREFIX              # Include markers with this prefix
-P, --prefix-not PREFIX          # Exclude markers with this prefix

# Tag filtering  
-t, --tag TAG                    # Include tag
-T, --tag-not TAG                # Exclude tag

# Property filtering
--has PROPERTY                   # Has property (e.g., priority:high)
--not PROPERTY                   # Doesn't have property

# Content patterns
[PATTERN]                        # Search pattern (regex supported)
-w, --word                       # Match whole words only
-i, --ignore-case                # Case insensitive
```

### File Filtering (ripgrep-compatible)

```bash
# File types
-t, --type TYPE                  # Include file type
-T, --type-not TYPE              # Exclude file type

# Glob patterns
-g, --glob PATTERN               # Include glob
# Use ! prefix for exclusion: -g '!*test*'

# Path filtering
--path PATH                      # Search in path
--skip-dirs DIRS                 # Skip directories
```

### Context Display

```bash
# Line context (exactly like ripgrep)
-A, --after-context NUM          # Lines after match
-B, --before-context NUM         # Lines before match
-C, --context NUM                # Lines before and after
-A2 -B1                          # Short form

# Waymark context
--near [NUM]                     # Show waymarks within NUM lines (default: 5)
--related                        # Show waymarks in same function/block
```

### Output Control

```bash
# Format options
-l, --files-with-matches         # Only show filenames
-c, --count                      # Count matches per file
--json                           # JSON output
--csv                            # CSV output
-o, --output FILE                # Write to file

# Limiting
-m, --max-count NUM              # Stop after NUM matches per file
--max-results NUM                # Total result limit
```

## Category Commands Detail

### `waymark task`

Shows task-related waymarks with progress indicators.

```bash
waymark task                     # All tasks
waymark task --open              # Not done
waymark task --assigned @me      # My tasks
waymark task --stats             # Task statistics

# Output format (custom for tasks):
# ✓ [done] src/auth.js:45 - implemented OAuth flow
# ○ [todo] src/api.js:23 - add rate limiting @alice #backend
# ◐ [wip] src/cache.js:89 - refactoring cache layer
```

**Includes markers**: todo, fix, done, wip, review, spike

### `waymark info`

Shows information waymarks in documentation style.

```bash
waymark info                     # All info waymarks
waymark info --type note         # Just notes
waymark info --tree              # Tree view by directory

# Output format (custom for info):
# src/
#   auth.js
#     📝 note: uses JWT for stateless auth
#     📚 docs: see RFC 7519 for JWT spec
#   api.js
#     🤔 why: rate limiting prevents DOS attacks
```

**Includes markers**: note, docs, why, see, example, tldr

### `waymark alert`

Shows warnings and alerts with severity indicators.

```bash
waymark alert                    # All alerts
waymark alert --critical         # Only critical
waymark alert --grouped          # Group by severity

# Output format (custom for alerts):
# 🔴 CRITICAL (2)
#   src/db.js:34 - SQL injection vulnerability #security
#   src/auth.js:89 - hardcoded secret key #security
# 
# 🟠 WARNING (5)
#   src/api.js:23 - missing rate limiting
#   ...
```

**Includes markers**: warn, crit, unsafe, caution, broken, deprecated

### `waymark tldr`

Special command for file summaries with tree visualization.

```bash
waymark tldr                     # All tldr summaries
waymark tldr --tree              # Tree view (default)
waymark tldr --flat              # Flat list
waymark tldr --recent            # Sort by modification time
waymark tldr -n 20               # Limit to 20 entries
waymark tldr src/                # Only in src directory

# Output format (tree view):
# waymark/
# ├── docs/
# │   ├── README.md .............. Complete waymark documentation
# │   └── guides/
# │       └── quick-start.md ..... 5-minute introduction to waymarks
# └── src/
#     ├── cli.ts ................. Main CLI entry point
#     └── parser.ts .............. Waymark syntax parser
```

## Configuration System

### File Locations (precedence order)

1. **Project**: `.waymark/config.json`
2. **Local**: `.waymark/config.local.json` (git-ignored)
3. **Global**: `~/.config/waymark/config.json`

### Configuration Schema

```json
{
  "defaults": {
    "context": 2,
    "exclude": ["node_modules", ".git", "dist"],
    "type": ["ts", "js", "py"]
  },
  "shortcuts": {
    "mine": "assign:@{user}",
    "urgent": "priority:high|priority:critical",
    "frontend": "tag:frontend|tag:ui",
    "backend": "tag:backend|tag:api"
  },
  "aliases": {
    "standup": "task --done --since yesterday --author @{user}",
    "sprint": "task --open --priority high,medium",
    "security": "find --tag security --tag-not resolved"
  },
  "format": {
    "useColor": true,
    "useIcons": true,
    "dateFormat": "relative"
  }
}
```

### Using Shortcuts and Aliases

```bash
# Shortcuts expand in filters
waymark find --has mine          # Expands to assign:@yourusername
waymark task --has urgent        # Expands to priority:high|priority:critical

# Aliases create new commands
waymark standup                  # Shows yesterday's completed tasks
waymark sprint                   # Shows current sprint work
waymark security                 # Security issues not resolved
```

## Common Usage Patterns

### Daily Development

```bash
# What needs doing?
waymark task --open --has mine

# What did I finish yesterday?
waymark task --done --since yesterday --author @me

# Any security issues?
waymark alert --tag security

# Get overview of a directory
waymark tldr src/auth/
```

### Code Review

```bash
# Find todo markers added in this branch
waymark find -p todo --since @{upstream}

# Check for temporary code markers
waymark find -p temp -p hack

# Security audit
waymark alert --critical --tag security
```

### Navigation

```bash
# Find where something is implemented
waymark find "OAuth implementation"

# See all API documentation
waymark info --type docs --tag api

# Find related waymarks
waymark find -p todo "cache" --related
```

## Output Examples

### Standard Output (find command)
```
src/auth.js:23: todo ::: implement OAuth2 flow @alice #backend
src/auth.js:45: warn ::: token expiration not handled #security
src/cache.js:12: note ::: uses LRU eviction, 1GB max
```

### JSON Output
```json
{
  "version": "1.0",
  "query": "todo",
  "count": 3,
  "results": [
    {
      "file": "src/auth.js",
      "line": 23,
      "column": 3,
      "marker": "todo",
      "content": "implement OAuth2 flow",
      "properties": {
        "assign": "@alice"
      },
      "tags": ["backend"],
      "context": {
        "before": ["function authenticate(user) {", "  // Authentication logic"],
        "after": ["  return token;", "}"]
      }
    }
  ]
}
```

## Design Principles

1. **Predictable**: ripgrep users should feel at home
2. **Fast**: Use ripgrep under the hood for speed
3. **Composable**: Flags combine naturally
4. **Configurable**: But not complicated
5. **Pretty**: Category commands provide rich, formatted output
6. **Practical**: Optimize for common cases

## Future Considerations

- Integration with language servers for `--related` flag
- Git integration for time-based queries
- Editor plugins that use the CLI
- Web UI that uses JSON output