import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';

export const create: AimlApiEndpoints['messagesCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['messagesCreate']
	>(`/threads/${input.threadId}/messages`, ctx.key, {
		method: 'POST',
		body: {
			role: input.role,
			content: input.content,
			attachments: input.attachments,
			metadata: input.metadata,
		},
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.messages.create',
		{ threadId: input.threadId },
		'completed',
	);
	return response;
};

export const list: AimlApiEndpoints['messagesList'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['messagesList']
	>(`/threads/${input.threadId}/messages`, ctx.key, {
		method: 'GET',
		query: {
			limit: input.limit,
			order: input.order,
			before: input.before,
			after: input.after,
		},
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.messages.list',
		{ threadId: input.threadId },
		'completed',
	);
	return response;
};

export const get: AimlApiEndpoints['messagesGet'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['messagesGet']
	>(`/threads/${input.threadId}/messages/${input.messageId}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.messages.get',
		{ threadId: input.threadId, messageId: input.messageId },
		'completed',
	);
	return response;
};

export const update: AimlApiEndpoints['messagesUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['messagesUpdate']
	>(`/threads/${input.threadId}/messages/${input.messageId}`, ctx.key, {
		method: 'POST',
		body: {
			metadata: input.metadata,
		},
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.messages.update',
		{ threadId: input.threadId, messageId: input.messageId },
		'completed',
	);
	return response;
};

export const delete_: AimlApiEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['messagesDelete']
	>(`/threads/${input.threadId}/messages/${input.messageId}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.messages.delete',
		{ threadId: input.threadId, messageId: input.messageId },
		'completed',
	);
	return response;
};

export { delete_ as delete };
