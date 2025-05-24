// :ga:tldr Core type definitions for grepa anchor scanning and reporting

export type AnchorPattern = string & { readonly __brand: 'AnchorPattern' };
export type FilePath = string & { readonly __brand: 'FilePath' };
export type LineNumber = number & { readonly __brand: 'LineNumber' };
export type TagName = string & { readonly __brand: 'TagName' };

export interface AnchorMatch {
  readonly file: FilePath;
  readonly line: LineNumber;
  readonly tag: TagName;
  readonly fullMatch: string;
}

export interface TagStatistics {
  readonly count: number;
  readonly files: Record<string, readonly LineNumber[]>;
  readonly firstSeen: {
    readonly file: FilePath;
    readonly line: LineNumber;
  };
}

export interface FileStatistics {
  readonly totalAnchors: number;
  readonly tags: Record<string, number>;
  readonly lines: readonly LineNumber[];
}

export interface ScanResult {
  readonly tags: Record<string, TagStatistics>;
  readonly files: Record<string, FileStatistics>;
  readonly totalAnchors: number;
  readonly anchor: AnchorPattern;
}

export interface ScanSummary {
  readonly totalAnchors: number;
  readonly uniqueTags: number;
  readonly filesWithAnchors: number;
}

export interface TopTag {
  readonly tag: TagName;
  readonly count: number;
  readonly fileCount: number;
}

export interface TopFile {
  readonly file: FilePath;
  readonly anchors: number;
  readonly uniqueTags: number;
}

export interface InventoryReport {
  readonly _comment: string;
  readonly generated: string;
  readonly anchor: AnchorPattern;
  readonly summary: ScanSummary;
  readonly tags: Record<string, TagStatistics>;
  readonly files: Record<string, FileStatistics>;
  readonly topTags: readonly TopTag[];
  readonly topFiles: readonly TopFile[];
}

export type OutputFormat = 'json' | 'compact' | 'summary';
export type OutputDestination = 'stdout' | 'file';

export interface OutputOptions {
  readonly format: OutputFormat;
  readonly destination: OutputDestination;
  readonly indent?: number;
  readonly color?: boolean;
  readonly includeMetadata?: boolean;
  readonly file?: FilePath;
}

export interface ScanOptions {
  readonly anchor: AnchorPattern;
  readonly ignorePatterns: readonly string[];
  readonly ignoreExamples: boolean;
  readonly respectGitignore: boolean;
}

// Brand type constructors
export const createAnchorPattern = (pattern: string): AnchorPattern => 
  pattern as AnchorPattern;

export const createFilePath = (path: string): FilePath => 
  path as FilePath;

export const createLineNumber = (line: number): LineNumber => 
  line as LineNumber;

export const createTagName = (tag: string): TagName => 
  tag as TagName;