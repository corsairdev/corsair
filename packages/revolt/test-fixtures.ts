// Fixtures follow the published Stoat API 0.16.3 OpenAPI document
// (https://api.stoat.chat/openapi.json), checked against live answers from a
// self-hosted Stoat 0.16.2 on 11-12. The error bodies are live responses.

export const USER_ID = '01F8Z0T8Y4W4Z8X3K5M2N1P0Q9';
export const CHANNEL_ID = '01F8Z1A2B3C4D5E6F7G8H9J0K1';
export const MESSAGE_ID = '01F8Z2B3C4D5E6F7G8H9J0K1L2';
export const SERVER_ID = '01F8Z3C4D5E6F7G8H9J0K1L2M3';

/** The live 401 from Rocket's catcher, verbatim (sent `Accept: application/json`). */
export const UNAUTHORIZED = {
	error: {
		code: 401,
		reason: 'Unauthorized',
		description: 'The request requires user authentication.',
	},
};

/** The live 422 for a body Rocket cannot parse, such as a reply without `mention`. */
export const UNPROCESSABLE = {
	error: {
		code: 422,
		reason: 'Unprocessable Entity',
		description:
			'The request was well-formed but was unable to be followed due to semantic errors.',
	},
};

/** A 404 names the error `type` and the source location. */
export const NOT_FOUND = {
	type: 'NotFound',
	location: 'crates/core/database/src/models/channels/ops/mongodb.rs:23:70',
};

/** A message with no content and no attachment answers 422. */
export const VALIDATION_ERROR = {
	type: 'EmptyMessage',
	location: 'crates/core/database/src/models/messages/model.rs:297:24',
};

/** A bot without the right names the permission it lacks. */
export const MISSING_PERMISSION = {
	type: 'MissingPermission',
	permission: 'ManageChannel',
	location: 'crates/core/permissions/src/models/mod.rs:80:17',
};

/** A rate limit carries only `retry_after`, in milliseconds. */
export const RATE_LIMITED = { retry_after: 1200 };

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

/** A member's `_id` is the server and user pair, not a string (live, 11-12). */
export const MEMBER = {
	_id: { server: SERVER_ID, user: USER_ID },
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

/** A server channel's permissions are allow/deny overrides, not a number. */
export const CHANNEL = {
	_id: CHANNEL_ID,
	channel_type: 'TextChannel',
	name: 'general',
	description: 'General chat',
	server: SERVER_ID,
	default_permissions: { a: 0, d: 0 },
	role_permissions: { '01F8Z6F7G8H9J0K1L2M3N4P5Q6': { a: 1, d: 0 } },
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
	// A role's permissions are allow/deny overrides, like a channel's.
	roles: {
		'01F8Z6F7G8H9J0K1L2M3N4P5Q6': {
			_id: '01F8Z6F7G8H9J0K1L2M3N4P5Q6',
			name: 'Moderator',
			permissions: { a: 1, d: 0 },
			rank: 0,
		},
	},
	default_permissions: 2276038022144,
	approximate_member_count: 2,
	icon: null,
	banner: null,
	flags: 0,
	analytics: false,
	discoverable: true,
};

/** With `include_channels=true` the channel ids become channel objects. */
export const SERVER_WITH_CHANNELS = { ...SERVER, channels: [CHANNEL] };

export const MEMBER_LIST = { members: [MEMBER], users: [USER] };
