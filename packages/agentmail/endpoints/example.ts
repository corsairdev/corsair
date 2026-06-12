import { logEventFromContext } from 'corsair/core';
import type { AgentMailEndpoints } from '..';
import type { AgentMailEndpointOutputs } from './types';
import { makeAgentMailRequest } from '../client';

export const get: AgentMailEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAgentMailRequest<AgentMailEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'agentmail.example.get', { ...input }, 'completed');
	return response;
};
