<!-- tldr ::: Practical waymark patterns organized by use case -->
# Waymark Examples

Examples and patterns for working with waymarks, organized by common use cases.

## Todo Patterns

### Basic Task Management

```javascript
// Simple todos
// todo ::: implement validation
// fix ::: handle edge case
// fix ::: memory leak in auth service

// With priority and assignment
// todo ::: priority:high implement OAuth
// todo ::: @alice add unit tests
// fix ::: priority:critical race condition +backend
```

### AI Agent Tasks

```python
# Direct AI implementation
# todo ::: @agent implement pagination
# todo ::: @claude write comprehensive tests
# todo ::: @cursor optimize this function

# AI with specific instructions
# todo ::: @agent use async/await, not callbacks
# todo ::: @agent implement with proper error handling
# todo ::: @agent add TypeScript types throughout
```

### Complex Workflows

```typescript
// Task with full context
// todo ::: implement rate limiting
// ::: max 100 requests per minute per user
// todo ::: requires:redis use Redis for distributed counting
// todo ::: deadline:2024-03-15 complete by Q1

// Blocked tasks
// todo ::: add payment processing
// hold ::: fixes:#123 waiting on auth service
// todo ::: @payments-team handle gateway integration
```

## Development Patterns

### Working with Documentation Comments

Waymarks complement existing documentation systems - they add searchability without replacing standard practices.

```javascript
/**
 * Calculates the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate as decimal
 * @returns {number} Total price with tax
 */
function calculateTotal(price, taxRate) {
  // todo ::: add currency conversion support
  // ::: assumes USD for now
  // note ::: consider caching for repeated calculations +performance
  return price * (1 + taxRate);
}
```

```python
def process_order(order_data: dict) -> Order:
    """
    Process a customer order through the payment system.
    
    Args:
        order_data: Dictionary containing order details
        
    Returns:
        Processed Order object
        
    Raises:
        ValidationError: If order data is invalid
        PaymentError: If payment processing fails
    """
    # alert ::: validate all payment data +security
    # todo ::: add retry logic for failed payments
    # ::: payment gateway has 30s timeout
    # ::: max transaction amount is $10,000
    pass
```

```java
/**
 * User authentication service
 * 
 * Handles login, logout, and session management
 * 
 * @since 1.0
 * @author Team Auth
 */
public class AuthService {
    // alert ::: security critical component +security
    // review ::: check OWASP compliance
    
    /**
     * Validates user credentials
     * 
     * @param username User's username
     * @param password User's password
     * @return Authentication token if valid
     */
    public String authenticate(String username, String password) {
        // todo ::: implement rate limiting +security
        // alert ::: never log passwords +security
        // ::: passwords are bcrypt hashed
        // audit ::: log all auth attempts +compliance
    }
}
```

### Type Definitions and Interfaces

```typescript
/**
 * User profile data structure
 */
interface UserProfile {
  // important ::: public interface - maintain compatibility
  id: string;           // ::: UUID v4 format
  email: string;        // alert ::: PII - handle carefully +security
  preferences: {
    theme: 'light' | 'dark';  // todo ::: implement dark mode +frontend
    notifications: boolean;    // todo ::: implement notification system
  };
  createdAt: Date;      // ::: stored as UTC
}

// deprecated ::: v3.0 use UserProfile instead
interface LegacyUser {
  userId: number;       // todo ::: migrate to UUID format
}
```

### Test Patterns

```javascript
describe('PaymentProcessor', () => {
  // test ::: needs more edge cases
  // ::: mock external payment gateway
  
  it('should handle successful payments', () => {
    // todo ::: test with different currencies
    // todo ::: @agent add assertion for audit log
  });
  
  it('should retry failed payments', () => {
    // test ::: verify exponential backoff
    // ::: max 3 retries
  });
  
  // test ::: missing concurrent payment handling
  // test ::: missing partial payment scenarios
});
```

## Metadata Patterns

### Configuration and Environment

```yaml
# config/production.yml
database:
  host: prod-db.example.com  # alert ::: use environment variable +security
  port: 5432
  pool_size: 20             # note ::: tuned for high load +performance
  
cache:
  provider: redis           # ::: Redis 6.2+ required
  ttl: 3600                # ::: 1 hour cache
  
# todo ::: add monitoring configuration
# review ::: verify production settings
```

### Version and Lifecycle

```javascript
// note ::: since:v2.0 new API endpoint
// deprecated ::: v3.0 use /api/v3/users instead
// alert ::: until:v4.0 will be removed +breaking
router.get('/api/v2/users', (req, res) => {
  // alert ::: returns different format than v1 +breaking
  // docs ::: migration guide at docs/migration-v2.md
});

// Feature flags
// flag ::: new-checkout-flow experimental
// note ::: 10% rollout active
if (features.isEnabled('new-checkout-flow', user)) {
  // note ::: track conversion rate +metrics
  return newCheckoutProcess();
}
```

### Issue Tracking Integration

