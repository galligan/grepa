## Doc Updates

### Eliminate Dot Syntax (Except Literals)

<!-- ::: todo #doc-migration -->

**Decision**: Remove dot syntax from structural/hierarchical markers, keeping dots only for literal values where they have established meaning.

**Keep dots for literals:**

- Version numbers: `since:1.2.0`, `until:v2.3.1`
- File paths: `file:src/auth.js`, `path:/usr/local/bin`
- URLs/domains: `endpoint:api.company.com`
- Decimal numbers: `timeout:3.5`, `rate:0.25`

**Replace hierarchical dots with simplified delimiter rules:**

```javascript
// Old: api.v2.users → New: api:v2-users or api(v2-users)
// Old: module.auth.login → New: auth:login-module or auth(login-module)
// Old: service.payment.stripe → New: payment(stripe-service)
```

**Apply simplified delimiter rules:**

- `:` for classifications: `priority:high`, `env:production`
- `()` for attaching values: `blocked(issue:4)`, `depends(auth-service,user-db)`
- Remove redundant prepositions: `blocked(by:issue:4)` → `blocked(issue:4)`

**Change notes:**

- Update all `priority.high` → `priority:high` patterns
- File path dots remain literal: `config.yaml`, `auth.service.ts`

**Benefits:**

- Familiar function-call syntax for developers
- Eliminates parser ambiguity between structural vs literal dots
- Clear semantic distinction: colon for classification, parentheses for attachment
- Consistent search patterns: `rg ":::.*auth"` works reliably

### Require Colon Delimiter for All Markers

**Decision**: All markers with values must use colon delimiter syntax, including mentions.

**Change notes:**

- `owner@alice` → `owner:@alice`
- `assignee@bob` → `assignee:@bob`
- All markers follow consistent `marker:value` pattern

### Simplified Delimiter Rules

**Decision**: Use clear, consistent delimiter rules based on function-call familiarity.

**Rules:**

- `:` for classifications: `priority:high`, `status:blocked`
- `()` for attaching values to markers: `blocked(issue:4)`, `owner(@alice,@bob)`
- Remove redundant prepositions: `blocked(by:issue:4)` → `blocked(issue:4)`

**Patterns:**

```javascript
// Simple classifications
// ::: priority:high, status:blocked

// Single parameter attachment  
// ::: blocked(issue:4), owner(@alice), due(2024-03-15)

// Multiple parameter attachment
// ::: depends(auth-service,user-db,redis)
// ::: tags(security,auth,api)
// ::: owner(@alice,@bob)
```

**Change notes:**

- Remove preposition words inside parentheses where context is clear
- Parentheses can contain single or multiple values
- Structured data inside parentheses can still use colons: `config(timeout:30,retries:3)`

### Spacing and Quoting Rules

<!-- ::: todo #doc-migration -->

**Decision**: Handle spaces and special characters consistently across all parameters.

**Quoting guidelines:**

- **No quotes needed**: Simple values without spaces or special characters
  - `path:src/auth.js`, `service:auth-api`, `issue:123`
- **Single quotes required**: Values containing spaces or special characters
  - `path:'src/user service.js'`, `service:'user management api'`
  - `url:'https://example.com/api reference'`, `endpoint:'/api/user profiles'`
- **Double quotes for complex cases**: When single quotes appear in the value
  - `message:"Can't connect to service"`, `pattern:"user's-\d+"`

**Benefits:**

- Handles real-world file paths with spaces (especially Windows)
- Supports service names and API endpoints with spaces
- Consistent with established quoting mechanisms
- Clean syntax for simple cases, robust handling for complex ones

### Universal Parameters and Todo Consolidation

<!-- ::: todo #doc-migration -->

**Decision**: Recognize universal parameters that work across markers, and consolidate work-related markers into `todo`.

**Universal parameters (work across all markers):**

- `owner:@alice` or `owners:[@alice,@bob]` - responsibility assignment
- `assignee:@charlie` - active work assignment  
- `parent:epic-123` - hierarchical organization
- `related:[4,7,docs-auth]` - connected items
- `priority:high` - importance/urgency level

**Todo as work container:**

