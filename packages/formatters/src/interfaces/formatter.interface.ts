// ::: tldr Base formatter interface for all output formatters
import type { SearchResult, ParseResult, Waymark } from '@waymark/types';

export interface IFormatter<T> {
  format(data: T): string;
}

export interface ISearchResultFormatter extends IFormatter<SearchResult[]> {}
export interface IWaymarkFormatter extends IFormatter<Waymark> {}
export interface IWaymarkListFormatter extends IFormatter<Waymark[]> {}
export interface IParseResultFormatter extends IFormatter<ParseResult> {}

export interface FormatterOptions {
  color?: boolean;
  context?: number;
  showFullPath?: boolean;
  contextsOnly?: boolean;
}