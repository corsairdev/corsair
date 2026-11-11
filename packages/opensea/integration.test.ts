import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { opensea } from './index';
import { chainsFixture, searchFixture } from './test-fixtures';

async function createClient(options: Parameters<typeof opensea>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'opensea', 'default');
	const corsair = createCorsair({
		plugins: [opensea(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(
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

describe('opensea through createCorsair', () => {
	/**
	 * The test that proves the runtime, not a fixture, resolves the key: it
	 * passes no explicit `key`, so `core/endpoints/bind.ts` has to read the
	 * account's stored api_key. A fixture-based test would happily supply a
	 * method the runtime never installs.
	 */
	it('reads the stored key with no explicit key given', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.opensea.keys.issue_new_dek();
			await corsair.opensea.keys.set_api_key('stored-opensea-key');
			respond(chainsFixture);

			const result = await corsair.opensea.api.chains.list({});

			expect(fetchMock).toHaveBeenCalled();
			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('x-api-key')).toBe(
				'stored-opensea-key',
			);
			expect(result.chains).toHaveLength(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails fast with AuthMissingError when no key is stored', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.opensea.keys.issue_new_dek();

			await expect(corsair.opensea.api.chains.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers an inline key over the stored one', async () => {
		const { corsair, testDb } = await createClient({
			key: 'inline-opensea-key',
		});
		try {
			await corsair.opensea.keys.issue_new_dek();
			await corsair.opensea.keys.set_api_key('stored-opensea-key');
			respond(chainsFixture);

			await corsair.opensea.api.chains.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('x-api-key')).toBe(
				'inline-opensea-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 through the plugin error handlers', async () => {
		const { corsair, testDb } = await createClient({
			key: 'inline-opensea-key',
		});
		try {
			await corsair.opensea.keys.issue_new_dek();
			respond({ errors: ['Too many requests'] }, 429, { 'Retry-After': '1' });
			respond(chainsFixture, 200);

			const result = await corsair.opensea.api.chains.list({});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.chains).toHaveLength(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after its retry budget', async () => {
		const { corsair, testDb } = await createClient({
			key: 'inline-opensea-key',
		});
		try {
			await corsair.opensea.keys.issue_new_dek();
			for (let attempt = 0; attempt < 6; attempt += 1) {
				respond({ errors: ['Too many requests'] }, 429, { 'Retry-After': '0' });
			}

			await expect(corsair.opensea.api.chains.list({})).rejects.toThrow();
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient({
			key: 'inline-opensea-key',
		});
		try {
			await corsair.opensea.keys.issue_new_dek();
			respond({ errors: ['upstream'] }, 502);
			respond(chainsFixture, 200);

			const result = await corsair.opensea.api.chains.list({});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.chains).toHaveLength(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read that failed at the transport', async () => {
		const { corsair, testDb } = await createClient({
			key: 'inline-opensea-key',
		});
		try {
			await corsair.opensea.keys.issue_new_dek();
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(chainsFixture, 200);

			const result = await corsair.opensea.api.chains.list({});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.chains).toHaveLength(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('surfaces an invalid key as an auth error without retrying', async () => {
		const { corsair, testDb } = await createClient({
			key: 'inline-opensea-key',
		});
		try {
			await corsair.opensea.keys.issue_new_dek();
			respond({ errors: ['Invalid API key'] }, 401);

			await expect(corsair.opensea.api.chains.list({})).rejects.toThrow(
				/Invalid API key/,
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('exposes a search that succeeds', async () => {
		const { corsair, testDb } = await createClient({
			key: 'inline-opensea-key',
		});
		try {
			await corsair.opensea.keys.issue_new_dek();
			respond(searchFixture);

			const result = await corsair.opensea.api.search.search({ query: 'ape' });

			expect(result.results).toHaveLength(2);
		} finally {
			testDb.cleanup();
		}
	});
});
