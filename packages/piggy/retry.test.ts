import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { piggy } from './index';
import { contactsList } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only GET requests replay a
 * 5xx, writes never do (points, redemptions and deletions would
 * double-apply).
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'piggy', 'default');
	const corsair = createCorsair({
		plugins: [piggy({ key: 'pat-test-token' })],
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
			respond({ message: 'Slow down' }, 429, { 'Retry-After': '0' });
			respond(contactsList);

			await expect(corsair.piggy.api.contacts.list({})).resolves.toMatchObject({
				data: contactsList.data,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Down' }, 503);
			respond(contactsList);

			await expect(corsair.piggy.api.contacts.list({})).resolves.toMatchObject({
				data: contactsList.data,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a failed POST, which already ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Down after write' }, 503);

			await expect(
				corsair.piggy.api.contacts.create({
					email: 'spongebob@bikinibottom.sea',
				}),
			).rejects.toThrow('Piggy 503');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('raises the provider error message through the runtime', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Unauthenticated.' }, 401);

			await expect(corsair.piggy.api.contacts.list({})).rejects.toThrow(
				'Piggy 401: Unauthenticated.',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
