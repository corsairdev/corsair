import { logEventFromContext } from 'corsair/core';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

export const find: KibanaEndpoints['savedObjectsFind'] = async (ctx, input) => {
	const baseUrl = ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
	const query: Record<string, string | number | boolean | undefined> = {};

	if (Array.isArray(input.type)) {
		query.type = input.type.join(',');
	} else if (input.type) {
		query.type = input.type;
	}

	if (input.search !== undefined) query.search = input.search;
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.sort_field !== undefined) query.sort_field = input.sort_field;

	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['savedObjectsFind']
	>('api/saved_objects/_find', baseUrl, ctx.key, {
		method: 'GET',
		query,
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

export const create: KibanaEndpoints['savedObjectsCreate'] = async (
	ctx,
	input,
) => {
	const baseUrl = ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
	const endpoint = input.id
		? `api/saved_objects/${encodeURIComponent(input.type)}/${encodeURIComponent(input.id)}`
		: `api/saved_objects/${encodeURIComponent(input.type)}`;

	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['savedObjectsCreate']
	>(endpoint, baseUrl, ctx.key, {
		method: 'POST',
		query:
			input.overwrite !== undefined
				? { overwrite: input.overwrite }
				: undefined,
		body: {
			attributes: input.attributes,
			...(input.references && { references: input.references }),
		},
	});

	await logEventFromContext(
		ctx,
		'kibana.savedObjects.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: KibanaEndpoints['savedObjectsUpdate'] = async (
	ctx,
	input,
) => {
	const baseUrl = ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['savedObjectsUpdate']
	>(
		`api/saved_objects/${encodeURIComponent(input.type)}/${encodeURIComponent(input.id)}`,
		baseUrl,
		ctx.key,
		{
			method: 'PUT',
			body: {
				attributes: input.attributes,
				...(input.references && { references: input.references }),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'kibana.savedObjects.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: KibanaEndpoints['savedObjectsDelete'] = async (
	ctx,
	input,
) => {
	const baseUrl = ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['savedObjectsDelete']
	>(
		`api/saved_objects/${encodeURIComponent(input.type)}/${encodeURIComponent(input.id)}`,
		baseUrl,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'kibana.savedObjects.delete',
		{ ...input },
		'completed',
	);
	return response;
};
