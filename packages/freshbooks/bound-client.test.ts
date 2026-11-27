import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { freshbooks } from './index';
import { usersMeResponse } from './test-fixtures';

/**
 * Bound-client tests: the plugin inside a real corsair instance, where the
 * key builder resolves the stored account key the way runtime calls do. The
 * file was previously named integration.test.ts, which CI ignores by name;
 * under this plain name CI runs it, so nothing here may call the live API
 * unmocked.
 */
async function createClient(options: Parameters<typeof freshbooks>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'freshbooks', 'default');
	const corsair = createCorsair({
		plugins: [freshbooks(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('freshbooks through createCorsair', () => {
	it('resolves the stored access token and parses users/me', async () => {
		const { corsair, testDb } = await createClient({
			key: 'fb-test-access-token',
		});
		try {
			respond(usersMeResponse);

			const result = await corsair.freshbooks.api.users.me({});

			expect(result.accountId).toBe('zDmNq');
			expect(result.businessId).toBe(77128);
		} finally {
			testDb.cleanup();
		}
	});

	// A bound call with no stored key dies in core's key manager ("No DEK
	// found") before the plugin key builder runs, so AuthMissingError is
	// asserted at the key-builder level in plugin.test.ts instead.

	it('prefers the option key over the stored one', async () => {
		const { corsair, testDb } = await createClient({
			key: 'fb-option-token',
		});
		try {
			respond(usersMeResponse);

			await corsair.freshbooks.api.users.me({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer fb-option-token',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('surfaces an accounting error envelope as a failed call', async () => {
		const { corsair, testDb } = await createClient({
			key: 'fb-test-access-token',
		});
		try {
			respond(
				{
					response: {
						errors: [{ errno: 404, message: 'Account not found' }],
					},
				},
				404,
			);

			await expect(
				corsair.freshbooks.api.clients.list({ accountId: 'FAKEACC' }),
			).rejects.toMatchObject({
				name: 'FreshBooksAPIError',
				errno: 404,
			});
		} finally {
			testDb.cleanup();
		}
	});
});
