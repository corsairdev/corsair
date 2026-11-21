import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { googlephotos } from './index';

/**
 * The integration and account setters this test writes through.
 *
 * unknown: core generates these at runtime from the auth config; the manager
 * types only name the auth type's own accessors.
 */
type GooglePhotosTestKeys = {
	issue_new_dek: () => Promise<void>;
	set_client_id: (value: string) => Promise<void>;
	set_client_secret: (value: string) => Promise<void>;
	set_access_token: (value: string) => Promise<void>;
	set_refresh_token: (value: string) => Promise<void>;
	set_expires_at: (value: string) => Promise<void>;
};

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'googlephotos', 'default');
	const corsair = createCorsair({
		plugins: [googlephotos()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	// unknown: core generates the setters; only the auth type's own are typed.
	const integrationKeys = corsair.keys
		.googlephotos as unknown as GooglePhotosTestKeys; // unknown: setters.
	await integrationKeys.issue_new_dek();
	await integrationKeys.set_client_id('client-id');
	await integrationKeys.set_client_secret('client-secret');
	// unknown: same generated setters, on the account level.
	const keys = corsair.googlephotos.keys as unknown as GooglePhotosTestKeys; // unknown: setters.
	await keys.issue_new_dek();
	await keys.set_access_token('stored-token');
	await keys.set_refresh_token('stored-refresh');
	// Far future, so the resolver serves the stored token and never refreshes.
	await keys.set_expires_at(String(Math.floor(Date.now() / 1000) + 3600));
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

function respond(
	body: unknown, // unknown: arbitrary JSON until a schema reads it.
	status = 200,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

const albums = { albums: [{ id: 'album-1', title: 'Holiday' }] };

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('googlephotos through the bound client', () => {
	it('sends the stored access token as a bearer', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(albums);

			await corsair.googlephotos.api.albums.list({});

			const [, init] = fetchMock.mock.calls[0]!;
			expect(new Headers(init!.headers).get('authorization')).toBe(
				'Bearer stored-token',
			);
		} finally {
			testDb.cleanup();
		}
	});

	// A 429 is retried by the handlers, but the documented floor is a 30 second
	// wait, which is too slow for this suite; error-handlers.test.ts pins that
	// delay directly. A 5xx on a read is the fast retry path to prove here.
	it('retries a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 500, message: 'internal', status: 'INTERNAL' } },
				500,
			);
			respond(albums);

			const result = await corsair.googlephotos.api.albums.list({});

			expect(result.albums).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 5xx, which may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 500, message: 'internal', status: 'INTERNAL' } },
				500,
			);

			await expect(
				corsair.googlephotos.api.albums.create({ title: 'New' }),
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
				corsair.googlephotos.api.albums.list({ pageSize: 51 }),
			).rejects.toBeDefined();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
