# Waymark Combinations
<!-- ::: tldr How to effectively combine multiple waymark contexts -->
<!-- ::: convention Guidelines for combining contexts and multi-context patterns -->

How to combine multiple waymark contexts effectively.

## When to Combine vs Separate

### Use Combined Contexts When

- Contexts are closely related (e.g., `security, todo`)
- No additional descriptions needed
- The combined meaning is clear

### Use Separate Comments When

- Each context needs its own description
- Line length would exceed ~80 characters
- Topics are distinct enough to warrant separation
- Better grep results readability is needed

## Combining Contexts

Contexts can be combined using comma-space separation when they form a cohesive concept:

### Security + Performance

```rust
// ::: sec, perf Crypto operations need constant-time implementation
fn compare_hashes(a: &[u8], b: &[u8]) -> bool {
    // ...
}
```

### Version + Deprecation

```typescript
// ::: v2.0, deprecated Will be removed in v3.0
function oldApiMethod(): void {
    // ...
}
```

### Priority + Issue

```python
# ::: p1, issue(456) Critical bug affecting production
def process_payment(amount):
    # ...
```

## Best Practices

1. **Order matters**: Place the most important context first
2. **Limit chains**: Use 2-3 contexts maximum for readability
3. **Avoid redundancy**: Don't combine contexts with similar meanings
4. **Line length**: Keep lines under ~80 chars for better grep output
5. **Separate descriptions**: Use multiple comments when each context needs explanation

### Good: Related contexts, concise

```javascript
// ::: sec, todo validate user input
// ::: perf, p0 optimize this query
```

### Better: Separate lines for clarity

```javascript
// ::: sec sanitize HTML to prevent XSS
// ::: todo add rate limiting to this endpoint
// ::: ctx max 100 requests per minute per user
```

### Avoid: Multiple contexts with descriptions

```javascript
// ::: sec, todo, perf validate inputs, add caching, check permissions
// ❌ Too long, hard to grep, mixed concerns
```

## Finding Combined Contexts with Ripgrep

When contexts are split across lines, use context flags:

```bash
# Find security contexts with 2 lines context
rg -C2 "::: sec"

# Find files with both security and todo contexts
for f in $(rg -l "::: sec"); do 
  rg -l "::: todo" "$f" && echo "$f has both"
done

# Find security/todo within 3 lines of each other
rg -B3 -A3 "::: sec" | rg -B3 -A3 ":M: todo"
```

## TODO: Expand this documentation

- Add more combination examples
- Define precedence rules
- Include tooling support details
