// :ga:tldr Implementation of 'grepa list' command with output options

import { Command } from 'commander';
import { 
  GrepaScanner, 
  type OutputFormat,
  type ScanOptions,
  type AnchorPattern 
} from '@grepa/core';
import { OutputFormatter } from '../formatters/output.js';

export interface ListCommandOptions {
  readonly anchor?: string;
  readonly ignore?: string[];
  readonly ignoreExamples?: boolean;
  readonly config?: string;
  readonly format?: OutputFormat;
  readonly print?: boolean;
  readonly save?: string;
  readonly indent?: number;
}

export function createListCommand(): Command {
  const command = new Command('list');
  
  command
    .description('List all grep-anchors in the codebase')
    .option('-a, --anchor <pattern>', 'Anchor pattern to search for', ':ga:')
    .option('-i, --ignore <pattern>', 'Ignore pattern (can be used multiple times)', (value, previous: string[] = []) => {
      return [...previous, value];
    })
    .option('--ignore-examples', 'Ignore code examples in markdown files')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-f, --format <format>', 'Output format: json, compact, summary', 'summary')
    .option('-p, --print', 'Print full JSON to stdout')
    .option('-s, --save <file>', 'Save output to file')
    .option('--indent <number>', 'JSON indentation level', (value) => parseInt(value, 10), 2)
    .action(async (options: ListCommandOptions) => {
      await executeListCommand(options);
    });

  return command;
}

async function executeListCommand(options: ListCommandOptions): Promise<void> {
  try {
    const scanner = new GrepaScanner();
    const formatter = new OutputFormatter();

    // Load configuration
    const config = scanner.loadConfig(options.config);
    
    // Override config with command line options
    const anchor = (options.anchor || config.anchor) as AnchorPattern;
    const ignorePatterns = options.ignore || [];
    const ignoreExamples = options.ignoreExamples ?? config.docsExamples.ignore;
    
    // Resolve ignore patterns
    const allIgnorePatterns = [
      ...scanner.resolveIgnorePatterns(ignorePatterns, config),
      ...scanner.resolveIgnorePatterns(scanner.loadConfig().ignore.custom, config)
    ];

    const scanOptions: ScanOptions = {
      anchor,
      ignorePatterns: allIgnorePatterns,
      ignoreExamples,
      respectGitignore: config.ignore.respectGitignore
    };

    // Perform scan
    const scanResult = await scanner.scan(scanOptions);
    const report = scanner.generateReport(scanResult);

    // Handle --print option (overrides format)
    if (options.print) {
      const jsonOutput = formatter.formatReport(report, 'json', 
        options.indent !== undefined ? { indent: options.indent } : {}
      );
      console.log(jsonOutput);
      return;
    }

    // Handle --save option
    if (options.save) {
      const jsonOutput = formatter.formatReport(report, 'json', 
        options.indent !== undefined ? { indent: options.indent } : {}
      );
      formatter.saveToFile(jsonOutput, options.save as any);
      console.log(`Inventory saved to: ${options.save}`);
      return;
    }

    // Default output based on format
    const format = options.format || 'summary';
    const output = formatter.formatReport(report, format, 
      options.indent !== undefined ? { indent: options.indent } : {}
    );

    console.log(output);

    // Print summary info for non-summary formats
    if (format !== 'summary') {
      console.error(`\nFound ${report.summary.totalAnchors} anchors across ${report.summary.filesWithAnchors} files`);
    }

  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

export { executeListCommand };