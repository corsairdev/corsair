import { logEventFromContext } from 'corsair/core';
import { makeAgentQLRequest } from '../client';
import type { AgentQLEndpoints } from '../index';
import {
	buildQueryDocumentCacheKey,
	hashFileContent,
} from './cache-keys';
import type { AgentQLQueryDocumentResponse } from './types';

export const queryDocument: AgentQLEndpoints['queryDocument'] = async (
	ctx,
	input,
) => {
	const fileHash = await hashFileContent(input.file);

	const body = JSON.stringify({
		query: input.query,
		prompt: input.prompt,
		params: input.params,
	});

	const response = await makeAgentQLRequest<AgentQLQueryDocumentResponse>(
		'/v1/query-document',
		ctx.key,
		{
			method: 'POST',
			formData: {
				file: input.file,
				body,
			},
		},
	);

	if (ctx.db.documentQueryResults) {
		try {
			const entityId =
				response.metadata?.request_id ??
				buildQueryDocumentCacheKey(input, fileHash);

			await ctx.db.documentQueryResults.upsertByEntityId(entityId, {
				fileName: input.fileName,
				query: input.query,
				prompt: input.prompt,
				data: response.data,
				generatedQuery: response.metadata?.generated_query,
				requestId: response.metadata?.request_id,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'[agentql] Failed to save document query result to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'agentql.data.queryDocument',
		{
			hasQuery: Boolean(input.query),
			hasPrompt: Boolean(input.prompt),
			fileName: input.fileName,
		},
		'completed',
	);

	return response;
};
