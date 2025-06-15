<!-- tldr ::: Complete guide to searching waymarks with ripgrep and the waymark CLI -->
# Search Patterns Guide

This guide covers searching waymarks using both raw ripgrep/grep commands and the waymark CLI's enhanced capabilities.

<!-- note ::: This document reflects the new ::: syntax specification -->

## Part 1: Using ripgrep/grep

### Basic Patterns

#### Find all waymarks

```bash
# Find any waymark
rg ":::"

# With line numbers (default in rg)
rg -n ":::"

# Case-insensitive (though not usually needed)
rg -i ":::"
```

#### Find by marker

```bash
# Specific marker
rg "todo :::"
rg "fix :::"
rg "alert :::"

# Multiple markers (OR)
rg "(todo|fix) :::"

# Exclude certain markers
rg ":::" | rg -v "done :::"
```

#### Find by properties

```bash
# Find specific property
rg ":::.*priority:high"
rg ":::.*@alice"

# Multiple properties (AND)
rg ":::.*priority:high.*@alice"

# Property with any value
rg ":::.*priority:"
```

#### Find by tags

```bash
# Simple tag search
rg "\+security"
rg "\+performance"

# Tags in waymarks only
rg ":::.*\+security"

# Multiple tags
rg ":::.*\+security.*\+critical"
```

### Context Searching

#### Show surrounding code

```bash
# Show 2 lines before and after
rg -C2 "todo :::"

# Show 3 lines before, 1 after
rg -B3 -A1 "fix :::"

# Show only the line after (useful for seeing what comes next)
rg -A1 "tldr :::" --no-line-number
```

#### File-level context

```bash
# Show just filenames with todos
rg -l "todo :::"

# Count waymarks per file
rg -c ":::" | sort -t: -k2 -nr

# Files with most todos
rg -c "todo :::" | sort -t: -k2 -nr | head -10
```

### Advanced Extraction

#### Extract assignees

```bash
# Get all assignees from todos
rg -o "todo :::.*@(\w+)" -r '$1' | sort | uniq

# Count tasks per person
rg -o "todo :::.*@(\w+)" -r '$1' | sort | uniq -c | sort -nr
```

#### Extract priorities

```bash
# List all priority levels used
rg -o "priority:(\w+)" -r '$1' | sort | uniq

# Find critical items across markers
rg ":::.*priority:(critical|high)"
```

#### Extract issue references

```bash
# Find all issue numbers
rg -o ":::.*#(\d+)" -r '#$1' | sort -n | uniq

# Find waymarks that fix issues
rg ":::.*fixes:#\d+"

# Find blocked items
rg ":::.*blocked"
```

### Searching in Different File Types

#### Markdown files with HTML comments

```bash
# Find waymarks in HTML comments
rg "<!-- .*:::" --type md

# Find only tldr in markdown
rg "<!-- tldr :::" --type md

# Exclude HTML comments
rg ":::" --type md | rg -v "<!--"
```

#### Language-specific searches

```bash
# JavaScript/TypeScript only
rg "// .*:::" -g "*.{js,ts,jsx,tsx}"

# Python only
rg "# .*:::" -g "*.py"

# In docstrings (multiline)
rg -U "\"\"\"[\s\S]*?:::[\s\S]*?\"\"\"" -g "*.py"
```

### Useful Aliases

Add these to your shell configuration:

```bash
# Find all waymarks
alias wm='rg ":::"'

# Find todos
alias wmt='rg "todo :::"'

# Find with context
alias wmc='rg -C2 ":::"'

# Find security issues
alias wmsec='rg ":::.*\+security"'

# Count waymarks by marker
alias wmcount='rg "^[^:]*[a-z]+ :::" -o | sed "s/ ::://" | sort | uniq -c | sort -nr'
```

### Complex Queries

#### Time-based searches

```bash
# Find waymarks with dates
rg ":::.*2024-"

# Find overdue items (assuming YYYY-MM-DD format)
rg ":::.*until:2023-" # items that should be done by now
```

#### Multi-condition searches

```bash
# High priority security items
rg ":::.*priority:high.*\+security"

# Assigned but not done
rg "@\w+" | rg -v "done :::"

# Temporary code in production files
rg "temp :::" -g "!*test*" -g "!*spec*"
```

#### Statistical analysis

```bash
# Waymark density (waymarks per 100 lines)
echo "scale=2; $(rg -c ":::" | awk -F: '{sum+=$2} END {print sum}') / $(find . -name '*.js' -o -name '*.py' -o -name '*.md' | xargs wc -l | tail -1 | awk '{print $1}') * 100" | bc

# Most used hashtags
rg -o "#\w+" | sort | uniq -c | sort -nr | head -20
```

## Part 2: Waymark CLI Design

<!-- todo ::: @galligan replace this section with streamlined CLI from cli-design.md -->

The waymark CLI provides ripgrep-style ergonomics with enhanced waymark features. See [CLI Design](../tooling/cli-design.md) for the complete specification.

### Core Commands

#### `waymark find` - Primary search command

```bash
# Find all waymarks
waymark find

# Find by marker
waymark find -m todo
waymark find -m fix,alert  # multiple markers

# Find with pattern
waymark find "auth" -m todo

# Find by properties
waymark find --has priority:high

# Find by tags
waymark find -t security
```

#### Category Commands with Special Formatting

```bash
# Task overview with progress indicators
waymark task                    # All tasks
waymark task --open             # Open tasks only
waymark task --stats            # Task statistics

# Information waymarks with tree view
waymark info                    # All info waymarks
waymark info --tree             # Tree view by directory

# Alerts grouped by severity
waymark alert                   # All alerts
waymark alert --critical        # Critical only
waymark alert --grouped         # Group by severity

# TLDR summaries with file tree
waymark tldr                    # All file summaries
waymark tldr --tree             # Tree visualization
waymark tldr --recent           # Sort by modification time
```

### Advanced Features

#### Context and Relations

```bash
# Show nearby waymarks
waymark find -p todo --near 5

# Find related waymarks in same function/block
waymark find "cache" --related

# Context lines (ripgrep-compatible)
waymark find -m alert -C2       # 2 lines before/after
waymark find -m todo -A3 -B1    # 3 after, 1 before
```

#### Export and Integration

```bash
# Export to JSON
waymark find --json > waymarks.json
waymark find --csv > waymarks.csv

# File output
waymark find -o waymarks.txt
```

### Configuration

Configuration files provide shortcuts and aliases:

```json
{
  "shortcuts": {
    "mine": "@{user}",
    "urgent": "priority:high|priority:critical"
  },
  "aliases": {
    "standup": "task --done --since yesterday --author @{user}",
    "sprint": "task --open --priority high,medium"
  }
}
```

Use shortcuts and aliases:

```bash
# Using shortcuts
waymark find --has mine          # Expands to @yourusername
waymark task --has urgent        # High/critical priority

# Using aliases
waymark standup                  # Yesterday's completed tasks
waymark sprint                   # Current sprint work
```