<!-- tldr ::: TLDR marker guide - the most critical waymark for AI navigation and human understanding -->

# TLDR: The Most Critical Marker

> **If you only use one waymark pattern, make it `tldr`.**

The `tldr` marker is the single most valuable waymark for AI navigation and human understanding. It's the first thing agents read to understand a file's purpose and decide if they need to dig deeper.

## Why TLDR Matters

1. **AI Navigation** - Agents use tldrs to build mental maps of codebases
2. **Search Efficiency** - grep `tldr :::` instantly shows what every file does
3. **Onboarding Speed** - New developers understand structure in minutes
4. **Decision Making** - Quickly determine which files to read/modify

## The Golden Rules

1. **ONE per file** - At the very top (first waymark)
2. **Be SPECIFIC** - Say what the code DOES, not what it IS
3. **Include TECHNICAL DETAILS** - Main exports, patterns, dependencies
4. **Make it SEARCHABLE** - Include terms someone would grep for
5. **Use ACTIVE VOICE** - Present tense, action-oriented

## Writing Effective TLDRs

### ❌ Poor tldrs (too generic, provide no value)

```javascript
// tldr ::: authentication module
// tldr ::: handles user authentication  
// tldr ::: documentation for auth service
// tldr ::: manages OAuth flows
// tldr ::: utility functions
```

### ✅ Excellent tldrs (specific, actionable, searchable)

```javascript
// tldr ::: JWT auth middleware validating Bearer tokens via RS256
// tldr ::: React hooks for OAuth2 login with Google/GitHub providers
// tldr ::: Express REST API for user CRUD with role-based permissions
// tldr ::: CLI parsing waymarks into AST with visitor pattern
// tldr ::: AES-256-GCM encryption utils with scrypt key derivation
```

## TLDR Patterns by File Type

### Entry points (use `!!tldr` for canonical entries)

```javascript
// !!tldr ::: Express server entry point binding port 3000 with auth+logging middleware
// !!tldr ::: React app root mounting Redux provider and router
// !!tldr ::: CLI main entry parsing args and dispatching commands
```

### Core libraries

```javascript
// tldr ::: database connection pool managing Postgres with pgbouncer
// tldr ::: WebSocket client with auto-reconnect and exponential backoff
// tldr ::: S3 upload manager with multipart and retry logic
```

### Components/UI

```javascript  
// tldr ::: UserProfile component displaying avatar+bio with edit mode
// tldr ::: DataTable with sorting, filtering, and virtual scroll
// tldr ::: Modal wrapper handling focus trap and ESC key
```

### Configuration

```javascript
// tldr ::: webpack prod config with code splitting and terser minification
// tldr ::: ESLint rules enforcing team style guide with TypeScript
// tldr ::: Docker Compose for local dev with Redis+Postgres+MinIO
```

### Tests

```javascript
// tldr ::: integration tests for payment API with Stripe mock
// tldr ::: e2e tests for checkout flow using Playwright
// tldr ::: unit tests for auth token validation edge cases
```

### Utilities

```javascript
// tldr ::: date formatting with timezone support via date-fns
// tldr ::: retry wrapper with exponential backoff and jitter
// tldr ::: deep object comparison ignoring key order
```

## Advanced TLDR Patterns

### For AI agents - Include implementation hints

```javascript
// tldr ::: rate limiter using sliding window with Redis sorted sets
// tldr ::: event sourcing aggregate root with snapshot optimization
```

### For monorepos - Include package context

```javascript
// tldr ::: @acme/auth shared auth logic for Express middleware
// tldr ::: @acme/ui-kit React component library with Storybook
```

### For critical code - Use `!tldr` or `!!tldr`

```javascript
// !tldr ::: payment processing with PCI compliance and audit logging
// !!tldr ::: main application entry coordinating all services
```

## TLDR for Documentation Files

### README files

```markdown
<!-- tldr ::: Waymark syntax specification and tooling for AI-navigable codebases -->
<!-- tldr ::: React component library setup guide with Storybook integration -->
<!-- tldr ::: Monorepo workspace configuration for pnpm with shared configs -->
```

### API Documentation

