<!-- ::: keep: brainstorming document about UUIDs for waymarks -->
<!-- :ga:tldr future UUID system for automatic ID assignment and cross-references -->
# UUID ID System and Cross-Referencing

<!-- :ga:meta speculative feature design for identifier management -->

> **Future Feature**: This document outlines a speculative UUID system that may be implemented in future versions of grepa. It is not part of the current specification.

## Overview

### ID System and Cross-Referencing

Automatic and manual ID assignment systems for cross-referencing grep-anchors throughout codebases.

## Manual ID Assignment

```javascript
// :ga:todo,id:auth-impl implement authentication
// :ga:sec,id:validate-input,priority:high validate all inputs
```

## Referencing with # Symbol

```javascript
// :ga:see(#auth-impl)
// :ga:blocked(by:#validate-input)
// :ga:depends(on:#mem-leak-1)
// :ga:related(#auth-impl,#validate-input)
```

## Future UUID Enhancement Concept

```javascript
// Automatic UUID assignment potential:
// :ga:todo implement auth
// Could auto-assign: :ga:todo,uuid:7f3d2a1b implement auth

// UUID generation strategies:
// 1. Short hash (6-8 chars): 7f3d2a1b
// 2. Timestamp-based: 20240115-4a2f  
// 3. Content-based: hash of file+line+content
// 4. Sequential: proj-0001, proj-0002
```

## Tag System and Semantic Navigation

**Implicit Tags from Markers:**
```javascript
// :ga:todo,priority:high creates implicit tags: #todo, #priority:high
// :ga:component:auth.oauth creates: #component:auth.oauth
```

**Explicit Tags in Prose:**
```javascript
// :ga:todo implement OAuth for #aisdk using #auth.oauth.google
// :ga:doc API reference for #api.v2.users #breaking-change
```

**Hierarchical Tag Navigation:**
```javascript
#auth               // matches all auth-related
#auth.oauth         // matches auth.oauth and deeper
#auth.oauth.google  // specific match
```

## Implementation Considerations

<!-- :ga:todo future implementation requirements -->
- UUID generation algorithms
- Cross-reference validation
- Tag indexing and search systems
- Hierarchical tag resolution
- Conflict detection for manual IDs
- Migration tools for existing anchors