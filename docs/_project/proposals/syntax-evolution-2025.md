<!-- tldr ::: Consolidated proposal for a minimal, future-proof waymark syntax (markers · signals · actors · context) -->

# Syntax Evolution — Toward a Stable & Minimal Marker Set

## 0. Motivation

Our experience proved that **too many markers == cognitive load**.  Marker sprawl makes ripgrep less predictable and slows AI navigation.  This doc proposes a *one-time pruning + focused expansion* that should remain stable for several years.

Design pillars:

1. **Small, slow-moving marker namespace** – additions require RFC.  
2. **Signals** – 1-2 character symbols (e.g. `!`, `*`, `?`) that add urgency or emphasis without widening the marker list.  
3. **Rich properties / tags** – absorb the long tail of metadata.  
4. **Ripgrep-first ergonomics** – one-liner searches stay trivial.

## 1. What Each Channel Means

| Channel   | Purpose                              | Cardinality |
|-----------|--------------------------------------|-------------|
| **Signal**| Optional 1–2 char urgency/emphasis/sensitivity symbol (e.g. `!`, `^`, `-`). | Fixed set |
| **Marker**| High-signal keyword, unique per line; built for grep. | ≈20 fixed tokens |
| **Actor** | Optional `@handle` (bare or use with `property:@actor`) | Unlimited (first after sigil denotes actor/assignment) |
| **Property** | Structured key:value metadata (may carry parameters, arrays). | Unlimited |
| **Tag** | Free-form topical taxonomy, hierarchical (`+security/api`).| Unlimited |

If info is *not* high-signal *and* needs a value → **property**.  If it's purely topical → **tag**.  Markers are the scarce resource.

## 2. Marker Set (after pruning & additions)

### Work (`--is work`)

- `todo` - work to be done (`!!todo` == blocker,p0,critical | `!todo` == p1,high | `todo` == p2,medium | `?todo` == p3,low)
- `fix` - bugs to fix
- `done` - completed work
- `review` - needs review
- `refactor` - code that needs restructuring
- `needs` - dependencies or requirements
- `blocked` - work blocked by external dependency

**Note**: These are distinct markers, not synonyms. While `todo` is for general tasks, each work marker has specific semantics (e.g., `fix` for bugs, `review` for code review, `blocked` for external dependencies).

### Alerts (`--is alert`)

- `alert` - general warning or attention needed
- `risk` - potential risk or concern
- `notice` - important information to be aware of
- `always` - always-on marker (e.g. `always ::: @ai review for pii leaks`)

### State & Lifecycle `--is state`

- `temp` - temporary code
- `deprecated` - scheduled for removal
- `draft` - work in progress
- `stub` - skeleton/basic implementation
- `cleanup` - code cleanup needed

### Information & Documentation (`--is info`)

- `tldr` - brief summary (ONLY one per file at top, `!!tldr ::: ...` for most critical)
- `note` - general note (`!note ::: ...` important note)
- `summary` - code section summary
- `example` - usage example
- `idea` - future possibility
- `about` - explains purpose or context
- `docs` - documentation for this code (`docs ::: path/to/docs ...`)

### Quality & Process (`--is quality`)

- `test` - test-specific marker
- `audit` - requires audit review
- `check` - needs verification
- `lint` - intentional lint overrides/suppressions
- `ci` - CI/CD related markers

### Performance Domain (`--is performance`)

- `perf` - general performance concern (search alias)
- `hotpath` - tight loops/latency hot-paths
- `mem` - memory-sensitive or allocation hotspots
- `io` - disk/network throughput critical sections

### Security & Access Domain (`--is security`)

- `sec` - general security requirements (search alias)
- `auth` - authentication/authorization specific
- `crypto` - cryptography-specific requirements
- `a11y` - accessibility requirements/issues

