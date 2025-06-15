# Common Patterns
<!-- ::: tldr Essential waymark patterns for any project -->
<!-- ::: convention Core patterns that work universally across codebases -->

Core waymark patterns that work across all projects.

## Marker Philosophy: Keep It Terse

**Consider using shorter markers.** They're quicker to type and easier to search:

<!-- ::: fixme: We shouldn't encourage `ctx` or `tmp`. `context` and `temp` is fine -->

- `sec` rather than `security`
- `perf` rather than `performance`
- `ctx` rather than `context`
- `tmp` rather than `temporary`

Shorter markers can be helpful when you're using them frequently.

## Essential Patterns

### `::: tldr`

**Purpose**: Brief summary or overview ("Too Long; Didn't Read")
**Usage**: Document key takeaways, function purposes, or section summaries

```javascript
// ::: tldr validates user input and returns sanitized data
// ::: tldr handles all authentication flows for the app
```

### `::: todo`

**Purpose**: Work that needs to be done
**Replaces**: Traditional TODO comments

```javascript
// ::: todo implement error handling
// ::: todo add unit tests
```

### `::: context`

**Purpose**: Important context that isn't obvious from the code
**Usage**: Document assumptions, constraints, and critical knowledge

```python
# ::: context all timestamps are UTC
# ::: context user_ids are UUIDs, not integers
# ::: context this runs in a Lambda with 256MB RAM limit
```

### `::: sec`

**Purpose**: Security-critical code that needs careful attention
**Usage**: Mark authentication, authorization, input validation, crypto

```go
// ::: sec validate all inputs before SQL query
// ::: sec ensure constant-time comparison
```

### `::: @agent`

**Purpose**: Direct AI agents to help with implementation
**Usage**: Can use generic @agent or specific ones like @cursor, @claude

```typescript
// ::: @agent implement pagination logic
// ::: @cursor write unit tests for edge cases
```

### `::: temp`

**Purpose**: Temporary code that should be removed
**Usage**: Workarounds, quick fixes, migration code

```ruby
# ::: temp remove after v2.0 ships
# ::: temp workaround for Redis bug
```

## Quality & Maintenance

### `::: perf`

**Purpose**: Performance-sensitive code
**Usage**: Mark bottlenecks, optimization opportunities

```javascript
// ::: perf N+1 query issue
// ::: perf consider caching this result
```

### `::: bug`

**Purpose**: Known bugs or issues
**Usage**: Document problems that need fixing

```python
# ::: bug race condition when concurrent requests
# ::: bug doesn't handle Unicode properly
```

### `::: debt`

**Purpose**: Technical debt that needs addressing
**Usage**: Shortcuts taken, refactoring needed

```java
// ::: debt tightly coupled to database
// ::: debt needs proper error handling
```

### `::: fix` / `:M: fixme`

**Purpose**: Broken code needing immediate attention
**Usage**: More urgent than bug or todo - this is actively broken

```python
# ::: fix null pointer exception here
# ::: fixme race condition in auth flow
```

### `::: breaking`

**Purpose**: Breaking changes to APIs or interfaces
**Usage**: Mark changes that will break compatibility

```typescript
// ::: breaking removed legacy auth method in v3.0
// ::: breaking changed return type from string to object
```

### `::: freeze`

**Purpose**: Code that must not be modified
**Usage**: Critical code, external dependencies, legal requirements

```go
// ::: freeze regulatory compliance - do not modify
// ::: freeze external API contract - must match exactly
```

### `::: review`

**Purpose**: Code needing human review before shipping
**Usage**: Complex logic, security-sensitive, architectural decisions

```rust
// ::: review ensure this handles all edge cases
// ::: review security team must approve this approach
```

### `::: config`

**Purpose**: Configuration values or settings
**Usage**: Values that might need environment-specific changes

```javascript
// ::: config default timeout is 30s
// ::: config production uses different endpoint
```

## Risk & Severity Indicators

### `::: warn` / `:M: warning`

**Purpose**: Potential issues or risky code
**Usage**: Code that works but has risks or gotchas

```python
# ::: warn this assumes sorted input
# ::: warning rate limit not enforced here
```

### `::: crit` / `:M: critical`

**Purpose**: Critical code requiring extreme care
**Usage**: System-critical paths, data integrity, financial calculations

```go
// ::: crit payment processing - must be idempotent
// ::: critical failover logic - test thoroughly
```

### `::: unsafe`

**Purpose**: Potentially dangerous operations
**Usage**: Memory operations, concurrency, security boundaries

```rust
// ::: unsafe raw pointer manipulation
// ::: unsafe bypasses permission checks for admin
```

### `::: danger`

**Purpose**: Extremely risky code that could cause major issues
**Usage**: Data deletion, irreversible operations, system-wide effects

```javascript
// ::: danger deletes all user data - no recovery
// ::: danger modifies production database directly
```

## Documentation & API

### `::: api`

**Purpose**: Public API surface
**Usage**: Mark public interfaces, REST endpoints, exported functions

```rust
// ::: api public interface - maintain compatibility
// ::: api REST endpoint: POST /users
```

### `::: docs`

**Purpose**: Documentation needed or important notes
**Usage**: Complex algorithms, public APIs, business logic

```go
// ::: docs explain rate limiting algorithm
// ::: docs add usage examples
```

### `::: meta`

**Purpose**: Metadata about files, scripts, or generated content
**Usage**: Configuration files, generated code, script purposes

```javascript
// ::: meta Generated file - DO NOT EDIT MANUALLY
// ::: meta Configuration for production environment
/* ::: meta Script to generate security audit reports */
```

## Project Management

### `::: issue(ID)`

**Purpose**: Link to issue tracker
**Usage**: Connect code to tickets, PRs, or issues

```javascript
// ::: issue(PROJ-123) implement user story
// ::: issue(#456) fix reported bug
```

### `::: owner:@person`

**Purpose**: Assign responsibility
**Usage**: Mark who should handle something

```python
# ::: todo, owner:@alice implement authentication
# ::: owner:@backend-team optimize query
```

## Combining Patterns

Combine markers judiciously for closely related concerns:

```typescript
// Good: closely related markers
// ::: sec, todo validate inputs
// ::: perf, debt refactor this loop

// Better: separate lines for clarity
// ::: sec check for SQL injection
// ::: todo add input validation for email format
// ::: perf this loop processes 10k items inefficiently
// ::: debt extract into separate service

// Good: issue tracking with description
// ::: temp, issue(#123) workaround until fixed upstream

// Avoid: too many markers, hard to grep
// ::: api, docs, breaking, v2, urgent v2 changes signature
```

## Suggestions

- **Start with tldr** - `::: tldr` for summaries can be widely useful
- **Add to-do and context** - These three patterns cover many use cases
- **Be consistent** - Picking a style and sticking to it helps
- **Keep it searchable** - Grep-ability is a key benefit
- **Document your choices** - Consider listing your patterns in README
- **Let it evolve** - Add patterns as you discover needs
