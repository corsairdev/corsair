// Fixtures are built from the Roam HQ v1 spec
// (https://developer.ro.am/chat-v1.json) and from the live envelopes a keyless
// call returns.

export const USER_ID = '709b8a57-70bc-4472-baa5-8c86ec68c176';
export const CHAT_ID = '757dfe66-37b4-4772-baa5-8c86ec68c176';
export const GROUP_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
export const MEETING_ID = '11111111-2222-3333-4444-555555555555';
export const TIMESTAMP = 1765602474760032;

/** The live `not_authed` body: Roam labels it `text/plain`. */
export const NOT_AUTHED_TEXT =
	'{"ok":false,"error":"not_authed","message":"Could not find bearer token","requestId":"192198e5-b5c6-4c95-8c66-3f8279ae38eb"}';

/** The live `invalid_token` body. */
export const INVALID_TOKEN_TEXT =
	'{"ok":false,"error":"invalid_token","message":"Could not process OAuth access token","requestId":"523b4f75-76eb-48a3-9daf-879a26756377"}';

/** A `missing_scope` body, which names the scopes that would satisfy it. */
export const MISSING_SCOPE = {
	ok: false,
	error: 'missing_scope',
	message: 'The token lacks a required scope',
	needed: ['chat:send_message', 'chat:write'],
	provided: ['chat:read', 'chat:history'],
	requestId: '33333333-4444-5555-6666-777777777777',
};

/** A revoked token, which the docs say never to retry. */
export const TOKEN_REVOKED = {
	ok: false,
	error: 'token_revoked',
	message: 'Token revoked',
	requestId: '44444444-5555-6666-7777-888888888888',
};

/** The live `not_found` body for an unknown method. */
export const NOT_FOUND = {
	ok: false,
	error: 'not_found',
	message: 'Unknown API method "/v1/nope.nope"',
	requestId: 'ba0d3abd-272c-4be1-b463-f10eb21ea61e',
};

export const USER = {
	id: USER_ID,
	type: 'user',
	name: 'Sam Rivera',
	imageUrl: 'https://cdn.ro.am/avatars/sam.png',
	email: 'sam@example.com',
	isGuest: false,
	isAdmin: false,
	jobTitle: 'Engineer',
	location: 'Amsterdam',
	status: 'active',
	available: true,
	botCode: null,
	integrationId: null,
	willReturn: null,
};

export const USER_REF = {
	id: USER_ID,
	type: 'user',
	name: 'Sam Rivera',
	imageUrl: 'https://cdn.ro.am/avatars/sam.png',
};

export const TOKEN_INFO = {
	ok: true,
	user: USER,
	scopes: ['chat:read', 'chat:write'],
	version: '2026-08-25',
};

export const USER_PAGE = {
	ok: true,
	users: [USER],
	nextCursor: 'next-cursor-1',
};

export const CHAT = {
	id: CHAT_ID,
	name: 'Water Runners',
	created: '2026-01-10T10:00:00.000Z',
	type: 'group',
	isGroup: true,
	memberIds: [USER_ID],
};

export const CHAT_PAGE = {
	ok: true,
	chats: [CHAT],
};

export const MESSAGE = {
	type: 'message',
	userId: USER_ID,
	userType: 'user',
	chatId: CHAT_ID,
	timestamp: TIMESTAMP,
	threadTimestamp: TIMESTAMP,
	replyTimestamp: null,
	ephemeral: false,
	contentType: 'text',
	text: 'Standup in five',
	color: null,
	replyCount: 0,
	items: [],
	mentions: [USER_ID],
	sender: USER_REF,
	poll: null,
	voice: null,
	blocks: [],
};

export const MESSAGE_PAGE = {
	ok: true,
	messages: [MESSAGE],
	nextCursor: 'cursor-2',
};

export const CHAT_POST = {
	ok: true,
	chatId: CHAT_ID,
	timestamp: TIMESTAMP,
};

export const CHAT_POST_SCHEDULED = {
	ok: true,
	chatId: CHAT_ID,
	scheduledMessageId: '55555555-6666-7777-8888-999999999999',
	sendAt: '2026-11-11T09:00:00.000Z',
};

export const CHAT_UPDATE = {
	ok: true,
	chatId: CHAT_ID,
	timestamp: TIMESTAMP,
};

export const REACTION_ADD = {
	ok: true,
	chatId: CHAT_ID,
	timestamp: TIMESTAMP,
	name: 'thumbsup',
};

export const REACTION_LIST = {
	ok: true,
	reactions: [{ name: 'thumbsup', count: 2, users: [USER_ID] }],
};

export const GROUP = {
	id: GROUP_ID,
	chatId: CHAT_ID,
	name: 'Water Runners',
	type: 'public',
	accessMode: 'open',
	groupManagement: 'admins',
	enforceThreadedMode: false,
	dateCreated: '2026-01-10T10:00:00.000Z',
	imageUrl: null,
};

export const GROUP_PAGE = {
	ok: true,
	groups: [GROUP],
};

export const MEETING = {
	id: MEETING_ID,
	title: 'Weekly sync',
	startedAt: '2026-11-10T10:00:00.000Z',
	endedAt: '2026-11-10T10:30:00.000Z',
	created: '2026-11-10T09:55:00.000Z',
	duration: 1800,
	status: 'ended',
	participants: [USER_REF],
	locationId: null,
};

export const MEETING_PAGE = {
	ok: true,
	meetings: [MEETING],
};

export const TRANSCRIPT = {
	ok: true,
	id: MEETING_ID,
	language: 'en',
	segments: [
		{ start: 0, end: 5, speaker: 'Sam Rivera', text: 'Let us start.' },
		{ start: 5, end: 12, speaker: 'Jordan Lee', text: 'Sounds good.' },
	],
	vtt: null,
};
