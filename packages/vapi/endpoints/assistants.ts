import { logEventFromContext } from 'corsair/core';
import { makeVapiRequest } from '../client';
import type { VapiEndpoints } from '../index';
import type { VapiEndpointOutputs } from './types';

export const list: VapiEndpoints['assistantsList'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['assistantsList']>(
		'assistant',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.assistants.list', { ...input }, 'completed');
	return result;
};

export const create: VapiEndpoints['assistantsCreate'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['assistantsCreate']>(
		'assistant',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.assistants.create', { ...input }, 'completed');
	return result;
};

export const get: VapiEndpoints['assistantsGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['assistantsGet']>(
		`assistant/${id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'vapi.assistants.get', { id }, 'completed');
	return result;
};

export const update: VapiEndpoints['assistantsUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['assistantsUpdate']>(
		`assistant/${id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'vapi.assistants.update', { id }, 'completed');
	return result;
};

export const deleteAssistant: VapiEndpoints['assistantsDelete'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['assistantsDelete']>(
		`assistant/${id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'vapi.assistants.delete', { id }, 'completed');
	return result;
};
