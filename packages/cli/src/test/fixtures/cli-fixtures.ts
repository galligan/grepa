// :ga:tldr CLI test fixtures and sample data

export const sampleProject = {
  'src/main.ts': `
// :ga:tldr Main application entry point
export function main() {
  // :ga:todo implement CLI argument parsing
  console.log('Hello, grepa!');
}

// :ga:sec ensure proper error handling
main();
`,
  'src/utils.ts': `
// :ga:perf optimize this function
export function processData(data: string[]): string[] {
  // :ga:@agent add input validation
  return data.filter(Boolean);
}

// :ga:tmp remove after refactor
export const legacy = true;
`,
  'docs/README.md': `
# Test Project

<!-- :ga:tldr Sample project documentation -->

## Usage

\`\`\`typescript
// :ga:example should be ignored with --ignore-examples
function example() {}
\`\`\`

<!-- :ga:docs needs more examples -->
`,
  '.gitignore': `node_modules/
*.log
dist/
.env
`,
  'package.json': `{
  "name": "test-project",
  "version": "1.0.0"
}`
};

export const expectedOutput = {
  summary: `Grep-anchor inventory summary
==============================

Anchor pattern: :ga:
Generated: 2024-01-01T00:00:00.000Z

Total anchors: 6
Unique tags: 6
Files with anchors: 3

Top tags:
  tldr            1 uses in 1 file(s)
  todo            1 uses in 1 file(s)
  sec             1 uses in 1 file(s)
  perf            1 uses in 1 file(s)
  @agent          1 uses in 1 file(s)
  tmp             1 uses in 1 file(s)

Top files:
    2 anchors  src/utils.ts
    2 anchors  src/main.ts
    1 anchors  docs/README.md`,
  
  compact: `Anchors: 6, Tags: 6, Files: 3

Top tags:
  tldr: 1 (1 files)
  todo: 1 (1 files)
  sec: 1 (1 files)
  perf: 1 (1 files)
  @agent: 1 (1 files)`
};

export const sampleConfig = {
  anchor: ':ga:',
  ignore: {
    respectGitignore: true,
    patterns: {
      test: {
        globs: ['*.test.ts', '*.spec.ts'],
        active: false
      }
    },
    custom: []
  },
  docsExamples: {
    ignore: false,
    include: [],
    exclude: ['codeFences', 'codeBlocks']
  },
  output: {
    file: '.grepa/inventory.generated.json',
    indent: 2
  },
  display: {
    showSummary: true,
    topTagsCount: 5
  }
};