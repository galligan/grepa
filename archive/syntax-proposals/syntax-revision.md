<!-- tldr ::: Complete specification for revised waymark syntax with ::: sigil -->
<!-- wip ::: Need to implement these changes -->
# Syntax Revision - Waymark Terminology & Structure

This document captures all decisions made during the syntax revision discussion and serves as the specification for implementing the new waymark syntax with the `:::` sigil.

## Core Terminology

### 1. **Waymark**
The entire comment structure containing the `:::` sigil

```javascript
// todo ::: implement validation
```

### 2. **Sigil**
The `:::` separator that defines a waymark. Always preceded by a space when a prefix is present.

### 3. **Prefix**
Optional classifier that appears before the `:::` sigil. Everything before the sigil up to the last space is considered the prefix. Limited to a defined namespace (see [Prefix Set](#prefix-set) below).

> [!NOTE]
> Prefixes are case-insensitive but should not include non-letter characters.

### 4. **Properties**
Key:value pairs that provide structured, toolable metadata, appearing anywhere after the sigil

```javascript
// todo ::: priority:high attn:@alice implement caching
//          ^^^^^^^^^^^^^ ^^^^^^^^^^^
//          property      property

// tldr ::: this is a performance hotpath owner:@alice
//          ^^^^                          ^^^^^^^^^^^^
//          note                          property
```

### 5. **Note**
Optional human-readable description. **Important**: Any waymark without a prefix is implicitly a pure note.

```javascript
// todo ::: priority:high implement proper error handling
//                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                        note

// These are all pure notes (no prefix before :::):
// ::: this is a performance hotpath
// ::: assumes all timestamps are UTC
// ::: deprecated:v2.0 moving to new API
```

> [!NOTE]
> As waymarks are typically space delimited, a note would simply be text that does not contain a colon. If a note contains properties or hashtags, the entire line following the sigil is considered a note.

### 6. **#Hashtags**
Open-namespace tags for classification, appear anywhere in waymark (prefer at end for style)

```javascript
// todo ::: implement auth flow #security #performance
// fix  ::: button contrast issue #critical #frontend/ui #a11y
```

Hashtags can be configured as synonyms for the sake of searchability. e.g. `#security` can be configured as `#sec` or `#critical`.

They can also be nested in a hierarchical manner, using `/` as a separator, e.g. `#auth/oauth` or `#security/a11y/wcag`. This way a search for `#auth` will find both `#auth` and `#auth/oauth`.

## Syntax Structure

### Basic Pattern

```text
[comment-leader] [prefix] ::: [properties] [note] [#hashtags]
                 ^^^^^^^^     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                (optional)            (in any order)
```

### Rules

1. **Prefix is optional** - appears before the `:::` sigil
2. **Everything before `:::`** up to the last space is the prefix
3. **No prefix = pure note** - waymark is implicitly just a note
4. **Properties** are space-separated key:value pairs placed anywhere after the sigil
5. **Notes and properties** can appear in any order after the sigil
6. **#Hashtags** can appear anywhere (prefer end for style)

### Examples

```javascript
// Prefix with properties and note
// todo ::: priority:high implement caching

// Prefix with no properties
// fix  ::: memory leak in auth handler

// No prefix (pure notes with optional properties)
// ::: priority:critical all inputs must be sanitized #security
// ::: deprecated:v2.0 use newMethod() instead
// ::: this code is performance-critical #hotpath

// With hashtags
// todo ::: optimize auth flow #security #performance

// Backwards compatible with existing TODO systems
// TODO ::: implement proper error handling
// FIXME ::: race condition when concurrent
```

## Prefix Set

Waymarks use a fixed namespace of prefixes to ensure consistency. Prefixes may have equivalent synonyms, e.g. `needs` == `depends` == `requires`. Searches with `waymark` will find all prefixes unless specified otherwise.

### Tasks (`task`)

- `todo` - work to be done (synonym: `task`, `issue`)
- `fix` - bugs to fix (synonym: `fixme`, `bug`)
- `done` - completed work
- `ask` - questions needing answers
- `review` - needs review
- `chore` - routine maintenance tasks (e.g., lint fixes, dependency bumps)
- `hotfix` - urgent production patch (synonym: `patch`)
- `spike` - exploratory proof-of-concept work

### Lifecycle/Maturity

- `pr` - pull request (synonym: `pull`)
- `stub` - skeleton/basic implementation
- `draft` - work in progress (synonym: `wip`)
- `stable` - mature/solid code
- `shipped` - deployed to production
- `good` - approved (synonyms: `lgtm`, `approved`, `thumbsup`)
- `bad` - not approved (synonyms: `nope`, `thumbsdown`)
- `hold` - work intentionally paused or blocked (synonym: `paused`)
- `stale` - work that has stagnated or is out-of-date
- `cleanup` - code cleanup or dead-code removal
- `remove` - scheduled deletion (synonym: `delete`)

### Alerts/Warnings

- `warn` - warning
- `crit` - critical issue (synonym: `critical`)
- `unsafe` - dangerous code
- `caution` - proceed carefully (synonym: `careful`)
- `broken` - non-functional code
- `locked` - do not modify (synonym: `freeze`)
- `needs` - dependencies (synonyms: `depends`, `requires`)
- `deprecated` - scheduled for removal
- `audit` - requires audit or compliance review
- `legal` - legal or licensing obligations
- `temp` - temporary code (synonym: `temporary`)
- `revisit` - flag for future reconsideration (synonym: `review-later`)
- `check` - notice to check on something related

### Information

- `tldr` - brief summary: one per file at top (synonym: `aboutme`, `about`)
- `summary` - code section summary (synonym: `description`)
- `note` - general note (synonym: `info`)
- `notice` - notice to the reader
- `thought` - thinking out loud
- `docs` - documentation reference
- `why` - explains reasoning
- `see` - cross-reference (synonyms: `ref`, `xref`)
- `example` - usage example

### Meta

- `ai` - Important context for AI agents (synonym: `agent`)
- `important` - important information
- `mustread` - must-read information
- `hack` - hacky solution
- `flag` - generic marker
- `pin` - pinned item
- `idea` - future possibility
- `test` - test-specific marker

### Tooling-specific Instructions

- `IGNORE` - tells waymark to ignore this file in search results (must be at the top in all caps)
- `SKIP` - tells waymark to skip this file for writing new waymarks

### Existing Magic Comments
Traditional magic comments (TODO, FIXME, HACK, XXX, NOTE) automatically become prefixes when placed before `:::`:

```javascript
// TODO ::: implement caching
// FIXME ::: memory leak here
// HACK ::: temporary workaround
```

### Prefix Alignment
Since prefixes have a limited namespace, formatters can align the `:::` sigils for visual consistency:

```javascript
// Unaligned
// todo ::: implement caching
// fix ::: memory leak
// tldr ::: handles authentication

// Aligned by formatter
// todo   ::: implement caching
// fix    ::: memory leak  
// tldr   ::: handles authentication
// locked ::: do not modify until v3.0
```

## Advanced Syntax

### Parameterized Values
Use parentheses to add parameters to properties:

```javascript
// Parameterized properties
// todo ::: supports:node(16,18,20) add compatibility
// ::: requires:react(>=17) minimum version required
// ::: affects:versions(1.0-2.5) security vulnerability
```

### Grouped Parameters (Advanced)
Use brackets to group multiple parameterized values:

```javascript
// Verbose form
// todo ::: requires:npm(>=8) requires:node(16,18,20) upgrade deps

// Terse form (with brackets)
// todo ::: requires:[npm(>=8),node(16,18,20)] upgrade deps

// Multiple grouped properties
// todo ::: requires:[npm(>=8),node(16,18,20)] affects:[auth,api,frontend]
```

## Specific Patterns

### @Mentions

- Not prefixes, just searchable mentions
- In to-dos without a detail key = assignee

```javascript
// Direct mention
// ::: @alice please review this

// As assignee in todo
// todo ::: @bob implement caching

// With explicit detail key
// todo ::: assign:@carol attention:@dave needs input on API design
```

### Assignment Detail Keys
Suggested keys (use sparingly, not overly opinionated yet):

- `assign:@person` - explicit assignment
- `for:@person` - alternative assignment
- `attention:@person` / `attn:@person` - needs someone's attention

### TLDR Convention

- One per file, at the top
- Flexible styling

```javascript
// All valid:
// tldr ::: Handles user authentication
// tldr ::: manages OAuth flows  
// tldr ::: this is the auth service
```

### Done Pattern
Mark completion with the done prefix:

```javascript
// done ::: implemented caching feature
// done ::: added rate limiting for API endpoints
```

### HTML Comments in Markdown
For markdown files, use HTML comments to make waymarks searchable but not rendered:

```markdown
<!-- tldr ::: API documentation for authentication service -->
<!-- todo ::: add examples for OAuth flow -->
```

### Monorepo Patterns
For monorepos, use hashtags or details to namespace by service:

```javascript
// Using hashtags (preferred in new syntax)
// todo ::: implement OAuth #auth #backend
// fix ::: payment validation #payment #security

// Using properties
// todo ::: service:auth implement OAuth
// fix ::: service:payment validate amounts
```

## Recommended Property Keys

Keep properties simple and toolable. Use notes for descriptive information.

### Core Property Keys

- **Assignment**: `assign:@person` or `attn:@person`
- **Priority**: `priority:high`, `priority:critical`
- **Dependencies**: `requires:package(version)`, `depends:service`
- **Issue tracking**: `fixes:#123`, `closes:#123`, `blocks:#123`, `blocked-by:#123`
- **Lifecycle**: `deprecated:version`, `since:version`, `until:version`
- **Files/paths**: `path:filename`, `affects:files`
- **Messages**: `message:"error text"`

### Philosophy
Properties should be:

- **Machine-readable**: Can be parsed and analyzed
- **Searchable**: Can be found with grep patterns
- **Actionable**: Can drive tooling decisions

Use notes for everything else:

```javascript
// ❌ Too specific as properties:
// ::: cache:5min rate-limit:100 implements:RFC7519

// ✅ Better as notes:
// note ::: cached 5min, rate limited 100/hour, implements RFC7519
```

## Key Principles

1. **Visual Clarity**: The `:::` sigil clearly separates prefix from everything else
2. **Progressive Complexity**: Start simple, add advanced features only when needed
3. **Toolability**: Properties are structured for CLI/linting, notes are freeform
4. **Flexibility**: Open namespace for hashtags, minimal opinions on property keys
5. **Searchability**: Every pattern optimized for grep/ripgrep

## Delimiter Summary

Each delimiter has ONE clear purpose:

- `:::` the sigil that marks a waymark
- `:` creates key:value pairs
- `()` parameterizes a property
- `[]` groups multiple parameterized values
- `#` creates hashtags
- `@` creates mentions

## Cross-Referencing Issues/PRs

### As Prefixes
Use issue/PR numbers with the relevant prefix:

```javascript
// todo ::: implement new auth flow for #234
// todo ::: fixes:#234 implement new auth flow  
// review ::: PR #456 adds rate limiting
// fix ::: AUTH-123 token expiration bug
// done ::: completed #234 auth implementation
```

### As Property Values
For indicating relationships:

```javascript
// todo ::: fixes:#234 implement auth flow
// done ::: closes:#456 relates-to:AUTH-123
// todo ::: blocks:MG-789 waiting on API changes
// fix ::: blocked-by:#123 for:FRONTEND-456
```

### Relationship Keys

- `fixes:` / `closes:` - will close the issue
- `relates-to:` / `refs:` - related but doesn't close
- `blocks:` / `blocked-by:` - dependency relationships
- `implements:` - implements a feature request
- `addresses:` / `for:` - partially addresses an issue

### Multi-Tracker Support
Teams can configure trackers in `.waymark/settings.json`:

```json
{
  "trackers": {
    "github": {
      "pattern": "#\\d+",
      "url": "https://github.com/owner/repo/issues/{id}"
    },
    "linear": {
      "pattern": "[A-Z]{2,}-\\d+",
      "url": "https://linear.app/team/issue/{id}"
    }
  }
}
```

### Important: Hashtag Conflicts
Since `#123` format is used for issue references, **numeric-only hashtags are prohibited**:

- ❌ `#123` - ambiguous (issue or hashtag?)
- ✅ `#security` - clearly a hashtag
- ✅ `#v123` - has non-numeric characters

The linter should warn against numeric-only hashtags to prevent confusion.

## Search Patterns

### Basic ripgrep usage

```bash
# Find all waymarks
rg ":::"

# Find by prefix
rg "todo :::"
rg "fix :::"

# Find by hashtag
rg "#security"
rg "#frontend"

# Find with context
rg -C2 "todo :::"  # 2 lines before/after

# Find in markdown (HTML comments)
rg "<!-- .*:::" --type md
```

### Advanced extraction

```bash
# Count todos by assignee
rg -o "todo ::: .*@(\w+)" -r '$1' | sort | uniq -c

# Find high priority items
rg ".*::: .* priority:high"

# Find by issue reference
rg ".*:::.*#234"
rg ".*:::.*fixes:#\d+"
```

## Best Practices

### Line Length
Keep waymarks under ~80-120 characters for readable grep output:

```javascript
// Good - concise and greppable
// todo ::: priority:high fix auth timeout #security

// Too long - hard to read in grep output
// todo ::: priority:high deadline:2024-03-15 this is a very long description that should probably be broken up into multiple lines or simplified
```

### Quoting Rules
Use quotes for values with special characters or spaces:

```javascript
// Simple values - no quotes needed
// todo ::: version:2.0.1 priority:high

// Spaces or special characters - use quotes
// todo ::: message:"Can't connect to database"
// note ::: path:"src/data migration.sql"
```

### CI/CD Integration
Example git hook to prevent temporary code:

```bash
#!/bin/bash
if git diff --cached | grep -q ".*:::.*\(temp\|tmp\)"; then
  echo "Error: Remove temporary waymarks before committing"
  exit 1
fi
```

## Integration with Documentation Systems

### Philosophy
Waymarks **enhance** existing documentation systems rather than replacing them. They add searchable, structured markers within standard doc comments that tools can find and analyze.

### JSDoc Integration
Waymarks go inside JSDoc blocks, making them part of the documented API:

```javascript
/**
 * Authenticates a user with the provided credentials
 * tldr ::: handles OAuth and basic auth flows
 * todo ::: add two-factor authentication support
 * warn ::: validates all inputs before processing #security
 * 
 * @param {Object} credentials - User credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - User password
 * @returns {Promise<User>} Authenticated user object
 * @throws {AuthError} If authentication fails
 * 
 * note ::: results cached for 5 minutes #performance
 * deprecated ::: v3.0 use authenticateWithToken() instead
 */
async function authenticate(credentials) {
  // Implementation
}
```

### Python Docstrings
Works with any docstring format (Google, NumPy, Sphinx):

```python
def process_payment(amount: float, currency: str = "USD") -> PaymentResult:
    """
    Process a payment transaction.
    
    tldr ::: handles payment processing with retry logic
    todo ::: implement currency conversion
    warn ::: PCI compliance required #security #critical
    
    Args:
        amount: Payment amount
        currency: ISO 4217 currency code (default: USD)
        
    Returns:
        PaymentResult: Transaction result with confirmation ID
        
    Raises:
        PaymentError: If payment processing fails
        ValidationError: If amount is invalid
        
    depends ::: api(stripe,paypal) multiple payment providers
    note ::: rate limited to 100/hour per user
    """
    # Implementation
```

### Go Comments
Standard Go doc comments with waymarks:

```go
// Package auth provides authentication middleware.
// tldr ::: JWT-based authentication for REST APIs
// note ::: implements RFC7519 JWT standard
package auth

// Authenticate validates a JWT token and returns the user claims.
// warn ::: token validation is critical #security
// todo ::: add token refresh mechanism
// note ::: hot path, optimize for speed #performance
//
// Example:
//   claims, err := Authenticate(token)
//   if err != nil {
//       return unauthorized()
//   }
func Authenticate(token string) (*Claims, error) {
    // Implementation
}
```

### TypeScript/TSDoc

```typescript
/**
 * React component for user profile display
 * tldr ::: shows user avatar, name, and bio
 * todo ::: add edit mode #frontend
 * note ::: WCAG-AA screen reader support required #a11y
 * 
 * @remarks
 * note ::: memoized for better performance
 * depends ::: components(Avatar,Card) uses design system
 * 
 * @example
 * ```tsx
 * <UserProfile userId="123" showBio={true} />
 * ```
 */
export const UserProfile: React.FC<UserProfileProps> = memo(({ userId, showBio }) => {
  // Component implementation
});
```

### Key Benefits

1. **Unified Search**: The waymark CLI can find across all documentation:
   ```bash
   waymark find "security:critical" --include-docs
   waymark list --prefix tldr --in-docs-only
   ```

2. **AI-Friendly**: LLMs can understand both the formal documentation AND the waymark metadata:
   - Formal docs explain WHAT the code does
   - Waymarks explain meta-information (security level, performance notes, work needed)

3. **Progressive Enhancement**: Teams can start adding waymarks to existing documented code without breaking anything

4. **Tool Integration**: Documentation generators (JSDoc, Sphinx, etc.) ignore waymarks, but waymark-aware tools can extract rich metadata

### CLI Superpowers

The waymark CLI could provide documentation-aware commands:

```bash
# Find all documented functions with security concerns
waymark find "security:" --in-docs

# List all public APIs marked for deprecation  
waymark list --prefix deprecated --public-only

# Show all TODOs in documented code
waymark todos --documented-only

# Generate a security audit from waymarks
waymark report security --from-docs > security-audit.md

# Find undocumented code with waymarks (code smell)
waymark list --no-docs --has-waymarks
```

### Best Practices

1. **TLDR at the top**: Put `tldr :::` as the first waymark in doc blocks
2. **Metadata at the end**: Put performance/caching/deprecation info after params
3. **Be concise**: Doc comments are already verbose, keep waymarks brief
4. **Use hashtags sparingly**: In docs, prefer structured details over hashtags

## Backwards Compatibility

### Existing TODO/FIXME Systems
Waymarks are designed to work alongside existing "magic comment" systems. Traditional patterns like TODO, FIXME, HACK, XXX, etc. can precede waymarks:

```javascript
// TODO ::: implement caching #performance
// FIXME ::: memory leak in auth handler
// HACK ::: workaround until v2.0

// These are all valid and searchable by both systems:
// TODO: ::: add validation
// FIXME: ::: security issue here #critical
```

### Compatibility Modes

The waymark CLI can operate in two modes:

1. **Compatibility Mode (default)**: Allows existing magic comments before the `:::` sigil
   - Auto-detected on installation by scanning for TODO/FIXME usage
   - Preserves existing workflows
   - Both `grep TODO` and `waymark search` work

2. **Strict Mode**: Nothing can precede the `:::` sigil (except comment syntax)
   - Enforced by linter when enabled
   - Ensures clean, consistent waymarks
   - Better for new projects

### Configuration

```json
{
  "compatibility": {
    "allowMagicComments": true,
    "patterns": ["TODO", "FIXME", "HACK", "XXX", "NOTE"]
  }
}
```

### Progressive Migration
Teams can gradually adopt waymarks:

```javascript
// Phase 1: Add waymarks to existing TODOs
// TODO: implement caching
// ↓
// TODO: ::: implement caching

// Phase 2: Add waymark metadata
// TODO: ::: implement caching
// ↓
// TODO ::: priority:high implement caching #performance

// Phase 3 (optional): Pure waymarks
// TODO ::: priority:high implement caching #performance
// ↓
// todo ::: priority:high implement caching #performance
```

## Migration Impact

This revision significantly simplifies the syntax by:

- Eliminating multiple prefixes per waymark
- Removing complex "context groups" concept
- Clarifying delimiter usage
- Making visual parsing much easier
- Reducing ambiguity in parsing rules
- Maintaining compatibility with existing systems
