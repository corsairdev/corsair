import { logEventFromContext } from 'corsair/core';
import { makeVapiRequest } from '../client';
import type { VapiEndpoints } from '../index';
import type { VapiEndpointOutputs } from './types';

export const list: VapiEndpoints['squadsList'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['squadsList']>(
		'squad',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.squads.list', { ...input }, 'completed');
	return result;
};

export const create: VapiEndpoints['squadsCreate'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['squadsCreate']>(
		'squad',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.squads.create', { ...input }, 'completed');
	return result;
};

export const get: VapiEndpoints['squadsGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['squadsGet']>(
		`squad/${id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'vapi.squads.get', { id }, 'completed');
	return result;
};

export const update: VapiEndpoints['squadsUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['squadsUpdate']>(
		`squad/${id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'vapi.squads.update', { id }, 'completed');
	return result;
};

export const deleteSquad: VapiEndpoints['squadsDelete'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['squadsDelete']>(
		`squad/${id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'vapi.squads.delete', { id }, 'completed');
	return result;
};
