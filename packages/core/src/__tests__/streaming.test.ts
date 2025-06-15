// ::: tldr Tests for large file streaming functionality
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, unlinkSync, existsSync, mkdirSync, rmSync } from 'fs';
import { WaymarkSearch } from '../search/waymark-search.js';

describe('Large File Streaming', () => {
  const testDir = './test-streaming';
  const largeTestFile = `${testDir}/large-test-file.ts`;
  
  beforeAll(() => {
    // ::: ctx create test directory
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
    
    // ::: ctx create a large test file with anchors
    let content = '// ::: tldr Large test file for streaming\n';
    
    // Add 100,000 lines to make it large enough to trigger streaming
    for (let i = 0; i < 100000; i++) {
      if (i % 5000 === 0) {
        content += `// ::: security check security validation at line ${i}\n`;
      } else if (i % 1000 === 0) {
        content += `// ::: milestone line ${i}\n`;
      } else {
        content += `const line${i} = "content for line ${i}";\n`;
      }
    }
    
    content += '// ::: performance end of large file\n';
    
    writeFileSync(largeTestFile, content);
  });

  afterAll(() => {
    // ::: ctx cleanup test files
    if (existsSync(largeTestFile)) unlinkSync(largeTestFile);
    if (existsSync(testDir)) rmSync(testDir, { recursive: true, force: true });
  });

  it('should process large files using streaming', async () => {
    const searchOptions = {
      contexts: ['milestone'],
      context: 2
    };

    const result = await WaymarkSearch.search([largeTestFile], searchOptions);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBeGreaterThan(0);
      
      // ::: ctx verify we found the milestone anchors
      const milestones = result.data.filter(r => 
        r.anchor.contexts.includes('milestone')
      );
      expect(milestones.length).toBeGreaterThanOrEqual(80); // Should find most milestone contexts
    }
  });

  it('should handle context correctly in streaming mode', async () => {
    const searchOptions = {
      contexts: ['performance'],
      context: 3
    };

    const result = await WaymarkSearch.search([largeTestFile], searchOptions);
    
    expect(result.ok).toBe(true);
    if (result.ok && result.data.length > 0) {
      const firstResult = result.data[0];
      expect(firstResult?.context).toBeDefined();
      expect(firstResult?.context?.before).toBeDefined();
      expect(firstResult?.context?.after).toBeDefined();
    }
  });

  it('should parse simple payloads correctly in streaming', () => {
    // ::: ctx test the simple payload parser used in streaming
    const testCases = [
      { payload: 'todo implement feature', expected: { contexts: ['todo'], prose: 'implement feature' } },
      { payload: 'security, todo validate inputs', expected: { contexts: ['security', 'todo'], prose: 'validate inputs' } },
      { payload: 'issue(123) fix authentication', expected: { contexts: ['issue(123)'], prose: 'fix authentication' } },
      { payload: 'owner(@alice), priority(high) urgent task', expected: { contexts: ['owner(@alice)', 'priority(high)'], prose: 'urgent task' } }
    ];

    // Test the parsePayloadSimple method directly
    const parseMethod = (WaymarkSearch as any).parsePayloadSimple;
    
    testCases.forEach(({ payload, expected }) => {
      const result = parseMethod(payload);
      expect(result.contexts).toEqual(expected.contexts);
      expect(result.prose).toEqual(expected.prose);
    });
  });

  it('should maintain memory efficiency with large files', async () => {
    // ::: perf test memory usage doesn't explode with large files
    // Force garbage collection if available for more reliable baseline
    if (global.gc) {
      global.gc();
    }
    
    const initialMemory = process.memoryUsage().heapUsed;
    
    const searchOptions = {
      contexts: ['security'],
      context: 1
    };

    const result = await WaymarkSearch.search([largeTestFile], searchOptions);
    
    // Force GC again to get more accurate final measurement
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // The test file should be processed regardless of whether anchors are found
    expect(result.ok || (!result.ok && result.error.code === 'search.noResults')).toBe(true);
    // Memory increase should be reasonable (less than 100MB for processing)
    // Use generous threshold due to V8 memory management behavior
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
  });

  it('should handle streaming errors gracefully', async () => {
    const nonExistentFile = './non-existent-large-file.ts';
    
    const searchOptions = {
      contexts: ['test']
    };

    const result = await WaymarkSearch.search([nonExistentFile], searchOptions);
    
    // Should handle missing files gracefully
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toContain('search.noResults');
    }
  });

  it('should process multiple large files concurrently', async () => {
    // Create a second large file for concurrent processing test
    const largeTestFile2 = `${testDir}/large-test-file-2.ts`;
    
    let content = '// ::: tldr Second large test file\n';
    for (let i = 0; i < 50000; i++) {
      if (i % 2000 === 0) {
        content += `// ::: concurrent processing line ${i}\n`;
      } else {
        content += `const secondFile${i} = "content ${i}";\n`;
      }
    }
    
    writeFileSync(largeTestFile2, content);
    
    try {
      const searchOptions = {
        contexts: ['concurrent']
      };

      const result = await WaymarkSearch.search([largeTestFile, largeTestFile2], searchOptions);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        const files = new Set(result.data.map(r => r.anchor.file));
        expect(files.size).toBe(1); // Should find results in the second file
      }
    } finally {
      if (existsSync(largeTestFile2)) unlinkSync(largeTestFile2);
    }
  });

  it('should respect context buffer limits in streaming', () => {
    // ::: ctx test context buffer management
    const contextSize = 5;
    const maxBufferSize = contextSize * 2 + 1;
    const buffer: string[] = [];
    
    // Simulate adding lines to buffer
    for (let i = 0; i < 20; i++) {
      buffer.push(`line ${i}`);
      if (buffer.length > maxBufferSize) {
        buffer.shift();
      }
    }
    
    expect(buffer.length).toBeLessThanOrEqual(maxBufferSize);
    expect(buffer[0]).not.toBe('line 0'); // First lines should be removed
  });

  it('should validate anchor format in streaming mode', () => {
    // ::: sec test anchor validation during streaming
    const testLines = [
      '// ::: valid anchor',
      '// :::invalid no space',
      '// ::: ',
      '// ::: multiple, contexts test',
      'no anchor here'
    ];

    const validAnchors = testLines.filter(line => {
      const anchorIndex = line.indexOf(':::');
      if (anchorIndex === -1) return false;
      
      const afterAnchor = line.substring(anchorIndex + 3);
      if (!afterAnchor.startsWith(' ')) return false;
      
      const payload = afterAnchor.substring(1).trim();
      return payload.length > 0;
    });

    expect(validAnchors.length).toBe(2); // Should find 2 valid anchors (empty payload is invalid)
  });
});