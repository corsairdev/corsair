import { logEventFromContext } from 'corsair/core';
import { makeAgentMailRequest } from '../client';
import type { AgentMailEndpoints } from '../index';
import type { AgentMailEndpointOutputs } from './types';

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

	await logEventFromContext(
		ctx,
		'agentmail.messages.get',
		{ ...input },
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

	await logEventFromContext(
		ctx,
		'agentmail.messages.list',
		{ ...input },
		'completed',
	);

	return response;
};