### Meta & Special (`--is meta`)
- `flag` - feature flag marker
- `important` - important information
- `hack` - hacky solution
- `legal` - legal/compliance requirements
- `must` - must-hold requirements (use with `!` or `!!` for critical)
- `assert` - invariants that must hold true

Total markers: 41

### 2.3 Moved to Properties

`stable`, `shipped`, `hold`, `stale`, `broken` → `status:` property.  
`priority` already a property – encourage `priority:critical|high|medium|low`.  
Example:

```js
// note ::: status:shipped version:v3.1 public API
```

Note: Priority also has p0 / p1 / p2 / p3 which are synonyms for critical / high / medium / low.

### 2.4 Moved to Tags

`ask`, `hotfix`, `spike`, `locked`, `revisit`, `see` → tags.

```ts
// todo ::: update footer copy +frontend +a11y +spike
```

## 3. Specific Syntax Changes

**Important terminology**: We now use "marker" instead of "prefix" throughout. The term "prefix" only describes the position before `:::`.

### Removed Synonyms

- `fixme` → use `fix` only
- `temporary` → use `temp` only  
- `info` → use `note` only
- `wip` → use `draft` only

### Removed Markers/Properties

- `good`, `bad`, `remove` - removed entirely (neither marker nor property)
- `pin` - removed (use `*` signal for bookmarking)

### Terminology Changes  

- `lifecycle:` → `status:` (all properties)
- `broken` → now a status property (`status:broken`)
- "prefix" → "marker" (the keyword before `:::`)

### Remapped Concepts

- `caution` → use `!alert ::: ...`
- `why` → use `reason:` property
- `mustread` → use `!!note ::: ...` or `!!tldr ::: ...`

## 4. Signal Modifiers (Contextual Intensity)

| Symbol | Name        | Meaning (context-dependent on marker)                  |
|--------|-------------|-------------------------------------------------------|
| `*`    | Star        | Branch-scoped work that must be finished before PR merge |
| `!` / `!!` | Bang / Double-bang | Intensity modifier: important → critical |
| `?` / `??` | Question / Double-question | `?` needs clarification · `??` highly uncertain |
| `-` / `--`| Tombstone / Instant-prune | `-` mark for removal · `--` prune ASAP |
| `_`    | Underscore  | Ignore marker (reserved for future functionality) |

### Signal Interpretation by Context

The `!` and `!!` signals act as **intensity modifiers** with meaning that depends on the marker:

- **Work markers** (`todo`, `fix`): urgency/priority level
- **Info markers** (`tldr`, `note`): importance/must-read status  
- **Alert markers** (`alert`, `risk`): severity/criticality
- **Requirement markers** (`must`, `assert`, `always`): criticality of invariant

Placed *immediately* before the marker with **no space** (double symbol = stronger signal):

```go
// *todo ::: finish error handling before merge   // Branch-scoped work
// *fix ::: resolve edge case found in review     // Must fix before PR merge
// *!todo ::: critical bug blocking PR merge      // Urgent branch work
// !todo ::: migrate to new hashing algo          // Important task
// !!todo ::: fix data loss bug                   // Critical blocker
// ?note ::: does pagination handle zero items?   // Unclear assumption
// !tldr ::: core event-loop entry point          // Important summary
// !!tldr ::: main application entry point        // Most critical/canonical
// !!alert ::: patch data-loss vulnerability      // Critical security issue
// ??todo ::: clarify missing states diagram      // Very unclear requirement
// ?draft ::: rewrite using streaming parser      // Uncertain experimental work
// !must ::: array length must be power of two    // Important requirement
// !!assert ::: user_id never null                // Critical invariant
// _note ::: ignored by tooling                   // Reserved for future
// -todo ::: obsolete after migrating to v5 SDK   // Remove later
// --note ::: remove legacy explanation now       // Remove immediately
```

### 4.1 Updated Grammar Snippet (EBNF)

