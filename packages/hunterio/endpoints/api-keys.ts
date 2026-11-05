import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['apiKeysList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.apiKeysList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['apiKeysList']
	>('/api-keys', ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.apiKeysList.parse(response);

	await logEventFromContext(ctx, 'hunterio.apiKeys.list', {}, 'completed');

	return parsedResponse;
};

export const create: HunterioEndpoints['apiKeysCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.apiKeysCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['apiKeysCreate']
	>('/api-keys', ctx.key, { method: 'POST', body: { name: parsed.name } });

	const parsedResponse =
		HunterioEndpointOutputSchemas.apiKeysCreate.parse(response);

	await logEventFromContext(ctx, 'hunterio.apiKeys.create', {}, 'completed');

	return parsedResponse;
};

export const update: HunterioEndpoints['apiKeysUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.apiKeysUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['apiKeysUpdate']
	>(`/api-keys/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.apiKeysUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.apiKeys.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['apiKeysReplace'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.apiKeysReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['apiKeysReplace']
	>(`/api-keys/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.apiKeysReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.apiKeys.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['apiKeysDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.apiKeysDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['apiKeysDelete']
	>(`/api-keys/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.apiKeysDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.apiKeys.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
