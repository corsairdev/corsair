import {
	createAccountKeyManager,
	createCorsair,
	createIntegrationKeyManager,
} from '../core';
import { upsertAccount } from '../core/account-lookup';
import { exchangeCodeForTokens } from '../core/auth/exchange';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import type { OAuthCallbackError } from '../oauth';
import { generateOAuthUrl, processOAuthCallback } from '../oauth';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

jest.mock('../hub/report-connection-status', () => ({
	...jest.requireActual('../hub/report-connection-status'),
	reportPluginConnectionStatus: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../oauth/subscribe-report', () => ({
	subscribeAndReport: jest.fn().mockResolvedValue({
		linkType: 'subscription_id',
		externalId: 'sub-1',
	}),
}));

let token = 0;
jest.mock('../core/auth/exchange', () => ({
	...jest.requireActual('../core/auth/exchange'),
	exchangeCodeForTokens: jest.fn(async () => ({
		access_token: `at-${++token}`,
	})),
}));

jest.mock('../webhooks/resolve-oauth-tenant-link', () => ({
	resolveOAuthWebhookTenantLink: jest.fn().mockResolvedValue(null),
}));

const KEK = 'test-kek-with-at-least-32-characters!!';
const REDIRECT = 'https://app.example/oauth/callback';

// A minimal plugin literal; the full CorsairPlugin generics are not needed here.
const demo = {
	id: 'demo',
	options: { authType: 'oauth_2' as const },
	authConfig: { oauth_2: { account: ['subscription_id'] as const } },
	oauthConfig: {
		providerName: 'Demo',
		authUrl: 'https://provider.example/authorize',
		tokenUrl: 'https://provider.example/token',
		scopes: ['read'],
	},
	subscribe: async () => undefined,
} as unknown as CorsairPlugin; // a test literal: the plugin's full generics aren't needed

describe('self-hosted OAuth with several accounts', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: ReturnType<typeof createCorsair>;

	beforeEach(async () => {
		jest.clearAllMocks();
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [demo],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
			multiAccount: true,
		});
		// A Kysely input is assumed Postgres; the sqlite test DB has no FOR UPDATE.
		getCorsairInternal(corsair).database!.isPg = false;
		await setupCorsair(corsair, { tenantId: 't1' });
		await env.db.deleteFrom('corsair_accounts').execute();
		const integration = createIntegrationKeyManager({
			authType: 'oauth_2',
			integrationName: 'demo',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
		});
		await integration.set_client_id('cid');
		await integration.set_client_secret('csec');
		token = 0;
	});
	afterEach(() => env?.cleanup?.());

	const rows = () =>
		env.db.selectFrom('corsair_accounts').selectAll().execute();
	const tokenOf = (ref: string) =>
		createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'demo',
			tenantId: 't1',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
			account: { ref },
		}).get_access_token();
	const connect = async (account?: { add: true } | { reconnect: string }) => {
		const { state } = await generateOAuthUrl(corsair, 'demo', {
			tenantId: 't1',
			redirectUri: REDIRECT,
			account,
		});
		return processOAuthCallback(corsair, {
			code: 'code',
			state,
			redirectUri: REDIRECT,
		});
	};
	const codeOf = (
		promise: Promise<unknown>, // only the rejection's code is read
	) =>
		promise.then(
			() => undefined,
			(e) => (e as OAuthCallbackError).code,
		);

	it('names the first account, and Add makes a second beside it', async () => {
		await connect();
		await connect({ add: true });
		expect(await rows()).toHaveLength(2);
		expect(await tokenOf('Account 1')).toBe('at-1');
		expect(await tokenOf('Account 2')).toBe('at-2');
	});

	it('Reconnect refreshes the account it names and no other', async () => {
		await connect();
		await connect({ add: true });
		await connect({ reconnect: 'Account 1' });
		expect(await rows()).toHaveLength(2);
		expect(await tokenOf('Account 1')).toBe('at-3');
		expect(await tokenOf('Account 2')).toBe('at-2');
	});

	it('a connect that names no account is refused once there are several', async () => {
		await connect();
		await connect({ add: true });
		expect(await codeOf(connect())).toBe('account_required');
	});

	it('reconnecting an account that is not there is refused', async () => {
		await connect();
		expect(await codeOf(connect({ reconnect: 'Account 9' }))).toBe(
			'account_not_found',
		);
	});

	it('stores the subscription link on the account just connected', async () => {
		await connect();
		await connect({ add: true });
		const second = createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'demo',
			tenantId: 't1',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
			extraAccountFields: ['subscription_id'],
			account: { ref: 'Account 2' },
		}) as unknown as { get_subscription_id(): Promise<string | null> }; // a plugin field the base manager type doesn't carry
		expect(await second.get_subscription_id()).toBe('sub-1');
	});

	it('a sign-in the provider refuses leaves no account behind', async () => {
		await connect();
		jest.mocked(exchangeCodeForTokens).mockResolvedValueOnce({});
		expect(await codeOf(connect({ add: true }))).toBe('no_access_token');
		expect(await rows()).toHaveLength(1);
	});

	it('reconnecting an account saved before names gives it one, so Add works', async () => {
		await connect();
		await env.db
			.updateTable('corsair_accounts')
			.set({ config: {}, dek: null })
			.execute();
		const [row] = await rows();
		expect(await codeOf(connect({ add: true }))).toBe('account_unnamed');
		await connect({ reconnect: row!.id });
		await connect({ add: true });
		expect(await rows()).toHaveLength(2);
	});

	it('a label two accounts share is refused rather than guessed', async () => {
		await connect();
		await connect({ add: true });
		const [first, second] = await rows();
		// Copy the first account's sealed identity onto the second.
		await env.db
			.updateTable('corsair_accounts')
			.set({ config: first!.config, dek: first!.dek })
			.where('id', '=', second!.id)
			.execute();
		expect(await codeOf(connect({ reconnect: 'Account 1' }))).toBe(
			'account_required',
		);
	});

	it('two adds at once take different names', async () => {
		await connect();
		await Promise.all([connect({ add: true }), connect({ add: true })]);
		expect(await rows()).toHaveLength(3);
		expect(await tokenOf('Account 2')).toBeDefined();
		expect(await tokenOf('Account 3')).toBeDefined();
	});

	it('two reconnects of one unnamed account at once keep a single name and its tokens', async () => {
		await connect();
		await env.db
			.updateTable('corsair_accounts')
			.set({ config: {}, dek: null })
			.execute();
		const [row] = await rows();
		await Promise.all([
			connect({ reconnect: row!.id }),
			connect({ reconnect: row!.id }),
		]);
		expect(await rows()).toHaveLength(1);
		expect(await tokenOf('Account 1')).toMatch(/^at-/);
	});

	it('naming an account that was disconnected meanwhile is refused', async () => {
		await expect(
			upsertAccount({
				database: getCorsairInternal(corsair).database!,
				kek: KEK,
				integrationName: 'demo',
				tenantId: 't1',
				allowMany: true,
				rowId: 'gone',
				identity: { id: 'acct_x' },
			}),
		).rejects.toMatchObject({ code: 'account_not_found' });
	});
});