```ebnf
# Position and intensity signals are separate
position_signal ::= "*" | "_"
intensity_signal ::= ("!!" | "!" | "??" | "?" | "--" | "-")
signal ::= position_signal? intensity_signal?

# High-signal keyword
marker     ::= signal? ALPHANUM_

# Optional actor
actor      ::= "@" ALPHANUM_

# Context token – one word or blessed key:value
context    ::= word | key_value
key_value  ::= key ":" value
key        ::= "reason" | "since" | "until" | "version" | "affects" | "fixes" | "closes" | "depends" | "branch"
value      ::= word | "#" [0-9]+ | quoted_string

# Tag – optional label tokens starting with +
tag        ::= "+" [A-Za-z0-9_/-]+

# Waymark full
# First token after ::: determines type: actor (@) > context (word/key:value)
# Order is flexible but first token has precedence for parsing
waymark    ::= comment_leader marker? ":::" (actor space)? context? (space tag)* (space prose)?

word       ::= [A-Za-z0-9_]+
quoted_string ::= '"' [^"]* '"'
space      ::= " "
prose      ::= .*
```

### 4.2 Actor (optional `@handle`)

If the **very first token** after the sigil is an `@handle`, it is parsed as the **actor**—the person, team, or automated agent responsible for (or addressed by) the waymark.

```ts
// !todo  ::: @alice implement caching
// !!sec  ::: @security-team constant-time compare reason:timing-attack
// always ::: @ai review for pii leaks
```

Search helpers

```bash
# Any actor-addressed line
rg -n ':::.*@[A-Za-z0-9_-]+'

# Work assigned to you (actor can be anywhere after :::)
rg -n "todo.*:::.*@$(whoami)"

# Work assigned to specific person
rg -n ":::.*@alice"
```

### 4.3 Action-First Principle with Blessed Properties

The most actionable content should appear immediately after the actor (or `:::` if no actor). Blessed properties provide supporting metadata and can appear anywhere in the prose.

```ts
// todo ::: implement retry logic fixes:#234
// done ::: added validation closes:#456  
// fix  ::: investigate memory leak depends:#789
// blocked ::: waiting for API changes depends:#123
// todo ::: @alice implement OAuth flow branch:feature/auth
// fix ::: resolve payment bug branch:hotfix/payments fixes:#567
```

This pattern prioritizes readability while maintaining structured metadata:

```bash
# Find all issue references (anywhere after :::)
rg -n ':::.*#\d+'

# Find specific relations (anywhere in the waymark content)
rg -n ':::.*fixes:#\d+'     # What fixes issues
rg -n ':::.*closes:#\d+'    # What closes issues/PRs  
rg -n ':::.*depends:#\d+'   # What depends on issues

# Find branch-specific work (anywhere in the waymark content)
rg -n ':::.*branch:feature/'  # Feature branch work
rg -n ':::.*branch:hotfix/'   # Hotfix work

# Find work related to specific issue (anywhere after :::)
rg -n ':::.*#234\b'         # All references to issue #234
```

### 4.4 Prose vs `note` Marker

Waymarks can end with free-form **prose**. Use the `note` marker when that prose is itself valuable to grep in bulk; otherwise append prose to any other marker.

| Question | If **yes** → use `note` | Otherwise keep as prose |
|----------|-------------------------|------------------------|
| Will I ever want to list all such statements via `rg 'note :::'`? | ✅ |  |
| Is the comment pure, long-lived context? | ✅ |  |
| Is the remark short-lived or hyper-local? |  | ✅ |

Examples

```ts
// todo  ::: implement retry logic            // prose describes task
// note  ::: all timestamps are UTC           // durable context
// !must ::: buffer len mod 4                 // critical requirement
// alert ::: sanitize-input +security         // alert with tag
// fix   ::: memory leak in auth fixes:#234   // issue reference
```

Quick searches

```bash
# All contextual notes
rg -n 'note :::'

# Todo lines (content can vary after :::)
rg -n 'todo :::'

# All issue fixes (anywhere in waymark content)
rg -n ':::.*fixes:#\d+'
```

