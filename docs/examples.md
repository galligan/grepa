# Grep-Anchor Examples
<!-- :ga:tldr Real-world examples of grep-anchor usage patterns -->
<!-- :ga:example Comprehensive examples for AI agents and developers -->

*Examples and patterns for working with grep-anchors*

---

## 1. AI Agent Workflows

### Task Delegation
- `:ga:@agent` - Direct any AI agent to implement or complete code
  - Use when you want AI to write implementation
  - Can specify particular agents like `@cursor`, `@claude`, `@copilot`
  - Combine with other tags for context

```javascript
// :ga:@agent implement pagination
// :ga:ctx use cursor-based pagination, not offset
// :ga:requirement handle empty results gracefully
class PostsList {
  async fetchPosts(cursor?: string) {
    // :ga:todo implementation needed
    throw new Error("Not implemented");
  }
}
```

### Implementation Guidance
- `:ga:ctx` - Critical information AI needs to know
  - Document assumptions that aren't obvious from code
  - Explain business rules or constraints
  - Clarify architectural decisions

```python
# :ga:ctx user_ids are UUIDs, not sequential integers
# :ga:ctx all timestamps are UTC, convert for display only
class UserService:
    # :ga:@agent implement with proper timezone handling
    def get_user_activity(self, user_id: str, date: datetime):
        # :ga:sec validate UUID format
        pass
```

### Code Review Requests
- `:ga:review` - Mark code for AI or human review
  - Security implications
  - Performance concerns
  - Best practices

```go
// :ga:review check for race conditions
// :ga:ctx concurrent access from multiple goroutines
func (c *Cache) Set(key string, value interface{}) {
    // :ga:todo add mutex protection
    c.data[key] = value
}
```

---

## 2. Security Patterns

### Input Validation
- `:ga:sec` - Mark security-critical code
  - Input sanitization points
  - Authentication boundaries
  - Sensitive data handling

```javascript
// :ga:sec validate all user inputs
// :ga:ctx prevent SQL injection and XSS
function updateUserProfile(userId, profileData) {
  // :ga:todo sanitize HTML content
  // :ga:sec check user owns this profile
  const query = `UPDATE users SET profile = ? WHERE id = ?`;
  return db.execute(query, [profileData, userId]);
}
```

### Authentication & Authorization
- `:ga:auth` - Authentication/authorization checkpoints
  - Permission boundaries
  - Token validation
  - Access control

```python
# :ga:auth verify user permissions
# :ga:sec ensure proper scoping
@require_auth
def delete_resource(resource_id: str, user: User):
    # :ga:ctx only owners and admins can delete
    resource = Resource.get(resource_id)
    
    # :ga:sec prevent unauthorized access
    if resource.owner_id != user.id and not user.is_admin:
        raise Forbidden("Cannot delete resource")
    
    # :ga:audit log deletion for compliance
    audit_log.record("resource_deleted", resource_id, user.id)
    resource.delete()
```

---

## 3. Performance Optimization

### Database Queries
- `:ga:perf` - Performance-sensitive code
  - N+1 query problems
  - Inefficient algorithms
  - Resource-intensive operations

```ruby
# :ga:perf N+1 query detected
# :ga:ctx each post triggers separate comment count query
def get_posts_with_stats
  posts = Post.all
  
  # :ga:todo use includes or join
  posts.map do |post|
    {
      title: post.title,
      # :ga:perf this hits DB for each post
      comment_count: post.comments.count,
      author: post.author.name
    }
  end
end
```

### Caching Opportunities
- `:ga:cache` - Places where caching would help
  - Expensive computations
  - Frequent API calls
  - Static data

```typescript
// :ga:cache expensive calculation
// :ga:ctx called on every request
function calculatePricing(items: CartItem[]): number {
  // :ga:perf consider memoization
  // :ga:todo add Redis caching with TTL
  return items.reduce((total, item) => {
    const discount = calculateComplexDiscount(item);
    return total + (item.price * item.quantity * discount);
  }, 0);
}
```

