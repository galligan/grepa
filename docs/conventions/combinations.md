# Tag Combinations
<!-- :ga:tldr How to effectively combine multiple grep-anchor tags -->
<!-- :ga:convention Guidelines for combining tags and multi-tag patterns -->

How to combine multiple grep-anchor tags effectively.

## When to Combine vs Separate

### Use Combined Tags When:

- Tags are closely related (e.g., `security,todo`)
- No additional descriptions needed
- The combined meaning is clear

### Use Separate Comments When:

- Each tag needs its own description
- Line length would exceed ~80 characters
- Topics are distinct enough to warrant separation
- Better grep results readability is needed

## Combining Tags

Tags can be combined using commas or spaces when they form a cohesive concept:

### Security + Performance

```rust
// :ga:sec,perf Crypto operations need constant-time implementation
fn compare_hashes(a: &[u8], b: &[u8]) -> bool {
    // ...
}
```

### Version + Deprecation

```typescript
// :ga:v2.0,deprecated Will be removed in v3.0
function oldApiMethod(): void {
    // ...
}
```

### Priority + Issue

```python
# :ga:p1,issue-456 Critical bug affecting production
def process_payment(amount):
    # ...
```

## Best Practices

1. **Order matters**: Place the most important tag first
2. **Limit chains**: Use 2-3 tags maximum for readability
3. **Avoid redundancy**: Don't combine tags with similar meanings
4. **Line length**: Keep lines under ~80 chars for better grep output
5. **Separate descriptions**: Use multiple comments when each tag needs explanation

### Good: Related tags, concise

```javascript
// :ga:sec,todo validate user input
// :ga:perf,p0 optimize this query
```

### Better: Separate lines for clarity

```javascript
// :ga:sec sanitize HTML to prevent XSS
// :ga:todo add rate limiting to this endpoint
// :ga:ctx max 100 requests per minute per user
```

### Avoid: Multiple tags with descriptions

```javascript
// :ga:sec,todo,perf validate inputs, add caching, check permissions
// ❌ Too long, hard to grep, mixed concerns
```

## Finding Combined Tags with Ripgrep

When tags are split across lines, use context flags:

```bash
# Find security tags with 2 lines context
rg -C2 ":ga:sec"

# Find files with both security and todo tags
for f in $(rg -l ":ga:sec"); do 
  rg -l ":ga:todo" "$f" && echo "$f has both"
done

# Find security/todo within 3 lines of each other
rg -B3 -A3 ":ga:sec" | rg -B3 -A3 ":ga:todo"
```

## TODO: Expand this documentation

- Add more combination examples
- Define precedence rules
- Include tooling support details