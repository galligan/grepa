// ::: tldr Terminal formatters with color support for human-readable output
import chalk from 'chalk';
import type { SearchResult, ParseResult, Waymark } from '@waymark/types';
import type {
  ISearchResultFormatter,
  IWaymarkFormatter,
  IWaymarkListFormatter,
  IParseResultFormatter,
  FormatterOptions,
} from '../interfaces';

export class TerminalSearchResultFormatter implements ISearchResultFormatter {
  constructor(private options: FormatterOptions = {}) {}

  format(results: SearchResult[]): string {
    if (results.length === 0) {
      return chalk.yellow('No anchors found');
    }

    const output: string[] = [];

    results.forEach(result => {
      output.push(this.formatWaymark(result.anchor));
      
      if (this.options.context && this.options.context > 0 && result.context !== undefined) {
        // ::: ctx show context lines before
        result.context.before.forEach((line: string, index: number) => {
          const lineNum = Math.max(1, result.anchor.line - (this.options.context ?? 0) + index);
          output.push(chalk.dim(`    ${lineNum}: ${line}`));
        });
        
        // ::: ctx show context lines after  
        result.context.after.forEach((line: string, index: number) => {
          const lineNum = result.anchor.line + index + 1;
          output.push(chalk.dim(`    ${lineNum}: ${line}`));
        });
        
        output.push(''); // ::: ctx blank line between results
      }
    });

    return output.join('\n');
  }

  private formatWaymark(waymark: Waymark): string {
    const location = waymark.file !== undefined ? `${waymark.file}:${waymark.line}` : `Line ${waymark.line}`;
    const contexts = waymark.contexts.map((c: string) => chalk.cyan(c)).join(', ');
    const prose = waymark.prose !== undefined ? chalk.gray(` - ${waymark.prose}`) : '';
    
    return `${chalk.dim(location)} ${contexts}${prose}`;
  }
}

export class TerminalWaymarkFormatter implements IWaymarkFormatter {
  format(waymark: Waymark): string {
    const location = waymark.file !== undefined ? `${waymark.file}:${waymark.line}` : `Line ${waymark.line}`;
    const contexts = waymark.contexts.map((c: string) => chalk.cyan(c)).join(', ');
    const prose = waymark.prose !== undefined ? chalk.gray(` - ${waymark.prose}`) : '';
    
    return `${chalk.dim(location)} ${contexts}${prose}`;
  }
}

export class TerminalParseResultFormatter implements IParseResultFormatter {
  constructor(private waymarkFormatter: TerminalWaymarkFormatter = new TerminalWaymarkFormatter()) {}

  format(result: ParseResult): string {
    const output: string[] = [];
    
    output.push(chalk.green(`✓ ${result.anchors.length} anchors found`));
    
    if (result.errors.length > 0) {
      output.push(chalk.red(`⚠ ${result.errors.length} errors:`));
      result.errors.forEach((error: any) => {
        output.push(chalk.red(`  Line ${error.line}: ${error.message}`));
      });
    }

    result.anchors.forEach((waymark: Waymark) => {
      output.push(this.waymarkFormatter.format(waymark));
    });

    return output.join('\n');
  }
}

export class TerminalWaymarkListFormatter implements IWaymarkListFormatter {
  constructor(
    private options: FormatterOptions = {},
    private waymarkFormatter: TerminalWaymarkFormatter = new TerminalWaymarkFormatter()
  ) {}

  format(waymarks: Waymark[]): string {
    if (waymarks.length === 0) {
      return chalk.yellow('No anchors found');
    }

    const output: string[] = [
      chalk.green(`Found ${waymarks.length} anchor(s):\n`)
    ];
    
    if (this.options.contextsOnly) {
      const uniqueContexts = [...new Set(waymarks.flatMap(w => w.contexts))];
      uniqueContexts.sort().forEach(context => {
        output.push(chalk.cyan(`• ${context}`));
      });
    } else {
      waymarks.forEach(waymark => {
        output.push(this.waymarkFormatter.format(waymark));
      });
    }

    return output.join('\n');
  }
}