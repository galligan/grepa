// :ga:tldr Output formatters for different CLI display modes

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import type { 
  InventoryReport, 
  ScanResult, 
  OutputFormat,
  FilePath 
} from '@grepa/core';

export interface FormatOptions {
  readonly indent?: number;
  readonly color?: boolean;
  readonly includeMetadata?: boolean;
}

export class OutputFormatter {
  formatReport(
    report: InventoryReport, 
    format: OutputFormat, 
    options: FormatOptions = {}
  ): string {
    switch (format) {
      case 'json':
        return this.formatJson(report, options);
      case 'compact':
        return this.formatCompact(report, options);
      case 'summary':
        return this.formatSummary(report, options);
      default:
        throw new Error(`Unknown output format: ${format}`);
    }
  }

  saveToFile(content: string, filePath: FilePath): void {
    try {
      // Ensure directory exists
      const dir = dirname(filePath);
      mkdirSync(dir, { recursive: true });
      
      // Write file
      writeFileSync(filePath, content, 'utf8');
    } catch (error) {
      throw new Error(
        `Failed to save output to ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private formatJson(report: InventoryReport, options: FormatOptions): string {
    const indent = options.indent ?? 2;
    return JSON.stringify(report, null, indent);
  }

  private formatCompact(report: InventoryReport, options: FormatOptions): string {
    const lines: string[] = [];
    
    lines.push(`Anchors: ${report.summary.totalAnchors}, Tags: ${report.summary.uniqueTags}, Files: ${report.summary.filesWithAnchors}`);
    
    if (report.topTags.length > 0) {
      lines.push('');
      lines.push('Top tags:');
      for (const tag of report.topTags.slice(0, 5)) {
        lines.push(`  ${tag.tag}: ${tag.count} (${tag.fileCount} files)`);
      }
    }

    return lines.join('\n');
  }

  private formatSummary(report: InventoryReport, options: FormatOptions): string {
    const lines: string[] = [];
    
    lines.push('Grep-anchor inventory summary');
    lines.push('==============================');
    lines.push('');
    lines.push(`Anchor pattern: ${report.anchor}`);
    lines.push(`Generated: ${new Date(report.generated).toLocaleString()}`);
    lines.push('');
    lines.push(`Total anchors: ${report.summary.totalAnchors}`);
    lines.push(`Unique tags: ${report.summary.uniqueTags}`);
    lines.push(`Files with anchors: ${report.summary.filesWithAnchors}`);
    
    if (report.topTags.length > 0) {
      lines.push('');
      lines.push('Top tags:');
      for (const tag of report.topTags.slice(0, 10)) {
        lines.push(`  ${tag.tag.padEnd(15)} ${tag.count.toString().padStart(4)} uses in ${tag.fileCount} file(s)`);
      }
    }

    if (report.topFiles.length > 0) {
      lines.push('');
      lines.push('Top files:');
      for (const file of report.topFiles.slice(0, 10)) {
        lines.push(`  ${file.anchors.toString().padStart(3)} anchors  ${file.file}`);
      }
    }

    return lines.join('\n');
  }
}