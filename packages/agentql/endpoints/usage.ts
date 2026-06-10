import { logEventFromContext } from 'corsair/core';
import { makeAgentQLRequest } from '../client';
import type { AgentQLEndpoints } from '../index';
import type { AgentQLGetUsageResponse } from './types';

export const get: AgentQLEndpoints['getUsage'] = async (ctx) => {
	const response = await makeAgentQLRequest<AgentQLGetUsageResponse>(
		'/v1/usage',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'agentql.usage.get',
		{},
		'completed',
	);

	return response;
};
