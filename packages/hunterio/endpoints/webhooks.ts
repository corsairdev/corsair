import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['webhooksList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.webhooksList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['webhooksList']
	>('/webhooks', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.webhooksList.parse(response);

	await logEventFromContext(ctx, 'hunterio.webhooks.list', {}, 'completed');

	return parsedResponse;
};

export const create: HunterioEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.webhooksCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['webhooksCreate']
	>('/webhooks', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.webhooksCreate.parse(response);

	await logEventFromContext(ctx, 'hunterio.webhooks.create', {}, 'completed');

	return parsedResponse;
};

export const get: HunterioEndpoints['webhooksGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.webhooksGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['webhooksGet']
	>(`/webhooks/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.webhooksGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.webhooks.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['webhooksUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.webhooksUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['webhooksUpdate']
	>(`/webhooks/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.webhooksUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.webhooks.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['webhooksReplace'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.webhooksReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['webhooksReplace']
	>(`/webhooks/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.webhooksReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.webhooks.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.webhooksDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['webhooksDelete']
	>(`/webhooks/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.webhooksDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.webhooks.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const deleteLegacy: HunterioEndpoints['webhooksDeleteLegacy'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.webhooksDeleteLegacy.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['webhooksDeleteLegacy']
	>('/webhooks', ctx.key, {
		method: 'DELETE',
		query: { id: parsed.id },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.webhooksDeleteLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.webhooks.deleteLegacy',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
