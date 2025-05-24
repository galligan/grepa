# Plan: Simplify Repository and Archive Scripting Features

<!-- :ga:tldr Plan to remove all implementation code and focus on specification -->

**Date**: January 2025  
**Status**: Planned  
**Branch**: `archive/scripting-implementation-2025-01`

## Objective

Remove all scripting implementations, TypeScript packages, and tooling from the main repository to focus purely on the grep-anchor specification. All implementation work will be preserved in an archive branch for future reference.

## Rationale

- Reduce complexity for newcomers
- Focus on the core grep-anchor concept
- Allow for fresh implementation approach later
- Maintain clean separation between specification and implementation

## Implementation Plan

### 1. Create Archive Branch

```bash
git checkout -b archive/scripting-implementation-2025-01
git add .
git commit -m "chore: archive scripting implementation before simplification"
git push -u origin archive/scripting-implementation-2025-01
git checkout feat/incremental-rebuild  # return to current branch
```

### 2. Remove Implementation Files

**Directories to delete:**
- `/scripts/` - inventory.js, inventory.py
- `/packages/` - TypeScript monorepo implementation
- `/.grepa/` - Configuration directory (if exists)
- `/Formula/` - Homebrew formula

**Files to delete:**
- `pnpm-workspace.yaml`
- Any `pnpm-lock.yaml` or `package-lock.json`

### 3. Update Documentation

**Files to modify:**
- `README.md`
  - Remove "Generate inventory" section
  - Remove script usage examples
  - Keep ripgrep command examples

- `CLAUDE.md`
  - Remove references to inventory scripts
  - Remove "scripts/" from repository structure
  - Update guidelines to focus on specification

- `llms.txt`
  - Remove "inventory tool" section
  - Keep grep command examples

**Files to delete:**
- `docs/guides/scripting.md`

**Files to check for script references:**
- `docs/examples.md`
- `docs/advanced-patterns.md`
- `docs/whatifs.md`
- All other documentation files

### 4. Simplify package.json

```json
{
  "name": "grepa",
  "version": "0.1.0",
  "description": "Grep-anchor specification for making codebases discoverable",
  "keywords": [
    "grep",
    "grep-anchors",
    "code-navigation",
    "ai-navigation",
    "documentation",
    "developer-tools",
    "ripgrep",
    "code-search"
  ],
  "homepage": "https://github.com/galligan/grepa#readme",
  "bugs": {
    "url": "https://github.com/galligan/grepa/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/galligan/grepa.git"
  },
  "license": "MIT",
  "author": "Matt Galligan",
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 5. Expected Final Structure

```
grepa/
├── docs/
│   ├── about/
│   │   └── priors.md
│   ├── conventions/
│   │   ├── README.md
│   │   ├── ai-patterns.md
│   │   ├── combinations.md
│   │   ├── common-patterns.md
│   │   ├── domain-specific.md
│   │   └── workflow-patterns.md
│   ├── guides/
│   │   ├── custom-anchors.md
│   │   ├── progressive-enhancement.md
│   │   └── quick-start.md        # No scripting.md
│   ├── notation/
│   │   ├── README.md
│   │   ├── examples.md
│   │   ├── format.md
│   │   └── payloads.md
│   ├── project/
│   │   ├── plans/
│   │   │   └── simplify-repository-2025-01.md
│   │   └── specs/
│   │       ├── v0.md
│   │       └── v1.md
│   ├── advanced-patterns.md
│   ├── examples.md
│   └── whatifs.md
├── .gitignore
├── CLAUDE.md
├── LICENSE
├── README.md
├── llms.txt
└── package.json
```

### 6. Git Commit Messages

```bash
# After all changes
git add -A
git commit -m "feat: simplify repository to focus on grep-anchor specification

- Remove all scripting implementations (archived in branch)
- Remove TypeScript packages and build tooling
- Update documentation to remove script references
- Simplify package.json to minimal specification
- Focus on core grep-anchor concept and manual usage

All implementation code preserved in archive/scripting-implementation-2025-01"
```

### 7. Post-Cleanup Tasks

- [ ] Verify all script references removed from docs
- [ ] Update GitHub issues to reflect new direction
- [ ] Consider creating a separate `grepa-tools` repository for implementations
- [ ] Update README to clarify this is a specification, not a tool

## Success Criteria

- Repository contains only specification and documentation
- No executable code or build scripts remain
- Documentation focuses on concept and manual usage
- All work preserved in archive branch
- Clear path forward for future implementations

## Future Considerations

When ready to reimplement tooling:
1. Consider separate repository for tools
2. Start with minimal CLI in Rust or Go
3. Keep specification and implementation separate
4. Use this archive branch as reference

## Notes

- This is a strategic simplification, not abandonment
- Implementation can restart with lessons learned
- Specification remains the core value proposition