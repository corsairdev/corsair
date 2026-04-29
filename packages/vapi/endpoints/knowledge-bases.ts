import { logEventFromContext } from 'corsair/core';
import { makeVapiRequest } from '../client';
import type { VapiEndpoints } from '../index';
import type { VapiEndpointOutputs } from './types';

export const list: VapiEndpoints['knowledgeBasesList'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['knowledgeBasesList']>(
		'knowledge-base',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.knowledge-bases.list', { ...input }, 'completed');
	return result;
};

export const create: VapiEndpoints['knowledgeBasesCreate'] = async (ctx, input) => {
	const result = await makeVapiRequest<VapiEndpointOutputs['knowledgeBasesCreate']>(
		'knowledge-base',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);
	await logEventFromContext(ctx, 'vapi.knowledge-bases.create', { ...input }, 'completed');
	return result;
};

export const get: VapiEndpoints['knowledgeBasesGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['knowledgeBasesGet']>(
		`knowledge-base/${id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'vapi.knowledge-bases.get', { id }, 'completed');
	return result;
};

export const update: VapiEndpoints['knowledgeBasesUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['knowledgeBasesUpdate']>(
		`knowledge-base/${id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'vapi.knowledge-bases.update', { id }, 'completed');
	return result;
};

export const deleteKnowledgeBase: VapiEndpoints['knowledgeBasesDelete'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeVapiRequest<VapiEndpointOutputs['knowledgeBasesDelete']>(
		`knowledge-base/${id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'vapi.knowledge-bases.delete', { id }, 'completed');
	return result;
};
