# Common Patterns
<!-- :ga:tldr Essential grep-anchor patterns for any project -->
<!-- :ga:convention Core patterns that work universally across codebases -->

Core grep-anchor patterns that work across all projects.

## Tag Philosophy: Keep It Terse

**Consider using shorter tags.** They're quicker to type and easier to search:
- `sec` instead of `security`
- `perf` instead of `performance` 
- `ctx` instead of `context`
- `tmp` instead of `temporary`

Shorter tags can be helpful when you're using them frequently.

## Essential Patterns

### `:ga:tldr`
**Purpose**: Brief summary or overview ("Too Long; Didn't Read")
**Usage**: Document key takeaways, function purposes, or section summaries
```javascript
// :ga:tldr validates user input and returns sanitized data
// :ga:tldr handles all authentication flows for the app
```

### `:ga:todo`
**Purpose**: Work that needs to be done
**Replaces**: Traditional TODO comments
```javascript
// :ga:todo implement error handling
// :ga:todo add unit tests
```

### `:ga:ctx`
**Purpose**: Important context that isn't obvious from the code
**Usage**: Document assumptions, constraints, and critical knowledge
```python
# :ga:ctx all timestamps are UTC
# :ga:ctx user_ids are UUIDs, not integers
# :ga:ctx this runs in a Lambda with 256MB RAM limit
```

### `:ga:sec`
**Purpose**: Security-critical code that needs careful attention
**Usage**: Mark authentication, authorization, input validation, crypto
```go
// :ga:sec validate all inputs before SQL query
// :ga:sec ensure constant-time comparison
```

### `:ga:@agent`
**Purpose**: Direct AI agents to help with implementation
**Usage**: Can use generic @agent or specific ones like @cursor, @claude
```typescript
// :ga:@agent implement pagination logic
// :ga:@cursor write unit tests for edge cases
```

### `:ga:tmp`
**Purpose**: Temporary code that should be removed
**Usage**: Workarounds, quick fixes, migration code
```ruby
# :ga:tmp remove after v2.0 ships
# :ga:tmp workaround for Redis bug
```

## Quality & Maintenance

### `:ga:perf`
**Purpose**: Performance-sensitive code
**Usage**: Mark bottlenecks, optimization opportunities
```javascript
// :ga:perf N+1 query issue
// :ga:perf consider caching this result
```

### `:ga:bug`
**Purpose**: Known bugs or issues
**Usage**: Document problems that need fixing
```python
# :ga:bug race condition when concurrent requests
# :ga:bug doesn't handle Unicode properly
```

### `:ga:debt`
**Purpose**: Technical debt that needs addressing
**Usage**: Shortcuts taken, refactoring needed
```java
// :ga:debt tightly coupled to database
// :ga:debt needs proper error handling
```

### `:ga:fix` / `:ga:fixme`
**Purpose**: Broken code needing immediate attention
**Usage**: More urgent than bug or todo - this is actively broken
```python
# :ga:fix null pointer exception here
# :ga:fixme race condition in auth flow
```

### `:ga:breaking`
**Purpose**: Breaking changes to APIs or interfaces
**Usage**: Mark changes that will break compatibility
```typescript
// :ga:breaking removed legacy auth method in v3.0
// :ga:breaking changed return type from string to object
```

### `:ga:freeze`
**Purpose**: Code that must not be modified
**Usage**: Critical code, external dependencies, legal requirements
```go
// :ga:freeze regulatory compliance - do not modify
// :ga:freeze external API contract - must match exactly
```

### `:ga:review`
**Purpose**: Code needing human review before shipping
**Usage**: Complex logic, security-sensitive, architectural decisions
```rust
// :ga:review ensure this handles all edge cases
// :ga:review security team must approve this approach
```

### `:ga:config`
**Purpose**: Configuration values or settings
**Usage**: Values that might need environment-specific changes
```javascript
// :ga:config default timeout is 30s
// :ga:config production uses different endpoint
```

## Risk & Severity Indicators

### `:ga:warn` / `:ga:warning`
**Purpose**: Potential issues or risky code
**Usage**: Code that works but has risks or gotchas
```python
# :ga:warn this assumes sorted input
# :ga:warning rate limit not enforced here
```

### `:ga:crit` / `:ga:critical`
**Purpose**: Critical code requiring extreme care
**Usage**: System-critical paths, data integrity, financial calculations
```go
// :ga:crit payment processing - must be idempotent
// :ga:critical failover logic - test thoroughly
```

### `:ga:unsafe`
**Purpose**: Potentially dangerous operations
**Usage**: Memory operations, concurrency, security boundaries
```rust
// :ga:unsafe raw pointer manipulation
// :ga:unsafe bypasses permission checks for admin
```

### `:ga:danger`
**Purpose**: Extremely risky code that could cause major issues
**Usage**: Data deletion, irreversible operations, system-wide effects
```javascript
// :ga:danger deletes all user data - no recovery
// :ga:danger modifies production database directly
```

## Documentation & API

### `:ga:api`
**Purpose**: Public API surface
**Usage**: Mark public interfaces, REST endpoints, exported functions
```rust
// :ga:api public interface - maintain compatibility
// :ga:api REST endpoint: POST /users
```

### `:ga:docs`
**Purpose**: Documentation needed or important notes
**Usage**: Complex algorithms, public APIs, business logic
```go
// :ga:docs explain rate limiting algorithm
// :ga:docs add usage examples
```

### `:ga:meta`
**Purpose**: Metadata about files, scripts, or generated content
**Usage**: Configuration files, generated code, script purposes
```javascript
// :ga:meta Generated file - DO NOT EDIT MANUALLY
// :ga:meta Configuration for production environment
/* :ga:meta Script to generate security audit reports */
```

## Project Management

### `:ga:issue(ID)`
**Purpose**: Link to issue tracker
**Usage**: Connect code to tickets, PRs, or issues
```javascript
// :ga:issue(PROJ-123) implement user story
// :ga:issue(#456) fix reported bug
```

### `:ga:owner(@person)`
**Purpose**: Assign responsibility
**Usage**: Mark who should handle something
```python
# :ga:todo,@alice implement authentication
# :ga:owner(@backend-team) optimize query
```

## Combining Patterns

Combine tags judiciously for closely related concerns:

```typescript
// Good: closely related tags
// :ga:sec,todo validate inputs
// :ga:perf,debt refactor this loop

// Better: separate lines for clarity
// :ga:sec check for SQL injection
// :ga:todo add input validation for email format
// :ga:perf this loop processes 10k items inefficiently
// :ga:debt extract into separate service

// Good: issue tracking with description
// :ga:tmp,issue(#123) workaround until fixed upstream

// Avoid: too many tags, hard to grep
// :ga:api,docs,breaking,v2,urgent v2 changes signature
```

## Suggestions

- **Start with tldr** - `:ga:tldr` for summaries can be widely useful
- **Add todo and context** - These three patterns cover many use cases
- **Be consistent** - Picking a style and sticking to it helps
- **Keep it searchable** - Grep-ability is a key benefit
- **Document your choices** - Consider listing your patterns in README
- **Let it evolve** - Add patterns as you discover needs