import { signUnipilePayload } from './webhooks/types';

// Bodies shaped like the Unipile v2 SDK types (API 2.62), with made-up people.
// Checked live on 2026-10-28: GET /v2/accounts/ and POST /v2/auth/link match
// these shapes. The application had no LinkedIn account connected, so
// LinkedIn responses follow the SDK types, and webhook endpoint calls need a
// Service API Key the test key did not have (403 api/insufficient_permissions).

export const ACCOUNT_ID = 'acc_9f2c1d7e';
export const MEMBER_ID = 'ACoAAB1cDeFgHiJkLmNoPqRsTuVwXyZ0123456';

export const user = {
	id: MEMBER_ID,
	object: 'User',
	type: 'individual',
	public_identifier: 'maya-ruiz',
	display_name: 'Maya Ruiz',
	first_name: 'Maya',
	last_name: 'Ruiz',
	profile_url: 'https://www.linkedin.com/in/maya-ruiz',
	description: 'Head of Engineering at Fieldkit',
	specifics: { network_distance: 'SECOND_DEGREE', location: 'Austin' },
};

export const account = {
	object: 'Account',
	id: ACCOUNT_ID,
	name: 'Pat Lee',
	user_id: 'ACoAAAPatLee',
	created_at: '2026-10-20T09:00:00.000Z',
	application_id: 'app_1a2b3c',
	account_scope_id: null,
	status: 'running',
	is_locked: false,
	provider: 'linkedin',
	metadata: {
		connection_method: 'unilogin',
		products_connection_status: { classic: 'running' },
	},
};

export const accountsPage = {
	object: 'Accounts',
	data: [account],
	has_more: false,
};

export const profile = {
	...user,
	object: 'UserProfile',
	provider: 'linkedin',
	bio: 'I build teams.',
	location: 'Austin, Texas, United States',
	followers_count: 1200,
	relations_count: 500,
	is_blocked: false,
	specifics: {
		member_id: '123456789',
		network_distance: 'SECOND_DEGREE',
		can_send_inmail: false,
		is_open_profile: false,
		notify_visit_token: 'visit-token-abc',
		experience: [{ job_title: 'Head of Engineering', company: { id: null } }],
	},
};

export const relationRequest = {
	object: 'RelationRequest',
	type: 'sent',
	id: 'inv_7d8e9f',
	created_at: '2026-10-27T10:00:00.000Z',
	message: 'Hi Maya, saw your post on field data.',
	user,
};

export const userRelation = {
	object: 'UserRelation',
	id: 'rel_1234',
	created_at: '2026-10-28T08:00:00.000Z',
	user,
};

export const chat = {
	object: 'Chat',
	id: 'chat_5a6b7c',
	name: 'Maya Ruiz',
	type: '1to1',
	is_group: false,
	is_1to1: true,
	is_channel: false,
	is_pinned: false,
	is_readonly: false,
	is_archived: false,
	folders: ['INBOX'],
	unread_count: 1,
	muted_until: false,
	provider: 'linkedin',
	last_message_timestamp: '2026-10-28T08:30:00.000Z',
};

export const message = {
	object: 'Message',
	id: 'msg_1f2e3d',
	chat_id: chat.id,
	sender_id: MEMBER_ID,
	text: 'Thanks for reaching out!',
	timestamp: '2026-10-28T08:30:00.000Z',
	is_sender: false,
	is_hidden: false,
	is_seen: false,
	is_delivered: true,
	is_deleted: false,
	is_edited: false,
	is_pinned: false,
	is_event: false,
	is_mentionned: false,
	reactions_counter: [],
	provider: 'linkedin',
	attachments: [],
	hyperlinks: [],
};

