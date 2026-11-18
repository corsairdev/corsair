import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { knack } from './index';
import {
	invalidApiKey,
	rateLimited,
	record,
	recordList,
} from './test-fixtures';

const CREDENTIALS = {
	applicationId: '6af358626e7887956647723f',
	apiKey: 'b81e8bc4-4519-4257-82fc-b0508a6728a2',
};

/**
 * Writes the pair onto the account, so the key builder resolves it the way a
 * connected tenant would. No inline `key` is passed: an inline key would skip
 * the credential lookup this file exists to prove.
 *
 * The account's `api_key` field holds the application id and its `api_secret`
 * field holds the API key.
 */
async function createClient(credentials = CREDENTIALS) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'knack', 'default');
	const corsair = createCorsair({
		plugins: [knack()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.knack.keys.issue_new_dek();
	await corsair.knack.keys.set_api_key(credentials.applicationId);
	await corsair.knack.keys.set_api_secret(credentials.apiKey);
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: each fixture is a plain object of arbitrary shape, and the output
// schema under test is what validates it.
function respondJson(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	const isText = typeof body === 'string';
	fetchMock.mockResolvedValueOnce(
		new Response(isText ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': isText ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

function calls(): number {
	return fetchMock.mock.calls.length;
}

beforeEach(() => {
	// A call no test queued a response for must fail here, never reach the
	// network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch: queue a response for every request');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

describe('stored credentials', () => {
	// No inline key here, so this only passes if the key builder reads both
	// declared fields and packs them the way the client expects.
	it('sends both Knack headers read from the account', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(recordList);

			await corsair.knack.api.records.list({ object_key: 'object_3' });

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(String(url)).toContain('/objects/object_3/records');
			expect(headers.get('x-knack-application-id')).toBe(
				CREDENTIALS.applicationId,
			);
			expect(headers.get('x-knack-rest-api-key')).toBe(CREDENTIALS.apiKey);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails before any request when the API key is missing', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'knack', 'default');
		const corsair = createCorsair({
			plugins: [knack()],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await corsair.knack.keys.issue_new_dek();
		await corsair.knack.keys.set_api_key(CREDENTIALS.applicationId);
		try {
			await expect(
				corsair.knack.api.records.list({ object_key: 'object_3' }),
			).rejects.toThrow(/auth-missing:knack:api_key/);
			expect(calls()).toBe(0);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('retry behaviour', () => {
	// Knack documents a one-second window for the rate limit, so the fallback
	// delay is a second.
	it('retries a 429 and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson(rateLimited, 429);
			respondJson(recordList);

			const pending = corsair.knack.api.records.list({
				object_key: 'object_3',
			});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(1_100);
			const result = await pending;

			expect(result.records).toHaveLength(1);
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits a second when no reset header is sent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson(rateLimited, 429);
			respondJson(recordList);

			const pending = corsair.knack.api.records.list({
				object_key: 'object_3',
			});
			await Promise.resolve();
			await Promise.resolve();
			// Under the second nothing has retried yet.
			await jest.advanceTimersByTimeAsync(500);
			expect(calls()).toBe(1);

			await jest.advanceTimersByTimeAsync(700);
			await pending;
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson(rateLimited, 429);
			respondJson(rateLimited, 429);
			respondJson(rateLimited, 429);

			const pending = corsair.knack.api.records
				.list({ object_key: 'object_3' })
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the field it checks.
				.catch((caught: unknown) => caught);
			for (let step = 0; step < 4; step++) {
				await Promise.resolve();
				await jest.advanceTimersByTimeAsync(1_100);
			}
			const error = await pending;

			expect(error).toMatchObject({ status: 429 });
			expect(calls()).toBe(3);
		} finally {
			testDb.cleanup();
		}
	});

	// A reset far in the future is the daily plan allowance, which no retry
	// inside this call can restore.
	it('never retries when the reset is an hour away', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(rateLimited, 429, {
				'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3_600),
			});

			await expect(
				corsair.knack.api.records.list({ object_key: 'object_3' }),
			).rejects.toMatchObject({ status: 429 });
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson('Server error', 500);
			respondJson(recordList);

			const pending = corsair.knack.api.records.list({
				object_key: 'object_3',
			});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(1_100);
			const result = await pending;

			expect(result.records).toHaveLength(1);
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	// A record may already have been written when a 5xx came back, and Knack
	// documents no idempotency key, so a replay could duplicate it.
	it('never replays a record write', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson('Server error', 500);

			await expect(
				corsair.knack.api.records.create({
					object_key: 'object_3',
					fields: { field_23: 'Acme' },
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(invalidApiKey, 401);

			await expect(
				corsair.knack.api.records.list({ object_key: 'object_3' }),
			).rejects.toMatchObject({ status: 401 });
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	// An id that does not exist answers 200 with an empty list, and the endpoint
	// raises rather than returning a record with no fields.
	it('raises when a missing record answers an empty list', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson({
				total_pages: 0,
				current_page: 1,
				total_records: 0,
				records: [],
				recast: true,
			});

			await expect(
				corsair.knack.api.records.get({
					object_key: 'object_3',
					record_id: record.id,
				}),
			).rejects.toThrow(/empty list rather than a 404/);
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});
});
