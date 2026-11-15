import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { klazify } from './index';
import {
	categorize,
	planRequired,
	traffic,
	unauthorized,
} from './test-fixtures';

const API_KEY = 'klazify-stored-token';

/**
 * Writes the token onto the account, so the key builder resolves it the way a
 * connected tenant would. No inline `key` is passed: an inline key would skip
 * the credential lookup this file exists to prove.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'klazify', 'default');
	const corsair = createCorsair({
		plugins: [klazify()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.klazify.keys.issue_new_dek();
	await corsair.klazify.keys.set_api_key(API_KEY);
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
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
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

describe('stored credential', () => {
	// No inline key here, so this only passes if the key builder reads the
	// account's api_key field and the client sends it as a Bearer token.
	it('sends the stored token as Bearer', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(categorize);

			await corsair.klazify.api.categorize.all({ url: 'https://cbsnews.com' });

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(String(url)).toContain('/api/categorize');
			expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails before any request when no key is stored', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'klazify', 'default');
		const corsair = createCorsair({
			plugins: [klazify()],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await corsair.klazify.keys.issue_new_dek();
		try {
			await expect(
				corsair.klazify.api.traffic.get({ url: 'https://cbsnews.com' }),
			).rejects.toThrow(/auth-missing:klazify:api_key/);
			expect(calls()).toBe(0);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('retry behaviour', () => {
	it('retries a 429 with backoff', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ success: false, error: 'Too Many Requests' }, 429);
			respondJson(traffic);

			const pending = corsair.klazify.api.traffic.get({
				url: 'https://cbsnews.com',
			});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(1_100);
			const result = await pending;

			expect(result.traffic_intelligence?.global_rank).toBe(765);
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ success: false, error: 'Too Many Requests' }, 429);
			respondJson({ success: false, error: 'Too Many Requests' }, 429);
			respondJson({ success: false, error: 'Too Many Requests' }, 429);

			const pending = corsair.klazify.api.traffic
				.get({ url: 'https://cbsnews.com' })
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

	it('retries a 5xx twice', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ success: false }, 500);
			respondJson(traffic);

			const pending = corsair.klazify.api.traffic.get({
				url: 'https://cbsnews.com',
			});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(1_100);
			await pending;

			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	// No retry policy can fix a plan that has no API access, so it must fail on
	// the first attempt.
	it('never retries the plan restriction', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(planRequired, 401);

			await expect(
				corsair.klazify.api.categorize.all({ url: 'https://cbsnews.com' }),
			).rejects.toMatchObject({ status: 401 });
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(unauthorized, 401);

			await expect(
				corsair.klazify.api.categorize.all({ url: 'https://cbsnews.com' }),
			).rejects.toMatchObject({ status: 401 });
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	// A rejected target is the caller's mistake, so the same request would fail
	// again and the error is worth surfacing immediately.
	it('does not retry a rejected body', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ success: false, error: 'Bad Request' }, 400);

			await expect(
				corsair.klazify.api.discovery.search({ q: 'acme' }),
			).rejects.toMatchObject({ status: 400 });
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});
});
