# Grepa Scripting Guide
<!-- :ga:tldr Automate grep-anchor workflows with scripts and tools -->
<!-- :ga:guide How to use and create scripts for grep-anchor automation -->

Automate grep-anchor workflows with scripts from the `scripts` directory.

## Quick Start

The `.grepa` directory contains ready-to-use scripts for common tasks:

```bash
# Generate an inventory of all grep-anchors
scripts/inventory.js

# Or use the Python version
scripts/inventory.py

# Use with custom anchor
scripts/inventory.js :proj:
```

## inventory Script

The `inventory` script scans your codebase and generates a comprehensive inventory of all grep-anchors.

### Features

- **Complete inventory**: Finds all anchors and tags in your codebase
- **Tag statistics**: Shows usage counts and file locations
- **File analysis**: Lists which files have the most anchors
- **Custom anchors**: Works with any anchor pattern (`:ga:`, `:proj:`, etc.)
- **JSONC output**: Generates `scripts/inventory.generated.json` with full details
- **Flexible filtering**: 
  - `--ignore-md`: Skip markdown files (useful for documentation-heavy repos)
  - `--ignore-examples`: Skip anchors in code blocks (avoids counting examples)

### Usage

```bash
# Basic usage (scans for :ga: anchors)
scripts/inventory.js

# With options
scripts/inventory.js --ignore md         # Ignore markdown files
scripts/inventory.js --ignore-examples   # Ignore code examples in docs
scripts/inventory.js --ignore md --ignore-examples  # Both options

# Custom anchor
scripts/inventory.py :tc:

# Output
🔍 Searching for grep-anchors...

✅ Grep-anchor inventory generated!
📍 Anchor pattern: :ga:
🚫 Ignored markdown files
🚫 Ignored code examples
📊 Found 47 anchors across 12 files
🏷️  Discovered 15 unique tags
📄 Report saved to: scripts/inventory.generated.json

🔝 Top 5 tags:
   todo: 12 uses in 8 file(s)
   ctx: 10 uses in 5 file(s)
   sec: 8 uses in 4 file(s)
   @agent: 6 uses in 3 file(s)
   tmp: 5 uses in 2 file(s)
```

### Output Format

The generated `scripts/inventory.generated.json` contains:

```jsonc
{
  "_comment": ":ga:meta Generated grep-anchor inventory - DO NOT EDIT MANUALLY",
  "generated": "2024-03-15T10:30:00.000Z",
  "anchor": ":ga:",
  "summary": {
    "totalAnchors": 47,
    "uniqueTags": 15,
    "filesWithAnchors": 12
  },
  "tags": {
    "todo": {
      "count": 12,
      "files": {
        "src/auth.js": [23, 45, 67],
        "src/api.js": [12, 34]
      },
      "firstSeen": {
        "file": "src/auth.js",
        "line": 23
      }
    }
    // ... more tags
  },
  "files": {
    "src/auth.js": {
      "totalAnchors": 8,
      "tags": {
        "todo": 3,
        "sec": 2,
        "ctx": 3
      },
      "lines": [23, 34, 45, 56, 67, 78, 89, 90]
    }
    // ... more files
  },
  "topTags": [
    {
      "tag": "todo",
      "count": 12,
      "fileCount": 8
    }
    // ... top 10 tags
  ],
  "topFiles": [
    {
      "file": "src/auth.js",
      "anchors": 8,
      "uniqueTags": 3
    }
    // ... top 10 files
  ]
}
```

### Requirements

- **ripgrep (rg)**: Install from [github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)
- **Node.js 14+** for the JavaScript version
- **Python 3.6+** for the Python version

## Advanced Searching with Context

Use ripgrep's context flags to find related tags on nearby lines:

### Finding Related Tags

