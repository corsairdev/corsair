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

	const searchOptions: Parameters<typeof ctx.db.messages.search>[0] = {
		limit: input.limit,
		offset: input.offset,
	};
	const countOptions: Parameters<typeof ctx.db.messages.count>[0] = {};

	if (input.phoneNumberId || input.contactWaId || input.direction || input.status) {
		searchOptions.data = {};
		countOptions.data = {};
		if (input.phoneNumberId) {
			searchOptions.data.phone_number_id = input.phoneNumberId;
			countOptions.data.phone_number_id = input.phoneNumberId;
		}
		if (input.contactWaId) {
			searchOptions.data.wa_id = input.contactWaId;
			countOptions.data.wa_id = input.contactWaId;
		}
		if (input.direction) {
			searchOptions.data.direction = input.direction;
			countOptions.data.direction = input.direction;
		}
		if (input.status) {
			searchOptions.data.status = input.status;
			countOptions.data.status = input.status;
		}
	}

	const [persisted, count] = await Promise.all([
		ctx.db.messages.search(searchOptions),
		ctx.db.messages.count(countOptions),
	]);

	const response: GetMessagesResponse = {
		messages: persisted.map((entity) => entity.data),
		count,
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

	const searchOptions: Parameters<typeof ctx.db.conversations.search>[0] = {
		limit: input.limit,
		offset: input.offset,
	};
	const countOptions: Parameters<typeof ctx.db.conversations.count>[0] = {};

	if (input.category) {
		searchOptions.data = { category: input.category };
		countOptions.data = { category: input.category };
	}

	const [persisted, count] = await Promise.all([
		ctx.db.conversations.search(searchOptions),
		ctx.db.conversations.count(countOptions),
	]);

	const response: ListConversationsResponse = {
		conversations: persisted.map((entity) => entity.data),
		count,
	};

	await logEventFromContext(
		ctx,
		'whatsapp.messages.listConversations',
		{ ...input },
		'completed',
	);

	return response;
};
