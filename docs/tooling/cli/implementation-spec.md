# Waymark CLI Implementation Specification

<!-- ::: tldr Technical specification for implementing the waymark CLI with ripgrep integration -->

This document provides the technical specification for implementing the waymark CLI as designed in [cli-design.md](./cli-design.md).

## Architecture Overview

```
waymark (CLI entry)
├── commands/
│   ├── find.ts      # Core search command
│   ├── task.ts      # Task category command
│   ├── info.ts      # Info category command
│   ├── alert.ts     # Alert category command
│   └── tldr.ts      # TLDR special command
├── core/
│   ├── ripgrep.ts   # Ripgrep wrapper
│   ├── parser.ts    # Waymark syntax parser
│   ├── config.ts    # Configuration loader
│   └── filter.ts    # Filter engine
├── formatters/
│   ├── standard.ts  # Default output
│   ├── json.ts      # JSON formatter
│   ├── csv.ts       # CSV formatter
│   └── tree.ts      # Tree formatter
└── utils/
    ├── context.ts   # Context extraction
    └── git.ts       # Git integration
```

## Core Components

### 1. Ripgrep Integration

The CLI should wrap ripgrep for all file searching operations.

```typescript
interface RipgrepOptions {
  pattern?: string;
  globs: string[];
  fileTypes: string[];
  excludeTypes: string[];
  paths: string[];
  contextBefore?: number;
  contextAfter?: number;
  ignoreCase?: boolean;
  wordMatch?: boolean;
}

class RipgrepWrapper {
  execute(options: RipgrepOptions): AsyncIterator<RipgrepMatch>;
  version(): string;
  validateInstallation(): boolean;
}
```

**Implementation Notes:**
- Spawn ripgrep as subprocess
- Stream results for large codebases
- Cache ripgrep location on first run
- Respect `.gitignore` and `.waymarkignore`

### 2. Waymark Parser

Parse waymark syntax from ripgrep matches.

```typescript
interface WaymarkData {
  file: string;
  line: number;
  column: number;
  raw: string;
  prefix?: string;
  properties: Record<string, string>;
  tags: string[];
  note: string;
  mentions: string[];
}

class WaymarkParser {
  parse(line: string): WaymarkData | null;
  extractContext(match: RipgrepMatch): WaymarkContext;
}
```

**Parsing Rules:**
1. Identify `:::` sigil
2. Extract prefix (if present) - everything before `:::` after last space
3. Parse properties as `key:value` pairs
4. Extract hashtags as `#word` patterns
5. Extract mentions as `@word` patterns
6. Remaining text is the note

### 3. Filter Engine

Apply waymark-specific filters after ripgrep.

```typescript
interface FilterCriteria {
  prefixes?: { include: string[], exclude: string[] };
  tags?: { include: string[], exclude: string[] };
  properties?: { has: string[], not: string[] };
  mentions?: string[];
}

class FilterEngine {
  constructor(private config: Config);
  
  match(waymark: WaymarkData, criteria: FilterCriteria): boolean;
  expandShortcuts(criteria: FilterCriteria): FilterCriteria;
}
```

**Filter Logic:**
- Shortcuts expand before filtering
- All conditions must match (AND)
- Within a category, any can match (OR)
- Support regex patterns where sensible

### 4. Configuration System

Load and merge configuration from multiple sources.

```typescript
interface Config {
  defaults: {
    context: number;
    exclude: string[];
    type: string[];
  };
  shortcuts: Record<string, string>;
  aliases: Record<string, string>;
  format: {
    useColor: boolean;
    useIcons: boolean;
    dateFormat: 'relative' | 'iso' | 'local';
  };
}

class ConfigLoader {
  load(): Config;
  private loadFile(path: string): Partial<Config>;
  private merge(...configs: Partial<Config>[]): Config;
  private expandVariables(config: Config): Config;
}
```

**Config Loading Order:**
1. Built-in defaults
2. Global config (`~/.config/waymark/config.json`)
3. Project config (`.waymark/config.json`)
4. Local config (`.waymark/config.local.json`)

**Variable Expansion:**
- `{user}` → Current git user or system user
- `{date}` → Current date
- `{project}` → Project name from package.json or directory

### 5. Command Structure

Each command follows a standard interface.

```typescript
interface Command {
  name: string;
  description: string;
  options: CommandOption[];
  
  execute(args: ParsedArgs): Promise<void>;
  validateArgs(args: ParsedArgs): ValidationResult;
}

interface ParsedArgs {
  pattern?: string;
  flags: Record<string, any>;
  positional: string[];
}
```

### 6. Category Commands Implementation

Category commands have special formatting requirements.

#### Task Command
```typescript
class TaskCommand implements Command {
  private readonly prefixes = ['todo', 'fix', 'done', 'wip', 'review', 'spike'];
  
  async execute(args: ParsedArgs) {
    // 1. Run ripgrep for all task prefixes
    // 2. Parse waymarks
    // 3. Group by status
    // 4. Format with symbols (✓, ○, ◐)
    // 5. Show statistics if requested
  }
}
```

