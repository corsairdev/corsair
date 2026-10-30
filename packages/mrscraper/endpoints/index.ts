import { get as accountGet } from './account';
import { proxyBandwidth, statuses } from './analytics';
import { get as resultsGet, list as resultsList } from './results';
import {
	fetchPage,
	json,
	listing,
	markdown,
	screenshot,
	sitemap,
} from './scrape';
import {
	aiInit,
	aiRerun,
	aiRerunBulk,
	cancelBulkByResult,
	cancelBulkByScraper,
	manualHeal,
	manualRerun,
	manualRerunBulk,
} from './scrapers';

export const Account = {
	get: accountGet,
};

export const Scrapers = {
	aiInit,
	aiRerun,
	aiRerunBulk,
	manualRerun,
	manualRerunBulk,
	manualHeal,
	cancelBulkByScraper,
	cancelBulkByResult,
};

export const Results = {
	list: resultsList,
	get: resultsGet,
};

export const Analytics = {
	statuses,
	proxyBandwidth,
};

export const Scrape = {
	fetch: fetchPage,
	markdown,
	json,
	screenshot,
	listing,
	sitemap,
};

export * from './types';