```javascript
// Simple todos
// ::: todo implement validation
// ::: todo(priority:high) fix login bug

// Todo with work-specific parameters
// ::: todo(blocked:[4,7],status:in-progress) waiting for API fixes
// ::: todo(blocking:[12,15],owners:[@alice,@bob]) auth redesign

// Universal parameters work with any marker
// ::: sec(owner:@bob,priority:critical) validate user inputs
// ::: ctx(parent:user-stories) explains authentication flow
```

**Bracket usage guidelines:**

- Single values: `blocked:4` or `blocked:[4]` (brackets optional but aid future editing)
- Multiple values: `blocked:[4,7]` (brackets required)
- Preference: Use brackets for parameters that commonly become multiple (`owners`, `blocked`, `tags`)

**Marker Flexibility:**

- Work markers can be standalone (`bug`, `fix`, `review`) OR parameters to `todo` (`todo(issue:4)`)
- **Ripgrep compatibility**: Use full forms like `todo(issue:4)` for reliable searching
- **Tool shortcuts**: Grepa tools can expand `issue(4)` → `todo(issue:4)` automatically
- Universal parameters provide consistent context across marker types
- Reserve braces `{}` for future use

### Core Marker Groups System

<!-- ::: todo #doc-migration -->

**Decision**: Organize markers into 6 semantic groups for flexible usage and searchability.

**Core Marker Groups:**

1. **`todo` group (work container):**
   - `todo` - general work container, can include other work markers as parameters
   - **Standalone work markers** (can also be `todo` parameters):
     - `bug` - defects to fix
     - `fix` / `fixme` - broken code requiring immediate attention
     - `task` - specific work items
     - `issue` / `ticket` - tracked work items
     - `pr` - pull request related work
     - `review` - code/design review needed

2. **`info` group (explanations/guidance):**
   - `context` - important background information for understanding code
   - `note` - general observations or explanations
   - `docs` - documentation needed or references
   - `explain` - detailed explanations of complex logic
   - `tldr` - brief summaries or overviews
   - `about` - overview or summary (synonym with tldr)
   - `example` - usage examples or demonstrations
   - `guide` - step-by-step instructions
   - `rule` - behavioral rules for humans or agents
   - `decision` - architectural or design decisions

3. **`notice` group (warnings/alerts):**
   - `warn` - general warnings or cautions
   - `flag` - general "look into this" guidance
   - `freeze` - code must not be modified
   - `critical` - critical issues requiring immediate attention
   - `unsafe` - potentially dangerous code
   - `deprecated` - code scheduled for removal
   - `unstable` - subject to change without notice
   - `experiment` - new features being tested
   - `changing` - code that will change in future versions

4. **`trigger` group (automated behaviors):**
   - `action` - general automated actions
   - `notify` - send notifications when conditions met
   - `alert` - urgent notifications
   - `hook` - integration with external systems

5. **`domain` group (specialized contexts):**
   - `api` - public interface definitions
   - `security` - security-sensitive code
   - `perf` - performance-critical sections
   - `deploy` - deployment-related code
   - `test` - testing-related markers
   - `data` - data handling or storage
   - `config` - configuration management
   - `lint` - code quality and style

6. **`status` group (lifecycle states):**
   - `temp` - temporary code to be removed
   - `placeholder` - incomplete implementations
   - `stub` - minimal implementations for testing
   - `mock` - fake implementations
   - `draft` - preliminary versions
   - `prototype` - experimental implementations
   - `complete` - finished implementations
   - `ready` - ready for next phase
   - `broken` - known non-functional code

**Work Marker Usage Examples:**

```javascript
// Standalone work markers (ripgrep-friendly)
// ::: bug authentication fails after timeout
// ::: review check error handling in payment flow  
// ::: issue(123) implement OAuth integration

// Todo container patterns (explicit work organization)
// ::: todo(bug:auth-timeout,priority:high) fix authentication timeout
// ::: todo(review:payment-flow,assign:@alice) check error handling
// ::: todo(issue:123,milestone:v2.1) implement OAuth integration

// Tool shortcuts (grepa tools can expand these automatically)
// issue(123) → todo(issue:123)
// bug(auth-timeout) → todo(bug:auth-timeout)
```

