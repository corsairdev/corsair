import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['leadsListsList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsList']
	>('/leads_lists', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsList.parse(response);

	await logEventFromContext(ctx, 'hunterio.leadsLists.list', {}, 'completed');

	return parsedResponse;
};

export const create: HunterioEndpoints['leadsListsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsCreate']
	>('/leads_lists', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsCreate.parse(response);

	await logEventFromContext(ctx, 'hunterio.leadsLists.create', {}, 'completed');

	return parsedResponse;
};

export const get: HunterioEndpoints['leadsListsGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsGet.parse(input);
	const { id, ...query } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsGet']
	>(`/leads_lists/${id}`, ctx.key, { method: 'GET', query });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsLists.get',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['leadsListsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsUpdate']
	>(`/leads_lists/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsLists.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['leadsListsReplace'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsReplace']
	>(`/leads_lists/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsLists.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['leadsListsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsDelete']
	>(`/leads_lists/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsLists.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const favorite: HunterioEndpoints['leadsListsFavorite'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsFavorite.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsFavorite']
	>(`/leads_lists/${parsed.id}/favorite`, ctx.key, { method: 'POST' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsFavorite.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsLists.favorite',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const unfavorite: HunterioEndpoints['leadsListsUnfavorite'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsUnfavorite.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsUnfavorite']
	>(`/leads_lists/${parsed.id}/favorite`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsUnfavorite.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsLists.unfavorite',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const merge: HunterioEndpoints['leadsListsMerge'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadsListsMerge.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadsListsMerge']
	>(`/leads_lists/${parsed.id}/merge`, ctx.key, { method: 'POST' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadsListsMerge.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadsLists.merge',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
