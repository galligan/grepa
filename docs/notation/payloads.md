# Payload Types
<!-- :ga:tldr Three payload types: bare tokens, JSON objects, and arrays -->
<!-- :ga:notation Detailed payload type specifications and examples -->

Payloads define what comes after the `:ga:` sigil. Grepa supports three payload types.

## Bare Tokens

Simple string identifiers. Most common and readable.

### Format
- Alphanumeric characters, dots, dashes, underscores
- Optional `@` prefix for mentions
- Case-sensitive

### Examples
```javascript
// :ga:todo
// :ga:v1.2.3
// :ga:high-priority
// :ga:@alice
// :ga:api_endpoint
```

## JSON Objects

Structured metadata for complex information.

### Format
- Valid JSON object syntax
- Must be on single line (no pretty printing)
- Keys should be camelCase

### Examples
```javascript
// :ga:{"type":"bug","priority":"p0"}
// :ga:{"assignee":"@bob","due":"2025-02-01"}
// :ga:{"deprecated":true,"since":"v2.0","until":"v3.0"}
```

### Common Fields

| Field | Type | Purpose |
|-------|------|---------|
| `type` | string | Categorization |
| `priority` | string | Urgency level |
| `assignee` | string | Owner/responsible party |
| `due` | string | Deadline (ISO 8601) |
| `issue` | string | External reference |
| `since` | string | Version introduced |
| `until` | string | Version for removal |

## Arrays

Lists of values, useful for multiple items.

### Format
- Square bracket notation
- Comma-separated values
- Can contain strings or numbers

### Examples
```javascript
// :ga:["frontend","backend"]
// :ga:[@alice,@bob,@charlie]
// :ga:[v1.0,v1.1,v1.2]
// :ga:["high","security","urgent"]
```

## Mention Tokens

Special tokens starting with `@` to indicate people or agents.

### Standalone Mentions
```javascript
// :ga:@alice          // Direct mention
// :ga:@security-team  // Team mention
// :ga:@cursor         // AI agent
```

### Composed Mentions
```javascript
// :ga:owner@alice     // Owner designation
// :ga:reviewer@bob    // Reviewer designation
// :ga:attn@charlie    // Attention needed
```

### Multiple Mentions
```javascript
// :ga:reviewers[@alice,@bob]
// :ga:cc(@alice,@security-team)
// :ga:owners[@frontend,@backend]
```

## Token Combination

Multiple tokens can be combined:

### Comma Separation (Most Common)
```javascript
// :ga:fix,sec,p0
// :ga:todo,@alice,v2.1
```

### Space Separation
```javascript
// :ga:fix sec p0
// :ga:todo @alice v2.1
```

### Mixed Payloads
```javascript
// :ga:p0,{"type":"security","cve":"CVE-2025-1234"}
// :ga:owners[@alice,@bob],p1
```