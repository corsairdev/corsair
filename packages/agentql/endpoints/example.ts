import { logEventFromContext } from 'corsair/core';
import type { AgentQLEndpoints } from '..';
import type { AgentQLEndpointOutputs } from './types';
import { makeAgentQLRequest } from '../client';

export const get: AgentQLEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAgentQLRequest<AgentQLEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'agentql.example.get', { ...input }, 'completed');
	return response;
};
