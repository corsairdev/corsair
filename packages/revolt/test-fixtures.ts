// Fixtures follow the published Stoat API 0.16.3 OpenAPI document
// (https://api.stoat.chat/openapi.json). The error bodies are live responses.

export const USER_ID = '01F8Z0T8Y4W4Z8X3K5M2N1P0Q9';
export const CHANNEL_ID = '01F8Z1A2B3C4D5E6F7G8H9J0K1';
export const MESSAGE_ID = '01F8Z2B3C4D5E6F7G8H9J0K1L2';
export const SERVER_ID = '01F8Z3C4D5E6F7G8H9J0K1L2M3';

/** The live 401, verbatim from a keyless call. */
export const UNAUTHORIZED = {
	error: {
		code: 401,
		reason: 'Unauthorized',
		description: 'The request requires user authentication.',
	},
};

/** A 404 in the same envelope. */
export const NOT_FOUND = {
	error: {
		code: 404,
		reason: 'NotFound',
		description: 'Not found.',
	},
};

/** A refused body. */
export const VALIDATION_ERROR = {
	error: {
		code: 400,
		reason: 'FailedValidation',
		description: 'Message content cannot be empty.',
	},
};

/** A rate limit, whose `retry_after` the docs give in milliseconds. */
export const RATE_LIMITED = {
	error: {
		code: 429,
		reason: 'RateLimited',
		description: 'Too many requests.',
	},
	retry_after: 1200,
};

/** A block, which also arrives as a 429 but never clears on a retry. */
export const BLOCKED = {
	error: {
		code: 429,
		reason: 'Blocked',
		description: 'The request was blocked.',
	},
};

export const USER = {
	_id: USER_ID,
	username: 'sam',
	discriminator: '0001',
	display_name: 'Sam Rivera',
	pronouns: 'they/them',
	online: true,
	badges: 0,
	flags: 0,
	privileged: false,
	relationship: 'Friend',
	avatar: null,
	bot: null,
	status: { text: 'Building things', presence: 'Online' },
};

export const MEMBER = {
	_id: `${SERVER_ID}:${USER_ID}`,
	server: SERVER_ID,
	user: USER_ID,
	nickname: 'Sam',
	joined_at: '2026-01-01T00:00:00.000Z',
	roles: [],
	avatar: null,
};

export const MESSAGE = {
	_id: MESSAGE_ID,
	channel: CHANNEL_ID,
	author: USER_ID,
	content: 'Standup in five',
	nonce: null,
	edited: null,
	pinned: false,
	flags: 0,
	attachments: [],
	mentions: [],
	role_mentions: [],
	replies: [],
	reactions: {},
	embeds: [],
	user: USER,
	member: MEMBER,
};

/** With `include_users=true` the list comes back as an object. */
export const MESSAGE_LIST = {
	messages: [MESSAGE],
	users: [USER],
	members: [MEMBER],
};

/** Without `include_users` the same route answers a bare array (live, 11-12). */
export const MESSAGE_ARRAY = [MESSAGE];

export const CHANNEL = {
	_id: CHANNEL_ID,
	channel_type: 'TextChannel',
	name: 'general',
	description: 'General chat',
	server: SERVER_ID,
	owner: null,
	recipients: null,
	default_permissions: 0,
	icon: null,
};

export const DM_CHANNEL = {
	_id: '01F8Z4D5E6F7G8H9J0K1L2M3N4',
	channel_type: 'DirectMessage',
	active: true,
	recipients: [USER_ID, '01F8Z5E6F7G8H9J0K1L2M3N4P5'],
	last_message_id: MESSAGE_ID,
};

/** `GET /users/dms` answers a bare array of channels, with no users beside it. */
export const DM_LIST = [DM_CHANNEL];

export const SERVER = {
	_id: SERVER_ID,
	name: 'Acme',
	owner: USER_ID,
	description: 'The Acme server',
	channels: [CHANNEL_ID],
	categories: [],
	roles: {},
	default_permissions: 0,
	icon: null,
	banner: null,
	flags: 0,
	analytics: false,
	discoverable: true,
};

export const MEMBER_LIST = { members: [MEMBER], users: [USER] };
