import { logEventFromContext } from 'corsair/core';
import type { ChatfaiEndpoints } from '..';
import { ChatfaiAPIError, makeChatfaiRequest } from '../client';
import { ChatfaiConversation } from '../schema';
import { ConversationsListOutputSchema } from './types';

function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

function nextCursorOf(value: unknown): string | null | undefined {
	if (value === null) return null;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function conversationItems(raw: unknown): unknown[] {
	if (Array.isArray(raw)) return raw;
	const obj = asRecord(raw);
	if (!obj) {
		throw new ChatfaiAPIError('ChatFAI conversations response is not a list');
	}
	const items = obj.data ?? obj.conversations ?? obj.items;
	if (!Array.isArray(items)) {
		throw new ChatfaiAPIError('ChatFAI conversations response is not a list');
	}
	return items;
}

export const list: ChatfaiEndpoints['conversationsList'] = async (
	ctx,
	input,
) => {
	const raw = await makeChatfaiRequest<unknown>('/conversations', ctx.key, {
		query: {
			limit: input.limit,
			cursor: input.cursor,
		},
	});
	const obj = asRecord(raw);
	const response = ConversationsListOutputSchema.parse({
		conversations: ChatfaiConversation.array().parse(conversationItems(raw)),
		nextCursor: nextCursorOf(obj?.nextCursor ?? obj?.next_cursor),
	});
	await logEventFromContext(
		ctx,
		'chatfai.conversations.list',
		{ limit: input.limit, cursor: input.cursor },
		'completed',
	);
	return response;
};