#### Info Command
```typescript
class InfoCommand implements Command {
  private readonly prefixes = ['note', 'docs', 'why', 'see', 'example', 'tldr'];
  
  async execute(args: ParsedArgs) {
    // 1. Run ripgrep for info prefixes
    // 2. Parse waymarks
    // 3. Group by file/directory
    // 4. Format as documentation
  }
}
```

#### TLDR Command
```typescript
class TldrCommand implements Command {
  async execute(args: ParsedArgs) {
    // 1. Find all tldr waymarks
    // 2. Build file tree structure
    // 3. Sort by requested order
    // 4. Format as tree or flat list
    // 5. Align descriptions
  }
  
  private buildTree(waymarks: WaymarkData[]): TreeNode;
  private formatTree(tree: TreeNode, indent: number): string;
}
```

## Output Formatters

### Standard Formatter
```typescript
class StandardFormatter {
  format(waymark: WaymarkData, options: FormatOptions): string {
    // file:line: prefix ::: content #tags
    return `${waymark.file}:${waymark.line}: ${waymark.prefix} ::: ${waymark.note} ${waymark.tags.map(t => `#${t}`).join(' ')}`;
  }
}
```

### JSON Formatter
```typescript
class JsonFormatter {
  format(results: WaymarkData[], query: QueryInfo): string {
    return JSON.stringify({
      version: "1.0",
      generated: new Date().toISOString(),
      query: query.pattern,
      count: results.length,
      results: results.map(this.transformWaymark)
    }, null, options.pretty ? 2 : 0);
  }
}
```

### Tree Formatter
```typescript
class TreeFormatter {
  format(items: Array<{path: string, description: string}>): string {
    // Build tree structure
    // Use box-drawing characters
    // Align descriptions with dots
  }
}
```

## Special Features

### Context Extraction (`--near`, `--related`)

```typescript
class ContextExtractor {
  async findNearbyWaymarks(
    waymark: WaymarkData, 
    distance: number = 5
  ): Promise<WaymarkData[]>;
  
  async findRelatedWaymarks(
    waymark: WaymarkData
  ): Promise<WaymarkData[]> {
    // Use language-specific heuristics:
    // - Same function/method
    // - Same class
    // - Same module
  }
}
```

### Git Integration

```typescript
class GitIntegration {
  async resolveTimeRef(ref: string): Promise<Date>;
  async getFilesSince(date: Date): Promise<string[]>;
  async getCurrentUser(): Promise<string>;
}
```

Time references:
- `yesterday`, `today`, `1 week ago`
- `@{upstream}` → merge base with upstream
- ISO dates
- Git commit refs

## Performance Considerations

1. **Streaming**: Process ripgrep output as it arrives
2. **Pagination**: Limit results by default (e.g., 1000)
3. **Caching**: Cache config files and ripgrep location
4. **Parallelism**: Run multiple ripgrep instances for OR queries
5. **Early termination**: Stop on `--max-results`

## Error Handling

```typescript
enum ErrorCode {
  RIPGREP_NOT_FOUND = 1,
  INVALID_PATTERN = 2,
  NO_RESULTS = 3,
  CONFIG_ERROR = 4,
  INVALID_TIME_REF = 5,
}

class WaymarkError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public hint?: string
  );
}
```

## Testing Strategy

1. **Unit Tests**:
   - Parser: Test all waymark syntax variations
   - Filter: Test filter logic and shortcuts
   - Config: Test merging and variable expansion

2. **Integration Tests**:
   - Create test repositories with known waymarks
   - Test all commands with various flag combinations
   - Test config precedence

3. **Performance Tests**:
   - Large repository handling (10k+ files)
   - Streaming performance
   - Memory usage monitoring

## Implementation Phases

### Phase 1: Core Foundation
- Ripgrep wrapper
- Basic waymark parser
- `find` command with basic filters
- Standard output formatter

### Phase 2: Configuration & Shortcuts
- Config loading system
- Shortcut expansion
- Alias support
- JSON/CSV formatters

### Phase 3: Category Commands
- `task` command with custom formatting
- `info` command with tree view
- `alert` command with grouping
- `tldr` command with alignment

### Phase 4: Advanced Features
- `--near` and `--related` context
- Git time references
- Performance optimizations
- Editor integrations

## Dependencies

```json
{
  "dependencies": {
    "commander": "^11.0.0",      // CLI framework
    "chalk": "^5.0.0",           // Terminal colors
    "strip-ansi": "^7.0.0",      // Strip ANSI codes
    "which": "^3.0.0"            // Find ripgrep
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",          // Testing
    "memfs": "^4.0.0"            // In-memory FS for tests
  }
}
```

## Platform Considerations

- **Cross-platform paths**: Use Node.js path module
- **Shell escaping**: Properly escape arguments for ripgrep
- **Color support**: Detect terminal capabilities
- **Unicode**: Handle emoji in formatters correctly

## Future Extensions

1. **Language Server Protocol**: For `--related` intelligence
2. **Watch Mode**: Monitor files for waymark changes
3. **Web UI**: Serve JSON via HTTP
4. **Editor Plugins**: VS Code, Vim, Emacs
5. **Git Hooks**: Validate waymarks pre-commit