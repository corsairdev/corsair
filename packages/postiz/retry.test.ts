import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { POSTIZ_API_BASE } from './client';
import { postiz } from './index';
import { captureError } from './test-helpers';

async function createClient(options: Parameters<typeof postiz>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'postiz', 'default');
	const corsair = createCorsair({
		plugins: [postiz(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** Queues one response for the next fetch call. */
function respond(
	body: unknown, // unknown: each test passes one of Postiz's response shapes.
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

const integrationId = 'cm4ean69r0003w8w1cdomox9n';

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Postiz plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.postiz.keys.issue_new_dek();
			await expect(corsair.postiz.api.integrations.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key as the raw Authorization header', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.postiz.keys.issue_new_dek();
			await corsair.postiz.keys.set_api_key('stored-key');
			respond([{ id: integrationId, identifier: 'x' }]);

			const result = await corsair.postiz.api.integrations.list({});

			expect(result.integrations).toHaveLength(1);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${POSTIZ_API_BASE}/integrations`);
			// No `Bearer` prefix: Postiz documents the bare key.
			expect(new Headers(init.headers).get('Authorization')).toBe('stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it("sends to the account's stored self-hosted base_url", async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.postiz.keys.issue_new_dek();
			await corsair.postiz.keys.set_api_key('stored-key');
			await corsair.postiz.keys.set_base_url('https://postiz.example.com');
			respond({ connected: true });

			await corsair.postiz.api.integrations.isConnected({});

			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://postiz.example.com/api/public/v1/is-connected');
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses a stored http base_url without sending the key', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.postiz.keys.issue_new_dek();
			await corsair.postiz.keys.set_api_key('stored-key');
			await corsair.postiz.keys.set_base_url('http://postiz.example.com');

			await expect(
				corsair.postiz.api.integrations.isConnected({}),
			).rejects.toThrow(/https/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('creates a scheduled post with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond([{ postId: 'p1', integration: integrationId }]);

			const result = await corsair.postiz.api.posts.create({
				type: 'schedule',
				date: '2024-12-14T10:00:00.000Z',
				shortLink: false,
				tags: [],
				posts: [
					{
						integration: { id: integrationId },
						value: [{ content: 'Hello from the Postiz API!' }],
						settings: { __type: 'x' },
					},
				],
			});

			expect(result.posts).toHaveLength(1);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`${POSTIZ_API_BASE}/posts`);
			expect(init.method).toBe('POST');
			expect(JSON.parse(String(init.body))).toMatchObject({
				type: 'schedule',
				shortLink: false,
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respond({ msg: 'Invalid API key' }, 401);

			const error = await captureError(
				corsair.postiz.api.integrations.list({}),
			);

			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 401 });
			expect((error as Error).message).toContain('Invalid API key');
			expect(fetchMock).toHaveBeenCalledTimes(1);
			// The key rode in a header, so no error may echo it.
			expect(JSON.stringify(error)).not.toContain('bad-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ message: 'Too Many Requests', statusCode: 429 }, 429, {
				'Retry-After': '1',
			});
			respond([{ id: integrationId }]);

			const pending = corsair.postiz.api.integrations.list({});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.integrations).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('does not replay a publish after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ message: 'Internal server error', statusCode: 500 }, 500);

			await expect(
				corsair.postiz.api.posts.create({
					type: 'now',
					date: '2024-12-14T10:00:00.000Z',
					shortLink: false,
					tags: [],
					posts: [
						{
							integration: { id: integrationId },
							value: [{ content: 'Hello' }],
						},
					],
				}),
			).rejects.toBeInstanceOf(ApiError);
			// One attempt only: the post may already have gone out.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 413, which a retry cannot shrink', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ message: 'Payload Too Large', statusCode: 413 }, 413);

			await expect(
				corsair.postiz.api.posts.create({
					type: 'now',
					date: '2024-12-14T10:00:00.000Z',
					shortLink: false,
					tags: [],
					posts: [
						{
							integration: { id: integrationId },
							value: [{ content: 'Hello' }],
						},
					],
				}),
			).rejects.toBeInstanceOf(ApiError);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
