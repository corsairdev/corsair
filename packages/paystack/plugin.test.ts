import { AuthMissingError } from 'corsair/core';
import type { InternalPaystackPlugin } from './index';
import { paystack, paystackEndpointSchemas } from './index';

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
	webhookSignature: string | null = 'sk_stored',
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

describe('paystack plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalPaystackPlugin = paystack({});
		expect(instance.id).toBe('paystack');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 21 operations across 5 groups', () => {
		const groups = paystack({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['transactions', 4],
			['customers', 5],
			['plans', 4],
			['subscriptions', 5],
			['refunds', 3],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = paystack({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					paystackEndpointSchemas[key as keyof typeof paystackEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks the refund destructive, sends and writes appropriately', () => {
		const meta = paystack({}).endpointMeta!;
		expect(meta['refunds.create']).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
		expect(meta['transactions.initialize']).toMatchObject({
			riskLevel: 'write',
		});
		expect(meta['subscriptions.disable']).toMatchObject({ riskLevel: 'write' });
		// Both start or resume debits of the customer's saved card.
		expect(meta['subscriptions.create']).toMatchObject({
			riskLevel: 'destructive',
		});
		expect(meta['subscriptions.enable']).toMatchObject({
			riskLevel: 'destructive',
		});
		expect(meta['transactions.list']).toMatchObject({ riskLevel: 'read' });
	});

	it('registers the inbound webhook and its matcher', () => {
		const instance: InternalPaystackPlugin = paystack({});
		expect(instance.pluginWebhookMatcher).toBeDefined();
		expect(Object.keys(instance.webhooks ?? {})).toEqual(['paystack']);
	});
});

describe('paystack keyBuilder', () => {
	it('uses the inline key first for endpoints', async () => {
		await expect(
			keyBuilderOf(paystack({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored api key for endpoints', async () => {
		await expect(
			keyBuilderOf(paystack({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(paystack({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('prefers the configured webhook secret for webhook deliveries', async () => {
		await expect(
			keyBuilderOf(paystack({ webhookSecret: 'whsec_inline' }))(
				fixture('sk_stored'),
				'webhook',
			),
		).resolves.toBe('whsec_inline');
	});

	it('falls back to the stored webhook signature', async () => {
		await expect(
			keyBuilderOf(paystack({}))(fixture(), 'webhook'),
		).resolves.toBe('sk_stored');
	});

	it('answers an empty webhook secret when none is stored, so deliveries are rejected, not accepted unverified', async () => {
		await expect(
			keyBuilderOf(paystack({}))(fixture(null, null), 'webhook'),
		).resolves.toBe('');
	});
});
