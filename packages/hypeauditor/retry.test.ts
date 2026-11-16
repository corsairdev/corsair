import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { JsonValue } from './client';
import { hypeauditor } from './index';

/** The account setters the test writes through, which core generates from the account fields. */
type HypeAuditorTestKeys = {
	issue_new_dek: () => Promise<void>;
	set_client_id: (value: string) => Promise<void>;
	set_access_token: (value: string) => Promise<void>;
};

/**
 * Only the bound client retries, using this plugin's error handlers, so this
 * file goes through `createCorsair` to exercise that layer. It is not named
 * `integration.test.ts`, because CI skips that name.
 *
 * The point of most of these tests is the replay rule: a report read and a
 * discovery page each spend a credit on the first request, so neither may be
 * repeated after a failure that could have been charged.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'hypeauditor', 'default');
	const corsair = createCorsair({
		plugins: [hypeauditor()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	// The pair is written onto the account, so the key builder and the
	// credential resolver read it the way a connected tenant would. No inline
	// pair is passed, because that would skip the lookup this file proves.
	// The generated field setters are not on the manager's declared type, which
	// only knows the authType's own accessors.
	// unknown: core does generate these three at runtime; the generic manager
	// type just cannot name them, so the cast is how the test reaches them.
	const keys = corsair.hypeauditor.keys as unknown as HypeAuditorTestKeys;
	await keys.issue_new_dek();
	await keys.set_client_id('client-123');
	await keys.set_access_token('token-secret');
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(body: JsonValue, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

const report = {
	result: {
		report_state: 'READY',
		user: { id: '1', username: 'nasa' },
		restTokens: 10,
	},
};
const lists = { result: [{ id: 0, name: 'Recent searches' }] };

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	// A report read spends a credit at the moment of the request, so a 5xx that
	// might have been charged must not be replayed.
	it('does not replay a 5xx on a report read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 1, description: 'Internal Server Error' } },
				500,
			);

			await expect(
				corsair.hypeauditor.api.reports.youtube({ channel: 'NASA' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	// The same 5xx on a free read is worth one more attempt.
	it('retries a 5xx on a free read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 1, description: 'Internal Server Error' } },
				500,
			);
			respond({ result: { items: [] } });

			const result = await corsair.hypeauditor.api.media.youtube({
				channel: 'NASA',
			});

			expect(result.result).toBeDefined();
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a dropped connection on a report read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.hypeauditor.api.reports.instagram({ username: 'nasa' }),
			).rejects.toBeDefined();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a dropped connection on a free read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(lists);

			const result = await corsair.hypeauditor.api.lists.list({});

			expect(result.result).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a discovery page, which is charged per page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 1, description: 'Internal Server Error' } },
				500,
			);

			await expect(
				corsair.hypeauditor.api.discovery.search({
					social_network: 'instagram',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	// A 429 means the request was refused before it ran, so no credit was spent
	// and repeating it is safe even for a charged read.
	it('retries a 429 on a report read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: { code: 1, description: 'Too many requests' } }, 429);
			respond(report);

			const result = await corsair.hypeauditor.api.reports.youtube({
				channel: 'NASA',
			});

			expect(result.result.report_state).toBe('READY');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	// 402 is an exhausted balance or an expired subscription, which retrying
	// cannot fix.
	it('does not retry a 402', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: { code: 5, description: 'Payment required' } }, 402);

			await expect(
				corsair.hypeauditor.api.lists.list({}),
			).rejects.toMatchObject({ status: 402 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a wrong token', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: { code: 4, description: 'Invalid token' } }, 403);

			await expect(
				corsair.hypeauditor.api.lists.list({}),
			).rejects.toMatchObject({ code: 4 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a refused input, because no request is sent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(
				corsair.hypeauditor.api.discovery.search({
					social_network: 'instagram',
					page: 501,
				}),
			).rejects.toBeDefined();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