## 5. TLDR: The Most Critical Marker

> **If you only use one waymark pattern, make it `tldr`.**

The `tldr` marker is the single most valuable waymark for AI navigation and human understanding. It's the first thing agents read to understand a file's purpose and decide if they need to dig deeper.

### Why TLDR Matters

1. **AI Navigation** - Agents use tldrs to build mental maps of codebases
2. **Search Efficiency** - grep `tldr :::` instantly shows what every file does
3. **Onboarding Speed** - New developers understand structure in minutes
4. **Decision Making** - Quickly determine which files to read/modify

### The Golden Rules

1. **ONE per file** - At the very top (first waymark)
2. **Be SPECIFIC** - Say what the code DOES, not what it IS
3. **Include TECHNICAL DETAILS** - Main exports, patterns, dependencies
4. **Make it SEARCHABLE** - Include terms someone would grep for
5. **Use ACTIVE VOICE** - Present tense, action-oriented

### Writing Effective TLDRs

**❌ Poor tldrs** (too generic, provide no value):

```javascript
// tldr ::: authentication module
// tldr ::: handles user authentication  
// tldr ::: documentation for auth service
// tldr ::: manages OAuth flows
// tldr ::: utility functions
```

**✅ Excellent tldrs** (specific, actionable, searchable):

```javascript
// tldr ::: JWT auth middleware validating Bearer tokens via RS256
// tldr ::: React hooks for OAuth2 login with Google/GitHub providers
// tldr ::: Express REST API for user CRUD with role-based permissions
// tldr ::: CLI parsing waymarks into AST with visitor pattern
// tldr ::: AES-256-GCM encryption utils with scrypt key derivation
```

### TLDR Patterns by File Type

**Entry points** (use `!!tldr` for canonical entries):

```javascript
// !!tldr ::: Express server entry point binding port 3000 with auth+logging middleware
// !!tldr ::: React app root mounting Redux provider and router
// !!tldr ::: CLI main entry parsing args and dispatching commands
```

**Core libraries**:

```javascript
// tldr ::: database connection pool managing Postgres with pgbouncer
// tldr ::: WebSocket client with auto-reconnect and exponential backoff
// tldr ::: S3 upload manager with multipart and retry logic
```

**Components/UI**:

```javascript  
// tldr ::: UserProfile component displaying avatar+bio with edit mode
// tldr ::: DataTable with sorting, filtering, and virtual scroll
// tldr ::: Modal wrapper handling focus trap and ESC key
```

**Configuration**:

```javascript
// tldr ::: webpack prod config with code splitting and terser minification
// tldr ::: ESLint rules enforcing team style guide with TypeScript
// tldr ::: Docker Compose for local dev with Redis+Postgres+MinIO
```

**Tests**:

```javascript
// tldr ::: integration tests for payment API with Stripe mock
// tldr ::: e2e tests for checkout flow using Playwright
// tldr ::: unit tests for auth token validation edge cases
```

**Utilities**:

```javascript
// tldr ::: date formatting with timezone support via date-fns
// tldr ::: retry wrapper with exponential backoff and jitter
// tldr ::: deep object comparison ignoring key order
```

### Advanced TLDR Patterns

**For AI agents** - Include implementation hints:

```javascript
// tldr ::: rate limiter using sliding window with Redis sorted sets
// tldr ::: event sourcing aggregate root with snapshot optimization
```

**For monorepos** - Include package context:

```javascript
// tldr ::: @acme/auth shared auth logic for Express middleware
// tldr ::: @acme/ui-kit React component library with Storybook
```

**For critical code** - Use `!tldr` or `!!tldr`:

```javascript
// !tldr ::: payment processing with PCI compliance and audit logging
// !!tldr ::: main application entry coordinating all services
```

### TLDR for Documentation Files

**README files**:

