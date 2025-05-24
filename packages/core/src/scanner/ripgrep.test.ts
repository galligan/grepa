// :ga:tldr Tests for ripgrep wrapper and scanning functionality

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RipgrepScanner, RipgrepError } from './ripgrep.js';
import { TestFileSystem, createRipgrepOutput, createMockConfig } from '../test/utils/test-helpers.js';
import { fileFixtures } from '../test/fixtures/sample-files.js';
import { createAnchorPattern } from '../types/index.js';
import * as childProcess from 'child_process';

// Mock child_process module
vi.mock('child_process');

describe('RipgrepScanner', () => {
  let testFs: TestFileSystem;
  let scanner: RipgrepScanner;
  let execSyncMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    testFs = new TestFileSystem('ripgrep-test-');
    scanner = new RipgrepScanner(testFs.path);
    execSyncMock = vi.mocked(childProcess.execSync);
  });

  afterEach(() => {
    testFs.cleanup();
    vi.clearAllMocks();
  });

  describe('scan', () => {
    it('should return empty array when no matches found', async () => {
      execSyncMock.mockReturnValue('');
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      const result = await scanner.scan(options);
      
      expect(result).toEqual([]);
    });

    it('should parse ripgrep output correctly', async () => {
      const output = createRipgrepOutput([
        { file: 'src/test.js', line: 10, match: ':ga:todo implement feature' },
        { file: 'src/test.js', line: 20, match: ':ga:sec validate input' },
        { file: 'docs/readme.md', line: 5, match: ':ga:@agent write tests' }
      ]);
      
      execSyncMock.mockReturnValue(output);
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      const result = await scanner.scan(options);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        file: 'src/test.js',
        line: 10,
        tag: 'todo',
        fullMatch: ':ga:todo implement feature'
      });
      expect(result[1]).toEqual({
        file: 'src/test.js',
        line: 20,
        tag: 'sec',
        fullMatch: ':ga:sec validate input'
      });
      expect(result[2]).toEqual({
        file: 'docs/readme.md',
        line: 5,
        tag: '@agent',
        fullMatch: ':ga:@agent write tests'
      });
    });

    it('should handle custom anchor patterns', async () => {
      const output = createRipgrepOutput([
        { file: 'src/test.js', line: 10, match: ':custom:todo task' }
      ]);
      
      execSyncMock.mockReturnValue(output);
      
      const options = {
        anchor: createAnchorPattern(':custom:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      const result = await scanner.scan(options);
      
      expect(result).toHaveLength(1);
      expect(result[0]?.tag).toBe('todo');
      expect(result[0]?.fullMatch).toBe(':custom:todo task');
    });

    it('should include ignore patterns in ripgrep command', async () => {
      execSyncMock.mockReturnValue('');
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: ['*.test.js', 'node_modules/**'],
        ignoreExamples: false,
        respectGitignore: true
      };

      await scanner.scan(options);
      
      const command = execSyncMock.mock.calls[0]?.[0] as string;
      expect(command).toContain('-g "!*.test.js"');
      expect(command).toContain('-g "!node_modules/**"');
    });

    it('should include gitignore when respectGitignore is true', async () => {
      // Create a .gitignore file
      testFs.createFile('.gitignore', 'node_modules/\n*.log\n');
      
      execSyncMock.mockReturnValue('');
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      await scanner.scan(options);
      
      const command = execSyncMock.mock.calls[0]?.[0] as string;
      expect(command).toContain('--ignore-file');
    });

    it('should not include gitignore when respectGitignore is false', async () => {
      execSyncMock.mockReturnValue('');
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: false
      };

      await scanner.scan(options);
      
      const command = execSyncMock.mock.calls[0]?.[0] as string;
      expect(command).not.toContain('--ignore-file');
    });

    it('should handle ripgrep not found error', async () => {
      const error = new Error('Command not found') as any;
      error.code = 'ENOENT';
      execSyncMock.mockImplementation(() => {
        throw error;
      });
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      await expect(scanner.scan(options)).rejects.toThrow(RipgrepError);
      await expect(scanner.scan(options)).rejects.toThrow(/ripgrep.*not installed/);
    });

    it('should handle ripgrep no matches (exit code 1)', async () => {
      const error = new Error('No matches') as any;
      error.status = 1;
      execSyncMock.mockImplementation(() => {
        throw error;
      });
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      const result = await scanner.scan(options);
      
      expect(result).toEqual([]);
    });

    it('should handle other ripgrep errors', async () => {
      const error = new Error('Some other error') as any;
      error.status = 2;
      execSyncMock.mockImplementation(() => {
        throw error;
      });
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      await expect(scanner.scan(options)).rejects.toThrow(RipgrepError);
      await expect(scanner.scan(options)).rejects.toThrow(/execution failed/);
    });

    it('should filter out invalid matches', async () => {
      const output = [
        'src/test.js:10::ga:todo valid match',
        'invalid line format',
        'src/test.js:20:invalid anchor format',
        'src/test.js:30::ga:sec valid match'
      ].join('\n');
      
      execSyncMock.mockReturnValue(output);
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      const result = await scanner.scan(options);
      
      expect(result).toHaveLength(2);
      expect(result[0]?.tag).toBe('todo');
      expect(result[1]?.tag).toBe('sec');
    });

    it('should handle complex tag names', async () => {
      const output = createRipgrepOutput([
        { file: 'src/test.js', line: 10, match: ':ga:@agent implement' },
        { file: 'src/test.js', line: 20, match: ':ga:perf.optimize loop' },
        { file: 'src/test.js', line: 30, match: ':ga:issue-123 fix bug' }
      ]);
      
      execSyncMock.mockReturnValue(output);
      
      const options = {
        anchor: createAnchorPattern(':ga:'),
        ignorePatterns: [],
        ignoreExamples: false,
        respectGitignore: true
      };

      const result = await scanner.scan(options);
      
      expect(result).toHaveLength(3);
      expect(result[0]?.tag).toBe('@agent');
      expect(result[1]?.tag).toBe('perf.optimize');
      expect(result[2]?.tag).toBe('issue-123');
    });
  });
});