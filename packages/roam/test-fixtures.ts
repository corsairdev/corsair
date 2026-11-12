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
	user: { id: USER_ID, name: 'Sam Rivera', email: 'sam@example.com' },
	bot: { id: GROUP_ID, name: 'Corsair bot' },
	clientId: 'client-123',
	scopes: ['chat:read', 'chat:write'],
	roam: { id: '42', name: 'Corsair Plugin Test' },
};

export const USER_PAGE = {
	ok: true,
	users: [USER],
	nextCursor: 'next-cursor-1',
};

export const CHAT = {
	id: CHAT_ID,
	type: 'group',
	name: 'Water Runners',
	groupId: GROUP_ID,
	created: '2026-01-10T10:00:00.000Z',
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

/** A poll message as the spec returns it: options are `{ id, text }` objects. */
export const POLL_MESSAGE = {
	type: 'message',
	userId: USER_ID,
	userType: 'user',
	chatId: CHAT_ID,
	timestamp: TIMESTAMP + 1,
	contentType: 'poll',
	poll: {
		question: 'Lunch?',
		options: [
			{ id: 'opt-1', text: 'Pizza' },
			{ id: 'opt-2', text: 'Salad' },
		],
		allowMultipleAnswers: false,
	},
};

/** A block message whose block type is not one a post may send. */
export const BLOCK_MESSAGE = {
	type: 'message',
	userId: USER_ID,
	userType: 'bot',
	chatId: CHAT_ID,
	timestamp: TIMESTAMP + 2,
	contentType: 'block',
	blocks: [{ type: 'image', image_url: 'https://cdn.ro.am/x.png', alt_text: 'x' }],
};

/** A voice message as the spec returns it. */
export const VOICE_MESSAGE = {
	type: 'message',
	userId: USER_ID,
	userType: 'user',
	chatId: CHAT_ID,
	timestamp: TIMESTAMP + 3,
	contentType: 'voice',
	voice: {
		audioUrl: 'https://cdn.ro.am/voice.m4a',
		duration: 4,
		transcript: 'On my way',
	},
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
	chatId: CHAT_ID,
	timestamp: TIMESTAMP,
	reactions: [{ name: 'thumbsup', count: 2, users: [USER_ID] }],
	pollVotes: [{ optionId: 'opt-1', text: 'Pizza', count: 1, users: [USER_ID] }],
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
	start: '2026-11-10T10:00:00.000Z',
	participantCount: 2,
	hasVideo: false,
	videoStatus: 'none',
	host: { type: 'member', id: USER_ID, name: 'Sam Rivera' },
};

export const MEETING_PAGE = {
	ok: true,
	meetings: [MEETING],
};

export const TRANSCRIPT = {
	ok: true,
	id: MEETING_ID,
	cues: [
		{ speakerId: USER_ID, text: 'Let us start.', start: 0, end: 5000 },
		{ speakerId: GROUP_ID, text: 'Sounds good.', start: 5000, end: 12000 },
	],
};
