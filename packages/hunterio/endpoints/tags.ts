import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['tagsList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.tagsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['tagsList']
	>('/tags', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse = HunterioEndpointOutputSchemas.tagsList.parse(response);

	await logEventFromContext(ctx, 'hunterio.tags.list', {}, 'completed');

	return parsedResponse;
};

export const create: HunterioEndpoints['tagsCreate'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.tagsCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['tagsCreate']
	>('/tags', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.tagsCreate.parse(response);

	await logEventFromContext(ctx, 'hunterio.tags.create', {}, 'completed');

	return parsedResponse;
};

export const get: HunterioEndpoints['tagsGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.tagsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['tagsGet']
	>(`/tags/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse = HunterioEndpointOutputSchemas.tagsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.tags.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['tagsUpdate'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.tagsUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['tagsUpdate']
	>(`/tags/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.tagsUpdate.parse(response);

	await logEventFromContext(ctx, 'hunterio.tags.update', { id }, 'completed');

	return parsedResponse;
};

export const replace: HunterioEndpoints['tagsReplace'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.tagsReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['tagsReplace']
	>(`/tags/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.tagsReplace.parse(response);

	await logEventFromContext(ctx, 'hunterio.tags.replace', { id }, 'completed');

	return parsedResponse;
};

export const remove: HunterioEndpoints['tagsDelete'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.tagsDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['tagsDelete']
	>(`/tags/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.tagsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.tags.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
