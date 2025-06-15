---
description: "Authoring and using waymarks (`:::`) for precision navigation and instant context"
alwaysApply: true
---
# Waymark Navigation & Writing

## IDENTITY
You understand waymarks (`:::`) as the primary navigation system. Every `:::` is a searchable entry point that provides instant context. You use them to jump between code sections, understand constraints, and delegate work.

## WAYMARK BEHAVIORS

- Search first: `rg ":::"` → Find all waymarks | `rg "todo :::"` → Find work | `rg "alert :::"` → Find warnings
- Context always: `rg -C2 ":::"` → Show surrounding code | Never search without context
- Write precisely: One waymark = one concern → Space before `:::` when prefix present → Be specific
- Progressive search: Start broad → Filter by marker → Add context → Combine patterns

## CRITICAL PATTERNS

### Finding Work

```bash
rg "todo :::"              # All todos
rg "fix :::"               # All bugs
rg ":::.*@agent"           # AI tasks
rg "!{1,2}todo :::"        # Urgent work
```

### Context Discovery

```bash
rg ":::" file.js           # All waymarks in file
rg -C5 ":::" file.js       # With context
rg "^[^:]*:::"             # Pure notes (no marker)
```

### Writing Waymarks

```javascript
// todo ::: implement validation              // Basic work item
// alert ::: check permissions +security      // Alert with tag
// ::: all prices are in cents                // Pure context note
// !todo ::: critical bug fix                 // Urgent signal
// todo ::: @agent write tests                // AI delegation
```

## NAVIGATION WORKFLOW

1. Find entry points: `rg ":::" path/`
2. Gather context: `rg -B3 -A3 ":::" path/file.js`
3. Check related: `rg ":::.*validation" --type js`
4. Verify assumptions: `rg "^[^:]*:::" file.js`

## MARKER CATEGORIES (~41 total)

### Work
`todo` `fix` `done` `review` `refactor` `needs` `blocked`

### State
`temp` `deprecated` `draft` `stub` `cleanup`

### Alert
`alert` `risk` `notice` `always`

### Info
`tldr` `note` `summary` `example` `idea` `about` `docs`

### Quality
`test` `audit` `check` `lint` `ci`

### Performance
`perf` `hotpath` `mem` `io`

### Security
`sec` `auth` `crypto` `a11y`

### Meta (`--is meta`)
`flag` `important` `hack` `legal` `must` `assert`

## SIGNAL MODIFIERS

- `!` / `!!` → Critical / Blocker
- `?` / `??` → Needs clarification / Highly uncertain
- `*` / `**` → Bookmark / Canonical entry
- `~` → Experimental
- `^` → Protected (senior review required)
- `-` / `--` → Mark for removal / Prune ASAP
- `_` → Ignore (reserved)

## PROPERTIES & TAGS

```javascript
// todo ::: assign:@alice priority:high       // Properties
// alert ::: validate inputs +security        // Tags with +
// todo ::: fixes:#123 implement auth         // Issue refs with #
// deprecated ::: since:v1.0 use newMethod()  // Lifecycle
```

## SEARCH MASTERY

### By Category

```bash
rg "\b(todo|fix|done|review) :::"           # Work items
rg "\b(alert|risk|notice) :::"              # Warnings
rg "\b(hotpath|mem|io) :::"                 # Performance
```

### By Properties

```bash
rg ":::.*priority:(high|critical)"
rg ":::.*assign:@\w+"
rg ":::.*fixes:#\d+"
```

### By Tags

```bash
rg ":::.*\+security"
rg ":::.*\+frontend.*\+critical"
```

### Extract Data

```bash
rg -o "todo ::: .*@(\w+)" -r '$1' | sort | uniq -c    # Count by assignee
rg -o "\b(\w+) :::" -r '$1' | sort | uniq -c          # Count by marker
```

## WRITING RULES

- **Space before `:::`**: Required with prefix → `todo ::: task` ✅ | `todo::: task` ❌
- **One line, one concern**: Split complex waymarks → Each addresses single issue
- **Context liberally**: More `:::` pure notes = better understanding
- **Specific descriptions**: `fix ::: null check in auth` ✅ | `fix ::: bug` ❌
- **Tags at end**: `todo ::: implement OAuth +auth +backend`

## AI DELEGATION

```javascript
// todo ::: @agent implement with error handling
// todo ::: @claude optimize for performance
// review ::: @ai check for security issues
// ::: @agent constraints: use existing patterns
```

## MONOREPO PATTERNS

```javascript
// todo ::: implement feature +auth-service
// alert ::: affects all services +shared +breaking
// fix ::: payment validation +payment +critical
```

## REMEMBER
Waymarks are your navigation system. Search with context. Write with precision. One `:::` = one searchable entry point. Start simple → evolve naturally.
