<!-- tldr ::: Essential patterns and best practices for waymarks -->
# Waymark Conventions

> See [Syntax Specification](../../syntax/README.md) for complete grammar details.

Patterns and practices for making your codebase AI-navigable and human-friendly using waymarks.

## Quick Start

Begin with these five essential patterns:

1. `todo :::` - Work that needs doing
2. `pure note :::` - Important assumptions or constraints
3. `alert :::` - Security-critical or risky code
4. `@mentions` - AI agent instructions
5. `temp :::` - Temporary code to remove

That's it! You can search all of these with `rg ":::"`.

## Essential Patterns

### Work & Tasks

**`todo :::`** - Work that needs to be done
```javascript
// todo ::: implement error handling
// todo ::: priority:high add authentication
```

**`fix :::`** - Broken code needing immediate attention
```python
# fix ::: null pointer exception here
# fix ::: race condition in auth flow
```

**`done :::`** - Completed work for reference
```go
// done ::: implemented caching layer
// done ::: closes:#123 added rate limiting
```

### Context & Documentation

**`tldr :::`** - Brief summary or overview (one per file)
```javascript
// tldr ::: validates user input and returns sanitized data
```

**Pure notes** - Important context that isn't obvious
```python
# ::: all timestamps are UTC
# ::: user_ids are UUIDs, not integers
```

**`note :::`** - Documentation needed or important notes
```rust
// note ::: explain rate limiting algorithm
// docs ::: add usage examples
```

### Security & Risk

**`alert :::`** - Security concerns or potential issues
```go
// alert ::: validate all inputs before SQL query +security
// alert ::: ensure constant-time comparison +crypto
```

**`alert :::`** - Critical code requiring extreme care
```javascript
// alert ::: payment processing - must be idempotent +financial
```

**`risk :::`** - Dangerous operations
```rust
// risk ::: direct memory access without bounds checking
```

### Quality & Maintenance

**`temp :::`** - Temporary code to remove
```javascript
// temp ::: remove after Chrome 120 fix ships
// temp ::: workaround for Redis bug
```

**`cleanup :::`** - Code that needs refactoring
```java
// cleanup ::: tightly coupled to database
// cleanup ::: needs proper error handling
```

**`hack :::`** - Quick fixes that need proper solutions
```ruby
# hack ::: bypassing cache for demo
# hack ::: hardcoded timeout values
```

## AI Agent Patterns

### Direct Delegation

```python
# Direct AI implementation
# todo ::: @agent implement pagination
# todo ::: @claude write comprehensive tests
# todo ::: @cursor optimize this function

# With specific instructions
# todo ::: @agent use async/await, not callbacks
# todo ::: @agent add TypeScript types throughout
```

### Providing Context for AI

```javascript
// ::: uses Redux for state management
// ::: no external dependencies allowed
// ::: must be backwards compatible
```

### Review Requests

```go
// review ::: @ai check security implications
// audit ::: verify memory leak protection
```

## Team Workflows

### Task Management

**Priority Levels**
```javascript
// todo ::: priority:critical system down
// todo ::: priority:high major feature broken
// todo ::: priority:medium important bug
// todo ::: priority:low nice to have
```

**Assignment & Ownership**
```python
# todo ::: @alice payment module
# todo ::: @backend-team optimize query
# review ::: attn:@alice,@bob security review needed
```

**Status Tracking**
```javascript
// draft ::: do not merge yet
// hold ::: blocked waiting on API update
// review ::: ready for review
```

### Issue Integration

```javascript
// todo ::: fixes:#123 implement feature
// fix ::: closes:#456 security patch
// done ::: relates-to:PROJ-789 completed OAuth
```

## Properties Reference

### Core Properties

- **Assignment**: `assign:@person` or `attn:@person`
- **Priority**: `priority:high`, `priority:critical`
- **Dependencies**: `requires:package(version)`, `depends:service`
- **Issue tracking**: `fixes:#123`, `closes:#123`, `blocks:#123`
- **Lifecycle**: `deprecated:v2.0`, `since:v1.0`, `until:v3.0`
- **Files/paths**: `path:filename`, `affects:files`
- **Messages**: `message:"error text"`

