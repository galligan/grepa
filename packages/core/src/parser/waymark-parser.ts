// ::: tldr Core parser for waymark syntax (::: marker prose)
import type { Waymark, ParseResult, ParseError } from '@waymark/types';
import { type Result, success, failure } from '../lib/result.js';
import { makeError } from '../lib/error.js';
import { parseInputSchema } from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';

/**
 * Parser for waymark syntax (`::: marker prose`).
 * Handles both sync and async parsing with Result pattern support.
 */
export class WaymarkParser {
  // ::: api parser configuration constants
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  /**
   * Parse content for waymarks using Result pattern.
   * @param content - The text content to parse
   * @param filename - Optional filename for context
   * @returns Result containing parsed anchors or error
   */
  // ::: api main parsing method with Result pattern
  static parseWithResult(content: string, filename?: string): Result<ParseResult> {
    // ::: ctx validate input with Zod
    const inputValidation = parseInputSchema.safeParse({ content, filename });
    if (!inputValidation.success) {
      return failure(fromZod(inputValidation.error));
    }

    // ::: ctx check file size limit using byte length to prevent multi-byte character bypass
    const contentByteLength = Buffer.byteLength(content, 'utf8');
    if (contentByteLength > WaymarkParser.MAX_FILE_SIZE) {
      return failure(makeError(
        'file.tooLarge',
        `File exceeds maximum size of ${Math.round(contentByteLength / 1024 / 1024)}MB (limit: ${Math.round(WaymarkParser.MAX_FILE_SIZE / 1024 / 1024)}MB)`
      ));
    }

    const anchors: Waymark[] = [];
    const errors: ParseError[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      const anchorMatch = WaymarkParser.findAnchorInLine(line, lineIndex + 1);
      if (anchorMatch) {
        if (anchorMatch.error) {
          errors.push(anchorMatch.error);
        } else if (anchorMatch.anchor) {
          if (filename) {
            anchorMatch.anchor.file = filename;
          }
          anchors.push(anchorMatch.anchor);
        }
      }
    });
    
    return success({ anchors, errors });
  }
  
  
  // ::: api parse single line for anchor content
  private static findAnchorInLine(line: string, lineNumber: number): {
    anchor?: Waymark;
    error?: ParseError;
  } | null {
    // ::: ctx look for ::: pattern anywhere in the line
    const anchorIndex = line.indexOf(':::');
    if (anchorIndex === -1) {
      return null;
    }
    
    // ::: ctx extract everything after ::: (including the space)
    const afterAnchor = line.substring(anchorIndex + 3);
    
    // ::: sec validate required space after :::
    if (!afterAnchor.startsWith(' ')) {
      return {
        error: {
          line: lineNumber,
          column: anchorIndex + 3, // Point to where the space should be
          message: 'Missing required space after :::',
          raw: line
        }
      };
    }
    
    // ::: ctx extract payload (everything after the space)
    const payload = afterAnchor.substring(1).trim();
    if (!payload) {
      return {
        error: {
          line: lineNumber,
          column: anchorIndex + 4,
          message: 'Empty anchor payload',
          raw: line
        }
      };
    }
    
    // ::: ctx parse markers and prose from payload
    const { contexts, prose } = WaymarkParser.parsePayload(payload);
    
    return {
      anchor: {
        line: lineNumber,
        column: anchorIndex + 1,
        raw: line,
        contexts,
        ...(prose ? { prose } : {})
      }
    };
  }
  
  // ::: api extract markers and prose from payload string
  private static parsePayload(payload: string): { contexts: string[]; prose?: string } {
    // ::: ctx safer string-based parsing to avoid ReDoS vulnerability
    // ::: ctx find first space that isn't inside parentheses or after a comma
    let parenDepth = 0;
    let spaceIndex = -1;
    
    for (let i = 0; i < payload.length; i++) {
      const char = payload[i];
      if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        if (parenDepth > 0) parenDepth--; // Prevent negative depth on unmatched parentheses
      } else if (char === ' ' && parenDepth === 0) {
        // ::: ctx check if this space is after a comma (still in marker list)
        let j = i - 1;
        while (j >= 0 && payload[j] === ' ') {
          j--;
        }
        
        if (j >= 0 && payload[j] === ',') {
          // ::: ctx space after comma, still in marker list
          continue;
        }
        
        // ::: ctx check if the next non-space character could be a marker
        let k = i + 1;
        while (k < payload.length && payload[k] === ' ') {
          k++;
        }
        
        if (k < payload.length) {
          // ::: ctx simple heuristic: if next word contains only marker-like characters, skip
          const nextChar = payload[k];
          if (nextChar && /^[a-zA-Z0-9_@-]$/.test(nextChar)) {
            // ::: ctx might still be in markers, look for a better separator
            const restOfLine = payload.substring(k);
            // ::: ctx if we find a comma soon, we're still in markers
            const commaIndex = restOfLine.indexOf(',');
            const nextSpaceIndex = restOfLine.indexOf(' ');
            
            if (commaIndex !== -1 && (nextSpaceIndex === -1 || commaIndex < nextSpaceIndex)) {
              continue;
            }
          }
        }
        
        // ::: ctx this looks like a real separator between markers and prose
        spaceIndex = i;
        break;
      }
    }
    
    if (spaceIndex > 0) {
      // ::: ctx split at the separator
      const markersStr = payload.substring(0, spaceIndex);
      const prose = payload.substring(spaceIndex + 1).trim();
      
      return {
        contexts: WaymarkParser.parseContexts(markersStr),
        ...(prose ? { prose } : {})
      };
    }
    
    // ::: ctx no prose found, entire payload is markers
    return {
      contexts: WaymarkParser.parseContexts(payload)
    };
  }
  
  // ::: api split comma-separated markers handling nested parentheses
  private static parseContexts(contextsStr: string): string[] {
    const contexts: string[] = [];
    let current = '';
    let parenDepth = 0;
    let bracketDepth = 0;
    
    for (let i = 0; i < contextsStr.length; i++) {
      const char = contextsStr[i];
      
      if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        if (parenDepth > 0) parenDepth--;
      } else if (char === '[') {
        bracketDepth++;
      } else if (char === ']') {
        if (bracketDepth > 0) bracketDepth--;
      } else if (char === ',' && parenDepth === 0 && bracketDepth === 0) {
        // ::: ctx top-level comma, split here
        const trimmed = current.trim();
        if (trimmed.length > 0) {
          contexts.push(trimmed);
        }
        current = '';
        continue;
      }
      
      current += char;
    }
    
    // ::: ctx add final marker if any
    const trimmed = current.trim();
    if (trimmed.length > 0) {
      contexts.push(trimmed);
    }
    
    return contexts;
  }
  
  // ::: api convenience method to find waymarks by marker
  static findByContext(anchors: Waymark[], context: string): Waymark[] {
    return anchors.filter(anchor => 
      anchor.contexts.some((c: string) => c === context || c.startsWith(`${context}(`))
    );
  }
  
  // ::: api convenience method to find waymarks by pattern
  static findByPattern(anchors: Waymark[], pattern: RegExp): Waymark[] {
    return anchors.filter(anchor =>
      anchor.contexts.some((context: string) => pattern.test(context)) ||
      (anchor.prose && pattern.test(anchor.prose))
    );
  }
}