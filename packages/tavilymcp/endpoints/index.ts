import { crawl } from './crawl';
import { extract } from './extract';
import { map } from './map';
import { research } from './research';
import { search } from './search';

export const Tavily = { search, extract, crawl, map, research };

export * from './types';
