<!-- ::: fixme, refactor this uses old patterns -->
<!-- :ga:tldr marker semantic typing system for 5W+H framework -->
# Marker Semantic Types (Future Idea)

## Core Concept

Each marker could have an associated semantic type based on the journalistic "5 W's and H" framework: who, what, where, when, why, how.

## Marker Type Classification

```yaml
marker-types:
  who: ["owner", "assignee", "team", "responsible", "decided-by"]
  what: ["explains", "about", "describes", "function", "purpose"] 
  where: ["see", "file", "location", "deployed", "used-in"]
  when: ["since", "until", "deadline", "scheduled", "due"]
  why: ["context", "reason", "rationale", "business-logic"]
  how: ["pattern", "implementation", "method", "algorithm"]
  
  # Some markers might not fit the 5W+H model
  task: ["todo", "bug", "needs"]
  meta: ["priority", "status", "type", "id"]
  relational: ["rel", "depends", "blocks"]  # or inherit from rel() parameter
```

## Semantic Search Examples

```bash
# Find all responsibility markers
grepa search --type who:@alice
# Returns: owner(@alice), assignee(@alice), responsible(@alice), etc.

# Find all timing-related markers  
grepa search --type when:v2.0
# Returns: since(v2.0), until(v2.0), deadline(v2.0), etc.

# Find all explanatory content
grepa search --type what:authentication
# Returns: explains(auth), about(auth-flow), describes(oauth), etc.
```

## Benefits

- **Semantic search**: Query by intent rather than specific marker names
- **Validation**: Tools can validate marker content matches type expectations
- **UI organization**: IDEs can group markers by semantic purpose
- **Migration**: Add new markers to existing types without breaking searches
- **Cross-project consistency**: Same semantic types across different teams

## Open Questions

1. Should this be explicit in config, or can tools infer types?
2. How do relational markers (`rel()`) fit into this system?
3. Should teams be able to define custom semantic types?
4. What about markers that don't fit the 5W+H framework?

## Implementation Notes

- Could be added as optional metadata without changing core syntax
- Backwards compatible - existing markers work without type annotations
- Teams could gradually adopt semantic typing
- Tools could provide type inference suggestions