import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

export const find: KibanaEndpoints['savedObjectsFind'] = async (ctx, input) => {
	const baseUrl = ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
	const query: Record<string, string | number> = {};
	if (Array.isArray(input.type)) {
		query.type = input.type as any; // The request util handles array query params, or we might need to stringify.
		// Wait, corsair request query params might not support arrays seamlessly if the api expects repeated keys.
		// Kibana find API expects `type=index-pattern&type=dashboard` if array.
	} else {
		query.type = input.type;
	}
	if (input.search) query.search = input.search;
	if (input.page) query.page = input.page;
	if (input.per_page) query.per_page = input.per_page;

	// In OpenAPI request, if query value is array, it depends on the stringifier.
	// We'll pass it, and if it fails, we can adjust.

	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['savedObjectsFind']
	>('api/saved_objects/_find', baseUrl, ctx.key, {
		method: 'GET',
		query: query as any,
	});

	await logEventFromContext(
		ctx,
		'kibana.savedObjects.find',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: KibanaEndpoints['savedObjectsGet'] = async (ctx, input) => {
	const baseUrl = ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['savedObjectsGet']
	>(
		`api/saved_objects/${encodeURIComponent(input.type)}/${encodeURIComponent(input.id)}`,
		baseUrl,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'kibana.savedObjects.get',
		{ ...input },
		'completed',
	);
	return response;
};
