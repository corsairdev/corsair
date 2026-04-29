import { logEventFromContext } from 'corsair/core';
import { makeVapiRequest } from '../client';
import type { VapiEndpoints } from '../index';
import type { VapiEndpointOutputs } from './types';

export const list: VapiEndpoints['filesList'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['filesList']>(
		'file',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.files.list', { ...input }, 'completed');
	return result;
};

export const get: VapiEndpoints['filesGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['filesGet']>(
		`file/${id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'vapi.files.get', { id }, 'completed');
	return result;
};

export const update: VapiEndpoints['filesUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['filesUpdate']>(
		`file/${id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'vapi.files.update', { id }, 'completed');
	return result;
};

export const deleteFile: VapiEndpoints['filesDelete'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['filesDelete']>(
		`file/${id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'vapi.files.delete', { id }, 'completed');
	return result;
};
