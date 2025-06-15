<!-- ::: tldr canonical waymark syntax specification -->
# Waymark Syntax Specification

The canonical specification for waymark syntax - a breadcrumb protocol for code navigation.

## Overview

Waymarks provide a breadcrumb protocol that enables developers and AI agents to leave structured, searchable markers throughout codebases. The syntax accommodates diverse team preferences while recommending patterns that enable effective tooling and cross-project consistency.

## Core Grammar

```ebnf
waymark       ::= comment-leader identifier space marker-list prose?
identifier  ::= ":::"
space       ::= " "                    # exactly one ASCII space
marker-list ::= marker ("," marker)*
marker      ::= key delimiter?
key         ::= identifier | "@" identifier
delimiter   ::= ":" value | "(" params ")" | "[" array "]"
value       ::= identifier | quoted-string
params      ::= param ("," param)*
param       ::= key ":" value
array       ::= value ("," value)*
prose       ::= text                   # everything after markers
```

## Basic Structure

### The `:::` Identifier

The syntax uses `:::` as the identifier.

```javascript
// Standard identifier (mandatory single space after)
// ::: todo implement authentication
```

**Key Rules:**

- `:::` must be followed by exactly one ASCII space
- Three glyphs for visual clarity and fast typing
- Trivially matched with `':::'` in ripgrep

### Markers

Each marker classifies an anchor's purpose and is organized into one of six semantic groups for discoverability.

```javascript
// Core markers with mandatory space after identifier
// ::: todo implement rate limiting
// ::: fix memory leak in auth service
// ::: sec validate all user inputs
```

## Signal System

Signals act as intensity modifiers and position markers that can be prefixed to markers:

### Position Signals (first in chain)
- `*` - Star: Branch-scoped work that must be finished before PR merge
- `_` - Underscore: Ignore marker (reserved for future functionality)

### Intensity Signals
- `!` / `!!` - Bang/Double-bang: Important → Critical
- `?` / `??` - Question/Double-question: Needs clarification → Highly uncertain
- `-` / `--` - Tombstone/Instant-prune: Mark for removal → Remove ASAP

### Signal Combinations
```javascript
// Position signals come first, then intensity
// *todo ::: finish error handling before merge     // Branch-scoped work
// *!todo ::: critical issue blocking PR            // Urgent branch work
// !todo ::: important migration task               // Important (not branch-scoped)
// !!alert ::: critical security vulnerability      // Critical alert
// ?note ::: unclear if this handles edge case      // Needs clarification
// -todo ::: obsolete after v5 migration            // Mark for removal
```

## Delimiter Semantics

The syntax uses three distinct delimiters with specific semantic purposes:

### Colon (`:`) - Classifications

Used for type:value relationships, classifications, and states.

```javascript
// ::: priority:high         // priority classification
// ::: status:blocked        // status classification
// ::: env:production        // environment type
// ::: owner:@alice          // ownership (including mentions)
```

### Parentheses (`()`) - Parameters

Used for structured parameters and arguments associated with markers.

```javascript
// ::: blocked(issue:4)           // parameter with classification
// ::: depends(auth-service)      // simple parameter
// ::: config(timeout:30,retry:3) // multiple parameters
```

### Brackets (`[]`) - Arrays

Used for multiple values, optional for single values.

```javascript
// ::: blocked:[4,7]              // multiple blockers
// ::: tags:[auth,api,security]   // multiple tags
// ::: owner:[@alice,@bob]        // multiple owners
// ::: blocked:4                  // single value (brackets optional)
```

## Core Marker Groups

Markers are organized into eight semantic groups for discoverability (42 total markers):

| Group | Purpose | Primary markers (synonyms in parentheses) |
|-------|---------|-------------------------------------------|
| **work** | Work that needs to be done | `todo`, `fix`, `done`, `review`, `refactor`, `needs`, `blocked` |
| **alert** | Warnings & alerts | `alert`, `risk`, `notice`, `always` |
| **state** | Lifecycle / completeness | `temp`, `deprecated`, `draft`, `stub`, `cleanup` |
| **info** | Explanations & guidance | `tldr`, `note`, `summary`, `example`, `idea`, `about`, `docs` |
| **quality** | Quality & process | `test`, `audit`, `check`, `lint`, `ci` |
| **performance** | Performance focus | `perf`, `hotpath`, `mem`, `io` |
| **security** | Security & access | `sec`, `auth`, `crypto`, `a11y` |
| **meta** | Meta & special | `flag`, `important`, `hack`, `legal`, `must`, `assert` |

**Usage Rules:**

1. Multiple markers can be combined with commas: `::: todo,priority:high`
2. Markers from the same category should not be combined
3. Properties provide additional context and metadata

## Relational Patterns

Relationships are expressed directly through dedicated markers without redundant prepositions:

```javascript
// Dependency relationships
// ::: depends(auth-service)       // requires auth service
// ::: requires(api:v2-login)      // needs specific API
// ::: needs(config:redis)         // requires configuration

// Blocking relationships
// ::: blocked(issue:AUTH-123)     // blocked by issue
// ::: blocking:[PAY-45,UI-77]     // blocks multiple tasks

// Event relationships
// ::: emits(event:user-created)   // publishes event
// ::: listens(payment-completed)  // subscribes to event
// ::: triggers(workflow:deploy)   // initiates process
```