export const post = {
	object: 'Post',
	id: 'urn:li:activity:7250000000000000000',
	share_url:
		'https://www.linkedin.com/feed/update/urn:li:activity:7250000000000000000',
	created_at: '2026-10-25T12:00:00.000Z',
	text: 'We open-sourced our field data toolkit.',
	user_reacted: false,
	permissions: {},
	reactions_counter: [{ reaction: 'LIKE', count: 42 }],
	comments_counter: 7,
	reposts_counter: 2,
	attachments: [],
	is_repost: false,
	author: user,
};

export const reaction = {
	object: 'Reaction',
	value: 'LIKE',
	is_sender: false,
	sender: user,
};

export const comment = {
	object: 'Comment',
	id: 'cmt_99',
	created_at: '2026-10-25T13:00:00.000Z',
	text: 'Great release!',
	attachments: [],
	is_sender: false,
	can_reply: true,
	can_react: true,
	reply_counter: 0,
	reactions_counter: [],
	author: user,
};

export const webhookEndpoint = {
	object: 'WebhookEndpoint',
	id: 'whe_42',
	enabled: true,
	description: 'Corsair',
	url: 'https://example.com/unipile-test',
	trigger_events: ['relation.new', 'message.new'],
	secret: 'whsec-test-secret',
	application_id: 'app_1a2b3c',
	account_ids: [],
	account_targets: [],
};

// unknown: extra fields vary per error.
export function problem(
	status: number,
	type: string,
	title: string,
	detail?: string,
) {
	return {
		object: 'Error',
		type,
		status,
		title,
		...(detail ? { detail } : {}),
		req_id: 'req_test_1',
	};
}

export const WEBHOOK_SECRET = 'whsec-test-secret';

function envelope(type: string, payload: Record<string, unknown>) {
	return {
		id: 'evt_0001',
		created_at: '2026-10-28T09:00:00.000Z',
		account_id: ACCOUNT_ID,
		account_provider: 'linkedin',
		account_name: 'Pat Lee',
		application_id: 'app_1a2b3c',
		application_production: false,
		type,
		payload,
	};
}

export const events = {
	'relation.new': envelope('relation.new', userRelation),
	'message.new': envelope('message.new', message),
	'message.receipt.read': envelope('message.receipt.read', {
		chat_id: chat.id,
		message_id: message.id,
		user_id: MEMBER_ID,
		timestamp: '2026-10-28T09:01:00.000Z',
	}),
	'account.status.running': envelope('account.status.running', {
		timestamp: '2026-10-28T09:00:00.000Z',
	}),
	'account.status.partial': envelope('account.status.partial', {
		timestamp: '2026-10-28T09:00:00.000Z',
		product: 'sales_navigator',
	}),
	'account.status.degraded': envelope('account.status.degraded', {
		timestamp: '2026-10-28T09:00:00.000Z',
		product: 'recruiter',
		reason: 'provider',
	}),
	'account.status.errored': envelope('account.status.errored', {
		timestamp: '2026-10-28T09:00:00.000Z',
		reason: 'proxy',
	}),
	'account.status.disconnected': envelope('account.status.disconnected', {
		timestamp: '2026-10-28T09:00:00.000Z',
	}),
	'account.add': envelope('account.add', { account, state: 'user_123' }),
	'account.reconnect': envelope('account.reconnect', {
		account,
		state: 'user_123',
	}),
	'account.remove': envelope('account.remove', { account: { id: ACCOUNT_ID } }),
	'account.locked': envelope('account.locked', {
		timestamp: '2026-10-28T09:00:00.000Z',
	}),
	'account.unlocked': envelope('account.unlocked', {
		timestamp: '2026-10-28T09:00:00.000Z',
	}),
} as const;

/** Headers Unipile would send with `rawBody`, signed with `secret`. */
export function signedHeaders(
	rawBody: string,
	secret = WEBHOOK_SECRET,
	timestamp = Math.floor(Date.now() / 1000),
): Record<string, string> {
	const t = String(timestamp);
	return {
		'content-type': 'application/json',
		'unipile-signature': `t=${t},v0=${signUnipilePayload(secret, t, rawBody)}`,
	};
}
