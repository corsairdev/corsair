import {
	getBrandInfo,
	getCdnLogo,
	getCompanyInfo,
	getGraphqlVersion,
	getTaxonomy,
	getTransactionInfo,
	listSubscribableEvents,
	listWebhooks,
	searchBrands,
} from './brand-info';

// Group endpoints by resource type
export const BrandsEndpoints = {
	get: getBrandInfo,
	search: searchBrands,
} as const;

export const LogosEndpoints = {
	get: getCdnLogo,
} as const;

export const CompaniesEndpoints = {
	get: getCompanyInfo,
} as const;

export const TransactionsEndpoints = {
	get: getTransactionInfo,
} as const;

export const TaxonomiesEndpoints = {
	get: getTaxonomy,
} as const;

export const GraphqlEndpoints = {
	getVersion: getGraphqlVersion,
} as const;

export const EventsEndpoints = {
	listSubscribable: listSubscribableEvents,
} as const;

export const WebhooksEndpoints = {
	list: listWebhooks,
} as const;

export * from './types';
