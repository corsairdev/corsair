import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { scrapingant } from './index';
import {
	BOT_DETECTED_BODY,
	HTML_BODY,
	MISSING_TOKEN_BODY,
	QUOTA_BODY,
} from './test-fixtures';
import {
	fetchCallCount,
	installFetchMock,
	respond,
	restoreFetchMock,
	sentHeaders,
} from './test-helpers';

async function createClient(options: Parameters<typeof scrapingant>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'scrapingant', 'default');
	const corsair = createCorsair({
		plugins: [scrapingant(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and
	// spend real credits, so every call a test did not stub fails instead.
	installFetchMock();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	restoreFetchMock();
	jest.useRealTimers();
});

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers step over
 * the handler's delay instead of waiting for it.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	for (let step = 0; step < 12 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(10_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a detected browser and returns the next answer', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sa-test-key' });
		try {
			respond(BOT_DETECTED_BODY, 423);
			respond(HTML_BODY, 200, { 'Ant-credits-cost': '1' });

			const result = await withFakeTimers(
				corsair.scrapingant.api.scrape.html({ url: 'https://example.com/' }),
			);

			expect(result).toMatchObject({ html: HTML_BODY, credits_cost: 1 });
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up on a detected browser after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sa-test-key' });
		try {
			respond(BOT_DETECTED_BODY, 423);
			respond(BOT_DETECTED_BODY, 423);

			const error = await withFakeTimers(
				corsair.scrapingant.api.scrape
					.extended({ url: 'https://example.com/' })
					// unknown: a rejection can carry any value, and the assertion
					// below narrows it to the status it checks.
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 423 });
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an exhausted balance, which no wait can fix', async () => {
		const { corsair, testDb } = await createClient({ key: 'sa-test-key' });
		try {
			respond(QUOTA_BODY, 403);

			await expect(
				corsair.scrapingant.api.extract.data({
					url: 'https://example.com/',
					extract_properties: 'title',
				}),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchCallCount()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a wrong key', async () => {
		const { corsair, testDb } = await createClient({ key: 'sa-bad-key' });
		try {
			respond(
				{
					detail:
						'API token is wrong. Please visit https://app.scrapingant.com/profile to check your token settings',
				},
				403,
			);

			await expect(
				corsair.scrapingant.api.account.usage({}),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchCallCount()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry the missing-token 422', async () => {
		const { corsair, testDb } = await createClient({ key: 'sa-test-key' });
		try {
			respond(MISSING_TOKEN_BODY, 422);

			await expect(
				corsair.scrapingant.api.account.usage({}),
			).rejects.toMatchObject({ status: 422 });
			expect(fetchCallCount()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 500, which the docs say to try again', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sa-test-key' });
		try {
			respond({ detail: 'Internal server error' }, 500);
			respond(HTML_BODY, 200);

			const result = await withFakeTimers(
				corsair.scrapingant.api.scrape
					.markdown({ url: 'https://example.com/' })
					.then(() => 'resolved')
					.catch(() => 'rejected'),
			);

			// The second answer is HTML, which is not the JSON markdown answers
			// with, so the call fails on parsing: what matters is the retry ran.
			expect(result).toBe('rejected');
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a request whose shape failed validation', async () => {
		const { corsair, testDb } = await createClient({ key: 'sa-test-key' });
		try {
			await expect(
				corsair.scrapingant.api.scrape.html({
					url: 'ftp://example.com/',
				}),
			).rejects.toThrow(/scheme/);
			expect(fetchCallCount()).toBe(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('uses an inline key without reading the stored one', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond(HTML_BODY);

			await corsair.scrapingant.api.scrape.html({
				url: 'https://example.com/',
			});

			expect(sentHeaders().get('x-api-key')).toBe('inline-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a gateway 429 and honors its Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sa-test-key' });
		try {
			// A gateway in front of ScrapingAnt can throttle a burst even though
			// the API itself documents no throughput limit.
			respond({ detail: 'Too Many Requests' }, 429, { 'Retry-After': '2' });
			respond(HTML_BODY, 200, {
				'Ant-credits-cost': '1',
				'Ant-page-status-code': '200',
			});

			const pending = corsair.scrapingant.api.scrape.html({
				url: 'https://example.com/',
			});
			await Promise.resolve();
			await Promise.resolve();
			// Under the requested wait it has not retried yet.
			await jest.advanceTimersByTimeAsync(1_000);
			expect(fetchCallCount()).toBe(1);

			await jest.advanceTimersByTimeAsync(1_500);
			const result = await pending;
			expect(result.page_status).toBe(200);
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});
});
