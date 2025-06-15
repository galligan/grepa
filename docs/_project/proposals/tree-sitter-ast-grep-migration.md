<!-- tldr ::: Replace custom parser & formatter with Tree-sitter + ast-grep for language-aware parsing, faster queries and safer rewrites -->

# Proposal: Adopt Tree-sitter + ast-grep for Waymark Parsing & Formatting

## Status

| Date       | State | Owner |
|------------|-------|-------|
| 2025-06-15 | Draft | @mg   |

## Context

Waymarks (`:::`) are currently processed by a **home-grown parser and a set of ad-hoc formatters** that rely on multi-language regular expressions.  
This stack has carried us so far, but it presents recurring pain points:

- Hard to keep language-specific regexes in sync.  
- False positives when the delimiter appears inside strings or template literals.  
- Whole-file rescans are slow on large diffs.  
- Adding a new language (e.g. Go) requires bespoke parsing logic.  
- Refactor tools (rename, auto-fix) are brittle because they operate on text, not an AST.

The open-source ecosystem now offers two mature tools that solve those exact problems:

1. **Tree-sitter** – an incremental concrete-syntax-tree parser with first-class support in most editors.  
2. **ast-grep** – a CLI / library that uses Tree-sitter ASTs for structural search, lint and code-mod across ≈25 languages.

## Decision

Replace the custom parser and formatter pipeline with **Tree-sitter + ast-grep**, rolled out in two phases:

1. **Read-only Phase (Lint)** – Use ast-grep rules to *detect* waymarks and enforce style in CI.
2. **Write Phase (Rewrite + Format)** – Gradually port formatting logic to ast-grep rewrite rules or a dedicated formatter plugin powered by the CST.

The legacy parser will remain behind a feature flag during migration and be deleted once parity is reached.

## Rationale

1. **Language awareness** – Queries operate on real comment nodes, never strings, eliminating false positives.
2. **Speed** – Incremental parsing means CI checks scale with changed lines rather than file size.
3. **Cross-language coverage** – One rule file works for TS, JS, Python, Rust, etc.; new languages are “grammar drop-ins”.
4. **Safer rewrites** – Structural replacements avoid breaking code formatting or syntax.
5. **Ecosystem wins** – Out-of-the-box editor support (VS Code, Neovim, JetBrains) provides outline, folding and hover for free.

## Scope

In scope:

- Parsing and validating waymark comments across all first-class languages in the monorepo.
- CI lint rules that surface errors (e.g. `todo :::` without `assign:@`).
- Command-line search/replace workflows for core maintainers.

Out of scope (for now):

- Deep semantic validation of `properties` (JSON-Schema-level checks).
- Automatic migration of legacy anchors (`:ga:`) – handled by existing scripts.

## Migration Plan

Phase 0 – **Spike (1 day)**
- Prototype an ast-grep rule that lists all `todo :::` missing `assign:@` across TS/JS/Py.
- Measure runtime and compare false-positive rate to current parser.

Phase 1 – **Foundations (2 days)**
- Install `tree-sitter-cli` & `ast-grep` as dev dependencies.  
- Add baseline grammars to `tools/grammars/` and wire up a simple rule set under `tools/ast-grep/`.
- Hook `npm run lint:waymarks` into pre-commit.

Phase 2 – **Rule Parity (1 week)**
- Port existing lint checks to ast-grep YAML rules.  
- Deactivate equivalent checks in the legacy parser.

Phase 3 – **Formatter Port (2–3 weeks, incremental)**
- Identify high-impact rewrites (e.g. property ordering, whitespace fixes).  
- Implement ast-grep rewrite templates.  
- Delete unused formatter modules as parity is achieved.

Phase 4 – **Cleanup (1 day)**
- Remove feature flags.  
- Archive legacy parser/formatter code.

## Success Metrics

- 🚀 **Performance** – Waymark lint step runs ≤ 50 ms per changed file (currently ~300 ms).
- 🔍 **Accuracy** – Zero false positives in benchmark suite; ≥ 95 % reduction in false negatives.
- 🛠️ **Maintenance** – Net LOC of tooling drops by ≥ 40 %.  
- 🧩 **Language Expansion** – Add Go grammar in <30 min as a proof point.

## Alternatives Considered

1. **Keep regex-based parser but optimise patterns** – marginal gains, doesn’t fix fundamental correctness issues.
2. **Write a bespoke multi-language PEG grammar** – reinventing Tree-sitter with higher maintenance cost.
3. **Use Prettier/dprint plug-ins only** – great at formatting but lack the structural search & rewrite capabilities we need.

## Risks & Mitigations

- **Grammar drift** – Upstream grammar updates may break rules.  
  ‑ Pin grammar revisions and update on a schedule.
- **Learning curve** – Team unfamiliar with S-expression queries.  
  ‑ Add cheatsheet to `docs/tooling/ast-grep.md` and run an internal workshop.
- **Partial parity during migration** – Some checks may be temporarily duplicated.  
  ‑ Gate new rules behind CI flag until validated.

## Timeline

| Week | Milestone                             |
|------|---------------------------------------|
| 0    | Prototype spike merged                |
| 1    | Foundations in main; CI lint passes   |
| 2-3  | Rule parity reached                   |
| 4-6  | Formatter port & legacy removal       |

## Open Questions

1. Do we want full grammar injection that tokenises `marker`, `props`, `tags` separately or stick to comment-level matching first?
2. Should we expose ast-grep as a public API in the `@waymark/parser` package or keep it as an internal dev-tool?

## Appendix

Example ast-grep rule listing TODOs without assignee:

```yaml
rule:
  message: "TODO missing assignee"
  pattern: "// todo ::: !@(*assign:@*)"
  severity: warning
  languages: [typescript, javascript, python]
```
