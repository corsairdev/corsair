import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { sendbird } from './index';

async function tenants(options: Parameters<typeof sendbird>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'sendbird', 'acme');
	const now = new Date();
	await testDb.db
		.insertInto('corsair_accounts')
		.values({
			id: 'sendbird-account-globex',
			created_at: now,
			updated_at: now,
			tenant_id: 'globex',
			integration_id: 'sendbird-integration',
			config: {},
			dek: undefined,
		} as never)
		.execute();
	return {
		testDb,
		corsair: createCorsair({
			plugins: [sendbird(options)],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
			multiTenancy: true,
		}),
	};
}

describe('Sendbird tenant credentials', () => {
	let fetchMock: jest.SpyInstance;
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(
			async () =>
				new Response(JSON.stringify({ users: [], next: '' }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
		);
	});
	afterEach(() => jest.restoreAllMocks());
	it('sends each tenant token to its own application', async () => {
		const { corsair, testDb } = await tenants();
		try {
			const acme = corsair.withTenant('acme');
			const globex = corsair.withTenant('globex');
			await acme.sendbird.keys.issue_new_dek();
			await acme.sendbird.keys.set_api_key('acme-token');
			await acme.sendbird.keys.set_applicationId('acme-app');
			await globex.sendbird.keys.issue_new_dek();
			await globex.sendbird.keys.set_api_key('globex-token');
			await globex.sendbird.keys.set_applicationId('globex-app');
			await acme.sendbird.api.users.list({});
			await globex.sendbird.api.users.list({});
			expect(fetchMock).toHaveBeenCalledTimes(2);
			for (const [index, app, token] of [
				[0, 'acme-app', 'acme-token'],
				[1, 'globex-app', 'globex-token'],
			] as const) {
				const [url, init] = fetchMock.mock.calls[index] as [
					string,
					RequestInit,
				];
				expect(url).toContain(`https://api-${app}.sendbird.com/v3/users`);
				expect(new Headers(init.headers).get('Api-Token')).toBe(token);
			}
		} finally {
			testDb.cleanup();
		}
	});
	it('does not mix a registration application ID with a tenant token', async () => {
		const { corsair, testDb } = await tenants({ applicationId: 'shared-app' });
		try {
			const acme = corsair.withTenant('acme');
			await acme.sendbird.keys.issue_new_dek();
			await acme.sendbird.keys.set_api_key('tenant-token');
			await expect(acme.sendbird.api.users.list({})).rejects.toBeInstanceOf(
				AuthMissingError,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
	it('rejects an unpaired registration token', async () => {
		const { corsair, testDb } = await tenants({ key: 'shared-token' });
		try {
			await expect(
				corsair.withTenant('acme').sendbird.api.users.list({}),
			).rejects.toBeInstanceOf(AuthMissingError);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
	it('uses the registration token and application ID together', async () => {
		const { corsair, testDb } = await tenants({
			key: 'shared-token',
			applicationId: 'shared-app',
		});
		try {
			await corsair.withTenant('acme').sendbird.api.users.list({});
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toContain('https://api-shared-app.sendbird.com/v3/users');
			expect(new Headers(init.headers).get('Api-Token')).toBe('shared-token');
		} finally {
			testDb.cleanup();
		}
	});
	it('uses registration credentials without a database', async () => {
		const corsair = createCorsair({
			plugins: [sendbird({ key: 'shared-token', applicationId: 'shared-app' })],
		});
		await corsair.sendbird.api.users.list({});
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('https://api-shared-app.sendbird.com/v3/users');
		expect(new Headers(init.headers).get('Api-Token')).toBe('shared-token');
	});
	it('reports missing credentials without a database', async () => {
		const corsair = createCorsair({ plugins: [sendbird()] });
		await expect(corsair.sendbird.api.users.list({})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('encodes query values on the actual HTTP request', async () => {
		const { corsair, testDb } = await tenants({
			key: 'shared-token',
			applicationId: 'shared-app',
		});
		try {
			await corsair.withTenant('acme').sendbird.api.users.list({
				token: 'page+/=',
				user_ids: 'user 1,user+2',
				show_bot: false,
			});
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toContain('token=page%2B%2F%3D');
			expect(url).toContain('user_ids=user%201%2Cuser%2B2');
			expect(url).toContain('show_bot=false');
			expect(init.body).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});
});