**Benefits:**

- **Flexible searching**: `rg ":::.*notice"` finds all warnings, or `rg ":M:.*warn"` for specific types
- **Semantic clarity**: Write precise markers (`freeze`, `critical`) rather than generic ones
- **Dual usage**: Work markers can be standalone or `todo` parameters for different search needs
- **Tool compatibility**: Full forms work with ripgrep; shortcuts work with grepa tools
- **Extensible**: Add new markers to existing groups without core changes
- **LLM-friendly**: Clear categorization helps AI agents understand intent

## Anchor Density Guidelines

<!-- ::: guide subjective recommendations for appropriate anchor usage -->
### Strategic Anchor Placement

<!-- ::: todo #doc-migration -->

**Core Principle**: Anchors exist to help AI agents quickly pinpoint important locations. Too few reduce discoverability; too many create noise.

**General Guidelines:**

1. **Document-level**: At least one anchor per commentable document
   - Use `tldr` or `about` for file/module overviews
   - Place near the top of files, classes, or major sections

2. **Function-level**: Complex functions (>20 lines) should have info group anchors
   - `tldr` for function purpose and behavior
   - `context` for important assumptions or constraints
   - `explain` for complex algorithms or business logic

3. **Temporary code**: Always anchor placeholder/temporary implementations
   - `temp` for code that will be replaced
   - `stub` for minimal implementations  
   - `placeholder` for incomplete sections
   - `mock` for fake implementations during development

4. **Todo placement**: No specific density rules due to their ad-hoc nature
   - Place todos wherever work is needed
   - **Rule**: `todo` must be the first marker if multiple markers in one anchor
   - Example: `// ::: todo,context,priority:high fix auth logic and document assumptions`

**Rough Density Target**: 1 anchor per 50-100 lines of code, adjusted for:

- **Higher density** for complex business logic, security code, or public APIs
- **Lower density** for straightforward utility functions or data structures

**Quality over Quantity**:

- Focus on **navigation value** - where would an AI agent need context?
- Avoid micro-anchoring every variable or simple operation
- Think in **logical units** - anchor the concept, not the implementation details

**Example Patterns:**

```javascript
// ::: about user authentication service with OAuth and 2FA support
class AuthService {
  
  // ::: context assumes Redis is available for session storage
  // ::: security critical path - all validation happens here
  async validateUser(token) {
    // ::: todo,flag verify token expiration logic is timezone-safe
    // implementation...
  }
  
  // ::: temp placeholder implementation until auth service v2.0
  // ::: stub basic validation - replace with proper JWT validation
  validateLegacySession(sessionId) {
    return sessionId?.length > 0;
  }
}
```

**Anti-pattern Example:**

```javascript
// Anti-pattern: Over-anchoring simple operations
// ::: variable declare user variable  
let user = getCurrentUser();
// ::: check validate user exists
if (!user) return;
// ::: variable get user preferences
let prefs = user.preferences;

// Better: Anchor the logical unit
// ::: context assumes user is authenticated before this function
// ::: explain loads user preferences with fallback defaults
function setupUserEnvironment() {
  let user = getCurrentUser();
  if (!user) return;
  let prefs = user.preferences || getDefaultPreferences();
  // ... setup logic
}
```

## Tag System and Semantic Navigation

<!-- ::: spec hashtag system for cross-cutting conceptual relationships -->
### Hashtags for Conceptual Linking

<!-- ::: todo #doc-migration -->

Waymarks support hashtags in prose for cross-cutting conceptual relationships that complement the structural marker system.

**Tag Syntax:**

- Standard hashtag convention: `#tag-name`
- Hierarchical paths: `#auth/oauth/google` (like Obsidian)
- Versioning with dots: `#api-v2.1`, `#jquery.3.6.0`
- Kebab-case for readability: `#mobile-app`, `#user-profiles`

**Examples:**

```javascript
// ::: todo implement OAuth for #mobile-app
// ::: context refactoring for #v2.0-release  
// ::: security audit required #compliance #pci-dss

// Hierarchical organization
// ::: todo mobile OAuth flow #auth/oauth/mobile
// ::: context legacy support #auth/session/v1
```

