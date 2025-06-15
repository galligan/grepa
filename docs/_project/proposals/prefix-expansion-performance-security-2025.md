<!-- tldr ::: Proposal to introduce focused performance & security prefixes (hot, perf, mem, io, sec, inv, lint) -->

# Proposal: Limited Prefix Expansion – Performance & Security (Q3 2025)

## Status

| Date       | State   | Owner          |
|------------|---------|----------------|
| 2025-06-13 | Draft   | @mg            |

## Problem Statement

The current waymark vocabulary (see `docs/syntax.md`) covers tasks (`todo`, `fix`), alerts (`warn`, `crit`), lifecycle (`draft`, `cleanup`) and documentation (`tldr`, `note`).  
However, two high-value dimensions remain *buried* in free-form hashtags:

1. **Performance-critical paths** – hot loops, memory hotspots, I/O chokepoints.  
2. **Security-critical sections** – crypto, auth checks, data sanitisation.

Agents often need to *instantly* isolate these slices.  Grepping for hashtags like `#performance` or `#security` works, but signal-to-noise is lower: hashtags appear on **any** prefix, including general TODOs. A small, dedicated prefix set would enable:

* Zero-false-positive discovery (`rg "hot :::"`).
* Clear visual flags during code review.
* Simple CI rules (e.g., “no unreviewed changes in `sec :::` blocks”).

## Goals

* ***Minimal*** expansion – avoid prefix bloat; each new prefix must earn its slot.  
* Orthogonal semantics – new prefixes should not overlap existing ones.  
* Backwards compatibility – hashtags remain valid; migration is incremental.

## Proposed Prefixes

| Prefix | Category        | Use-case / Reasoning                                       | Example |
|--------|-----------------|-----------------------------------------------------------|---------|
| `hot`  | Performance     | Tight-loop / request-path hot spots where µs matter.      | `// hot ::: reason:inner_loop freq:1M/s` |
| `mem`  | Performance     | High-allocation or memory-bound code.                    | `// mem ::: large buffer reuse` |
| `io`   | Performance     | Disk / network latency or throughput sensitive code.     | `// io ::: synchronous FS call` |
| `sec`  | Security        | Security-sensitive operations (authz, crypto, PII).      | `// sec ::: constant-time compare` |
| `inv`  | Correctness     | Invariants that *must* hold; violation is UB/bug.        | `// inv ::: assumes sorted input` |
| `lint` | Meta            | Intentional linter rule overrides or suppressions.       | `// lint ::: eslint-disable-next-line` |

### Notes

* **`hot` vs `perf`?**  We choose `hot` to unambiguously flag the *critical* subset; `perf` as a prefix would be too broad and overlap with general performance TODOs.
* **Security severity** – `sec` is orthogonal to `warn`/`crit`.(E.g. `crit :::` could still be used for severity.)
* **Invariants** – distinct from `note :::`; agents can auto-generate unit tests from `inv :::` declarations.

## Prefix Budget & Governance

* Hard cap: **≤ 50** prefixes total. Current count: 35 ⇒ room for +15. This proposal adds **6**, leaving headroom.
* Any future prefix must:  
  1. Solve a grep-only discoverability problem.  
  2. Not be expressible as a property or hashtag.  
  3. Be approved via doc update + team consensus.

## Migration Strategy

1. **Opt-in** – developers start adding new prefixes in fresh code.  
2. **Heuristic lint** – CI warns if a line contains `#performance` *and* matches regex `loop|iterate|alloc`, suggesting `hot`/`mem`.  
3. **Bulk migrations** – optional search-and-replace for legacy markers:
   ```bash
   rg "#performance" --type ts | rg "for|while" | sed -e 's/#performance/hot :::/'
   ```

## Impact on Tooling

* **Parser** – already supports arbitrary prefix tokens; no change.  
* **Formatter/CLI** – add new prefix group “Performance”.  
* **IDE rules** – update `.cursor/rules/waymarks.md` once the prefixes are ratified.

## Alternatives Considered

| Option | Drawback |
|--------|----------|
| Keep using hashtags (`#performance`) | Higher noise, regex false positives, cannot express structured properties like `freq:` easily. |
| Use properties (`type:hot`) on existing prefixes | Requires another prefix (e.g., `note ::: type:hot`), breaking single-responsibility rule. |
| Prefix per micro-category (`latency`, `alloc`, `cpu`) | Prefix explosion; less intuitive. |

## Backwards Compatibility

Existing `#performance` and `#security` hashtags remain valid.  Agents should treat new prefixes as *stronger* signals; absence of them does not imply absence of performance/security relevance.

## Open Questions

1. Do we need both `mem` *and* `io`, or a single `res` (resource) prefix with a `kind:` property?  
2. Should we deprecate `warn :::` for security and use `sec :::` exclusively?  
3. Is `inv` too niche, or can it unlock automated runtime checks?  

## Next Steps

1. Gather feedback from dev team + tooling maintainers.
2. If accepted, update `docs/syntax.md` tables and `.cursor/rules/waymarks.md`.
3. Ship ESLint/TS-lint rule to forbid `#performance` without an accompanying `hot`/`mem`/`io` prefix.
