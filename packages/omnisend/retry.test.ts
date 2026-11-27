import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { omnisend } from './index';
import { contactsListResponse, rateLimited } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'omnisend', 'default');
	const corsair = createCorsair({
		plugins: [omnisend({ key: 'omnisend_test_key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

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

beforeEach(() => {
	// An unmocked call throws instead of reaching api.omnisend.com.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
	jest.useFakeTimers();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('retry behavior through createCorsair', () => {
	it('waits out the body retryAfter before the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// Omnisend sends the delay in the problem body, not a header.
			respond(rateLimited, 429);
			respond(contactsListResponse);

			const pending = corsair.omnisend.api.contacts.list({});
			await jest.advanceTimersByTimeAsync(5 * 1000 - 1);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toMatchObject({
				contacts: expect.any(Array),
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the per-minute fallback when the body names no delay', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					type: 'https://problems.omnisend.com/rate-limit-exceeded',
					title: 'Rate limit exceeded',
					status: 429,
				},
				429,
			);
			respond(contactsListResponse);

			const pending = corsair.omnisend.api.contacts.list({});
			await jest.advanceTimersByTimeAsync(60_000 - 1);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toMatchObject({
				contacts: expect.any(Array),
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three rate-limited retries', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(rateLimited, 429);
			}

			const pending = corsair.omnisend.api.contacts.list({});
			const rejection = expect(pending).rejects.toMatchObject({
				status: 429,
			});
			await jest.advanceTimersByTimeAsync(60_000 * 3 + 1_000);

			await rejection;
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on a create', async () => {
		// A POST creates something: a replayed batches.create would queue a
		// second batch, and a replayed events.send would duplicate an event.
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ type: 'https://problems.omnisend.com/server-error', status: 500 },
				500,
			);

			const rejection = expect(
				corsair.omnisend.api.batches.create({
					endpoint: 'contacts',
					method: 'POST',
					items: [{ identifiers: [{ id: 'a@b.co', type: 'email' }] }],
				}),
			).rejects.toMatchObject({ status: 500 });
			await jest.advanceTimersByTimeAsync(30_000);

			await rejection;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 500 }, 500);
			respond(contactsListResponse);

			const pending = corsair.omnisend.api.contacts.list({});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toMatchObject({
				contacts: expect.any(Array),
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a dropped create', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			const rejection = expect(
				corsair.omnisend.api.contacts.upsert({
					identifiers: [{ id: 'a@b.co', type: 'email' }],
				}),
			).rejects.toMatchObject({ method: 'POST' });
			await jest.advanceTimersByTimeAsync(30_000);

			await rejection;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					type: 'https://problems.omnisend.com/validation-failed',
					title: 'Validation failed',
					status: 400,
				},
				400,
			);

			const rejection = expect(
				corsair.omnisend.api.contacts.list({}),
			).rejects.toMatchObject({ status: 400 });
			await jest.advanceTimersByTimeAsync(30_000);

			await rejection;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
