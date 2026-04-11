import { logEventFromContext } from 'corsair/core';
import type { FacebookEndpoints } from '..';
import { makeFacebookRequest } from '../client';
import type { FacebookEndpointOutputs, GetMessagesResponse } from './types';

export const sendMessage: FacebookEndpoints['sendMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeFacebookRequest<
		FacebookEndpointOutputs['sendMessage']
	>('/me/messages', ctx.key, {
		method: 'POST',
		body: {
			recipient: {
				id: input.recipientId,
			},
			messaging_type: input.messagingType ?? 'RESPONSE',
			...(input.tag ? { tag: input.tag } : {}),
			...(input.personaId ? { persona_id: input.personaId } : {}),
			message: {
				text: input.text,
			},
		},
	});

	const messageId = result.message_id;
	if (messageId && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(messageId, {
				id: messageId,
				mid: messageId,
				page_id: input.pageId,
				recipient_id: input.recipientId,
				text: input.text,
				metadata: input.messagingType,
				direction: 'outbound',
				status: 'sent',
				authorId: input.pageId,
				createdAt: new Date(),
				raw: result,
			});
		} catch (error) {
			console.warn('Failed to save Facebook outbound message:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'facebook.messages.sendMessage',
		{
			recipientId: input.recipientId,
			messagingType: input.messagingType,
			pageId: input.pageId,
		},
		'completed',
	);

	return result;
};

export const getMessages: FacebookEndpoints['getMessages'] = async (
	ctx,
	input,
) => {
	if (!ctx.db.messages) {
		const empty: GetMessagesResponse = {
			messages: [],
			count: 0,
		};
		return empty;
	}

	const persisted = await ctx.db.messages.list({
		limit: input.limit,
		offset: input.offset,
	});

	const messages = persisted
		.map((entity) => entity.data)
		.filter((message) => {
			if (
				input.conversationId &&
				message.conversation_id !== input.conversationId
			) {
				return false;
			}
			if (input.recipientId) {
				const recipientId = message.recipient_id ?? message.to?.[0]?.id;
				if (recipientId !== input.recipientId) {
					return false;
				}
			}
			if (input.direction && message.direction !== input.direction) {
				return false;
			}
			if (input.status && message.status !== input.status) {
				return false;
			}
			return true;
		});

	const response: GetMessagesResponse = {
		messages,
		count: messages.length,
	};

	await logEventFromContext(
		ctx,
		'facebook.messages.getMessages',
		{ ...input },
		'completed',
	);

	return response;
};
