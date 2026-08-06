import { logEventFromContext } from 'corsair/core';
import { makeAgentQLRequest } from '../client';
import type { AgentQLEndpoints } from '../index';
import { buildQueryDataCacheKey } from './cache-keys';
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

	if (ctx.db.queryResults) {
		try {
			const entityId =
				response.metadata?.request_id ?? buildQueryDataCacheKey(input);

			await ctx.db.queryResults.upsertByEntityId(entityId, {
				query: input.query,
				prompt: input.prompt,
				url: input.url,
				sourceType: input.url ? 'url' : 'html',
				data: response.data,
				generatedQuery: response.metadata?.generated_query,
				requestId: response.metadata?.request_id,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('[agentql] Failed to save query result to database:', error);
		}
	}

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
