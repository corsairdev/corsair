import { createAccountKeyManager, createCorsair } from '../core';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { signDeliveryEnvelope } from '../hub/signing/envelope';
import { setupCorsair } from '../setup';
import { processCorsair } from '../tunnel';
import { createTestDatabase } from './setup-db';

jest.mock('../hub/report-connection-status', () => ({
	...jest.requireActual('../hub/report-connection-status'),
	reportPluginConnectionStatus: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../oauth/subscribe-report', () => ({
	subscribeAndReport: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../webhooks/resolve-oauth-tenant-link', () => ({
	resolveOAuthWebhookTenantLink: jest.fn().mockResolvedValue(null),
}));

import {
	ManagedOAuthDeliveryError,
	processManagedOAuthDelivery,
} from '../hub/managed-oauth';
import { subscribeAndReport } from '../oauth/subscribe-report';
import { resolveOAuthWebhookTenantLink } from '../webhooks/resolve-oauth-tenant-link';

const KEK = 'test-kek-with-at-least-32-characters!!';
const SECRET = 'csec_accounts';

const gmail = {
	id: 'gmail',
	options: { authType: 'managed' as const },
	authConfig: { managed: { account: ['team_id'] as const } },
} as unknown as CorsairPlugin;

describe('managed oauth delivery by account identity', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: ReturnType<typeof createCorsair>;
	beforeEach(async () => {
		jest.clearAllMocks();
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [gmail],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
			multiAccount: true,
		});
		// A Kysely input is assumed Postgres; the sqlite test DB has no FOR UPDATE.
		getCorsairInternal(corsair).database!.isPg = false;
		await setupCorsair(corsair, { tenantId: 't1' });
	});
	afterEach(() => env?.cleanup?.());

	const database = () => getCorsairInternal(corsair).database!;
	const rows = () =>
		database().db.selectFrom('corsair_accounts').selectAll().execute();
	const km = (ref?: string) =>
		createAccountKeyManager({
			authType: 'managed',
			integrationName: 'gmail',
			tenantId: 't1',
			kek: KEK,
			database: database(),
			extraAccountFields: ['team_id'],
			account: ref ? { ref } : undefined,
		});
	const teamIdOf = (ref: string) =>
		(
			km(ref) as unknown as { get_team_id(): Promise<string | null> }
		).get_team_id();
	const deliver = (
		accessToken: string,
		account?: { id: string; label?: string },
		accounts?: { id: string; label?: string }[],
	) =>
		processManagedOAuthDelivery(corsair, {
			plugin: 'gmail',
			tenantId: 't1',
			accessToken,
			account,
			accounts,
		});

	it('stores the subscription link on the account the delivery is for', async () => {
		await deliver('at-a', { id: 'a', label: 'a@x.com' });
		jest
			.mocked(subscribeAndReport)
			.mockResolvedValueOnce({ linkType: 'team_id', externalId: 'T9' });
		await deliver('at-b', { id: 'b', label: 'b@x.com' });
		expect(await teamIdOf('b')).toBe('T9');
		expect(await teamIdOf('a')).toBeNull();
	});

	it('delivery without account writes the default row', async () => {
		await deliver('at-default');
		expect(await rows()).toHaveLength(1);
		expect(await km().get_access_token()).toBe('at-default');
	});

	it('a delivery with no account is refused when the tenant has two accounts', async () => {
		await deliver('at-a', { id: 'a' });
		await deliver('at-b', { id: 'b' });
		const err = await deliver('at-none').catch((e) => e);
		expect(err).toBeInstanceOf(ManagedOAuthDeliveryError);
		expect(err.code).toBe('account_required');
		expect(await km('a').get_access_token()).toBe('at-a');
		expect(await km('b').get_access_token()).toBe('at-b');
	});

	it('a delivery with no account still writes the only account', async () => {
		await deliver('at-a', { id: 'a' });
		await deliver('at-next');
		expect(await rows()).toHaveLength(1);
		expect(await km('a').get_access_token()).toBe('at-next');
	});

	it('a delivery with an empty account id is treated as no account', async () => {
		await deliver('at-blank', { id: '  ' });
		expect(await rows()).toHaveLength(1);
		expect(await km().get_access_token()).toBe('at-blank');
		// A sealed blank identity would block adoption and force a second row.
		await deliver('at-a', { id: 'a' });
		expect(await rows()).toHaveLength(1);
	});

	it('two deliveries with different account ids create two rows with separate tokens', async () => {
		await deliver('at-a', { id: 'a', label: 'a@x.com' });
		await deliver('at-b', { id: 'b', label: 'b@x.com' });
		expect(await rows()).toHaveLength(2);
		expect(await km('a').get_access_token()).toBe('at-a');
		expect(await km('b').get_access_token()).toBe('at-b');
	});

	it('the same account id delivered twice updates one row', async () => {
		await deliver('at-1', { id: 'a', label: 'a@x.com' });
		await deliver('at-2', { id: 'a', label: 'a@x.com' });
		expect(await rows()).toHaveLength(1);
		expect(await km('a').get_access_token()).toBe('at-2');
	});

	it('a delivery with an account adopts a legacy ref-less row', async () => {
		await deliver('at-legacy');
		await deliver('at-new', { id: 'a', label: 'a@x.com' });
		expect(await rows()).toHaveLength(1);
		expect(await km('a').get_access_token()).toBe('at-new');
	});

	// An account connected before accounts had names, then a second one added:
	// the hub's list says the unnamed row is the first account, not the new one.
	it('a new account beside an unnamed one is added, and the unnamed one takes its name', async () => {
		await deliver('at-first');
		const both = [
			{ id: 'a', label: 'a@x.com' },
			{ id: 'b', label: 'b@x.com' },
		];
		await deliver('at-second', { id: 'b', label: 'b@x.com' }, both);
		expect(await rows()).toHaveLength(2);
		expect(await km('a').get_access_token()).toBe('at-first');
		expect(await km('b').get_access_token()).toBe('at-second');
	});

	it('an unnamed row is still adopted when the hub knows only the account being delivered', async () => {
		await deliver('at-legacy');
		await deliver('at-new', { id: 'a', label: 'a@x.com' }, [
			{ id: 'a', label: 'a@x.com' },
		]);
		expect(await rows()).toHaveLength(1);
		expect(await km('a').get_access_token()).toBe('at-new');
	});

	it('a sixth account is refused with ManagedOAuthDeliveryError account_limit and the existing five are untouched', async () => {
		for (const n of [1, 2, 3, 4, 5]) {
			await deliver(`at-${n}`, { id: `id${n}` });
		}
		const err = await deliver('at-6', { id: 'id6' }).catch((e) => e);
		expect(err).toBeInstanceOf(ManagedOAuthDeliveryError);
		expect(err.code).toBe('account_limit');
		expect(await rows()).toHaveLength(5);
		expect(await km('id1').get_access_token()).toBe('at-1');
	});

	it('the webhook tenant link is stored on the delivered account, not the default', async () => {
		(resolveOAuthWebhookTenantLink as jest.Mock).mockImplementation(
			async (_plugins, _id, tokens) => ({
				linkType: 'team_id',
				externalId: `T-${tokens.access_token}`,
			}),
		);
		await deliver('at-a', { id: 'a' });
		await deliver('at-b', { id: 'b' });
		expect(await teamIdOf('b')).toBe('T-at-b');
		expect(await teamIdOf('a')).toBe('T-at-a');
	});

	it('tunnel oauth.tokens payload with account reaches the delivery', async () => {
		const { body, headers } = signDeliveryEnvelope({
			projectId: 'proj_acc',
			signingSecret: SECRET,
			type: 'oauth.tokens',
			payload: {
				plugin: 'gmail',
				tenantId: 't1',
				accessToken: 'at-tunnel',
				account: { id: 'a', label: 'a@x.com' },
			},
		});
		const ack = await processCorsair(
			corsair,
			{ headers, body },
			{ signingSecret: SECRET },
		);
		expect(ack.status).toBe('ok');
		expect(await km('a@x.com').get_access_token()).toBe('at-tunnel');
	});

	it('tunnel oauth.tokens payload carries the hub account list to the delivery', async () => {
		await deliver('at-first');
		const { body, headers } = signDeliveryEnvelope({
			projectId: 'proj_acc',
			signingSecret: SECRET,
			type: 'oauth.tokens',
			payload: {
				plugin: 'gmail',
				tenantId: 't1',
				accessToken: 'at-second',
				account: { id: 'b', label: 'b@x.com' },
				accounts: [
					{ id: 'a', label: 'a@x.com' },
					{ id: 'b', label: 'b@x.com' },
				],
			},
		});
		await processCorsair(corsair, { headers, body }, { signingSecret: SECRET });
		expect(await rows()).toHaveLength(2);
		expect(await km('a').get_access_token()).toBe('at-first');
	});

	it('a payload with no account behaves as before', async () => {
		const { body, headers } = signDeliveryEnvelope({
			projectId: 'proj_acc',
			signingSecret: SECRET,
			type: 'oauth.tokens',
			payload: { plugin: 'gmail', tenantId: 't1', accessToken: 'at-plain' },
		});
		await processCorsair(corsair, { headers, body }, { signingSecret: SECRET });
		expect(await rows()).toHaveLength(1);
		expect(await km().get_access_token()).toBe('at-plain');
	});
});
