import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { eventzilla } from './index';
import { eventListFixture, salesToggledFixture } from './test-fixtures';

async function createClient(options: Parameters<typeof eventzilla>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'eventzilla', 'default');
	const corsair = createCorsair({
		plugins: [eventzilla(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(
	// unknown: same reason; the caller picks the body.
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockImplementationOnce(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json', ...headers },
			}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('eventzilla through createCorsair', () => {
	/**
	 * The one test that proves the runtime, not a fixture, resolves the key: it
	 * passes no explicit `key`, so `core/endpoints/bind.ts` has to read the
	 * account's stored api_key. A fixture-based test would happily supply a
	 * method the runtime never installs.
	 */
	it('reads the stored key with no explicit key given', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			await corsair.eventzilla.keys.set_api_key('stored-ez-key');
			respond(eventListFixture);

			const result = await corsair.eventzilla.api.events.list({});

			expect(fetchMock).toHaveBeenCalled();
			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('x-api-key')).toBe('stored-ez-key');
			expect(result.events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails fast with AuthMissingError when no key is stored', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.eventzilla.keys.issue_new_dek();

			await expect(corsair.eventzilla.api.events.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers an inline key over the stored one', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			await corsair.eventzilla.keys.set_api_key('stored-ez-key');
			respond(eventListFixture);

			await corsair.eventzilla.api.events.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('x-api-key')).toBe('inline-ez-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 through the plugin error handlers', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			respond({ message: 'slow down' }, 429, { 'Retry-After': '1' });
			respond(eventListFixture, 200);

			const result = await corsair.eventzilla.api.events.list({});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after its retry budget', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			for (let attempt = 0; attempt < 6; attempt += 1) {
				respond({ message: 'slow down' }, 429, { 'Retry-After': '0' });
			}

			await expect(corsair.eventzilla.api.events.list({})).rejects.toThrow();
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	/**
	 * A 5xx on a write is not replayed: the request may have landed, and
	 * Eventzilla's writes are not documented as idempotent.
	 */
	it('does not replay a 5xx on a write', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			respond({ message: 'gateway blew up' }, 502);

			await expect(
				corsair.eventzilla.api.sales.toggle({ eventid: 1, status: true }),
			).rejects.toThrow();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			respond({ message: 'gateway blew up' }, 502);
			respond(eventListFixture, 200);

			const result = await corsair.eventzilla.api.events.list({});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('surfaces the 200-with-an-error body as an auth failure', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			respond({ message: 'API Key is not authorized' }, 200);

			await expect(corsair.eventzilla.api.categories.list({})).rejects.toThrow(
				/answered HTTP 200 with an error/,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write that failed at the transport', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.eventzilla.api.sales.toggle({ eventid: 1, status: true }),
			).rejects.toThrow();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read that failed at the transport', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(eventListFixture, 200);

			const result = await corsair.eventzilla.api.events.list({});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('exposes a write that succeeds', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-ez-key' });
		try {
			await corsair.eventzilla.keys.issue_new_dek();
			respond(salesToggledFixture);

			const result = await corsair.eventzilla.api.sales.toggle({
				eventid: 2138988852,
				status: true,
			});

			expect(result.eventstatus).toBe('published');
		} finally {
			testDb.cleanup();
		}
	});
});
