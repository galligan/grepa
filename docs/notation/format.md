# Grepa Notation Format Specification
<!-- :ga:tldr Formal specification for grep-anchor notation format -->
<!-- :ga:notation Technical format specification and grammar rules -->

## Core Format

Every grep-anchor follows this pattern:

```text
<comment-leader> :ga:payload
```

### Components

1. **Comment Leader**: Language-appropriate comment syntax
2. **Sigil**: The marker `:ga:` (or custom sigil)
3. **Payload**: One or more tokens

## Formal Grammar

```ebnf
anchor      ::= comment-leader sigil payload
sigil       ::= ":ga:" | ":" identifier ":"
payload     ::= token ( separator token )*
token       ::= bare-token | parameter | json-object | array
bare-token  ::= ["@"] [a-zA-Z0-9_.-]+
parameter   ::= bare-token "(" [^)]* ")"    # optional parameter payload
json-object ::= "{" valid-json "}"
array       ::= "[" item ("," item)* "]"
separator   ::= "," | " " | "|"
```

## Sigil Rules

### Standard Sigil
```javascript
// :ga:todo  // Standard grep-anchor
```

### Custom Sigils
Projects can define custom sigils:
```javascript
// :proj:milestone-1  // Project-specific
// :team:backend      // Team-specific
// :api:v2           // API-specific
```

## Comment Integration

The anchor must follow language comment rules:

### Single-line Comments
```javascript
// :ga:fix null check      (JavaScript)
# :ga:todo refactor        (Python)
-- :ga:perf add index      (SQL)
```

### Multi-line Comments
```javascript
/* :ga:doc needs examples */
/**
 * :ga:api public interface
 */
```

### Documentation Comments
```python
"""
:ga:module core authentication
"""
```

## Payload Separators

Tokens can be separated by:
- Comma: `:ga:fix,sec`
- Space: `:ga:fix sec`
- Pipe: `:ga:fix|sec` (rare)

## Parameterised Markers

A marker can carry a single *parameter* wrapped in round-brackets to give a more precise reference (for example an issue number or RFC identifier).

```javascript
// :ga:gh(issue#4)          // marker = gh, parameter = issue#4
// :ga:rfc(7231)            // marker = rfc, parameter = 7231
// :ga:feature(flag-login)  // marker = feature, parameter = flag-login
```

Guidelines:

1. Prefer a hash (`#`) or hyphen (`-`) as an internal delimiter instead of `/` to avoid path-like ambiguity (`issue#4`, not `issue/4`).
2. No whitespace or newlines inside the parameter payload.
3. Tooling should treat the entire `marker(parameter)` sequence as **one token** for search / linting purposes.

This maps directly to the `parameter` production added in the formal grammar above.

## Whitespace Rules

- No space between sigil and payload: `:ga:todo` ✓
- Space after payload recommended: `:ga:todo implement cache` ✓
- Leading/trailing spaces trimmed: ` :ga:todo ` → `:ga:todo`

## Line Length Considerations

For better grep results and readability:
- Keep total line length under ~80 characters
- Use separate comments for distinct concerns
- Combine only closely related tags

```javascript
// Good: Concise, related tags
// :ga:sec,todo validate inputs

// Better: Clear separation of concerns
// :ga:sec check user permissions
// :ga:todo implement rate limiting
// :ga:ctx 100 requests/minute limit
```