```markdown
<!-- tldr ::: Waymark syntax specification and tooling for AI-navigable codebases -->
<!-- tldr ::: React component library setup guide with Storybook integration -->
<!-- tldr ::: Monorepo workspace configuration for pnpm with shared configs -->
```

**API Documentation**:

```markdown
<!-- tldr ::: REST API reference for user management endpoints with JWT auth -->
<!-- tldr ::: GraphQL schema documentation for e-commerce platform -->
<!-- tldr ::: OpenAPI 3.0 spec for payment processing microservice -->
```

**Guides and Tutorials**:

```markdown
<!-- tldr ::: Step-by-step AWS Lambda deployment guide with Terraform -->
<!-- tldr ::: Database migration strategy from MySQL to PostgreSQL -->
<!-- tldr ::: Performance optimization guide for React applications -->
```

**Architecture Docs**:

```markdown
<!-- tldr ::: Event-driven architecture design using Kafka and microservices -->
<!-- tldr ::: System design for real-time collaborative editing with CRDTs -->
<!-- tldr ::: Security architecture for multi-tenant SaaS platform -->
```

### TLDR for Configuration Files

**Build configs**:

```javascript
// tldr ::: Vite config for React with module federation and HMR
// tldr ::: Rollup config building ESM and CJS with TypeScript declarations
// tldr ::: Turbo config for monorepo with remote caching enabled
```

**CI/CD configs**:

```yaml
# tldr ::: GitHub Actions workflow for PR checks with parallel jobs
# tldr ::: GitLab CI pipeline deploying to K8s with canary releases
# tldr ::: CircleCI config with Docker layer caching and test splitting
```

**Container configs**:

```dockerfile
# tldr ::: Multi-stage Dockerfile for Node.js app with Alpine base
# tldr ::: Docker Compose setup for local dev with hot reload
# tldr ::: Kubernetes deployment manifest with HPA and health checks
```

**Infrastructure as Code**:

```hcl
// tldr ::: Terraform module for AWS ECS Fargate with ALB and auto-scaling
// tldr ::: Pulumi stack deploying serverless API with DynamoDB
// tldr ::: CDK app creating S3 + CloudFront static site hosting
```

### TLDR for Data Files

**Schema definitions**:

```sql
-- tldr ::: PostgreSQL schema for multi-tenant e-commerce with RLS
-- tldr ::: Prisma schema defining user auth models with relations
-- tldr ::: MongoDB schema validation rules for payment documents
```

**Migration files**:

```sql
-- tldr ::: Migration adding composite indexes for query performance
-- tldr ::: Migration converting status enum to state machine table
-- tldr ::: Rollback script for failed user permissions migration
```

**Seed data**:

```javascript
// tldr ::: Development seed data with 100 users and sample orders
// tldr ::: Test fixtures for integration tests with edge cases
// tldr ::: Production data anonymization script for dev environments
```

### TLDR for Scripts and Automation

**Build scripts**:

```bash
# tldr ::: Release script handling versioning, changelog, and npm publish
# tldr ::: Database backup script with S3 upload and retention policy
# tldr ::: Dependency update script with automated PR creation
```

**Dev tools**:

```python
# tldr ::: Code generator for CRUD endpoints from OpenAPI spec
# tldr ::: Git hooks setup script enforcing commit conventions
# tldr ::: Local environment setup automating all dependencies
```

**Data processing**:

```python
# tldr ::: ETL pipeline extracting Stripe data to BigQuery
# tldr ::: Log parser aggregating errors by service and severity
# tldr ::: CSV processor validating and importing customer data
```

### TLDR for Special Files

**Package files**:

```json
// tldr ::: Monorepo root with workspaces for api, web, and shared packages
// tldr ::: Library package exporting React hooks for real-time data
// tldr ::: CLI tool package for database migrations and seeding
```

**Lock files** (yes, even these benefit from context):

```yaml
# tldr ::: pnpm lock with 2453 deps, last updated for React 18 upgrade
# tldr ::: yarn.lock frozen for production deploy on Node 20.11.0
```

