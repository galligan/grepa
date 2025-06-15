# Advanced Waymark Patterns
<!-- ::: tldr Advanced patterns using arrays, parameters, and sophisticated workflows -->
<!-- ::: guide Advanced usage patterns and sophisticated techniques -->

This document covers advanced usage patterns for waymarks, including arrays, parameters, and sophisticated workflows.

## Array Syntax

Use brackets for listing multiple values:

```javascript
// ::: reviewers:[@alice,@bob,@charlie]
// ::: affects:[api,cli,sdk]
// ::: blocked:[123,456,789]
```

### Arrays in Parameters

```python
# ::: issue(4) blocked:[5,6,7]
# ::: owner:@alice depends:[auth,crypto]
```

## Structured Parameters

### Classifications with Values

```javascript
// ::: priority:high status:blocked
// ::: since:v1.8 until:v2.0
// ::: team:security severity:critical
```

### Parameterized Markers

```typescript
// ::: issue(123) assignee:@dev
// ::: bug(456) severity:high
// ::: feature(789) milestone:v2.0
```

### Nested Parameters

```javascript
// ::: blocked(issue:4) reason:security
// ::: depends(auth-service) version:2.1
// ::: deprecated(since:v1.8) replacement:newAPI
```

## Workflow Patterns

### Task Management

```python
# ::: todo priority:high assignee:@alice
# ::: todo(bug:auth-timeout) deadline:2024-03-15
# ::: done(issue:123) completed:2024-03-01
```

### Code Lifecycle

```javascript
// ::: deprecated since:v1.8 replacement:newMethod
// ::: freeze until:v2.0 reason:api-stability
// ::: temp remove:2024-06-01 reason:chrome-bug
```

### Dependencies and Relationships

```typescript
// ::: depends:[auth,session,crypto]
// ::: blocks:[checkout,payment]
// ::: related:[issue:123,pr:456]
```

## Advanced Search Patterns

### Complex Queries

```bash
# Find all high-priority security issues
rg ":::.*priority:high.*security"

# Find all deprecated code with replacements
rg ":::.*deprecated.*replacement:" -A 2

# Find all tasks assigned to specific person
rg ":::.*@alice" --type js
```

### Extracting Structured Data

```bash
# Count tasks by assignee
rg -o ":::.*assignee:(@\w+)" -r '$1' | sort | uniq -c

# Find all issue references
rg -o ":::.*issue\((\d+)\)" -r '$1' | sort -n | uniq

# List all blocked items
rg ":::.*blocked" -A 1 -B 1
```

## Monorepo Patterns

### Service Namespacing

```javascript
// In auth service
// ::: auth, todo implement OAuth flow
// ::: auth, security validate JWT expiry

// In payment service
// ::: payment, todo add Stripe webhook
// ::: payment, perf optimize transaction queries

// In shared libraries
// ::: shared, api maintain backward compatibility
// ::: shared, breaking v2.0 removes this method
```

### Cross-Service References

```typescript
// ::: depends(auth-service) requires:validateToken
// ::: blocks(payment-service) reason:breaking-change
// ::: see(shared/utils.ts) similar:implementation
```

### Monorepo-Wide Searches

```bash
# All todos across services
rg ":::.*todo"

# Just auth service markers
rg "::: auth,"

# Security issues in payment
rg "::: payment,.*security"

# All breaking changes
rg ":::.*breaking"
```

## Adoption Patterns

### Adding Waymarks to Existing Comments

```javascript
// Phase 1: Add waymarks to existing
// TODO: implement validation
// TODO ::: todo implement validation

// Phase 2: Add metadata
// ::: todo priority:high implement validation

// Phase 3: Full context
// ::: todo priority:high assignee:@dev deadline:2024-03-01
```

### Bulk Conversion

```bash
# Convert TODO to waymarks
find . -name "*.js" -exec sed -i 's/\/\/ TODO:/\/\/ ::: todo/g' {} +

# Add waymarks to FIXMEs
find . -name "*.py" -exec sed -i 's/# FIXME:/# ::: fix/g' {} +
```

## Integration Patterns

### Issue Tracker References

```python
# ::: jira(PROJ-123) status:in-progress
# ::: github(456) labels:[bug,p1]
# ::: linear(ENG-789) cycle:current
```

### Documentation Links

```javascript
// ::: docs(api-guide.md#auth) update:needed
// ::: spec(RFC-7231) section:6.5.1
// ::: adr(003) status:approved
```

## Best Practices

- **Keep it searchable**: Simple patterns are easier to grep
- **Be consistent**: Use the same patterns across your codebase
- **Start simple**: Add complexity only when needed
- **Document patterns**: Keep a CONVENTIONS.md file
- **One waymark per line**: Maintains grep-ability

Advanced patterns are powerful but optional. Most use cases work well with simple tags.