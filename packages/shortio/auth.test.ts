import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { shortio } from './index';

async function createTenants(options: Parameters<typeof shortio>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'shortio', 'acme');
	const now = new Date();
	await testDb.db
		.insertInto('corsair_accounts')
		.values({
			id: 'shortio-account-globex',
			created_at: now,
			updated_at: now,
			tenant_id: 'globex',
			integration_id: 'shortio-integration',
			config: {},
			dek: undefined,
		} as never)
		.execute();
	const corsair = createCorsair({
		plugins: [shortio(options)],
		database: testDb.db,
		kek: '0123456789abcdef0123456789abcdef',
		multiTenancy: true,
	});
	return { corsair, testDb };
}

describe('Short.io tenant credentials', () => {
	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(
			async () =>
				new Response('[]', {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
		);
	});

	afterEach(() => jest.restoreAllMocks());

	function sentKey(index: number) {
		const [, init] = fetchMock.mock.calls[index] as [string, RequestInit];
		return new Headers(init.headers).get('authorization');
	}

	it('uses each tenant’s saved key without crossing accounts', async () => {
		const { corsair, testDb } = await createTenants();
		try {
			const acme = corsair.withTenant('acme');
			const globex = corsair.withTenant('globex');
			await acme.shortio.keys.issue_new_dek();
			await acme.shortio.keys.set_api_key('acme-key');
			await globex.shortio.keys.issue_new_dek();
			await globex.shortio.keys.set_api_key('globex-key');
			await acme.shortio.api.domains.list({});
			await globex.shortio.api.domains.list({});
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(sentKey(0)).toBe('acme-key');
			expect(sentKey(1)).toBe('globex-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers the registration key over saved keys for every tenant', async () => {
		const { corsair, testDb } = await createTenants({ key: 'shared-key' });
		try {
			const acme = corsair.withTenant('acme');
			const globex = corsair.withTenant('globex');
			await acme.shortio.keys.issue_new_dek();
			await acme.shortio.keys.set_api_key('acme-key');
			await globex.shortio.keys.issue_new_dek();
			await globex.shortio.keys.set_api_key('globex-key');
			await acme.shortio.api.domains.list({});
			await globex.shortio.api.domains.list({});
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(sentKey(0)).toBe('shared-key');
			expect(sentKey(1)).toBe('shared-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('falls back from a whitespace registration key to the tenant key', async () => {
		const { corsair, testDb } = await createTenants({ key: ' \t ' });
		try {
			const acme = corsair.withTenant('acme');
			await acme.shortio.keys.issue_new_dek();
			await acme.shortio.keys.set_api_key('acme-key');
			await acme.shortio.api.domains.list({});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(sentKey(0)).toBe('acme-key');
		} finally {
			testDb.cleanup();
		}
	});

	it.each([undefined, ' \t '])(
		'rejects a missing or whitespace saved key (%s) before transport',
		async (key) => {
			const { corsair, testDb } = await createTenants({ key: ' ' });
			try {
				const acme = corsair.withTenant('acme');
				await acme.shortio.keys.issue_new_dek();
				if (key !== undefined) await acme.shortio.keys.set_api_key(key);
				await expect(acme.shortio.api.domains.list({})).rejects.toBeInstanceOf(
					AuthMissingError,
				);
				expect(fetchMock).not.toHaveBeenCalled();
			} finally {
				testDb.cleanup();
			}
		},
	);

	it('propagates key-store failures rather than hiding them as missing credentials', async () => {
		const { corsair, testDb } = await createTenants();
		try {
			const acme = corsair.withTenant('acme');
			// An uninitialized account has no DEK, so reading its key fails.
			await expect(acme.shortio.api.domains.list({})).rejects.toThrow(
				/No DEK found for account/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