**Environment examples**:

```bash
# tldr ::: Environment template for local dev with required services
# tldr ::: Production env config for AWS deployment with secrets
```

**Git files**:

```gitignore
# tldr ::: Gitignore for Node.js monorepo with build artifacts excluded
# tldr ::: Git attributes enforcing LF endings and marking generated files
```

## 6. Blessed property keys

| Key       | Purpose                         | Example |
|-----------|---------------------------------|---------|
| reason    | root cause / risk label         | `reason:sql_injection` |
| since     | first version/date introduced   | `since:v4.2` |
| until     | planned removal version/date    | `until:v6.0` |
| version   | explicit semver reference       | `version:v1.0.1` |
| affects   | impacted subsystem/module       | `affects:payments` |
| fixes     | resolves the given ticket       | `fixes:#456` |
| closes    | closes ticket/PR                | `closes:#12` |
| depends   | depends on external ticket      | `depends:#789` |
| branch    | git branch reference            | `branch:feature/auth` |

Only these keys are recognized for context tokens. Additional metadata can appear later in prose.

## 7. Context token casing guideline

The **context token**—first non-actor token after the sigil—should be 1-3 words (preferably 1-2 for readability).

**Preferred casing**: `snake_case`

Allowed characters: ASCII letters, digits, and `_`.

```ts
// !!alert ::: p0                      # severity implicit via signal
// !alert  ::: timing_attack           # snake_case context token (preferred)
// alert   ::: sql_injection_risk      # clear multi-word context
// todo    ::: migrate to v5 closes:#789 branch:feature/migration
// blocked ::: waiting for API changes depends:#123
```

## 8. Ripgrep Cheat-Sheet

### 8.1 Find all waymarks with **any** signal

```bash
rg -n "(!{1,2}|\?{1,2}|-{1,2}|_)[A-Za-z0-9_-]+[[:space:]]+:::"
```

### 8.2 Urgent / critical items (bang)

```bash
rg -n "!{1,2}[A-Za-z0-9_-]+[[:space:]]+:::"          # any !<prefix> ::: or !!<prefix> :::
```

### 8.3 Unanswered questions

```bash
rg -n "\?{1,2}[A-Za-z0-9_-]+[[:space:]]+:::"        # ?note, ??todo, …
```

### 8.4 Performance hot-paths (any signal)

```bash
# plain
rg -n "\b(hotpath|mem|io)[[:space:]]+:::"

# critical hot-paths
rg -n "!{1,2}[A-Za-z0-9_-]*hotpath[[:space:]]+:::"
```

### 8.5 Critical requirements

```bash
rg -n "!{1,2}must[[:space:]]+:::"          # critical requirements
rg -n "!{1,2}assert[[:space:]]+:::"        # critical invariants
```

### 8.6 Issue references and relations

```bash
# All issue references (anywhere in waymark content)
rg -n ":::.*#\d+"

# Specific relations (anywhere in waymark content)
rg -n ":::.*fixes:#\d+"                    # What fixes issues
rg -n ":::.*closes:#\d+"                   # What closes PRs/issues
rg -n ":::.*depends:#\d+"                  # What depends on issues

# Find specific issue across all relations
rg -n ":::.*#234\b"                        # All references to issue #234
```

### 8.7 Branch-specific work

```bash
# All branch references (anywhere in waymark content)
rg -n ":::.*branch:"

# Feature branch work
rg -n ":::.*branch:feature/"               # All feature work
rg -n ":::.*branch:feature/auth"           # Specific feature

# Hotfix work
rg -n ":::.*branch:hotfix/"                # All hotfixes
rg -n ":::.*branch:hotfix/security"        # Security hotfixes

# Release branch work
rg -n ":::.*branch:release/"               # Release preparation

# Work assigned to you on specific branch
rg -n ":::.*@$(whoami).*branch:feature/"   # Your feature work
```

