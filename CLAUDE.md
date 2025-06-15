<!-- tldr ::: Claude Code configuration and development guidelines -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

About you: @.ai/prompts/MAX.md

## Project Overview

The Waymark CLI provides tooling for **waymarks** - a standardized way to mark important code locations using the `:::` sigil in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands.

## Important Warning about rg Patterns

- When writing `rg` patterns that involve waymarks should *always* include the `:::` sigil otherwise risking false-positives. If searching on aspects that would follow the `:::` don't assume those things immediately follow `::: ` as they could appear anywhere after. With the exception of assignment e.g. `todo ::: @actor ...`

## Signal System

### Position Signals (first in chain)
- `*` - Star: Branch-scoped work that must be finished before PR merge
- `_` - Underscore: Ignore marker (reserved for future functionality)

### Intensity Signals
- `!` / `!!` - Bang/Double-bang: Important → Critical
- `?` / `??` - Question/Double-question: Needs clarification → Highly uncertain
- `-` / `--` - Tombstone/Instant-prune: Mark for removal → Remove ASAP

### Signal Combinations
- `*!todo` - Critical branch work (star + bang)
- `*?note` - Uncertain branch work (star + question)
- `!!alert` - Critical alert (double-bang)
- `-todo` - Mark for removal (tombstone)

## Quick Reference for Claude

### Most Common Patterns I'll Use
```javascript
// *todo ::: finish feature before merge   // Branch-scoped work
// *fix ::: resolve PR feedback            // Must fix before merge
// *!todo ::: critical bug blocking PR     // Urgent branch work
// todo ::: implement feature              // Work to do
// fix ::: bug description                 // Bugs to fix
// ::: important context here              // Pure notes (no marker)
// alert ::: security issue +security      // Alerts with tags (+ not #)
// todo ::: @agent write tests             // AI delegation
// temp ::: remove after deploy            // Temporary code
// !todo ::: critical bug fix              // Signal for urgency
// deprecated ::: use newMethod() instead  // Lifecycle marker
```

## Development Workflow

### Branch-Scoped Work with Star Signal
- Use `*` prefix for work that must be completed before PR merge
- Star signals are git-aware - CI only checks NEW stars in your branch
- Examples:
  ```javascript
  // *todo ::: add error handling here
  // *fix ::: resolve edge case from review
  // *!todo ::: critical security fix needed
  ```

### Waymark Search Patterns
- Find all todos: `rg "todo\s+:::"`
- Find branch work: `rg "\*\w+\s+:::"`
- Find critical items: `rg "!!\w+\s+:::"`
- Find AI assignments: `rg "@agent\s+:::"`

### Best Practices
- Always use HTML comments in markdown: `<!-- marker ::: description -->`
- Keep descriptions concise and actionable
- Use proper signal ordering: position signals first, then intensity
- Include context with `+tag` syntax when helpful
- Remove completed waymarks rather than leaving them

## Current Syntax Version

**Waymark Syntax v1.0** - Finalized 2025-06
- Core sigil: `:::`
- Position signals: `*` (star), `_` (underscore)
- Intensity signals: `!` `!!` `?` `??` `-` `--`
- Context system: `@actor`, `+tag`, `#ref`
- Multi-line support with proper indentation