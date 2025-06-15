<!-- tldr ::: Context system including markers, properties, tags, and actors -->
# Context Syntax

The waymark context system provides structured metadata through markers, properties, tags, and actors.

## Markers

Optional classifiers from a fixed namespace (42 total) that appear before `:::`:

```javascript
// todo ::: implement validation
// fix ::: memory leak in auth
// alert ::: security vulnerability
// tldr ::: JWT auth middleware validating Bearer tokens via RS256
```

### Marker Categories

Markers are organized into 8 semantic categories:

#### Work (`--is work`)
`todo`, `fix`, `done`, `review`, `refactor`, `needs`, `blocked`

#### State & Lifecycle (`--is state`)
`temp`, `deprecated`, `draft`, `stub`, `cleanup`

#### Alert (`--is alert`)
`alert`, `risk`, `notice`, `always`

#### Information & Documentation (`--is info`)
`tldr`, `note`, `summary`, `example`, `idea`, `about`, `docs`

#### Quality & Process (`--is quality`)
`test`, `audit`, `check`, `lint`, `ci`

#### Performance (`--is performance`)
`perf`, `hotpath`, `mem`, `io`

#### Security & Access (`--is security`)
`sec`, `auth`, `crypto`, `a11y`

#### Meta & Special (`--is meta`)
`flag`, `important`, `hack`, `legal`, `must`, `assert`

**Usage Rules:**
1. Only one marker per waymark
2. Markers are optional - waymarks can be pure notes
3. Signals can modify markers: `!todo :::`, `!!alert :::`

## Properties (Context Tokens)

A small, "blessed" set of `key:value` pairs that provide structured, machine-readable metadata. Following the **action-first principle**, these should appear after the main actionable content.

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

## Tags

Classification tags for grouping and filtering (use + prefix):

```javascript
// todo ::: implement auth flow +security +backend
// fix ::: button contrast issue +critical +frontend +a11y
```

### Monorepo Patterns

Use tags to provide namespacing for services, packages, or apps within a monorepo:

```javascript
// todo ::: implement OAuth +auth +backend
// fix ::: payment validation +payment +security
// refactor ::: move to shared types +ui-kit +types
```

## @Mentions (Actors)

An actor is a person, team, or agent reference. To be parsed as the assignee, the `@mention` **must be the first token** immediately following the `:::` sigil.

```javascript
// todo ::: @bob implement caching
// review ::: @security-team please review this approach
// needs ::: @carol input from @dave
```

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
```

## Grammar

```ebnf
# Optional actor
actor      ::= "@" ALPHANUM_

# Context token – one word or blessed key:value
context    ::= word | key_value
key_value  ::= key ":" value
key        ::= "reason" | "since" | "until" | "version" | "affects" | "fixes" | "closes" | "depends" | "branch"
value      ::= word | "#" [0-9]+ | quoted_string

# Tag – optional label tokens starting with +
tag        ::= "+" [A-Za-z0-9_/-]+

# First token after ::: determines type: actor (@) > context (word/key:value)
waymark    ::= comment_leader marker? ":::" (actor space)? context? (space tag)* (space prose)?
```