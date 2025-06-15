<!-- tldr ::: proposal for waymark map generation creating START_HERE.md files -->
# Waymark Maps: START_HERE.md Generation

> A proposal for auto-generating navigable codebase maps from waymarks

## Overview

The `waymark map` command would scan a codebase's waymarks and generate a `START_HERE.md` file - a living documentation index that serves as the perfect entry point for both AI agents and human developers.

## Problem Statement

When AI agents (or new developers) encounter a codebase, they lack:

1. A clear starting point for understanding the codebase structure
2. Awareness of critical issues, TODOs, and context
3. Knowledge of where AI-delegated tasks exist
4. Understanding of architectural decisions and assumptions

Currently, this requires manual documentation that quickly becomes stale.

## Proposed Solution

A `waymark map` command that generates a structured markdown file from existing waymarks:

```bash
waymark map                    # Generate START_HERE.md
waymark map -o INDEX.md        # Custom output file
waymark map --watch            # Auto-regenerate on changes
```

## Output Format

### START_HERE.md Structure

```markdown
# Codebase Map
Generated: 2024-12-20 14:30:00 | 1,247 waymarks found

## Quick Navigation
- 🎯 [Blockers](#blockers) (3 items)
- 🤖 [Actor Tasks](#actor-tasks) (12 items)
- 🏗️ [Architecture Overview](#architecture-overview)
- ⚠️ [Alerts & Security](#alerts--security) (8 items)
- 🔧 [Active Work](#active-work) (24 todos)
- 🔥 [Performance Hotspots](#performance-hotspots) (7 items)
- 📝 [Notes & Assumptions](#notes--assumptions)
- ♻️ [Deprecated Code](#deprecated-code) (2 items)
- 🚧 [Temporary Code](#temporary-code) (3 items)

## Blockers
<!-- Lines with `!!` signal or context token `p0` -->
- `/src/auth/validate.ts:45` – !!alert ::: p0 sql_injection_risk
- `/src/payments/process.ts:89` – !!alert ::: p0 data_loss_when_amount_gt_999
- `/api/users.ts:123` – !!alert ::: p0 rate_limiting_missing

## Actor Tasks
<!-- Actor-first lines where the first token after ::: is @handle -->
### High Priority
- `/src/api/users.ts:23` – todo ::: @agent p1 implement_user_pagination
- `/src/models/order.ts:67` – fix ::: @agent p1 optimize_n_plus_one_query

### Standard Priority
- `/tests/auth.test.ts:5` – todo ::: @agent p3 add_edge_case_tests
- `/docs/API.md:34` – todo ::: @ai p3 document_webhook_endpoints

## Architecture Overview
<!-- All tldr markers organized by directory -->
```
src/
├── auth/ - handles user authentication and sessions
├── payments/ - payment processing with Stripe API  
├── api/ - REST API endpoints with Express
└── models/ - database models using Prisma

lib/
├── utils/ - shared utility functions
└── constants/ - app-wide constants
```

## Alerts & Security
- `/src/auth/session.ts:23` – !alert ::: session_expiry_24h
- `/src/api/upload.ts:45` – !alert ::: file_size_limit_10mb +security
- `/src/db/query.ts:78` – ?risk ::: parameterized_queries_needed
- `/src/api/auth.ts:12` – always ::: @ai review_for_pii_leaks

## Active Work
### By Assignment
- @alice (4 items)
  - `/src/payments/refund.ts:34` - todo ::: implement refund flow
  
### By Priority
- High (5 items)
- Medium (12 items)
- Low (7 items)

## Notes & Assumptions
<!-- Pure notes (::: with no prefix) -->
- `/src/config.ts:10` - ::: all timestamps stored as UTC
- `/src/models/user.ts:30` - ::: user_ids are UUIDs not integers
- `/src/api/pricing.ts:5` - ::: all amounts in cents not dollars
- `/lib/cache.ts:15` - ::: Redis required for session storage

## Temporary Code
<!-- temp markers -->
⚠️ 3 temporary items found:
- `/src/api/legacy.ts:15` – temp ::: remove_after_v2_migration
- `/src/utils/debug.ts:45` – temp ::: verbose_debug_logging

## Performance Hotspots
<!-- hotpath, mem, io markers -->
- `/src/api/search.ts:45` – !hotpath ::: search_query_inner_loop
- `/src/cache/lru.ts:89` – mem ::: large_buffer_allocation
- `/src/db/export.ts:23` – io ::: synchronous_file_write

## Deprecated Code
<!-- deprecated markers -->
⚠️ 2 deprecated items found:
- `/src/api/v1/users.ts:10` – deprecated ::: use_v2_api_instead
- `/src/utils/old-hash.ts:5` – deprecated ::: migrate_to_argon2

## Recent Changes
<!-- Based on file modification times -->
- `/src/api/orders.ts` - modified 2 hours ago (2 waymarks)
- `/src/auth/login.ts` - modified 1 day ago (5 waymarks)
```

