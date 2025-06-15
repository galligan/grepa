// ::: tldr JSON formatters for all data types
import type { SearchResult, ParseResult, Waymark } from '@waymark/types';
import type {
  ISearchResultFormatter,
  IWaymarkFormatter,
  IWaymarkListFormatter,
  IParseResultFormatter,
} from '../interfaces';

export class JsonSearchResultFormatter implements ISearchResultFormatter {
  format(results: SearchResult[]): string {
    return JSON.stringify(results, null, 2);
  }
}

export class JsonWaymarkFormatter implements IWaymarkFormatter {
  format(waymark: Waymark): string {
    return JSON.stringify(waymark, null, 2);
  }
}

export class JsonWaymarkListFormatter implements IWaymarkListFormatter {
  format(waymarks: Waymark[]): string {
    return JSON.stringify(waymarks, null, 2);
  }
}

export class JsonParseResultFormatter implements IParseResultFormatter {
  format(result: ParseResult): string {
    return JSON.stringify(result, null, 2);
  }
}