import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { paradym } from './index';
import { issuanceList } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only reads are replayed on 5xx,
 * because offers and revocations have no documented idempotency contract.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'paradym', 'default');
	const corsair = createCorsair({
		plugins: [paradym({ key: 'pd-test-key', walletId: 'wallet_1' })],
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
			respond({ message: 'Slow down', code: 2010 }, 429, {
				'Retry-After': '0',
			});
			respond(issuanceList);

			await expect(
				corsair.paradym.api.issuance.listSessions({}),
			).resolves.toMatchObject({ data: issuanceList.data });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong', code: 2000 }, 503);
			respond(issuanceList);

			await expect(
				corsair.paradym.api.issuance.listSessions({}),
			).resolves.toMatchObject({ data: issuanceList.data });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the offer write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong', code: 2000 }, 502);

			await expect(
				corsair.paradym.api.issuance.createOffer({
					credentials: [{ credentialTemplateId: 'tmpl_1' }],
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
					message:
						'Invalid API key. Make sure your API key is correct and it is not revoked.',
					details: [],
					code: 2005,
				},
				403,
			);

			await expect(
				corsair.paradym.api.issuance.listSessions({}),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('backs off the exponential strategy between 503 replays with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong', code: 2000 }, 503);
			respond(issuanceList);

			const pending = corsair.paradym.api.issuance.listSessions({});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({
				data: issuanceList.data,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
