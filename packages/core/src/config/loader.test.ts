// :ga:tldr Tests for configuration loading and validation

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigLoader, ConfigError } from './loader.js';
import { TestFileSystem } from '../test/utils/test-helpers.js';

describe('ConfigLoader', () => {
  let testFs: TestFileSystem;
  let loader: ConfigLoader;

  beforeEach(() => {
    testFs = new TestFileSystem('config-test-');
    loader = new ConfigLoader(testFs.path);
  });

  afterEach(() => {
    testFs.cleanup();
  });

  describe('loadConfig', () => {
    it('should return default config when no config file exists', () => {
      const config = loader.loadConfig();
      
      expect(config.anchor).toBe(':ga:');
      expect(config.ignore.respectGitignore).toBe(true);
    });

    it('should load valid config file', () => {
      const configData = {
        anchor: ':custom:',
        ignore: {
          respectGitignore: false
        }
      };
      
      testFs.createFile('.grepa/inventory.config.json', JSON.stringify(configData, null, 2));
      
      const config = loader.loadConfig();
      expect(config.anchor).toBe(':custom:');
      expect(config.ignore.respectGitignore).toBe(false);
    });

    it('should load custom config file path', () => {
      const configData = {
        anchor: ':proj:',
        display: {
          topTagsCount: 15
        }
      };
      
      const customPath = testFs.createFile('custom.json', JSON.stringify(configData));
      
      const config = loader.loadConfig(customPath);
      expect(config.anchor).toBe(':proj:');
      expect(config.display.topTagsCount).toBe(15);
    });

    it('should throw error for non-existent custom config', () => {
      expect(() => {
        loader.loadConfig('/non/existent/config.json');
      }).toThrow(ConfigError);
    });

    it('should throw error for invalid JSON', () => {
      testFs.createFile('.grepa/inventory.config.json', '{ invalid json }');
      
      expect(() => {
        loader.loadConfig();
      }).toThrow(ConfigError);
    });

    it('should throw error for invalid config schema', () => {
      const invalidConfig = {
        anchor: 123, // Should be string
        display: {
          topTagsCount: -5 // Should be positive
        }
      };
      
      testFs.createFile('.grepa/inventory.config.json', JSON.stringify(invalidConfig));
      
      expect(() => {
        loader.loadConfig();
      }).toThrow(ConfigError);
    });
  });

  describe('validateConfig', () => {
    it('should validate correct config object', () => {
      const validConfig = {
        anchor: ':test:',
        ignore: {
          custom: ['*.test.js']
        }
      };
      
      const result = loader.validateConfig(validConfig);
      expect(result.anchor).toBe(':test:');
      expect(result.ignore.custom).toEqual(['*.test.js']);
    });

    it('should throw ConfigError for invalid config', () => {
      const invalidConfig = {
        anchor: null,
        output: {
          indent: 'invalid' // Should be number
        }
      };
      
      expect(() => {
        loader.validateConfig(invalidConfig);
      }).toThrow(ConfigError);
    });
  });

  describe('resolveIgnorePatterns', () => {
    it('should resolve predefined pattern aliases', () => {
      const config = {
        anchor: ':ga:',
        ignore: {
          respectGitignore: true,
          patterns: {
            'test': {
              globs: ['*.test.js', '*.spec.js'],
              active: false
            },
            'build': {
              globs: ['dist/**', 'build/**'],
              active: false
            }
          },
          custom: []
        },
        docsExamples: { ignore: false, include: [], exclude: [] },
        output: { file: '', indent: 2 },
        display: { showSummary: true, topTagsCount: 5 }
      };
      
      const patterns = ['test', 'build'];
      const result = loader.resolveIgnorePatterns(patterns, config);
      
      expect(result).toEqual(['*.test.js', '*.spec.js', 'dist/**', 'build/**']);
    });

    it('should pass through custom patterns', () => {
      const config = {
        anchor: ':ga:',
        ignore: {
          respectGitignore: true,
          patterns: {},
          custom: []
        },
        docsExamples: { ignore: false, include: [], exclude: [] },
        output: { file: '', indent: 2 },
        display: { showSummary: true, topTagsCount: 5 }
      };
      
      const patterns = ['*.tmp', 'node_modules/**'];
      const result = loader.resolveIgnorePatterns(patterns, config);
      
      expect(result).toEqual(['*.tmp', 'node_modules/**']);
    });

    it('should handle mixed pattern types', () => {
      const config = {
        anchor: ':ga:',
        ignore: {
          respectGitignore: true,
          patterns: {
            'test': {
              globs: ['*.test.js'],
              active: false
            }
          },
          custom: []
        },
        docsExamples: { ignore: false, include: [], exclude: [] },
        output: { file: '', indent: 2 },
        display: { showSummary: true, topTagsCount: 5 }
      };
      
      const patterns = ['test', '*.tmp'];
      const result = loader.resolveIgnorePatterns(patterns, config);
      
      expect(result).toEqual(['*.test.js', '*.tmp']);
    });
  });

  describe('getActivePatterns', () => {
    it('should return active patterns from config', () => {
      const config = {
        anchor: ':ga:',
        ignore: {
          respectGitignore: true,
          patterns: {
            'test': { globs: ['*.test.js'], active: true },
            'build': { globs: ['dist/**'], active: false },
            'temp': { globs: ['*.tmp'], active: true }
          },
          custom: ['node_modules/**', '*.log']
        },
        docsExamples: { ignore: false, include: [], exclude: [] },
        output: { file: '', indent: 2 },
        display: { showSummary: true, topTagsCount: 5 }
      };
      
      const result = loader.getActivePatterns(config);
      
      expect(result).toEqual(['test', 'temp', 'node_modules/**', '*.log']);
    });

    it('should return empty array when no active patterns', () => {
      const config = {
        anchor: ':ga:',
        ignore: {
          respectGitignore: true,
          patterns: {
            'test': { globs: ['*.test.js'], active: false }
          },
          custom: []
        },
        docsExamples: { ignore: false, include: [], exclude: [] },
        output: { file: '', indent: 2 },
        display: { showSummary: true, topTagsCount: 5 }
      };
      
      const result = loader.getActivePatterns(config);
      
      expect(result).toEqual([]);
    });
  });
});