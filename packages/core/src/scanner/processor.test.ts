// :ga:tldr Tests for match processing and result aggregation

import { describe, it, expect } from 'vitest';
import { MatchProcessor } from './processor.js';
import { 
  createAnchorPattern, 
  createFilePath, 
  createLineNumber, 
  createTagName,
  type AnchorMatch 
} from '../types/index.js';

describe('MatchProcessor', () => {
  let processor: MatchProcessor;

  beforeEach(() => {
    processor = new MatchProcessor();
  });

  describe('processMatches', () => {
    it('should process empty matches array', () => {
      const result = processor.processMatches([]);
      
      expect(result.totalAnchors).toBe(0);
      expect(Object.keys(result.tags)).toHaveLength(0);
      expect(Object.keys(result.files)).toHaveLength(0);
    });

    it('should process single match', () => {
      const matches: AnchorMatch[] = [
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(10),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo implement feature'
        }
      ];

      const result = processor.processMatches(matches);
      
      expect(result.totalAnchors).toBe(1);
      expect(Object.keys(result.tags)).toHaveLength(1);
      expect(Object.keys(result.files)).toHaveLength(1);
      
      expect(result.tags.todo.count).toBe(1);
      expect(result.tags.todo.firstSeen.file).toBe('src/test.js');
      expect(result.tags.todo.firstSeen.line).toBe(10);
      
      expect(result.files['src/test.js'].totalAnchors).toBe(1);
      expect(result.files['src/test.js'].tags.todo).toBe(1);
      expect(result.files['src/test.js'].lines).toEqual([10]);
    });

    it('should aggregate multiple matches in same file', () => {
      const matches: AnchorMatch[] = [
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(5),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo first task'
        },
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(15),
          tag: createTagName('sec'),
          fullMatch: ':ga:sec security check'
        },
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(25),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo second task'
        }
      ];

      const result = processor.processMatches(matches);
      
      expect(result.totalAnchors).toBe(3);
      expect(Object.keys(result.tags)).toHaveLength(2);
      expect(Object.keys(result.files)).toHaveLength(1);
      
      expect(result.tags.todo.count).toBe(2);
      expect(result.tags.sec.count).toBe(1);
      
      expect(result.files['src/test.js'].totalAnchors).toBe(3);
      expect(result.files['src/test.js'].tags.todo).toBe(2);
      expect(result.files['src/test.js'].tags.sec).toBe(1);
      expect(result.files['src/test.js'].lines).toEqual([5, 15, 25]);
    });

    it('should aggregate matches across multiple files', () => {
      const matches: AnchorMatch[] = [
        {
          file: createFilePath('src/file1.js'),
          line: createLineNumber(10),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo task one'
        },
        {
          file: createFilePath('src/file2.js'),
          line: createLineNumber(20),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo task two'
        },
        {
          file: createFilePath('src/file2.js'),
          line: createLineNumber(30),
          tag: createTagName('sec'),
          fullMatch: ':ga:sec security'
        }
      ];

      const result = processor.processMatches(matches);
      
      expect(result.totalAnchors).toBe(3);
      expect(Object.keys(result.tags)).toHaveLength(2);
      expect(Object.keys(result.files)).toHaveLength(2);
      
      expect(result.tags.todo.count).toBe(2);
      expect(result.tags.todo.files['src/file1.js']).toEqual([10]);
      expect(result.tags.todo.files['src/file2.js']).toEqual([20]);
      
      expect(result.tags.sec.count).toBe(1);
      expect(result.tags.sec.files['src/file2.js']).toEqual([30]);
      
      expect(result.files['src/file1.js'].totalAnchors).toBe(1);
      expect(result.files['src/file2.js'].totalAnchors).toBe(2);
    });

    it('should sort line numbers within files and tags', () => {
      const matches: AnchorMatch[] = [
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(30),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo third'
        },
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(10),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo first'
        },
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(20),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo second'
        }
      ];

      const result = processor.processMatches(matches);
      
      expect(result.files['src/test.js'].lines).toEqual([10, 20, 30]);
      expect(result.tags.todo.files['src/test.js']).toEqual([10, 20, 30]);
    });

    it('should track first seen location for each tag', () => {
      const matches: AnchorMatch[] = [
        {
          file: createFilePath('src/file2.js'),
          line: createLineNumber(20),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo second'
        },
        {
          file: createFilePath('src/file1.js'),
          line: createLineNumber(10),
          tag: createTagName('todo'),
          fullMatch: ':ga:todo first'
        }
      ];

      const result = processor.processMatches(matches);
      
      // First seen should be the first match processed, not by file/line order
      expect(result.tags.todo.firstSeen.file).toBe('src/file2.js');
      expect(result.tags.todo.firstSeen.line).toBe(20);
    });

    it('should handle agent tags correctly', () => {
      const matches: AnchorMatch[] = [
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(10),
          tag: createTagName('@agent'),
          fullMatch: ':ga:@agent implement this'
        }
      ];

      const result = processor.processMatches(matches);
      
      expect(result.tags['@agent']).toBeDefined();
      expect(result.tags['@agent'].count).toBe(1);
      expect(result.files['src/test.js'].tags['@agent']).toBe(1);
    });

    it('should extract anchor pattern from first match', () => {
      const matches: AnchorMatch[] = [
        {
          file: createFilePath('src/test.js'),
          line: createLineNumber(10),
          tag: createTagName('todo'),
          fullMatch: ':custom:todo implement'
        }
      ];

      const result = processor.processMatches(matches);
      
      expect(result.anchor).toBe(':custom:');
    });

    it('should handle default anchor pattern when no matches', () => {
      const result = processor.processMatches([]);
      
      expect(result.anchor).toBe(':ga:');
    });
  });
});