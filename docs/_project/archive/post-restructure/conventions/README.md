# Waymark Conventions
<!-- ::: tldr Standard patterns and practices for waymarks -->
<!-- ::: convention Central hub for all waymark conventions -->

Patterns and practices for making your codebase AI-navigable and human-friendly using waymarks.

## Quick Start

Begin with these five essential patterns:

1. `::: todo` - Work that needs doing
2. `::: context` - Important assumptions or constraints
3. `::: sec` - Security-critical code
4. `::: @agent` - AI agent instructions
5. `::: temp` - Temporary code to remove

That's it! You can search all of these with `rg ":::"`.

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
Level 0: Try one pattern (::: todo)
   ↓
Level 1: Enhance existing TODOs (TODO :::)
   ↓
Level 2: Add context (::: context)
   ↓
Level 3: Delegate to AI (::: @agent)
   ↓
Level 4: Link to issues (::: issue(123))
   ↓
Level 5: Team-specific patterns
```

## Remember

The goal is **discoverability**, not perfection. Even one `:::` waymark makes your codebase more navigable than none.