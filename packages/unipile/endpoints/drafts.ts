import { defineOperation, noContent } from './call';

// List all Drafts (GET /v2/{account_id}/drafts)
export const list = defineOperation('draftsList', 'drafts.list', {
	method: 'GET',
	path: '/v2/{account_id}/drafts',
	query: ['to', 'from', 'any_email', 'offset', 'cursor', 'limit'],
});

// Create a Draft (POST /v2/{account_id}/drafts)
export const create = defineOperation('draftsCreate', 'drafts.create', {
	method: 'POST',
	path: '/v2/{account_id}/drafts',
	body: [
		'html',
		'plain_text',
		'subject',
		'from',
		'to',
		'cc',
		'bcc',
		'reply_to',
		'reply_to_message_id',
		'attachments',
		'tracking_options',
	],
});

// Get a Draft (GET /v2/{account_id}/drafts/{draft_id})
export const get = defineOperation('draftsGet', 'drafts.get', {
	method: 'GET',
	path: '/v2/{account_id}/drafts/{draft_id}',
});

// Update a Draft (PATCH /v2/{account_id}/drafts/{draft_id})
export const update = defineOperation('draftsUpdate', 'drafts.update', {
	method: 'PATCH',
	path: '/v2/{account_id}/drafts/{draft_id}',
	body: [
		'html',
		'plain_text',
		'subject',
		'from',
		'to',
		'cc',
		'bcc',
		'reply_to',
		'reply_to_message_id',
		'attachments',
		'tracking_options',
		'specifics',
	],
});

// Delete a Draft (DELETE /v2/{account_id}/drafts/{draft_id})
export const remove = defineOperation(
	'draftsDelete',
	'drafts.delete',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/drafts/{draft_id}',
	},
	noContent,
);

// Send a Draft (POST /v2/{account_id}/drafts/{draft_id}/send)
export const send = defineOperation('draftsSend', 'drafts.send', {
	method: 'POST',
	path: '/v2/{account_id}/drafts/{draft_id}/send',
});
