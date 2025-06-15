# Grepa Brainstorm – Search & Authoring Ergonomics
<!-- ::: fixme, refactor this uses old patterns -->
This document is a free-form brain-dump generated during an interactive brainstorming session.  It captures **every** idea that arose while imagining life inside a large codebase saturated with Grepa anchors.

> Goal: identify tweaks or additions that make writing **and** querying anchors faster, more predictable, and more semantic.

---

## 1 · Real-world Queries I Run Daily

| Use-case | Shell snippet |
|----------|---------------|
| “Open TODOs that are P0/P1” | `rg ':ga:todo' | rg ':ga:priority:(critical|high)'` |
| “Where is *auth-service* referenced as a dependency?” | `rg ':ga:rel(depends:auth-service'` |
| “Everything blocking release” | `rg ':ga:blocked(by:' | rg -v ':ga:status:resolved'` |
| “Mentions of feature flag *checkout-redesign*” | `rg ':ga:feature-flag\(checkout-redesign'` |
| “Anchors near me (±50 lines)” | `grepa nearby 50` |

Pain points encountered:

* Multi-line anchors break one-liner grep.
* Dense anchors (10+ markers) make regex brittle.
* Synonyms/aliases (`perf` vs `performance`) cause misses.

---

## 2 · Making Multi-line Anchors Grep-Friendly

### 2-a Repeat `:ga:` on Continuation Lines

```html
<!-- :ga:
  :ga:todo,
  :ga:priority:high,
  :ga:blocked(by:issue:4)
  fix auth bug
-->
```

Pros: single-line greps still hit; visually obvious.  Cons: 5 extra chars per line.

### 2-b Closing Sentinel

```html
<!-- :ga:
  todo,
  priority:high,
  blocked(by:issue:4)
;ga -->
```

Search range becomes `awk '/:ga:/{flag=1} /;ga/{flag=0} flag'`.

---

## 3 · Prefix Ergonomics (`:ga:`)

* **Editor/CLI shorthand** – author types `@todo`, formatter expands to canonical `:ga:todo`.
* **One-byte alias** – optional `:g:` prefix for speed; configurable linter rule.

---

## 4 · Arrays & Parameter Lists

* Comma performs double duty (marker separator **and** array separator) → ambiguous.
* Idea **4-a**: use semicolon inside arrays → `[item1;item2]`.
* Idea **4-b**: named arrays → `blocked(by:issues[4,7])`.

---

## 5 · Synonyms / Aliases

* **Index-time expansion** – `grepa index` canonicalises synonyms for search.
* **Explicit canonical marker** – e.g. `canon:performance` beside `perf`.

---

## 6 · Tiny Query DSL

```
grepa find todo & priority:high & !status:closed
grepa find rel(depends:auth-service) --json
```

Compiles to ripgrep, shields users from grammar churn.

---

## 7 · Authoring Helpers

* VS Code / JetBrains snippets that expand shorthand to full anchors.
* Lint-on-save for malformed markers; auto-convert long single-line → multi-line.
* Refactor-rename across repo (`priority:urgent` → `priority:critical`).

---

## 8 · Owner / Mentions Syntax

Current: `owner@alice` · Proposed: `owner:@alice` or `owner(@alice)` – keeps delimiter policy consistent and easy to grep (`':ga:owner:'`).

---

## 9 · Escaping Tweaks

* Back-tick graves for *raw* strings: `:ga:regex(`^\w+$`)`.
* Triple-quotes for multi-line literal payloads.

---

## 10 · `rel()` vs Dedicated Relationship Markers

* Option A – keep both: verbs are sugar over generic `rel()`.
* Option B – choose one lane (prefer explicit verbs for human clarity).

---

## 11 · YAML Literal Block Form

```html
<!-- :ga-yaml:
todo: true
priority: high
blocked:
  - issue:4
  - approval:@alice
owner: @bob
-->
```

Perfectly machine-readable; easy on human eyes.

---

## 12 · Indexing & Performance

* `grepa daemon` builds watchman-style index for sub-second queries.
* LSP server exposes anchors as *symbols* for jump-to-anchor.

---

## 13 · Matrix Selectors (Version / Environment)

```text
:ga:scope(os:[linux,mac],arch:[x86_64,arm64])
```

Keyed arrays make grepping by dimension (`os:mac`) trivial.

---

## 14 · Terminology Consistency

* **Anchor** = entire comment block.
* **Marker** = individual key/value inside an anchor.

---

## 15 · Quick Wins (Low Churn)

1. Echo `:ga:` on continuation lines.
2. Change `owner@alice` → `owner:@alice`.
3. Decide on `rel()` **vs** explicit verbs.
4. Ship minimal `grepa find` wrapper around ripgrep.
5. Provide editor snippet pack (`gd` → `:ga:todo`).

---

### Next Steps

Pick any quick win above and spike an implementation, or continue brainstorming!
