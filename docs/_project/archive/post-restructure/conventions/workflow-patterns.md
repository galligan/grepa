# Workflow Patterns
<!-- ::: tldr waymarks for managing work, collaboration, and process flow -->
<!-- ::: convention Patterns for team workflows and collaboration -->

Waymarks for managing work, collaboration, and process flow.

## Work Tracking

### `::: todo`

**Purpose**: Mark future work items

```javascript
// ::: todo implement caching layer
```

### `::: fixme`

**Purpose**: Broken code needing immediate attention

```python
# ::: fixme race condition in auth flow
```

### `::: hack`

**Purpose**: Temporary workarounds

```go
// ::: hack workaround for upstream bug #123
```

## Review & Collaboration

### `::: review`

**Purpose**: Code needing review

```javascript
// ::: review security implications unclear
```

### `::: question`

**Purpose**: Clarification needed

```python
# ::: question is this the right approach?
```

### `::: discuss`

**Purpose**: Needs team discussion

```java
// ::: discuss architecture decision needed
```

## Mention Patterns

### Direct Mentions

**Purpose**: Tag specific people or teams

```javascript
// ::: @alice please review
// ::: @backend-team optimization needed
// ::: @security audit required
```

### Attention Mentions

**Purpose**: Request someone's attention

```javascript
// ::: attn, @alice broken in production
// ::: attn, @devops deployment issue
// ::: attn, owner:[@alice,@bob] coordination needed
```

### Owner Mentions

**Purpose**: Designate ownership/responsibility

```javascript
// ::: owner:@alice payment module
// ::: owner:@frontend-team UI components
// ::: owner:[@alice,@bob] shared ownership
```

### Reviewer Mentions

**Purpose**: Assign reviewers

```javascript
// ::: reviewer:@senior needs approval
// ::: reviewers:[@alice,@bob]
// ::: reviewer:[@security,@performance]
```

## Status Tracking

### `::: wip`

**Purpose**: Work in progress

```python
# ::: wip do not merge
```

### `::: blocked`

**Purpose**: Blocked by dependency

```go
// ::: blocked waiting on API update
// ::: blocked, @alice need input
```

### `::: ready`

**Purpose**: Ready for next step

```javascript
// ::: ready for review
// ::: ready, @qa for testing
```

## Priority Patterns

### Priority Levels

```javascript
// ::: p0 system down
// ::: p1 major feature broken
// ::: p2 important bug
// ::: p3 nice to have
```

### Urgency Indicators

```javascript
// ::: urgent, @ops production issue
// ::: asap, owner:@alice customer blocker
// ::: whenever low priority cleanup
```

## Lifecycle Management

### `::: draft`

**Purpose**: Not finalized

```python
# ::: draft api design subject to change
```

### `::: approved`

**Purpose**: Formally approved

```java
// ::: approved, @architect design reviewed
```

### `::: shipped`

**Purpose**: Deployed to production

```javascript
// ::: shipped:v2.1 feature released
```

## Integration Patterns

### Issue Tracking

```javascript
// ::: issue(1234) related ticket
// ::: fixes(#456) closes issue
// ::: see:[#123,#456] related issues
```

### External References

```javascript
// ::: rfc(7231) follows HTTP spec
// ::: spec:section-4.2
// ::: doc:wiki/AuthFlow
```

## Best Practices

1. **Mention Format**: Use `@` for people/teams consistently
2. **Attribute Actions**: `action@person` shows who should act
3. **Group Mentions**: Use arrays or parens for multiple people
4. **Add Context**: Always include description after waymarks
5. **Update Status**: Change tags as work progresses