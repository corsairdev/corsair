import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { zenrows } from './index';
import { captureError } from './test-fixtures';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zenrows', 'default');
	const corsair = createCorsair({
		plugins: [zenrows()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.zenrows.keys.issue_new_dek();
	await corsair.zenrows.keys.set_api_key('zr-test-key');
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary provider JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					status >= 400 ? 'application/problem+json' : 'application/json',
				...headers,
			},
		}),
	);
}

function rateLimited() {
	return {
		code: 'AUTH006',
		status: 429,
		title: 'Concurrency limit reached (AUTH006)',
		detail: 'Every concurrency slot on the plan is in use.',
	};
}

beforeEach(() => {
	// A spy with no queued response falls through to the real fetch, so every
	// call a test did not stub fails here instead of reaching the network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Zenrows retries through createCorsair', () => {
	it('retries a 429 and succeeds, sleeping the documented backoff', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited(), 429);
			respond({ crawls: [], next_cursor: null });

			const pending = corsair.zenrows.api.crawl.list({});
			// The first retry waits 1s (2^0), the second 2s.
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result.crawls).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('honours Retry-After instead of the fallback delay', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited(), 429, { 'retry-after': '4' });
			respond({ crawls: [], next_cursor: null });

			const pending = corsair.zenrows.api.crawl.list({});
			// Under 4s the request is still sleeping.
			await jest.advanceTimersByTimeAsync(3900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++) respond(rateLimited(), 429);

			const pending = captureError(corsair.zenrows.api.crawl.list({}));
			// maxRetries 3 means four attempts: 1s + 1s + 1s of linear work here
			// is really 1s, then the exponential fallback for the rest.
			await jest.advanceTimersByTimeAsync(20_000);
			const error = await pending;

			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toContain('AUTH006');
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('never replays a crawl start on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 'internal', status: 500, title: 'Internal' }, 500);

			const error = await captureError(
				corsair.zenrows.api.crawl.start({
					url: 'https://example.com',
					maxPages: 1,
				}),
			);

			expect(error).toBeInstanceOf(Error);
			// One attempt only: a replay could start a second billed crawl.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does retry a read on a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 'internal', status: 503, title: 'At capacity' }, 503);
			respond({ crawls: [], next_cursor: null });

			const pending = corsair.zenrows.api.crawl.list({});
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result.crawls).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('does not retry an account that is out of credits', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ code: 'AUTH004', status: 402, title: 'Usage exceeded (AUTH004)' },
				402,
			);

			const error = await captureError(corsair.zenrows.api.crawl.list({}));

			expect((error as Error).message).toContain('AUTH004');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
