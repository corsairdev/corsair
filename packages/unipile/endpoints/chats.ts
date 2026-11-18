import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import {
	accountPath,
	call,
	defineBinaryOperation,
	defineOperation,
	noContent,
} from './call';

export const list: UnipileEndpoints['chatsList'] = (ctx, input) =>
	call(ctx, 'chatsList', 'chats.list', input, (parsed) => ({
		method: 'GET',
		path: accountPath(parsed.account_id, '/chats'),
		query: {
			type: parsed.type,
			before: parsed.before,
			after: parsed.after,
			is_archived: parsed.is_archived,
			is_unread: parsed.is_unread,
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));

export const get: UnipileEndpoints['chatsGet'] = (ctx, input) =>
	call(ctx, 'chatsGet', 'chats.get', input, (parsed) => ({
		method: 'GET',
		path: accountPath(parsed.account_id, `/chats/${segment(parsed.chat_id)}`),
	}));

// Sends the first message of a new chat. Never retried on a timeout or 5xx.
export const start: UnipileEndpoints['chatsStart'] = (ctx, input) =>
	call(ctx, 'chatsStart', 'chats.start', input, (parsed) => {
		const { account_id, ...body } = parsed;
		return {
			method: 'POST',
			path: accountPath(account_id, '/chats/send'),
			body,
		};
	});

// Update a Chat (PATCH /v2/{account_id}/chats/{chat_id})
export const update = defineOperation('chatsUpdate', 'chats.update', {
	method: 'PATCH',
	path: '/v2/{account_id}/chats/{chat_id}',
	body: [
		'name',
		'pin_status',
		'archive_status',
		'label',
		'muted_until',
		'read_status',
	],
});

// Delete a Chat (DELETE /v2/{account_id}/chats/{chat_id})
export const remove = defineOperation(
	'chatsDelete',
	'chats.delete',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/chats/{chat_id}',
	},
	noContent,
);

// Get a Chat Picture (GET /v2/{account_id}/chats/{chat_id}/picture)
export const getPicture = defineBinaryOperation(
	'chatsGetPicture',
	'chats.getPicture',
	{ method: 'GET', path: '/v2/{account_id}/chats/{chat_id}/picture' },
);

// List all Chat Participants (GET /v2/{account_id}/chats/{chat_id}/participants)
export const listParticipants = defineOperation(
	'chatsListParticipants',
	'chats.listParticipants',
	{
		method: 'GET',
		path: '/v2/{account_id}/chats/{chat_id}/participants',
		query: ['offset', 'cursor', 'limit'],
	},
);

// Add a Chat Participant (POST /v2/{account_id}/chats/{chat_id}/participants)
export const addParticipant = defineOperation(
	'chatsAddParticipant',
	'chats.addParticipant',
	{
		method: 'POST',
		path: '/v2/{account_id}/chats/{chat_id}/participants',
		body: ['user_id'],
	},
);

// Remove a Chat Participant (DELETE /v2/{account_id}/chats/{chat_id}/participants/{user_id})
export const removeParticipant = defineOperation(
	'chatsRemoveParticipant',
	'chats.removeParticipant',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/chats/{chat_id}/participants/{user_id}',
	},
);

// Set Composing Status (POST /v2/{account_id}/chats/{chat_id}/composing)
export const setComposing = defineOperation(
	'chatsSetComposing',
	'chats.setComposing',
	{
		method: 'POST',
		path: '/v2/{account_id}/chats/{chat_id}/composing',
		query: ['action'],
	},
);
