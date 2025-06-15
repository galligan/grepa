<!-- *tldr ::: Star (*) signal for PR-scoped work tracking with git-aware CI integration -->
<!-- stub ::: Document pending completion -->
<!-- *todo ::: @agent complete this document -->
# The Star (*) Signal: Branch-Scoped Current Work

## Overview

The `*` (star) signal marks work that **must be addressed before this PR/branch merges**. It provides a visual indicator for branch-critical items and integrates with CI to prevent merging incomplete work.

## Concept

The star signal serves as a branch-scoped checklist:
- Marks work that blocks PR merging
- Highlights areas needing special attention
- Automatically enforced by git-aware CI
- Removed when work is complete

## Syntax

The `*` appears as the first signal, before any intensity modifiers:

```javascript
// *todo ::: finish error handling before merge
// *fix ::: resolve edge case found in review
// *!todo ::: critical - must fix before merge
// *note ::: need to verify this works with new API

// Invalid (star must be first):
// !*todo ::: wrong order
// _*todo ::: can't combine with underscore
```

## Grammar

```ebnf
# Position and intensity signals are separate
position_signal ::= "*" | "_"
intensity_signal ::= ("!!" | "!" | "??" | "?" | "--" | "-")
signal ::= position_signal? intensity_signal?

# Examples: *todo, *!todo, *!!fix, _note
# Invalid: *_todo, _*todo
```

## CI Integration

### Basic Git-Aware Check

```yaml
# .github/workflows/pr-check.yml
name: PR Star Check
on: [pull_request]

jobs:
  check-stars:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Check for unresolved stars
        run: |
          # Get the base branch
          BASE_BRANCH=${{ github.base_ref }}
          
          # Find NEW stars introduced in this PR
          NEW_STARS=$(git diff origin/$BASE_BRANCH...HEAD | grep -E '^\+.*\*\w+\s+:::' | wc -l)
          
          if [ $NEW_STARS -gt 0 ]; then
            echo "⚠️  Found starred items that must be resolved before merge:"
            echo ""
            git diff origin/$BASE_BRANCH...HEAD | grep -E '^\+.*\*\w+\s+:::'
            echo ""
            echo "Remove the * from waymarks when work is complete."
            exit 1
          fi
```

### Advanced Branch Inheritance

For complex branch hierarchies:

```bash
#!/bin/bash
# check-stars.sh

# Get merge base with target branch
MERGE_BASE=$(git merge-base HEAD $TARGET_BRANCH)

# Only check stars added since merge base
git diff $MERGE_BASE..HEAD | grep -E '^\+.*\*\w+\s+:::' > new_stars.txt

if [ -s new_stars.txt ]; then
  echo "Found unresolved stars in this branch:"
  cat new_stars.txt
  exit 1
fi
```

## Use Cases

### PR Work Tracking
```javascript
// *todo ::: address PR feedback about validation
// *fix ::: bug found during PR testing  
// *refactor ::: simplify this per code review
```

### Feature Checkpoints
```javascript
// *todo ::: add tests before marking feature complete
// *todo ::: update documentation for new API
// *must ::: security review required before merge
```

### Review Focus
```javascript
// *note ::: @reviewer please verify this approach
// *check ::: manual QA needed on staging
```

## Search Patterns

```bash
# All stars in current branch
rg '\*\w+\s+:::'

# Stars added in this branch
git diff $(git merge-base HEAD main)..HEAD | grep -E '^\+.*\*\w+\s+:::'

# Quick PR readiness
rg '\*\w+\s+:::' && echo "⚠️  Starred items need attention" || echo "✅ Ready to merge"

# Find starred todos specifically
rg '\*todo\s+:::'

# My starred work
rg '\*\w+\s+:::.*@$(whoami)'
```

## Best Practices

1. **Use sparingly** - Only for PR-critical work
2. **Remove promptly** - Unstar when work completes
3. **Be specific** - Clear descriptions of what needs doing
4. **Review before merge** - Final check for any stars
5. **Branch scope** - Stars are branch-contextual

## Workflow Example

```bash
# Start feature branch
git checkout -b feature/new-auth

# Add starred items as you work
# *todo ::: implement token refresh
# *todo ::: add integration tests
# *fix ::: handle edge case for expired tokens

# Complete work and remove stars
# todo ::: implement token refresh ✓
# todo ::: add integration tests ✓
# fix ::: handle edge case for expired tokens ✓

# CI now allows merge
git push origin feature/new-auth
```

## Configuration

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Warn about starred items
STARS=$(git diff --cached | grep -E '^\+.*\*\w+\s+:::' | wc -l)
if [ $STARS -gt 0 ]; then
  echo "⚠️  You're committing starred waymarks. These must be resolved before merge."
  echo "Continue anyway? (y/n)"
  read -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi
```

### GitHub Branch Protection
```yaml
# Require star check to pass
required_status_checks:
  strict: true
  contexts: ["PR Star Check"]
```

## Migration

To add star signal support:

1. Update EBNF grammar to include `*` as position signal
2. Add CI workflow for PR checks
3. Document star usage in contributing guide
4. Consider pre-commit hooks for early warning