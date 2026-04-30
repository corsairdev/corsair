import { logEventFromContext } from 'corsair/core';
import { makeVapiRequest } from '../client';
import type { VapiEndpoints } from '../index';
import type { VapiEndpointOutputs } from './types';

export const list: VapiEndpoints['callsList'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['callsList']>(
		'call',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.calls.list', { ...input }, 'completed');
	return result;
};

export const create: VapiEndpoints['callsCreate'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['callsCreate']>(
		'call',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);
	await logEventFromContext(
		ctx,
		'vapi.calls.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: VapiEndpoints['callsGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['callsGet']>(
		`call/${id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'vapi.calls.get', { id }, 'completed');
	return result;
};

export const update: VapiEndpoints['callsUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['callsUpdate']>(
		`call/${id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'vapi.calls.update', { id }, 'completed');
	return result;
};

export const deleteCall: VapiEndpoints['callsDelete'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['callsDelete']>(
		`call/${id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'vapi.calls.delete', { id }, 'completed');
	return result;
};
