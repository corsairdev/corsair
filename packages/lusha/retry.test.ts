import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { lusha } from './index';
import {
	accountUsageResponse,
	outOfCreditsBody,
	rateLimitedBody,
} from './test-fixtures';

/**
 * Core's request() retries a 429 three times; error-handlers.ts adds no
 * more. 402 is fatal, and a 5xx only replays on a free read, because a
 * search or enrich call may already have charged credits.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'lusha', 'default');
	const corsair = createCorsair({
		plugins: [lusha({ key: 'test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
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

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers can
 * step over the backoff instead of waiting for it.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	for (let step = 0; step < 10 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(5_000);
	}
	return tracked;
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

describe('retry behaviour through createCorsair', () => {
	it('retries a 429 and honours a Retry-After header', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimitedBody, 429, { 'Retry-After': '0' });
			respond(accountUsageResponse);

			await expect(
				corsair.lusha.api.account.getAccountUsage({}),
			).resolves.toMatchObject({
				credits: { remaining: 3800 },
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 with no Retry-After header using the backoff strategy', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ statusCode: 429, message: 'Too many requests' }, 429);
			respond(accountUsageResponse);

			const result = await withFakeTimers(
				corsair.lusha.api.account.getAccountUsage({}),
			);
			expect(result.credits?.remaining).toBe(3800);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('gives up after four 429s (one attempt plus three retries)', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++) {
				respond({ statusCode: 429, message: 'Too many requests' }, 429);
			}

			const error = await withFakeTimers(
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the fields it checks.
				corsair.lusha.api.account
					.getAccountUsage({})
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 429 });
			// One attempt plus the three the handler allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('never replays a metered enrich POST that answered 503', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ statusCode: 503 }, 503);

			await expect(
				corsair.lusha.api.person.enrichContacts({
					ids: ['4389064654'],
					reveal: ['emails'],
				}),
			).rejects.toThrow('Lusha 503');
			// No second attempt: the first may already have charged credits.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays the free job poll on a 503, which the docs say to retry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ statusCode: 503, message: 'Job store unavailable, please retry' },
				503,
			);
			respond({
				jobId: 'wf_1',
				status: 'processing',
				requestId: 'r',
				expiresAt: '2026-01-15T10:30:00Z',
				retryAfter: 5,
			});

			await expect(
				corsair.lusha.api.jobs.getContactsEnrichJob({ jobId: 'wf_1' }),
			).resolves.toMatchObject({ status: 'processing' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('treats 402 as fatal: one attempt, no retry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(outOfCreditsBody, 402);

			await expect(
				corsair.lusha.api.person.enrichContacts({
					ids: ['4389064654'],
					reveal: ['emails'],
				}),
			).rejects.toThrow('Insufficient credits');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
