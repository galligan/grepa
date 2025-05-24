// :ga:tldr Ripgrep wrapper for scanning grep-anchors in codebases

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import type { 
  AnchorMatch, 
  AnchorPattern, 
  ScanOptions 
} from '../types/index.js';
import { 
  createFilePath, 
  createLineNumber, 
  createTagName 
} from '../types/index.js';

export class RipgrepError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly stderr?: string
  ) {
    super(message);
    this.name = 'RipgrepError';
  }
}

export class RipgrepScanner {
  private readonly cwd: string;

  constructor(cwd: string = process.cwd()) {
    this.cwd = cwd;
  }

  async scan(options: ScanOptions): Promise<readonly AnchorMatch[]> {
    const args = this.buildRipgrepArgs(options);
    const command = args.join(' ');

    try {
      const output = execSync(command, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
        cwd: this.cwd,
        timeout: 10000 // 10 second timeout
      });

      if (!output.trim()) {
        return [];
      }

      return this.parseRipgrepOutput(output, options.anchor);
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 1) {
        // No matches found
        return [];
      }
      
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new RipgrepError(
          'ripgrep (rg) is not installed or not in PATH. Install from: https://github.com/BurntSushi/ripgrep'
        );
      }

      throw new RipgrepError(
        `Ripgrep execution failed: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error && 'status' in error ? error.status as number : undefined
      );
    }
  }

  private buildRipgrepArgs(options: ScanOptions): string[] {
    const args = [
      'rg',
      '-n',
      '-o',
      `${options.anchor}[^\\s]*`,
      '--no-heading',
      '-g', '!.git/'
    ];

    // Add gitignore support
    if (options.respectGitignore) {
      const gitignorePath = join(this.cwd, '.gitignore');
      if (existsSync(gitignorePath)) {
        args.push('--ignore-file', `"${gitignorePath}"`);
      }
    }

    // Add ignore patterns
    for (const pattern of options.ignorePatterns) {
      args.push('-g', `"!${pattern}"`);
    }

    return args;
  }

  private parseRipgrepOutput(output: string, anchor: AnchorPattern): readonly AnchorMatch[] {
    const lines = output.trim().split('\n');
    const matches: AnchorMatch[] = [];

    for (const line of lines) {
      const match = line.match(/^(.+?):(\d+):(.+)$/);
      if (!match) continue;

      const [, filename, lineNum, fullMatch] = match;
      if (!filename || !lineNum || !fullMatch) continue;
      
      // Extract the tag from the full match
      const tagMatch = fullMatch.match(new RegExp(`${anchor}([^\\s,\\]\\}]+)`));
      if (!tagMatch || !tagMatch[1]) continue;

      matches.push({
        file: createFilePath(filename),
        line: createLineNumber(parseInt(lineNum, 10)),
        tag: createTagName(tagMatch[1]),
        fullMatch
      });
    }

    return matches;
  }
}