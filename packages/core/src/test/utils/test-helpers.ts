// :ga:tldr Test utilities and helpers for core package tests

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export class TestFileSystem {
  private readonly tempDir: string;

  constructor(prefix: string = 'grepa-test-') {
    this.tempDir = join(tmpdir(), `${prefix}${Date.now()}-${Math.random().toString(36).substring(7)}`);
    mkdirSync(this.tempDir, { recursive: true });
  }

  createFile(relativePath: string, content: string): string {
    const fullPath = join(this.tempDir, relativePath);
    const dir = join(fullPath, '..');
    
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(fullPath, content, 'utf8');
    return fullPath;
  }

  createFiles(files: Record<string, string>): Record<string, string> {
    const createdFiles: Record<string, string> = {};
    
    for (const [path, content] of Object.entries(files)) {
      createdFiles[path] = this.createFile(path, content);
    }
    
    return createdFiles;
  }

  get path(): string {
    return this.tempDir;
  }

  cleanup(): void {
    if (existsSync(this.tempDir)) {
      rmSync(this.tempDir, { recursive: true, force: true });
    }
  }
}

export function createMockConfig(overrides: Record<string, any> = {}) {
  return {
    anchor: ':ga:',
    ignore: {
      respectGitignore: true,
      patterns: {},
      custom: []
    },
    docsExamples: {
      ignore: false,
      include: [],
      exclude: ['codeFences', 'codeBlocks', 'headings', 'inlineCode', 'links', 'blockquotes']
    },
    output: {
      file: '.grepa/inventory.generated.json',
      indent: 2
    },
    display: {
      showSummary: true,
      topTagsCount: 5
    },
    ...overrides
  };
}

export function mockExecSync(output: string, throwError?: Error) {
  const originalExecSync = require('child_process').execSync;
  
  return (command: string, options?: any) => {
    if (throwError) {
      throw throwError;
    }
    return output;
  };
}

export function createRipgrepOutput(matches: Array<{file: string, line: number, match: string}>): string {
  return matches
    .map(({file, line, match}) => `${file}:${line}:${match}`)
    .join('\n');
}

export function sortObjectKeys<T extends Record<string, any>>(obj: T): T {
  const sorted = {} as T;
  Object.keys(obj).sort().forEach(key => {
    sorted[key as keyof T] = obj[key];
  });
  return sorted;
}