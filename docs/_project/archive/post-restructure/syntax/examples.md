# Waymark Examples
<!-- ::: tldr Pure syntax examples showing waymark patterns in various contexts -->
<!-- ::: syntax Examples of waymark syntax across languages -->

Pure syntax examples showing waymark patterns in various contexts.

## Basic Syntax

### Simple Markers

```javascript
// ::: todo
// ::: fix
// ::: security
// ::: @alice
```

### Multiple Markers

```python
# ::: fix,sec                    # Good: closely related
# ::: todo(priority:critical)    # Priority parameter
# ::: todo,refactor,perf         # Consider splitting for clarity
```

### Parameters with Colons

```go
// ::: priority:high
// ::: status:blocked
// ::: owner:@alice
```

### Arrays with Brackets

```ruby
# ::: tags:[frontend,backend,api]
# ::: reviewers:[@alice,@bob]
# ::: blocked:[4,7,12]
```

## Language Examples

### JavaScript/TypeScript

```javascript
// ::: todo implement error handling
/* ::: perf(priority:medium) optimize render loop */
/** 
 * ::: api public interface
 */
```

### Python

```python
# ::: fix handle None case
"""
::: module authentication system
"""
# ::: test,assign:@qa needs integration tests
```

### Go

```go
// ::: todo add context support
/* ::: breaking api change in v2 */
// ::: config(goroutine:true,poolSize:10)
```

### Rust

```rust
// ::: unsafe review needed
/* ::: perf,todo optimize allocations */
/// ::: api public trait
```

### Java

```java
// ::: deprecated use newMethod() instead
/* ::: todo(sync:required) thread safety */
/** ::: since:v1.5 */
```

### HTML/XML

```html
<!-- ::: todo(a11y:required) add aria labels -->
<!-- ::: seo,priority:high meta tags missing -->
<!-- ::: responsive breakpoint -->
```

### CSS

```css
/* ::: theme dark mode support */
/* ::: todo(browser:ie11) fallback needed */
/* ::: refactor use CSS vars */
```

### SQL

```sql
-- ::: todo(index:covering) add covering index
-- ::: perf,todo slow join optimization
/* ::: migration required for v2 */
```

### Bash/Shell

```bash
# ::: todo(posix:required) ensure compatibility
# ::: error needs error handling
# ::: todo add getopts parsing
```

### YAML

```yaml
# ::: config production values
# ::: security needs encryption
# ::: todo validate schema check
```

### Markdown

```markdown
<!-- ::: draft needs review -->
<!-- ::: todo update sections -->
<!-- ::: example add code sample -->
```

## Mention Patterns

### Direct Mentions

```javascript
// ::: @alice
// ::: @backend-team
// ::: @cursor
```

### Ownership with Mentions

```javascript
// ::: owner:@alice
// ::: reviewer:@bob
// ::: assign:@security
```

### Multiple Mentions

```javascript
// ::: reviewers:[@alice,@bob]
// ::: cc:[@qa,@docs]
// ::: escalate:[@lead,@manager]
```

## Complex Examples

### Complex Context (use multiple lines)

```javascript
// Instead of:
// ::: bug,priority:critical,owner:@alice,blocked:AUTH-123,sprint:2025-Q1

// Better:
// ::: bug(priority:critical) payment processing error
// ::: owner:@alice assigned for immediate fix
// ::: blocked(issue:AUTH-123) waiting on auth service
// ::: todo(sprint:2025-Q1) scheduled for next sprint
```

### Version Tracking

```javascript
// Instead of:
// ::: since:v2.0,deprecated:v3.0,until:v4.0

// Better:
// ::: since:v2.0
// ::: deprecated:v3.0 use newMethod() instead  
// ::: until:v4.0
```

### Workflow Chain (separate for clarity)

```javascript
// Instead of:
// ::: draft,review,assign:@senior,deadline:2025-01-30

// Better:
// ::: draft API design document
// ::: review architecture decisions needed
// ::: assign:@senior security implications
// ::: deadline:2025-01-30
```
