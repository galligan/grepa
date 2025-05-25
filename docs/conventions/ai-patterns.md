# AI Patterns
<!-- :ga:tldr Conventions for AI agent delegation and interaction -->
<!-- :ga:convention Patterns specifically designed for AI agent workflows -->

Conventions for AI agent delegation and interaction.

## Agent Mentions

### Direct Agent Tags
**Purpose**: Delegate to specific AI assistants
```javascript
// :ga:@cursor implement unit tests
// :ga:@copilot complete this function
// :ga:@claude explain this algorithm
// :ga:@chatgpt optimize for readability
```

### Generic Agent Tag
**Purpose**: Any AI agent can help
```javascript
// :ga:@agent generate documentation
// :ga:@ai add error handling
```

## Task Delegation

### `:ga:generate`
**Purpose**: Generate new code
```python
# :ga:generate@cursor test cases for this class
# :ga:generate rest endpoint
```

### `:ga:complete`
**Purpose**: Complete partial implementation
```javascript
// :ga:complete TODO: implement sorting
// :ga:complete@copilot fill in edge cases
```

### `:ga:refactor`
**Purpose**: Improve existing code
```go
// :ga:refactor@claude make more idiomatic
// :ga:refactor extract common logic
```

### `:ga:explain`
**Purpose**: Add explanations or documentation
```rust
// :ga:explain@agent how this macro works
// :ga:explain add inline comments
```

## Review Requests

### `:ga:review@ai`
**Purpose**: AI code review
```javascript
// :ga:review@claude security implications
// :ga:review@ai potential bugs
```

### `:ga:audit`
**Purpose**: Comprehensive analysis
```python
# :ga:audit@ai performance bottlenecks
# :ga:audit check for memory leaks
```

## Specific Improvements

### `:ga:optimize`
**Purpose**: Performance improvements
```javascript
// :ga:optimize@ai reduce complexity
// :ga:optimize memory usage
```

### `:ga:secure`
**Purpose**: Security hardening
```go
// :ga:secure@claude input validation
// :ga:secure prevent injection
```

### `:ga:simplify`
**Purpose**: Make code clearer
```python
# :ga:simplify@agent reduce nesting
# :ga:simplify make more pythonic
```

## Documentation Tasks

### `:ga:document`
**Purpose**: Add documentation
```javascript
// :ga:document@ai add jsdoc
// :ga:document api usage examples
```

### `:ga:summarize`
**Purpose**: Create summaries
```python
# :ga:summarize@claude module purpose
# :ga:tldr@ai function overview
```

## Context Patterns

### Providing Context
```javascript
// :ga:ctx uses Redux for state management
// :ga:note@ai follows clean architecture
// :ga:assume@agent typescript strict mode
```

### Constraints
```javascript
// :ga:constraint@ai no external dependencies
// :ga:requirement must be backwards compatible
// :ga:limitation node 16 compatibility
```

## Multi-Agent Patterns

### Sequential Tasks
```javascript
// :ga:@cursor generate, then @claude review
// :ga:first@copilot implement, then@ai optimize
```

### Specialized Delegation
```javascript
// :ga:ui@cursor,logic@claude
// :ga:frontend@copilot,backend@agent
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
// :ga:@claude analyze this recursive function for edge cases,
// then @cursor generate comprehensive test cases
```

### Contextual Generation
```javascript
// :ga:generate@ai rest endpoint
// :ga:ctx follow existing patterns in /api
// :ga:requirement use zod for validation
```

### Review Pipeline
```javascript
// :ga:review@claude security
// :ga:review@cursor performance  
// :ga:review@ai best practices
```