```python
# fix ::: fixes:#123 intermittent timeout
# todo ::: relates-to:PROJ-456 parent epic
# done ::: closes:#789 implements this feature
def sync_user_data():
    # todo ::: @data-team optimize performance
    # note ::: planned for 2024-Q1 sprint
    pass
```

## Security Patterns

```javascript
// Input validation
function updateProfile(userId, data) {
  // alert ::: validate all user inputs +security
  // alert ::: prevent SQL injection +security
  // todo ::: add rate limiting +security
  
  // alert ::: check user owns this profile +security
  if (!userOwnsProfile(userId, profileId)) {
    // audit ::: log unauthorized access attempt +security
    throw new ForbiddenError();
  }
}

// Sensitive data handling
class UserDataStore {
  // alert ::: PII data - encrypt at rest +security +compliance
  // alert ::: never log sensitive fields +security
  // audit ::: all data access +compliance
}
```

## Performance Patterns

```ruby
# alert ::: N+1 query detected +performance
# todo ::: use includes or join +performance
def get_posts_with_stats
  posts = Post.all
  
  posts.map do |post|
    {
      title: post.title,
      # alert ::: this hits DB for each post +performance
      comment_count: post.comments.count
    }
  end
end

# note ::: cache expensive calculation
# ::: called on every request
# todo ::: add Redis caching with TTL +performance
def calculate_recommendations(user)
  # todo ::: consider background job +performance
  # note ::: track execution time +metrics
end
```

## HTML Comments in Markdown

For markdown files, use HTML comments to make waymarks searchable but not rendered:

```markdown
<!-- tldr ::: API documentation overview -->
<!-- todo ::: @galligan add authentication examples -->
<!-- alert ::: breaking changes in v3.0 -->
<!-- note ::: last updated 2024-01-30 -->

# API Documentation

This guide covers the REST API endpoints.

<!-- todo ::: add GraphQL documentation -->
<!-- example ::: include curl examples for each endpoint -->
```

## Search Examples

### Finding Work
```bash
# All todos
rg "todo :::"

# High priority items
rg ":::.*priority:high"

# AI agent tasks
rg ":::.*@agent"

# Bugs and fixes
rg "fix :::"

# Critical issues
rg ":::.*\+critical"
```

### Finding Context
```bash
# All pure notes
rg "^[[:space:]]*//[[:space:]]*:::[[:space:]]"

# Security considerations
rg "alert :::.*\+security" -A 2 -B 2

# Performance issues
rg "\+performance"

# Business rules
rg ":::.*business"
```

### Advanced Searches
```bash
# Tasks assigned to specific person
rg ":::.*@alice"

# Deprecated code with timelines
rg "deprecated.*v[0-9]"

# Temporary code to remove
rg "temp :::"

# Find all blockers
rg "hold :::|blocked" -A 1

# Find by tag
rg "\+frontend|\+backend|\+security"
```

## Best Practices

### 1. Waymarks complement, not replace
Use alongside JSDoc, docstrings, and comments:

```javascript
/**
 * Standard JSDoc remains unchanged
 * @param {string} input - User input
 * @returns {boolean} Validation result
 */
function validateInput(input) {
  // todo ::: add email format validation
  // alert ::: sanitize before processing +security
  return true;
}
```

### 2. Keep related markers together
Group waymarks that describe the same concern:

```python
# alert ::: validate inputs +security
# alert ::: check permissions +security
# ::: admin users bypass some checks
```

### 3. Be specific with AI instructions
Clear context helps AI agents:

```javascript
// todo ::: @agent implement using React hooks
// todo ::: @agent include error boundaries
// ::: must support React 16.8+
```

### 4. Use consistent patterns
Establish team conventions:

```ruby
# Team patterns:
# shipped ::: ready for production
# hold ::: needs review first
# alert ::: proceed with caution
```

### 5. Progressive Enhancement
Start simple and add complexity:

```javascript
// Level 1: Basic todo
// todo ::: add validation

// Level 2: Add priority
// todo ::: priority:high add validation

// Level 3: Add assignment and hashtags
// todo ::: priority:high assign:@alice add validation +security

// Level 4: Link to issues
// todo ::: priority:high assign:@alice fixes:#123 add validation +security
```

## Monorepo Patterns

Use hashtags for service separation:

```javascript
// Auth service
// todo ::: implement OAuth +auth-service
// alert ::: rate limit login attempts +auth-service +security

// Payment service  
// fix ::: handle timeout errors +payment-service
// todo ::: add retry logic +payment-service +resilience

// Shared utilities
// note ::: maintain API compatibility +shared-utils
// deprecated ::: v3.0 use newUtility() +shared-utils
```

Search patterns for monorepos:

```bash
# All auth service issues
rg "\+auth-service"

# Security across all services
rg "\+security"

# Frontend-specific todos
rg "todo :::.*\+frontend"
```

Remember: Waymarks make codebases more navigable. They're breadcrumbs for both humans and AI.

<!-- note ::: Examples follow new ::: syntax specification -->