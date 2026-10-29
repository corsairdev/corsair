import { logEventFromContext } from 'corsair/core';
import { UnipileAPIError } from './client';
import {
	ApiKeys,
	Auth,
	Chats,
	Emails,
	LinkedIn,
	Messages,
	Scopes,
	Users,
} from './endpoints';
import { ACCOUNT_ID, problem } from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

// never parameters: see endpoints.test.ts.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: inputs differ per case.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: 'uk-test' } as never, input as never);
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		init,
		// unknown: whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function file(bytes: Uint8Array, headers: Record<string, string>) {
	fetchMock.mockResolvedValueOnce(
		new Response(bytes, { status: 200, headers }),
	);
}

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4]);

describe('Unipile file downloads', () => {
	it('returns only metadata by default', async () => {
		file(PNG, {
			'content-type': 'image/png',
			'content-disposition': 'attachment; filename="photo.png"',
		});

		const result = await invoke(Messages.getAttachment, {
			account_id: ACCOUNT_ID,
			chat_id: 'chat_1',
			message_id: 'msg_1',
			attachment_id: 'att_1',
		});

		expect(result).toEqual({
			content_type: 'image/png',
			size_bytes: 8,
			filename: 'photo.png',
		});
		const { url, init } = lastCall();
		expect(url).toBe(
			`https://api.unipile.com/v2/${ACCOUNT_ID}/chats/chat_1/messages/msg_1/attachments/att_1`,
		);
		expect(new Headers(init.headers).get('x-api-key')).toBe('uk-test');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'unipile.messages.getAttachment',
			expect.objectContaining({ account_id: ACCOUNT_ID, size_bytes: 8 }),
			'completed',
		);
	});

	it('returns base64 content when asked', async () => {
		file(PNG, { 'content-type': 'image/png' });

		const result = await invoke(Emails.getAttachment, {
			account_id: ACCOUNT_ID,
			email_id: 'em_1',
			attachment_id: 'att_2',
			include_content: true,
		});

		expect(result).toMatchObject({
			content_type: 'image/png',
			size_bytes: 8,
			content_base64: Buffer.from(PNG).toString('base64'),
		});
	});

	it('skips content over max_bytes, using Content-Length without reading it', async () => {
		file(PNG, { 'content-type': 'image/png', 'content-length': '8' });

		const result = await invoke(Users.getPicture, {
			account_id: ACCOUNT_ID,
			user_id: 'me',
			include_content: true,
			max_bytes: 4,
		});

		expect(result).toMatchObject({
			size_bytes: 8,
			content_omitted: expect.stringContaining('over max_bytes'),
		});
		expect(result).not.toHaveProperty('content_base64');
		expect(lastCall().url).toBe(
			`https://api.unipile.com/v2/${ACCOUNT_ID}/users/me/picture`,
		);
	});

	it('raises a Unipile error with the RFC 7807 fields', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify(
					problem(404, 'provider/resource_not_found', 'Not Found', 'No photo'),
				),
				{ status: 404, headers: { 'content-type': 'application/json' } },
			),
		);

		// unknown: a rejection can be any value until toBeInstanceOf narrows it.
		const error = await invoke(Chats.getPicture, {
			account_id: ACCOUNT_ID,
			chat_id: 'chat_1',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(UnipileAPIError);
		expect(error).toMatchObject({
			status: 404,
			type: 'provider/resource_not_found',
		});
	});
});

describe('Unipile hand-written inputs and responses', () => {
	function respond(body: unknown, status = 200) {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(body), {
				status,
				headers: { 'content-type': 'application/json' },
			}),
		);
	}

	it('creates a scoped API key and returns the key once', async () => {
		respond({ object: 'ApiKey', id: 'pk_1', api_key: 'uk_secret_value' });

		const result = await invoke(ApiKeys.create, {
			name: 'Acme workspace key',
			expires_at: '2027-01-01T00:00:00.000Z',
			access: { type: 'scope', scope_id: 'scope_0123456789abcdef0123456789' },
		});

		expect(result).toMatchObject({ id: 'pk_1', api_key: 'uk_secret_value' });
		expect(lastCall().body).toEqual({
			name: 'Acme workspace key',
			expires_at: '2027-01-01T00:00:00.000Z',
			access: { type: 'scope', scope_id: 'scope_0123456789abcdef0123456789' },
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('uk_secret_value');
	});

	it('refuses a scoped API key without a scope_id', async () => {
		await expect(
			invoke(ApiKeys.create, {
				name: 'x',
				expires_at: '2027-01-01T00:00:00.000Z',
				access: { type: 'scope' },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('takes numeric offset and limit on the admin lists', async () => {
		respond({ object: 'Scopes', data: [], has_more: false });

		await invoke(Scopes.list, { offset: 0, limit: 10 });

		const url = new URL(lastCall().url);
		expect(url.searchParams.get('offset')).toBe('0');
		expect(url.searchParams.get('limit')).toBe('10');
	});

	it('never returns a full key from apiKeys.list', async () => {
		respond({
			object: 'ApiKeys',
			has_more: false,
			data: [
				{
					object: 'ApiKey',
					id: 'pk_1',
					application_id: 'app_1',
					prefix: 'uk_ab',
					issued_at: '2026-10-01T00:00:00.000Z',
					expires_at: '2027-01-01T00:00:00.000Z',
					name: 'Backend',
					role: 'account',
					account_scope_id: null,
					api_key: 'uk_should_not_leak',
				},
			],
		});

		const result = await invoke(ApiKeys.list, {});

		expect(JSON.stringify(result)).not.toContain('uk_should_not_leak');
		expect(result).toMatchObject({ data: [{ id: 'pk_1', prefix: 'uk_ab' }] });
	});

	it('passes provider credentials through auth.startIntent', async () => {
		respond({ object: 'AccountCreated', account_id: ACCOUNT_ID });

		await invoke(Auth.startIntent, {
			provider: 'IMAP',
			imap_host: 'imap.example.com',
			imap_user: 'maya@example.com',
		});

		expect(lastCall().body).toEqual({
			provider: 'IMAP',
			imap_host: 'imap.example.com',
			imap_user: 'maya@example.com',
		});
	});

	it('sends messages.forward to_chat_id as the body chat_id', async () => {
		respond({ object: 'MessageSent', message_id: 'msg_9' });

		await invoke(Messages.forward, {
			account_id: ACCOUNT_ID,
			chat_id: 'chat_from',
			message_id: 'msg_1',
			to_chat_id: 'chat_to',
			text: 'FYI',
		});

		const { url, body } = lastCall();
		expect(url).toContain('/chats/chat_from/messages/msg_1/forward');
		expect(body).toEqual({ chat_id: 'chat_to', text: 'FYI' });
	});

	it('returns any JSON from linkedin.request as is', async () => {
		respond([{ urn: 'urn:li:fs_miniProfile:1' }]);

		const result = await invoke(LinkedIn.request, {
			account_id: ACCOUNT_ID,
			url: 'https://www.linkedin.com/voyager/api/me',
			method: 'GET',
		});

		expect(result).toEqual([{ urn: 'urn:li:fs_miniProfile:1' }]);
	});

	it('turns an empty 204 into success', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await invoke(Chats.remove, {
			account_id: ACCOUNT_ID,
			chat_id: 'chat_1',
		});

		expect(result).toEqual({ success: true });
	});
});
