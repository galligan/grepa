// :A: tldr Tests for Magic Anchor parser functionality
import { describe, it, expect } from 'vitest';
import { MagicAnchorParser } from '../parser/magic-anchor-parser.js';

describe('MagicAnchorParser', () => {
  it('should parse basic anchor with single marker', () => {
    const content = '// :A: todo implement validation';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
    
    const anchor = result.anchors[0];
    expect(anchor).toBeDefined();
    expect(anchor!.markers).toEqual(['todo']);
    expect(anchor!.prose).toBe('implement validation');
    expect(anchor!.line).toBe(1);
  });
  
  it('should parse anchor with multiple markers', () => {
    const content = '// :A: sec, todo validate inputs';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(1);
    const anchor = result.anchors[0];
    expect(anchor).toBeDefined();
    expect(anchor!.markers).toEqual(['sec', 'todo']);
    expect(anchor!.prose).toBe('validate inputs');
  });
  
  it('should parse anchor without prose', () => {
    const content = '// :A: tldr';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(1);
    const anchor = result.anchors[0];
    expect(anchor).toBeDefined();
    expect(anchor!.markers).toEqual(['tldr']);
    expect(anchor!.prose).toBeUndefined();
  });
  
  it('should detect missing space after :A:', () => {
    const content = '// :A:todo fix this';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toBe('Missing required space after :A:');
  });
  
  it('should detect empty anchor payload', () => {
    const content = '// :A: ';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toBe('Empty anchor payload');
  });
  
  it('should find anchors by marker', () => {
    const content = `
      // :A: todo implement
      // :A: sec validate
      // :A: todo, perf optimize
    `;
    const result = MagicAnchorParser.parse(content);
    const todoAnchors = MagicAnchorParser.findByMarker(result.anchors, 'todo');
    
    expect(todoAnchors).toHaveLength(2);
  });

  // :A: ctx Result pattern tests
  it('should parse with Result pattern', () => {
    const content = '// :A: todo implement validation';
    const result = MagicAnchorParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(1);
      expect(result.data.errors).toHaveLength(0);
      const firstAnchor = result.data.anchors[0];
      expect(firstAnchor).toBeDefined();
      expect(firstAnchor!.markers).toEqual(['todo']);
    }
  });

  it('should handle file size limit with Result pattern', () => {
    const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
    const result = MagicAnchorParser.parseWithResult(largeContent);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('file.tooLarge');
    }
  });

  // :A: ctx markdown code block handling tests
  describe('Markdown code block handling', () => {
    it('should ignore anchors in fenced code blocks', () => {
      const content = `
# Test Document
<!-- :A: tldr Document with code examples -->

Here's some code:
\`\`\`javascript
// :A: todo This should be ignored
function example() {
  // :A: sec This should also be ignored
}
\`\`\`

<!-- :A: todo This should be found -->
`;
      const result = MagicAnchorParser.parse(content, 'test.md');
      
      expect(result.anchors).toHaveLength(2);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['tldr', 'todo']);
      expect(result.anchors[1]?.prose).toBe('This should be found');
    });

    it('should ignore anchors in tildes fenced code blocks', () => {
      const content = `
<!-- :A: guide Using tildes for code blocks -->

~~~bash
# :A: temp This should be ignored
echo "hello"
~~~

<!-- :A: api Document the API -->
`;
      const result = MagicAnchorParser.parse(content, 'test.md');
      
      expect(result.anchors).toHaveLength(2);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['guide', 'api']);
    });

    it('should ignore anchors in indented code blocks', () => {
      const content = `
<!-- :A: ctx Example with indented code -->

Here is some indented code:

    // :A: todo This should be ignored
    function example() {
      // :A: perf This should also be ignored
      return 42;
    }

<!-- :A: review Check this section -->
`;
      const result = MagicAnchorParser.parse(content, 'test.md');
      
      expect(result.anchors).toHaveLength(2);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['ctx', 'review']);
    });

    it('should ignore anchors in inline code', () => {
      const content = `
<!-- :A: docs Example documentation -->

Use \`:A: todo\` to mark tasks.
The pattern is \`:A: marker prose\`.

<!-- :A: todo Write more examples -->
`;
      const result = MagicAnchorParser.parse(content, 'test.md');
      
      expect(result.anchors).toHaveLength(2);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['docs', 'todo']);
      expect(result.anchors[1]?.prose).toBe('Write more examples');
    });

    it('should handle mixed code blocks correctly', () => {
      const content = `
<!-- :A: test Complex markdown example -->

\`\`\`javascript
// :A: ignore This is in fenced block
\`\`\`

    // :A: ignore This is in indented block

Use \`:A: ignore\` inline.

<!-- :A: found This should be found -->

~~~
// :A: ignore This is in tildes block
~~~

<!-- :A: final Last anchor -->
`;
      const result = MagicAnchorParser.parse(content, 'example.md');
      
      expect(result.anchors).toHaveLength(3);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['test', 'found', 'final']);
    });

    it('should handle nested backticks correctly', () => {
      const content = `
<!-- :A: edge Testing edge cases -->

This \`contains :A: nested\` should be ignored.
But \`\`\`this should not affect parsing\`\`\`.

<!-- :A: ok This should be found -->
`;
      const result = MagicAnchorParser.parse(content, 'edge.md');
      
      expect(result.anchors).toHaveLength(2);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['edge', 'ok']);
    });

    it('should handle code blocks with language hints', () => {
      const content = `
<!-- :A: lang Language-specific examples -->

\`\`\`typescript
// :A: ignore TypeScript comment
interface Example { }
\`\`\`

\`\`\`bash
# :A: ignore Bash comment
echo "test"
\`\`\`

<!-- :A: done Finished examples -->
`;
      const result = MagicAnchorParser.parse(content, 'lang.md');
      
      expect(result.anchors).toHaveLength(2);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['lang', 'done']);
    });

    it('should work normally for non-markdown files', () => {
      const content = `
// :A: normal Regular JavaScript file
\`\`\`
// :A: found This should be found in JS file
\`\`\`
// :A: also This should also be found
`;
      const result = MagicAnchorParser.parse(content, 'test.js');
      
      expect(result.anchors).toHaveLength(3);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['normal', 'found', 'also']);
    });

    it('should handle empty code blocks', () => {
      const content = `
<!-- :A: empty Testing empty blocks -->

\`\`\`
\`\`\`

<!-- :A: after After empty block -->

    

<!-- :A: final Final anchor -->
`;
      const result = MagicAnchorParser.parse(content, 'empty.md');
      
      expect(result.anchors).toHaveLength(3);
      expect(result.anchors.map(a => a.markers[0])).toEqual(['empty', 'after', 'final']);
    });

    it('should handle markdown extensions correctly', () => {
      const contentMd = '<!-- :A: test Markdown file -->\n```\n// :A: ignore\n```';
      const contentMarkdown = '<!-- :A: test Markdown file -->\n```\n// :A: ignore\n```';
      const contentTxt = '// :A: test Text file\n```\n// :A: found\n```';
      
      const resultMd = MagicAnchorParser.parse(contentMd, 'test.md');
      const resultMarkdown = MagicAnchorParser.parse(contentMarkdown, 'test.markdown');
      const resultTxt = MagicAnchorParser.parse(contentTxt, 'test.txt');
      
      expect(resultMd.anchors).toHaveLength(1);
      expect(resultMarkdown.anchors).toHaveLength(1);
      expect(resultTxt.anchors).toHaveLength(2); // Should find both in non-markdown
    });
  });
});