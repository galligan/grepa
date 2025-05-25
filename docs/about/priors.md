# Historical Priors for `:ga:`-Style Anchors
<!-- :ga:tldr Historical precedents and inspiration for grep-anchor patterns -->
<!-- :ga:docs Analysis of prior art in code annotation systems -->

*Version 0.1 – living document*

---

## 1. Why capture priors?

Open-source projects thrive on conventions that *already worked elsewhere*. Before standardising on `:ga:` it helps to recognise the lineage of comment-level "jump points" that teams have relied on for decades. This section curates those precedents so contributors can understand **why `:ga:` feels familiar** even if the exact sigil is new.

---

## 2. Ancestor patterns

| Era / ecosystem         | Anchor syntax (typical)                        | Purpose                                   | What we borrow                                            |
| ----------------------- | ---------------------------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| **UNIX 1980s**          | `# TODO:`                                      | Human breadcrumb for future work          | Simple greppability (`grep TODO`)                         |
| **C family**            | `// FIXME`, `// XXX`, `// HACK`               | Flag questionable code or bugs            | Single-token severity tags                                |
| **Google / Chromium**   | `// TODO(user):`                               | Ownership metadata in the tag itself      | **Named tokens** (`@cursor` etc.)                         |
| **Xcode / Swift**       | `// MARK:`                                     | Editor jump bar & fold markers            | IDE integration via predictable prefix                    |
| **Go (1.17+)**          | `//go:build <expr>`                            | Build-constraint scanned *before* parsing | Comment parsed by tooling; lives only in source           |
| **Clang-Tidy**          | `// NOLINT(rule)`                              | Linter suppression                        | Machine-auditable anchors affecting CI                    |
| **ESLint / Flake8**     | `// eslint-disable-next-line` / `# noqa: E501` | Scoped rule ignore                        | Release-blocker policies on lingering suppressions        |
| **VS Code 2010s**       | `// region … endregion`                        | Code-folding & outline view               | Multi-line anchors recognised by editors                  |
| **Shopify smart_todo**  | `TODO(sc-12345)`                               | Tracking issue IDs                        | Validation via custom linter — proof teams codify anchors |

---

## 3. Lessons extracted

1. **Fixed prefix beats natural language**
   Tags that begin with an unusual token (`//go:`, `// MARK:`) have a longer half-life than free-text TODOs.
2. **Tooling follows convention**
   Build systems, IDEs, and linters willingly parse *comments* if the pattern is stable. No AST required.
3. **Rot prevention needs CI**
   Clang-Tidy and Flake8 demonstrate that projects eventually automate checks to keep anchors from lingering.
4. **Minimal surface area matters**
   The most successful anchors fit anywhere a comment does—source, config, even SQL.

These insights justify a **single, four-byte sigil** (`:ga:`) and a tiny grammar: fresh enough to stand out, but orthodox enough that every Unix tool and language server can consume it.

---

## 4. What `:ga:` adds to the conversation

* Suggests unifying many patterns under a single token
* Supports structured payloads (JSON, arrays) for richer metadata
* Considers AI agents alongside humans as consumers of code comments

The `:ga:` pattern builds on decades of existing practice, packaging these ideas into a simple, portable approach.

---

## 5. Call for more examples

Have you seen an unusual anchor style in the wild? Open a PR and drop a one-liner reference here. We'll keep expanding this catalogue so the spec's motivation stays transparent.