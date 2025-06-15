<!-- tldr ::: Detailed file-by-file migration map for docs reorganization -->
# Documentation Migration Map

This document tracks the exact movement of every file from the current structure to the new organized structure.

## Waymarks for Migration

### Existing File Template

All existing files should be updated to use this structure:

```markdown
<!-- tldr ::: [Rewrite tldr to be based on the current TLDR standards] -->
<!-- todo ::: @agent ensure this document is up to date with the latest syntax and conventions -->

[Existing content]

```

### Stub File Template

All new files should be created as drafts with this structure:

```markdown
<!-- tldr ::: [Brief description of what this document will contain] -->
<!-- stub ::: Document pending completion -->
<!-- todo ::: @agent complete this document -->
# [Document Title]

[Content to be added]
```

Example for a new file:
```markdown
<!-- tldr ::: Parser library documentation and API reference -->
<!-- stub ::: Document pending completion -->
<!-- todo ::: @agent complete this document -->
# Waymark Parser

Documentation coming soon.
```

## File Migration Table

### Root Level Files

| Current Location | New Location | Action | Notes |
|-----------------|--------------|--------|-------|
| `/docs/README.md` | `/docs/README.md` | Update content | New navigation-focused content |
| `/docs/syntax.md` | `/docs/syntax/README.md` | Move & expand | Becomes syntax overview |
| `/docs/conventions.md` | `/docs/usage/patterns/conventions.md` | Move | Merge with patterns |
| `/docs/examples.md` | `/docs/usage/patterns/examples.md` | Move | Integrate with patterns |
| `/docs/waymarks-in-documentation.md` | `/docs/usage/patterns/documentation-patterns.md` | Move & rename | |
| `/docs/docs-reorg.md` | `/docs/_project/decisions/2025-06-docs-reorg.md` | Move to decisions | Historical record |

### Quick Start & Guides

| Current Location | New Location | Action | Notes |
|-----------------|--------------|--------|-------|
| `/docs/guides/quick-start.md` | `/docs/quick-start.md` | Move up | Top-level for visibility |
| `/docs/guides/search-patterns.md` | `/docs/usage/search/ripgrep-patterns.md` | Move & rename | Better organization |

### About Section

| Current Location | New Location | Action | Notes |
|-----------------|--------------|--------|-------|
| `/docs/about/priors.md` | `/docs/_project/research/priors.md` | Move to project | Internal research |

### Syntax Directory

| Current Location | New Location | Action | Notes |
|-----------------|--------------|--------|-------|
| `/docs/syntax/advanced/multi-line-waymarks.md` | `/docs/syntax/features/multi-line-syntax.md` | Move & rename | Feature-based org |

### Tooling Directory

| Current Location | New Location | Action | Notes |
|-----------------|--------------|--------|-------|
| `/docs/tooling/CLI.md` | `/docs/tooling/cli/README.md` | Move & nest | |
| `/docs/tooling/cli-design.md` | `/docs/tooling/cli/design.md` | Move & nest | |
| `/docs/tooling/cli-implementation-spec.md` | `/docs/tooling/cli/implementation-spec.md` | Move & nest | |
| `/docs/tooling/API.md` | `/docs/tooling/parser/API.md` | Move | Parser API docs |
| `/docs/tooling/ROADMAP.md` | `/docs/ROADMAP.md` | Move up | Project-wide roadmap |
| `/docs/tooling/release.md` | `/docs/_project/release-process.md` | Move to project | Internal process |

### Project Directory (all moves to _project)

| Current Location | New Location | Action | Notes |
|-----------------|--------------|--------|-------|
| `/docs/project/LANGUAGE.md` | `/docs/_project/LANGUAGE.md` | Move | |
| `/docs/project/HANDOFF-DOCUMENTATION-OVERHAUL.md` | `/docs/_project/decisions/2025-06-docs-overhaul.md` | Move & rename | |
| `/docs/project/proposals/*.md` | `/docs/_project/proposals/*.md` | Move all | Keep same names |
| `/docs/project/logs/*.md` | `/docs/_project/logs/*.md` | Move all | Session logs |

