# Waymark Conventions
<!-- :M: tldr Standard patterns and practices for waymarks -->
<!-- :M: convention Central hub for all waymark conventions -->

Patterns and practices for making your codebase AI-navigable and human-friendly using waymarks.

## Quick Start

Begin with these five essential patterns:

1. `:M: todo` - Work that needs doing
2. `:M: context` - Important assumptions or constraints
3. `:M: sec` - Security-critical code
4. `:M: @agent` - AI agent instructions
5. `:M: temp` - Temporary code to remove

That's it! You can search all of these with `rg ":M:"`.

## Convention Categories

### [Common Patterns](./common-patterns.md)

Start here. Core patterns that work in any codebase.

### [AI Patterns](./ai-patterns.md)

Patterns for delegating work to AI agents and providing them context.

### [Progressive Enhancement Guide](../guides/progressive-enhancement.md)

How to adopt waymarks incrementally, from simple to advanced.

### [Advanced Patterns](../advanced-patterns.md)

complex metadata and sophisticated workflows.

### [Domain-Specific](./domain-specific.md)

Patterns for specific domains: web, mobile, DevOps, data science.

### [Workflow Patterns](./workflow-patterns.md)

Patterns for code review, deployment, and team processes.

## Core Principles

1. **Start Simple**: Begin with 3-5 patterns, expand as needed
2. **AI-First**: Design patterns that help AI agents navigate and understand
3. **Grepability**: Every pattern must be easily searchable
4. **Flexibility**: Teams should define their own vocabulary
5. **Progressive**: Add complexity only when it provides value

## Adoption Path

```text
Level 0: Try one pattern (:M: todo)
   ↓
Level 1: Enhance existing TODOs (TODO :M:)
   ↓
Level 2: Add context (:M: context)
   ↓
Level 3: Delegate to AI (:M: @agent)
   ↓
Level 4: Link to issues (:M: issue(123))
   ↓
Level 5: Team-specific patterns
```

## Remember

The goal is **discoverability**, not perfection. Even one `:M:` waymark makes your codebase more navigable than none.