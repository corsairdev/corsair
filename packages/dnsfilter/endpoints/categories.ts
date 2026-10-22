import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List categories - GET /v1/categories
export const categoriesList: DnsfilterEndpoints['categoriesList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.categoriesList.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['categoriesList']
	>('/v1/categories', ctx.key, {
		method: 'GET',
		query: {
			page: values.page,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.categoriesList.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.categories.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all categories - GET /v1/categories/all
export const categoriesListAll: DnsfilterEndpoints['categoriesListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.categoriesListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['categoriesListAll']
		>('/v1/categories/all', ctx.key, {
			method: 'GET',
			query: {
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.categoriesListAll.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.categories.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a category - GET /v1/categories/{id}
export const categoriesGet: DnsfilterEndpoints['categoriesGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.categoriesGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['categoriesGet']
	>('/v1/categories/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.categoriesGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.categories.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};
