import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List categories - GET /v1/categories
export const categoriesList: DnsfilterEndpoints['categoriesList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['categoriesList']
	>('/v1/categories', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.categories.list',
		input ?? {},
		'completed',
	);
	return response;
};

// List all categories - GET /v1/categories/all
export const categoriesListAll: DnsfilterEndpoints['categoriesListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['categoriesListAll']
		>('/v1/categories/all', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.categories.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a category - GET /v1/categories/{id}
export const categoriesGet: DnsfilterEndpoints['categoriesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['categoriesGet']
	>('/v1/categories/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.categories.get',
		input ?? {},
		'completed',
	);
	return response;
};
