import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { persona } from './index';
import { inquiry } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only reads are replayed on 5xx,
 * because decisions and redactions are final.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'persona', 'default');
	const corsair = createCorsair({
		plugins: [persona({ key: 'persona-test-key' })],
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
			respond({ errors: [{ title: 'Slow down' }] }, 429, { 'Retry-After': '0' });
			respond({ data: [inquiry] });

			await expect(
				corsair.persona.api.inquiries.list({}),
			).resolves.toMatchObject({ data: [inquiry] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed read on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ title: 'Something went wrong' }] }, 503);
			respond({ data: [inquiry] });

			await expect(
				corsair.persona.api.inquiries.list({}),
			).resolves.toMatchObject({ data: [inquiry] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the approve write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ title: 'Something went wrong' }] }, 502);

			await expect(
				corsair.persona.api.inquiries.approve({
					inquiryId: inquiry.id,
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
				{ errors: [{ title: 'Must be authenticated to access this endpoint' }] },
				401,
			);

			await expect(
				corsair.persona.api.inquiries.list({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
