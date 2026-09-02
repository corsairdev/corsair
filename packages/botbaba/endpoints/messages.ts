import { logEventFromContext } from 'corsair/core';
import type { BotbabaEndpoints } from '../index';
import { auditPayload } from './logging';
import { botbabaCall, compactBody, compactQuery } from './shared';
import type { BotbabaEndpointOutputs, BotbabaMessage } from './types';

/** Sends a message into a conversation. */
export const send: BotbabaEndpoints['messagesSend'] = async (ctx, input) => {
	const result = await botbabaCall<{ message: BotbabaMessage }>(
		ctx,
		`/v1/bots/${encodeURIComponent(input.botId)}/conversations/${encodeURIComponent(input.conversationId)}/messages`,
		{
			method: 'POST',
			body: compactBody({
				content: input.content,
				type: input.type,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'botbaba.messages.send',
		auditPayload(input, ['botId', 'conversationId']),
		'completed',
	);
	return result.message;
};

/** Lists messages in a conversation. */
export const list: BotbabaEndpoints['messagesList'] = async (ctx, input) => {
	const result = await botbabaCall<BotbabaEndpointOutputs['messagesList']>(
		ctx,
		`/v1/conversations/${encodeURIComponent(input.conversationId)}/messages`,
		{
			query: compactQuery({
				page: input.page,
				limit: input.limit,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'botbaba.messages.list',
		auditPayload(input, ['conversationId']),
		'completed',
	);
	return result;
};
