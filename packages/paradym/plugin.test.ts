import { AuthMissingError } from 'corsair/core';
import type { InternalParadymPlugin, ParadymKeyBuilderContext } from './index';
import { paradym, paradymEndpointSchemas } from './index';

type KeyBuilder = (
	ctx: ParadymKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

const keyBuilderOf = (candidate: {
	// unknown: keyBuilder sits behind the plugin's optional type parameter, so
	// the test widens it to the shape it actually runs as.
	keyBuilder?: unknown;
}): KeyBuilder => candidate.keyBuilder as KeyBuilder;

function fixture(
	key?: string | null,
	walletId: string | null = 'wallet_stored',
	webhookSignature: string | null = 'whsec_stored',
): ParadymKeyBuilderContext {
	// unknown: the runtime key manager carries many more methods than the
	// fixture implements, so the object is widened through unknown.
	return {
		authType: 'api_key',
		key: undefined,
		keys: {
			get_api_key: () => Promise.resolve(key ?? null),
			get_wallet_id: () => Promise.resolve(walletId),
			get_webhook_signature: () => Promise.resolve(webhookSignature),
		},
		tenantId: 'default',
		// unknown: the runtime key manager carries many more methods than the
		// fixture implements, so the object is widened through unknown.
	} as unknown as ParadymKeyBuilderContext;
}

describe('paradym plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalParadymPlugin = paradym({});
		expect(instance.id).toBe('paradym');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 33 operations across 8 groups', () => {
		const groups = paradym({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['wallets', 4],
			['credentialTemplates', 6],
			['presentationTemplates', 5],
			['issuance', 3],
			['verification', 4],
			['revocation', 1],
			['trustedEntities', 4],
			['webhooks', 6],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = paradym({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					paradymEndpointSchemas[key as keyof typeof paradymEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks archives, deletes and revocation destructive and irreversible', () => {
		const meta = paradym({}).endpointMeta!;
		for (const key of [
			'credentialTemplates.archive',
			'presentationTemplates.archive',
			'revocation.batch',
			'trustedEntities.delete',
			'webhooks.deleteSubscription',
		] as const) {
			expect(meta[key]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
	});

	it('marks writes that are not destructive as write', () => {
		const meta = paradym({}).endpointMeta!;
		expect(meta['wallets.create']).toMatchObject({ riskLevel: 'write' });
		expect(meta['issuance.createOffer']).toMatchObject({ riskLevel: 'write' });
		expect(meta['verification.createRequest']).toMatchObject({
			riskLevel: 'write',
		});
		expect(meta['webhooks.redeliverDelivery']).toMatchObject({
			riskLevel: 'write',
		});
	});

	it('registers the inbound webhook and its matcher', () => {
		const instance = paradym({});
		expect(instance.pluginWebhookMatcher).toBeDefined();
		expect(Object.keys(instance.webhooks ?? {})).toEqual(['paradym']);
	});
});

describe('paradym keyBuilder', () => {
	it('uses the inline key first for endpoints', async () => {
		await expect(
			keyBuilderOf(paradym({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored api key', async () => {
		await expect(
			keyBuilderOf(paradym({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when a key exists but no wallet id is configured', async () => {
		await expect(
			keyBuilderOf(paradym({}))(fixture('stored-key', null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('accepts a wallet id from the options instead of the account', async () => {
		const options = {
			key: 'inline-key',
			walletId: 'wallet_option',
		};
		await expect(
			keyBuilderOf(paradym(options))(fixture('stored-key', null), 'endpoint'),
		).resolves.toBe('inline-key');
	});

	it('throws AuthMissingError when neither key nor wallet exist', async () => {
		await expect(
			keyBuilderOf(paradym({}))(fixture(null, null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('prefers the configured webhook secret for webhook deliveries', async () => {
		await expect(
			keyBuilderOf(paradym({ webhookSecret: 'whsec_inline' }))(
				fixture('whsec_stored'),
				'webhook',
			),
		).resolves.toBe('whsec_inline');
	});

	it('falls back to the stored webhook signature', async () => {
		await expect(keyBuilderOf(paradym({}))(fixture(), 'webhook')).resolves.toBe(
			'whsec_stored',
		);
	});

	it('answers an empty webhook secret when none is stored, so deliveries are rejected, not accepted unverified', async () => {
		await expect(
			keyBuilderOf(paradym({}))(fixture(null, null, null), 'webhook'),
		).resolves.toBe('');
	});
});
