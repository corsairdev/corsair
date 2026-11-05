import { logEventFromContext } from 'corsair/core';
import { UnipileAPIError } from './client';
import {
	Accounts,
	Chats,
	Messages,
	Posts,
	RelationRequests,
	Users,
	WebhookEndpoints,
} from './endpoints';
import {
	ACCOUNT_ID,
	account,
	accountsPage,
	chat,
	comment,
	MEMBER_ID,
	message,
	post,
	problem,
	profile,
	reaction,
	relationRequest,
	userRelation,
	webhookEndpoint,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'unipile-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const query: Record<string, string | string[]> = {};
	for (const key of new Set(parsed.searchParams.keys())) {
		const values = parsed.searchParams.getAll(key);
		query[key] = values.length > 1 ? values : (values[0] ?? '');
	}
	return {
		origin: parsed.origin,
		// Raw path: ids are percent-encoded on the wire.
		path: url.slice(parsed.origin.length).split('?')[0],
		query,
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

// Reads a dotted path (array indexes as numbers) out of an endpoint result.
// unknown: each case reads a different output shape.
function pick(result: unknown, path: string): unknown {
	return path
		.split('.')
		.reduce<unknown>(
			(value, key) =>
				value !== null && typeof value === 'object'
					? (value as Record<string, unknown>)[key]
					: undefined,
			result,
		);
}

const page = <T>(item: T) => ({
	data: [item],
	total_count: 1,
	next_cursor: 'cur_2',
});

type Case = {
	operation: string;
	endpoint: AnyEndpoint;
	input: Record<string, unknown>;
	// unknown: each case has its own response body.
	response: unknown;
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, string | string[]>;
	// unknown: the JSON body each case expects on the wire.
	body?: unknown;
	expect: Record<string, unknown>;
};

const acc = `/v2/${ACCOUNT_ID}`;

const cases: Case[] = [
	{
		operation: 'accounts.list',
		endpoint: Accounts.list,
		input: { provider: 'linkedin', status: 'running', limit: 10, offset: 20 },
		response: accountsPage,
		method: 'GET',
		path: '/v2/accounts/',
		query: {
			provider: 'linkedin',
			status: 'running',
			limit: '10',
			offset: '20',
		},
		expect: { 'data.0.id': ACCOUNT_ID, has_more: false },
	},
	{
		operation: 'accounts.get',
		endpoint: Accounts.get,
		input: { account_id: ACCOUNT_ID },
		response: account,
		method: 'GET',
		path: `/v2/accounts/${ACCOUNT_ID}`,
		expect: { status: 'running', 'metadata.connection_method': 'unilogin' },
	},
	{
		operation: 'accounts.remove',
		endpoint: Accounts.remove,
		input: { account_id: ACCOUNT_ID },
		response: { success: true },
		method: 'DELETE',
		path: `/v2/accounts/${ACCOUNT_ID}`,
		expect: { success: true },
	},
	{
		operation: 'accounts.createAuthLink',
		endpoint: Accounts.createAuthLink,
		input: {
			providers: 'linkedin',
			redirect_uri: 'https://app.example.com/linkedin/connected',
			expires_on: '2026-10-28T12:00:00.000Z',
			state: 'user_123',
			config: {
				linkedin: {
					allow_methods: ['unilogin', 'credentials'],
					products: ['classic', 'sales_navigator'],
				},
			},
		},
		response: {
			object: 'HostedAuthLink',
			link: 'https://account.unipile.com/abc',
		},
		method: 'POST',
		path: '/v2/auth/link',
		body: {
			providers: 'linkedin',
			redirect_uri: 'https://app.example.com/linkedin/connected',
			expires_on: '2026-10-28T12:00:00.000Z',
			state: 'user_123',
			config: {
				linkedin: {
					allow_methods: ['unilogin', 'credentials'],
					products: ['classic', 'sales_navigator'],
				},
			},
		},
		expect: { link: 'https://account.unipile.com/abc' },
	},
	{
		operation: 'users.getProfile',
		endpoint: Users.getProfile,
		input: {
			account_id: ACCOUNT_ID,
			user_id: 'maya-ruiz',
			with_sections: ['linkedin_experience', 'linkedin_skills'],
		},
		response: profile,
		method: 'GET',
		path: `${acc}/users/maya-ruiz`,
		query: { with_sections: ['linkedin_experience', 'linkedin_skills'] },
		expect: {
			display_name: 'Maya Ruiz',
			'specifics.notify_visit_token': 'visit-token-abc',
		},
	},
	{
		operation: 'users.visitProfile',
		endpoint: Users.visitProfile,
		input: { account_id: ACCOUNT_ID, token: 'visit-token-abc' },
		response: { object: 'ProfileVisited' },
		method: 'POST',
		path: `${acc}/users/visit-profile`,
		query: { token: 'visit-token-abc' },
		expect: { object: 'ProfileVisited' },
	},
	{
		operation: 'users.listRelations',
		endpoint: Users.listRelations,
		input: { account_id: ACCOUNT_ID, cursor: 'cur_1' },
		response: page(userRelation),
		method: 'GET',
		path: `${acc}/users/me/relations`,
		query: { cursor: 'cur_1' },
		expect: { 'data.0.user.id': MEMBER_ID, next_cursor: 'cur_2' },
	},
	{
		operation: 'users.getChat',
		endpoint: Users.getChat,
		input: { account_id: ACCOUNT_ID, user_id: MEMBER_ID },
		response: {
			object: 'ChatLookup',
			data: [{ chat_id: chat.id, has_history: true }],
		},
		method: 'GET',
		path: `${acc}/users/${MEMBER_ID}/chat`,
		expect: { 'data.0.chat_id': chat.id },
	},
	{
		operation: 'users.listReactions',
		endpoint: Users.listReactions,
		input: { account_id: ACCOUNT_ID, user_id: MEMBER_ID, limit: 5 },
		response: page({ ...reaction, parent_post: post }),
		method: 'GET',
		path: `${acc}/users/${MEMBER_ID}/reactions`,
		query: { limit: '5' },
		expect: { 'data.0.parent_post.id': post.id },
	},
	{
		operation: 'users.listComments',
		endpoint: Users.listComments,
		input: { account_id: ACCOUNT_ID },
		response: page({ ...comment, parent_post: null }),
		method: 'GET',
		path: `${acc}/users/me/comments`,
		expect: { 'data.0.text': 'Great release!' },
	},
	{
		operation: 'relationRequests.list',
		endpoint: RelationRequests.list,
		input: { account_id: ACCOUNT_ID, type: 'sent', offset: 10 },
		response: page(relationRequest),
		method: 'GET',
		path: `${acc}/users/me/relation-requests`,
		query: { type: 'sent', offset: '10' },
		expect: { 'data.0.id': 'inv_7d8e9f', 'data.0.type': 'sent' },
	},
	{
		operation: 'relationRequests.create',
		endpoint: RelationRequests.create,
		input: {
			account_id: ACCOUNT_ID,
			user_id: MEMBER_ID,
			message: 'Hi Maya, saw your post on field data.',
		},
		response: relationRequest,
		method: 'POST',
		path: `${acc}/users/me/relation-requests`,
		body: {
			user_id: MEMBER_ID,
			message: 'Hi Maya, saw your post on field data.',
		},
		expect: { id: 'inv_7d8e9f', 'user.id': MEMBER_ID },
	},
	{
		operation: 'relationRequests.cancel',
		endpoint: RelationRequests.cancel,
		input: { account_id: ACCOUNT_ID, request_id: 'inv_7d8e9f' },
		response: { object: 'RelationRequestCanceled' },
		method: 'POST',
		path: `${acc}/users/me/relation-requests/inv_7d8e9f/cancel`,
		expect: { object: 'RelationRequestCanceled' },
	},
	{
		operation: 'relationRequests.accept',
		endpoint: RelationRequests.accept,
		input: { account_id: ACCOUNT_ID, request_id: 'inv_received' },
		response: { object: 'RelationRequestConfirmed' },
		method: 'POST',
		path: `${acc}/users/me/relation-requests/inv_received/accept`,
		expect: { object: 'RelationRequestConfirmed' },
	},
	{
		operation: 'chats.list',
		endpoint: Chats.list,
		input: {
			account_id: ACCOUNT_ID,
			is_unread: true,
			after: '2026-10-01T00:00:00Z',
		},
		response: page(chat),
		method: 'GET',
		path: `${acc}/chats`,
		query: { is_unread: 'true', after: '2026-10-01T00:00:00Z' },
		expect: { 'data.0.id': chat.id, 'data.0.unread_count': 1 },
	},
	{
		operation: 'chats.get',
		endpoint: Chats.get,
		input: { account_id: ACCOUNT_ID, chat_id: chat.id },
		response: chat,
		method: 'GET',
		path: `${acc}/chats/${chat.id}`,
		expect: { type: '1to1' },
	},
	{
		operation: 'chats.start',
		endpoint: Chats.start,
		input: {
			account_id: ACCOUNT_ID,
			users_ids: MEMBER_ID,
			text: 'Hi Maya',
			specifics: { linkedin: { classic: { inmail: true } } },
		},
		response: { object: 'ChatStarted', chat_id: chat.id, message_id: 'msg_1' },
		method: 'POST',
		path: `${acc}/chats/send`,
		body: {
			users_ids: MEMBER_ID,
			text: 'Hi Maya',
			specifics: { linkedin: { classic: { inmail: true } } },
		},
		expect: { chat_id: chat.id, message_id: 'msg_1' },
	},
	{
		operation: 'messages.list',
		endpoint: Messages.list,
		input: { account_id: ACCOUNT_ID, chat_id: chat.id, limit: 20 },
		response: page(message),
		method: 'GET',
		path: `${acc}/chats/${chat.id}/messages`,
		query: { limit: '20' },
		expect: { 'data.0.text': 'Thanks for reaching out!' },
	},
	{
		operation: 'messages.send',
		endpoint: Messages.send,
		input: {
			account_id: ACCOUNT_ID,
			chat_id: chat.id,
			text: 'Great, talk Tuesday?',
			attachments: [
				{
					filename: 'deck.pdf',
					content: 'JVBERi0=',
					content_type: 'application/pdf',
				},
			],
		},
		response: { object: 'MessageSent', message_id: 'msg_2' },
		method: 'POST',
		path: `${acc}/chats/${chat.id}/messages/send`,
		body: {
			text: 'Great, talk Tuesday?',
			attachments: [
				{
					filename: 'deck.pdf',
					content: 'JVBERi0=',
					content_type: 'application/pdf',
				},
			],
		},
		expect: { message_id: 'msg_2' },
	},
	{
		operation: 'posts.list',
		endpoint: Posts.list,
		input: { account_id: ACCOUNT_ID, user_id: 'maya-ruiz' },
		response: page(post),
		method: 'GET',
		path: `${acc}/users/maya-ruiz/posts`,
		expect: { 'data.0.comments_counter': 7 },
	},
	{
		operation: 'posts.listReactions',
		endpoint: Posts.listReactions,
		input: { account_id: ACCOUNT_ID, post_id: post.id },
		response: page(reaction),
		method: 'GET',
		path: `${acc}/posts/urn%3Ali%3Aactivity%3A7250000000000000000/reactions`,
		expect: { 'data.0.sender.display_name': 'Maya Ruiz' },
	},
	{
		operation: 'posts.listComments',
		endpoint: Posts.listComments,
		input: { account_id: ACCOUNT_ID, post_id: post.id, sort_by: 'MOST_RECENT' },
		response: page(comment),
		method: 'GET',
		path: `${acc}/posts/urn%3Ali%3Aactivity%3A7250000000000000000/comments`,
		query: { sort_by: 'MOST_RECENT' },
		expect: { 'data.0.author.id': MEMBER_ID },
	},
	{
		operation: 'webhookEndpoints.list',
		endpoint: WebhookEndpoints.list,
		input: {},
		response: {
			object: 'WebhookEndpoints',
			data: [webhookEndpoint],
			has_more: false,
		},
		method: 'GET',
		path: '/v2/webhooks/endpoints/',
		expect: { 'data.0.id': 'whe_42' },
	},
	{
		operation: 'webhookEndpoints.get',
		endpoint: WebhookEndpoints.get,
		input: { id: 'whe_42' },
		response: webhookEndpoint,
		method: 'GET',
		path: '/v2/webhooks/endpoints/whe_42',
		expect: { url: 'https://example.com/unipile-test' },
	},
	{
		operation: 'webhookEndpoints.create',
		endpoint: WebhookEndpoints.create,
		input: {
			url: 'https://example.com/unipile-test',
			trigger_events: ['relation.new', 'message.new'],
			description: 'Corsair',
		},
		response: webhookEndpoint,
		method: 'POST',
		path: '/v2/webhooks/endpoints/',
		body: {
			url: 'https://example.com/unipile-test',
			trigger_events: ['relation.new', 'message.new'],
			description: 'Corsair',
		},
		expect: { secret: 'whsec-test-secret' },
	},
	{
		operation: 'webhookEndpoints.update',
		endpoint: WebhookEndpoints.update,
		input: { id: 'whe_42', enabled: false },
		response: { ...webhookEndpoint, enabled: false },
		method: 'PATCH',
		path: '/v2/webhooks/endpoints/whe_42',
		body: { enabled: false },
		expect: { enabled: false },
	},
	{
		operation: 'webhookEndpoints.delete',
		endpoint: WebhookEndpoints.remove,
		input: { id: 'whe_42' },
		response: { success: true },
		method: 'DELETE',
		path: '/v2/webhooks/endpoints/whe_42',
		expect: { success: true },
	},
];

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('Unipile endpoints', () => {
	it('covers all 27 operations', () => {
		expect(new Set(cases.map((c) => c.operation)).size).toBe(27);
	});

	it.each(cases)('$operation sends the documented request', async (c) => {
		respond(c.response);

		const result = await invoke(c.endpoint, c.input);

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.unipile.com');
		expect(sent.method).toBe(c.method);
		expect(sent.path).toBe(c.path);
		expect(sent.query).toEqual(c.query ?? {});
		expect(sent.body).toEqual(c.body);
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.headers.get('authorization')).toBeNull();
		for (const [path, value] of Object.entries(c.expect)) {
			expect(pick(result, path)).toEqual(value);
		}
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			`unipile.${c.operation}`,
			expect.any(Object),
			'completed',
		);
	});

	it('defaults the auth link expiry to one hour from now', async () => {
		respond({
			object: 'HostedAuthLink',
			link: 'https://account.unipile.com/x',
		});
		const before = Date.now();

		await invoke(Accounts.createAuthLink, {
			providers: ['linkedin'],
			redirect_uri: 'https://app.example.com/done',
			config: { linkedin: { allow_methods: ['unilogin'] } },
		});

		const body = lastRequest().body as { expires_on: string };
		const expires = Date.parse(body.expires_on);
		expect(expires - before).toBeGreaterThanOrEqual(59 * 60 * 1000);
		expect(expires - before).toBeLessThanOrEqual(61 * 60 * 1000);
	});

	it('builds a reconnect link from account_id alone', async () => {
		respond({
			object: 'HostedAuthLink',
			link: 'https://account.unipile.com/r',
		});

		await invoke(Accounts.createAuthLink, {
			account_id: ACCOUNT_ID,
			redirect_uri: 'https://app.example.com/done',
			expires_on: '2026-10-28T12:00:00+02:00',
		});

		expect(lastRequest().body).toEqual({
			account_id: ACCOUNT_ID,
			redirect_uri: 'https://app.example.com/done',
			expires_on: '2026-10-28T12:00:00+02:00',
		});
	});

	it.each([
		['neither providers nor account_id', {}],
		[
			'both providers and account_id',
			{ providers: 'linkedin', account_id: ACCOUNT_ID },
		],
		[
			'an unknown LinkedIn method',
			{
				providers: 'linkedin',
				config: { linkedin: { allow_methods: ['sso'] } },
			},
		],
	])('refuses an auth link with %s', async (_label, extra) => {
		await expect(
			invoke(Accounts.createAuthLink, {
				redirect_uri: 'https://app.example.com/done',
				...extra,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses an invitation note longer than LinkedIn allows', async () => {
		await expect(
			invoke(RelationRequests.create, {
				account_id: ACCOUNT_ID,
				user_id: MEMBER_ID,
				message: 'x'.repeat(301),
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a webhook endpoint with no events or an unknown one', async () => {
		for (const trigger_events of [[], ['message.created']]) {
			await expect(
				invoke(WebhookEndpoints.create, {
					url: 'https://example.com/hook',
					trigger_events,
				}),
			).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires account_id on per-account operations', async () => {
		await expect(
			invoke(Messages.send, { chat_id: chat.id, text: 'hi' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('encodes ids that contain reserved characters', async () => {
		respond(chat);

		await invoke(Chats.get, { account_id: 'acc/../x', chat_id: 'a b?c' });

		expect(lastRequest().path).toBe('/v2/acc%2F..%2Fx/chats/a%20b%3Fc');
	});

	it('logs ids but never message text', async () => {
		respond({ object: 'MessageSent', message_id: 'msg_2' });

		await invoke(Messages.send, {
			account_id: ACCOUNT_ID,
			chat_id: chat.id,
			text: 'private words',
		});

		const fields = mockLog.mock.calls[0]?.[2];
		expect(fields).toEqual({
			account_id: ACCOUNT_ID,
			chat_id: chat.id,
			message_id: 'msg_2',
		});
		expect(JSON.stringify(fields)).not.toContain('private words');
	});

	it('surfaces an RFC 7807 error as UnipileAPIError', async () => {
		respond(
			problem(
				422,
				'provider/unprocessable_entity',
				'Unprocessable Entity',
				'You can not resend an invitation to this user yet.',
			),
			422,
		);

		// unknown: a rejection can be any value until toBeInstanceOf narrows it.
		const error = await invoke(RelationRequests.create, {
			account_id: ACCOUNT_ID,
			user_id: MEMBER_ID,
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(UnipileAPIError);
		expect(error).toMatchObject({
			status: 422,
			type: 'provider/unprocessable_entity',
			reqId: 'req_test_1',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a response that does not match the schema', async () => {
		respond({ object: 'Chat' });

		await expect(
			invoke(Chats.get, { account_id: ACCOUNT_ID, chat_id: chat.id }),
		).rejects.toThrow();
	});
});

describe('Unipile webhook endpoint secrets', () => {
	const SECRET = webhookEndpoint.secret;

	// unknown: an endpoint result whose keys are inspected.
	function expectRedacted(endpoint: unknown, secretSet: boolean) {
		expect(endpoint).not.toHaveProperty('secret');
		expect(endpoint).toHaveProperty('secret_set', secretSet);
	}

	it('list never returns a signing secret', async () => {
		respond({
			object: 'WebhookEndpoints',
			data: [webhookEndpoint, { ...webhookEndpoint, id: 'whe_43', secret: '' }],
			has_more: false,
		});

		const result = await invoke(WebhookEndpoints.list, {});

		const data = pick(result, 'data') as unknown[];
		expect(data).toHaveLength(2);
		expectRedacted(data[0], true);
		expectRedacted(data[1], false);
		expect(JSON.stringify(result)).not.toContain(SECRET);
	});

	it('get never returns the signing secret', async () => {
		respond(webhookEndpoint);

		const result = await invoke(WebhookEndpoints.get, { id: 'whe_42' });

		expectRedacted(result, true);
		expect(pick(result, 'url')).toBe('https://example.com/unipile-test');
		expect(JSON.stringify(result)).not.toContain(SECRET);
	});

	it('update never returns the signing secret Unipile echoes', async () => {
		respond({ ...webhookEndpoint, enabled: false });

		const result = await invoke(WebhookEndpoints.update, {
			id: 'whe_42',
			enabled: false,
		});

		expectRedacted(result, true);
		expect(JSON.stringify(result)).not.toContain(SECRET);
	});

	it('reports secret_set false when Unipile sends no secret', async () => {
		const { secret: _secret, ...withoutSecret } = webhookEndpoint;
		respond(withoutSecret);

		expectRedacted(await invoke(WebhookEndpoints.get, { id: 'whe_42' }), false);
	});

	it('create returns the secret, and only the log gets ids', async () => {
		respond(webhookEndpoint);

		const result = await invoke(WebhookEndpoints.create, {
			url: 'https://example.com/unipile-test',
			trigger_events: ['relation.new'],
		});

		expect(pick(result, 'secret')).toBe(SECRET);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(SECRET);
	});
});

describe('Unipile writes never fail after Unipile accepted them', () => {
	beforeEach(() => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	});

	it('returns an unparseable 201 from relationRequests.create with a warning', async () => {
		respond({ object: 'RelationRequest', status: 'queued' }, 201);

		const result = await invoke(RelationRequests.create, {
			account_id: ACCOUNT_ID,
			user_id: MEMBER_ID,
		});

		expect(result).toMatchObject({
			parse_warning: expect.stringContaining('do not resend'),
			raw: { object: 'RelationRequest', status: 'queued' },
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'unipile.relationRequests.create',
			expect.objectContaining({ account_id: ACCOUNT_ID, unparsed_response: 1 }),
			'completed',
		);
	});

	it('returns an unparseable messages.send body with a warning', async () => {
		respond('queued');

		const result = await invoke(Messages.send, {
			account_id: ACCOUNT_ID,
			chat_id: chat.id,
			text: 'Hi',
		});

		expect(result).toMatchObject({
			parse_warning: expect.any(String),
			raw: 'queued',
		});
	});

	it('returns an empty 201 from chats.start with a warning', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(null, {
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		jest.spyOn(console, 'error').mockImplementation(() => undefined);

		const result = await invoke(Chats.start, {
			account_id: ACCOUNT_ID,
			users_ids: MEMBER_ID,
			text: 'Hi',
		});

		expect(result).toMatchObject({ parse_warning: expect.any(String) });
	});

	it('still returns a sent message when event logging fails', async () => {
		mockLog.mockRejectedValueOnce(new Error('database is locked'));
		respond({ object: 'MessageSent', message_id: 'msg_3' });

		const result = await invoke(Messages.send, {
			account_id: ACCOUNT_ID,
			chat_id: chat.id,
			text: 'Hi',
		});

		expect(result).toMatchObject({ message_id: 'msg_3' });
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('could not log unipile.messages.send'),
			'database is locked',
		);
	});

	it('still rejects an unparseable read, which is safe to retry', async () => {
		respond({ object: 'Chat' });

		await expect(
			invoke(Chats.get, { account_id: ACCOUNT_ID, chat_id: chat.id }),
		).rejects.toThrow();
	});
});