### 8.8 Actor-specific searches

```bash
# All work assigned to specific person (anywhere in waymark content)
rg -n ":::.*@alice"

# Work assigned to you (anywhere in waymark content)
rg -n ":::.*@$(whoami)"

# Specific marker assigned to person
rg -n "todo.*:::.*@alice"                  # Alice's todos
rg -n "review.*:::.*@security-team"        # Security team reviews

# Combine actor with other metadata
rg -n ":::.*@alice.*branch:feature/"       # Alice's feature work
rg -n ":::.*@bob.*fixes:#\d+"              # Bob's issue fixes
```

### 8.9 Tombstoned waymarks

```bash
# Marked for future removal (-)
rg -n "-[A-Za-z0-9_-]+[[:space:]]+:::"

# Immediate prune (--)
rg -n "--[A-Za-z0-9_-]+[[:space:]]+:::"
```

### 8.10 Marker frequency audit

```bash
rg -o "(!{1,2}|\?{1,2}|-{1,2}|_)?[A-Za-z0-9_-]+[[:space:]]+:::" | \
  sed 's/[[:space:]]\+:::.*//' | sort | uniq -c | sort -nr | head
```

### 8.11 Performance markers (using alias pattern)

```bash
# Find all performance-related waymarks
alias waymark-perf="rg '\b(hotpath|mem|io|perf)[[:space:]]+:::'"

# Find critical performance issues
rg -n "!{1,2}[A-Za-z0-9_-]*(hotpath|mem|io|perf)[[:space:]]+:::"
```

## 9. Search Patterns at a Glance

| Need                            | ripgrep one-liner |
|---------------------------------|--------------------|
| All waymarks                    | `rg " :::"` |
| All with signal                 | `rg "(!{1,2}|\?{1,2}|-{1,2}|_)[A-Za-z0-9_-]+ :::"` |
| Critical TODOs                  | `rg "!{1,2}todo :::"` |
| Security-critical code          | `rg "\b(sec|auth) :::"` |
| All performance hotspots        | `rg "\b(hotpath|mem|io|perf) :::"` |
| Important summaries             | `rg "!tldr :::"` |
| Critical requirements           | `rg "!{1,2}must :::"` |
| Issue references                | `rg ":::.*#\d+"` |
| Issue fixes                     | `rg ":::.*fixes:#\d+"` |
| Branch work                     | `rg ":::.*branch:"` |
| Feature branches                | `rg ":::.*branch:feature/"` |
| Work assigned to you            | `rg ":::.*@$(whoami)"` |

## 10. Migration Plan

### Phase 1: Automated Syntax Updates (Breaking Changes)

#### 1.1 Remove Deprecated Synonyms

```bash
# Replace all synonyms with canonical forms
find . -type f -exec sed -i '' 's/fixme :::/fix :::/g' {} +
find . -type f -exec sed -i '' 's/temporary :::/temp :::/g' {} +
find . -type f -exec sed -i '' 's/info :::/note :::/g' {} +
find . -type f -exec sed -i '' 's/wip :::/draft :::/g' {} +
```

#### 1.2 Convert Removed Markers

```bash
# Convert removed markers to appropriate replacements
find . -type f -exec sed -i '' 's/good :::/note ::: status:approved/g' {} +
find . -type f -exec sed -i '' 's/bad :::/note ::: status:rejected/g' {} +
find . -type f -exec sed -i '' 's/remove :::/temp :::/g' {} +
find . -type f -exec sed -i '' 's/caution :::/!alert :::/g' {} +
find . -type f -exec sed -i '' 's/pin :::/\*note :::/g' {} +
find . -type f -exec sed -i '' 's/broken :::/note ::: status:broken/g' {} +
```

#### 1.3 Update Property Names

```bash
# Change lifecycle to status everywhere
find . -type f -exec sed -i '' 's/lifecycle:/status:/g' {} +
```

#### 1.4 Convert Context to Properties