## Multi-line Anchors

The syntax strongly recommends single-line anchors to maintain grep-ability:

```javascript
// Single-line waymarks (preferred)
// ::: todo(assign:@alice,priority:high) implement OAuth integration

// Multiple related waymark lines for complex context
// ::: todo(assign:@alice,priority:high) implement OAuth integration  
// ::: context OAuth flow requires PKCE for security compliance
// ::: depends(service:session-api) user sessions must exist first
```

**Benefits:**

- `rg "::: todo"` always finds todo items
- Simple, consistent search patterns
- No complex multi-line parsing required

## Prose Formatting

Prose follows markers, separated by space. Optional formatting for clarity:

```javascript
// Basic prose
// ::: todo implement rate limiting

// Colon prefix (recommended for clarity)
// ::: todo: implement rate limiting before launch
// ::: context: this function assumes Redis is available

// Quoted prose (for complex text)
// ::: todo(priority:high): "fix race condition in auth service"
// ::: alert: "this function modifies global state"
```

## Quoting and Escaping

The syntax uses quotes for strings with special characters:

**Simple values** (no quotes needed):

```javascript
// ::: user(alice)
// ::: version(2.0.1)  
// ::: priority:high
```

**Complex values** (quotes required):

```javascript
// ::: match('user-123')              // literal string
// ::: path('src/data migration.sql') // spaces in path
// ::: message('Can\'t connect')      // escaped quote
// ::: files:['auth.js','lib/utils.js'] // array of paths
```

**No structural dots** - Use dots only for literals (versions, URLs, file paths)

## Configuration Integration

Teams can configure their preferred syntax patterns:

### Priority Schemes

```yaml
priorities:
  scheme: "numeric"  # or "named"
  numeric:
    p0: "critical"   # ::: p0 → ::: priority:critical
    p1: "high"       # ::: p1 → ::: priority:high
    p2: "medium"     # ::: p2 → ::: priority:medium
```

### Version Styles

```yaml
versioning:
  style: "semver"  # or "python", "ruby", "maven"
  semver:
    compatible: "^1.2.0"
    patch-level: "~1.2.0"
```

## Universal Parameter Groups

Parameters are organized into six semantic families that work with any marker:

| Group | Purpose | Examples |
|-------|---------|----------|
| **mention** | People / entities | `owner:@alice`, `assign:@bob`, `team:@frontend` |
| **relation** | Links & references | `parent:epic-123`, `depends:auth-svc`, `url:https://docs.example.com` |
| **workflow** | Coordination | `blocked:[4,7]`, `blocking:12`, `reason:compliance` |
| **priority** | Importance / risk | `priority:high`, `severity:critical`, `complexity:high` |
| **lifecycle** | Time / state | `since:1.2.0`, `until:2.0.0`, `status:in-progress` |
| **scope** | Environment / context | `env:prod`, `platform:ios`, `region:us-east` |

## Blessed Properties

The syntax defines a core set of "blessed" properties with special semantic meaning:

| Property | Purpose | Example |
|----------|---------|---------|
| `priority` | Task priority level | `priority:high`, `priority:p0` |
| `reason` | Explanation for state | `reason:compliance` |
| `since` | Starting version/time | `since:1.2.0` |
| `until` | Ending version/time | `until:2.0.0` |
| `version` | Applicable version | `version:3.1.4` |
| `affects` | What's impacted | `affects:auth-service` |
| `fixes` | Issues being fixed | `fixes:#431` |
| `closes` | Issues to close | `closes:#123` |
| `depends` | Dependencies | `depends:#456` |
| `branch` | Git branch reference | `branch:feature/auth` |

**Priority Aliases**: The `priority` property accepts both named levels and numeric aliases:
- `priority:critical` = `priority:p0`
- `priority:high` = `priority:p1`
- `priority:medium` = `priority:p2`
- `priority:low` = `priority:p3`

## Tool Integration Notes

While the syntax accommodates flexible usage, waymark tooling may implement stricter parsing:

- **Linters** may enforce consistent delimiter styles
- **Parsers** may require specific marker formats  
- **CLIs** may validate parameter content
- **IDEs** may provide completion based on established patterns

See [waymark documentation](../waymark/) for tooling-specific requirements.

## Marker Philosophy

**Core Principles:**

- No complex object syntax within waymarks
- No regex/pattern matching as core feature
- Focus on LLM context and navigation
- Waymark syntax must be expressive enough on its own

## Search Examples

```bash
# Find all waymarks
rg ":::"

# Find by marker group
rg ":::.*todo"      # All work items
rg ":::.*notice"    # All warnings/alerts
rg ":::.*domain"    # All domain-specific markers

# Find with context
rg -C2 "::: security"  # 2 lines context
rg -B3 -A3 "::: todo"  # 3 lines before/after

# Find in markdown (including HTML comments)
rg "<!-- :::" --type md
```
