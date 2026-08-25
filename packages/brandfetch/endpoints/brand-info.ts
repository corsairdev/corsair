import { logEventFromContext } from 'corsair/core';
import type { BrandfetchEndpoints } from '..';
import { makeBrandfetchRequest } from '../client';
import type { BrandfetchEndpointOutputs } from './types';

// 1. Get Brand Information
export const getBrandInfo: BrandfetchEndpoints['getBrandInfo'] = async (
	ctx,
	input,
) => {
	const response = await makeBrandfetchRequest<
		BrandfetchEndpointOutputs['getBrandInfo']
	>(`/v2/brands/domain/${encodeURIComponent(input.domain)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'brandfetch.brand.getInfo',
		{ ...input },
		'completed',
	);
	return response;
};

// 2. Search Brands
export const searchBrands: BrandfetchEndpoints['searchBrands'] = async (
	ctx,
	input,
) => {
	const response = await makeBrandfetchRequest<
		BrandfetchEndpointOutputs['searchBrands']
	>(`/v2/search/${encodeURIComponent(input.query)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'brandfetch.brand.search',
		{ ...input },
		'completed',
	);
	return response;
};

// 3. Get CDN Logo
export const getCdnLogo: BrandfetchEndpoints['getCdnLogo'] = async (
	ctx,
	input,
) => {
	const response = await makeBrandfetchRequest<
		BrandfetchEndpointOutputs['getCdnLogo']
	>(`/v2/brands/cdn/${encodeURIComponent(input.domain)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'brandfetch.brand.getCdnLogo',
		{ ...input },
		'completed',
	);
	return response;
};

// 4. Get Company Information
export const getCompanyInfo: BrandfetchEndpoints['getCompanyInfo'] = async (
	ctx,
	input,
) => {
	const response = await makeBrandfetchRequest<
		BrandfetchEndpointOutputs['getCompanyInfo']
	>(`/v2/companies/${encodeURIComponent(input.domain)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'brandfetch.company.getInfo',
		{ ...input },
		'completed',
	);
	return response;
};

// 5. Get Transaction Info
export const getTransactionInfo: BrandfetchEndpoints['getTransactionInfo'] =
	async (ctx, input) => {
		const response = await makeBrandfetchRequest<
			BrandfetchEndpointOutputs['getTransactionInfo']
		>(`/v2/transactions/${encodeURIComponent(input.label)}`, ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'brandfetch.transaction.getInfo',
			{ ...input },
			'completed',
		);
		return response;
	};

// 6. Get Brandfetch Taxonomy (Fallback REST placeholder mapping to schema target requirements)
export const getTaxonomy: BrandfetchEndpoints['getTaxonomy'] = async (
	ctx,
	input,
) => {
	const response = await makeBrandfetchRequest<
		BrandfetchEndpointOutputs['getTaxonomy']
	>(`/v2/taxonomy`, ctx.key, { method: 'GET' });
	return response;
};

// 7. Get GraphQL API Version
export const getGraphqlVersion: BrandfetchEndpoints['getGraphqlVersion'] =
	async (ctx, input) => {
		return { version: '2.0.0' };
	};

// 8. List Subscribable Events
export const listSubscribableEvents: BrandfetchEndpoints['listSubscribableEvents'] =
	async (ctx, input) => {
		return {
			events: [
				'brand.claimed',
				'brand.deleted',
				'brand.updated',
				'brand.company.updated',
				'brand.verified',
			],
		};
	};

// 9. List Webhooks
export const listWebhooks: BrandfetchEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	return { webhooks: [] };
};
