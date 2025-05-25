# Progressive Enhancement Guide
<!-- :ga:tldr How to adopt grep-anchors incrementally from simple to advanced -->
<!-- :ga:guide Step-by-step adoption guide for individuals and teams -->

Start simple, grow as needed. This guide shows how to adopt grep-anchors incrementally.

## Level 0: Your First Anchor

Start with just one pattern to get comfortable:

```javascript
// :ga:todo implement validation
function saveUser(data) {
    // Save to database
}
```

**Find it:**
```bash
rg ":ga:"
```

That's it! You've made your first grep-anchor.

## Custom Anchors (Optional)

While this guide uses `:ga:` (the recommended default), teams can choose their own anchor pattern like `:proj:`, `:team:`, or `:myco:`. See the [Custom Anchors Guide](./custom-anchors.md) for details.

**Important**: Pick one anchor and stick with it across your entire project.

## Level 1: TODO Migration

If you already use TODO comments, enhance them gradually:

### Phase 1: Add `:ga:` to existing TODOs
```javascript
// TODO :ga: add error handling
// FIXME :ga: memory leak here
// NOTE :ga: this assumes UTC timezone
```

Your existing tools still work, but now you can also:
```bash
rg ":ga:"  # Find all enhanced comments
```

### Phase 2: Start using pure grep-anchors
```javascript
// :ga:todo add error handling
// :ga:fixme memory leak here  
// :ga:note assumes UTC timezone
```

## Level 2: Add Context

Once comfortable with basic anchors, add context for clarity:

```python
# :ga:todo implement retry logic
# becomes:
# :ga:todo implement retry logic
# :ga:ctx max 3 attempts with exponential backoff

# :ga:sec validate input
# becomes:
# :ga:sec validate input
# :ga:ctx prevent SQL injection and XSS
```

## Level 3: AI Agent Integration

Start delegating to AI agents:

```javascript
// Basic delegation
// :ga:@agent implement this function

// With guidance
// :ga:@agent implement pagination
// :ga:ctx use cursor-based approach
// :ga:requirement support both forward and backward

// Specific agents
// :ga:@cursor write unit tests
// :ga:@claude optimize for performance
```

## Level 4: Structured Tasks

Link to your issue tracker:

```python
# Simple issue reference
# :ga:issue(123) fix user validation

# With more context
# :ga:issue(123) fix user validation
# :ga:priority high
# :ga:owner @alice

# Or combined
# :ga:issue(123),priority:high,@alice fix user validation
```

## Level 5: Team Patterns

Define patterns that make sense for your team:

```ruby
# Your team's priority system
# :ga:p0 - drop everything, fix now
# :ga:p1 - fix this sprint  
# :ga:p2 - fix next sprint
# :ga:backlog - eventually

# Your team's workflow
# :ga:ready-for-review
# :ga:needs-qa
# :ga:ship-it

# Your team's domains
# :ga:frontend
# :ga:backend
# :ga:infra
```

## Migration Strategies

### Gradual File-by-File

Pick one file at a time:
```bash
# See current TODOs in a file
grep "TODO" --exclude-dir=.git src/auth.js

# Enhance them
sed -i 's/TODO/TODO :ga:/g' src/auth.js
sed -i 's/FIXME/FIXME :ga:/g' src/auth.js

# Verify
rg ":ga:" src/auth.js
```

### By Feature Area

Adopt in one area first:
```bash
# Start with security-critical code
# Add :ga:sec markers

# Then move to performance
# Add :ga:perf markers

# Then documentation
# Add :ga:docs markers
```

### During Code Reviews

Add anchors as you review:
- See missing error handling? Add `:ga:error handle timeout`
- Spot performance issue? Add `:ga:perf optimize query`
- Notice assumption? Add `:ga:ctx assumes sorted input`

## Measuring Adoption

Track your progress:

```bash
# Count enhanced vs regular TODOs
echo "Regular TODOs: $(grep -r "TODO" --exclude-dir=.git | grep -v ":ga:" | wc -l)"
echo "Enhanced TODOs: $(rg "TODO.*:ga:|:ga:todo" | wc -l)"

# See adoption by file type
rg ":ga:" --type-list
rg ":ga:" -t js --count-matches

# Most common patterns
rg -o ":ga:(\w+)" -r '$1' | sort | uniq -c | sort -nr
```

## Common Progression Paths

### For Solo Developers
1. Start with `:ga:todo`
2. Add `:ga:fixme` for bugs
3. Add `:ga:@agent` for AI help
4. Add `:ga:ctx` for clarity

### For Teams
1. Agree on 3-5 initial patterns
2. Document in README
3. Add to PR checklist
4. Gradually expand vocabulary

### For Open Source
1. Start with `:ga:help-wanted`
2. Add `:ga:good-first-issue`
3. Add `:ga:breaking-change`
4. Document in CONTRIBUTING.md

## Tips for Success

1. **Don't force it**: If a comment doesn't need to be searchable, don't add `:ga:`
2. **Stay consistent**: Pick patterns and stick to them
3. **Document your patterns**: Keep a list in your README
4. **Start small**: 3-5 patterns are plenty to start
5. **Let it evolve**: Add new patterns as needs arise

## Example Evolution

Here's how one function might evolve:

### Week 1: Basic TODO
```javascript
function processPayment(amount) {
    // TODO: add validation
    chargeCard(amount);
}
```

### Week 2: Enhanced TODO
```javascript
function processPayment(amount) {
    // :ga:todo add validation
    chargeCard(amount);
}
```

### Week 3: Add context
```javascript
function processPayment(amount) {
    // :ga:todo add validation
    // :ga:ctx amount must be positive, max 10000
    chargeCard(amount);
}
```

### Week 4: Delegate to AI
```javascript
function processPayment(amount) {
    // :ga:@agent add validation
    // :ga:ctx amount must be positive, max 10000
    // :ga:sec prevent negative charges
    chargeCard(amount);
}
```

### Week 5: Link to issue
```javascript
function processPayment(amount) {
    // :ga:issue(PAY-456) add validation
    // :ga:ctx amount must be positive, max 10000
    // :ga:sec prevent negative charges
    chargeCard(amount);
}
```

## Keep It Simple

The goal is discoverability, not perfection. Even one `:ga:` marker can help make your codebase more navigable. Start where you are, use what works, and let your patterns grow naturally with your needs. 