import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { botpressCall, compactQuery } from './shared';
import type { BotpressEndpointOutputs } from './types';

/** Lists a bot's knowledge bases, optionally filtered by tags. */
export const list: BotpressEndpoints['knowledgeBasesList'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		knowledgeBases: BotpressEndpointOutputs['knowledgeBasesList'];
	}>(ctx, '/v1/files/knowledge-bases', {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
			tags: input.tags,
		}),
		botId: input.botId,
	});

	await logEventFromContext(
		ctx,
		'botpress.knowledgeBases.list',
		auditPayload(input, ['botId']),
		'completed',
	);
	return result.knowledgeBases ?? [];
};

/** Permanently deletes a knowledge base from a bot. [DESTRUCTIVE] */
export const remove: BotpressEndpoints['knowledgeBasesDelete'] = async (
	ctx,
	input,
) => {
	await botpressCall(
		ctx,
		`/v1/files/knowledge-bases/${encodeURIComponent(input.id)}`,
		{ method: 'DELETE', botId: input.botId },
	);

	await logEventFromContext(
		ctx,
		'botpress.knowledgeBases.delete',
		auditPayload(input, ['botId', 'id']),
		'completed',
	);
	return {};
};
