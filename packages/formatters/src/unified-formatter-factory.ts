// ::: tldr Factory for creating unified formatters
import type { IFormatter } from './interfaces/unified-formatter.interface.js';
import { TerminalFormatter } from './formatters/unified-terminal.formatter.js';
import { JsonFormatter } from './formatters/unified-json.formatter.js';
import { CSVFormatter } from './formatters/csv.formatter.js';

export type UnifiedFormatType = 'terminal' | 'json' | 'csv';

/**
 * Creates a formatter instance based on the specified format type.
 * 
 * @param format - The output format type: 'terminal', 'json', or 'csv'
 * @returns Formatter instance implementing IFormatter interface
 * @throws Error if an unknown format is specified
 * 
 * @example
 * ```typescript
 * const terminalFormatter = createFormatter('terminal');
 * const jsonFormatter = createFormatter('json');
 * const csvFormatter = createFormatter('csv');
 * ```
 */
// ::: api create formatter based on type
export function createFormatter(format: UnifiedFormatType = 'terminal'): IFormatter {
  switch (format) {
    case 'terminal':
      return new TerminalFormatter();
    case 'json':
      return new JsonFormatter();
    case 'csv':
      return new CSVFormatter();
    default:
      throw new Error(`Unknown format: ${format satisfies never}`);
  }
}

// ::: api backward compatibility export
export const FormatterFactory = {
  create: createFormatter
};