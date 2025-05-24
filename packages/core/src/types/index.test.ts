// :ga:tldr Tests for type constructors and branded types

import { describe, it, expect } from 'vitest';
import { 
  createAnchorPattern, 
  createFilePath, 
  createLineNumber, 
  createTagName 
} from './index.js';

describe('Type Constructors', () => {
  describe('createAnchorPattern', () => {
    it('should create anchor pattern from string', () => {
      const pattern = createAnchorPattern(':ga:');
      expect(pattern).toBe(':ga:');
    });

    it('should handle custom anchor patterns', () => {
      const pattern = createAnchorPattern(':custom:');
      expect(pattern).toBe(':custom:');
    });
  });

  describe('createFilePath', () => {
    it('should create file path from string', () => {
      const path = createFilePath('/path/to/file.js');
      expect(path).toBe('/path/to/file.js');
    });

    it('should handle relative paths', () => {
      const path = createFilePath('src/index.ts');
      expect(path).toBe('src/index.ts');
    });
  });

  describe('createLineNumber', () => {
    it('should create line number from number', () => {
      const line = createLineNumber(42);
      expect(line).toBe(42);
    });

    it('should handle line 1', () => {
      const line = createLineNumber(1);
      expect(line).toBe(1);
    });
  });

  describe('createTagName', () => {
    it('should create tag name from string', () => {
      const tag = createTagName('todo');
      expect(tag).toBe('todo');
    });

    it('should handle agent tags', () => {
      const tag = createTagName('@agent');
      expect(tag).toBe('@agent');
    });
  });
});