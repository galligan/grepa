// :ga:tldr Test fixtures for sample code files with grep-anchors

export const sampleJavaScript = `
// :ga:tldr Main application entry point
function main() {
  // :ga:todo implement error handling
  console.log('Hello world');
  
  // :ga:sec validate user input
  const userInput = process.argv[2];
  
  // :ga:@agent add input validation
  return userInput;
}

// :ga:ctx assumes Node.js environment
export default main;
`;

export const sampleTypeScript = `
interface User {
  id: number;
  // :ga:sec ensure email uniqueness
  email: string;
  // :ga:ctx passwords are hashed with bcrypt
  passwordHash: string;
}

class UserService {
  // :ga:todo implement caching
  async getUser(id: number): Promise<User | null> {
    // :ga:perf optimize database query
    return null;
  }
  
  // :ga:@agent write comprehensive tests
  async createUser(data: Partial<User>): Promise<User> {
    // :ga:sec validate email format
    // :ga:tmp placeholder implementation
    throw new Error('Not implemented');
  }
}
`;

export const sampleMarkdown = `
# Sample Document

<!-- :ga:tldr This is a sample document -->

## Code Examples

\`\`\`javascript
// :ga:example this is inside a code fence
function example() {
  // :ga:todo this should be ignored if ignoreExamples is true
  return true;
}
\`\`\`

Regular text with inline code: \`// :ga:inline inside backticks\`

> Blockquote with anchor
> // :ga:quote inside blockquote

    // :ga:codeblock this is in a code block (4-space indent)
    function indentedCode() {}

## HTML Comments

<!-- :ga:comment this is in an HTML comment -->

Regular paragraph with // :ga:regular not in any special construct.
`;

export const samplePython = `
#!/usr/bin/env python3
# :ga:tldr Python script for data processing

import os
import sys

class DataProcessor:
    # :ga:ctx assumes UTF-8 encoding
    def __init__(self, file_path: str):
        # :ga:sec validate file path
        self.file_path = file_path
        
    def process(self):
        # :ga:todo add progress tracking
        # :ga:perf consider streaming for large files
        with open(self.file_path, 'r') as f:
            # :ga:bug handle encoding errors
            return f.read()

# :ga:@agent optimize error handling
if __name__ == "__main__":
    # :ga:tmp use argparse instead
    processor = DataProcessor(sys.argv[1])
    processor.process()
`;

export const sampleConfig = `
{
  "name": "test-project",
  // :ga:meta configuration file
  "version": "1.0.0",
  "scripts": {
    // :ga:todo add test script
    "build": "tsc"
  },
  "dependencies": {
    // :ga:sec audit dependencies regularly
    "express": "^4.18.0"
  }
}
`;

export const fileFixtures = {
  'src/main.js': sampleJavaScript,
  'src/user.ts': sampleTypeScript,
  'docs/readme.md': sampleMarkdown,
  'scripts/process.py': samplePython,
  'package.json': sampleConfig,
  'empty.txt': '',
  'no-anchors.js': 'console.log("no anchors here");'
};

export const expectedAnchors = {
  'src/main.js': [
    { line: 2, tag: 'tldr', fullMatch: ':ga:tldr' },
    { line: 4, tag: 'todo', fullMatch: ':ga:todo' },
    { line: 7, tag: 'sec', fullMatch: ':ga:sec' },
    { line: 10, tag: '@agent', fullMatch: ':ga:@agent' },
    { line: 14, tag: 'ctx', fullMatch: ':ga:ctx' }
  ],
  'src/user.ts': [
    { line: 4, tag: 'sec', fullMatch: ':ga:sec' },
    { line: 6, tag: 'ctx', fullMatch: ':ga:ctx' },
    { line: 11, tag: 'todo', fullMatch: ':ga:todo' },
    { line: 13, tag: 'perf', fullMatch: ':ga:perf' },
    { line: 17, tag: '@agent', fullMatch: ':ga:@agent' },
    { line: 19, tag: 'sec', fullMatch: ':ga:sec' },
    { line: 20, tag: 'tmp', fullMatch: ':ga:tmp' }
  ],
  'docs/readme.md': [
    { line: 4, tag: 'tldr', fullMatch: ':ga:tldr' },
    { line: 26, tag: 'comment', fullMatch: ':ga:comment' },
    { line: 28, tag: 'regular', fullMatch: ':ga:regular' }
  ],
  'scripts/process.py': [
    { line: 2, tag: 'tldr', fullMatch: ':ga:tldr' },
    { line: 8, tag: 'ctx', fullMatch: ':ga:ctx' },
    { line: 10, tag: 'sec', fullMatch: ':ga:sec' },
    { line: 13, tag: 'todo', fullMatch: ':ga:todo' },
    { line: 14, tag: 'perf', fullMatch: ':ga:perf' },
    { line: 16, tag: 'bug', fullMatch: ':ga:bug' },
    { line: 19, tag: '@agent', fullMatch: ':ga:@agent' },
    { line: 21, tag: 'tmp', fullMatch: ':ga:tmp' }
  ],
  'package.json': [
    { line: 3, tag: 'meta', fullMatch: ':ga:meta' },
    { line: 6, tag: 'todo', fullMatch: ':ga:todo' },
    { line: 10, tag: 'sec', fullMatch: ':ga:sec' }
  ]
};