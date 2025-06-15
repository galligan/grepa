# Progressive Enhancement Guide
<!-- ::: tldr How to adopt waymarks incrementally from simple to advanced -->
<!-- ::: guide Step-by-step adoption guide for individuals and teams -->

Start simple, grow as needed. This guide shows how to adopt waymarks incrementally.

## Level 0: Your First Waymark

Start with just one pattern to get comfortable:

```javascript
// ::: todo implement validation
function saveUser(data) {
    // Save to database
}
```

**Find it:**

```bash
rg ":::"
```

That's it! You've made your first waymark.

## The Waymark Identifier

This guide uses `:::` - the canonical waymark identifier. The three-character pattern ensures consistency across all projects and makes patterns universally searchable.

## Level 1: TODO Migration

If you already use TODO comments, enhance them gradually:

### Phase 1: Add `:::` to existing TODOs

```javascript
// TODO ::: add error handling
// FIXME ::: memory leak here
// NOTE ::: this assumes UTC timezone
```

Your existing tools still work, but now you can also:

```bash
rg ":::"  # Find all enhanced comments
```

### Phase 2: Start using pure waymarks

```javascript
// ::: todo add error handling
// ::: fixme memory leak here  
// ::: note assumes UTC timezone
```

## Level 2: Add Context

Once comfortable with basic waymarks, add context for clarity:

```python
# ::: todo implement retry logic
# becomes:
# ::: todo implement retry logic
# ::: ctx max 3 attempts with exponential backoff

# ::: sec validate input
# becomes:
# ::: sec validate input
# ::: ctx prevent SQL injection and XSS
```

## Level 3: AI Agent Integration

Start delegating to AI agents:

```javascript
// Basic delegation
// ::: @agent implement this function

// With guidance
// ::: @agent implement pagination
// ::: ctx use cursor-based approach
// ::: requirement support bidirectional navigation

// Specific agents
// ::: @cursor write unit tests
// ::: @claude optimize for performance
```

## Level 4: Structured Tasks

Link to your issue tracker:

```python
# Simple issue reference
# ::: issue(123) fix user validation

# With more context
# ::: issue(123) fix user validation
# ::: priority high
# ::: owner @alice

# Or combined
# ::: issue(123),priority:high,@alice fix user validation
```

## Level 5: Team Patterns

Define patterns that make sense for your team:

```ruby
# Your team's priority system
# ::: p0 - drop everything, fix now
# ::: p1 - fix this sprint  
# ::: p2 - fix next sprint
# ::: backlog - eventually

# Your team's workflow
# ::: ready-for-review
# ::: needs-qa
# ::: ship-it

# Your team's domains
# ::: frontend
# ::: backend
# ::: infra
```

## Migration Strategies

### Gradual File-by-File

Pick one file at a time:

```bash
# See current TODOs in a file
grep "TODO" --exclude-dir=.git src/auth.js

# Enhance them
sed -i 's/TODO/TODO ::: /g' src/auth.js
sed -i 's/FIXME/FIXME ::: /g' src/auth.js

# Verify
rg "::: " src/auth.js
```

### By Feature Area

Adopt in one area first:

```bash
# Start with security-critical code
# Add ::: sec markers

# Then move to performance
# Add ::: perf markers

# Then documentation
# Add ::: docs markers
```

### During Code Reviews

Add waymarks as you review:
- See missing error handling? Add `::: error handle timeout`
- Spot performance issue? Add `::: perf optimize query`
- Notice assumption? Add `::: ctx assumes sorted input`

## Measuring Adoption

Track your progress:

```bash
# Count enhanced vs regular TODOs
echo "Regular TODOs: $(grep -r "TODO" --exclude-dir=.git | grep -v "::: " | wc -l)"
echo "Enhanced TODOs: $(rg "TODO.*::: |:M: todo" | wc -l)"

# See adoption by file type
rg "::: " --type-list
rg "::: " -t js --count-matches

# Most common patterns
rg -o "::: (\w+)" -r '$1' | sort | uniq -c | sort -nr
```

## Common Progression Paths

### For Solo Developers
1. Start with `::: todo`
2. Add `::: fixme` for bugs
3. Add `::: @agent` for AI help
4. Add `::: ctx` for clarity

### For Teams
1. Agree on 3-5 initial patterns
2. Document in README
3. Add to PR checklist
4. Gradually expand vocabulary

### For Open Source
1. Start with `::: help-wanted`
2. Add `::: good-first-issue`
3. Add `::: breaking-change`
4. Document in CONTRIBUTING.md

## Tips for Success

1. **Don't force it**: If a comment doesn't need to be searchable, don't add `:::`
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
    // ::: todo add validation
    chargeCard(amount);
}
```

### Week 3: Add context

```javascript
function processPayment(amount) {
    // ::: todo add validation
    // ::: ctx amount must be positive, max 10000
    chargeCard(amount);
}
```

### Week 4: Delegate to AI

```javascript
function processPayment(amount) {
    // ::: @agent add validation
    // ::: ctx amount must be positive, max 10000
    // ::: sec prevent negative charges
    chargeCard(amount);
}
```

### Week 5: Link to issue

```javascript
function processPayment(amount) {
    // ::: issue(PAY-456) add validation
    // ::: ctx amount must be positive, max 10000
    // ::: sec prevent negative charges
    chargeCard(amount);
}
```

## Keep It Simple

The goal is discoverability, not perfection. Even one `:::` marker can help make your codebase more navigable. Start where you are, use what works, and let your patterns grow naturally with your needs. 