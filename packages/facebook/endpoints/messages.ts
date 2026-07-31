import { makePageFacebookRequest } from '../client';
import type { FacebookEndpoints } from '../index';
import { cacheUpsert, logFacebookEvent, omitUndefined } from './shared';
import type { FacebookEndpointOutputs } from './types';

export const getDetails: FacebookEndpoints['getMessageDetails'] = async (
	ctx,
	input,
) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getMessageDetails']
	>(`/${input.message_id}`, ctx, input.page_id, {
		query: {
			fields: input.fields ?? 'id,message,created_time,from,to,attachments',
		},
	});

	if (result.id) {
		await cacheUpsert(ctx.db.messages, result.id, {
			messageId: result.id,
			pageId: input.page_id,
			message: result.message,
			createdTime: result.created_time,
			senderId: result.from?.id,
			senderName: result.from?.name,
		});
	}

	await logFacebookEvent(ctx, 'facebook.messages.getDetails', { ...input });
	return result;
};

export const send: FacebookEndpoints['sendMessage'] = async (ctx, input) => {
	const { page_id, recipient_id, message, messaging_type, tag } = input;

	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['sendMessage']
	>(`/${page_id}/messages`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined({
			recipient: { id: recipient_id },
			message: { text: message },
			messaging_type: messaging_type ?? 'RESPONSE',
			tag,
		}),
	});

	await logFacebookEvent(ctx, 'facebook.messages.send', { ...input });
	return result;
};

export const sendMedia: FacebookEndpoints['sendMediaMessage'] = async (
	ctx,
	input,
) => {
	const {
		page_id,
		recipient_id,
		attachment_type,
		attachment_url,
		messaging_type,
		tag,
	} = input;

	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['sendMediaMessage']
	>(`/${page_id}/messages`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined({
			recipient: { id: recipient_id },
			message: {
				attachment: {
					type: attachment_type,
					payload: { url: attachment_url, is_reusable: true },
				},
			},
			messaging_type: messaging_type ?? 'RESPONSE',
			tag,
		}),
	});

	await logFacebookEvent(ctx, 'facebook.messages.sendMedia', { ...input });
	return result;
};

export const markSeen: FacebookEndpoints['markMessageSeen'] = async (
	ctx,
	input,
) => {
	const { page_id, recipient_id } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['markMessageSeen']
	>(`/${page_id}/messages`, ctx, page_id, {
		method: 'POST',
		body: {
			recipient: { id: recipient_id },
			sender_action: 'mark_seen',
		},
	});

	await logFacebookEvent(ctx, 'facebook.messages.markSeen', { ...input });
	return result;
};

export const toggleTyping: FacebookEndpoints['toggleTypingIndicator'] = async (
	ctx,
	input,
) => {
	const { page_id, recipient_id, action } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['toggleTypingIndicator']
	>(`/${page_id}/messages`, ctx, page_id, {
		method: 'POST',
		body: {
			recipient: { id: recipient_id },
			sender_action: action,
		},
	});

	await logFacebookEvent(ctx, 'facebook.messages.toggleTyping', { ...input });
	return result;
};
