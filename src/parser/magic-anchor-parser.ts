// :A: tldr Core parser for Magic Anchor syntax (:A: marker prose)
import { MagicAnchor, ParseResult, ParseError } from '../types/index.js';
import { Result, success, failure } from '../lib/result.js';
import { makeError } from '../lib/error.js';
import { parseInputSchema } from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';

/**
 * Markdown context tracking for code block detection
 */
interface MarkdownContext {
  inFencedCodeBlock: boolean;
  fenceType?: string; // '```' or '~~~'
  inIndentedCodeBlock: boolean;
}

/**
 * Parser for Magic Anchor syntax (`:A: marker prose`).
 * Handles both sync and async parsing with Result pattern support.
 * Supports markdown-aware parsing to ignore anchors inside code blocks.
 */
export class MagicAnchorParser {
  // :A: api regex pattern for matching anchor syntax
  private static readonly ANCHOR_PATTERN = /:A: ([^]*?)(?=\n|$)/g;
  private static readonly MAX_MARKERS_PER_LINE = 10;
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  // :A: ctx markdown code block patterns
  private static readonly FENCED_CODE_BLOCK_PATTERN = /^(\s*)(```|~~~)/;
  private static readonly INDENTED_CODE_BLOCK_PATTERN = /^    /; // 4+ spaces
  
  /**
   * Parse content for Magic Anchors using Result pattern.
   * @param content - The text content to parse
   * @param filename - Optional filename for context
   * @returns Result containing parsed anchors or error
   */
  // :A: api main parsing method with Result pattern
  static parseWithResult(content: string, filename?: string): Result<ParseResult> {
    // :A: ctx validate input with Zod
    const inputValidation = parseInputSchema.safeParse({ content, filename });
    if (!inputValidation.success) {
      return failure(fromZod(inputValidation.error));
    }

    // :A: ctx check file size limit
    if (content.length > this.MAX_FILE_SIZE) {
      return failure(makeError(
        'file.tooLarge',
        `File exceeds maximum size of ${this.MAX_FILE_SIZE} bytes`
      ));
    }

    try {
      const result = this.parse(content, filename);
      return success(result);
    } catch (error) {
      return failure(makeError(
        'parse.invalidSyntax',
        `Failed to parse content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      ));
    }
  }
  
  /**
   * Parse content for Magic Anchors (legacy sync method).
   * @param content - The text content to parse
   * @param filename - Optional filename for context
   * @returns ParseResult with anchors and errors arrays
   */
  // :A: api legacy parsing method for backward compatibility
  static parse(content: string, filename?: string): ParseResult {
    const anchors: MagicAnchor[] = [];
    const errors: ParseError[] = [];
    const lines = content.split('\n');
    
    // :A: ctx determine if this is a markdown file
    const isMarkdown = filename ? this.isMarkdownFile(filename) : false;
    let markdownContext: MarkdownContext | undefined;
    
    if (isMarkdown) {
      markdownContext = {
        inFencedCodeBlock: false,
        inIndentedCodeBlock: false
      };
    }
    
    lines.forEach((line, lineIndex) => {
      // :A: ctx update markdown context if needed
      if (isMarkdown && markdownContext) {
        this.updateMarkdownContext(line, markdownContext);
      }
      
      // :A: ctx skip anchor detection if inside code block
      const shouldSkipLine = isMarkdown && markdownContext && this.shouldSkipAnchorDetection(line, markdownContext);
      
      if (!shouldSkipLine) {
        const anchorMatch = this.findAnchorInLine(line, lineIndex + 1);
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
      }
    });
    
    return { anchors, errors };
  }
  
  // :A: api parse single line for anchor content
  private static findAnchorInLine(line: string, lineNumber: number): {
    anchor?: MagicAnchor;
    error?: ParseError;
  } | null {
    // :A: ctx look for :A: pattern anywhere in the line
    const anchorIndex = line.indexOf(':A:');
    if (anchorIndex === -1) {
      return null;
    }
    
    // :A: ctx extract everything after :A: (including the space)
    const afterAnchor = line.substring(anchorIndex + 3);
    
    // :A: sec validate required space after :A:
    if (!afterAnchor.startsWith(' ')) {
      return {
        error: {
          line: lineNumber,
          column: anchorIndex + 4,
          message: 'Missing required space after :A:',
          raw: line
        }
      };
    }
    
    // :A: ctx extract payload (everything after the space)
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
    
    // :A: ctx parse markers and prose from payload
    const { markers, prose } = this.parsePayload(payload);
    
    return {
      anchor: {
        line: lineNumber,
        column: anchorIndex + 1,
        raw: line,
        markers,
        ...(prose ? { prose } : {})
      }
    };
  }
  
  // :A: api extract markers and prose from payload string
  private static parsePayload(payload: string): { markers: string[]; prose?: string } {
    // :A: ctx use regex to match marker patterns, then everything else is prose
    // :A: ctx markers: word1, word2, word3 followed by space and prose
    const markerPattern = /^([a-zA-Z0-9_@-]+(?:\([^)]*\))?(?:,\s*[a-zA-Z0-9_@-]+(?:\([^)]*\))?)*)\s+(.+)$/;
    const match = payload.match(markerPattern);
    
    if (match && match[1]) {
      // :A: ctx found markers followed by prose
      const markersStr = match[1]!;
      const prose = match[2];
      const trimmedProse = prose?.trim();
      return {
        markers: this.parseMarkers(markersStr),
        ...(trimmedProse ? { prose: trimmedProse } : {})
      };
    }
    
    // :A: ctx no prose found, entire payload is markers
    return {
      markers: this.parseMarkers(payload)
    };
  }
  
  // :A: api split comma-separated markers
  private static parseMarkers(markersStr: string): string[] {
    return markersStr
      .split(',')
      .map(marker => marker.trim())
      .filter(marker => marker.length > 0);
  }
  
  // :A: api convenience method to find anchors by marker
  static findByMarker(anchors: MagicAnchor[], marker: string): MagicAnchor[] {
    return anchors.filter(anchor => 
      anchor.markers.some(m => m === marker || m.startsWith(`${marker}(`))
    );
  }
  
  // :A: api convenience method to find anchors by pattern
  static findByPattern(anchors: MagicAnchor[], pattern: RegExp): MagicAnchor[] {
    return anchors.filter(anchor =>
      anchor.markers.some(marker => pattern.test(marker)) ||
      (anchor.prose && pattern.test(anchor.prose))
    );
  }
  
  // :A: api check if file is markdown based on extension
  private static isMarkdownFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.md') || filename.toLowerCase().endsWith('.markdown');
  }
  
  // :A: api update markdown context based on current line
  private static updateMarkdownContext(line: string, context: MarkdownContext): void {
    // :A: ctx handle fenced code blocks (``` or ~~~)
    const fenceMatch = line.match(this.FENCED_CODE_BLOCK_PATTERN);
    if (fenceMatch) {
      const fenceType = fenceMatch[2]!; // '```' or '~~~'
      
      if (context.inFencedCodeBlock) {
        // :A: ctx check if this closes the current fence
        if (context.fenceType === fenceType) {
          context.inFencedCodeBlock = false;
          context.fenceType = undefined;
        }
        // :A: ctx if different fence type, ignore (nested or within code)
      } else {
        // :A: ctx start new fenced code block
        context.inFencedCodeBlock = true;
        context.fenceType = fenceType;
      }
    }
    
    // :A: ctx handle indented code blocks (only when not in fenced blocks)
    if (!context.inFencedCodeBlock) {
      const isIndented = this.INDENTED_CODE_BLOCK_PATTERN.test(line);
      const isEmpty = line.trim().length === 0;
      
      if (isIndented) {
        context.inIndentedCodeBlock = true;
      } else if (!isEmpty) {
        // :A: ctx non-empty, non-indented line ends indented code block
        context.inIndentedCodeBlock = false;
      }
      // :A: ctx empty lines don't change indented code block state
    }
  }
  
  // :A: api determine if anchor detection should be skipped for this line
  private static shouldSkipAnchorDetection(line: string, context: MarkdownContext): boolean {
    // :A: ctx skip if in any type of code block
    if (context.inFencedCodeBlock || context.inIndentedCodeBlock) {
      return true;
    }
    
    // :A: ctx check for inline code spans (backticks)
    return this.hasInlineCodeWithAnchor(line);
  }
  
  // :A: api check if line has :A: pattern inside inline code spans
  private static hasInlineCodeWithAnchor(line: string): boolean {
    // :A: ctx find all backtick spans in the line
    const backtickPattern = /`([^`]*)`/g;
    let match;
    
    while ((match = backtickPattern.exec(line)) !== null) {
      const codeContent = match[1]!;
      if (codeContent.includes(':A:')) {
        return true;
      }
    }
    
    return false;
  }
}