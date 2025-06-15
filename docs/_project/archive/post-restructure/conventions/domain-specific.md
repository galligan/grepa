# Domain-Specific Patterns
<!-- ::: tldr Specialized patterns for specific technical domains -->
<!-- ::: convention Domain-specific waymarks for security, performance, and more -->

Specialized waymarks for specific technical domains and concerns.

## Security

### `::: sec`

**Purpose**: Security-critical code requiring review

```javascript
// ::: sec validate all inputs before SQL query
// ::: sec, p0 authentication bypass vulnerability
```

### `::: vuln`

**Purpose**: Known vulnerability

```python
# ::: vuln CVE-2024-1234 needs patch
```

### `::: crypto`

**Purpose**: Cryptographic operations

```go
// ::: crypto constant-time comparison required
```

### `::: auth`

**Purpose**: Authentication/authorization

```java
// ::: auth check permissions before access
```

## Performance

### `::: perf`

**Purpose**: Performance-critical sections

```rust
// ::: perf hot path - optimize carefully
// ::: perf, p1 N+1 query problem
```

### `::: bench`

**Purpose**: Needs benchmarking

```go
// ::: bench measure before optimizing
```

### `::: cache`

**Purpose**: Caching considerations

```python
# ::: cache consider memoization
# ::: cache invalidation needed
```

### `::: async`

**Purpose**: Asynchronous operations

```javascript
// ::: async avoid blocking main thread
```

## Accessibility

### `::: a11y`

**Purpose**: Accessibility requirements

```html
<!-- ::: a11y add ARIA labels -->
<!-- ::: a11y, wcag ensure AA compliance -->
```

### `::: i18n`

**Purpose**: Internationalization

```javascript
// ::: i18n extract hardcoded strings
```

### `::: rtl`

**Purpose**: Right-to-left support

```css
/* ::: rtl needs directional styles */
```

## Data & Storage

### `::: migration`

**Purpose**: Database migrations

```sql
-- ::: migration breaking change in v2
-- ::: migration, rollback plan needed
```

### `::: index`

**Purpose**: Database indexing

```sql
-- ::: index add covering index for query
```

### `::: schema`

**Purpose**: Schema changes

```graphql
# ::: schema breaking change
# ::: schema, deprecated remove in v3
```

## Architecture

### `::: pattern`

**Purpose**: Design pattern implementation

```java
// ::: pattern singleton - thread safety
// ::: pattern, factory consider dependency injection
```

### `::: coupling`

**Purpose**: Coupling concerns

```python
# ::: coupling high - needs refactoring
# ::: coupling, tech database-specific
```

### `::: debt`

**Purpose**: Technical debt

```javascript
// ::: debt, refactor extract to service
// ::: debt, p2 legacy code needs update
```

## Platform Specific

### `::: browser`

**Purpose**: Browser compatibility

```javascript
// ::: browser, ie11 needs polyfill
// ::: browser, safari webkit prefix required
```

### `::: mobile`

**Purpose**: Mobile considerations

```swift
// ::: mobile, memory watch for leaks
// ::: mobile, battery optimize polling
```

### `::: platform`

**Purpose**: Platform-specific code

```python
# ::: platform, windows path handling
# ::: platform, linux permissions check
```

## Testing & Quality

### `::: test`

**Purpose**: Testing requirements

```javascript
// ::: test, unit add edge cases
// ::: test, integration mock external service
```

### `::: coverage`

**Purpose**: Code coverage gaps

```python
# ::: coverage error path not tested
```

### `::: flaky`

**Purpose**: Unreliable tests

```go
// ::: flaky timing-dependent test
```

## API & Contracts

### `::: breaking`

**Purpose**: Breaking changes

```typescript
// ::: breaking, v3 parameter order changed
```

### `::: deprecated`

**Purpose**: Deprecation notices

```java
// ::: deprecated use newMethod() instead
// ::: deprecated, remove:v4.0
```

### `::: experimental`

**Purpose**: Unstable features

```rust
// ::: experimental API may change
```

## Best Practices

1. **Combine with Priority**: `::: sec, p0` for critical security
2. **Add Context**: Include specific concern after waymark
3. **Version Breaking Changes**: `::: breaking, v2`
4. **Link Standards**: `::: a11y, wcag-2.1`
5. **Specify Platforms**: `::: browser, chrome, firefox`
