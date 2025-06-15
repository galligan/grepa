<!-- tldr ::: Complete waymark syntax specification using the `:::` sigil -->
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

## Syntax Components

### Markers

Optional classifiers from a fixed namespace (~41 total) that appear before `:::`:

```javascript
// todo ::: implement validation
// fix ::: memory leak in auth
// alert ::: security vulnerability
// tldr ::: JWT auth middleware validating Bearer tokens via RS256
```

### Properties (Context Tokens)

A small, "blessed" set of `key:value` pairs that provide structured, machine-readable metadata. Following the **action-first principle**, these should appear after the main actionable content.

Other `key:value` pairs can exist anywhere in the free-form prose.

```javascript
// todo ::: implement caching fixes:#431
// deprecated ::: use newMethod() instead until:v2.0
// fix ::: @alice investigate memory leak depends:#123
// todo ::: implement OAuth flow branch:feature/auth
```

**Priority Levels**: The `priority` property accepts both named levels (`critical`, `high`, `medium`, `low`) and numeric aliases (`p0`, `p1`, `p2`, `p3`) which are synonyms:

- `priority:critical` = `priority:p0`
- `priority:high` = `priority:p1`  
- `priority:medium` = `priority:p2`
- `priority:low` = `priority:p3`

### Tags

Classification tags for grouping and filtering (use + prefix):

```javascript
// todo ::: implement auth flow +security +backend
// fix ::: button contrast issue +critical +frontend +a11y
```

### @Mentions (Actors)

An actor is a person, team, or agent reference. To be parsed as the assignee, the `@mention` **must be the first token** immediately following the `:::` sigil.

```javascript
// todo ::: @bob implement caching
// review ::: @security-team please review this approach
// needs ::: @carol input from @dave
```

## Grammar

The complete formal grammar in EBNF, as defined in the latest specification:

```ebnf
# Position and intensity signals are separate
position_signal ::= "*" | "_"
intensity_signal ::= ("!!" | "!" | "??" | "?" | "--" | "-")
signal ::= position_signal? intensity_signal?

# High-signal keyword
marker     ::= signal? ALPHANUM_

# Optional actor
actor      ::= "@" ALPHANUM_

# Context token – one word or blessed key:value
context    ::= word | key_value
key_value  ::= key ":" value
key        ::= "reason" | "since" | "until" | "version" | "affects" | "fixes" | "closes" | "depends" | "branch"
value      ::= word | "#" [0-9]+ | quoted_string

# Tag – optional label tokens starting with +
tag        ::= "+" [A-Za-z0-9_/-]+

# Waymark full
# First token after ::: determines type: actor (@) > context (word/key:value)
# Order is flexible but first token has precedence for parsing
waymark    ::= comment_leader marker? ":::" (actor space)? context? (space tag)* (space prose)?

word       ::= [A-Za-z0-9_]+
quoted_string ::= '"' [^"]* '"'
space      ::= " "
prose      ::= .*
```

## Delimiter Semantics

Each delimiter has a specific purpose:

### `:::` - The Sigil

The core waymark identifier that separates prefix from content:

```javascript
// todo ::: implement validation    // marker + content
// ::: this is just a note          // pure note (no marker)
```

### `:` - Properties

Creates `key:value` pairs. When used with a "blessed key", it provides structured metadata. The **action-first principle** means these should appear after the main actionable content.

```javascript
// todo ::: @alice implement caching priority:high
// deprecated ::: use newMethod() instead until:v2.0
```

### `@` - Mentions (Actors)

Identifies a person, team, or agent. It only assigns ownership if it is the **first token** after `:::`.

```javascript
// todo ::: @bob implement caching
// needs ::: @carol help from @dave
```

## Marker Categories

Markers are organized into 8 semantic categories (~41 total):

### Work (`--is work`)
`todo`, `fix`, `done`, `review`, `refactor`, `needs`, `blocked`

### State & Lifecycle (`--is state`)
`temp`, `deprecated`, `draft`, `stub`, `cleanup`

