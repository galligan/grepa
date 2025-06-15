<!-- :ga:tldr monorepo organization patterns and strategies for grep-anchors -->
# Monorepo Organization Patterns for Grep-Anchors
<!-- ::: keep: brainstorming document about monorepo organization patterns -->
<!-- :ga:ctx exploration of different approaches to organizing anchors in monorepos -->

## Core Problem

Every monorepo is structured differently, making it challenging to create universal grep-anchor organization patterns. The goal is to find flexible approaches that:

- Adapt to any repository structure without over-engineering
- Provide self-documentation value
- Work with existing tooling (ripgrep, grepa CLI)
- Scale from small to enterprise monorepos

## Directory Structure Patterns

**Common monorepo organizations:**

### 1. Traditional Services Pattern
```
services/
├── auth-service/
├── payment-service/
├── user-service/
└── notification-service/
shared/
├── utils/
├── types/
└── config/
```

### 2. Apps + Packages Pattern  
```
apps/
├── web/
├── mobile/
└── admin/
packages/
├── ui-components/
├── api-client/
└── shared-utils/
```

### 3. Domain-First Pattern
```
domains/
├── auth/
├── payment/
└── catalog/
libs/
├── shared/
└── utils/
apps/
├── storefront/
└── admin/
```

### 4. Nx-Style Workspace
```
apps/
├── web-app/
└── mobile-app/
libs/
├── feature/
│   ├── auth/
│   └── payment/
├── ui/
│   └── components/
└── data-access/
    └── api/
```

### 5. Flat Packages
```
packages/
├── auth-service/
├── payment-service/
├── web-app/
├── mobile-app/
├── shared-ui/
└── shared-utils/
```

## Proposed Solutions

### Solution 1: Universal `repo:` Pattern

**Core Concept:** Use actual file paths as namespaces with `repo:` prefix.

```javascript
// Self-documenting path-based anchors
// :ga:repo:packages/auth-service,todo implement OAuth
// :ga:repo:apps/web/login,bug fix validation
// :ga:repo:libs/shared-utils,perf optimize debounce
// :ga:repo:docs/api-spec,see OpenAPI definition
```

**Benefits:**
- **Self-documenting** - namespace literally tells you where code lives
- **No configuration needed** - mirrors actual directory structure  
- **Tool-friendly** - tools can auto-suggest based on actual paths
- **Migration-safe** - if you move directories, anchors need updating anyway
- **Universal** - works with any monorepo structure

**Search patterns:**
```bash
# Find all auth-related code
rg ":ga:repo:.*auth" 

# Find all frontend code
rg ":ga:repo:apps/web"
rg ":ga:repo:packages/ui"

# Find shared utilities
rg ":ga:repo:.*shared"
rg ":ga:repo:libs/"
```

**Configuration aliases:**
```yaml
# grepaconfig.yaml
search-aliases:
  auth: ["repo:packages/auth-service", "repo:packages/auth-*"]
  frontend: ["repo:apps/web", "repo:apps/mobile", "repo:packages/ui-*"]
  backend: ["repo:packages/*-service", "repo:services/*"]
  shared: ["repo:libs/*", "repo:packages/shared-*", "repo:shared/*"]
```

### Solution 2: Tool-Enhanced Context

**Core Concept:** Basic `repo:` anchors enhanced by tool integration.

**OpenAPI Integration:**
```javascript
// :ga:repo:api/users,method:POST create user endpoint
// Tool reads openapi.json and enhances with:
// - HTTP method and path
// - Request/response schemas  
// - Authentication requirements
```

**Package.json Discovery:**
```javascript
// :ga:repo:packages/ui-components,version:2.1.0 button component
// Tool reads package.json and shows:
// - Current version
// - Dependencies
// - Scripts available
```

**Git Integration:**
```javascript
// :ga:repo:src/auth.js,blame:@alice recent changes by Alice
// Tool uses git blame/log for:
// - Recent commit authors
// - Change frequency
// - Last modified dates
```

