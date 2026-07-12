import { createCorsair } from '../core';
import { InvalidCorsairInstanceError } from '../core/utils/corsair-instance';
import { CLIENT_BRIDGE_MESSAGE_TYPE } from '../hub/browser-delivery-html';
import { isConnectionsSyncRetryableError } from '../hub/connections-sync-delivery';
import { handleHubDeliveryGet, handleHubDeliveryPost } from '../hub/delivery';
import { resetDeliveryReplayGuardForTests } from '../hub/internal/delivery-replay-guard';
import { signBrowserDeliveryToken } from '../hub/signing/browser-delivery';
import {
	extractSyncFromDeliveryAck,
	parseServerDeliveryAckBody,
	parseSyncFromDeliveryBody,
	signDeliveryEnvelope,
} from '../hub/signing/envelope';
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

	it('parses sync delivery body through the ack contract', () => {
		const encrypted = encryptSyncManifest(manifest, 'signing-secret');
		const raw = JSON.stringify({ status: 'ok', sync: { encrypted } });

		const parsed = parseSyncDeliveryBody(raw);
		expect(parsed?.encrypted).toBe(encrypted);

		const ack = parseServerDeliveryAckBody(raw);
		expect(extractSyncFromDeliveryAck(ack)?.encrypted).toBe(encrypted);
		expect(parseSyncFromDeliveryBody(raw)?.encrypted).toBe(encrypted);
	});
});

describe('isConnectionsSyncRetryableError', () => {
	it('marks configuration errors as non-retryable', () => {
		expect(
			isConnectionsSyncRetryableError(
				new Error(
					'A database must be configured to sync connections from the app',
				),
			),
		).toBe(false);
	});

	it('marks InvalidCorsairInstanceError as non-retryable', () => {
		expect(
			isConnectionsSyncRetryableError(new InvalidCorsairInstanceError()),
		).toBe(false);
		expect(
			isConnectionsSyncRetryableError(new Error('Invalid corsair instance')),
		).toBe(false);
	});

	it('marks setupCorsair invalid-instance errors as non-retryable', () => {
		expect(
			isConnectionsSyncRetryableError(
				new Error('setupCorsair: invalid corsair instance'),
			),
		).toBe(false);
	});

	it('marks transient failures as retryable', () => {
		expect(isConnectionsSyncRetryableError(new Error('SQLITE_BUSY'))).toBe(
			true,
		);
	});
});

describe('processCorsair — connections.sync', () => {
	let env: ReturnType<typeof createTestDatabase>;

	beforeEach(async () => {
		resetDeliveryReplayGuardForTests();
		env = createTestDatabase();
	});

	afterEach(() => env.cleanup());

	it('returns encrypted manifest via webhookResponse ack contract', async () => {
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
		expect(ack.webhookResponse?.body).toMatchObject({
			status: 'ok',
			sync: { encrypted: expect.any(String) },
		});

		const responseBody = ack.webhookResponse?.body as {
			sync?: { encrypted?: string };
		};
		const manifest = decryptSyncManifest(
			responseBody.sync!.encrypted!,
			'signing-secret',
		);
		expect(manifest.tenants.some((tenant) => tenant.id === 'default')).toBe(
			true,
		);
		expect(manifest.plugins.some((plugin) => plugin.id === 'slack')).toBe(true);
	});

	it('surfaces sync payload through handleHubDeliveryPost', async () => {
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

		const result = await handleHubDeliveryPost(corsair, {
			headers,
			body,
		});

		expect(result.type).toBe('json');
		if (result.type !== 'json') return;

		const ack = parseServerDeliveryAckBody(JSON.stringify(result.body));
		expect(extractSyncFromDeliveryAck(ack)?.encrypted).toBeTruthy();
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
		expect(ack.retryable).toBe(false);
	});

	it('marks missing database configuration as non-retryable', async () => {
		const corsair = createCorsair({
			plugins: [slackOAuth],
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

		expect(ack.status).toBe('failed');
		expect(ack.retryable).toBe(false);
	});

	it('returns encrypted manifest via browser delivery client bridge', async () => {
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

		const requestId = 'sync-request-1';
		const token = signBrowserDeliveryToken(
			{
				connectJti: requestId,
				projectId: 'proj_test',
				plugin: 'connections.sync',
				tenantId: '*',
				hubSuccessUrl: 'http://localhost:3000',
				deliveryMode: 'connections.sync',
				hubOrigin: 'http://localhost:3000',
				requestId,
			},
			'signing-secret',
		);

		const result = await handleHubDeliveryGet(
			corsair,
			`http://localhost:3001/api/corsair?d=${encodeURIComponent(token)}`,
		);

		expect(result.type).toBe('text');
		if (result.type !== 'text' || !result.body) return;

		expect(result.body).toContain(CLIENT_BRIDGE_MESSAGE_TYPE);
		expect(result.body).toContain(requestId);

		const messageMatch = result.body.match(/var message = (\{.*?\});/s);
		expect(messageMatch?.[1]).toBeTruthy();
		const message = JSON.parse(messageMatch![1]!) as {
			ok: boolean;
			body: { sync?: { encrypted?: string } };
		};
		expect(message.ok).toBe(true);
		expect(message.body.sync?.encrypted).toBeTruthy();

		const manifest = decryptSyncManifest(
			message.body.sync!.encrypted!,
			'signing-secret',
		);
		expect(manifest.plugins.some((plugin) => plugin.id === 'slack')).toBe(true);
	});
});
