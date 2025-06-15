<!-- tldr ::: Documentation hub for waymark syntax and conventions -->
# Waymark Documentation

Welcome to the waymark documentation. Start here to learn about waymarks - a universal pattern for making codebases searchable and AI-navigable.

## Quick Links

- **[Quick Start Guide](./quick-start.md)** - Get started in 5 minutes
- **[Syntax Reference](./syntax/README.md)** - Complete waymark syntax specification
- **[Common Patterns](./usage/patterns/common-patterns.md)** - Real-world usage patterns and best practices
- **[Search Guide](./usage/search/ripgrep-patterns.md)** - Finding waymarks with ripgrep

## What are Waymarks?

Waymarks are searchable markers in code comments using the `:::` sigil:

```javascript
// todo ::: implement validation
// alert ::: check user permissions +security
// ::: assumes UTC timestamps
```

Search them instantly:
```bash
rg ":::"          # Find all waymarks
rg "todo :::"     # Find all todos
rg "\+security"   # Find security concerns
```

## Documentation Structure

### Core Documentation

- **[Syntax](./syntax/README.md)** - The `:::` sigil, markers, properties, and tags
- **[Common Patterns](./usage/patterns/common-patterns.md)** - Essential patterns and best practices
- **[Tooling](./tooling/README.md)** - CLI, parser, and IDE integrations

### Internal Documentation

- **[Project Docs](./_project/README.md)** - Internal documentation (proposals, decisions, research)

## Key Concepts

### The `:::` Sigil

The canonical waymark sigil, optionally preceded by a marker:

```python
# todo ::: implement error handling
#      ^^^
#      └── Sigil separates marker from content
```

### Marker Categories

Waymarks use markers to classify code locations (~41 total in 8 categories):

- **Work**: `todo`, `fix`, `done`, `review`, `refactor`, `needs`, `blocked`
- **State**: `temp`, `deprecated`, `draft`, `stub`, `cleanup`
- **Alert**: `alert`, `risk`, `notice`, `always`
- **Info**: `tldr`, `note`, `summary`, `example`, `idea`, `about`, `docs`
- **Quality**: `test`, `audit`, `check`, `lint`, `ci`
- **Performance**: `perf`, `hotpath`, `mem`, `io`
- **Security**: `sec`, `auth`, `crypto`, `a11y`
- **Meta**: `flag`, `important`, `hack`, `legal`, `must`, `assert`

Plus signals (`!todo`, `*fix`), properties (`priority:high`), tags (`+security`), and @mentions (`@alice`).

### Search Patterns

Find waymarks with ripgrep:

```bash
# Basic searches
rg "todo :::"              # All todos
rg ":::.*@alice"           # Alice's assignments
rg ":::.*priority:high"    # High priority items
rg "\+security"            # Security tag

# With context
rg -C2 "alert :::"         # Alerts with 2 lines context
rg -B3 -A3 "todo :::"      # Todos with surrounding code
```

## Getting Started

1. **Add your first waymark**:
   ```javascript
   // todo ::: add input validation
   function processUser(data) {
     return data; 
   }
   ```

2. **Search for it**:
   ```bash
   rg "todo :::"
   # => example.js:1:// todo ::: add input validation
   ```

3. **Learn patterns** in the [Quick Start Guide](./quick-start.md)

## Philosophy

- **Start simple** - One waymark is better than none
- **Progressive adoption** - Add complexity only when needed
- **Tool-agnostic** - Works with grep, ripgrep, or any search tool
- **Language-agnostic** - Same pattern works everywhere
- **AI-friendly** - Optimized for LLM navigation

## Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

Remember: The goal is discoverability. Well-placed waymarks serve as breadcrumbs through your code.