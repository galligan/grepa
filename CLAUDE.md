# CLAUDE.md
<!-- :ga:tldr AI agent instructions for working with the grepa repository -->
<!-- :ga:meta Claude Code configuration and development guidelines -->

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Currently undergoing an incremental rebuild (January 2025). The project is being rebuilt from the ground up with a focus on documentation and ripgrep-based functionality first. Full package implementations are archived in the `archive/pre-rebuild-2025-01` branch.

## Project Overview

Grepa is a specification for **grep-anchors** - a standardized way to mark important code locations using the `:ga:` sigil in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands.

## Important Notes

- This repository uses `grepa` grep-anchors (`:ga:`). Use @llms.txt for how to use.

## Core Concept

The grep-anchor pattern: `<comment-leader> :ga:payload`
- **`:ga:`** - the fixed four-character marker (or custom sigil like `:<your-sigil>:`)
- **payload** - one or more tokens that classify the line

## Common Anchor Types

### Essential Patterns
- `:ga:tldr` - Brief summary/overview (use at function/class/doc start)
- `:ga:todo` - Work that needs doing
- `:ga:sec` - Security-critical code requiring review
- `:ga:tmp` - Temporary hacks to be removed
- `:ga:ctx` - Important context, assumptions, and constraints
- `:ga:@agent` - AI agent instructions (generic)
- `:ga:@cursor` - Cursor-specific tasks
- `:ga:@claude` - Claude-specific tasks

### Quality & Management
- `:ga:perf` - Performance-related sections
- `:ga:bug` - Known issues to fix
- `:ga:debt` - Technical debt markers
- `:ga:fix` / `:ga:fixme` - Broken code needing immediate fix
- `:ga:test` - Testing requirements
- `:ga:api` - Public interfaces
- `:ga:business` - Business logic documentation
- `:ga:breaking` - Breaking API changes
- `:ga:freeze` - Code that must not be modified
- `:ga:review` - Needs human review
- `:ga:config` - Configuration values

### Risk & Severity
- `:ga:warn` - Potential issues or gotchas
- `:ga:crit` - Critical code paths
- `:ga:unsafe` - Dangerous operations
- `:ga:danger` - Extremely risky code

### Advanced Patterns
- `:ga:issue(123)` - Link to issue tracker
- `:ga:owner(@person)` - Assign responsibility
- `:ga:deadline(2024-03-01)` - Time constraints
- `:ga:depends(service-name)` - Dependencies

### Tag Philosophy
- Keep tags terse when possible (less than 8 chars)
  - `sec` beats `security`
  - `ctx` beats `context`
  - `tmp` beats `temp`

## Search Commands

Using ripgrep (rg) is the primary way to work with grep-anchors:

```bash
# Find all anchors
rg -n ":ga:"

# Find specific anchor types
rg -n ":ga:sec"          # security anchors
rg -n ":ga:tmp"           # temporary code
rg -n ":ga:todo"          # tasks to complete
rg -n ":ga:@agent"        # AI agent instructions
rg -n ":ga:.*perf"        # performance-related

# Find with context (lines before/after)
rg -B2 -A2 ":ga:sec"      # 2 lines before and after
rg -C3 ":ga:todo"         # 3 lines context

# Find related tags nearby
rg -B2 -A2 ":ga:sec" | rg ":ga:(sec|todo)"

# Find in markdown (including HTML comments)
rg "<!-- :ga:" --type md

```

## Current Repository Structure

```
grepa/
├── docs/                 # Documentation
│   ├── about/           # Prior art and history
│   │   └── priors.md    # Related concepts and inspiration
│   ├── conventions/     # Tag conventions and patterns
│   │   ├── README.md    # Convention overview
│   │   ├── common-patterns.md     # Essential tags
│   │   ├── ai-patterns.md         # AI agent patterns
│   │   ├── workflow-patterns.md   # Task tracking
│   │   ├── domain-specific.md     # Framework patterns
│   │   └── combinations.md        # Multiple tags usage
│   ├── guides/          # User guides and tutorials
│   │   ├── quick-start.md         # 5-minute intro
│   │   ├── progressive-enhancement.md  # Adoption levels
│   │   └── custom-anchors.md      # Custom sigils
│   ├── notation/        # Technical format spec
│   │   ├── README.md    # Notation overview
│   │   ├── format.md    # Syntax specification
│   │   ├── payloads.md  # Payload structures
│   │   └── examples.md  # Cross-language examples
│   ├── project/         # Project specifications
│   │   └── specs/       # Version specifications
│   ├── examples.md      # Real-world usage
│   ├── advanced-patterns.md  # Complex scenarios
│   └── what-ifs.md      # AI-native vision
├── README.md            # Main documentation with links
├── CLAUDE.md            # AI agent instructions (this file)
└── llms.txt             # LLM-readable quick reference
```

## Development Guidelines

1. **Incremental Approach**: We're building from documentation first, then simple ripgrep usage, before any complex tooling
2. **Preserve History**: The `archive/pre-rebuild-2025-01` branch contains all previous implementation work
3. **Focus on Clarity**: Documentation should clearly explain the grep-anchor concept and its benefits

## Future Tooling (Currently Archived)

The following packages exist in the archive branch and may be reintroduced:
- @grepa/core - Parser and validation library
- @grepa/cli - Command-line interface
- Additional integrations (ESLint, VS Code, etc.)

## Best Practices for This Repository

### Using Grep-Anchors
1. **Separate concerns**: Use multiple comments for distinct topics
2. **Line limits**: Keep under ~80 chars for readable grep output
3. **Layer carefully**: Combine tags only when closely related
4. **Be specific**: "validate UUID" not just "validate"
5. **Use HTML comments in markdown**: `<!-- :ga:tldr summary -->` for non-rendered anchors

### Contributing

When working on this project:
1. Always use conventional commits
2. Work on feature branches off main
3. Use grep-anchors as comments in any new code or when you find code that doesn't yet have them
4. Focus on simplicity and grep-ability
5. Use ripgrep to verify anchor patterns before commits

### Documentation Standards
- All markdown files should have `<!-- :ga:tldr -->` at the top
- Use contextual tags like `<!-- :ga:guide -->` or `<!-- :ga:spec -->`
- Keep documentation focused and scannable
- Link related docs for navigation
