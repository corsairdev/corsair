import * as AgentModule from './agent';
import * as CrawlModule from './crawl';
import * as MapModule from './map';
import * as ScrapeModule from './scrape';
import * as SearchModule from './search';

export const ScrapeEndpoints = ScrapeModule;
export const MapEndpoints = MapModule;
export const SearchEndpoints = SearchModule;
export const CrawlEndpoints = CrawlModule;
export const AgentEndpoints = AgentModule;

export * from './types';
