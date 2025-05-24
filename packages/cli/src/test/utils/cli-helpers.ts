// :ga:tldr CLI testing utilities and helpers

import { spawn, execSync } from 'child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export class CLITestEnvironment {
  private readonly tempDir: string;

  constructor(prefix: string = 'grepa-cli-test-') {
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

  createFiles(files: Record<string, string>): void {
    for (const [path, content] of Object.entries(files)) {
      this.createFile(path, content);
    }
  }

  get cwd(): string {
    return this.tempDir;
  }

  cleanup(): void {
    if (existsSync(this.tempDir)) {
      rmSync(this.tempDir, { recursive: true, force: true });
    }
  }
}

export interface CLIResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  error?: Error;
}

export async function runCLI(args: string[], cwd?: string): Promise<CLIResult> {
  return new Promise((resolve) => {
    const child = spawn('node', [
      // Assume the CLI is built and available
      join(process.cwd(), 'dist/index.js'),
      ...args
    ], {
      cwd: cwd || process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        exitCode: code || 0,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    child.on('error', (error) => {
      resolve({
        exitCode: 1,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        error
      });
    });
  });
}

export function mockRipgrepOutput(matches: Array<{file: string, line: number, match: string}>): string {
  return matches
    .map(({file, line, match}) => `${file}:${line}:${match}`)
    .join('\n');
}

export function normalizeOutput(output: string): string {
  return output
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

export function stripTimestamp(jsonString: string): string {
  try {
    const obj = JSON.parse(jsonString);
    if (obj.generated) {
      obj.generated = '2024-01-01T00:00:00.000Z';
    }
    return JSON.stringify(obj, null, 2);
  } catch {
    return jsonString;
  }
}