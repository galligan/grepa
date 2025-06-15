<!-- tldr ::: Advanced pattern for multi-line waymarks using closing ::: delimiter -->
# Multi-line Waymarks (Advanced Pattern)

> **Note**: This is an optional, advanced pattern. Single-line waymarks remain the standard.

## Overview

Sometimes a waymark needs multiple lines to convey its full meaning. This document describes an optional pattern using a closing `:::` delimiter to create multi-line waymark blocks.

## Basic Pattern

The closing `:::` creates a contained block:

```javascript
// about ::: complex authentication flow
//   validates JWT tokens from header
//   checks user permissions against database
//   logs all access attempts for audit compliance :::
```

## Syntax

```ebnf
waymark_multiline ::= comment_leader marker? ":::" prose newline
                     (comment_leader prose newline)*
                     comment_leader prose ":::"
```

## Use Cases

### 1. Complex Context (`about`, `note`)

```python
# about ::: distributed rate limiting implementation
#   Uses Redis sorted sets for sliding window algorithm
#   Supports multiple strategies (token bucket, sliding window)
#   Auto-scales limits based on traffic patterns
#   Integrates with monitoring for alerting :::
```

### 2. Detailed Warnings

```typescript
// alert ::: potential memory leak in event handlers
//   Event listeners attached in useEffect are not cleaned up
//   This causes performance degradation over time
//   Reproduce: rapidly mount/unmount component 100x
//   See ticket #1234 for full investigation :::
```

### 3. Structured TODOs

```rust
// todo ::: refactor authentication system
//   - Extract JWT validation to separate module
//   - Add refresh token support with rotation
//   - Implement token revocation list in Redis
//   - Add rate limiting per user
//   - Update API documentation :::
```

### 4. Comprehensive TLDRs

```javascript
// tldr ::: payment processing service integrating with Stripe
//   Handles webhooks for payment events (success, failure, refund)
//   Implements idempotency keys for safe retries
//   Stores transaction history in PostgreSQL
//   Exports metrics to Prometheus for monitoring :::
```

## Searching Multi-line Waymarks

### Find all multi-line waymarks
```bash
# Using ripgrep with multiline flag
rg -U ":::[^:]*\n.*:::[[:space:]]*$"
```

### Find specific multi-line markers
```bash
# Find all multi-line todos
rg -U "todo :::[^:]*\n.*:::[[:space:]]*$"

# Find all multi-line warnings
rg -U "alert :::[^:]*\n.*:::[[:space:]]*$"
```

### Extract full content
```bash
# Get complete multi-line blocks
rg -U -A20 "about :::" | awk '/about :::/,/:::$/'
```

## Best Practices

### When to Use

1. **Complex explanations** that genuinely need multiple lines
2. **Structured lists** within a waymark (steps, requirements)
3. **Detailed warnings** with reproduction steps
4. **Comprehensive context** for critical code sections

### When NOT to Use

1. **Simple notes** - Keep to single line
2. **Basic TODOs** - One line is usually enough
3. **Performance** - More lines = more parsing overhead
4. **Readability** - Don't overuse; it can clutter code

### Style Guidelines

1. **Indent content lines** for visual hierarchy
2. **Keep related** - All lines should support the main point
3. **Close on same indent** as opening for symmetry
4. **Limit length** - If >5-6 lines, consider separate documentation

## Examples by Marker Type

### Information Markers

```go
// note ::: critical performance considerations
//   This function is called 10,000x per second
//   Each allocation here impacts memory pressure
//   Current benchmark: 145ns per operation
//   Target: <100ns (see optimization ticket #789) :::
```

### Work Markers

```java
// fix ::: race condition in connection pool
//   Multiple threads can grab same connection
//   Happens under high load (>1000 req/s)
//   Temporary fix: added synchronized block
//   Proper fix: implement lock-free queue :::
```

### Alert Markers

```python
# alert ::: breaking API change in v3.0
#   Changed response format from array to object
#   Migration guide: docs/migration/v3.md
#   Deprecation period: 6 months
#   Old endpoint: /api/v2/users (redirects) :::
```

## Integration with Tools

### Editor Support

Multi-line waymarks can be folded in editors:
```javascript
// todo ::: large refactor task ... :::  [folded]
```

### Potential Tool Features

1. **Extraction** - Tools could extract multi-line blocks into docs
2. **Validation** - Ensure all opened waymarks are closed
3. **Conversion** - Transform between single and multi-line formats
4. **Rendering** - Format nicely in generated documentation

## Grammar Extension

For parsers supporting multi-line waymarks:

```javascript
function parseMultilineWaymark(lines) {
  const opening = lines[0].match(/(\w+)?\s*:::\s*(.*)$/);
  if (!opening) return null;
  
  let content = [opening[2]];
  let i = 1;
  
  while (i < lines.length) {
    const closing = lines[i].match(/^\s*.*:::\s*$/);
    if (closing) {
      return {
        marker: opening[1],
        content: content.join('\n'),
        lineCount: i + 1
      };
    }
    content.push(lines[i].replace(/^\s*\/\/\s*/, ''));
    i++;
  }
  
  return null; // Unclosed waymark
}
```

## Migration Considerations

1. **Optional adoption** - No need to convert existing waymarks
2. **Backward compatible** - Single-line waymarks still work
3. **Tool support** - Tools should gracefully handle both formats
4. **Search works** - Standard grep still finds the opening line

## Conclusion

Multi-line waymarks with closing `:::` provide an optional pattern for cases where single lines aren't sufficient. Use judiciously to maintain the simplicity and searchability that makes waymarks valuable.