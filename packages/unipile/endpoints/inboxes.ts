import { defineOperation } from './call';

// List all Inboxes (GET /v2/{account_id}/inboxes)
export const list = defineOperation('inboxesList', 'inboxes.list', {
	method: 'GET',
	path: '/v2/{account_id}/inboxes',
});

// List Inbox Chats (GET /v2/{account_id}/inboxes/{inbox_id}/chats)
export const listChats = defineOperation(
	'inboxesListChats',
	'inboxes.listChats',
	{
		method: 'GET',
		path: '/v2/{account_id}/inboxes/{inbox_id}/chats',
		query: [
			'offset',
			'cursor',
			'limit',
			'type',
			'before',
			'after',
			'is_archived',
			'is_unread',
		],
	},
);

// Start a Chat from Inbox (POST /v2/{account_id}/inboxes/{inbox_id}/chats/send)
export const startChat = defineOperation(
	'inboxesStartChat',
	'inboxes.startChat',
	{
		method: 'POST',
		path: '/v2/{account_id}/inboxes/{inbox_id}/chats/send',
		body: ['text', 'name', 'users_ids', 'attachments', 'specifics'],
	},
);
