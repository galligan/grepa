// :A: tldr Unified formatter interface for all output types
import type { SearchResult, ParseResult } from '@grepa/types';

// :A: api input types for formatter
export type FormatterInput = 
  | { type: 'search'; data: SearchResult[] }
  | { type: 'list'; data: SearchResult[] }
  | { type: 'parse'; data: { file: string; result: ParseResult } }
  | { type: 'markers'; data: string[] };

// :A: api unified formatter interface
export interface IFormatter {
  format(input: FormatterInput): string;
}