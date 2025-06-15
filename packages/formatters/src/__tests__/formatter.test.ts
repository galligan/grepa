// ::: tldr Tests for formatter implementations
import { describe, it, expect } from 'vitest';
import type { Waymark, SearchResult, ParseResult } from '@waymark/types';
import {
  JsonSearchResultFormatter,
  JsonWaymarkFormatter,
  JsonParseResultFormatter,
  JsonWaymarkListFormatter,
} from '../formatters/json.formatter';
import {
  TerminalSearchResultFormatter,
  TerminalWaymarkFormatter,
  TerminalParseResultFormatter,
  TerminalWaymarkListFormatter,
} from '../formatters/terminal.formatter';

const mockWaymark: Waymark = {
  line: 42,
  column: 1,
  raw: '// ::: todo, api implement authentication',
  contexts: ['todo', 'api'],
  prose: 'implement authentication',
  file: 'src/auth.ts',
};

const mockSearchResult: SearchResult = {
  anchor: mockWaymark,
  context: {
    before: ['function login() {', '  // Previous line'],
    after: ['  // Next line', '}'],
  },
};

const mockParseResult: ParseResult = {
  anchors: [mockWaymark],
  errors: [],
};

describe('JSON Formatters', () => {
  it('should format search results as JSON', () => {
    const formatter = new JsonSearchResultFormatter();
    const output = formatter.format([mockSearchResult]);
    const parsed = JSON.parse(output);
    
    expect(parsed).toHaveLength(1);
    expect(parsed[0].anchor.line).toBe(42);
    expect(parsed[0].anchor.contexts).toEqual(['todo', 'api']);
  });

  it('should format single waymark as JSON', () => {
    const formatter = new JsonWaymarkFormatter();
    const output = formatter.format(mockWaymark);
    const parsed = JSON.parse(output);
    
    expect(parsed.line).toBe(42);
    expect(parsed.contexts).toEqual(['todo', 'api']);
  });

  it('should format parse result as JSON', () => {
    const formatter = new JsonParseResultFormatter();
    const output = formatter.format(mockParseResult);
    const parsed = JSON.parse(output);
    
    expect(parsed.anchors).toHaveLength(1);
    expect(parsed.errors).toHaveLength(0);
  });

  it('should format waymark list as JSON', () => {
    const formatter = new JsonWaymarkListFormatter();
    const output = formatter.format([mockWaymark]);
    const parsed = JSON.parse(output);
    
    expect(parsed).toHaveLength(1);
    expect(parsed[0].line).toBe(42);
  });
});

describe('Terminal Formatters', () => {
  it('should format search results for terminal', () => {
    const formatter = new TerminalSearchResultFormatter();
    const output = formatter.format([mockSearchResult]);
    
    expect(output).toContain('src/auth.ts:42');
    expect(output).toContain('todo');
    expect(output).toContain('api');
    expect(output).toContain('implement authentication');
  });

  it('should show context when requested', () => {
    const formatter = new TerminalSearchResultFormatter({ context: 2 });
    const output = formatter.format([mockSearchResult]);
    
    expect(output).toContain('function login() {');
    expect(output).toContain('// Next line');
  });

  it('should handle empty results', () => {
    const formatter = new TerminalSearchResultFormatter();
    const output = formatter.format([]);
    
    expect(output).toContain('No anchors found');
  });

  it('should format single waymark for terminal', () => {
    const formatter = new TerminalWaymarkFormatter();
    const output = formatter.format(mockWaymark);
    
    expect(output).toContain('src/auth.ts:42');
    expect(output).toContain('todo');
    expect(output).toContain('implement authentication');
  });

  it('should format parse result for terminal', () => {
    const formatter = new TerminalParseResultFormatter();
    const output = formatter.format(mockParseResult);
    
    expect(output).toContain('✓ 1 anchors found');
    expect(output).toContain('src/auth.ts:42');
  });

  it('should show contexts only when requested', () => {
    const formatter = new TerminalWaymarkListFormatter({ contextsOnly: true });
    const output = formatter.format([mockWaymark]);
    
    expect(output).toContain('• todo');
    expect(output).toContain('• api');
    expect(output).not.toContain('src/auth.ts');
  });

  it('should handle waymark at line 1 with context', () => {
    const searchResultAtLine1: SearchResult = {
      anchor: { ...mockWaymark, line: 1 },
      context: {
        before: [],
        after: ['// line 2', '// line 3']
      }
    };
    const formatter = new TerminalSearchResultFormatter({ context: 2 });
    const output = formatter.format([searchResultAtLine1]);
    
    expect(output).toContain('src/auth.ts:1');
    expect(output).toContain('2: // line 2');
    expect(output).toContain('3: // line 3');
  });

  it('should clamp negative line numbers to 1', () => {
    const searchResultAtLine2: SearchResult = {
      anchor: { ...mockWaymark, line: 2 },
      context: {
        before: ['// line 1'],
        after: ['// line 3']
      }
    };
    const formatter = new TerminalSearchResultFormatter({ context: 3 });
    const output = formatter.format([searchResultAtLine2]);
    
    expect(output).toContain('1: // line 1');
    expect(output).not.toContain('-1:');
    expect(output).not.toContain('0:');
  });

  it('should handle special characters in content', () => {
    const specialWaymark: Waymark = {
      ...mockWaymark,
      prose: 'Special chars: "quotes", <tags>, & symbols',
      contexts: ['bug-fix', 'ui/ux']
    };
    const formatter = new TerminalWaymarkFormatter();
    const output = formatter.format(specialWaymark);
    
    expect(output).toContain('Special chars');
    expect(output).toContain('bug-fix');
    expect(output).toContain('ui/ux');
  });
});