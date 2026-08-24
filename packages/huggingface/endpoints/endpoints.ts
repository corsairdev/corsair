import { logEventFromContext } from 'corsair/core';
import { HF_ENDPOINTS_BASE } from '../client';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const list: HuggingFaceEndpoints['endpointsList'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/v2/endpoint/${encodeURIComponent(input.namespace)}`,
		{
			method: 'GET',
			baseUrl: HF_ENDPOINTS_BASE,
			query: { name: input.name },
		},
	);
	await logEventFromContext(
		ctx,
		'huggingface.endpoints.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const listVendors: HuggingFaceEndpoints['endpointsListVendors'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/v2/provider', {
		method: 'GET',
		baseUrl: HF_ENDPOINTS_BASE,
	});
	await logEventFromContext(
		ctx,
		'huggingface.endpoints.listVendors',
		summarize(input),
		'completed',
	);
	return response;
};

export const deleteNetworkCidr: HuggingFaceEndpoints['endpointsDeleteNetworkCidr'] =
	async (ctx, input) => {
		const response = await req(
			ctx,
			`/v2/endpoint/${encodeURIComponent(input.namespace)}/network-security/cidr/${encodeURIComponent(input.cidr)}`,
			{
				method: 'DELETE',
				baseUrl: HF_ENDPOINTS_BASE,
			},
		);
		await logEventFromContext(
			ctx,
			'huggingface.endpoints.deleteNetworkCidr',
			summarize(input),
			'completed',
		);
		return response;
	};
