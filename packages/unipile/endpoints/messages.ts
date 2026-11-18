import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import {
	accountPath,
	call,
	defineBinaryOperation,
	defineOperation,
	noContent,
} from './call';

export const list: UnipileEndpoints['messagesList'] = (ctx, input) =>
	call(ctx, 'messagesList', 'messages.list', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/chats/${segment(parsed.chat_id)}/messages`,
		),
		query: {
			before: parsed.before,
			after: parsed.after,
			user_id: parsed.user_id,
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));

// Never retried on a timeout or 5xx: a duplicate message is worse than none.
export const send: UnipileEndpoints['messagesSend'] = (ctx, input) =>
	call(ctx, 'messagesSend', 'messages.send', input, (parsed) => {
		const { account_id, chat_id, ...body } = parsed;
		return {
			method: 'POST',
			path: accountPath(account_id, `/chats/${segment(chat_id)}/messages/send`),
			body,
		};
	});

// Get a Message (GET /v2/{account_id}/chats/{chat_id}/messages/{message_id})
export const get = defineOperation('messagesGet', 'messages.get', {
	method: 'GET',
	path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}',
});

// Delete a Message (DELETE /v2/{account_id}/chats/{chat_id}/messages/{message_id})
export const remove = defineOperation(
	'messagesDelete',
	'messages.delete',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}',
	},
	noContent,
);

// Forward a Message (POST /v2/{account_id}/chats/{chat_id}/messages/{message_id}/forward)
export const forward = defineOperation('messagesForward', 'messages.forward', {
	method: 'POST',
	path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}/forward',
	body: ['to_chat_id', 'text'],
	rename: { to_chat_id: 'chat_id' },
});

// Modify a Message (POST /v2/{account_id}/chats/{chat_id}/messages/{message_id}/modify)
export const edit = defineOperation('messagesEdit', 'messages.edit', {
	method: 'POST',
	path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}/modify',
	body: ['text'],
});

// Read a Message (POST /v2/{account_id}/chats/{chat_id}/messages/{message_id}/read)
export const markRead = defineOperation(
	'messagesMarkRead',
	'messages.markRead',
	{
		method: 'POST',
		path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}/read',
	},
);

// Pin a Message (POST /v2/{account_id}/chats/{chat_id}/messages/{message_id}/pin)
export const pin = defineOperation('messagesPin', 'messages.pin', {
	method: 'POST',
	path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}/pin',
	body: ['pin_status', 'specifics'],
});

// List all Message's Reactions (GET /v2/{account_id}/chats/{chat_id}/messages/{message_id}/reactions)
export const listReactions = defineOperation(
	'messagesListReactions',
	'messages.listReactions',
	{
		method: 'GET',
		path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}/reactions',
		query: ['offset', 'cursor', 'limit'],
	},
);

// Add a Message Reaction (POST /v2/{account_id}/chats/{chat_id}/messages/{message_id}/reactions)
export const addReaction = defineOperation(
	'messagesAddReaction',
	'messages.addReaction',
	{
		method: 'POST',
		path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}/reactions',
		body: ['reaction'],
	},
);

// Remove a Message Reaction (DELETE /v2/{account_id}/chats/{chat_id}/messages/{message_id}/reactions)
export const removeReaction = defineOperation(
	'messagesRemoveReaction',
	'messages.removeReaction',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}/reactions',
		body: ['reaction'],
	},
);

// Get a Message Attachment (GET /v2/{account_id}/chats/{chat_id}/messages/{message_id}/attachments/{attachment_id})
export const getAttachment = defineBinaryOperation(
	'messagesGetAttachment',
	'messages.getAttachment',
	{
		method: 'GET',
		path: '/v2/{account_id}/chats/{chat_id}/messages/{message_id}/attachments/{attachment_id}',
	},
);
