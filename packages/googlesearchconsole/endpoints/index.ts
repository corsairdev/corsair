import * as SearchAnalytics from './search-analytics';
import * as Sitemaps from './sitemaps';
import * as Sites from './sites';
import * as UrlInspection from './url-inspection';

export const SearchAnalyticsEndpoints = {
	query: SearchAnalytics.query,
} as const;

export const SitesEndpoints = {
	list: Sites.list,
	get: Sites.get,
	add: Sites.add,
	delete: Sites.remove,
} as const;

export const SitemapsEndpoints = {
	list: Sitemaps.list,
	get: Sitemaps.get,
	submit: Sitemaps.submit,
	delete: Sitemaps.remove,
} as const;

export const UrlInspectionEndpoints = {
	inspect: UrlInspection.inspect,
} as const;

export * from './types';
