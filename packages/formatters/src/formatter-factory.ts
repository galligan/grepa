// ::: tldr Factory for creating appropriate formatters based on format type
import type {
  ISearchResultFormatter,
  IWaymarkFormatter,
  IWaymarkListFormatter,
  IParseResultFormatter,
  FormatterOptions,
} from './interfaces/index.js';
import {
  JsonSearchResultFormatter,
  JsonWaymarkFormatter,
  JsonWaymarkListFormatter,
  JsonParseResultFormatter,
} from './formatters/json.formatter.js';
import {
  TerminalSearchResultFormatter,
  TerminalWaymarkFormatter,
  TerminalParseResultFormatter,
  TerminalWaymarkListFormatter,
} from './formatters/terminal.formatter.js';

export type FormatType = 'json' | 'terminal';

export class FormatterFactory {
  private static createFormatter<T>(
    format: FormatType,
    jsonCtor: new () => T,
    terminalCtor: new (options?: FormatterOptions) => T,
    options?: FormatterOptions
  ): T {
    switch (format) {
      case 'json':
        return new jsonCtor();
      case 'terminal':
        return new terminalCtor(options);
      default:
        throw new Error(`Unknown format: ${format satisfies never}`);
    }
  }

  static createSearchResultFormatter(format: FormatType, options?: FormatterOptions): ISearchResultFormatter {
    return this.createFormatter(
      format,
      JsonSearchResultFormatter,
      TerminalSearchResultFormatter,
      options
    );
  }

  static createWaymarkFormatter(format: FormatType): IWaymarkFormatter {
    return this.createFormatter(
      format,
      JsonWaymarkFormatter,
      TerminalWaymarkFormatter
    );
  }

  static createParseResultFormatter(format: FormatType): IParseResultFormatter {
    switch (format) {
      case 'json':
        return new JsonParseResultFormatter();
      case 'terminal':
        return new TerminalParseResultFormatter();
      default:
        throw new Error(`Unknown format: ${format satisfies never}`);
    }
  }

  static createWaymarkListFormatter(format: FormatType, options?: FormatterOptions): IWaymarkListFormatter {
    switch (format) {
      case 'json':
        return new JsonWaymarkListFormatter();
      case 'terminal':
        return new TerminalWaymarkListFormatter(options);
      default:
        throw new Error(`Unknown format: ${format satisfies never}`);
    }
  }
}