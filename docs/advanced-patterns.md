# Advanced Grep-Anchor Patterns
<!-- :ga:tldr Advanced patterns including JSON payloads and complex workflows -->
<!-- :ga:guide Advanced usage patterns and sophisticated techniques -->

This document covers advanced usage patterns for grep-anchors, including JSON payloads, complex metadata, and sophisticated workflows.

## JSON Payloads

For richer metadata, you can use JSON objects in your anchors:

### Temporal Metadata
```javascript
// :ga:{"until":"2024-06-01","reason":"Chrome bug workaround"}
function patchChromeBug() {
    // temporary fix
}

// :ga:{"since":"v1.8","deprecated":"v2.0","replacement":"newAPI.process"}
function legacyProcess() {
    // old implementation
}
```

### Ownership and Assignment
```python
# :ga:{"owner":"@alice","reviewer":"@bob","deadline":"2024-03-15"}
def implement_feature():
    pass

# :ga:{"team":"security","priority":"high","sla":"24h"}
def fix_vulnerability():
    pass
```

### Complex Relationships
```typescript
// :ga:{"epic":"user-auth","depends":["session-mgmt","crypto"],"blocks":["checkout"]}
class AuthenticationService {
    // implementation
}

// :ga:{"parent":"EPIC-123","subtasks":["validate","store","notify"],"estimate":"5d"}
async function processUserData() {
    // multi-step process
}
```

## Array Syntax

For listing multiple values:

```javascript
// :ga:["security","performance","breaking-change"]
// :ga:affects:["api","cli","sdk"]
// :ga:reviewers:["@security-team","@alice","@bob"]
```

## Structured Task Management

### Issue Linking with Metadata
```python
# :ga:issue(123,{"status":"in-progress","assignee":"@dev"})
# :ga:bug(456,{"severity":"high","reported":"2024-01-15"})
# :ga:feature(789,{"milestone":"v2.0","approved":true})
```

### Epic and Task Hierarchies
```javascript
// :ga:epic(auth,{"lead":"@alice","deadline":"Q2"})
// :ga:task(auth.login,{"estimate":"3d","depends":["auth.session"]})
// :ga:subtask(auth.login.oauth,{"provider":"google","status":"blocked"})
```

## Workflow Automation

### CI/CD Integration
```yaml
# :ga:{"ci":"required","stage":"pre-commit","action":"block"}
# :ga:{"deploy":"manual","environment":"production","approvers":["@ops"]}
```

### Conditional Patterns
```javascript
// :ga:{"if":"NODE_ENV=production","then":"audit","priority":"critical"}
// :ga:{"when":"version>=2.0","action":"remove","reason":"legacy support"}
```

## Advanced Search Patterns

### Complex Queries
```bash
# Find all high-priority security issues with deadlines
rg ':ga:.*"priority":"high".*security' --json

# Find all deprecated code with replacements
rg ':ga:.*"deprecated".*"replacement"' -A 2

# Find all tasks assigned to a specific person
rg ':ga:.*"@alice"' --type js
```

### Extracting Structured Data
```bash
# Extract all JSON payloads
rg -o ':ga:(\{[^}]+\})' -r '$1' | jq .

# Count tasks by assignee
rg -o ':ga:.*"assignee":"(@\w+)"' -r '$1' | sort | uniq -c

# Find overdue items
rg ':ga:.*"deadline":"([^"]+)"' -r '$1' | xargs -I {} date -d {} +%s | \
  awk -v now=$(date +%s) '$1 < now {print}'
```

## Migration Strategies

### Gradual Enhancement
```javascript
// Phase 1: Add to existing comments
// TODO :ga:task implement validation

// Phase 2: Add metadata
// :ga:task,{"id":"TASK-123","assigned":"@dev"}

// Phase 3: Full structured data
// :ga:{"type":"task","id":"TASK-123","assigned":"@dev","due":"2024-03-01"}
```

### Bulk Conversion
```bash
# Convert TODO to :ga:todo
find . -type f -name "*.js" -exec sed -i 's/\/\/ TODO:/\/\/ :ga:todo/g' {} +

# Add :ga: to existing FIXMEs
find . -type f -name "*.py" -exec sed -i 's/# FIXME:/# FIXME :ga:fix/g' {} +
```

## Integration Examples

### With Issue Trackers
```python
# :ga:jira(PROJ-123,{"sync":true,"fields":["status","assignee"]})
# :ga:github(#456,{"auto-close":true,"labels":["bug","p1"]})
# :ga:linear(ENG-789,{"project":"backend","cycle":"current"})
```

### With Documentation
```javascript
// :ga:docs(api-guide.md#auth,{"type":"reference","update-needed":true})
// :ga:spec(RFC-7231,{"section":"6.5.1","compliance":"partial"})
// :ga:diagram(architecture.puml,{"component":"auth-flow"})
```

## Custom Schemas

Define your own structured formats:

```javascript
// Define in .grepa.yml or similar
// :ga:custom-type({"field1":"value1","field2":"value2"})

// Examples:
// :ga:metric({"name":"response_time","threshold":"200ms","alert":"pagerduty"})
// :ga:experiment({"name":"new-ui","cohort":"10%","ends":"2024-04-01"})
// :ga:compliance({"standard":"SOC2","control":"AC-2","status":"implemented"})
```

## Working with Advanced Patterns

- **Document your schema**: If using complex JSON, documenting expected fields helps
- **Validate consistently**: Consider tooling to validate JSON payloads
- **Start simple**: Add complexity only when it provides clear value
- **Keep it searchable**: Ensure your patterns remain greppable
- **Version your formats**: If schemas evolve, consider versioning them

Advanced patterns are powerful but optional. Most use cases work well with simple tags.

## Monorepo Patterns

In monorepos, maintain consistency by using one anchor with service/package tags:

### Service Namespacing
```javascript
// In auth service
// :ga:auth,todo implement OAuth flow
// :ga:auth,security validate JWT expiry

// In payment service
// :ga:payment,todo add Stripe webhook
// :ga:payment,perf optimize transaction queries

// In shared libraries
// :ga:shared,api maintain backward compatibility
// :ga:shared,breaking v2.0 removes this method
```

### Cross-Service References
```typescript
// :ga:depends(auth-service) requires auth.validateToken
// :ga:blocks(payment-service) breaking change affects checkout
// :ga:see(shared/utils.ts) similar implementation
```

### Monorepo-Wide Searches
```bash
# All todos across services
rg ":ga:.*todo"

# Just auth service markers
rg ":ga:auth"

# Security issues in payment
rg ":ga:payment.*security"

# All breaking changes
rg ":ga:.*breaking"
```

### Package-Specific Patterns
```javascript
// NPM workspace packages
// :ga:@frontend/ui,todo add dark mode
// :ga:@backend/api,perf cache this endpoint
// :ga:@shared/types,breaking interface change
```

**Note**: Consider using one anchor pattern with tags (`:ga:auth`, `:ga:payment`) rather than different anchors for different services. This approach tends to be more searchable and maintainable.