import { logEventFromContext } from 'corsair/core';
import { makeAgentMailRequest } from '../client';
import type { AgentMailEndpoints } from '../index';
import type { AgentMailEndpointOutputs } from './types';

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
