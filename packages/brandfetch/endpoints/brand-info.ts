import { logEventFromContext } from 'corsair/core';
import { BrandfetchAPIError, makeBrandfetchRequest } from '../client';
import type { BrandfetchEndpoints } from '../index';
import type { BrandfetchEndpointOutputs } from './types';

function getClientId(
	inputClientId: string | undefined,
	optionClientId: string | undefined,
) {
	const clientId = inputClientId ?? optionClientId;
	if (!clientId) {
		throw new BrandfetchAPIError(
			'Brandfetch clientId is required for this operation',
		);
	}
	return clientId;
}

// 1. Get Brand Information
// Real API: GET /v2/brands/domain/{domain}
// Returns full brand data including logos, colors, fonts, company info, etc.
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
// Real API: GET /v2/search/{name}?c={clientId}
// Brand Search API authenticates with a clientId query parameter and returns
// a bare array of results.
export const searchBrands: BrandfetchEndpoints['searchBrands'] = async (
	ctx,
	input,
) => {
	const clientId = getClientId(input.clientId, ctx.options?.clientId);
	const response = await makeBrandfetchRequest<
		BrandfetchEndpointOutputs['searchBrands']
	>(`/v2/search/${encodeURIComponent(input.query)}`, ctx.key, {
		method: 'GET',
		query: { c: clientId },
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
// Logo API is a hotlinkable CDN URL: https://cdn.brandfetch.io/domain/{domain}?c={CLIENT_ID}
// The URL is constructed locally; programmatic fetching of logo images is not
// permitted by Brandfetch.
export const getCdnLogo: BrandfetchEndpoints['getCdnLogo'] = async (
	ctx,
	input,
) => {
	const clientId = getClientId(input.clientId, ctx.options?.clientId);
	const cdnUrl = `https://cdn.brandfetch.io/domain/${encodeURIComponent(input.domain)}?c=${encodeURIComponent(clientId)}`;

	await logEventFromContext(
		ctx,
		'brandfetch.brand.getCdnLogo',
		{ ...input },
		'completed',
	);
	return { url: cdnUrl };
};

// 4. Get Transaction Info
// Real API: POST /v2/brands/transaction
// Turns payment transactions into merchant data by matching raw transaction
// labels to brand information.
export const getTransactionInfo: BrandfetchEndpoints['getTransactionInfo'] =
	async (ctx, input) => {
		const response = await makeBrandfetchRequest<
			BrandfetchEndpointOutputs['getTransactionInfo']
		>(`/v2/brands/transaction`, ctx.key, {
			method: 'POST',
			body: {
				transactionLabel: input.transactionLabel,
				countryCode: input.countryCode,
			},
		});
		await logEventFromContext(
			ctx,
			'brandfetch.transaction.getInfo',
			{ ...input },
			'completed',
		);
		return response;
	};

// 5. Get Viewer (Credential Verification)
// Real API: GET /v2/viewer
// Returns the identity of the credential used to authenticate the request.
// This endpoint is free and never consumes API credits. Useful for verifying
// credentials during integration setup.
export const getViewer: BrandfetchEndpoints['getViewer'] = async (
	ctx,
	input,
) => {
	const response = await makeBrandfetchRequest<
		BrandfetchEndpointOutputs['getViewer']
	>(`/v2/viewer`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'brandfetch.viewer.getInfo',
		{ ...input },
		'completed',
	);
	return response;
};