---

## 4. Code Quality & Maintenance

### Temporary Code
- `:ga:tmp` - Code that should be removed
  - Workarounds for bugs
  - Quick fixes
  - Migration shims

```javascript
// :ga:tmp remove after Chrome 120 fix ships
// :ga:ctx workaround for scrolling bug
// :ga:issue(CHR-4823) track browser fix
function patchChromeScroll() {
  if (navigator.userAgent.includes('Chrome/120')) {
    // :ga:tmp force repaint hack
    document.body.style.display = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = '';
  }
}
```

### Technical Debt
- `:ga:debt` - Known technical debt
  - Shortcuts taken
  - Refactoring needed
  - Architecture improvements

```python
# :ga:debt refactor to use dependency injection
# :ga:ctx tightly coupled to database implementation
class OrderService:
    def __init__(self):
        # :ga:debt hardcoded connection
        self.db = PostgresConnection("prod-db-url")
    
    # :ga:todo make database configurable
    def process_order(self, order_data):
        # :ga:debt extract validation logic
        if not self._validate_order(order_data):
            return False
        
        # :ga:ctx 500+ lines of business logic below
        # :ga:refactor split into smaller methods
```

---

## 5. Documentation & Context

### API Documentation
- `:ga:docs` - Documentation needed
  - API endpoints
  - Complex algorithms
  - Public interfaces

```rust
// :ga:docs add comprehensive examples
// :ga:api public interface - maintain compatibility
// :ga:ctx returns Err for invalid inputs, not panic
pub fn parse_config(path: &Path) -> Result<Config, ConfigError> {
    // :ga:docs explain config file format
    // :ga:example show valid TOML structure
    let contents = fs::read_to_string(path)
        .map_err(|e| ConfigError::IoError(e))?;
    
    // :ga:docs list all possible error types
    toml::from_str(&contents)
        .map_err(|e| ConfigError::ParseError(e.to_string()))
}
```

### Business Logic
- `:ga:business` - Business rule documentation
  - Domain logic
  - Compliance requirements
  - Policy implementations

```java
// :ga:business payment processing rules
// :ga:ctx max transaction: $10,000
// :ga:compliance PCI-DSS requirements
public class PaymentProcessor {
    // :ga:business retry failed payments up to 3 times
    // :ga:ctx exponential backoff: 1s, 2s, 4s
    public PaymentResult processPayment(Payment payment) {
        // :ga:audit log all payment attempts
        // :ga:sec never log full card numbers
        
        // :ga:business validate amount limits
        if (payment.getAmount() > 10000) {
            // :ga:ctx requires manual approval
            return PaymentResult.requiresApproval();
        }
        
        // :ga:todo implement retry logic
        return attemptPayment(payment);
    }
}
```

---

## 6. Testing & Quality Assurance

### Test Coverage
- `:ga:test` - Testing requirements
  - Missing tests
  - Edge cases
  - Test scenarios

```typescript
// :ga:test needs comprehensive unit tests
// :ga:ctx handle null, undefined, empty arrays
export function mergeConfigs(...configs: Config[]): Config {
  // :ga:test edge case: circular references
  // :ga:test edge case: conflicting values
  
  // :ga:@agent write tests for all edge cases
  return configs.reduce((merged, config) => {
    return deepMerge(merged, config);
  }, {});
}
```

### Error Handling
- `:ga:error` - Error handling needed
  - Missing try-catch
  - Unhandled edge cases
  - Error recovery

```go
// :ga:error add proper error handling
// :ga:ctx network calls can fail
func FetchUserData(userID string) (*User, error) {
    // :ga:todo handle timeout errors
    resp, err := http.Get(fmt.Sprintf("/api/users/%s", userID))
    if err != nil {
        // :ga:error add retry logic
        return nil, err
    }
    
    // :ga:error check response status
    // :ga:ctx API returns 404 for missing users
    var user User
    json.NewDecoder(resp.Body).Decode(&user)
    return &user, nil
}
```

