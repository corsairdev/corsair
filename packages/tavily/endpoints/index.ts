import { crawl as crawlEndpoint } from './crawl';
import { extract as extractEndpoint } from './extract';
import { map as mapEndpoint } from './map';
import { search as searchEndpoint } from './search';

export const Search = {
	search: searchEndpoint,
};

export const Extract = {
	extract: extractEndpoint,
};

export const Crawl = {
	crawl: crawlEndpoint,
};

export const Map = {
	map: mapEndpoint,
};

export * from './types';
