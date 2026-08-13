import { logEventFromContext } from 'corsair/core';
import { ASSISTANTS_BETA_HEADERS, makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const create: AimlApiEndpoints['threadsCreate'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['threadsCreate']
	>(`/threads`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.threadsCreate,
		method: 'POST',
		headers: ASSISTANTS_BETA_HEADERS,
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
	>(`/threads/${input.threadId}`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.threadsGet,
		method: 'GET',
		headers: ASSISTANTS_BETA_HEADERS,
	});

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
		schema: AimlApiEndpointOutputSchemas.threadsUpdate,
		method: 'POST',
		headers: ASSISTANTS_BETA_HEADERS,
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
		schema: AimlApiEndpointOutputSchemas.threadsDelete,
		method: 'DELETE',
		headers: ASSISTANTS_BETA_HEADERS,
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
