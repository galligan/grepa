<!-- tldr ::: Get started with waymarks in 5 minutes -->
# Quick Start Guide

Get started with waymarks in 5 minutes.

## What is a Waymark?

**Waymarks** are special comments with the `:::` sigil that make your code searchable and discoverable.

## Basic Usage

### 1. Add Your First Waymark

Add a waymarked comment to mark important code:

```javascript
// todo ::: implement error handling
function processUser(data) {
  // alert ::: validate input +security
  return data;
}
```

### 2. Search with Ripgrep

Find all waymarks in your codebase:

```bash
# Find all waymarks
rg -n ":::"

# Find specific markers
rg -n "todo :::"
rg -n "alert :::"
```

### 3. Common Patterns

Start with these essential patterns:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `tldr :::` | Brief summary | `// tldr ::: handles user auth` |
| `todo :::` | Future work | `// todo ::: add tests` |
| `:::` | Key assumptions (pure note) | `// ::: UTC timestamps only` |
| `fix :::` | Broken code | `// fix ::: null pointer exception` |
| `alert :::` | Security/safety critical | `// alert ::: validate input +security` |
| `@mentions` | Assign to someone | `// todo ::: @alice review this` |

## Pure Notes vs Marked Waymarks

Waymarks can be pure notes (no marker) or marked:

```javascript
// Pure notes (no marker - just information)
// ::: assumes all dates are UTC
// ::: users must be authenticated
// ::: performance-critical code path

// Marked waymarks (actionable items)
// todo ::: implement caching
// fix ::: handle null case
// alert ::: validate permissions +security
```

## Properties and Tags

Add structured data and classification:

```javascript
// Properties (key:value pairs)
// todo ::: priority:high implement auth
// todo ::: @alice add validation
// fix ::: affects:auth,api memory leak

// Tags (classification with + prefix)
// todo ::: implement OAuth +auth-service
// alert ::: rate limit required +security +performance
// fix ::: API timeout +backend +critical
```

For deeper exploration, see [Common Patterns](./usage/patterns/common-patterns.md).

## @Mentions for Assignment

Assign work and request attention:

```javascript
// Direct assignment in todos
// todo ::: @alice implement payment flow
// review ::: @bob check security implications

// Explicit property assignment
// todo ::: @charlie priority:high fix bug
// todo ::: attn:@security-team audit this code
```

## HTML Comments in Markdown

For markdown files, use HTML comments to make waymarks searchable but not rendered:

```markdown
<!-- tldr ::: User authentication guide -->
<!-- todo ::: @galligan add SSO examples -->
<!-- alert ::: breaking changes in v3.0 -->

# Authentication Guide

This guide covers user authentication.
```

## Next Steps

1. **Learn the syntax**: [Syntax Guide](./syntax/README.md)
2. **Explore patterns**: [Common Patterns](./usage/patterns/common-patterns.md)
3. **Master search**: [Search Guide](./usage/search/ripgrep-patterns.md)
4. **Set up your team**: Create a CONVENTIONS.md file

## Example Search Commands

```bash
# Find all waymarks
rg -n ":::"

# Find by marker
rg -n "todo :::"
rg -n "alert :::"
rg -n "fix :::"

# Find pure notes (no marker)
rg -n "^[[:space:]]*//[[:space:]]*:::[[:space:]]"

# Find by tag
rg -n "\+security"
rg -n "\+frontend"

# Find work assigned to Alice
rg -n ":::.*@alice"

# Find high priority items
rg -n ":::.*priority:high"

# Find with context (lines before/after)
rg -n -C2 "alert :::"

# Count all waymarks
rg -c ":::" | awk -F: '{sum+=$2} END {print sum}'
```

## Advanced Patterns

### Issue Integration

```javascript
// Link to issue trackers
// todo ::: fixes:#123 implement feature
// fix ::: closes:#456 security patch
// done ::: relates-to:PROJ-789 completed auth
```

### Parameterized Properties

```javascript
// Version constraints
// todo ::: requires:node(16,18,20) add compatibility
// alert ::: deprecated:v3.0 use newMethod() instead
// fix ::: affects:versions(1.0-2.5) security issue
```

### Lifecycle Tracking

```javascript
// Work status
// draft ::: work in progress, do not merge
// review ::: ready for code review
// shipped ::: deployed to production
// hold ::: blocked waiting on API update
```

## Tips

- **Space before `:::`**: Required when marker is present
- **Keep markers short**: Under 80-120 characters for readable grep output  
- **Use properties for structure**: Machine-readable key:value pairs
- **Use tags for grouping**: Cross-cutting concerns like +security
- **Document team conventions**: Establish consistent patterns
- **Start simple**: Begin with `todo :::` and `:::`, add complexity as needed

## Progressive Enhancement

Start simple and add features as needed:

```javascript
// Level 1: Basic waymarks
// todo ::: add validation

// Level 2: Add properties
// todo ::: priority:high add validation

// Level 3: Add hashtags
// todo ::: priority:high add validation +security

// Level 4: Add assignment and issues
// todo ::: priority:high assign:@alice fixes:#123 add validation +security
```

Remember: The goal is **discoverability**. Even one `:::` waymark makes your codebase more navigable than none.

<!-- note ::: Updated for new ::: syntax specification -->