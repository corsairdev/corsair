import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { googlesearchconsole } from './index';

/**
 * The integration and account setters this test writes through.
 *
 * unknown: core generates these at runtime from the auth config; the manager
 * types only name the auth type's own accessors.
 */
type SearchConsoleTestKeys = {
	issue_new_dek: () => Promise<void>;
	set_client_id: (value: string) => Promise<void>;
	set_client_secret: (value: string) => Promise<void>;
	set_access_token: (value: string) => Promise<void>;
	set_refresh_token: (value: string) => Promise<void>;
	set_expires_at: (value: string) => Promise<void>;
};

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(
		testDb.db,
		'googlesearchconsole',
		'default',
	);
	const corsair = createCorsair({
		plugins: [googlesearchconsole()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	// unknown: core generates the setters; only the auth type's own are typed.
	const integrationKeys = corsair.keys
		.googlesearchconsole as unknown as SearchConsoleTestKeys; // unknown: setters.
	await integrationKeys.issue_new_dek();
	await integrationKeys.set_client_id('client-id');
	await integrationKeys.set_client_secret('client-secret');
	// unknown: same generated setters, on the account level.
	const keys = corsair.googlesearchconsole
		.keys as unknown as SearchConsoleTestKeys; // unknown: setters.
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

const sites = {
	siteEntry: [
		{ siteUrl: 'https://example.com/', permissionLevel: 'SITE_OWNER' },
	],
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('googlesearchconsole through the bound client', () => {
	it('sends the stored access token as a bearer', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(sites);

			await corsair.googlesearchconsole.api.sites.list({});

			const [, init] = fetchMock.mock.calls[0]!;
			expect(new Headers(init!.headers).get('authorization')).toBe(
				'Bearer stored-token',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a query', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: { code: 429, message: 'quota', status: 'RESOURCE_EXHAUSTED' },
				},
				429,
			);
			respond({ rows: [] });

			const result =
				await corsair.googlesearchconsole.api.searchanalytics.query({
					siteUrl: 'https://example.com/',
					startDate: '2024-06-01',
					endDate: '2024-06-02',
				});

			expect(result.rows).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a sitemap submit after a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 500, message: 'internal', status: 'INTERNAL' } },
				500,
			);

			await expect(
				corsair.googlesearchconsole.api.sitemaps.submit({
					siteUrl: 'https://example.com/',
					feedpath: 'https://example.com/sitemap.xml',
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
				corsair.googlesearchconsole.api.searchanalytics.query({
					siteUrl: 'https://example.com/',
					startDate: '2024-06-01',
					endDate: '2024-06-02',
					rowLimit: 25_001,
				}),
			).rejects.toBeDefined();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