### Alert (`--is alert`)
`alert`, `risk`, `notice`, `always`

### Information & Documentation (`--is info`)
`tldr`, `note`, `summary`, `example`, `idea`, `about`, `docs`

### Quality & Process (`--is quality`)
`test`, `audit`, `check`, `lint`, `ci`

### Performance (`--is performance`)
`perf`, `hotpath`, `mem`, `io`

### Security & Access (`--is security`)
`sec`, `auth`, `crypto`, `a11y`

### Meta & Special (`--is meta`)
`flag`, `important`, `hack`, `legal`, `must`, `assert`

**Usage Rules:**
1. Only one marker per waymark
2. Markers are optional - waymarks can be pure notes
3. Signals can modify markers: `!todo :::`, `!!alert :::`

## Signal Modifiers

Signals act as **intensity modifiers** with context-dependent meaning:

| Symbol | Name | Meaning (varies by marker context) |
|--------|------|---------|
| `*` | Star | Branch-scoped work that must be finished before PR merge |
| `!` / `!!` | Bang / Double-bang | Intensity modifier: important → critical |
| `?` / `??` | Question / Double-question | `?` needs clarification · `??` highly uncertain |
| `-` / `--` | Tombstone / Instant-prune | `-` mark for removal · `--` prune ASAP |
| `_` | Underscore | Ignore marker (reserved for future functionality) |

### Contextual Interpretation

The `!` and `!!` signals have different meanings based on the marker:

- **Work markers** (`todo`, `fix`): urgency/priority level
- **Info markers** (`tldr`, `note`): importance/must-read status
- **Alert markers** (`alert`, `risk`): severity/criticality
- **Requirement markers** (`must`, `assert`, `always`): criticality of invariant

Examples:

```javascript
// *todo ::: finish error handling before merge   // Branch-scoped work
// *fix ::: resolve edge case found in review     // Must fix before PR merge
// *!todo ::: critical bug blocking PR merge      // Urgent branch work
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

## Blessed Property Keys

While any `key:value` pair can appear in the prose of a waymark, a small, "blessed" set of keys are formally recognized for structured, searchable metadata. Following the **action-first principle**, these appear after the main actionable content.

| Key | Purpose | Example |
|---|---|---|
| **reason** | Root cause / risk label | `reason:sql_injection` |
| **since** | First version/date introduced | `since:v4.2` |
| **until** | Planned removal version/date | `until:v6.0` |
| **version** | Explicit semver reference | `version:v1.0.1` |
| **affects** | Impacted subsystem/module | `affects:payments` |
| **fixes** | Resolves the given ticket | `fixes:#456` |
| **closes** | Closes ticket/PR | `closes:#12` |
| **depends** | Depends on external ticket | `depends:#789` |
| **branch** | Git branch reference | `branch:feature/auth` |

`priority` is also a commonly used key (e.g., `priority:high`). While not a blessed key, it is a widely adopted convention. Priorities can also be indicated with signals (`!todo` for high, `!!todo` for critical).

## Advanced Patterns

### Task Management

```javascript
// Basic tasks
// todo ::: implement validation
// fix ::: memory leak in auth priority:high
// done ::: added rate limiting

// With assignments and properties
// todo ::: @alice implement caching priority:high
// review ::: @bob check auth logic +security
```

### Code Lifecycle

```javascript
// Maturity markers
// stub ::: basic implementation
// draft ::: work in progress
// note ::: production ready status:stable
// deprecated ::: use newMethod() instead until:v2.0
```

### Issue Integration

```javascript
// Issue references (action-first principle)
// todo ::: implement auth flow fixes:#234
// done ::: added validation closes:#456
// fix ::: waiting on API changes depends:#123
```

### Branch-Specific Work

```javascript
// Feature development
// todo ::: implement OAuth flow branch:feature/auth
// fix ::: payment validation branch:feature/payments fixes:#567

// Hotfix tracking
// !!fix ::: critical vulnerability branch:hotfix/security-patch
// review ::: @security-team urgent review needed branch:hotfix/data-loss

// Release coordination
// note ::: feature freeze in effect branch:release/v2.1
// todo ::: merge after QA approval branch:main
```

