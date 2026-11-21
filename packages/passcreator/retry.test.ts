import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { passcreator } from './index';
import { pass, template } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only reads are replayed on 5xx,
 * because pass creates and pushes have no documented idempotency contract.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'passcreator', 'default');
	const corsair = createCorsair({
		plugins: [passcreator({ key: 'pc-test-key' })],
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
			respond({ description: 'Slow down' }, 429, { 'Retry-After': '0' });
			respond([template]);

			await expect(corsair.passcreator.api.templates.list({})).resolves.toEqual(
				[template],
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ description: 'Something went wrong' }, 503);
			respond({ total: 1, results: [pass] });

			await expect(
				corsair.passcreator.api.passes.list({ templateUid: 'tmpl_1' }),
			).resolves.toEqual({ total: 1, results: [pass] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the create write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ description: 'Something went wrong' }, 502);

			await expect(
				corsair.passcreator.api.passes.create({
					passtemplate: 'tmpl_1',
					properties: { firstname: 'Jane' },
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
			respond({ success: false, description: 'Unauthorized' }, 401);

			await expect(
				corsair.passcreator.api.templates.list({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('backs off the exponential strategy between 503 replays with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ description: 'Something went wrong' }, 503);
			respond({ total: 1, results: [pass] });

			const pending = corsair.passcreator.api.passes.list({
				templateUid: 'tmpl_1',
			});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toEqual({ total: 1, results: [pass] });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