```bash
# Convert why markers to reason properties
find . -type f -exec sed -i '' 's/why :::\([^:]*\)$/note ::: reason:\1/g' {} +

# Convert mustread to double-bang signals
find . -type f -exec sed -i '' 's/mustread :::/!!note :::/g' {} +

# Update any old reference patterns to blessed key pattern (if any exist)
find . -type f -exec sed -i '' 's/#\([0-9]\+\):fixes/fixes:#\1/g' {} +
find . -type f -exec sed -i '' 's/#\([0-9]\+\):closes/closes:#\1/g' {} +
find . -type f -exec sed -i '' 's/#\([0-9]\+\):depends/depends:#\1/g' {} +
```

### Phase 2: Manual Review Required

#### 2.1 Context Token Updates

- Review all waymarks for kebab-case context tokens
- Convert to snake_case: `timing-attack` → `timing_attack`
- Ensure context tokens are 1-3 words max
- Update any remaining old reference patterns to blessed key format

#### 2.2 Signal Application

- Identify critical items that should use `!` or `!!`
- Add `^` to dangerous/protected code sections
- Apply `*` to important reference points

### Phase 3: Validation & CI Integration

#### 3.1 Linting Rules

```yaml
# .waymark-lint.yml
markers:
  allowed: # e.g., subset of default markers, which otherwise would be banned
    - todo
    - fix
    - done
    - review
    - refactor
    - needs
    - blocked
    # ... (full list from section 2)
  
  banned:
    - fixme: "Use 'fix' instead"
    - temporary: "Use 'temp' instead"
    - info: "Use 'note' instead"
    - wip: "Use 'draft' instead"
    - good: "Removed - use status:approved after `:::`"
    - bad: "Removed - use status:rejected after `:::`"
    - remove: "Removed - use the '-' signal (e.g., '-note') instead"

  aliases:
    todo: ["issue", "ticket", "task"]
```

#### 3.2 CI Checks

```bash
# Pre-commit hook
#!/bin/bash
# Check for banned markers
if grep -r "\\(fixme\\|temporary\\|info\\|wip\\|good\\|bad\\|remove\\) :::" .; then
  echo "Error: Found banned markers. Run migration scripts."
  exit 1
fi

# Check for old lifecycle property
if grep -r "lifecycle:" .; then
  echo "Error: Found 'lifecycle:' - should be 'status:'"
  exit 1
fi
```

### Phase 4: Documentation Updates

1. Update all documentation to reflect new syntax
2. Create migration guide with before/after examples
3. Update IDE/editor snippets and configurations
4. Notify team of breaking changes

### Breaking Changes Summary

**No backwards compatibility** - this is a clean break to establish the new standard:

1. All synonyms removed - one canonical form per concept
2. Several markers removed entirely or converted to properties/signals
3. `lifecycle` → `status` everywhere
4. Context tokens must use snake_case
5. New signal system is primary way to express urgency/state

## 11. Open Questions

1. ~~Should `audit` remain a marker or become a `process:audit` property?~~ **Resolved**: Keep as marker
2. ~~Do we keep both `hot` *and* `mem`/`io`, or collapse into a single `perf` marker with `type:` property?~~ **Resolved**: Keep separate, add `perf` as search alias  
3. ~~Caret (`^`) overlaps conceptually with `assert` – keep both (flag vs marker) or rely on `^assert` combo only?~~ **Resolved**: Removed `^` signal; use `!`/`!!` with markers instead
4. Should we formalize the ordering preference for tokens after `:::` (@actor > #ref > context)?

## 12. Conclusion

This proposal tightens the marker namespace while growing expressiveness via **signal symbols** and **rich tags**.  It delivers dead-simple ripgrep discovery without sacrificing future flexibility.

### Future Extensions

Advanced patterns like multi-line waymarks with closing delimiters (`:::`) will be documented separately in an advanced patterns guide. These remain optional extensions that don't change the core syntax.




