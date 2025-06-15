<!-- tldr ::: documentation reorganization plan adopting Living RFC layout with internal/_private docs -->
# Documentation Re-organisation Plan

<!-- !note ::: this file is a working blueprint – update as tasks complete -->

## 1. Objectives

- Streamline onboarding: newcomers grok Waymark in < 5 min.
- Keep the language spec pristine and isolated from tooling docs.
- Preserve rich internal history (proposals, research, ADRs) **inside** the repo without publishing them.
- Make future growth (plugins, integrations, examples) additive—not a re-shuffle.

## 2. Target Directory Layout

```text
/docs
├─ README.md              # Docs overview and navigation
├─ quick-start.md         # 5-minute intro to waymarks
├─ ROADMAP.md             # Project roadmap (high-level view)
│
├─ syntax/                # Pure language spec
│   ├─ README.md          # Syntax overview
│   ├─ SPEC.md            # Full specification with EBNF
│   ├─ CHANGELOG.md       # Syntax version history
│   └─ features/          # Syntax feature deep-dives
│       ├─ delimiter-syntax.md    # : @ # + semantics
│       ├─ signal-syntax.md       # ! ? - _ * modifiers
│       ├─ context-syntax.md      # Properties and values
│       ├─ star-signal-ci.md      # Star signal for PR-scoped work
│       └─ tldr.md                # TLDR best practices and guidelines
│
├─ usage/                 # How to use waymarks
│   ├─ README.md          # Usage overview
│   ├─ patterns/          # Common usage patterns
│   │   ├─ common-patterns.md
│   │   ├─ ai-patterns.md
│   │   ├─ workflow-patterns.md
│   │   └─ domain-specific.md
│   ├─ search/            # Finding waymarks
│   │   ├─ README.md      # Search overview
│   │   └─ ripgrep-patterns.md
│   ├─ migration/         # Version migration
│   │   ├─ README.md
│   │   ├─ v0-to-v1.md
│   │   └─ migration-scripts.md
│   └─ progressive-enhancement.md
│
├─ tooling/               # Tools and integrations
│   ├─ README.md          # Tooling overview
│   ├─ cli/               # Command-line interface
│   │   ├─ README.md
│   │   └─ ci-integration.md
│   ├─ parser/            # Parser library
│   │   └─ README.md
│   ├─ linter/            # Linter rules
│   │   └─ README.md
│   ├─ ide-plugins/       # Editor integrations
│   │   ├─ README.md
│   │   ├─ vscode.md
│   │   └─ vim.md
│   └─ CHANGELOG.md       # Tooling version history
│
└─ _project/              # Project management (GitHub only)
    ├─ README.md          # Explains _project purpose
    ├─ LANGUAGE.md        # How to write about waymark
    ├─ decisions/         # All decision records
    │   ├─ README.md      # Decision index
    │   ├─ ADRs/          # Major architectural decisions
    │   │   ├─ 0001-core-sigil.md
    │   │   └─ 0002-contextual-signals.md
    │   ├─ 2024-12-remove-tilde.md
    │   └─ 2025-06-unified-docs.md
    ├─ proposals/         # Active proposals and RFCs
    │   ├─ syntax-evolution-2025.md
    │   └─ syntax-emoji.md
    ├─ research/          # Experiments and benchmarks
    └─ archive/           # Historical documents
```

<!-- note ::: `_project/` stays in GitHub but excluded from docs website -->
<!-- todo ::: verify static-site config ignores `_project/**` -->

## 3. Project Documentation Standards

### Rules for project documentation

<!-- important ::: Project docs are in GitHub repo but not on public docs website -->

- **Place project material under `docs/_project/`**
  - Visible in GitHub repository for transparency
  - Excluded from documentation website build
  - Clear separation of user docs vs project management
  
- **Decision tracking**
  - `decisions/README.md` indexes all decisions (lightweight + ADRs)
  - Major decisions go in `decisions/ADRs/` with numbers
  - Minor decisions go directly in `decisions/` with dates
  - All decisions get waymark summaries
  
- **Proposal lifecycle**
  - Draft proposals in `proposals/`
  - Accepted proposals become decisions
  - Rejected proposals move to `archive/`
  
- **Security considerations**
  - Never store secrets/PII in markdown
  - Review before moving from _project to public docs
  - Remember: still visible on public GitHub
  