---

## 7. Feature Development

### Feature Flags
- `:ga:feature` - Feature-flagged code
  - Experimental features
  - Gradual rollouts
  - A/B tests

```python
# :ga:feature new checkout flow
# :ga:ctx 10% rollout to test conversion
# :ga:metrics track success rate
def checkout_process(cart: Cart, user: User) -> Order:
    # :ga:feature check flag status
    if feature_flags.is_enabled("new-checkout-v2", user):
        # :ga:todo implement new flow
        # :ga:@agent create optimized checkout
        return new_checkout_flow(cart, user)
    else:
        # :ga:deprecated remove after full rollout
        return legacy_checkout(cart, user)
```

### API Versioning
- `:ga:version` - Version-specific code
  - API compatibility
  - Migration paths
  - Deprecation notices

```javascript
// :ga:version v2 API endpoint
// :ga:deprecated v1 endpoint - remove in v3
router.post('/api/v2/users', async (req, res) => {
  // :ga:breaking returns different response format
  // :ga:migration guide at docs/v2-migration.md
  
  // :ga:ctx v2 uses JSON:API format
  const user = await createUser(req.body);
  
  // :ga:todo add pagination headers
  res.json({
    data: {
      type: 'users',
      id: user.id,
      attributes: user
    }
  });
});
```

---

## 8. Integration Points

### External Services
- `:ga:integration` - External service touchpoints
  - API calls
  - Third-party libraries
  - Service dependencies

```ruby
# :ga:integration Stripe payment API
# :ga:ctx requires API key in env vars
# :ga:error handle rate limiting (429)
class PaymentGateway
  # :ga:todo add circuit breaker
  # :ga:ctx timeout after 30 seconds
  def charge_card(amount, token)
    # :ga:sec never log tokens
    # :ga:audit record all transactions
    
    begin
      # :ga:integration Stripe charge creation
      # :ga:docs see https://stripe.com/docs/api/charges
      Stripe::Charge.create(
        amount: amount,
        currency: 'usd',
        source: token
      )
    rescue Stripe::RateLimitError => e
      # :ga:todo implement exponential backoff
      raise PaymentError.new("Rate limited")
    end
  end
end
```

---

## 9. Search Patterns

### Finding Work
```bash
# All AI agent tasks
rg ":ga:@agent"

# Security issues
rg ":ga:sec"

# Performance problems
rg ":ga:perf"

# Temporary code to remove
rg ":ga:tmp"
```

### Finding Context
```bash
# All contextual information
rg ":ga:ctx"

# Business rules
rg ":ga:business"

# Integration points
rg ":ga:integration"
```

### Complex Searches
```bash
# Security TODOs
rg ":ga:sec.*todo|:ga:todo.*security"

# AI tasks with context
rg -B2 -A2 ":ga:@agent"

# Temporary code with deadlines
rg ":ga:tmp.*2024"
```

---

## 10. Best Practices

1. **Layer your tags**: Combine tags for richer meaning
   ```javascript
   // :ga:sec,todo,p0 critical auth fix needed
   ```

2. **Add context liberally**: More context helps AI and humans
   ```python
   # :ga:ctx database uses UTC timestamps
   # :ga:ctx user_ids are case-sensitive
   ```

3. **Be specific with AI instructions**:
   ```javascript
   // :ga:@agent implement using async/await, not callbacks
   // :ga:@agent add comprehensive error handling
   ```

4. **Link to external resources**:
   ```go
   // :ga:docs see RFC-7231 section 6.5.1
   // :ga:issue(PROJ-123) tracking in Jira
   ```

5. **Use consistent vocabulary**: Define patterns for your team
   ```ruby
   # Team convention:
   # :ga:shipit - ready for production
   # :ga:holdup - needs review before merge
   # :ga:dragon - here be dragons, proceed carefully
   ```

The goal is to help make codebases more discoverable. Well-placed grep-anchors can serve as waypoints through your code.