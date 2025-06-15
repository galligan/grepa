// ::: tldr CSV formatter for waymark outputs
import type { IFormatter, FormatterInput } from '../interfaces/unified-formatter.interface.js';
import type { SearchResult, Waymark } from '@waymark/types';

export class CSVFormatter implements IFormatter {
  // ::: api format data as CSV
  format(input: FormatterInput): string {
    switch (input.type) {
      case 'search':
        return this.formatSearchResults(input.data);
      case 'list':
        return this.formatListResults(input.data);
      case 'parse':
        return this.formatParseResults(input.data);
      case 'contexts':
        return this.formatContexts(input.data);
      default:
        return this.formatDefault(input);
    }
  }

  // ::: api format search results as CSV
  private formatSearchResults(results: SearchResult[]): string {
    const headers = ['File', 'Line', 'Column', 'Contexts', 'Prose'];
    const rows = [headers];

    for (const result of results) {
      const anchor = result.anchor;
      rows.push([
        this.escapeCsvField(anchor.file || ''),
        anchor.line.toString(),
        anchor.column.toString(),
        this.escapeCsvField(anchor.contexts.join(', ')),
        this.escapeCsvField(anchor.prose || '')
      ]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }

  // ::: api format list results as CSV
  private formatListResults(results: SearchResult[]): string {
    // ::: ctx same format as search results
    return this.formatSearchResults(results);
  }

  // ::: api format parse results as CSV
  private formatParseResults(data: { file: string; result: { anchors: Waymark[]; errors: any[] } }): string {
    const headers = ['File', 'Line', 'Column', 'Contexts', 'Prose', 'Status'];
    const rows = [headers];

    // ::: ctx add anchors
    for (const anchor of data.result.anchors) {
      rows.push([
        this.escapeCsvField(data.file),
        anchor.line.toString(),
        anchor.column.toString(),
        this.escapeCsvField(anchor.contexts.join(', ')),
        this.escapeCsvField(anchor.prose || ''),
        'OK'
      ]);
    }

    // ::: ctx add errors
    for (const error of data.result.errors) {
      rows.push([
        this.escapeCsvField(data.file),
        error.line?.toString() || '',
        error.column?.toString() || '',
        '',
        this.escapeCsvField(error.message),
        'ERROR'
      ]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }

  // ::: api format unique contexts as CSV
  private formatContexts(contexts: string[]): string {
    const headers = ['Context'];
    const rows = [headers];

    for (const context of contexts) {
      rows.push([this.escapeCsvField(context)]);
    }

    return rows.map(row => row.join(',')).join('\n');
  }

  // ::: api format default output
  private formatDefault(input: FormatterInput): string {
    const headers = ['Type', 'Data'];
    const rows = [headers, [input.type, this.escapeCsvField(JSON.stringify(input.data))]];
    return rows.map(row => row.join(',')).join('\n');
  }

  // ::: api escape CSV field values and prevent formula injection
  private escapeCsvField(field: string): string {
    // ::: sec neutralize potential formula-injection payloads (CVE-2014-3524)
    if (/^[=+\-@]/.test(field)) {
      field = `'${field}`;
    }
    
    // ::: ctx if field contains comma, quotes, or newline, wrap in quotes
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      // ::: ctx escape quotes by doubling them
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }
}