import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { persistiq } from './index';
import { lead } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only reads are replayed on 5xx,
 * because replies and campaign writes have no documented idempotency
 * contract.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'persistiq', 'default');
	const corsair = createCorsair({
		plugins: [persistiq({ key: 'pq-test-key' })],
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
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
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

describe('retries through createCorsair', () => {
	it("retries a 429 through the transport's rate-limit handling", async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 'error', error: { message: 'Slow down' } }, 429, {
				'Retry-After': '0',
			});
			respond({
				status: 'success',
				errors: [],
				has_more: false,
				next_page: null,
				leads: [lead],
			});

			await expect(corsair.persistiq.api.leads.list({})).resolves.toMatchObject(
				{ leads: [lead] },
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed read on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ status: 'error', error: { message: 'Something went wrong' } },
				503,
			);
			respond({
				status: 'success',
				errors: [],
				has_more: false,
				next_page: null,
				leads: [lead],
			});

			await expect(corsair.persistiq.api.leads.list({})).resolves.toMatchObject(
				{ leads: [lead] },
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the create write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ status: 'error', error: { message: 'Something went wrong' } },
				502,
			);

			await expect(
				corsair.persistiq.api.leads.create({
					lead: { email: 'john@example.com' },
				}),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad credential', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					status: 'error',
					error: { reason: 'unauthorized', message: 'Failed to find api key' },
				},
				401,
			);

			await expect(corsair.persistiq.api.leads.list({})).rejects.toMatchObject({
				status: 401,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