- **Access control**
  - CODEOWNERS on `_project/**`
  - Requires maintainer review for changes
  - GitHub visibility ensures transparency

### Front-matter template

```markdown
---
title: "Remove Tilde Signal"
status: draft        # draft | accepted | rejected | deprecated
authors: [mg, alice]
created: 2024-06-12
waymark_version: "1.0"
breaking_change: true
superseded_by: 0007-contextual-signals.md   # optional
private: true
---
<!-- tldr ::: Proposal to remove tilde (~) signal in favor of contextual markers -->
```

## 4. Document Templates

### Existing File Updates

All existing files should be updated with proper waymarks:

```markdown
<!-- tldr ::: [Rewrite tldr to be specific and searchable per TLDR standards] -->
<!-- todo ::: @agent ensure this document is up to date with the latest syntax and conventions -->

[Existing content]
```

### New File Stubs

All new files should be created as drafts with this structure:

```markdown
<!-- tldr ::: [Brief description of what this document will contain] -->
<!-- stub ::: Document pending completion -->
<!-- todo ::: @agent complete this document -->
# [Document Title]

[Content to be added]
```

## 5. Migration Checklist

### Phase 1: Structure setup

- Create new folder structure
- Add site-builder configuration with ignore patterns:
  ```yaml
  # mkdocs.yml or docusaurus.config.js
  exclude:
    - 'docs/_project/**'
  ```
- Add CODEOWNERS entry:
  ```
  docs/_project/** @waymark-maintainers
  ```

### Phase 2: Content migration

- Move existing docs to appropriate directories:
  - `syntax.md` → `syntax/README.md`
  - `project/*` → `_project/` (entire directory)
  - `AGENTS.md` → `usage/patterns/ai-patterns.md` (merge with existing)
  - `conventions/*` → `usage/patterns/`
  - `guides/quick-start.md` → `docs/quick-start.md`
  - `guides/*` → `usage/` (other guides)
- Create nested README.md files for each directory
- Create top-level docs files:
  - `docs/README.md` for documentation overview
  - `docs/ROADMAP.md` for project roadmap
- Update all cross-references and links
- Ensure `llms.txt` remains at root for discoverability

### Phase 3: Quality assurance

- Add CI safeguard to fail if build artifact includes `_project`
- Verify all waymark examples use v1.0 syntax
- Update root README.md quick-links to new paths
- Run link checker to catch broken references

### Phase 4: Tooling integration

- Configure auto-generation of marker reference from EBNF
- Set up redirect rules for moved pages
- Add search configuration to exclude _project

## 6. Implementation Phases

### Phase 1: Foundation (Week 1)

- Folder scaffolding and site-builder config
- Basic ignore patterns and CODEOWNERS

### Phase 2: Migration (Week 2)  

- Move public docs to new structure
- Consolidate usage documentation
- Migrate project docs to _project

### Phase 3: Enforcement (Week 3)

- CI checks and build safeguards
- Automated tests for structure
- Documentation linting rules

### Phase 4: Polish (Week 4)

- Auto-generation tooling
- Search optimization
- Launch v1.0 documentation

## 7. Decisions Made

### Static site generator
**Decision**: Use MkDocs with Material theme

- **Rationale**: 
  - Aligns with waymark's simplicity philosophy
  - Excellent search capabilities
  - Easy `_project` exclusion
  - Minimal configuration

### Decision records structure
**Decision**: Unified decision tracking

- All decisions tracked in `_project/decisions/`
- `decisions/README.md` provides index and links to all decisions
- Major architectural decisions in `decisions/ADRs/` (numbered)
- Minor decisions directly in `decisions/` (dated)
- **Rationale**: Single source of truth for all project decisions

### Auto-generation strategy
**Decision**: Generate marker reference from source of truth

- **Source**: EBNF grammar + marker definitions in syntax spec
- **Output**: Searchable reference pages with examples
- **Update**: On every syntax version change

## 8. Additional Considerations

### Visibility Distinction

- **GitHub Repository**: All content including `_project/` is visible
- **Documentation Site**: Only public docs folders are published
- **Benefits**: 
  - Transparency for contributors
  - History preservation
  - No hidden decision-making

### Search and Discovery

