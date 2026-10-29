import { defineBinaryOperation, defineOperation } from './call';

// List all Emails (GET /v2/{account_id}/emails)
export const list = defineOperation('emailsList', 'emails.list', {
	method: 'GET',
	path: '/v2/{account_id}/emails',
	query: [
		'q',
		'meta_only',
		'to',
		'from',
		'any_email',
		'has_attachment',
		'is_starred',
		'is_unread',
		'before',
		'exclude_folder',
		'after',
		'offset',
		'cursor',
		'limit',
	],
});

// List folder Emails (GET /v2/{account_id}/folders/{folder_id}/emails)
export const listInFolder = defineOperation(
	'emailsListInFolder',
	'emails.listInFolder',
	{
		method: 'GET',
		path: '/v2/{account_id}/folders/{folder_id}/emails',
		query: [
			'q',
			'meta_only',
			'to',
			'from',
			'any_email',
			'has_attachment',
			'is_starred',
			'is_unread',
			'before',
			'exclude_folder',
			'after',
			'offset',
			'cursor',
			'limit',
		],
	},
);

// Get a Thread (GET /v2/{account_id}/threads/{thread_id})
export const getThread = defineOperation(
	'emailsGetThread',
	'emails.getThread',
	{
		method: 'GET',
		path: '/v2/{account_id}/threads/{thread_id}',
		query: ['meta_only'],
	},
);

// Get an Email (GET /v2/{account_id}/emails/{email_id})
export const get = defineOperation('emailsGet', 'emails.get', {
	method: 'GET',
	path: '/v2/{account_id}/emails/{email_id}',
	query: ['meta_only'],
});

// Trash an Email (DELETE /v2/{account_id}/emails/{email_id})
export const trash = defineOperation('emailsTrash', 'emails.trash', {
	method: 'DELETE',
	path: '/v2/{account_id}/emails/{email_id}',
});

// Get an Email Attachment (GET /v2/{account_id}/emails/{email_id}/attachments/{attachment_id})
export const getAttachment = defineBinaryOperation(
	'emailsGetAttachment',
	'emails.getAttachment',
	{
		method: 'GET',
		path: '/v2/{account_id}/emails/{email_id}/attachments/{attachment_id}',
	},
);

// Modify an Email (POST /v2/{account_id}/emails/{email_id}/modify)
export const modify = defineOperation('emailsModify', 'emails.modify', {
	method: 'POST',
	path: '/v2/{account_id}/emails/{email_id}/modify',
	body: ['folders_ids', 'specifics'],
});

// Read an Email (POST /v2/{account_id}/emails/{email_id}/read)
export const markRead = defineOperation('emailsMarkRead', 'emails.markRead', {
	method: 'POST',
	path: '/v2/{account_id}/emails/{email_id}/read',
});

// Unread an Email (POST /v2/{account_id}/emails/{email_id}/unread)
export const markUnread = defineOperation(
	'emailsMarkUnread',
	'emails.markUnread',
	{ method: 'POST', path: '/v2/{account_id}/emails/{email_id}/unread' },
);

// Send an Email (POST /v2/{account_id}/emails/send)
export const send = defineOperation('emailsSend', 'emails.send', {
	method: 'POST',
	path: '/v2/{account_id}/emails/send',
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
		'custom_headers',
		'tracking_options',
	],
});

// List email senders (GET /v2/{account_id}/email-senders)
export const listSenders = defineOperation(
	'emailsListSenders',
	'emails.listSenders',
	{ method: 'GET', path: '/v2/{account_id}/email-senders' },
);
