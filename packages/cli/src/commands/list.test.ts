// :ga:tldr End-to-end tests for the list command

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { executeListCommand } from './list.js';
import { CLITestEnvironment, mockRipgrepOutput } from '../test/utils/cli-helpers.js';
import { sampleProject, sampleConfig } from '../test/fixtures/cli-fixtures.js';
import * as childProcess from 'child_process';

// Mock child_process and console
vi.mock('child_process');
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
const mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

describe('List Command', () => {
  let testEnv: CLITestEnvironment;
  let execSyncMock: ReturnType<typeof vi.fn>;
  let originalCwd: string;

  beforeEach(() => {
    testEnv = new CLITestEnvironment();
    testEnv.createFiles(sampleProject);
    
    execSyncMock = vi.mocked(childProcess.execSync);
    originalCwd = process.cwd();
    
    // Mock process.cwd to return our test directory
    vi.spyOn(process, 'cwd').mockReturnValue(testEnv.cwd);
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    testEnv.cleanup();
    vi.spyOn(process, 'cwd').mockReturnValue(originalCwd);
  });

  describe('basic functionality', () => {
    it('should output summary format by default', async () => {
      const ripgrepOutput = mockRipgrepOutput([
        { file: 'src/main.ts', line: 2, match: ':ga:tldr Main application entry point' },
        { file: 'src/main.ts', line: 4, match: ':ga:todo implement CLI argument parsing' },
        { file: 'src/main.ts', line: 8, match: ':ga:sec ensure proper error handling' },
        { file: 'src/utils.ts', line: 2, match: ':ga:perf optimize this function' },
        { file: 'src/utils.ts', line: 4, match: ':ga:@agent add input validation' },
        { file: 'src/utils.ts', line: 8, match: ':ga:tmp remove after refactor' }
      ]);
      
      execSyncMock.mockReturnValue(ripgrepOutput);

      await executeListCommand({});

      expect(mockConsoleLog).toHaveBeenCalled();
      const output = mockConsoleLog.mock.calls.map(call => call[0]).join('\n');
      
      expect(output).toContain('Grep-anchor inventory summary');
      expect(output).toContain('Total anchors: 6');
      expect(output).toContain('Unique tags: 6');
      expect(output).toContain('Files with anchors: 2');
      expect(output).toContain('Top tags:');
    });

    it('should output compact format when requested', async () => {
      const ripgrepOutput = mockRipgrepOutput([
        { file: 'src/main.ts', line: 2, match: ':ga:todo task one' },
        { file: 'src/utils.ts', line: 5, match: ':ga:sec security check' }
      ]);
      
      execSyncMock.mockReturnValue(ripgrepOutput);

      await executeListCommand({ format: 'compact' });

      expect(mockConsoleLog).toHaveBeenCalled();
      const output = mockConsoleLog.mock.calls.map(call => call[0]).join('\n');
      
      expect(output).toContain('Anchors: 2, Tags: 2, Files: 2');
      expect(output).toContain('Top tags:');
      expect(output).toContain('todo: 1 (1 files)');
      expect(output).toContain('sec: 1 (1 files)');
    });

    it('should output JSON format when requested', async () => {
      const ripgrepOutput = mockRipgrepOutput([
        { file: 'src/test.js', line: 10, match: ':ga:todo implement' }
      ]);
      
      execSyncMock.mockReturnValue(ripgrepOutput);

      await executeListCommand({ format: 'json' });

      expect(mockConsoleLog).toHaveBeenCalled();
      const output = mockConsoleLog.mock.calls[0]?.[0];
      
      expect(() => JSON.parse(output)).not.toThrow();
      const parsed = JSON.parse(output);
      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('tags');
      expect(parsed).toHaveProperty('files');
      expect(parsed.summary.totalAnchors).toBe(1);
    });
  });

  describe('print option', () => {
    it('should print full JSON when --print is used', async () => {
      const ripgrepOutput = mockRipgrepOutput([
        { file: 'src/test.js', line: 10, match: ':ga:todo task' }
      ]);
      
      execSyncMock.mockReturnValue(ripgrepOutput);

      await executeListCommand({ print: true });

      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
      const output = mockConsoleLog.mock.calls[0]?.[0];
      
      expect(() => JSON.parse(output)).not.toThrow();
      const parsed = JSON.parse(output);
      expect(parsed.summary.totalAnchors).toBe(1);
    });

    it('should respect indent option with --print', async () => {
      const ripgrepOutput = mockRipgrepOutput([
        { file: 'src/test.js', line: 10, match: ':ga:todo task' }
      ]);
      
      execSyncMock.mockReturnValue(ripgrepOutput);

      await executeListCommand({ print: true, indent: 4 });

      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
      const output = mockConsoleLog.mock.calls[0]?.[0];
      
      // Check that output uses 4-space indentation
      expect(output).toContain('    "summary"');
    });
  });

  describe('save option', () => {
    it('should save to file when --save is used', async () => {
      const ripgrepOutput = mockRipgrepOutput([
        { file: 'src/test.js', line: 10, match: ':ga:todo task' }
      ]);
      
      execSyncMock.mockReturnValue(ripgrepOutput);

      const outputFile = 'output.json';
      await executeListCommand({ save: outputFile });

      expect(mockConsoleLog).toHaveBeenCalledWith(`Inventory saved to: ${outputFile}`);
      
      // The actual file writing is tested in the formatter tests
      // Here we just verify the correct message is shown
    });
  });

  describe('anchor option', () => {
    it('should use custom anchor pattern', async () => {
      const ripgrepOutput = mockRipgrepOutput([
        { file: 'src/test.js', line: 10, match: ':custom:todo task' }
      ]);
      
      execSyncMock.mockReturnValue(ripgrepOutput);

      await executeListCommand({ anchor: ':custom:' });

      // Verify ripgrep was called with custom pattern
      const command = execSyncMock.mock.calls[0]?.[0] as string;
      expect(command).toContain(':custom:');
    });
  });

  describe('ignore options', () => {
    it('should apply ignore patterns', async () => {
      execSyncMock.mockReturnValue('');

      await executeListCommand({ ignore: ['*.test.ts', 'node_modules/**'] });

      const command = execSyncMock.mock.calls[0]?.[0] as string;
      expect(command).toContain('-g "!*.test.ts"');
      expect(command).toContain('-g "!node_modules/**"');
    });

    it('should apply ignore-examples option', async () => {
      const ripgrepOutput = mockRipgrepOutput([
        { file: 'docs/README.md', line: 4, match: ':ga:tldr Sample project documentation' },
        { file: 'docs/README.md', line: 13, match: ':ga:docs needs more examples' }
      ]);
      
      execSyncMock.mockReturnValue(ripgrepOutput);

      await executeListCommand({ ignoreExamples: true });

      // The actual filtering logic is tested in the core package
      // Here we verify the option is passed through
      expect(execSyncMock).toHaveBeenCalled();
    });
  });

  describe('config option', () => {
    it('should load custom config file', async () => {
      // Create a custom config file
      testEnv.createFile('custom.json', JSON.stringify(sampleConfig, null, 2));
      
      execSyncMock.mockReturnValue('');

      await executeListCommand({ config: 'custom.json' });

      expect(execSyncMock).toHaveBeenCalled();
    });

    it('should handle non-existent config file', async () => {
      await executeListCommand({ config: '/non/existent/config.json' });

      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('error handling', () => {
    it('should handle ripgrep not found', async () => {
      const error = new Error('Command not found') as any;
      error.code = 'ENOENT';
      execSyncMock.mockImplementation(() => {
        throw error;
      });

      await executeListCommand({});

      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockProcessExit).toHaveBeenCalledWith(1);
      
      const errorOutput = mockConsoleError.mock.calls[0]?.[0];
      expect(errorOutput).toContain('ripgrep');
    });

    it('should handle general errors gracefully', async () => {
      execSyncMock.mockImplementation(() => {
        throw new Error('Some unexpected error');
      });

      await executeListCommand({});

      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('empty results', () => {
    it('should handle no matches found', async () => {
      execSyncMock.mockReturnValue('');

      await executeListCommand({});

      expect(mockConsoleLog).toHaveBeenCalled();
      const output = mockConsoleLog.mock.calls.map(call => call[0]).join('\n');
      
      expect(output).toContain('Total anchors: 0');
      expect(output).toContain('Unique tags: 0');
      expect(output).toContain('Files with anchors: 0');
    });
  });
});