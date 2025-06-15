<!-- tldr ::: Guidelines for writing about waymark syntax and tooling -->
# Waymark Language Guide

This guide helps maintain consistent language when writing about waymark.

## Core Distinction

**Waymark syntax** is passive and flexible - it defines patterns but doesn't enforce them.
**Waymark tooling** is active and opinionated - it enforces specific rules and behaviors.

## Writing About Syntax

The waymark syntax is a pattern specification, not an active system. Use language that reflects this passive nature.

### Recommended Words

- **accommodates** - "The syntax accommodates different delimiter styles"
- **allows** - "The syntax allows both prefix and pure note forms"
- **recognizes** - "The syntax recognizes parameterized markers"
- **accepts** - "Both forms are accepted in the syntax"
- **permits** - "The syntax permits flexible delimiter usage"
- **recommends** - "The syntax recommends using scope for clarity"

### Avoid

- ~~supports~~ - implies active system behavior
- ~~enforces~~ - syntax doesn't enforce, tools do
- ~~requires~~ - syntax is flexible, tools have requirements
- ~~validates~~ - tools validate, syntax defines

### Example

> The waymark syntax accommodates multiple forms. While `todo ::: priority:high implement cache` is recommended for structured metadata, pure notes like `::: this is performance critical` remain valid for contextual information.

## Writing About Tooling

Waymark tools are opinionated implementations. Use prescriptive language that clearly states behavior.

### Recommended Words

- **requires** - "The CLI requires scope for config types"
- **enforces** - "The linter enforces consistent delimiter usage"
- **validates** - "The parser validates parameter syntax"
- **implements** - "The CLI implements strict parsing"
- **generates** - "The tool generates relationship graphs"

### Avoid

- ~~accommodates~~ - tools are opinionated, not flexible
- ~~allows~~ - tools have specific rules
- ~~recommends~~ - tools enforce, not suggest

### Example

> The waymark CLI enforces the `:::` sigil syntax and validates prefix namespaces. This ensures consistent parsing across the codebase.

## Key Guidelines

### The `:::` Sigil

- Always preceded by space when prefix is present
- Three characters for visual clarity and fast typing
- Matched with simple string search: `':::'`
- Separates prefix from content clearly

### Delimiter Rules

- **`:::`** - the sigil that marks waymarks
- **Colon (`:`)** for properties: `priority:high`
- **Parentheses `()`** for parameterized values: `requires:node(>=16)`
- **Brackets `[]`** for grouped values: `requires:[npm(>=8),node(16,18,20)]`
- **Plus (`+`)** for tags: `+security`
- **At (`@`)** for mentions: `@alice`

### Not Supported

- Complex object syntax within waymarks
- Regular expressions as core feature
- Structural dots (only literal dots in versions, URLs)

## Writing Examples

### Syntax Documentation

> The waymark syntax uses the direct actor pattern:
> - `todo ::: @alice implement cache` - direct actor assignment
> - `::: @alice please review this approach` - mention in pure note

### Tool Documentation

> The waymark CLI validates prefix namespaces:
> ```bash
> waymark validate "todo ::: implement cache"  # Valid
> waymark validate "custom ::: task"           # Error: Unknown prefix
> ```

## Cross-References

When referencing between syntax and tooling:

> While the waymark syntax permits both forms, this tool enforces scoped parameters. See the syntax specification for underlying patterns.

## Common Pitfalls

❌ "Waymark supports multiple formats"
✅ "The waymark syntax accommodates multiple patterns"

❌ "The syntax requires proper formatting"
✅ "Waymark tools validate proper formatting"

❌ "The tool recommends using prefixes"
✅ "The tool validates prefix namespaces"