```bash
# Show 1 line before and after each match
rg -B1 -A1 ":ga:sec"

# Show 2 lines of context (before and after)
rg -C2 ":ga:todo"

# Find security markers and check if todos are nearby
rg -B2 -A2 ":ga:sec" | rg -E ":ga:(sec|todo)"

# Find both security AND todo in the same area (within 3 lines)
rg -U -B3 -A3 ":ga:sec" | rg -B3 -A3 ":ga:todo"
```

### Example: Find Security TODOs

```bash
#!/bin/bash
# Find places where security and todo appear near each other

echo "=== Security issues with nearby TODOs ==="
for file in $(rg -l ":ga:sec"); do
  # Check if file also has todos
  if rg -q ":ga:todo" "$file"; then
    echo -e "\n📁 $file:"
    # Show security markers with 3 lines context
    rg -B3 -A3 ":ga:sec" "$file" | grep -E "(:|ga:)" --color=always
  fi
done
```

### Example: Multi-line Pattern Search

```bash
# Find where multiple related tags appear together
rg -U -A5 ":ga:" | awk '
/:ga:sec/ { sec=$0; sec_nr=NR }
/:ga:todo/ { 
  if (NR-sec_nr <= 5 && sec) { 
    print "Found related tags:"; 
    print "  " sec; 
    print "  " $0; 
    print "" 
  } 
}'
```

## Writing Your Own Scripts

Create custom scripts that leverage grep-anchors:

### Example: Find Stale TODOs

```bash
#!/bin/bash
# :ga:meta Find TODOs older than 30 days

# Find files modified more than 30 days ago with :ga:todo
for file in $(find . -type f -mtime +30); do
  if rg -q ":ga:todo" "$file"; then
    echo "=== $file ==="
    rg -n ":ga:todo" "$file"
  fi
done
```

### Example: Security Audit

```python
#!/usr/bin/env python3
# :ga:meta Generate security audit report

import subprocess
import json

# Find all security anchors
result = subprocess.run(
    ['rg', '-n', ':ga:sec', '--json'],
    capture_output=True,
    text=True
)

# Parse and group by severity
for line in result.stdout.splitlines():
    data = json.loads(line)
    if data['type'] == 'match':
        print(f"{data['data']['path']['text']}:{data['data']['line_number']}")
```

### Example: PR Check

```javascript
#!/usr/bin/env node
// :ga:meta Check for required anchors in changed files

import { execSync } from 'child_process';

// Get changed files
const changedFiles = execSync('git diff --name-only HEAD~1')
  .toString()
  .trim()
  .split('\n');

// Check each file has context anchors
for (const file of changedFiles) {
  const hasContext = execSync(`rg -c ":ga:ctx" "${file}" || echo 0`)
    .toString()
    .trim();
  
  if (hasContext === '0') {
    console.error(`❌ ${file} missing :ga:ctx anchors`);
    process.exit(1);
  }
}
```

## Integration Ideas

### Git Hooks

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Generate fresh inventory before each commit
scripts/inventory.js
```

### CI/CD

```yaml
# GitHub Actions example
- name: Generate grep-anchor inventory
  run: |
    scripts/inventory.py
    # Upload as artifact
    
- name: Check for critical issues
  run: |
    if rg -q ":ga:p0|:ga:critical"; then
      echo "Critical issues found!"
      exit 1
    fi
```

### Editor Integration

```json
// VS Code task
{
  "label": "Update Grepa Inventory",
  "type": "shell",
  "command": "scripts/inventory.js",
  "problemMatcher": []
}
```

## Best Practices

1. **Run regularly**: Keep your inventory fresh
2. **Check into git**: Share the scripts (but not inventory.generated.json)
3. **Customize for your team**: Add scripts for your workflow
4. **Automate**: Use in CI/CD and git hooks
5. **Monitor trends**: Track tag growth over time

## Tips

- Scripts can accept custom anchors as arguments
- Output is always `scripts/inventory.generated.json` (git-ignored)
- Both JS and Python versions produce identical output
- Use the inventory for dashboards and reporting

Remember: Scripts make grep-anchors actionable. Start with `inventory`, then build your own! 