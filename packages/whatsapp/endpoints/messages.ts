import { logEventFromContext } from 'corsair/core';
import type { WhatsAppEndpoints } from '..';
import { makeWhatsAppRequest } from '../client';
import type {
	GetMessagesResponse,
	ListConversationsResponse,
	WhatsAppEndpointOutputs,
} from './types';

export const sendMessage: WhatsAppEndpoints['sendMessage'] = async (ctx, input) => {
	const result = await makeWhatsAppRequest<WhatsAppEndpointOutputs['sendMessage']>(
		`/${input.phoneNumberId}/messages`,
		ctx.key,
		{
			method: 'POST',
			body: {
				messaging_product: 'whatsapp',
				recipient_type: input.recipient_type ?? 'individual',
				to: input.to,
				type: 'text',
				text: {
					body: input.text,
					preview_url: input.preview_url,
				},
			},
		},
	);

	const messageId = result.messages?.[0]?.id;
	const waId = result.contacts?.[0]?.wa_id;

	if (messageId && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(messageId, {
				id: messageId,
				messaging_product: result.messaging_product ?? 'whatsapp',
				to: input.to,
				wa_id: waId,
				type: 'text',
				text: {
					body: input.text,
					preview_url: input.preview_url,
				},
				phone_number_id: input.phoneNumberId,
				direction: 'outbound',
				createdAt: new Date(),
				raw: result,
			});
		} catch (error) {
			console.warn('Failed to save WhatsApp message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'whatsapp.messages.sendMessage',
		{
			phoneNumberId: input.phoneNumberId,
			to: input.to,
			recipient_type: input.recipient_type,
		},
		'completed',
	);

	return result;
};

export const getMessages: WhatsAppEndpoints['getMessages'] = async (ctx, input) => {
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
			if (input.phoneNumberId && message.phone_number_id !== input.phoneNumberId) {
				return false;
			}
			if (input.contactWaId) {
				const waId = message.wa_id ?? message.from ?? message.recipient_id;
				if (waId !== input.contactWaId) {
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
		'whatsapp.messages.getMessages',
		{ ...input },
		'completed',
	);

	return response;
};

export const listConversations: WhatsAppEndpoints['listConversations'] = async (
	ctx,
	input,
) => {
	if (!ctx.db.conversations) {
		const empty: ListConversationsResponse = {
			conversations: [],
			count: 0,
		};
		return empty;
	}

	const persisted = await ctx.db.conversations.list({
		limit: input.limit,
		offset: input.offset,
	});

	const conversations = persisted
		.map((entity) => entity.data)
		.filter((conversation) => {
			if (input.category && conversation.category !== input.category) {
				return false;
			}
			return true;
		});

	const response: ListConversationsResponse = {
		conversations,
		count: conversations.length,
	};

	await logEventFromContext(
		ctx,
		'whatsapp.messages.listConversations',
		{ ...input },
		'completed',
	);

	return response;
};