- **Root files stay put**: `README.md`, `llms.txt`, `CLAUDE.md` remain at root
- **Quick reference**: Consider a `QUICK_REFERENCE.md` at root with common patterns
- **AI-optimized**: Ensure all docs have clear `tldr :::` waymarks

### Version Management

- **Syntax versions**: Track in `syntax/CHANGELOG.md`
- **Tooling versions**: Track in `tooling/CHANGELOG.md`
- **Migration guides**: One per major version change

### Community Docs

- **Contributing**: Keep `CONTRIBUTING.md` at root
- **Code of Conduct**: Standard location at root
- **Templates**: Issue and PR templates in `.github/`

---

### Sample `_project/README.md`

```markdown
<!-- tldr ::: Project management docs visible on GitHub but excluded from docs site -->
# Project Documentation

This directory contains project management documentation that is:
- ✅ Visible in the GitHub repository (transparency)
- ❌ Excluded from the published documentation website
- 📝 Subject to maintainer review

## Contents

- `LANGUAGE.md` - Guidelines for writing about waymark
- `decisions.md` - Index of all project decisions
- `decisions/` - Decision records (lightweight + ADRs)
- `proposals/` - Active proposals and RFCs  
- `research/` - Experiments and benchmarks
- `archive/` - Historical documents

## Why Separate?

Project management docs are essential for contributors but would clutter
the user-facing documentation site. They remain in GitHub for:
- Decision transparency
- Historical context
- Contributor onboarding
- Proposal discussions
```

### Additional Patterns to Consider

Based on these organizational patterns, we should also consider:

1. **Nested README pattern**: Each directory gets its own README.md for better navigation
2. **Feature-based organization**: `syntax/features/` groups related syntax concepts
3. **Tool-specific subdirs**: Each tool gets its own directory with room to grow
4. **Search as first-class**: `usage/search/` recognizes search is critical to waymarks
5. **Migration as category**: `usage/migration/` for version transitions

### Sample `_project/decisions/README.md`

```markdown
<!-- tldr ::: Index of all waymark project decisions (lightweight + ADRs) -->
# Project Decisions

This document indexes all project decisions, both lightweight and architectural.

## Architectural Decision Records (ADRs)

Major decisions that affect the core architecture:

- [ADR-0001: Core Sigil Choice](./decisions/ADRs/0001-core-sigil.md) - Why we chose `:::`
- [ADR-0002: Contextual Signals](./decisions/ADRs/0002-contextual-signals.md) - Signal interpretation system

## Lightweight Decisions

Smaller decisions and clarifications:

### 2025
- [Unified Documentation Structure](./decisions/2025-06-unified-docs.md) - Consolidating usage docs
- [Project vs Internal Naming](./decisions/2025-06-project-naming.md) - Why `_project` not `_internal`

### 2024
- [Remove Tilde Signal](./decisions/2024-12-remove-tilde.md) - Simplifying signal system
- [Direct Actor Pattern](./decisions/2024-12-direct-actors.md) - Eliminating assign:@

## Decision Process

1. **Proposals** start in `proposals/`
2. **Accepted** proposals become decisions
3. **Major** architectural decisions → `decisions/ADRs/` (numbered)
4. **Minor** decisions → `decisions/` (dated)
5. **Rejected** proposals → `archive/`
```

### Sample `docs/README.md`

```markdown
<!-- tldr ::: Waymark documentation overview and navigation guide -->
# Waymark Documentation

Welcome to the waymark documentation! This guide helps you navigate our docs.

## Documentation Structure

### [Syntax](./syntax/)
The waymark syntax specification - start here to understand the language.

### [Usage](./usage/)  
Practical guides for using waymarks in your codebase.

### [Tooling](./tooling/)
CLI tools, editor plugins, and integrations.

## Quick Links

- [5-Minute Quick Start](./quick-start.md)
- [Common Patterns](./usage/patterns/common-patterns.md)
- [Syntax Reference](./syntax/SPEC.md)
- [Search Patterns](./usage/search/ripgrep-patterns.md)
- [Roadmap](./ROADMAP.md)

## Contributing

See our [Contributing Guide](/CONTRIBUTING.md) and browse the 
[project documentation](_project/) on GitHub.
```

---

<!-- todo ::: @mg review and update based on current project state -->
<!-- note ::: last updated after v1.0 syntax finalization -->

Made with :heart: by the Waymark docs-gardeners.