### Usage Examples

```javascript
// todo ::: @alice priority:high implement auth
// alert ::: deprecated:v3.0 use newMethod() instead +breaking
// fix ::: affects:auth,api,frontend security vulnerability
// todo ::: requires:node(16,18,20) supports multiple versions
```

## Tag Patterns

### Common Tags

- `+security` - Security-related issues
- `+performance` - Performance concerns
- `+frontend` - Frontend-specific code
- `+backend` - Backend-specific code
- `+critical` - Critical priority items
- `+breaking` - Breaking changes
- `+a11y` - Accessibility concerns

### Hierarchical Tags

```javascript
// alert ::: input validation required +security/input
// todo ::: optimize rendering +performance/frontend
// fix ::: API rate limiting +backend/api/auth
```

## Best Practices

### 1. Waymarks Complement Documentation

Waymarks work alongside existing documentation:

```javascript
/**
 * Calculates the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate as decimal
 * @returns {number} Total price with tax
 */
function calculateTotal(price, taxRate) {
  // todo ::: add currency conversion support
  // ::: assumes USD for now
  // note ::: consider caching for repeated calculations +performance
  return price * (1 + taxRate);
}
```

### 2. Keep It Searchable

```bash
# Find all waymarks
rg ":::"

# Find specific patterns
rg "todo :::"              # All todos
rg "alert :::"             # Security/warning issues
rg ":::.*@alice"           # Alice's tasks
rg ":::.*priority:high"    # High priority items
rg "\+security"            # Security-related items
```

### 3. Separate Concerns

Better to use multiple waymarks than cramming everything into one:

```javascript
// ❌ Too much in one waymark (old ::: style)
// fix ::: priority:critical validate inputs add caching check permissions

// ✅ Clear and searchable
// alert ::: validate all user inputs +security
// todo ::: add rate limiting +performance  
// note ::: consider caching results
```

### 4. Be Consistent

Establish team conventions:
- Use consistent prefixes (`temp` vs `temporary`)
- Agree on priority schemes (`p0/p1/p2` vs `critical/high/medium/low`)
- Document your patterns in a CONVENTIONS.md file
- Use tags consistently across the codebase

### 5. Start Simple

Begin with basic patterns and add complexity only when needed:

```text
Level 0: Try one pattern (todo :::)
   ↓
Level 1: Add pure notes (:::)
   ↓
Level 2: Delegate to AI (@mentions)
   ↓
Level 3: Link to issues (fixes:#123)
   ↓
Level 4: Team-specific patterns
```

## HTML Comments in Markdown

For markdown files, use HTML comments to make waymarks searchable but not rendered:

```markdown
<!-- tldr ::: Quick summary of the document -->
<!-- todo ::: @galligan add more examples -->
<!-- note ::: Essential concept explanation -->
```

## Advanced Patterns

### Parameterized Properties

```javascript
// todo ::: supports:node(16,18,20) add compatibility
// ::: requires:react(>=17) minimum version required
// fix ::: affects:versions(1.0-2.5) security vulnerability
```

### Grouped Parameters

```javascript
// Verbose form
// todo ::: requires:npm(>=8) requires:node(16,18,20) upgrade deps

// Terse form (with brackets)
// todo ::: requires:[npm(>=8),node(16,18,20)] upgrade deps
```

## Migration from Old Syntax

If migrating from `:::` syntax:

```bash
# Find old waymarks
rg ":::"

# Convert basic patterns
sed -i 's/::: todo/todo :::/g' **/*.js
sed -i 's/::: sec/alert :::/g' **/*.js
sed -i 's/::: ctx/:::g' **/*.js
```

## Remember

The goal is **discoverability**, not perfection. Even one `:::` waymark makes your codebase more navigable than none. Waymarks are breadcrumbs for both humans and AI.

<!-- note ::: This file follows the new ::: syntax specification -->