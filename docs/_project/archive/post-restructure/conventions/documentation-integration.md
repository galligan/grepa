# Documentation System Integration
<!-- ::: tldr waymark compatibility with JSDoc, docstrings, and other documentation systems -->
<!-- ::: convention Cross-language documentation integration patterns -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Core Integration Principle](#core-integration-principle)
- [JavaScript Ecosystem](#javascript-ecosystem)
  - [JSDoc/TSDoc/ESDoc](#jsdoctsdocesdoc)
  - [Inline Comments](#inline-comments)
- [Python Ecosystem](#python-ecosystem)
  - [Docstrings (All Formats)](#docstrings-all-formats)
    - [Google Style](#google-style)
    - [NumPy Style](#numpy-style)
    - [Sphinx (reStructuredText)](#sphinx-restructuredtext)
- [Systems Languages](#systems-languages)
  - [Rust Documentation (Rustdoc)](#rust-documentation-rustdoc)
  - [Go Documentation (Godoc)](#go-documentation-godoc)
  - [C/C++ Documentation (Doxygen)](#cc-documentation-doxygen)
- [Enterprise Languages](#enterprise-languages)
  - [Java Documentation (Javadoc)](#java-documentation-javadoc)
  - [C# Documentation (XML Documentation)](#c-documentation-xml-documentation)
- [Dynamic Languages](#dynamic-languages)
  - [Ruby Documentation (RDoc/YARD)](#ruby-documentation-rdocyard)
  - [PHP Documentation (phpDocumentor)](#php-documentation-phpdocumentor)
- [Mobile Development](#mobile-development)
  - [Swift Documentation](#swift-documentation)
  - [Kotlin Documentation (KDoc)](#kotlin-documentation-kdoc)
- [Universal Search Patterns](#universal-search-patterns)
  - [Language-Specific Searches](#language-specific-searches)
  - [Cross-Language Searches](#cross-language-searches)
  - [Context-Aware Searches](#context-aware-searches)
- [Recommended Positioning](#recommended-positioning)
- [Adoption Strategies](#adoption-strategies)
  - [Adding to Existing Documentation](#adding-to-existing-documentation)
  - [Example Enhancement Script](#example-enhancement-script)
- [Best Practices](#best-practices)
  - [Universal Guidelines](#universal-guidelines)
  - [Language-Specific Tips](#language-specific-tips)
- [Conclusion](#conclusion)

Waymarks work seamlessly across all major documentation systems because they're just comment content. This enables universal code navigation while preserving existing documentation workflows.

## Core Integration Principle

**Waymarks are documentation-system agnostic** - they work within any comment format:

- Documentation generators ignore waymarks
- Search tools find anchors easily across all languages  
- Existing tooling continues working unchanged
- Progressive enhancement of current codebases

## JavaScript Ecosystem

### JSDoc/TSDoc/ESDoc

Perfect compatibility in block comments:

```javascript
/**
 * ::: tldr Core authentication utilities
 * ::: api Public interface for auth operations
 * ::: sec validate JWT signature and expiry
 * 
 * @description Handles user authentication with JWT tokens
 * @param {string} token - JWT token to validate  
 * @param {AuthOptions} options - Authentication configuration
 * @returns {Promise<Result<User, AuthError>>} Validation result
 * @throws {InvalidTokenError} When token format is invalid
 * @example
 * const result = await authenticateUser(token, { strict: true });
 * if (result.isOk()) {
 *   console.log('User:', result.value);
 * }
 */
async function authenticateUser(token, options = {}) {
  // ::: ctx assumes tokens are always Base64 encoded
  // ::: perf consider caching decoded tokens
  return validateJWT(token, options);
}
```

**Benefits:**

- JSDoc generators ignore waymarks
- TypeScript tools work unchanged
- ESDoc processes normally
- VS Code intellisense preserved
- Search tools find anchors: `rg "::: api" --type js`

### Inline Comments

Waymarks work in single-line comments too:

```typescript
// ::: todo @agent implement retry logic
const fetchUserData = async (id: string) => {
  // ::: ctx rate limit: 100 requests/minute
  return api.get(`/users/${id}`);
};
```

## Python Ecosystem

### Docstrings (All Formats)

Waymarks work with any docstring format:

#### Google Style

```python
def authenticate_user(token: str, strict: bool = False) -> Result[User, AuthError]:
    """
    ::: tldr Core user authentication function
    ::: sec validate JWT signature and expiry  
    ::: todo @agent add rate limiting
    
    Authenticates a user based on JWT token.
    
    Args:
        token: JWT token string to validate
        strict: Whether to use strict validation mode
        
    Returns:
        Result containing User object or AuthError
        
    Raises:
        InvalidTokenError: When token is malformed
        RateLimitError: When rate limit exceeded
        
    Examples:
        >>> result = authenticate_user("eyJ0eXAi...")
        >>> if result.is_ok():
        ...     print(f"Welcome {result.value.name}")
    """
```

#### NumPy Style  

```python
def calculate_metrics(data: np.ndarray) -> Dict[str, float]:
    """
    ::: tldr Statistical analysis functions
    ::: perf O(n) algorithm, efficient for large datasets
    ::: ctx assumes input data is normalized
    
    Calculate statistical metrics for input data.
    
    Parameters
    ----------
    data : np.ndarray
        Input array of numerical values
        
    Returns
    -------
    Dict[str, float]
        Dictionary containing calculated metrics
        
    Notes
    -----
    This function assumes the input is already normalized.
    Performance scales linearly with input size.
    """
```

#### Sphinx (reStructuredText)

```python
def process_documents(docs: List[str]) -> ProcessedDocs:
    """
    ::: tldr Document processing pipeline
    ::: api Main entry point for document processing
    ::: perf uses multiprocessing for large batches
    
    Process a collection of documents.
    
    :param docs: List of document strings to process
    :type docs: List[str]
    :param parallel: Enable parallel processing  
    :type parallel: bool
    :returns: Processed document collection
    :rtype: ProcessedDocs
    :raises DocumentError: When document format is invalid
    """
```

**Universal Benefits:**

- Sphinx documentation builds normally
- IDEs provide full intellisense
- All docstring tools work unchanged
- Search: `rg "::: api" --type py`

## Systems Languages

### Rust Documentation (Rustdoc)

Seamless integration with Rust doc comments:

```rust
/// ::: tldr User authentication trait definition
/// ::: api Public trait for auth providers  
/// ::: sec ensure constant-time comparison for tokens
/// 
/// Provides authentication services for the application.
/// Supports multiple authentication backends including JWT,
/// OAuth2, and session-based authentication.
/// 
/// # Examples
/// 
/// ```rust
/// use auth::AuthProvider;
/// 
/// let auth = AuthProvider::new();
/// let result = auth.validate_token(&token).await?;
/// match result {
///     Ok(user) => println!("Welcome {}", user.name),
///     Err(e) => eprintln!("Auth failed: {}", e),
/// }
/// ```
/// 
/// # Safety
/// 
/// This trait assumes that implementations use secure
/// random number generation for token creation.
pub trait AuthProvider {
    /// ::: api Core validation method
    async fn validate_token(&self, token: &str) -> Result<User, AuthError>;
    
    /// ::: api Token generation with expiry
    async fn create_token(&self, user: &User) -> Result<String, AuthError>;
}

impl AuthProvider for JwtAuth {
    async fn validate_token(&self, token: &str) -> Result<User, AuthError> {
        // ::: sec timing attack protection - constant time comparison
        // ::: perf cache decoded tokens for repeated validation
        self.decode_and_validate(token).await
    }
}
```

**Benefits:**

- `cargo doc` renders normally, ignores waymarks
- IDE integration preserved (rust-analyzer)
- Documentation tests continue working
- Search: `rg "::: sec" --type rust`

### Go Documentation (Godoc)

Perfect compatibility with Go doc comments:

```go
// ::: tldr HTTP authentication middleware package
// ::: api Public middleware for web services
// ::: perf consider connection pooling for auth backends
//
// Package auth provides HTTP authentication middleware for web services.
// It supports JWT tokens, session-based auth, and OAuth2 flows.
//
// Basic usage:
//
// handler := auth.Middleware(yourHandler)
// http.Handle("/api/", handler)
//
// The middleware automatically validates authentication headers
// and populates request context with user information.
package auth

// ::: tldr Main authentication middleware function
// ::: api Primary entry point for HTTP auth
// ::: sec validate all auth headers before processing
//
// Middleware provides HTTP authentication for web services.
// It checks Authorization headers and validates tokens against
// configured authentication backends.
//
// The middleware sets these context values on successful auth:
//   - "user": authenticated User object
//   - "token": validated token string
//
// Usage:
//   handler := auth.Middleware(yourHandler)
//   http.Handle("/api/", handler)
func Middleware(next http.Handler) http.Handler {
 return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
  // ::: ctx assumes Authorization header format: "Bearer <token>"
  // ::: perf cache token validation results
  // ::: sec prevent timing attacks during validation
  
  token := extractToken(r)
  if token == "" {
   http.Error(w, "Unauthorized", http.StatusUnauthorized)
   return
  }
  
  next.ServeHTTP(w, r)
 })
}
```

**Benefits:**

- `godoc` displays documentation normally
- Go tools work unchanged
- IDE support preserved (gopls)
- Search: `rg "::: api" --type go`

### C/C++ Documentation (Doxygen)

Works perfectly in Doxygen comments:

```cpp
/**
 * ::: tldr Memory pool allocation utilities  
 * ::: perf critical path - optimized for speed
 * ::: unsafe manual memory management - review carefully
 * 
 * @brief Allocates memory from a pre-allocated pool
 * 
 * This function provides fast memory allocation from a pool
 * that was pre-allocated during system initialization.
 * 
 * @param size Number of bytes to allocate
 * @param alignment Memory alignment requirement (must be power of 2)
 * @return Pointer to allocated memory or nullptr on failure
 * 
 * @warning This function does not perform bounds checking.
 *          Caller must ensure size is within pool limits.
 * 
 * @see pool_free() To deallocate memory
 * @see pool_init() To initialize the memory pool
 * 
 * @code
 * void* ptr = pool_alloc(1024, 8);
 * if (ptr) {
 *     // Use allocated memory
 *     pool_free(ptr);
 * }
 * @endcode
 */
void* pool_alloc(size_t size, size_t alignment) {
    // ::: ctx pool must be initialized before first call
    // ::: perf O(1) allocation using bitmap tracking
    // ::: unsafe no bounds checking - caller responsibility
    
    if (!is_power_of_two(alignment)) {
        return nullptr;
    }
    
    return allocate_from_pool(size, alignment);
}
```

## Enterprise Languages

### Java Documentation (Javadoc)

Perfect compatibility:

```java
/**
 * ::: tldr User service business logic layer
 * ::: api REST controller endpoints for user management
 * ::: sec validate all inputs and check authorization
 * 
 * Provides comprehensive user management operations for the application.
 * Handles CRUD operations, validation, and business rule enforcement.
 * 
 * <p>This service integrates with the authentication system to ensure
 * only authorized users can perform operations. All inputs are validated
 * according to business rules defined in the User domain model.
 * 
 * @author Development Team
 * @version 2.1.0
 * @since 1.0.0
 * @see User The domain model this service operates on
 * @see AuthService For authentication operations
 */
@Service
@Transactional
public class UserService {
    
    /**
     * ::: api Public endpoint for user retrieval
     * ::: perf consider caching for frequently accessed users
     * ::: ctx user IDs are UUIDs, not sequential integers
     * 
     * Retrieves a user by their unique identifier.
     * 
     * @param userId The unique identifier for the user (must be valid UUID)
     * @return User object with complete profile data
     * @throws UserNotFoundException when user doesn't exist in database
     * @throws IllegalArgumentException when userId format is invalid
     * @throws SecurityException when caller lacks read permissions
     * 
     * @code
     * try {
     *     User user = userService.getUserById(UUID.fromString("123e4567..."));
     *     System.out.println("Found user: " + user.getName());
     * } catch (UserNotFoundException e) {
     *     logger.warn("User not found: " + e.getMessage());
     * }
     * @endcode
     */
    public User getUserById(@NonNull UUID userId) 
            throws UserNotFoundException, SecurityException {
        // ::: sec verify caller has READ_USER permission
        // ::: ctx database queries use prepared statements
        // ::: perf single query with JOIN to avoid N+1
        
        validatePermissions(READ_USER);
        return userRepository.findByIdWithProfile(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }
}
```

### C# Documentation (XML Documentation)

```csharp
/// <summary>
/// ::: tldr Email notification service for user communications
/// ::: api Public interface for sending notifications
/// ::: config requires SMTP server configuration
/// 
/// Provides email notification functionality for the application.
/// Supports templated emails, attachments, and delivery tracking.
/// </summary>
/// <remarks>
/// This service requires proper SMTP configuration in appsettings.json.
/// Templates are loaded from the Templates/ directory at startup.
/// 
/// Example configuration:
/// <code>
/// {
///   "Email": {
///     "SmtpHost": "smtp.example.com",
///     "SmtpPort": 587,
///     "UseTLS": true
///   }
/// }
/// </code>
/// </remarks>
public class EmailService : IEmailService
{
    /// <summary>
    /// ::: api Core email sending method
    /// ::: sec validate recipient addresses to prevent injection
    /// ::: perf use async operations for SMTP communication
    /// 
    /// Sends an email notification to the specified recipient.
    /// </summary>
    /// <param name="recipient">Valid email address of the recipient</param>
    /// <param name="subject">Email subject line (max 200 characters)</param>
    /// <param name="body">Email body content (supports HTML)</param>
    /// <param name="isHtml">Whether the body contains HTML markup</param>
    /// <returns>Task representing the async operation with success status</returns>
    /// <exception cref="ArgumentException">Thrown when recipient format is invalid</exception>
    /// <exception cref="SmtpException">Thrown when email delivery fails</exception>
    /// <example>
    /// <code>
    /// var success = await emailService.SendNotificationAsync(
    ///     "user@example.com",
    ///     "Welcome!",
    ///     "&lt;h1&gt;Welcome to our service&lt;/h1&gt;",
    ///     true
    /// );
    /// </code>
    /// </example>
    public async Task<bool> SendNotificationAsync(
        string recipient, 
        string subject, 
        string body, 
        bool isHtml = false)
    {
        // ::: sec validate email format using RFC 5322 compliance
        // ::: ctx SMTP client is disposed after each send operation
        // ::: perf connection pooling handled by SmtpClient internally
        
        ValidateEmailAddress(recipient);
        
        using var client = CreateSmtpClient();
        var message = CreateMessage(recipient, subject, body, isHtml);
        
        try 
        {
            await client.SendMailAsync(message);
            return true;
        }
        catch (SmtpException ex)
        {
            // ::: todo @agent add retry logic with exponential backoff
            logger.LogError(ex, "Failed to send email to {Recipient}", recipient);
            return false;
        }
    }
}
```

## Dynamic Languages

### Ruby Documentation (RDoc/YARD)

```ruby
##
# ::: tldr Email notification service for user communications
# ::: config requires ActionMailer configuration
# ::: api Primary interface for sending emails
#
# Handles email notifications for the application including
# welcome emails, password resets, and promotional content.
# Integrates with ActionMailer for delivery and templating.
#
# @example Basic usage
#   service = EmailService.new
#   service.send_notification('user@example.com', 'Welcome!', 'Hello World')
#
# @example With template
#   service.send_templated_email('user@example.com', :welcome, user: current_user)
#
# @author Development Team
# @version 2.0.0
class EmailService
  ##
  # ::: api Core email sending method
  # ::: sec validate recipient email format
  # ::: todo @agent add template support
  #
  # Sends an email notification to the specified recipient.
  # Validates email format and handles delivery errors gracefully.
  #
  # @param [String] recipient Email address of the recipient
  # @param [String] subject Email subject line
  # @param [String] body Email content (plain text or HTML)
  # @param [Hash] options Additional email options
  # @option options [Boolean] :html Whether body contains HTML (default: false)
  # @option options [Array<String>] :attachments File paths to attach
  # @return [Boolean] Success status of email delivery
  # @raise [ArgumentError] When recipient format is invalid
  # @raise [DeliveryError] When email cannot be delivered
  #
  # @example Send plain text email
  #   success = send_notification('user@example.com', 'Hello', 'Plain text message')
  #
  # @example Send HTML email with attachment
  #   send_notification(
  #     'user@example.com',
  #     'Report',
  #     '<h1>Monthly Report</h1>',
  #     html: true,
  #     attachments: ['/path/to/report.pdf']
  #   )
  def send_notification(recipient, subject, body, options = {})
    # ::: sec validate email using RFC 5322 regex
    # ::: ctx ActionMailer handles SMTP connection pooling
    # ::: perf consider background job for large attachment emails
    
    validate_email_format!(recipient)
    
    mail_options = {
      to: recipient,
      subject: subject,
      body: body
    }.merge(options)
    
    begin
      NotificationMailer.send_email(mail_options).deliver_now
      true
    rescue StandardError => e
      # ::: todo @agent implement retry logic with exponential backoff
      Rails.logger.error "Failed to send email to #{recipient}: #{e.message}"
      false
    end
  end
  
  private
  
  # ::: sec email validation using comprehensive regex
  def validate_email_format!(email)
    # ::: ctx uses RFC 5322 compliant regex pattern
    pattern = /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\z/
    raise ArgumentError, "Invalid email format: #{email}" unless email.match?(pattern)
  end
end
```

### PHP Documentation (phpDocumentor)

```php
<?php
/**
 * ::: tldr Database connection management utilities
 * ::: api Primary interface for database operations
 * ::: config requires PDO extension and database credentials
 * 
 * Database Connection Manager
 * 
 * Provides centralized database connection management with connection
 * pooling, retry logic, and automatic failover support.
 * 
 * @package App\Database
 * @author Development Team
 * @version 3.1.0
 * @since 1.0.0
 * @link https://docs.company.com/database-manager
 */
class DatabaseManager
{
    /**
     * ::: api Core connection creation method
     * ::: sec ensure connection string doesn't leak in logs
     * ::: perf implement connection pooling for production
     * 
     * Creates a new database connection with the specified configuration.
     * 
     * Automatically handles connection retries and failover to secondary
     * database servers if the primary connection fails.
     * 
     * @param string $dsn Database connection string (e.g., "mysql:host=localhost;dbname=app")
     * @param string $username Database username
     * @param string $password Database password
     * @param array $options PDO connection options
     * @return PDO Database connection instance
     * @throws ConnectionException When all connection attempts fail
     * @throws InvalidArgumentException When DSN format is invalid
     * 
     * @example Basic MySQL connection
     * <code>
     * $manager = new DatabaseManager();
     * $pdo = $manager->createConnection(
     *     'mysql:host=localhost;dbname=myapp',
     *     'username',
     *     'password'
     * );
     * </code>
     * 
     * @example PostgreSQL with SSL
     * <code>
     * $pdo = $manager->createConnection(
     *     'pgsql:host=localhost;dbname=myapp;sslmode=require',
     *     'username',
     *     'password',
     *     [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
     * );
     * </code>
     */
    public function createConnection(
        string $dsn, 
        string $username, 
        string $password, 
        array $options = []
    ): PDO {
        // ::: sec sanitize DSN for logging (remove passwords)
        // ::: ctx default timeout is 30 seconds
        // ::: perf reuse connections when possible
        
        $this->validateDsn($dsn);
        
        $defaultOptions = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 30
        ];
        
        $options = array_merge($defaultOptions, $options);
        
        $attempts = 0;
        $maxAttempts = 3;
        
        while ($attempts < $maxAttempts) {
            try {
                // ::: sec ensure password is not logged
                $this->logger->info('Attempting database connection', [
                    'dsn' => $this->sanitizeDsn($dsn),
                    'attempt' => $attempts + 1
                ]);
                
                $pdo = new PDO($dsn, $username, $password, $options);
                
                // ::: ctx verify connection with simple query
                $pdo->query('SELECT 1');
                
                return $pdo;
                
            } catch (PDOException $e) {
                $attempts++;
                
                if ($attempts >= $maxAttempts) {
                    // ::: todo @agent implement exponential backoff
                    throw new ConnectionException(
                        "Failed to connect after {$maxAttempts} attempts: " . $e->getMessage(),
                        0,
                        $e
                    );
                }
                
                // ::: perf exponential backoff: 1s, 2s, 4s...
                sleep(pow(2, $attempts - 1));
            }
        }
    }
}
```

## Mobile Development

### Swift Documentation

```swift
import Foundation

/// ::: tldr Core networking utilities for iOS/macOS applications
/// ::: api Public interface for HTTP requests and responses
/// ::: perf uses URLSession with connection pooling
/// 
/// Provides comprehensive HTTP networking functionality for the app.
/// Handles authentication, request/response processing, error handling,
/// and automatic retry logic with exponential backoff.
/// 
/// ## Usage
/// 
/// ```swift
/// let client = NetworkClient()
/// 
/// // Simple GET request
/// let result = await client.get(url: URL(string: "https://api.example.com/users")!)
/// 
/// // POST with JSON body
/// let userData = ["name": "John", "email": "john@example.com"]
/// let createResult = await client.post(url: userEndpoint, body: userData)
/// ```
/// 
/// ## Error Handling
/// 
/// All methods return `Result<T, NetworkError>` for explicit error handling:
/// 
/// ```swift
/// switch result {
/// case .success(let data):
///     // Handle successful response
/// case .failure(let error):
///     // Handle network error
/// }
/// ```
/// 
/// - Note: This class is thread-safe and can be used from any queue
/// - Important: Requires network permissions in Info.plist
/// - Version: 2.1.0
public class NetworkClient {
    
    /// ::: api Primary GET request method
    /// ::: sec validate URL and sanitize headers
    /// ::: perf cache responses when appropriate
    /// 
    /// Performs an HTTP GET request to the specified URL.
    /// 
    /// This method automatically handles common HTTP scenarios including
    /// redirects, authentication challenges, and temporary failures with
    /// automatic retry logic.
    /// 
    /// - Parameter url: The URL to request (must be valid HTTP/HTTPS)
    /// - Parameter headers: Optional HTTP headers to include
    /// - Parameter timeout: Request timeout in seconds (default: 30)
    /// - Returns: Result containing response data or network error
    /// 
    /// - Throws: Never throws - all errors are returned in Result
    /// 
    /// ## Examples
    /// 
    /// ```swift
    /// // Basic GET request
    /// let result = await client.get(url: apiURL)
    /// 
    /// // With custom headers and timeout  
    /// let result = await client.get(
    ///     url: apiURL,
    ///     headers: ["Authorization": "Bearer \(token)"],
    ///     timeout: 60
    /// )
    /// ```
    public func get(
        url: URL,
        headers: [String: String] = [:],
        timeout: TimeInterval = 30
    ) async -> Result<Data, NetworkError> {
        // ::: ctx URLSession handles connection pooling automatically
        // ::: sec validate URL scheme is HTTP/HTTPS
        // ::: perf reuse URLSession instance across requests
        
        guard url.scheme == "http" || url.scheme == "https" else {
            return .failure(.invalidURL("URL must use HTTP or HTTPS scheme"))
        }
        
        var request = URLRequest(url: url, timeoutInterval: timeout)
        request.httpMethod = "GET"
        
        // ::: sec sanitize headers to prevent injection
        for (key, value) in headers {
            let sanitizedKey = sanitizeHeaderKey(key)
            let sanitizedValue = sanitizeHeaderValue(value)
            request.setValue(sanitizedValue, forHTTPHeaderField: sanitizedKey)
        }
        
        do {
            let (data, response) = try await urlSession.data(for: request)
            
            // ::: ctx verify response is HTTPURLResponse
            guard let httpResponse = response as? HTTPURLResponse else {
                return .failure(.invalidResponse("Response is not HTTP"))
            }
            
            // ::: api success range is 200-299
            guard 200...299 ~= httpResponse.statusCode else {
                return .failure(.httpError(httpResponse.statusCode, data))
            }
            
            return .success(data)
            
        } catch {
            // ::: todo @agent add retry logic for transient failures
            return .failure(.networkError(error))
        }
    }
    
    /// ::: api POST request with JSON body support
    /// ::: sec validate and sanitize request body
    /// ::: perf stream large request bodies
    /// 
    /// Performs an HTTP POST request with optional JSON body.
    /// 
    /// - Parameter url: The URL to post to
    /// - Parameter body: Optional request body (will be JSON encoded)
    /// - Parameter headers: Optional HTTP headers
    /// - Parameter timeout: Request timeout in seconds
    /// - Returns: Result containing response data or network error
    public func post<T: Codable>(
        url: URL,
        body: T? = nil,
        headers: [String: String] = [:],
        timeout: TimeInterval = 30
    ) async -> Result<Data, NetworkError> {
        // ::: ctx automatically sets Content-Type for JSON bodies
        // ::: sec ensure request body size limits
        // ::: perf consider compression for large payloads
        
        var request = URLRequest(url: url, timeoutInterval: timeout)
        request.httpMethod = "POST"
        
        var requestHeaders = headers
        
        if let body = body {
            do {
                // ::: sec validate body can be safely serialized
                request.httpBody = try JSONEncoder().encode(body)
                requestHeaders["Content-Type"] = "application/json"
            } catch {
                return .failure(.encodingError("Failed to encode request body: \(error)"))
            }
        }
        
        for (key, value) in requestHeaders {
            request.setValue(sanitizeHeaderValue(value), forHTTPHeaderField: sanitizeHeaderKey(key))
        }
        
        return await executeRequest(request)
    }
}

/// ::: api Network error types for comprehensive error handling
/// ::: tldr All possible network operation failures
public enum NetworkError: Error, LocalizedError {
    case invalidURL(String)
    case invalidResponse(String)
    case httpError(Int, Data?)
    case networkError(Error)
    case encodingError(String)
    case decodingError(String)
    
    /// ::: api User-friendly error descriptions
    public var errorDescription: String? {
        switch self {
        case .invalidURL(let message):
            return "Invalid URL: \(message)"
        case .invalidResponse(let message):
            return "Invalid response: \(message)"
        case .httpError(let code, _):
            return "HTTP error \(code)"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .encodingError(let message):
            return "Encoding error: \(message)"
        case .decodingError(let message):
            return "Decoding error: \(message)"
        }
    }
}
```

### Kotlin Documentation (KDoc)

```kotlin
/**
 * ::: tldr Android HTTP client with coroutines support
 * ::: api Primary networking interface for Android apps
 * ::: perf uses OkHttp with connection pooling and caching
 * 
 * Comprehensive HTTP client designed for Android applications.
 * Provides coroutine-based async operations, automatic retry logic,
 * request/response interceptors, and offline caching support.
 * 
 * ## Features
 * - Coroutine-based async operations
 * - Automatic retry with exponential backoff
 * - Response caching for offline support
 * - Request/response logging and analytics
 * - Certificate pinning for security
 * 
 * ## Usage
 * 
 * ```kotlin
 * val client = HttpClient()
 * 
 * // Suspend function usage
 * val result = client.get<User>("https://api.example.com/user/123")
 * result.fold(
 *     onSuccess = { user -> println("User: ${user.name}") },
 *     onFailure = { error -> Log.e("Network", "Failed: $error") }
 * )
 * ```
 * 
 * @property baseUrl Base URL for all requests (optional)
 * @property timeout Default timeout for requests in milliseconds
 * @property retryCount Maximum number of retry attempts
 * 
 * @constructor Creates HTTP client with default configuration
 * @param config Optional configuration block for customization
 * 
 * @author Android Team
 * @version 1.5.0
 * @since 1.0.0
 */
class HttpClient(
    private val baseUrl: String? = null,
    private val timeout: Long = 30_000,
    private val retryCount: Int = 3,
    config: (OkHttpClient.Builder.() -> Unit)? = null
) {
    
    /**
     * ::: api Generic GET request with automatic JSON deserialization
     * ::: sec validate URL and sanitize headers
     * ::: perf use response caching when appropriate
     * 
     * Performs an HTTP GET request and deserializes the response to the specified type.
     * 
     * This method automatically handles:
     * - URL validation and sanitization
     * - Response caching based on HTTP headers
     * - Automatic retry for transient failures
     * - JSON deserialization with error handling
     * 
     * @param T The type to deserialize the response to
     * @param url The URL to request (relative or absolute)
     * @param headers Optional HTTP headers to include
     * @param cachePolicy Cache behavior for this request
     * @return Result containing deserialized object or error
     * 
     * @throws IllegalArgumentException if URL format is invalid
     * @sample sampleGetRequest
     */
    suspend inline fun <reified T> get(
        url: String,
        headers: Map<String, String> = emptyMap(),
        cachePolicy: CachePolicy = CachePolicy.Default
    ): Result<T> {
        // ::: ctx combines baseUrl with relative URLs automatically
        // ::: sec prevent URL injection attacks
        // ::: perf check cache before making network request
        
        val fullUrl = resolveUrl(url)
        validateUrl(fullUrl)
        
        val request = Request.Builder()
            .url(fullUrl)
            .apply {
                // ::: sec sanitize all header values
                headers.forEach { (key, value) ->
                    addHeader(sanitizeHeaderKey(key), sanitizeHeaderValue(value))
                }
                
                // ::: ctx cache policy affects request headers
                when (cachePolicy) {
                    CachePolicy.NetworkOnly -> addHeader("Cache-Control", "no-cache")
                    CachePolicy.CacheOnly -> addHeader("Cache-Control", "only-if-cached")
                    CachePolicy.Default -> { /* Use default caching */ }
                }
            }
            .build()
        
        return executeWithRetry(request) { response ->
            // ::: perf stream large responses instead of loading to memory
            val responseBody = response.body?.string() 
                ?: return@executeWithRetry Result.failure(HttpException("Empty response body"))
            
            try {
                // ::: ctx uses Moshi for JSON serialization
                val adapter = moshi.adapter(T::class.java)
                val result = adapter.fromJson(responseBody)
                    ?: return@executeWithRetry Result.failure(HttpException("Failed to parse JSON"))
                
                Result.success(result)
            } catch (e: Exception) {
                // ::: todo @agent add more specific error types
                Result.failure(HttpException("Deserialization failed: ${e.message}", e))
            }
        }
    }
    
    /**
     * ::: api POST request with automatic JSON serialization
     * ::: sec validate request body size and content
     * ::: perf compress large request bodies
     * 
     * Performs an HTTP POST request with automatic JSON serialization of the request body.
     * 
     * @param T Request body type
     * @param R Response body type
     * @param url The URL to post to
     * @param body Request body object (will be JSON serialized)
     * @param headers Optional HTTP headers
     * @return Result containing deserialized response or error
     */
    suspend inline fun <reified T, reified R> post(
        url: String,
        body: T,
        headers: Map<String, String> = emptyMap()
    ): Result<R> {
        // ::: ctx automatically sets Content-Type header for JSON
        // ::: sec limit request body size to prevent DoS
        // ::: perf consider request compression for large bodies
        
        val fullUrl = resolveUrl(url)
        validateUrl(fullUrl)
        
        val jsonBody = try {
            // ::: sec ensure request body doesn't contain sensitive data in logs
            val adapter = moshi.adapter(T::class.java)
            adapter.toJson(body)
        } catch (e: Exception) {
            return Result.failure(HttpException("Failed to serialize request body: ${e.message}", e))
        }
        
        // ::: ctx check body size limits before creating request
        if (jsonBody.length > MAX_REQUEST_BODY_SIZE) {
            return Result.failure(HttpException("Request body too large: ${jsonBody.length} bytes"))
        }
        
        val requestBody = jsonBody.toRequestBody("application/json; charset=utf-8".toMediaType())
        
        val request = Request.Builder()
            .url(fullUrl)
            .post(requestBody)
            .apply {
                headers.forEach { (key, value) ->
                    addHeader(sanitizeHeaderKey(key), sanitizeHeaderValue(value))
                }
            }
            .build()
        
        return executeWithRetry(request) { response ->
            val responseBody = response.body?.string() 
                ?: return@executeWithRetry Result.failure(HttpException("Empty response body"))
            
            try {
                val adapter = moshi.adapter(R::class.java)
                val result = adapter.fromJson(responseBody)
                    ?: return@executeWithRetry Result.failure(HttpException("Failed to parse response JSON"))
                
                Result.success(result)
            } catch (e: Exception) {
                Result.failure(HttpException("Response deserialization failed: ${e.message}", e))
            }
        }
    }
    
    /**
     * ::: perf retry logic with exponential backoff
     * ::: ctx internal method for request execution
     */
    private suspend fun <T> executeWithRetry(
        request: Request,
        transform: (Response) -> Result<T>
    ): Result<T> {
        // ::: perf exponential backoff: 1s, 2s, 4s, 8s...
        // ::: ctx only retry on transient failures (5xx, timeouts)
        
        repeat(retryCount) { attempt ->
            try {
                val response = okHttpClient.newCall(request).await()
                
                if (response.isSuccessful) {
                    return transform(response)
                } else if (!shouldRetry(response.code)) {
                    return Result.failure(HttpException("HTTP ${response.code}: ${response.message}"))
                }
                
                // ::: todo @agent make backoff configurable
                if (attempt < retryCount - 1) {
                    delay(1000L * (1 shl attempt)) // Exponential backoff
                }
                
            } catch (e: Exception) {
                if (attempt == retryCount - 1 || !isRetriableException(e)) {
                    return Result.failure(HttpException("Network request failed: ${e.message}", e))
                }
                
                delay(1000L * (1 shl attempt))
            }
        }
        
        return Result.failure(HttpException("Max retries exceeded"))
    }
}

/**
 * ::: api Cache policy options for HTTP requests
 * ::: tldr Controls caching behavior for network requests
 */
enum class CachePolicy {
    /** ::: ctx Use default HTTP caching headers */
    Default,
    /** ::: ctx Always fetch from network, ignore cache */
    NetworkOnly,
    /** ::: ctx Only return cached responses, no network */
    CacheOnly
}

/**
 * ::: api Custom exception for HTTP-related errors
 * ::: tldr Represents all HTTP operation failures
 */
class HttpException(
    message: String,
    cause: Throwable? = null
) : Exception(message, cause)

/**
 * ::: ctx Sample usage for documentation
 */
private suspend fun sampleGetRequest() {
    val client = HttpClient(baseUrl = "https://api.example.com")
    
    // ::: ctx demonstrates typical API call pattern
    val result = client.get<User>("/user/123")
    result.fold(
        onSuccess = { user -> 
            println("User loaded: ${user.name}")
        },
        onFailure = { error ->
            Log.e("HTTP", "Failed to load user: $error")
        }
    )
}
```

## Universal Search Patterns

Waymarks work consistently across all documentation systems with these search strategies:

### Language-Specific Searches

```bash
# JavaScript/TypeScript (JSDoc, TSDoc)
rg "\/\*\*[\s\S]*?:::" --type js          # JSDoc blocks only
rg ":::" --type js                        # All anchors in JS/TS

# Python (all docstring formats)
rg '"""[\s\S]*?:::' --type py             # Triple quote docstrings  
rg "'''[\s\S]*?:::" --type py             # Single quote docstrings
rg ":::" --type py                        # All anchors in Python

# Rust (rustdoc)
rg "\/\/\/ :::" --type rust               # Doc comments only
rg ":::" --type rust                      # All anchors in Rust

# Go (godoc)
rg "\/\/ :::" --type go                   # Doc comments only
rg ":::" --type go                        # All anchors in Go

# C/C++ (Doxygen)
rg "\/\*\*[\s\S]*?:::" --type cpp         # Doxygen blocks
rg ":::" --type cpp                       # All anchors in C/C++

# Java (Javadoc)
rg "\/\*\*[\s\S]*?:::" --type java        # Javadoc blocks
rg ":::" --type java                      # All anchors in Java

# C# (XML documentation)
rg "\/\/\/ <summary>[\s\S]*?:::" --type cs # XML doc comments
rg ":::" --type cs                        # All anchors in C#

# Ruby (RDoc/YARD)
rg "##[\s\S]*?:::" --type ruby            # Block comments
rg ":::" --type ruby                      # All anchors in Ruby

# PHP (phpDocumentor)
rg "\/\*\*[\s\S]*?:::" --type php         # PHPDoc blocks
rg ":::" --type php                       # All anchors in PHP

# Swift
rg "\/\/\/ :::" --type swift              # Swift doc comments
rg ":::" --type swift                     # All anchors in Swift

# Kotlin (KDoc)
rg "\/\*\*[\s\S]*?:::" --type kotlin      # KDoc blocks
rg ":::" --type kotlin                    # All anchors in Kotlin
```

### Cross-Language Searches

```bash
# All documentation comments with anchors
rg -U "(?:\/\*\*|\/\/\/|##|#|<!--|\"\"\")\s*[\s\S]*?:::" --type-add 'docs:*.{js,ts,py,rs,go,java,swift,kt,rb,php,cs,cpp,h,hpp}' -t docs

# All API-related anchors across languages
rg ":::.*api" --type-add 'code:*.{js,ts,py,rs,go,java,swift,kt,rb,php,cs,cpp,h}' -t code

# Security-related anchors in documentation
rg -U "(?:\/\*\*|\/\/\/|##|#|<!--|\"\"\")\s*[\s\S]*?:::.*sec" --type-add 'docs:*.{js,ts,py,rs,go,java,swift,kt,rb,php,cs,cpp,h}' -t docs

# Performance-related documentation anchors
rg -B2 -A5 ":::.*perf" --type-add 'all:*'
```

### Context-Aware Searches

```bash
# Find anchors with surrounding documentation context
rg -B5 -A10 "::: api" --type-add 'code:*'    # 5 lines before, 10 after
rg -C3 "::: sec" --type js                    # 3 lines context for JS security

# Documentation blocks containing specific anchor types
rg -U "\/\*\*[\s\S]*?::: todo[\s\S]*?\*\/" --type js    # JSDoc blocks with todos
rg -U '"""[\s\S]*?::: api[\s\S]*?"""' --type py         # Python docstrings with API markers
```

## Recommended Positioning

**Universal pattern - Waymarks first in documentation:**

```
/* Any documentation format
 * ::: tldr Brief overview
 * ::: api Public interface marker  
 * ::: sec Security considerations
 * ::: todo @agent Tasks for AI
 * 
 * Standard documentation content follows...
 * @param/@arg/@parameter documentation
 * @returns/@return/@output documentation
 * @throws/@raise/@exception error conditions
 */
```

This ensures:

- **Consistent anchor placement** across all languages
- **Easy search patterns** work universally
- **No interference** with documentation generators
- **Progressive enhancement** of existing codebases

## Adoption Strategies

### Adding to Existing Documentation

1. **Identify key documentation** - Start with public APIs
2. **Add waymarks first** - Place at beginning of doc blocks
3. **Validate tools** - Ensure doc generators still work
4. **Search verification** - Test waymark discovery patterns
5. **Team adoption** - Document conventions in README

### Example Enhancement Script

```bash
#!/bin/bash
# Add API anchors to existing JSDoc functions

# ::: temp enhancement script example
# ::: todo @agent make this more robust for edge cases

find . -name "*.js" -type f | xargs sed -i '
  /\/\*\*/{
    # Look for function/class documentation
    /\* @description\|* @param\|* @returns/ {
      # Add API anchor if not already present
      /\* :::/ !{
        s/\/\*\*/\/\*\*\n * ::: api/
      }
    }
  }
'
```

## Best Practices

### Universal Guidelines

1. **Waymarks come first** - Always place at beginning of documentation
2. **One space after `:::`** - Consistent formatting across languages
3. **Language-appropriate comments** - Use `///` for Rust, `##` for Ruby, etc.
4. **Separate concerns** - Use multiple lines for distinct topics
5. **Test doc generation** - Ensure existing tools continue working
6. **Document conventions** - Add patterns to project README

### Language-Specific Tips

**JavaScript/TypeScript:**

- Use JSDoc blocks for functions, classes, and interfaces
- Place anchors before `@param` and `@returns`
- Consider TSDoc for TypeScript-specific features

**Python:**

- Work with any docstring style (Google, NumPy, Sphinx)
- Place anchors at docstring beginning
- Use triple quotes consistently

**Rust:**

- Use `///` for public item documentation
- Place anchors before examples and safety notes
- Works with `cargo doc` generation

**Go:**

- Use comment blocks starting with `//`
- Place anchors before usage examples
- Compatible with `godoc` tool

**Java:**

- Use Javadoc blocks for public APIs
- Place anchors before `@param` tags
- Works with standard Javadoc generation

## Conclusion

Waymarks provide **universal code navigation** that works seamlessly with all major documentation systems. The `:::` pattern adds zero overhead to existing documentation workflows while enabling powerful search-based code discovery.

**Key benefits:**

- **Zero breaking changes** - Existing tools continue working
- **Universal search** - `rg ":::"` works across all languages
- **Progressive adoption** - Add anchors incrementally
- **AI-friendly** - Enables intelligent code navigation
- **Documentation-aware** - Respects existing doc conventions

Start with essential patterns (`todo`, `api`, `sec`) and expand as your team discovers the value of searchable code markers.
