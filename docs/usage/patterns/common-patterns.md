<!-- tldr ::: Essential waymark patterns and best practices for effective code navigation -->
# Common Waymark Patterns

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

### Task Management

```javascript
// Basic todos
// todo ::: implement validation
// fix ::: handle edge case
// fix ::: memory leak in auth service

// With priority and assignment
// todo ::: priority:high implement OAuth
// todo ::: @alice add unit tests
// fix ::: priority:critical race condition +backend

// Branch-scoped work
// *todo ::: finish error handling before merge
// *fix ::: resolve edge case found in review
```

### Documentation & Context

```javascript
// Pure notes (no marker)
// ::: this function handles edge case where user_id is null
// ::: database connection pooling configured for 10 concurrent users

// Summary waymarks
// tldr ::: JWT auth middleware validating Bearer tokens via RS256
// note ::: cache expires every 15 minutes, refresh logic in background

// Important context
// !note ::: this algorithm assumes sorted input array
// !!tldr ::: main application entry point and configuration
```

### Alerts & Security

```javascript
// Security concerns
// alert ::: validates all user inputs before database queries
// !!alert ::: critical vulnerability - patch immediately
// sec ::: encryption keys rotated monthly via scheduled job

// Risk markers
// risk ::: external API has no rate limiting
// notice ::: this endpoint requires admin privileges
```

### Code Lifecycle

```javascript
// Temporary code
// temp ::: hardcoded values for demo
// deprecated ::: use newMethod() instead until:v2.0
// cleanup ::: remove debug logging before release

// Work in progress
// stub ::: basic implementation, needs error handling
// draft ::: work in progress, not production ready
// wip ::: refactoring in progress
```

### AI Agent Instructions

```javascript
// Agent assignments
// todo ::: @agent add error handling for network failures
// review ::: @agent check for security vulnerabilities
// refactor ::: @agent extract this into a utility function

// Agent context
// ::: @agent this function is performance-critical, optimize carefully
// note ::: @agent database schema changes require migration script
```

## Advanced Patterns

### Issue Integration

```javascript
// Issue tracking
// todo ::: implement auth flow fixes:#234
// done ::: added validation closes:#456
// fix ::: waiting on API changes depends:#123
// blocked ::: need design approval for fixes:#789
```

### Branch & Release Management

```javascript
// Feature branches
// todo ::: implement OAuth flow branch:feature/auth
// fix ::: payment validation branch:feature/payments fixes:#567

// Release coordination
// !!fix ::: critical vulnerability branch:hotfix/security-patch
// review ::: @security-team urgent review needed branch:hotfix/data-loss
// notice ::: feature freeze in effect branch:release/v2.1
```

### Monorepo Organization

```javascript
// Service-specific work
// todo ::: implement caching +api +backend
// fix ::: button contrast issue +ui +frontend +a11y
// refactor ::: move shared types +ui-kit +types

// Cross-cutting concerns
// todo ::: update all services for new auth +security +breaking-change
// docs ::: API documentation update +docs +api +public
```

### Performance & Quality

```javascript
// Performance markers
// perf ::: optimize this loop for large datasets
// hotpath ::: critical path, measure before changing
// mem ::: potential memory leak, monitor usage

// Quality assurance
// test ::: needs integration tests for edge cases
// audit ::: security review required before deployment
// lint ::: suppress false positive warning
```

## Search Patterns

### Basic Searches

```bash
# Find all waymarks
rg -n ":::"

# Find by marker
rg -n "todo :::"
rg -n "fix :::"
rg -n "alert :::"

# Find by assignee
rg -n ":::.*@alice"
rg -n ":::.*@$(whoami)"  # Your work
```

### Advanced Searches

```bash
# Priority work
rg -n ":::.*priority:high"
rg -n "!!!.*:::"  # Critical items

# Branch-specific
rg -n ":::.*branch:feature/"
rg -n ":::.*branch:hotfix/"

# Tags and categories
rg -n "\+security"
rg -n "\+frontend"
rg -n "\+critical"

# Issue references
rg -n ":::.*fixes:#\d+"
rg -n ":::.*#234\b"  # Specific issue
```

### Combining Criteria

```bash
# High-priority security work
rg -n ":::.*priority:high.*\+security"

# Alice's feature work
rg -n ":::.*@alice.*branch:feature/"

# Critical alerts
rg -n "!!alert.*:::"

# Temporary code to clean up
rg -n "temp.*:::"
rg -n "cleanup.*:::"
```

## Best Practices

1. **Start Simple**: Begin with basic `todo :::` and `note :::` patterns
2. **Be Specific**: Use clear, actionable descriptions
3. **Action First**: Put the most important information immediately after `:::`
4. **Use Signals**: Apply `!` for important, `!!` for critical items
5. **Tag Consistently**: Develop team conventions for tags like `+security`, `+performance`
6. **Assign Clearly**: Put `@mentions` first after `:::` for clear ownership
7. **Link Issues**: Use `fixes:#123` to connect work to issue tracking
8. **Keep Searchable**: Remember that simple patterns are easier to find
9. **Branch Awareness**: Use `*` for work that must complete before PR merge
10. **Clean Up**: Remove completed waymarks rather than leaving them

## Common Anti-Patterns

❌ **Avoid these patterns:**

```javascript
// Too vague
// todo ::: fix this

// No context
// bug :::

// Overly complex
// todo ::: @alice @bob implement OAuth with JWT tokens using RS256 algorithm 
//     with refresh token rotation and proper CSRF protection priority:high 
//     fixes:#123 depends:#456 +security +auth +backend +critical +urgent

// Wrong actor placement
// todo ::: implement @alice OAuth flow  // Should be: todo ::: @alice implement OAuth flow

// Mixed markers
// todo fix ::: implement validation  // Should use one marker: todo or fix
```

✅ **Better versions:**

```javascript
// Clear and actionable
// todo ::: implement input validation for user registration

// Proper context
// fix ::: memory leak in connection pool

// Focused and clear
// todo ::: @alice implement OAuth flow priority:high +security

// Correct actor placement
// todo ::: @alice implement OAuth flow

// Single marker
// todo ::: implement validation
// fix ::: handle edge case
```