```markdown
<!-- tldr ::: REST API reference for user management endpoints with JWT auth -->
<!-- tldr ::: GraphQL schema documentation for e-commerce platform -->
<!-- tldr ::: OpenAPI 3.0 spec for payment processing microservice -->
```

### Guides and Tutorials

```markdown
<!-- tldr ::: Step-by-step AWS Lambda deployment guide with Terraform -->
<!-- tldr ::: Database migration strategy from MySQL to PostgreSQL -->
<!-- tldr ::: Performance optimization guide for React applications -->
```

### Architecture Docs

```markdown
<!-- tldr ::: Event-driven architecture design using Kafka and microservices -->
<!-- tldr ::: System design for real-time collaborative editing with CRDTs -->
<!-- tldr ::: Security architecture for multi-tenant SaaS platform -->
```

## TLDR for Configuration Files

### Build configs

```javascript
// tldr ::: Vite config for React with module federation and HMR
// tldr ::: Rollup config building ESM and CJS with TypeScript declarations
// tldr ::: Turbo config for monorepo with remote caching enabled
```

### CI/CD configs

```yaml
# tldr ::: GitHub Actions workflow for PR checks with parallel jobs
# tldr ::: GitLab CI pipeline deploying to K8s with canary releases
# tldr ::: CircleCI config with Docker layer caching and test splitting
```

### Container configs

```dockerfile
# tldr ::: Multi-stage Dockerfile for Node.js app with Alpine base
# tldr ::: Docker Compose setup for local dev with hot reload
# tldr ::: Kubernetes deployment manifest with HPA and health checks
```

### Infrastructure as Code

```hcl
// tldr ::: Terraform module for AWS ECS Fargate with ALB and auto-scaling
// tldr ::: Pulumi stack deploying serverless API with DynamoDB
// tldr ::: CDK app creating S3 + CloudFront static site hosting
```

## TLDR for Data Files

### Schema definitions

```sql
-- tldr ::: PostgreSQL schema for multi-tenant e-commerce with RLS
-- tldr ::: Prisma schema defining user auth models with relations
-- tldr ::: MongoDB schema validation rules for payment documents
```

### Migration files

```sql
-- tldr ::: Migration adding composite indexes for query performance
-- tldr ::: Migration converting status enum to state machine table
-- tldr ::: Rollback script for failed user permissions migration
```

### Seed data

```javascript
// tldr ::: Development seed data with 100 users and sample orders
// tldr ::: Test fixtures for integration tests with edge cases
// tldr ::: Production data anonymization script for dev environments
```

## TLDR for Scripts and Automation

### Build scripts

```bash
# tldr ::: Release script handling versioning, changelog, and npm publish
# tldr ::: Database backup script with S3 upload and retention policy
# tldr ::: Dependency update script with automated PR creation
```

### Dev tools

```python
# tldr ::: Code generator for CRUD endpoints from OpenAPI spec
# tldr ::: Git hooks setup script enforcing commit conventions
# tldr ::: Local environment setup automating all dependencies
```

### Data processing

```python
# tldr ::: ETL pipeline extracting Stripe data to BigQuery
# tldr ::: Log parser aggregating errors by service and severity
# tldr ::: CSV processor validating and importing customer data
```

## TLDR for Special Files

### Package files

```json
// tldr ::: Monorepo root with workspaces for api, web, and shared packages
// tldr ::: Library package exporting React hooks for real-time data
// tldr ::: CLI tool package for database migrations and seeding
```

### Lock files (yes, even these benefit from context)

```yaml
# tldr ::: pnpm lock with 2453 deps, last updated for React 18 upgrade
# tldr ::: yarn.lock frozen for production deploy on Node 20.11.0
```

### Environment examples

```bash
# tldr ::: Environment template for local dev with required services
# tldr ::: Production env config for AWS deployment with secrets
```

### Git files

```gitignore
# tldr ::: Gitignore for Node.js monorepo with build artifacts excluded
# tldr ::: Git attributes enforcing LF endings and marking generated files
```

## Quick Reference

- **Search all tldrs**: `rg "tldr :::"`
- **Find critical entries**: `rg "!!tldr :::"`
- **Find important summaries**: `rg "!tldr :::"`

<!-- stub ::: feature documentation for tldr marker -->