### Archive Content (selective migration)

| Current Location | New Location | Action | Notes |
|-----------------|--------------|--------|-------|
| `/docs/project/archive/post-restructure/syntax/SPEC.md` | `/docs/syntax/SPEC.md` | Restore | Full specification |
| `/docs/project/archive/post-restructure/syntax/CHANGELOG.md` | `/docs/syntax/CHANGELOG.md` | Restore | Version history |
| `/docs/project/archive/post-restructure/conventions/*.md` | `/docs/usage/patterns/*.md` | Selective restore | Review each for relevance |
| `/docs/project/archive/*.md` | `/docs/_project/archive/*.md` | Move | Historical reference |
| `/docs/project/rewrite/*.old` | **DELETE** | Remove | Outdated versions |

## New Files to Create

### Syntax Features

- `/docs/syntax/features/delimiter-syntax.md` - Extract from syntax.md
- `/docs/syntax/features/signal-syntax.md` - Extract from syntax.md  
- `/docs/syntax/features/context-syntax.md` - Extract from syntax.md
- `/docs/syntax/features/star-signal-ci.md` - **CREATED** Star signal for PR-scoped work tracking
- `/docs/syntax/features/tldr.md` - Extract TLDR section from syntax-evolution-2025.md

### Usage Organization

- `/docs/usage/README.md` - Usage overview
- `/docs/usage/search/README.md` - Search overview
- `/docs/usage/migration/README.md` - Migration guides overview
- `/docs/usage/migration/v0-to-v1.md` - Version migration guide

### Tooling Stubs

- `/docs/tooling/README.md` - Tooling overview
- `/docs/tooling/parser/README.md` - Parser documentation
- `/docs/tooling/linter/README.md` - Linter documentation
- `/docs/tooling/ide-plugins/README.md` - Plugin overview
- `/docs/tooling/ide-plugins/vscode.md` - VS Code extension
- `/docs/tooling/ide-plugins/vim.md` - Vim plugin
- `/docs/tooling/CHANGELOG.md` - Tooling version history

### Project Management

- `/docs/_project/README.md` - Explains _project purpose
- `/docs/_project/decisions/README.md` - Decision index
- `/docs/_project/decisions/adrs/0001-core-sigil.md` - Extract from proposals
- `/docs/_project/decisions/adrs/0002-contextual-signals.md` - From syntax evolution

## Content Consolidation Plan

### 1. Patterns Consolidation
Merge these files into cohesive pattern guides:

- `conventions.md` + `examples.md` → `common-patterns.md`
- Archive patterns → Review and integrate relevant content
- Create domain-specific pattern files as needed

### 2. Syntax Extraction
From `syntax.md`, extract into feature files:

- Delimiter rules → `delimiter-syntax.md`
- Signal system → `signal-syntax.md`
- Properties/tags → `context-syntax.md`
- Keep core concepts in `syntax/README.md`

### 3. Decision Tracking
Convert key proposals to decision records:

- `syntax-evolution-2025.md` → ADR for v1.0 syntax
- `documentation-simplification.md` → Decision record
- Other accepted proposals → Lightweight decisions

## Migration Steps

### Phase 1: Structure Creation

1. Create all new directories
2. Add README.md files to each directory
3. Configure site builder exclusions for `_project/`

### Phase 2: File Movement

1. Move files according to migration table
2. Update all internal links
3. Delete `.old` files from rewrite directory

### Phase 3: Content Creation

1. Extract syntax features from main syntax.md
2. Create new overview/index files
3. Write missing tool documentation stubs

### Phase 4: Content Review

1. Review archived patterns for integration
2. Consolidate duplicate content
3. Ensure consistent waymark usage

### Phase 5: Validation

1. Run link checker
2. Verify _project exclusion
3. Test documentation build
4. Update root README.md navigation

## Notes

- All waymarks in documentation should use HTML comments: `<!-- marker ::: description -->`
- The `_project/` directory is visible on GitHub but excluded from the docs site
- Maintain redirects for moved pages to prevent broken external links
- Consider creating a `MOVED.md` file in old locations pointing to new paths