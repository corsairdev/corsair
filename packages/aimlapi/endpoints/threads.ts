import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';

export const create: AimlApiEndpoints['threadsCreate'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['threadsCreate']
	>(`/threads`, ctx.key, {
		method: 'POST',
		body: {
			messages: input.messages,
			tool_resources: input.toolResources,
			metadata: input.metadata,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.threads.create',
		{ threadId: response.id },
		'completed',
	);

	return response;
};

export const get: AimlApiEndpoints['threadsGet'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['threadsGet']
	>(`/threads/${input.threadId}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'aimlapi.api.threads.get',
		{ threadId: input.threadId },
		'completed',
	);

	return response;
};

export const update: AimlApiEndpoints['threadsUpdate'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['threadsUpdate']
	>(`/threads/${input.threadId}`, ctx.key, {
		method: 'POST',
		body: {
			tool_resources: input.toolResources,
			metadata: input.metadata,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.threads.update',
		{ threadId: input.threadId },
		'completed',
	);

	return response;
};

export const delete_: AimlApiEndpoints['threadsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['threadsDelete']
	>(`/threads/${input.threadId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.threads.delete',
		{ threadId: input.threadId },
		'completed',
	);

	return response;
};

export { delete_ as delete };
