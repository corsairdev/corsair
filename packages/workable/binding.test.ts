/**
 * The plugin bound through createCorsair, with a real key manager and an
 * in-memory database. Covers what the endpoint-level tests cannot: Corsair
 * mints a connect link (and records the connect request) only when the
 * keyBuilder itself throws AuthMissingError, so a missing token or subdomain
 * has to fail there, while the public job-board endpoints still run keyless.
 */
import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { workable } from './index';

const KEK = '0123456789abcdef0123456789abcdef';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'workable', 'default');
	const corsair = createCorsair({
		plugins: [workable()],
		database: testDb.db,
		kek: KEK,
	});
	await corsair.workable.keys.issue_new_dek();
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Workable plugin through createCorsair', () => {
	it('raises AuthMissingError from the keyBuilder when no token is stored', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.workable.keys.set_account('acme');
			const error = await corsair.workable.api.jobs.list({}).catch((e) => e);
			expect(error).toBeInstanceOf(AuthMissingError);
			// Only the binder's connect path (the one that mints the link when
			// Hub is configured) stamps the tenant on the error; an
			// AuthMissingError thrown inside the endpoint skips it.
			expect(error).toMatchObject({
				pluginId: 'workable',
				tenantId: 'default',
			});
			expect(error.message).toMatch(/auth-missing:workable/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('raises AuthMissingError when the token is stored without a subdomain', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.workable.keys.set_api_key('wk-token');
			const error = await corsair.workable.api.departments
				.list({})
				.catch((e) => e);
			expect(error).toBeInstanceOf(AuthMissingError);
			expect(error).toMatchObject({
				pluginId: 'workable',
				tenantId: 'default',
			});
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored token as a Bearer header to the stored subdomain', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.workable.keys.set_api_key('wk-token');
			await corsair.workable.keys.set_account('acme');
			respond({ jobs: [] });
			await corsair.workable.api.jobs.list({ limit: 5 });
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://acme.workable.com/spi/v3/jobs?limit=5');
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer wk-token',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('runs the public job board with no credentials stored', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ name: 'Acme', jobs: [] });
			const board = await corsair.workable.api.publicJobs.list({
				subdomain: 'acme',
			});
			expect(board.name).toBe('Acme');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://www.workable.com/api/accounts/acme');
			expect(new Headers(init.headers).get('authorization')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses a stored subdomain that would change the host', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.workable.keys.set_api_key('wk-token');
			await corsair.workable.keys.set_account('evil.example.com/x');
			await expect(corsair.workable.api.jobs.list({})).rejects.toThrow(
				/letters, numbers and hyphens/,
			);
			await expect(
				corsair.workable.api.publicJobs.list({ subdomain: 'evil.example.com' }),
			).rejects.toThrow(/letters, numbers and hyphens/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
