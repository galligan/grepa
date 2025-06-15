# Documentation Simplification Proposal
<!-- ::: tldr Restructure docs from 30+ files to ~5 focused documents -->

## Summary

Simplify waymark documentation from 9,866 lines across 30+ files down to ~5 core documents totaling under 1,500 lines. Focus on immediate utility over future possibilities.

## Current Problems

1. **Information Overload**: 30+ files make it hard to find essential information
2. **Duplication**: Multiple files cover the same topics (examples, TypeScript conventions)
3. **Premature Complexity**: Extensive docs for features that don't exist yet
4. **Unclear Entry Point**: No clear path for new users

## Proposed Structure

```
docs/
├── README.md              # Start here (moved from root)
├── syntax.md              # Complete waymark syntax reference
├── examples.md            # Practical usage patterns
├── conventions.md         # Best practices and patterns
├── guides/
│   └── quick-start.md     # 5-minute introduction (keep)
├── project/               # Project management (preserve)
│   ├── LANGUAGE.md       
│   ├── archive/          
│   └── proposals/        
└── tooling/              # Minimal tooling docs
    └── API.md            # API reference (if needed)
```

## Consolidation Plan

### 1. Create `syntax.md` (Target: ~300 lines)

Merge these files:
- `syntax/README.md` → Introduction
- `syntax/SPEC.md` → Formal specification  
- `syntax/payloads.md` → Payload types
- `syntax/advanced/advanced-patterns.md` → Advanced usage

Structure:
```markdown
# Waymark Syntax

## Overview
[Brief introduction]

## Basic Syntax
- The ::: identifier
- Required single space
- Context types

## Payload Types
- Bare tokens
- Parameters
- Arrays

## Grammar
[Formal EBNF]

## Advanced Patterns
[Key patterns only]
```

### 2. Create `examples.md` (Target: ~200 lines)

Merge and deduplicate:
- `examples.md` (root level)
- `syntax/examples.md`

Focus on practical, copy-paste examples organized by use case.

### 3. Create `conventions.md` (Target: ~400 lines)

Merge these files:
- `conventions/README.md`
- `conventions/common-patterns.md`
- `conventions/workflow-patterns.md`
- `conventions/ai-patterns.md`
- `conventions/combinations.md`

Structure:
```markdown
# Waymark Conventions

## Essential Patterns
- todo, fix, bug
- security markers
- AI agent tasks

## Team Workflows
- Task management
- Code review
- API documentation

## Best Practices
- One waymark per line
- Keep it greppable
- Start simple
```

### 4. Shorten `documentation-integration.md` (Target: ~150 lines)

**New Paradigm**: Position waymarks as JSDoc/docstring enhancement rather than standalone system.

Key message: "Waymarks complement your existing documentation"

Structure:
```markdown
# Waymarks in Documentation

## Core Principle
Waymarks enhance existing doc comments with searchable markers.

## Examples
[Show waymarks inside JSDoc, Python docstrings, etc.]

## Integration Benefits
- Works with all doc generators
- Searchable across languages
- Zero configuration
```

### 5. Files to Delete

- `conventions/domain-specific.md` - Too specialized
- `conventions/typescript.md` - Not waymark-specific
- `guides/progressive-enhancement.md` - Over-engineered
- `syntax/CHANGELOG.md` - Use root CHANGELOG
- `tooling/CHANGELOG.md` - Use root CHANGELOG
- All TypeScript convention files - Not core to waymarks

### 6. Files to Archive

- `what-ifs.md` → `project/archive/`
- `tooling/conventions/` → `project/archive/`
- Old proposals → `project/archive/`

### 7. Files to Keep As-Is

- `guides/quick-start.md` - Good entry point
- `about/priors.md` - Historical context
- `project/` structure - Project management

## Implementation Steps

1. **Create new consolidated files** (syntax.md, conventions.md)
2. **Merge examples** into single file
3. **Rewrite documentation-integration.md** with new paradigm
4. **Move files to archive**
5. **Delete redundant files**
6. **Update all cross-references**
7. **Update root README.md** with new structure

## Success Metrics

- Total line count under 2,000 (from 9,866)
- Maximum 5 files in root docs/ directory
- Each file has single, clear purpose
- New user can understand waymarks in 5 minutes

## Timeline

This can be completed in a single focused session (~2-3 hours).

## Open Questions

1. Should we keep any tooling documentation for v0.1.0?
2. How much detail needed in conventions.md vs examples.md?
3. Should quick-start.md be promoted to root docs/?