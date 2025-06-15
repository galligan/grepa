<!-- tldr ::: Signal modifiers for urgency, emphasis, and position in waymarks -->
# Signal Syntax

Signals act as **intensity modifiers** and **position markers** with context-dependent meaning.

## Signal Types

### Position Signals
- `*` (Star) - Branch-scoped work that must be finished before PR merge
- `_` (Underscore) - Ignore marker (reserved for future functionality)

### Intensity Signals
- `!` / `!!` (Bang / Double-bang) - Important → Critical
- `?` / `??` (Question / Double-question) - Needs clarification → Highly uncertain  
- `-` / `--` (Tombstone / Instant-prune) - Mark for removal → Remove ASAP

## Signal Reference Table

| Symbol | Name | Meaning (varies by marker context) |
|--------|------|---------|
| `*` | Star | Branch-scoped work that must be finished before PR merge |
| `!` / `!!` | Bang / Double-bang | Intensity modifier: important → critical |
| `?` / `??` | Question / Double-question | `?` needs clarification · `??` highly uncertain |
| `-` / `--` | Tombstone / Instant-prune | `-` mark for removal · `--` prune ASAP |
| `_` | Underscore | Ignore marker (reserved for future functionality) |

## Contextual Interpretation

The `!` and `!!` signals have different meanings based on the marker:

- **Work markers** (`todo`, `fix`): urgency/priority level
- **Info markers** (`tldr`, `note`): importance/must-read status
- **Alert markers** (`alert`, `risk`): severity/criticality
- **Requirement markers** (`must`, `assert`, `always`): criticality of invariant

## Examples

### Position Signals
```javascript
// *todo ::: finish error handling before merge   // Branch-scoped work
// *fix ::: resolve edge case found in review     // Must fix before PR merge
// *!todo ::: critical bug blocking PR merge      // Urgent branch work
```

### Intensity Signals
```javascript
// !todo ::: migrate to new hashing algo          // Important task
// !!todo ::: fix data loss bug                   // Critical blocker
// ?note ::: does pagination handle zero items?   // Unclear assumption
// !tldr ::: core event-loop entry point          // Important summary
// !!tldr ::: main application entry point        // Most critical/canonical
// !!alert ::: patch data-loss vulnerability      // Critical security issue
// !must ::: array length must be power of two    // Important requirement
// !!assert ::: user_id never null                // Critical invariant
// -todo ::: obsolete after migrating to v5 SDK   // Remove later
```

## Grammar Rules

```ebnf
# Position and intensity signals are separate
position_signal ::= "*" | "_"
intensity_signal ::= ("!!" | "!" | "??" | "?" | "--" | "-")
signal ::= position_signal? intensity_signal?

# High-signal keyword with optional signal prefix
marker ::= signal? ALPHANUM_
```

## Best Practices

1. **Signal Order**: Position signals (`*`, `_`) come first, then intensity signals (`!`, `?`, `-`)
2. **Mutual Exclusion**: Star (`*`) and underscore (`_`) are mutually exclusive
3. **Context Matters**: The same signal can mean different things for different markers
4. **Progressive Intensity**: Use `!` for important, `!!` for critical
5. **Branch Awareness**: Use `*` for work that must complete before PR merge