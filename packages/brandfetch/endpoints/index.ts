import {
	getGraphqlVersion,
	getTaxonomy,
	listSubscribableEvents,
	listWebhooks,
} from './graphql';
import {
	getBrandInfo,
	getCdnLogo,
	getCompanyInfo,
	getTransactionInfo,
	searchBrands,
} from './rest';

export const BrandsEndpoints = {
	get: getBrandInfo,
	search: searchBrands,
	getCompany: getCompanyInfo,
} as const;

export const LogosEndpoints = {
	get: getCdnLogo,
} as const;

export const TransactionsEndpoints = {
	get: getTransactionInfo,
} as const;

export const TaxonomyEndpoints = {
	get: getTaxonomy,
} as const;

export const GraphqlEndpoints = {
	getVersion: getGraphqlVersion,
} as const;

export const WebhooksEndpoints = {
	list: listWebhooks,
	listEvents: listSubscribableEvents,
} as const;

export * from './types';
