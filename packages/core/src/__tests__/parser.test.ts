// ::: tldr Tests for waymark parser functionality
import { describe, it, expect } from 'vitest';
import { WaymarkParser } from '../parser/waymark-parser.js';

describe('WaymarkParser', () => {
  it('should parse basic waymark with single marker', () => {
    const content = '// ::: todo implement validation';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(1);
      expect(result.data.errors).toHaveLength(0);
      
      const anchor = result.data.anchors[0];
      expect(anchor).toBeDefined();
      expect(anchor!.contexts).toEqual(['todo']);
      expect(anchor!.prose).toBe('implement validation');
      expect(anchor!.line).toBe(1);
    }
  });
  
  it('should parse waymark with multiple markers', () => {
    const content = '// ::: sec, todo validate inputs';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(1);
      const anchor = result.data.anchors[0];
      expect(anchor).toBeDefined();
      expect(anchor!.contexts).toEqual(['sec', 'todo']);
      expect(anchor!.prose).toBe('validate inputs');
    }
  });
  
  it('should parse waymark without prose', () => {
    const content = '// ::: tldr';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(1);
      const anchor = result.data.anchors[0];
      expect(anchor).toBeDefined();
      expect(anchor!.contexts).toEqual(['tldr']);
      expect(anchor!.prose).toBeUndefined();
    }
  });
  
  it('should detect missing space after :::', () => {
    const content = '// :::todo fix this';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(0);
      expect(result.data.errors).toHaveLength(1);
      expect(result.data.errors[0]?.message).toBe('Missing required space after :::');
    }
  });
  
  it('should detect empty waymark payload', () => {
    const content = '// ::: ';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(0);
      expect(result.data.errors).toHaveLength(1);
      expect(result.data.errors[0]?.message).toBe('Empty anchor payload');
    }
  });
  
  it('should find waymarks by marker', () => {
    const content = `
      // ::: todo implement
      // ::: sec validate
      // ::: todo, perf optimize
    `;
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      const todoAnchors = WaymarkParser.findByContext(result.data.anchors, 'todo');
      expect(todoAnchors).toHaveLength(2);
    }
  });

  it('should handle file size limit', () => {
    // 11MB - exceeds the 10MB limit
    const largeContent = 'x'.repeat(10 * 1024 * 1024 + 1);
    const result = WaymarkParser.parseWithResult(largeContent);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('file.tooLarge');
    }
  });

  it('should handle parentheses in markers correctly', () => {
    const content = '// ::: issue(123), owner(@alice) fix authentication';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(1);
      const anchor = result.data.anchors[0];
      expect(anchor!.contexts).toEqual(['issue(123)', 'owner(@alice)']);
      expect(anchor!.prose).toBe('fix authentication');
    }
  });

  it('should handle complex nested parentheses and brackets in markers', () => {
    const content = '// ::: todo(priority:high,tags:[ui,backend]), blocked:[4,7], owner:@alice test complex parsing';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(1);
      const anchor = result.data.anchors[0];
      expect(anchor!.contexts).toEqual(['todo(priority:high,tags:[ui,backend])', 'blocked:[4,7]', 'owner:@alice']);
      expect(anchor!.prose).toBe('test complex parsing');
    }
  });

  it('should validate markers with colons and array syntax', () => {
    const testCases = [
      { content: '// ::: priority:high', expectedContexts: ['priority:high'] },
      { content: '// ::: owner:@alice', expectedContexts: ['owner:@alice'] },
      { content: '// ::: blocked:[123,456]', expectedContexts: ['blocked:[123,456]'] },
      { content: '// ::: tags:[ui,backend,api]', expectedContexts: ['tags:[ui,backend,api]'] },
      { content: '// ::: status:in-progress', expectedContexts: ['status:in-progress'] },
    ];

    testCases.forEach(({ content, expectedContexts }) => {
      const result = WaymarkParser.parseWithResult(content);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.anchors).toHaveLength(1);
        expect(result.data.anchors[0]!.contexts).toEqual(expectedContexts);
      }
    });
  });
});