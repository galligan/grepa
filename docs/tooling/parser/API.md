# Waymark API Reference
<!-- tldr ::: API reference documentation for @waymark/core library -->

## Installation

```bash
npm install @waymark/core
# or
pnpm add @waymark/core
```

## Core Modules

### Waymark Parser

Parser for waymark syntax (`prefix ::: content`).

```typescript
import { WaymarkParser } from '@waymark/core';
```

#### Parser Methods

##### `parse(content: string, filename?: string): ParseResult`

Parse content for waymarks (legacy sync method).

```typescript
const result = WaymarkParser.parse(fileContent, 'example.ts');
console.log(result.anchors); // Array of waymark objects
console.log(result.errors);  // Array of ParseError objects
```

##### `parseWithResult(content: string, filename?: string): Result<ParseResult>`

Parse content using Result pattern for better error handling.

```typescript
const result = WaymarkParser.parseWithResult(fileContent);
if (result.ok) {
  console.log(result.data.anchors);
} else {
  console.error(result.error);
}
```

##### `findByContext(anchors: Waymark[], context: string): Waymark[]`

Find waymarks containing a specific context.

```typescript
const todoWaymarks = WaymarkParser.findByContext(anchors, 'todo');
```

### WaymarkSearch

Search functionality for finding waymarks across files.

```typescript
import { WaymarkSearch } from '@waymark/core';
```

#### Search Methods

##### `search(patterns: string[], options?: SearchOptions): SearchResult[]`

Search files for waymarks (legacy sync method).

```typescript
const results = WaymarkSearch.search(['src/**/*.ts'], {
  contexts: ['todo', 'security'],
  context: 2,
  recursive: true
});
```

##### `searchWithResult(patterns: string[], options?: SearchOptions): Promise<Result<SearchResult[]>>`

Search with Result pattern and async support.

```typescript
const result = await WaymarkSearch.searchWithResult(['src/'], {
  contexts: ['todo']
});

if (result.ok) {
  result.data.forEach(item => {
    console.log(`${item.anchor.file}:${item.anchor.line}`);
    console.log(item.anchor.contexts);
  });
}
```

##### `getUniqueContexts(results: SearchResult[]): string[]`

Extract all unique contexts from search results.

```typescript
const contexts = WaymarkSearch.getUniqueContexts(results);
// ['todo', 'security', 'api', ...]
```

##### `groupByContext(results: SearchResult[]): Record<string, SearchResult[]>`

Group search results by context.

```typescript
const grouped = WaymarkSearch.groupByContext(results);
console.log(grouped.todo);     // All results with 'todo' context
console.log(grouped.security); // All results with 'security' context
```

## Types

### Waymark

```typescript
interface Waymark {
  line: number;        // Line number (1-indexed)
  column: number;      // Column number (1-indexed)
  raw: string;         // Original line content
  contexts: string[];  // Array of contexts
  prose?: string;      // Optional prose description
  file?: string;       // File path (if provided)
}
```

### SearchOptions

```typescript
interface SearchOptions {
  contexts?: string[];    // Filter by specific contexts
  context?: number;       // Number of context lines
  recursive?: boolean;    // Search recursively
  files?: string[];       // Filter by file patterns
  exclude?: string[];     // Exclude file patterns
}
```

### SearchResult

```typescript
interface SearchResult {
  anchor: Waymark;
  context?: {
    before: string[];
    after: string[];
  };
}
```

### Result<T, E>

```typescript
type Result<T, E = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E };
```

## Error Handling

### AppError

All errors follow a consistent structure:

```typescript
interface AppError {
  code: ErrorCode;
  message: string;
  statusCode?: number;
  cause?: unknown;
}
```

### Error Codes

Common error codes:

- `file.notFound` - File or directory not found
- `file.readError` - Cannot read file
- `file.tooLarge` - File exceeds size limit
- `parse.invalidSyntax` - Invalid waymark syntax
- `parse.missingSpace` - Missing space before :::
- `parse.emptyPayload` - Empty context payload
- `search.noResults` - No waymarks found
- `cli.missingArgument` - Missing required argument

## CLI Programmatic Usage

```typescript
import { CLI } from '@waymark/core';

const cli = new CLI();
await cli.run(); // Parses process.argv
```

## Examples

### Basic Parsing

```typescript
import { WaymarkParser } from '@waymark/core';

const code = `
  // ::: implement validation
  function validate(input: string) {
    // :::
    return input;
  }
`;

const result = WaymarkParser.parseWithResult(code);
if (result.ok) {
  console.log(`Found ${result.data.anchors.length} waymarks`);
}
```

### Search with Context

```typescript
import { WaymarkSearch } from '@waymark/core';

const result = await WaymarkSearch.searchWithResult(['src/'], {
  contexts: ['security'],
  context: 3
});

if (result.ok) {
  result.data.forEach(item => {
    console.log(`\n${item.anchor.file}:${item.anchor.line}`);
    console.log('Before:', item.context?.before.join('\n'));
    console.log('>>> ' + item.anchor.raw);
    console.log('After:', item.context?.after.join('\n'));
  });
}
```

### Error Handling Example

```typescript
import { WaymarkSearch, isAppError } from '@waymark/core';

const result = await WaymarkSearch.searchWithResult(['missing-dir/']);

if (!result.ok) {
  switch (result.error.code) {
    case 'file.notFound':
      console.error('Directory not found');
      break;
    case 'search.noResults':
      console.log('No waymarks found');
      break;
    default:
      console.error(`Error: ${result.error.message}`);
  }
}
```