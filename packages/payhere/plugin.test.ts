import { AuthMissingError } from 'corsair/core';
import type { InternalPayherePlugin } from './index';
import { payhere, payhereEndpointSchemas } from './index';

type KeyBuilder = (
	ctx: {
		authType: string;
		keys: {
			get_api_key: () => Promise<string | null>;
			get_webhook_signature: () => Promise<string | null>;
		};
	},
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

const keyBuilderOf = (candidate: {
	// unknown: keyBuilder sits behind the plugin's optional type parameter, so
	// the test widens it to the shape it actually runs as.
	keyBuilder?: unknown;
}): KeyBuilder => candidate.keyBuilder as KeyBuilder;

function fixture(
	key?: string | null,
	webhookSignature: string | null = 'whsec_stored',
) {
	// unknown: the runtime key manager carries many more methods than the
	// fixture implements, so the object is widened through unknown.
	return {
		authType: 'api_key',
		key: undefined,
		keys: {
			get_api_key: () => Promise.resolve(key ?? null),
			get_webhook_signature: () => Promise.resolve(webhookSignature),
		},
		tenantId: 'default',
		// unknown: the runtime key manager carries many more methods than the
		// fixture implements, so the object is widened through unknown.
	} as unknown as Parameters<KeyBuilder>[0];
}

describe('payhere plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalPayherePlugin = payhere({});
		expect(instance.id).toBe('payhere');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 9 operations across 7 groups', () => {
		const groups = payhere({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['user', 1],
			['company', 2],
			['customers', 2],
			['payments', 1],
			['plans', 1],
			['subscriptions', 1],
			['refunds', 1],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = payhere({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					payhereEndpointSchemas[key as keyof typeof payhereEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks the refund destructive and irreversible', () => {
		const meta = payhere({}).endpointMeta!;
		expect(meta['refunds.create']).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
		expect(meta['payments.list']).toMatchObject({ riskLevel: 'read' });
	});

	it('registers the inbound webhook and its matcher', () => {
		const instance: InternalPayherePlugin = payhere({});
		expect(instance.pluginWebhookMatcher).toBeDefined();
		expect(Object.keys(instance.webhooks ?? {})).toEqual(['payhere']);
	});
});

describe('payhere keyBuilder', () => {
	it('uses the inline key first for endpoints', async () => {
		await expect(
			keyBuilderOf(payhere({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored api key for endpoints', async () => {
		await expect(
			keyBuilderOf(payhere({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(payhere({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('prefers the configured webhook secret for webhook deliveries', async () => {
		await expect(
			keyBuilderOf(payhere({ webhookSecret: 'whsec_inline' }))(
				fixture('whsec_stored'),
				'webhook',
			),
		).resolves.toBe('whsec_inline');
	});

	it('falls back to the stored webhook signature', async () => {
		await expect(keyBuilderOf(payhere({}))(fixture(), 'webhook')).resolves.toBe(
			'whsec_stored',
		);
	});

	it('answers an empty webhook secret when none is stored, so deliveries are rejected, not accepted unverified', async () => {
		await expect(
			keyBuilderOf(payhere({}))(fixture(null, null), 'webhook'),
		).resolves.toBe('');
	});
});
