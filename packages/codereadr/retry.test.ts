import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { codereadr } from './index';
import {
	API_KEY_ERROR_XML,
	DAILY_LIMIT_ERROR_XML,
	LIMITS_XML,
	RATE_LIMIT_ERROR_XML,
	SCANS_XML,
} from './test-fixtures';

async function createClient(options: Parameters<typeof codereadr>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'codereadr', 'default');
	const corsair = createCorsair({
		plugins: [codereadr(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

function respondXml(body: string, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, {
			status,
			headers: { 'Content-Type': 'text/xml; charset=utf-8' },
		}),
	);
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and
	// send a live request, so every call a test did not stub fails instead.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response with respondXml first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers can step
 * over the documented minute instead of waiting for it.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	// Let the request and the retry scheduling run, then step the clock.
	for (let step = 0; step < 10 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(61_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries the per-minute limit and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(RATE_LIMIT_ERROR_XML);
			respondXml(LIMITS_XML);

			const result = await withFakeTimers(
				corsair.codereadr.api.limits.retrieve({}),
			);

			expect(result.day).toEqual({ left: 9000, limit: 21600 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited write, which the provider dropped unprocessed', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(RATE_LIMIT_ERROR_XML);
			respondXml('<xml><status>1</status></xml>');

			await withFakeTimers(
				corsair.codereadr.api.scans.delete({ scan_id: [13193] }),
			);

			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(RATE_LIMIT_ERROR_XML);
			respondXml(RATE_LIMIT_ERROR_XML);
			respondXml(RATE_LIMIT_ERROR_XML);

			const error = await withFakeTimers(
				corsair.codereadr.api.limits
					.retrieve({})
					// unknown: a rejection can be any value; the assertion below
					// narrows it to the fields it checks.
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ code: 111 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry the per-day limit, which only clears at midnight', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(DAILY_LIMIT_ERROR_XML);

			await expect(
				corsair.codereadr.api.limits.retrieve({}),
			).rejects.toMatchObject({ code: 113, isRateLimit: true });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml('<html>server error</html>', 500);

			await expect(
				corsair.codereadr.api.scans.delete({ scan_id: [13193] }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a create after a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml('<html>server error</html>', 503);

			await expect(
				corsair.codereadr.api.services.create({ validation_method: 'record' }),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml('<html>server error</html>', 500);
			respondXml(SCANS_XML);

			const result = await withFakeTimers(corsair.codereadr.api.scans.list({}));

			expect(result.scans).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an auth failure', async () => {
		const { corsair, testDb } = await createClient({ key: 'codereadr-bad' });
		try {
			respondXml(API_KEY_ERROR_XML);

			await expect(
				corsair.codereadr.api.limits.retrieve({}),
			).rejects.toMatchObject({ code: 101 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries an HTTP 429 and honors its Retry-After delay', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			// A gateway in front of the API answers 429 with a short wait. The
			// handler must use that instead of its one minute fallback.
			fetchMock.mockResolvedValueOnce(
				new Response('', {
					status: 429,
					headers: { 'Retry-After': '2' },
				}),
			);
			respondXml(LIMITS_XML);

			const pending = corsair.codereadr.api.limits.retrieve({});
			await Promise.resolve();
			await Promise.resolve();
			// Under the requested wait it has not retried yet.
			await jest.advanceTimersByTimeAsync(1_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_500);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('pins the no-header delay at the documented minute', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(RATE_LIMIT_ERROR_XML);
			respondXml(LIMITS_XML);

			const pending = corsair.codereadr.api.limits.retrieve({});
			// Flush the first request, then step just under the minute.
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(59_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(2_000);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