### Monorepo Patterns

Use tags to provide namespacing for services, packages, or apps within a monorepo. This is more flexible and searchable than using custom properties.

```javascript
// todo ::: implement OAuth +auth +backend
// fix ::: payment validation +payment +security
// refactor ::: move to shared types +ui-kit +types
```

## Quoting Rules

Simple values need no quotes:

```javascript
// todo ::: priority:high
// ::: version:2.0.1
// todo ::: @alice
```

Use quotes for values with spaces or special characters:

```javascript
// alert ::: handle connection errors message:"Can't connect to database" 
// note ::: path:"src/data migration.sql"
// ::: reason:"waiting for compliance approval"
```

## Search Examples

```bash
# Find all waymarks
rg -n ":::"

# Find by marker
rg -n "todo :::"
rg -n "fix :::"
rg -n "alert :::"

# Find by properties (anywhere in waymark content after :::)
rg -n ":::.*priority:high"
rg -n ":::.*fixes:#\d+"

# Find by assignee (anywhere in waymark content after :::)
rg -n ":::.*@alice"
rg -n ":::.*@$(whoami)"                    # Work assigned to you

# Find by branch (anywhere in waymark content after :::)
rg -n ":::.*branch:feature/"
rg -n ":::.*branch:hotfix/"
rg -n ":::.*branch:release/"

# Find by tags
rg -n "\+security"
rg -n "\+frontend"

# Find with context
rg -C2 "todo :::"  # 2 lines before/after
rg -B3 -A3 "fix :::"  # 3 lines before/after

# Find in markdown (HTML comments)
rg -n "<!-- .*:::" --type md

# Advanced searches (combining multiple criteria)
rg -n ":::.*priority:high.*\+security"     # High-priority security
rg -n ":::.*@alice.*branch:feature/"       # Alice's feature work
rg -n ":::.*fixes:#\d+"                    # Issue fixes
rg -n ":::.*branch:feature/auth.*@bob"     # Bob's work on auth feature
rg -n "todo.*:::.*@alice"                  # Alice's todos specifically

# Issue-specific searches
rg -n ":::.*#234\b"                        # All references to issue #234
rg -n ":::.*depends:#\d+"                  # What depends on issues
rg -n ":::.*closes:#\d+"                   # What closes issues/PRs
```

## Best Practices

1. **Space before `:::`**: Required when a marker is present.
2. **One waymark per line**: Maintains grep-ability.
3. **Actor First**: Place the `@mention` assignee immediately after `:::` for it to be recognized.
4. **Action-First Principle**: Put the most actionable content immediately after the actor (or `:::` if no actor), with blessed properties as supporting metadata.
5. **Be specific**: Use clear markers and blessed properties when appropriate.
6. **Start simple**: Begin with basic markers, add properties and tags as needed.
7. **Keep it searchable**: Simple patterns are easier to grep.
8. **Line length**: Keep under ~80-120 characters for readable output.
9. **Use HTML comments in markdown**: `<!-- note ::: summary -->` for non-rendered waymarks.
10. **Pure prose**: Use waymarks without markers for general context: `// ::: this explains why`.

## Philosophy

1. **Visual Clarity**: The `:::` sigil clearly separates markers from content.
2. **Progressive Complexity**: Start simple, add advanced features only when needed.
3. **Toolability**: A small set of blessed properties are structured for CLI/linting, while prose remains freeform.
4. **Action-First Principle**: The most actionable content appears first, with metadata as supporting context.
5. **Flexibility**: An open namespace for tags allows for adaptable classification.
6. **Searchability**: Every pattern is optimized for grep/ripgrep.
7. **AI-Friendly**: The structure is optimized for LLM context and navigation.
8. **Boring solutions for boring problems**: Using proven, simple patterns over unnecessary complexity.