import { createCorsair } from '../core';
import { resetDeliveryReplayGuardForTests } from '../hub/internal/delivery-replay-guard';
import { signDeliveryEnvelope } from '../hub/signing/envelope';
import type { ConnectionsSyncManifest } from '../hub/sync-payload';
import {
	decryptSyncManifest,
	encryptSyncManifest,
	parseSyncDeliveryBody,
} from '../hub/sync-payload';
import { setupCorsair } from '../setup';
import { processCorsair } from '../tunnel';
import { createTestDatabase } from './setup-db';

const slackOAuth = {
	id: 'slack',
	options: { authType: 'oauth_2' as const },
	oauthConfig: {
		providerName: 'Slack',
		scopes: ['channels:read'],
	},
} as const;

describe('sync-payload', () => {
	const manifest: ConnectionsSyncManifest = {
		tenants: [{ id: 'default' }, { id: 'acme' }],
		plugins: [
			{
				id: 'slack',
				authType: 'oauth_2',
				configured: false,
				missingFields: ['client_id', 'client_secret'],
			},
		],
		syncedAt: '2026-07-11T00:00:00.000Z',
	};

	it('round-trips manifest encryption', () => {
		const encrypted = encryptSyncManifest(manifest, 'signing-secret');
		const decrypted = decryptSyncManifest(encrypted, 'signing-secret');
		expect(decrypted).toEqual(manifest);
	});

	it('parses sync delivery body', () => {
		const encrypted = encryptSyncManifest(manifest, 'signing-secret');
		const parsed = parseSyncDeliveryBody(
			JSON.stringify({ status: 'ok', sync: { encrypted } }),
		);
		expect(parsed?.encrypted).toBe(encrypted);
	});
});

describe('processCorsair — connections.sync', () => {
	let env: ReturnType<typeof createTestDatabase>;

	beforeEach(async () => {
		resetDeliveryReplayGuardForTests();
		env = createTestDatabase();
	});

	afterEach(() => env.cleanup());

	it('returns encrypted manifest after setup and introspection', async () => {
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: 'test-kek-connections-sync',
			hub: {
				projectApiKey: 'ck_dev_test_key',
				signingSecret: 'signing-secret',
			},
		} as any);

		const { body, headers } = signDeliveryEnvelope({
			projectId: 'proj_test',
			signingSecret: 'signing-secret',
			type: 'connections.sync',
			payload: {},
		});

		const ack = await processCorsair(
			corsair,
			{
				headers,
				body,
			},
			{ signingSecret: 'signing-secret' },
		);

		expect(ack.status).toBe('ok');
		expect(ack.syncManifest?.encrypted).toBeTruthy();

		const manifest = decryptSyncManifest(
			ack.syncManifest!.encrypted,
			'signing-secret',
		);
		expect(manifest.tenants.some((tenant) => tenant.id === 'default')).toBe(
			true,
		);
		expect(manifest.plugins.some((plugin) => plugin.id === 'slack')).toBe(true);
	});

	it('rejects unsigned connections.sync requests', async () => {
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: 'test-kek-connections-sync',
			hub: {
				projectApiKey: 'ck_dev_test_key',
				signingSecret: 'signing-secret',
			},
		} as any);

		await setupCorsair(corsair, { silent: true });

		const ack = await processCorsair(
			corsair,
			{
				headers: {},
				body: JSON.stringify({ type: 'connections.sync', payload: {} }),
			},
			{ signingSecret: 'signing-secret' },
		);

		expect(ack.status).toBe('failed');
	});
});
