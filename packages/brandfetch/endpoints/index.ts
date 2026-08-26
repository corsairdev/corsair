import {
	getBrandInfo,
	getCdnLogo,
	getTransactionInfo,
	getViewer,
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

export const TransactionsEndpoints = {
	get: getTransactionInfo,
} as const;

export const ViewerEndpoints = {
	get: getViewer,
} as const;

export * from './types';
