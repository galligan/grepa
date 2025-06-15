# AGENTS Waymark Quick-Start (Codex CLI & Web)

<!-- tldr ::: How AI agents should read, write and search waymarks in this repo -->

This repository uses **waymarks** (`:::`) as its universal breadcrumb system.  
Treat every waymark as a structured comment that an LLM can reliably parse and every human can grep.

The **goal**: make navigation, task discovery and context-gathering trivial for agents.

---

## 1 · Anatomy of a Waymark

```text
<comment-leader> [marker] ::: [properties] [free-text note] [+tags]
```

Example

```ts
// todo ::: @alice priority:high implement caching #backend/performance
```

Component recap (see `docs/syntax.md` for the formal grammar):

| Element     | Purpose                                   | Example                         |
|-------------|-------------------------------------------|---------------------------------|
| **marker**  | Quick classifier (_one per line, optional_)| `todo`, `fix`, `alert`, `tldr`  |
| **:::**     | Sigil separating marker from payload       | always exactly three colons     |
| **property**| Key:value pairs for structured metadata    | `priority:high`, `assign:@bob` |
| **note**    | Free-text human explanation                | `implement OAuth flow`          |
| **+tags**   | Hierarchical tags for ad-hoc grouping     | `+security/auth`                |

---

## 2 · Everyday Searches (ripgrep)

Most questions boil down to five core queries—build aliases for them.

```bash
# everything
rg " :::"                       # all waymarks (marker or pure)

# tasks & open work
rg "todo :::"                   # outstanding work

# file summaries
rg "tldr :::" --type md,ts,js    # brief overviews

# security warnings
rg "alert :::" -C2              # context

# show metadata (e.g. priority)
rg -o "priority:[a-z]+" | sort | uniq -c
```

Pro-tip: add `-C3` (or `-n` for line numbers) as needed.

---

## 3 · Writing Guidelines (quick version)

1. **One marker, one concern.**  `// todo :::` *or* `// alert :::`, never both.
2. **Put `tldr :::` at the top** of every significant file/module.
3. **Prefer properties** for structured data (`priority:high`, `assign:@alice`).
4. **Use tags** for broad topics (`+security`, `+frontend/ui`).
5. **Keep notes short.** The surrounding code is the long-form.

Lint yourself:

```bash
# check missing tldr
rg -L "tldr :::" --type ts,js,py

# ensure no TODO without assignee
rg "todo :::" | rg -v "assign:@"
```

---

## 4 · Agent Workflow Cheatsheet

1. **Discover tasks assigned to you**
   ```bash
   rg "todo :::.*@${USER}"          # assumes USER env var matches @handle
   ```
2. **Gather local context** (same file):
   ```bash
   rg -n " :::" path/to/file.ts
   ```
3. **Search globally for similar code / examples**
   ```bash
   rg "tldr :::.*auth" --type ts
   ```
4. **Mark your work** once done:
   ```ts
   // done ::: closes:#456 implemented caching layer
   ```

---

## 5 · Must-Know Prefix Table

| Category        | Prefixes                                       |
|-----------------|------------------------------------------------|
| **Tasks**       | `todo`, `fix`, `done`, `spike`, `review`, `chore` |
| **Lifecycle**   | `draft`, `cleanup`, `hold`, `deprecated`, `remove` |
| **Alerts**      | `warn`, `crit`, `unsafe`, `temp`, `audit`         |
| **Information** | `tldr`, `note`, `docs`, `example`, `summary`      |
| **Meta**        | `ai`, `hack`, `test`, `idea`                      |

Use them exactly as documented in `docs/conventions.md` & `docs/syntax.md`—no ad-hoc inventing without updating those docs.

---

💡  **Remember:** A good waymark answers **“Why is this line interesting?”** in as few characters as possible while staying grep-friendly.
