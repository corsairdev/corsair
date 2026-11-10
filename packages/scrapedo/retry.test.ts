import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { scrapedo } from './index';
import { HTML_BODY, INACTIVE_TOKEN_BODY } from './test-fixtures';
import {
	fetchCallCount,
	installFetchMock,
	rejectNextFetch,
	respond,
	restoreFetchMock,
} from './test-helpers';

async function createClient(options: Parameters<typeof scrapedo>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'scrapedo', 'default');
	const corsair = createCorsair({
		plugins: [scrapedo(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

beforeEach(() => {
	installFetchMock();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	restoreFetchMock();
	jest.useRealTimers();
});

/** Core sleeps between retries with a plain setTimeout, so fake timers step it. */
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

const URL_ARG = { url: 'https://example.com/' };

describe('retry behaviour', () => {
	it('replays a read after a 502, which the docs say to retry', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sd-test-token' });
		try {
			respond({ Message: ['Request has failed. Please try again'] }, 502);
			respond(HTML_BODY);

			const result = await withFakeTimers(
				corsair.scrapedo.api.scrape.html(URL_ARG),
			);

			expect(result.status_code).toBe(200);
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sd-test-token' });
		try {
			respond({ Message: ['failed'] }, 502);
			respond({ Message: ['failed'] }, 502);
			respond({ Message: ['failed'] }, 502);

			const error = await withFakeTimers(
				corsair.scrapedo.api.scrape
					.html(URL_ARG)
					// unknown: a rejection can carry any value, and the assertion
					// narrows it to the status it checks.
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 502 });
			expect(fetchCallCount()).toBe(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401, which would get the IP throttled', async () => {
		const { corsair, testDb } = await createClient({ key: 'sd-test-token' });
		try {
			respond(INACTIVE_TOKEN_BODY, 401);

			await expect(
				corsair.scrapedo.api.scrape.html(URL_ARG),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchCallCount()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429, which the docs say is not charged', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sd-test-token' });
		try {
			respond({ Message: ['too many'] }, 429);
			respond(HTML_BODY);

			const result = await withFakeTimers(
				corsair.scrapedo.api.scrape.html(URL_ARG),
			);

			expect(result.html).toBe(HTML_BODY);
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a target 404, which returns the page and costs a credit', async () => {
		const { corsair, testDb } = await createClient({ key: 'sd-test-token' });
		try {
			respond('<html>not found</html>', 404);

			const result = await corsair.scrapedo.api.scrape.html(URL_ARG);

			// The page is the answer; replaying would spend another credit.
			expect(result.status_code).toBe(404);
			expect(fetchCallCount()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad input', async () => {
		const { corsair, testDb } = await createClient({ key: 'sd-test-token' });
		try {
			await expect(
				corsair.scrapedo.api.scrape.html({ url: 'ftp://example.com/' }),
			).rejects.toThrow(/scheme/);
			expect(fetchCallCount()).toBe(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a transport failure on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'sd-test-token' });
		try {
			rejectNextFetch(new TypeError('fetch failed'));
			respond(HTML_BODY);

			const result = await withFakeTimers(
				corsair.scrapedo.api.scrape.html(URL_ARG),
			);

			expect(result.html).toBe(HTML_BODY);
			expect(fetchCallCount()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});
});