**Dependency Analysis:**
```javascript
// :ga:repo:packages/auth,depends:[redis,postgres] authentication service
// Tool analyzes package.json, Dockerfile, etc. to show:
// - External dependencies
// - Internal package dependencies
// - Infrastructure requirements
```

### Solution 3: Configuration-Driven Service Discovery

**Core Concept:** Define service mappings in configuration, use simple anchors.

**grepaconfig.yaml:**
```yaml
# Root monorepo config
services:
  auth:
    directories: ["packages/auth-service", "services/auth"]
    team: "@auth-team"
    aliases: ["authentication", "login", "oauth"]
  payment:
    directories: ["packages/payment-service", "services/payment"] 
    team: "@payments-team"
    aliases: ["billing", "stripe", "checkout"]
  frontend:
    directories: ["apps/web", "apps/mobile", "packages/ui-*"]
    team: "@frontend-team"
    aliases: ["ui", "components", "webapp"]

search-patterns:
  service: "repo:{directories}"
  team: "@{team}"
  domain: "#{aliases}"
```

**Usage:**
```javascript
// Simple service references
// :ga:auth,todo implement OAuth
// :ga:payment,bug fix Stripe webhook
// :ga:frontend,perf optimize bundle size

// Tool expands based on config:
// :ga:auth → search in packages/auth-service, services/auth
// Team mentions: @auth-team, @payments-team, @frontend-team
```

### Solution 4: Hybrid Approach

**Core Concept:** Combine path-based anchors with service abstractions.

```javascript
// Explicit path for precision
// :ga:repo:packages/auth-service/oauth.js,todo implement Google provider

// Service abstraction for broader scope  
// :ga:auth.oauth,todo implement Google provider #auth-service

// Cross-service relationships
// :ga:repo:apps/web/login,depends(on:auth.oauth) login form needs OAuth

// Team coordination
// :ga:auth.migration,affects[payment,frontend] database schema change
```

**Configuration:**
```yaml
services:
  auth:
    namespace: "auth"
    directories: ["packages/auth-service"]
    team: "@auth-team"
  
aliases:
  # Service shortcuts
  auth: "repo:packages/auth-service"
  payment: "repo:packages/payment-service"  
  web: "repo:apps/web"
  
  # Domain shortcuts
  backend: ["auth", "payment", "user"]
  frontend: ["web", "mobile", "ui"]
```

## Cross-Service Relationship Patterns

Building on the relational markers from the main document:

### Service Dependencies
```javascript
// :ga:repo:apps/web/checkout,depends(on:payment.stripe) checkout flow
// :ga:repo:packages/notification,listens(to:payment.success) send receipts
// :ga:repo:packages/analytics,consumes(api:user.events) track behavior
```

### API Contracts
```javascript
// :ga:repo:api/auth/login,provides(endpoint:/auth/login) authentication API
// :ga:repo:apps/web/auth,consumes(api:/auth/login) login component
// :ga:repo:packages/api-client,calls(service:auth.login) API wrapper
```

### Event Flows
```javascript
// :ga:repo:packages/user,emits(event:user.created) user registration
// :ga:repo:packages/email,listens(to:user.created) welcome email
// :ga:repo:packages/analytics,listens(to:user.created) track signup
```

### Deployment Relationships
```javascript
// :ga:repo:packages/auth,deploys(with:api-gateway) same k8s namespace
// :ga:repo:packages/payment,scales(based-on:checkout.traffic) auto-scaling
// :ga:repo:packages/cache,shared(by:[auth,payment,user]) Redis instance
```

## Search Strategy Examples

### Find Service Dependencies
```bash
# What depends on auth service?
rg ":ga:.*depends.*auth" --type js

# What does payment service depend on?
rg ":ga:repo:.*payment.*depends" --type js

# Find all cross-service API calls
rg ":ga:.*consumes.*api:" --type js
```

### Team Coordination
```bash
# Find work assigned to auth team
rg ":ga:.*@auth-team" --type js
rg ":ga:repo:.*auth.*todo" --type js

# Find changes affecting multiple services
rg ":ga:.*affects\[.*," --type js
```

