import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { fluxguard } from './index';
import { addPageResponse, pageResponse } from './test-fixtures';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
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

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'fluxguard', 'default');
	const corsair = createCorsair({
		plugins: [fluxguard({ key: 'fg-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

beforeEach(() => {
	// A call with no queued response must fail here, not reach the network.
	fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('unmocked fetch'));
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Fluxguard retries through the bound client', () => {
	it('retries a rate-limited read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too Many Requests' }, 429, { 'Retry-After': '1' });
			respond(pageResponse);

			const result = await corsair.fluxguard.api.monitoring.getPage({
				siteId: 's1',
				sessionId: 'se1',
				pageId: 'p1',
			});

			expect(result.id).toBe(pageResponse.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and throws the last 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++) {
				respond({ message: 'Too Many Requests' }, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.fluxguard.api.monitoring.getPage({
					siteId: 's1',
					sessionId: 'se1',
					pageId: 'p1',
				}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Internal Server Error' }, 503);
			respond(pageResponse);

			const result = await corsair.fluxguard.api.monitoring.getPage({
				siteId: 's1',
				sessionId: 'se1',
				pageId: 'p1',
			});

			expect(result.id).toBe(pageResponse.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx write, which may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Internal Server Error' }, 503);

			await expect(
				corsair.fluxguard.api.monitoring.addPage({
					url: 'https://example.org/',
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx delete', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Internal Server Error' }, 500);

			await expect(
				corsair.fluxguard.api.monitoring.deleteSite({ siteId: 's1' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('never retries a 403, which means a bad key or a missing route', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Forbidden' }, 403);

			await expect(corsair.fluxguard.api.account.get({})).rejects.toMatchObject(
				{ status: 403 },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns the add-page identifiers on a 200', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(addPageResponse);

			const result = await corsair.fluxguard.api.monitoring.addPage({
				url: 'https://example.org/',
			});

			expect(result.pageId).toBe(addPageResponse.pageId);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Fluxguard no-header retry delay', () => {
	it('waits the configured fallback when Fluxguard sends no Retry-After', async () => {
		const { corsair, testDb } = await createClient();
		try {
			jest.useFakeTimers();
			respond({ message: 'Too Many Requests' }, 429);
			respond(pageResponse);

			const pending = corsair.fluxguard.api.monitoring.getPage({
				siteId: 's1',
				sessionId: 'se1',
				pageId: 'p1',
			});
			// The first attempt failed; the retry sleeps on the backoff strategy
			// (1s for the first attempt of exponential_backoff).
			await jest.advanceTimersByTimeAsync(1_000);
			const result = await pending;

			expect(result.id).toBe(pageResponse.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});
