// :ga:tldr Process and aggregate anchor matches into structured results

import type { 
  AnchorMatch, 
  ScanResult, 
  TagStatistics, 
  FileStatistics
} from '../types/index.js';

export class MatchProcessor {
  processMatches(matches: readonly AnchorMatch[]): ScanResult {
    const tags: Record<string, TagStatistics> = {};
    const files: Record<string, FileStatistics> = {};

    for (const match of matches) {
      this.processTag(tags, match);
      this.processFile(files, match);
    }

    // Sort line numbers in each collection
    this.sortResults(tags, files);

    return {
      tags,
      files,
      totalAnchors: matches.length,
      anchor: matches[0]?.fullMatch ? this.extractAnchorPattern(matches[0].fullMatch) : ':ga:' as any
    };
  }

  private processTag(tags: Record<string, TagStatistics>, match: AnchorMatch): void {
    const tagKey = match.tag;
    
    if (!tags[tagKey]) {
      tags[tagKey] = {
        count: 0,
        files: {},
        firstSeen: {
          file: match.file,
          line: match.line
        }
      };
    }

    const tag = tags[tagKey]!;
    (tag as any).count++;

    if (!tag.files[match.file]) {
      (tag.files as any)[match.file] = [];
    }
    
    (tag.files[match.file] as any).push(match.line);
  }

  private processFile(files: Record<string, FileStatistics>, match: AnchorMatch): void {
    const fileKey = match.file;
    
    if (!files[fileKey]) {
      files[fileKey] = {
        totalAnchors: 0,
        tags: {},
        lines: []
      };
    }

    const file = files[fileKey]!;
    (file as any).totalAnchors++;
    (file.tags as any)[match.tag] = (file.tags[match.tag] || 0) + 1;
    (file.lines as any).push(match.line);
  }

  private sortResults(
    tags: Record<string, TagStatistics>, 
    files: Record<string, FileStatistics>
  ): void {
    // Sort line numbers in each tag's files
    for (const tag of Object.values(tags)) {
      for (const lines of Object.values(tag.files)) {
        (lines as any).sort((a: number, b: number) => a - b);
      }
    }

    // Sort line numbers in each file
    for (const file of Object.values(files)) {
      (file.lines as any).sort((a: number, b: number) => a - b);
    }
  }

  private extractAnchorPattern(fullMatch: string): string {
    const match = fullMatch.match(/^:[^:]+:/);
    return match ? match[0] : ':ga:';
  }
}