## Command Options

### Basic Options
```bash
waymark map                        # Generate START_HERE.md
waymark map -o CODEBASE.md        # Custom output file
waymark map --format json         # JSON output
waymark map --format yaml         # YAML output
```

### Filtering Options
```bash
waymark map --markers todo,fix    # Only specific marker types
waymark map --is work             # Only work markers (todo, fix, done, etc.)
waymark map --is alert            # Only alert markers (alert, risk, notice, always)
waymark map --signals '!?^'       # Only signalled items (bang, question, caret)
waymark map --tags security       # Only `+security` tagged items
waymark map --actors @alice       # Only Alice's tasks
waymark map --path src/           # Only src directory
```

### Grouping Options
```bash
waymark map --group-by marker     # Group by marker type
waymark map --group-by category   # Group by category (work, alert, info, etc.)
waymark map --group-by directory  # Group by directory (default)
waymark map --group-by assignee   # Group by person
waymark map --group-by priority   # Group by priority
waymark map --group-by tag        # Group by tag
```

### Integration Options
```bash
waymark map --watch              # Auto-regenerate on file changes
waymark map --ci                 # Fail if critical issues found
waymark map --stats              # Include statistics by category
waymark map --context 2          # Include 2 lines of code context
waymark map --include-tombstoned # Include markers with - signal
```

## Use Cases

### 1. AI Agent Onboarding
```bash
# In AI prompt
"First, read START_HERE.md to understand the codebase structure and current tasks"

# AI sees organized map of:
- What needs doing (@agent tasks)
- Critical context (pure notes)
- Active issues (warnings/todos)
```

### 2. Developer Onboarding
New developers immediately see:

- Codebase structure (tldr markers)
- Important assumptions (context notes)
- Current work status (todos/fixes)
- Who to ask (assignments)

### 3. Sprint Planning
```bash
waymark map --markers todo,fix --group-by priority > SPRINT_BACKLOG.md
```

### 4. Architecture Documentation
```bash
waymark map --markers tldr,note --format markdown > ARCHITECTURE.md
```

### 5. CI/CD Integration
```yaml
# .github/workflows/ci.yml
- name: Check Critical Issues
  run: |
    waymark map --ci
    # Fails if any !!alert lines exist
```

### 6. Daily Standups
```bash
waymark map --actors @me --since yesterday > DAILY_UPDATE.md
```

## Implementation Notes

### Performance Considerations

- Cache waymark locations for large codebases
- Incremental updates when possible
- Parallel file scanning

### Format Priorities

1. Human readability first
2. AI parseability second  
3. Tool integration third

### Special Handling

- Ignore tombstoned markers (`-` signal)
- Respect ignored markers (`_` signal) with option to include
- Handle HTML comments in markdown files
- Support multiple comment styles

## Benefits

1. **Always Current**: Generated from actual code, never stale
2. **Zero Maintenance**: No manual documentation updates
3. **AI-Optimized**: Perfect starting point for AI agents
4. **Discoverable**: START_HERE.md is self-explanatory
5. **Flexible**: Filterable, groupable, formattable
6. **Actionable**: Links directly to code locations

## Future Enhancements

1. **Interactive Mode**: Web UI for exploring the map
2. **Diff Mode**: Show what changed since last generation
3. **Graph Visualization**: D3.js visualization of waymark relationships
4. **Integration Plugins**: VS Code, IntelliJ, etc.
5. **Custom Templates**: User-defined map formats
6. **Multi-repo Maps**: Aggregate maps across monorepos

## Conclusion

The `waymark map` command transforms waymarks from simple navigation points into a comprehensive, always-current documentation system. By generating `START_HERE.md`, we create the perfect entry point for anyone - human or AI - to understand and navigate the codebase effectively.

<!-- note ::: this proposal extends waymarks into living documentation -->