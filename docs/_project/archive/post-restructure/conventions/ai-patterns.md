# AI Patterns
<!-- ::: tldr Conventions for AI agent delegation and interaction -->
<!-- ::: convention Patterns specifically designed for AI agent workflows -->

Conventions for AI agent delegation and interaction.

## Agent Mentions

### Direct Agent Markers
**Purpose**: Delegate to specific AI assistants
```javascript
// ::: @cursor implement unit tests
// ::: @copilot complete this function
// ::: @claude explain this algorithm
// ::: @chatgpt optimize for readability
```

### Generic Agent Marker
**Purpose**: Any AI agent can help
```javascript
// ::: @agent generate documentation
// ::: @ai add error handling
```

## Task Delegation

### `::: generate`
**Purpose**: Generate new code
```python
# ::: generate, @cursor test cases for this class
# ::: generate rest endpoint
```

### `::: complete`
**Purpose**: Complete partial implementation
```javascript
// ::: complete TODO: implement sorting
// ::: complete, @copilot fill in edge cases
```

### `::: refactor`
**Purpose**: Improve existing code
```go
// ::: refactor, @claude make more idiomatic
// ::: refactor extract common logic
```

### `::: explain`
**Purpose**: Add explanations or documentation
```rust
// ::: explain, @agent how this macro works
// ::: explain add inline comments
```

## Review Requests

### `::: review, @ai`
**Purpose**: AI code review
```javascript
// ::: review, @claude security implications
// ::: review, @ai potential bugs
```

### `::: audit`
**Purpose**: Comprehensive analysis
```python
# ::: audit, @ai performance bottlenecks
# ::: audit check for memory leaks
```

## Specific Improvements

### `::: optimize`
**Purpose**: Performance improvements
```javascript
// ::: optimize, @ai reduce complexity
// ::: optimize memory usage
```

### `::: secure`
**Purpose**: Security hardening
```go
// ::: secure, @claude input validation
// ::: secure prevent injection
```

### `::: simplify`
**Purpose**: Make code clearer
```python
# ::: simplify, @agent reduce nesting
# ::: simplify make more pythonic
```

## Documentation Tasks

### `::: document`
**Purpose**: Add documentation
```javascript
// ::: document, @ai add jsdoc
// ::: document api usage examples
```

### `::: summarize`
**Purpose**: Create summaries
```python
# ::: summarize, @claude module purpose
# ::: tldr, @ai function overview
```

## Context Patterns

### Providing Context
```javascript
// ::: ctx uses Redux for state management
// ::: note, @ai follows clean architecture
// ::: assume, @agent typescript strict mode
```

### Constraints
```javascript
// ::: constraint, @ai no external dependencies
// ::: requirement must be backwards compatible
// ::: limitation node 16 compatibility
```

## Multi-Agent Patterns

### Sequential Tasks
```javascript
// ::: @cursor generate, then @claude review
// ::: first, @copilot implement, then @ai optimize
```

### Specialized Delegation
```javascript
// ::: ui, @cursor, logic, @claude
// ::: frontend, @copilot, backend, @agent
```

## Working with AI Agents

- **Be Specific**: Clear instructions help agents understand what you need
- **Add Context**: Including constraints or requirements can improve results
- **Chain Tasks**: Consider using multiple agents for their different strengths
- **Verify Output**: Review AI-generated code before using it
- **Iterate**: Refining prompts based on results often helps

## Examples

### Complex Delegation
```javascript
// ::: @claude analyze this recursive function for edge cases,
// then @cursor generate comprehensive test cases
```

### Contextual Generation
```javascript
// ::: generate, @ai rest endpoint
// ::: ctx follow existing patterns in /api
// ::: requirement use zod for validation
```

### Review Pipeline
```javascript
// ::: review, @claude security
// ::: review, @cursor performance  
// ::: review, @ai best practices
```