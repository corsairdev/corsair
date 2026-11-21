import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { googleadmin } from './index';

/**
 * The integration and account setters this test writes through.
 *
 * unknown: core generates these at runtime from the auth config; the manager
 * types only name the auth type's own accessors, so the cast is how the test
 * reaches the generated ones.
 */
type GoogleAdminTestKeys = {
	issue_new_dek: () => Promise<void>;
	set_client_id: (value: string) => Promise<void>;
	set_client_secret: (value: string) => Promise<void>;
	set_access_token: (value: string) => Promise<void>;
	set_refresh_token: (value: string) => Promise<void>;
	set_expires_at: (value: string) => Promise<void>;
};

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'googleadmin', 'default');
	const corsair = createCorsair({
		plugins: [googleadmin()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	// The client pair lives on the integration and the tokens on the account, so
	// both levels need a DEK. unknown: core generates these setters at runtime;
	// the manager types only name the auth type's own accessors.
	const integrationKeys = corsair.keys
		.googleadmin as unknown as GoogleAdminTestKeys; // unknown: generated setters.
	await integrationKeys.issue_new_dek();
	await integrationKeys.set_client_id('client-id');
	await integrationKeys.set_client_secret('client-secret');
	const keys = corsair.googleadmin.keys as unknown as GoogleAdminTestKeys; // unknown: setters.
	await keys.issue_new_dek();
	await keys.set_access_token('stored-token');
	await keys.set_refresh_token('stored-refresh');
	// Far future, so the resolver serves the stored token and never refreshes.
	await keys.set_expires_at(String(Math.floor(Date.now() / 1000) + 3600));
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(body: unknown, status = 200) {
	// unknown: arbitrary JSON body.
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondError(status: number, reason: string) {
	respond(
		{
			error: {
				code: status,
				message: 'failed',
				status: 'FAILED',
				errors: [{ message: 'failed', domain: 'global', reason }],
			},
		},
		status,
	);
}

const usersPage = {
	users: [{ id: '1', primaryEmail: 'ada@example.com' }],
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

/**
 * Core sleeps between retries with a plain setTimeout. The backoff here is the
 * documented 1s / 2s / 4s, which is short enough to wait out, and fake timers
 * stall the SQLite driver in this suite.
 */

describe('retries through the bound client', () => {
	it('retries a 429 on a read, honouring the documented backoff', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondError(429, 'rateLimitExceeded');
			respond(usersPage);

			const result = await corsair.googleadmin.api.users.list({
				customer: 'my_customer',
			});

			expect(result.users?.[0]?.primaryEmail).toBe('ada@example.com');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 403 userRateLimitExceeded', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondError(403, 'userRateLimitExceeded');
			respond(usersPage);

			await corsair.googleadmin.api.users.list({ customer: 'my_customer' });

			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and reports the last failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondError(429, 'rateLimitExceeded');
			respondError(429, 'rateLimitExceeded');
			respondError(429, 'rateLimitExceeded');
			respondError(429, 'rateLimitExceeded');

			await expect(
				corsair.googleadmin.api.users.list({ customer: 'my_customer' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 403 dailyLimitExceeded, which no backoff refills', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondError(403, 'dailyLimitExceeded');

			await expect(
				corsair.googleadmin.api.users.list({ customer: 'my_customer' }),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondError(503, 'backendError');
			respond(usersPage);

			await corsair.googleadmin.api.users.list({ customer: 'my_customer' });

			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on a write, which may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondError(500, 'backendError');

			await expect(
				corsair.googleadmin.api.groups.insert({
					email: 'eng@example.com',
					name: 'Engineering',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a refused input, because no request is sent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(
				corsair.googleadmin.api.users.list({
					customer: 'my_customer',
					maxResults: 501,
				}),
			).rejects.toBeDefined();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 404 for a user that does not exist', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondError(404, 'notFound');

			await expect(
				corsair.googleadmin.api.users.get({ userKey: 'nobody@example.com' }),
			).rejects.toMatchObject({ status: 404 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('bound client auth', () => {
	it('sends the stored access token', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(usersPage);

			await corsair.googleadmin.api.users.list({ customer: 'my_customer' });

			const [, init] = fetchMock.mock.calls[0]!;
			expect(new Headers(init!.headers).get('authorization')).toBe(
				'Bearer stored-token',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
