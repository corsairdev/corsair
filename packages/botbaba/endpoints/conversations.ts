import { logEventFromContext } from 'corsair/core';
import type { BotbabaEndpoints } from '../index';
import { auditPayload } from './logging';
import { botbabaCall, compactQuery } from './shared';
import type { BotbabaConversation, BotbabaEndpointOutputs } from './types';

/** Lists conversations for a given bot. */
export const list: BotbabaEndpoints['conversationsList'] = async (
	ctx,
	input,
) => {
	const result = await botbabaCall<
		BotbabaEndpointOutputs['conversationsList']
	>(ctx, `/v1/bots/${encodeURIComponent(input.botId)}/conversations`, {
		query: compactQuery({
			page: input.page,
			limit: input.limit,
			status: input.status,
		}),
	});

	await logEventFromContext(
		ctx,
		'botbaba.conversations.list',
		auditPayload(input, ['botId']),
		'completed',
	);
	return result;
};

/** Gets a single conversation by id. */
export const get: BotbabaEndpoints['conversationsGet'] = async (
	ctx,
	input,
) => {
	const result = await botbabaCall<{ conversation: BotbabaConversation }>(
		ctx,
		`/v1/conversations/${encodeURIComponent(input.conversationId)}`,
	);

	await logEventFromContext(
		ctx,
		'botbaba.conversations.get',
		auditPayload(input, ['conversationId']),
		'completed',
	);
	return result.conversation;
};
