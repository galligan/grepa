<!-- tldr ::: Waymarks complement JSDoc, docstrings, and other documentation systems -->
# Waymarks in Documentation

Waymarks enhance existing documentation comments with searchable markers, without replacing or interfering with standard practices.

## Core Principle

**Waymarks complement your existing documentation** - they're just searchable tags within comments:

- Documentation generators ignore waymarks
- Search tools find them easily across all languages
- Existing tooling continues working unchanged
- Progressive enhancement of current codebases

## Examples

### JavaScript with JSDoc

Waymarks add searchability to standard JSDoc:

```javascript
/**
 * Calculates the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate as decimal
 * @returns {number} Total price with tax
 * todo ::: add currency conversion support
 * note ::: assumes USD for now
 */
function calculateTotal(price, taxRate) {
  // note ::: consider caching for repeated calculations #performance
  return price + (price * taxRate);
}
```

### Python with Docstrings

```python
def process_payment(amount, currency="USD"):
    """
    Process a payment transaction
    
    Args:
        amount (float): Payment amount
        currency (str): Currency code
        
    Returns:
        dict: Transaction result
        
    alert ::: validate all payment data +security
    todo ::: add retry logic for failed payments
    """
    # ::: payment gateway has 30s timeout
    # note ::: max transaction amount is $10,000 #business-rule
    return gateway.charge(amount, currency)
```

### TypeScript Interfaces

```typescript
interface User {
  /** note ::: public interface - maintain compatibility */
  id: string;           // ::: UUID v4 format
  email: string;        // alert ::: PII - handle carefully +security
  
  preferences: {
    theme: 'light' | 'dark';  // todo ::: implement dark mode support
    notifications: boolean;    // todo ::: implement notification system
  };
}
```

### Function Documentation

```typescript
// alert ::: validate all auth headers before processing +security
// tldr ::: primary entry point for HTTP auth
function authenticateRequest(request: Request): AuthResult {
    // ::: assumes Authorization header format: "Bearer <token>"
    // note ::: cache token validation results #performance
    
    const token = extractToken(request);
    return validateToken(token);
}
```

### Rust Documentation

```rust
/// tldr ::: public trait for auth providers
/// alert ::: ensure constant-time comparison for tokens +security
pub trait AuthProvider {
    /// todo ::: add token refresh support
    fn validate_token(&self, token: &str) -> Result<Claims, AuthError>;
}
```

## Search Examples

```bash
# Find all waymarks
rg ":::"

# Security-related waymarks
rg "alert :::" 
rg "+security"

# AI agent tasks in JavaScript
rg ":::.*@agent" --type js

# Find in documentation comments (multiline search)
rg -U "(?:\/\*\*|\"\"\"|\#\#)[\s\S]*?todo :::"
```

## Documentation Integration

### JSDoc Example

```javascript
/**
 * @fileoverview Authentication utilities
 * todo ::: validate parameter range
 * alert ::: sanitize user input +security
 */

/**
 * Calculates risk score for transaction
 * @param {number} amount - Transaction amount
 * @returns {number} Risk score 0-1
 */
function calculateRisk(amount) {
    // note ::: risk tolerance is 0.05 #business-rule
    // note ::: cache calculation results #performance
    return Math.min(amount / 10000, 1.0);
}
```

### Documentation Standards

Common patterns that work with documentation generators:

- `todo :::` - work items
- `alert :::` - security concerns  
- `tldr :::` - file/function summaries
- `note :::` - important context
- Pure notes: `::: contextual information`

### Comprehensive API Documentation

```javascript
/**
 * @namespace PaymentAPI
 * tldr ::: public REST endpoint for payments
 * alert ::: verify caller permissions +security
 */
class PaymentProcessor {
  // todo ::: add edge case tests
  // ::: mock external payment gateway in tests
  processTransaction(data) {
    // todo ::: test with different currencies
    return this.gateway.charge(data);
  }
}
```

### Configuration Files

```yaml
# note ::: production values #config
# alert ::: use environment variables for passwords +security
database:
  host: localhost
  # note ::: connection pool tuning #performance
  pool_size: 20
```

## Migration from Plain Comments

```bash
# Find TODO comments without waymarks
rg "TODO(?!.*:::)" --type js

# Convert to waymarks
# TODO todo ::: implement caching
```

### Migration Examples

**Before (traditional):**
```javascript
// TODO: add validation
// FIXME: memory leak here
// NOTE: assumes UTC timestamps
```

**After (waymarks):**
```javascript
// todo ::: add validation
// fix ::: memory leak here
// ::: assumes UTC timestamps
```

## Benefits

- **Searchable**: Find anything with `rg ":::"`
- **Tool-agnostic**: Works with any documentation system
- **Language-agnostic**: Same pattern across all files
- **Non-invasive**: Doesn't break existing tools
- **Progressive**: Add gradually to existing codebases
- **AI-friendly**: Structured for agent understanding

## Best Practices

1. **Use HTML comments in markdown**:
   ```markdown
   <!-- tldr ::: summary of this document -->
   <!-- todo ::: @author add more examples -->
   ```

2. **Combine with traditional comments**:
   ```javascript
   // TODO todo ::: implement caching
   // FIXME fix ::: memory leak in auth handler
   ```

3. **Add properties for metadata**:
   ```javascript
   // todo ::: priority:high implement validation
   // ::: deprecated:v2.0 use newMethod() instead
   ```

4. **Use hashtags for classification**:
   ```python
   # alert ::: validate inputs +security #critical
   # todo ::: optimize query #performance #database
   ```

Start with one waymark today. Add `todo :::` to your next TODO comment and see how it improves discoverability.