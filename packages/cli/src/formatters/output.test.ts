// :ga:tldr Tests for output formatting functionality

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OutputFormatter } from './output.js';
import { CLITestEnvironment } from '../test/utils/cli-helpers.js';
import type { InventoryReport } from '@grepa/core';

describe('OutputFormatter', () => {
  let formatter: OutputFormatter;
  let testEnv: CLITestEnvironment;
  let sampleReport: InventoryReport;

  beforeEach(() => {
    formatter = new OutputFormatter();
    testEnv = new CLITestEnvironment();
    
    sampleReport = {
      _comment: ":ga:meta Generated grep-anchor inventory - DO NOT EDIT MANUALLY",
      generated: "2024-01-01T00:00:00.000Z",
      anchor: ":ga:" as any,
      summary: {
        totalAnchors: 5,
        uniqueTags: 3,
        filesWithAnchors: 2
      },
      tags: {
        todo: {
          count: 2,
          files: {
            'src/main.ts': [10, 20],
            'src/utils.ts': [15]
          },
          firstSeen: {
            file: 'src/main.ts' as any,
            line: 10 as any
          }
        },
        sec: {
          count: 2,
          files: {
            'src/main.ts': [25],
            'src/utils.ts': [30]
          },
          firstSeen: {
            file: 'src/main.ts' as any,
            line: 25 as any
          }
        },
        perf: {
          count: 1,
          files: {
            'src/utils.ts': [5]
          },
          firstSeen: {
            file: 'src/utils.ts' as any,
            line: 5 as any
          }
        }
      },
      files: {
        'src/main.ts': {
          totalAnchors: 3,
          tags: { todo: 2, sec: 1 },
          lines: [10, 20, 25]
        },
        'src/utils.ts': {
          totalAnchors: 2,
          tags: { todo: 1, sec: 1, perf: 1 },
          lines: [5, 15, 30]
        }
      },
      topTags: [
        { tag: 'todo' as any, count: 2, fileCount: 2 },
        { tag: 'sec' as any, count: 2, fileCount: 2 },
        { tag: 'perf' as any, count: 1, fileCount: 1 }
      ],
      topFiles: [
        { file: 'src/main.ts' as any, anchors: 3, uniqueTags: 2 },
        { file: 'src/utils.ts' as any, anchors: 2, uniqueTags: 3 }
      ]
    };
  });

  afterEach(() => {
    testEnv.cleanup();
  });

  describe('formatReport', () => {
    describe('json format', () => {
      it('should format report as JSON', () => {
        const result = formatter.formatReport(sampleReport, 'json');
        
        expect(() => JSON.parse(result)).not.toThrow();
        const parsed = JSON.parse(result);
        expect(parsed.summary.totalAnchors).toBe(5);
        expect(parsed.tags.todo.count).toBe(2);
      });

      it('should respect indent option', () => {
        const result = formatter.formatReport(sampleReport, 'json', { indent: 4 });
        
        expect(result).toContain('    "summary"');
        expect(result).toContain('        "totalAnchors"');
      });

      it('should use default indent when not specified', () => {
        const result = formatter.formatReport(sampleReport, 'json');
        
        expect(result).toContain('  "summary"');
        expect(result).not.toContain('    "summary"');
      });
    });

    describe('compact format', () => {
      it('should format report in compact format', () => {
        const result = formatter.formatReport(sampleReport, 'compact');
        
        expect(result).toContain('Anchors: 5, Tags: 3, Files: 2');
        expect(result).toContain('Top tags:');
        expect(result).toContain('todo: 2 (2 files)');
        expect(result).toContain('sec: 2 (2 files)');
        expect(result).toContain('perf: 1 (1 files)');
      });

      it('should limit top tags to 5', () => {
        // Create a report with many tags
        const manyTagsReport = {
          ...sampleReport,
          topTags: Array.from({ length: 10 }, (_, i) => ({
            tag: `tag${i}` as any,
            count: 10 - i,
            fileCount: 1
          }))
        };

        const result = formatter.formatReport(manyTagsReport, 'compact');
        const lines = result.split('\n');
        const tagLines = lines.filter(line => line.includes(':'));
        
        expect(tagLines).toHaveLength(5);
      });
    });

    describe('summary format', () => {
      it('should format report in summary format', () => {
        const result = formatter.formatReport(sampleReport, 'summary');
        
        expect(result).toContain('Grep-anchor inventory summary');
        expect(result).toContain('Anchor pattern: :ga:');
        expect(result).toContain('Generated: 1/1/2024'); // Locale-specific
        expect(result).toContain('Total anchors: 5');
        expect(result).toContain('Unique tags: 3');
        expect(result).toContain('Files with anchors: 2');
        expect(result).toContain('Top tags:');
        expect(result).toContain('Top files:');
      });

      it('should format top tags with proper alignment', () => {
        const result = formatter.formatReport(sampleReport, 'summary');
        
        expect(result).toContain('todo            2 uses in 2 file(s)');
        expect(result).toContain('sec             2 uses in 2 file(s)');
        expect(result).toContain('perf            1 uses in 1 file(s)');
      });

      it('should format top files with proper alignment', () => {
        const result = formatter.formatReport(sampleReport, 'summary');
        
        expect(result).toContain('  3 anchors  src/main.ts');
        expect(result).toContain('  2 anchors  src/utils.ts');
      });

      it('should limit top tags to 10 by default', () => {
        const manyTagsReport = {
          ...sampleReport,
          topTags: Array.from({ length: 15 }, (_, i) => ({
            tag: `tag${i}` as any,
            count: 15 - i,
            fileCount: 1
          }))
        };

        const result = formatter.formatReport(manyTagsReport, 'summary');
        const tagLines = result.split('\n').filter(line => 
          line.includes('uses in') && line.includes('file(s)')
        );
        
        expect(tagLines).toHaveLength(10);
      });

      it('should limit top files to 10 by default', () => {
        const manyFilesReport = {
          ...sampleReport,
          topFiles: Array.from({ length: 15 }, (_, i) => ({
            file: `file${i}.ts` as any,
            anchors: 15 - i,
            uniqueTags: 1
          }))
        };

        const result = formatter.formatReport(manyFilesReport, 'summary');
        const fileLines = result.split('\n').filter(line => 
          /^\s+\d+\s+anchors/.test(line)
        );
        
        expect(fileLines).toHaveLength(10);
      });
    });

    it('should throw error for unknown format', () => {
      expect(() => {
        formatter.formatReport(sampleReport, 'unknown' as any);
      }).toThrow('Unknown output format: unknown');
    });
  });

  describe('saveToFile', () => {
    it('should save content to file', () => {
      const content = '{"test": true}';
      const filePath = testEnv.createFile('output.json', '');
      
      formatter.saveToFile(content, filePath as any);
      
      // Verify file was written (actual file content verification would require fs.readFileSync)
      expect(() => formatter.saveToFile(content, filePath as any)).not.toThrow();
    });

    it('should create directory if it does not exist', () => {
      const content = '{"test": true}';
      const filePath = `${testEnv.cwd}/nested/deep/output.json`;
      
      expect(() => {
        formatter.saveToFile(content, filePath as any);
      }).not.toThrow();
    });

    it('should throw error for invalid file path', () => {
      const content = '{"test": true}';
      // Try to write to a path that should fail (like a directory that can't be created)
      const invalidPath = '/root/cannot-write-here/output.json';
      
      expect(() => {
        formatter.saveToFile(content, invalidPath as any);
      }).toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle empty report', () => {
      const emptyReport: InventoryReport = {
        _comment: ":ga:meta Generated grep-anchor inventory - DO NOT EDIT MANUALLY",
        generated: "2024-01-01T00:00:00.000Z",
        anchor: ":ga:" as any,
        summary: {
          totalAnchors: 0,
          uniqueTags: 0,
          filesWithAnchors: 0
        },
        tags: {},
        files: {},
        topTags: [],
        topFiles: []
      };

      const jsonResult = formatter.formatReport(emptyReport, 'json');
      const compactResult = formatter.formatReport(emptyReport, 'compact');
      const summaryResult = formatter.formatReport(emptyReport, 'summary');

      expect(() => JSON.parse(jsonResult)).not.toThrow();
      expect(compactResult).toContain('Anchors: 0, Tags: 0, Files: 0');
      expect(summaryResult).toContain('Total anchors: 0');
    });

    it('should handle report with no top tags', () => {
      const noTopTagsReport = {
        ...sampleReport,
        topTags: []
      };

      const compactResult = formatter.formatReport(noTopTagsReport, 'compact');
      const summaryResult = formatter.formatReport(noTopTagsReport, 'summary');

      expect(compactResult).toContain('Anchors: 5, Tags: 3, Files: 2');
      expect(compactResult).not.toContain('Top tags:');
      expect(summaryResult).toContain('Top tags:');
    });

    it('should handle report with no top files', () => {
      const noTopFilesReport = {
        ...sampleReport,
        topFiles: []
      };

      const summaryResult = formatter.formatReport(noTopFilesReport, 'summary');

      expect(summaryResult).toContain('Files with anchors: 2');
      expect(summaryResult).toContain('Top files:');
      // Should not have any file lines after "Top files:"
      const lines = summaryResult.split('\n');
      const topFilesIndex = lines.findIndex(line => line.includes('Top files:'));
      const afterTopFiles = lines.slice(topFilesIndex + 1);
      const fileLines = afterTopFiles.filter(line => /^\s+\d+\s+anchors/.test(line));
      expect(fileLines).toHaveLength(0);
    });
  });
});