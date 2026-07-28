import { makePageFacebookRequest } from '../client';
import type { FacebookEndpoints } from '../index';
import { buildPaginationQuery, cacheUpsert, logFacebookEvent } from './shared';
import type { FacebookEndpointOutputs } from './types';

export const list: FacebookEndpoints['getPageConversations'] = async (
	ctx,
	input,
) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPageConversations']
	>(`/${input.page_id}/conversations`, ctx, input.page_id, {
		query: buildPaginationQuery({
			fields:
				input.fields ??
				'id,link,updated_time,message_count,unread_count,snippet,participants',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	if (result.data) {
		for (const conversation of result.data) {
			if (!conversation.id) continue;
			await cacheUpsert(ctx.db.conversations, conversation.id, {
				conversationId: conversation.id,
				pageId: input.page_id,
				updatedTime: conversation.updated_time,
				messageCount: conversation.message_count,
				unreadCount: conversation.unread_count,
				snippet: conversation.snippet,
			});
		}
	}

	await logFacebookEvent(ctx, 'facebook.conversations.list', { ...input });
	return result;
};

export const getMessages: FacebookEndpoints['getConversationMessages'] = async (
	ctx,
	input,
) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getConversationMessages']
	>(`/${input.conversation_id}/messages`, ctx, input.page_id, {
		query: buildPaginationQuery({
			fields: input.fields ?? 'id,message,created_time,from,to,attachments',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	if (result.data) {
		for (const message of result.data) {
			if (!message.id) continue;
			await cacheUpsert(ctx.db.messages, message.id, {
				messageId: message.id,
				conversationId: input.conversation_id,
				pageId: input.page_id,
				message: message.message,
				createdTime: message.created_time,
				senderId: message.from?.id,
				senderName: message.from?.name,
			});
		}
	}

	await logFacebookEvent(ctx, 'facebook.conversations.getMessages', {
		...input,
	});
	return result;
};
