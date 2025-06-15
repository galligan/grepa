<!-- tldr ::: Delimiter semantics for waymark sigil, properties, and actors -->
# Delimiter Syntax

Each delimiter in waymark syntax has a specific purpose and semantic meaning.

## `:::` - The Sigil

The core waymark identifier that separates prefix from content:

```javascript
// todo ::: implement validation    // marker + content
// ::: this is just a note          // pure note (no marker)
```

**Rules:**
- Must be preceded by a space when a marker is present
- Separates the marker/signal portion from the content
- Can be used alone for pure notes without markers

## `:` - Properties

Creates `key:value` pairs. When used with a "blessed key", it provides structured metadata. The **action-first principle** means these should appear after the main actionable content.

```javascript
// todo ::: @alice implement caching priority:high
// deprecated ::: use newMethod() instead until:v2.0
// fix ::: memory leak in auth fixes:#456
```

**Blessed Property Keys:**

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

## `@` - Mentions (Actors)

Identifies a person, team, or agent. It only assigns ownership if it is the **first token** after `:::`.

```javascript
// todo ::: @bob implement caching     // Assigned to bob
// needs ::: @carol help from @dave    // Assigned to carol, mentions dave
```

**Rules:**
- Must be the first token after `:::` to assign ownership
- Additional `@mentions` in prose are just references
- Can reference people, teams, or agents (like `@agent`)

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