**Basic Usage:**

```bash
# Find conceptual relationships
rg "#mobile-app"           # All mobile-related work
rg "#auth/oauth"           # OAuth authentication items  
rg "#v2.0-release"         # Release-related work

# Combined searches
rg ":::.*todo.*#mobile"    # Mobile todos
rg "#compliance.*#audit"   # Compliance audits
```

**Purpose**: Tags create conceptual threads through codebases - use them for features, projects, compliance themes, or any cross-cutting concern that spans multiple anchors.

### Universal Parameter Groups

<!-- ::: todo #doc-migration -->

**Decision**: Organize parameters into 6 semantic groups that work across all marker types.

**Parameter Groups:**

1. **`mention` group (who/what entity):**
   - `owner:@alice` - who maintains/owns this code
   - `by:@agent` - who created this (useful for agent attribution)
   - `team:@frontend` - which team is responsible
   - `assign:@bob` - who should work on this (equivalent to `@bob`)

2. **`relation` group (connections):**
   - `parent:epic-123` - belongs to larger work item or hierarchy
   - `related:[4,7,docs-auth]` - connected items, cross-references
   - `depends:[auth-service,user-db]` - external dependencies required
   - `path:src/auth.js` - file or directory references
   - `url:https://docs.example.com` - web documentation or external links
   - `service:auth-api` - microservice or external service references
   - `endpoint:/api/users` - API endpoint references
   - `repo:frontend/components` - repository or codebase references
   - `issue:4` - issue tracker references (alternative to blocked/related)
   - `pr:123` - pull request references
   - `commit:a1b2c3d` - git commit references

3. **`workflow` group (work coordination):**
   - `blocked:[4,7]` - what prevents this work from proceeding
   - `blocking:[12,15]` - what this work prevents from proceeding  
   - `on:change` - trigger condition for automated actions
   - `reason:compliance` - explanation for why something exists

4. **`priority` group (importance/urgency):**
   - `priority:high` - importance level for triage
   - `severity:critical` - risk/impact level (especially for warnings)
   - `complexity:high` - difficulty level for code understanding

5. **`lifecycle` group (timing/state):**
   - `since:1.2.0` - version when introduced
   - `until:2.0.0` - version scheduled for removal
   - `status:in-progress` - current state of work
   - `type:bug` - classification category

6. **`scope` group (environment/context):**
   - `env:prod` - environment context (dev, staging, prod)
   - `platform:ios` - platform-specific behavior (ios, android, web)
   - `region:us-east` - geographic or deployment region
   - `build:debug` - build configuration context

**Usage Examples:**

```javascript
// Universal parameters work with any marker
// ::: todo(assign:@alice,priority:high,blocked:[4,7]) implement auth
// ::: security(owner:@bob,severity:critical,url:compliance-docs) validate inputs
// ::: context(complexity:high,since:1.2.0,path:algorithms/auth.js) recursive algorithm

// Specific reference types for clear context
// ::: api(endpoint:/users,service:user-api,path:routes/users.js) user management
// ::: deploy(depends:[auth-service],env:prod,repo:infrastructure) production setup
// ::: bug(issue:123,commit:a1b2c3d,related:[124,125]) fix authentication flow

// @mentions are equivalent to assign parameter
// ::: todo @alice implement auth
// ::: review @team-leads check performance impact
```

**Search Benefits:**

```bash
# Group-level searches
rg ":::.*mention"        # All assignments/ownership
rg ":::.*relation"       # All connections/references
rg ":::.*workflow"       # All work coordination
rg ":::.*priority"       # All importance/urgency markers

# Specific parameter searches  
rg ":::.*blocked"        # Just blocked items
rg ":::.*severity:critical"  # Critical severity items
rg ":::.*path:"          # All file references
rg ":::.*service:"       # All service references
rg ":::.*endpoint:"      # All API endpoint references
```

**Benefits:**

- **Universal application**: Same parameters work across all marker groups
- **Flexible searching**: Group-level or specific parameter searches
- **Clear semantics**: Parameters grouped by purpose and meaning
- **Extensible**: Add new parameters to existing groups without syntax changes