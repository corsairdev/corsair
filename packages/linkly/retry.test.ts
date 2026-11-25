import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { linkly } from './index';
import { link } from './test-fixtures';

/**
 * `requests.test.ts` calls the endpoints directly, and the HTTP client is
 * built with `maxRetries: 0`, so only `error-handlers.ts` decides what is
 * retried. This file goes through `createCorsair` to prove that layer
 * actually runs: it is the only place a 429 or a 5xx can be retried at all.
 *
 * Reads, the /link upsert, the trash delete and restore are replay-safe;
 * links.create and webhooks.subscribe are not, and a repeat of either could
 * make a second link or a double registration.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'linkly', 'default');
	const corsair = createCorsair({
		plugins: [linkly({ key: 'linkly-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// Response bodies are arbitrary JSON, stated per test.
function respond<B>(body: B, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('rate-limit retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The gateway form: a bare 429 with no Linkly body. Linkly itself
			// sends no rate-limit headers, so the delay is the backoff fallback.
			respond('', 429);
			respond(link);

			const result = await corsair.linkly.api.links.get({ id: 41657524 });

			expect(result.id).toBe(41657524);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 whose body names rate_limit_exceeded', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: 'Rate limit exceeded',
					code: 'rate_limit_exceeded',
					current_usage: 21,
					limit: 20,
					message: 'Link API limit is 20 requests per second.',
				},
				429,
			);
			respond(linkListBody());

			const result = await corsair.linkly.api.links.list({
				workspace_id: 42,
				page_size: 5,
			});

			expect(result.total_entries).toBe(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 3 retries, so 4 attempts in total.
			for (let i = 0; i < 4; i += 1) {
				respond('', 429);
			}

			await expect(
				corsair.linkly.api.links.get({ id: 41657524 }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('retries a 429 on the upsert write, which is an update in place', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond('', 429);
			respond(link);

			const result = await corsair.linkly.api.links.update({
				id: 41657524,
				workspace_id: 42,
				name: 'Renamed',
			});

			expect(result.id).toBe(41657524);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the first backoff step when no Retry-After header exists', async () => {
		// Linkly sends no rate-limit headers, so this pins the delay callers
		// actually get: exponential backoff starting at one second.
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond('', 429);
			respond(link);

			const promise = corsair.linkly.api.links.get({ id: 41657524 });

			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(10);
			await expect(promise).resolves.toMatchObject({ id: 41657524 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});

describe('5xx replay safety through createCorsair', () => {
	it('does not replay links.create on a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Boom', code: 'internal_error' }, 500);

			await expect(
				corsair.linkly.api.links.create({
					workspace_id: 42,
					url: 'https://www.example.com',
				}),
			).rejects.toMatchObject({ status: 500 });
			// Exactly one attempt: a repeat could create a second link.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays the trash delete on a 500, where a repeat is a no-op', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Boom', code: 'internal_error' }, 500);
			respond('Link deleted.');

			const result = await corsair.linkly.api.links.delete({
				workspace_id: 42,
				id: 30,
			});

			expect(result).toBe('Link deleted.');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay webhooks.subscribe on a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Boom', code: 'internal_error' }, 500);

			await expect(
				corsair.linkly.api.webhooks.subscribe({
					workspace_id: 42,
					url: 'https://hooks.example.com/linkly',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a dropped connection on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond([{ id: 42, name: 'Marketing' }]);

			const result = await corsair.linkly.api.workspaces.listWorkspaces({});

			expect(result).toEqual([{ id: 42, name: 'Marketing' }]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});

function linkListBody() {
	return {
		links: [workspaceLinkBody()],
		page_number: 1,
		page_size: 5,
		total_entries: 1,
		total_pages: 1,
		total_rows: 1,
		workspace_link_count: 1,
	};
}

function workspaceLinkBody() {
	return {
		id: 30,
		url: 'https://www.example.com',
		full_url: 'https://go.yourcompany.com/promo',
		workspace_id: 42,
		name: 'Summer promo',
		slug: '/promo',
		enabled: true,
		clicks_total: 0,
		clicks_today: 0,
		clicks_thirty_days: 0,
		human_clicks_total: 0,
		human_clicks_today: 0,
		human_clicks_thirty_days: 0,
		human_clicks_previous_day: 0,
		sparkline: [0, 0],
	};
}
