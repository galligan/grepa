// ::: tldr Tests for CLI functionality
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CLI } from '../index.js';

// ::: ctx mock console methods for testing
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(mockConsoleLog);
  vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
  // Reset process.argv for each test
  process.argv = ['node', 'test'];
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CLI', () => {
  it('should create CLI instance without errors', () => {
    expect(() => new CLI()).not.toThrow();
  });

  // ::: todo add more integration tests when CLI stabilizes
  // The following tests are commented out due to process.exit handling issues
  // They can be re-enabled once we have better test infrastructure
  
  /*
  it('should display help when no command is provided', async () => {
    // Test implementation pending
  });

  it('should handle parse command with file argument', async () => {
    // Test implementation pending
  });

  it('should handle errors gracefully', async () => {
    // Test implementation pending
  });
  */

  // ::: todo add more integration tests for search and list commands
  // ::: ctx these would require more complex mocking of file system and glob operations
});