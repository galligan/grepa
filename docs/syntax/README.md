<!-- tldr ::: Waymark syntax overview and core concepts -->
# Waymark Syntax

Waymark syntax is a lightweight marking system for code navigation using the `:::` sigil.

## Overview

Waymark syntax defines the **structure** for writing searchable code markers:

- The `:::` sigil with an optional marker
- Delimiter semantics (`:` for properties, `@` for actors)
- A fixed namespace of markers organized into semantic groups
- Properties, tags, and actors for metadata
- Simple, grep-friendly patterns

Think of it like learning to write musical notes - the syntax is simple and consistent, while what you compose with it can be infinitely varied.

## Basic Syntax

```text
<comment-leader> [signal][marker] ::: [actor] [context] [prose] [+tags]
```

The syntax consists of:

1. **Signal**: Optional urgency/emphasis symbol (`!`, `?`, `*`, etc.)
2. **Marker**: A high-signal keyword from a fixed list (e.g., `todo`, `fix`, `tldr`).
3. **Sigil**: `:::` separator (always preceded by a space when a marker is present).
4. **Actor**: Optional `@handle` identifying a person, team, or agent. **Must be the first token after the sigil.**
5. **Context**: Optional, structured `key:value` pairs using blessed keys (e.g., `fixes:#123`).
6. **Prose**: Human-readable description.
7. **Tags**: Classification tags prefixed with `+`.

### Quick Examples

```javascript
// todo ::: implement caching                    // Marker with prose
// fix ::: memory leak in auth priority:high     // Action first, then metadata
// ::: this is a useful pattern                  // Pure prose (no marker)
// alert ::: validates all inputs +security      // With a tag
// todo ::: @alice implement OAuth flow         // Assigned to an actor
// deprecated ::: use newMethod() instead until:v2.0   // Action first, blessed property after
```

## Feature Documentation

- **[Delimiter Syntax](features/delimiter-syntax.md)** - How `:::`, `:`, and `@` work
- **[Signal System](features/signal-syntax.md)** - Urgency and emphasis modifiers
- **[Context System](features/context-syntax.md)** - Properties, tags, and actors
- **[Star Signal](features/star-signal-ci.md)** - Branch-scoped work tracking
- **[Multi-line Support](features/multi-line-syntax.md)** - Extended waymark patterns
- **[TLDR System](features/tldr.md)** - Documentation summary patterns

## Philosophy

1. **Visual Clarity**: The `:::` sigil clearly separates markers from content.
2. **Progressive Complexity**: Start simple, add advanced features only when needed.
3. **Toolability**: A small set of blessed properties are structured for CLI/linting, while prose remains freeform.
4. **Action-First Principle**: The most actionable content appears first, with metadata as supporting context.
5. **Flexibility**: An open namespace for tags allows for adaptable classification.
6. **Searchability**: Every pattern is optimized for grep/ripgrep.
7. **AI-Friendly**: The structure is optimized for LLM context and navigation.
8. **Boring solutions for boring problems**: Using proven, simple patterns over unnecessary complexity.