### Impact Analysis
```bash
# Find everything that could break if auth changes
rg ":ga:.*depends.*auth|:ga:.*consumes.*auth" --type js

# Find deployment dependencies
rg ":ga:.*deploys.*with:" --type js
```

## Migration and Evolution Patterns

### Service Refactoring
```javascript
// :ga:repo:packages/auth-v1,deprecated(until:2024-06-01) legacy auth service
// :ga:repo:packages/auth-v2,migration(from:auth-v1) new authentication
// :ga:repo:apps/web,migration(auth:v1->v2) update to new auth API
```

### Breaking Changes
```javascript
// :ga:repo:api/v2/users,breaking(affects:[web,mobile]) new user API
// :ga:repo:packages/types,breaking(version:3.0) TypeScript definitions
// :ga:migration.user-schema,affects[auth,payment,analytics] database change
```

### Feature Flags
```javascript
// :ga:repo:packages/auth,feature(flag:oauth-v2) new OAuth implementation
// :ga:repo:apps/web,feature(flag:oauth-v2) use new auth in UI
// :ga:repo:packages/payment,feature(flag:oauth-v2) payment with new auth
```

## Tool Integration Opportunities

### Automatic Service Discovery
```bash
# Tool scans package.json files and suggests services
grepa discover --scan-packages

# Output:
# Found services:
# - auth-service (packages/auth-service)
# - payment-service (packages/payment-service)  
# - ui-components (packages/ui-components)
```

### Dependency Mapping
```bash
# Generate service dependency graph
grepa map --dependencies --output deps.json

# Validate dependencies
grepa validate --check-cycles --type service-deps
```

### Search Enhancement
```bash
# Service-aware search
grepa find todo --service auth
grepa find bugs --affecting payment
grepa find breaking --team frontend
```

## Best Practices

### Path-Based Organization
- Use `repo:` prefix for explicit path references
- Keep paths relative to repository root
- Use configuration aliases for common searches
- Let tools enhance with contextual information

### Service Boundaries
- Respect existing service architecture in anchor organization
- Use cross-service relational markers for dependencies
- Document API contracts between services
- Track breaking changes that affect multiple services

### Team Coordination
- Use explicit team mentions (@auth-team, @frontend-team)
- Document ownership clearly in anchors
- Use priority markers for coordination (priority:critical affects all teams)
- Link to issues/discussions for complex coordination

### Migration Planning
- Use temporal markers (deadline:2024-06-01, until:v3.0)
- Document migration paths between services
- Track feature flag rollouts across services
- Plan breaking changes with affected service lists

## Future Exploration

### Plugin System Integration
The plugin architecture from the main document could provide monorepo-specific patterns:

```yaml
# @grepa/monorepo plugin
templates:
  service-todo: "repo:$1,todo,team:$team"
  cross-service: "repo:$1,depends(on:$2)"
  
service-discovery:
  scan: ["packages/*/package.json", "services/*/package.json"]
  patterns: ["packages/*", "services/*", "apps/*", "libs/*"]
```

### AI Agent Integration
```javascript
// :ga:repo:packages/auth,@claude(review:security) security review needed
// :ga:repo:apps/web/checkout,@cursor(implement:stripe) add Stripe integration
// :ga:repo:packages/shared,@agent(document:api) generate API docs
```

### OpenAPI Enhancement
```javascript
// :ga:repo:api/users,openapi(POST:/users) create user endpoint
// Tool reads openapi.yaml and provides:
// - Parameter validation
// - Response schema
// - Authentication requirements
// - Rate limiting info
```

## Conclusion

The `repo:` pattern provides the most flexible approach for monorepo organization:

1. **Universal applicability** - works with any directory structure
2. **Self-documenting** - namespace shows actual code location  
3. **Tool enhancement** - can be enriched with package.json, OpenAPI, git data
4. **Configuration flexibility** - teams can define search shortcuts
5. **Cross-service relationships** - explicit dependency markers work across services

This approach avoids over-engineering while providing the structure needed for large-scale monorepo navigation and coordination.