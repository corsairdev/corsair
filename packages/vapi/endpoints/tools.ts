import { logEventFromContext } from 'corsair/core';
import { makeVapiRequest } from '../client';
import type { VapiEndpoints } from '../index';
import type { VapiEndpointOutputs } from './types';

export const list: VapiEndpoints['toolsList'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['toolsList']>(
		'tool',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.tools.list', { ...input }, 'completed');
	return result;
};

export const create: VapiEndpoints['toolsCreate'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['toolsCreate']>(
		'tool',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);
	await logEventFromContext(
		ctx,
		'vapi.tools.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: VapiEndpoints['toolsGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['toolsGet']>(
		`tool/${id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'vapi.tools.get', { id }, 'completed');
	return result;
};

export const update: VapiEndpoints['toolsUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['toolsUpdate']>(
		`tool/${id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'vapi.tools.update', { id }, 'completed');
	return result;
};

export const deleteTool: VapiEndpoints['toolsDelete'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['toolsDelete']>(
		`tool/${id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'vapi.tools.delete', { id }, 'completed');
	return result;
};
