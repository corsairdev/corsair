import { logEventFromContext } from 'corsair/core';
import { cacheAgentMailMessage } from '../cache-message';
import { makeAgentMailRequest } from '../client';
import type { AgentMailEndpoints } from '../index';
import type { AgentMailEndpointOutputs } from './types';

export const send: AgentMailEndpoints['messagesSend'] = async (ctx, input) => {
	const { inbox_id, ...bodyInput } = input;
	const body = Object.fromEntries(
		Object.entries(bodyInput).filter(([, value]) => value !== undefined),
	);

	const response = await makeAgentMailRequest<
		AgentMailEndpointOutputs['messagesSend']
	>(`inboxes/${encodeURIComponent(inbox_id)}/messages/send`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'agentmail.messages.send',
		{
			inbox_id,
			message_id: response.message_id,
			thread_id: response.thread_id,
		},
		'completed',
	);

	return response;
};

export const get: AgentMailEndpoints['messagesGet'] = async (ctx, input) => {
	const response = await makeAgentMailRequest<
		AgentMailEndpointOutputs['messagesGet']
	>(
		`inboxes/${encodeURIComponent(input.inbox_id)}/messages/${encodeURIComponent(input.message_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheAgentMailMessage(ctx, response);

	await logEventFromContext(
		ctx,
		'agentmail.messages.get',
		{
			inbox_id: input.inbox_id,
			message_id: input.message_id,
		},
		'completed',
	);

	return response;
};

export const list: AgentMailEndpoints['messagesList'] = async (ctx, input) => {
	const { inbox_id, ...query } = input;

	const response = await makeAgentMailRequest<
		AgentMailEndpointOutputs['messagesList']
	>(`inboxes/${encodeURIComponent(inbox_id)}/messages`, ctx.key, {
		method: 'GET',
		query,
	});

	for (const message of response.messages) {
		await cacheAgentMailMessage(ctx, message);
	}

	await logEventFromContext(
		ctx,
		'agentmail.messages.list',
		{
			inbox_id,
			count: response.count,
			returned: response.messages.length,
		},
		'completed',
	);

	return response;
};
