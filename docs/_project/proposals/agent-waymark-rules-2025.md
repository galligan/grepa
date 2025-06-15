<!-- tldr ::: Proposal to formalise waymark rules for AI agents (April-June 2025) -->

# Proposal: Standard Waymark Rules for AI Agents (Q2 2025)

## Status

| Date     | State  | Owner     |
|----------|--------|-----------|
|2025-06-13| Draft  | @mg       |

## Context

Waymarks (`:::`) have replaced our early `:ga:` “grep-anchors” across documentation and new code.  While humans have adopted the syntax organically, **AI agents (Codex CLI, web chatbots, Cursor/Windsurf extensions)** still need a concise, machine-readable rule-set to:

1. Write consistent waymarks when generating/modifying code.  
2. Search and interpret existing waymarks during navigation, summarisation, and task discovery.

Existing docs (`docs/syntax.md`, `docs/conventions.md`) are thorough but verbose.  Agents benefit from a distilled reference.

## Decision

1. Create a single **Cursor/Windsurf rule file** (`.cursor/rules/waymarks.md`) that always loads in the IDE.  It covers:
   * Writing conventions (prefix list, file-header rule).  
   * Ripgrep search recipes.
   * Lint/CI suggestions.

2. Add a root-level **`AGENTS.md`** which acts as the canonical quick-start for Codex CLI and web chat agents.

3. Enforce these rules going forward (pre-commit, CI, editor snippets). Legacy anchors (`:ga:`) will be migrated opportunistically.

## Rationale

* **Succinctness** – Agents need <2 pages to internalise the system. The long-form docs remain for humans.  
* **Discoverability** – Placing the rule file under `.cursor/rules/` ensures Cursor & Windsurf auto-apply highlighting and tool-tips.  
* **Single Source of Truth** – `AGENTS.md` will be referenced by other repos that embed Waymark.  
* **Future-proofing** – The rule file reflects _current_ prefixes; new prefixes (e.g. `hot`) will be proposed separately to avoid churn.

## Detailed Design

### File: `.cursor/rules/waymarks.md`

* YAML front-matter (`description`, `alwaysApply`).
* Sections: Writing Conventions → Search & Navigation → CI/Lint → Migration.
* Examples use TypeScript, Python and Bash.

### File: `AGENTS.md`

* “Anatomy of a waymark” table.
* Top 5 ripgrep commands every agent needs.  
* 5-point writing checklist.  
* Workflow cheat-sheet (discover → gather context → implement → close).  
* Prefix table identical to `docs/syntax.md`.

## Alternatives Considered

1. **Embed directives in existing docs** – too verbose for quick ingestion.  
2. **Generate rule files per language** – unnecessary; the syntax is comment-style agnostic.

## Roll-out Plan

1. Merge the two new docs.
2. Update pre-commit hooks to flag missing `tldr :::` headers.
3. Notify devs & AI platform maintainers.
4. Incrementally migrate legacy anchors.

## Open Questions

* Should we formalise a JSON Schema for properties to enable IDE validation?
* Do we need dedicated prefixes for performance hot-paths or will `#performance` suffice for now?

## Appendix

Example enforcement script snippet:

```bash
#!/usr/bin/env bash
# fail-on-missing-tldr.sh

set -euo pipefail

missing=$(rg -L "tldr :::" --type ts,js,py | wc -l)
if (( missing > 0 )); then
  echo "❌  $missing files missing 'tldr :::' header"
  exit 1
fi

echo "✅  All files have a tldr header"
```
