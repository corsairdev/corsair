import { logEventFromContext } from 'corsair/core';
import { makeAgentQLRequest } from '../client';
import type { AgentQLEndpoints } from '../index';
import type { AgentQLQueryDataResponse } from './types';

export const query: AgentQLEndpoints['queryData'] = async (ctx, input) => {
	const response = await makeAgentQLRequest<AgentQLQueryDataResponse>(
		'/v1/query-data',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'agentql.data.query',
		{
			hasQuery: Boolean(input.query),
			hasPrompt: Boolean(input.prompt),
			hasUrl: Boolean(input.url),
			hasHtml: Boolean(input.html),
		},
		'completed',
	);

	return response;
};
