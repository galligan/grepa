// :ga:tldr Tests for Zod configuration schemas

import { describe, it, expect } from 'vitest';
import { ConfigSchema } from './schema.js';

describe('ConfigSchema', () => {
  it('should validate default config', () => {
    const result = ConfigSchema.parse({});
    
    expect(result).toEqual({
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
      }
    });
  });

  it('should validate custom anchor', () => {
    const result = ConfigSchema.parse({
      anchor: ':custom:'
    });
    
    expect(result.anchor).toBe(':custom:');
  });

  it('should validate ignore patterns', () => {
    const result = ConfigSchema.parse({
      ignore: {
        respectGitignore: false,
        patterns: {
          'test': {
            globs: ['*.test.js'],
            active: true
          }
        },
        custom: ['*.tmp']
      }
    });
    
    expect(result.ignore.respectGitignore).toBe(false);
    expect(result.ignore.patterns.test.active).toBe(true);
    expect(result.ignore.custom).toEqual(['*.tmp']);
  });

  it('should validate docs examples config', () => {
    const result = ConfigSchema.parse({
      docsExamples: {
        ignore: true,
        include: ['htmlComments'],
        exclude: ['codeFences']
      }
    });
    
    expect(result.docsExamples.ignore).toBe(true);
    expect(result.docsExamples.include).toEqual(['htmlComments']);
    expect(result.docsExamples.exclude).toEqual(['codeFences']);
  });

  it('should validate output config', () => {
    const result = ConfigSchema.parse({
      output: {
        file: 'custom-output.json',
        indent: 4
      }
    });
    
    expect(result.output.file).toBe('custom-output.json');
    expect(result.output.indent).toBe(4);
  });

  it('should validate display config', () => {
    const result = ConfigSchema.parse({
      display: {
        showSummary: false,
        topTagsCount: 10
      }
    });
    
    expect(result.display.showSummary).toBe(false);
    expect(result.display.topTagsCount).toBe(10);
  });

  it('should reject invalid indent values', () => {
    expect(() => {
      ConfigSchema.parse({
        output: { indent: -1 }
      });
    }).toThrow();

    expect(() => {
      ConfigSchema.parse({
        output: { indent: 10 }
      });
    }).toThrow();
  });

  it('should reject invalid top tags count', () => {
    expect(() => {
      ConfigSchema.parse({
        display: { topTagsCount: 0 }
      });
    }).toThrow();

    expect(() => {
      ConfigSchema.parse({
        display: { topTagsCount: 25 }
      });
    }).toThrow();
  });
});