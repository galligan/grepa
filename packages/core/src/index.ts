// :ga:tldr Public API exports for @grepa/core package

// Types
export type * from './types/index.js';

// Scanner
export { RipgrepScanner, RipgrepError } from './scanner/ripgrep.js';
export { MatchProcessor } from './scanner/processor.js';

// Configuration
export { ConfigLoader, ConfigError } from './config/loader.js';
export { ConfigSchema, type Config } from './config/schema.js';

// Reporter
export { ReportGenerator } from './reporter/generator.js';

// Main scanner class that orchestrates everything
import { RipgrepScanner } from './scanner/ripgrep.js';
import { MatchProcessor } from './scanner/processor.js';
import { ConfigLoader } from './config/loader.js';
import { ReportGenerator } from './reporter/generator.js';

export class GrepaScanner {
  private readonly scanner: RipgrepScanner;
  private readonly processor: MatchProcessor;
  private readonly configLoader: ConfigLoader;
  private readonly reportGenerator: ReportGenerator;

  constructor(cwd?: string) {
    this.scanner = new RipgrepScanner(cwd);
    this.processor = new MatchProcessor();
    this.configLoader = new ConfigLoader(cwd);
    this.reportGenerator = new ReportGenerator();
  }

  async scan(options: import('./types/index.js').ScanOptions) {
    const matches = await this.scanner.scan(options);
    return this.processor.processMatches(matches);
  }

  generateReport(scanResult: import('./types/index.js').ScanResult) {
    return this.reportGenerator.generateInventoryReport(scanResult);
  }

  loadConfig(configPath?: string) {
    return this.configLoader.loadConfig(configPath);
  }

  resolveIgnorePatterns(patterns: readonly string[], config: import('./config/schema.js').Config) {
    return this.configLoader.resolveIgnorePatterns(patterns, config);
  }
}