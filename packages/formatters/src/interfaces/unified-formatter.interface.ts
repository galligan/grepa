// ::: tldr Unified formatter interface for all output types
import type { SearchResult, ParseResult } from '@waymark/types';

// ::: api input types for formatter
export type FormatterInput = 
  | { type: 'search'; data: SearchResult[] }
  | { type: 'list'; data: SearchResult[] }
  | { type: 'parse'; data: { file: string; result: ParseResult } }
  | { type: 'contexts'; data: string[] };

// ::: api unified formatter interface
export interface IFormatter {
  format(input: FormatterInput): string;
}