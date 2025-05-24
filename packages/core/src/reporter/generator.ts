// :ga:tldr Generate structured reports from scan results

import type { 
  ScanResult, 
  InventoryReport, 
  ScanSummary, 
  TopTag, 
  TopFile 
} from '../types/index.js';

export class ReportGenerator {
  generateInventoryReport(scanResult: ScanResult): InventoryReport {
    const summary = this.generateSummary(scanResult);
    const topTags = this.generateTopTags(scanResult);
    const topFiles = this.generateTopFiles(scanResult);

    return {
      _comment: ":ga:meta Generated grep-anchor inventory - DO NOT EDIT MANUALLY",
      generated: new Date().toISOString(),
      anchor: scanResult.anchor,
      summary,
      tags: scanResult.tags,
      files: scanResult.files,
      topTags,
      topFiles
    };
  }

  private generateSummary(scanResult: ScanResult): ScanSummary {
    return {
      totalAnchors: scanResult.totalAnchors,
      uniqueTags: Object.keys(scanResult.tags).length,
      filesWithAnchors: Object.keys(scanResult.files).length
    };
  }

  private generateTopTags(scanResult: ScanResult, limit: number = 10): readonly TopTag[] {
    return Object.entries(scanResult.tags)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, limit)
      .map(([tag, data]) => ({
        tag: tag as any,
        count: data.count,
        fileCount: Object.keys(data.files).length
      }));
  }

  private generateTopFiles(scanResult: ScanResult, limit: number = 10): readonly TopFile[] {
    return Object.entries(scanResult.files)
      .sort(([, a], [, b]) => b.totalAnchors - a.totalAnchors)
      .slice(0, limit)
      .map(([file, data]) => ({
        file: file as any,
        anchors: data.totalAnchors,
        uniqueTags: Object.keys(data.tags).length
      }));
  }
}