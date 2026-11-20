import { AuthMissingError } from 'corsair/core';
import type { InternalParsioPlugin } from './index';
import { parsio, parsioEndpointSchemas } from './index';

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

describe('parsio plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalParsioPlugin = parsio({});
		expect(instance.id).toBe('parsio');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 21 operations across 4 groups', () => {
		const groups = parsio({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['mailboxes', 6],
			['documents', 8],
			['webhooks', 5],
			['data', 2],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = parsio({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					parsioEndpointSchemas[key as keyof typeof parsioEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks deletes destructive and parses as writes', () => {
		const meta = parsio({}).endpointMeta!;
		for (const key of ['mailboxes.delete', 'webhooks.delete'] as const) {
			expect(meta[key]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
		expect(meta['documents.createSync']).toMatchObject({ riskLevel: 'write' });
		expect(meta['documents.uploadAsync']).toMatchObject({ riskLevel: 'write' });
		expect(meta['documents.get']).toMatchObject({ riskLevel: 'read' });
	});

	it('declares the async import job only on the async operations', () => {
		const meta = parsio({}).endpointMeta!;
		expect(meta['documents.createAsync']?.job).toBeDefined();
		expect(meta['documents.uploadAsync']?.job).toBeDefined();
		expect(meta['documents.createSync']?.job).toBeUndefined();
	});

	it('registers the inbound webhook and its matcher', () => {
		const instance: InternalParsioPlugin = parsio({});
		expect(instance.pluginWebhookMatcher).toBeDefined();
		expect(Object.keys(instance.webhooks ?? {})).toEqual(['parsio']);
	});
});

describe('parsio keyBuilder', () => {
	it('uses the inline key first for endpoints', async () => {
		await expect(
			keyBuilderOf(parsio({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored api key for endpoints', async () => {
		await expect(
			keyBuilderOf(parsio({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(parsio({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('prefers the configured webhook secret for webhook deliveries', async () => {
		await expect(
			keyBuilderOf(parsio({ webhookSecret: 'whsec_inline' }))(
				fixture('whsec_stored'),
				'webhook',
			),
		).resolves.toBe('whsec_inline');
	});

	it('falls back to the stored webhook signature', async () => {
		await expect(keyBuilderOf(parsio({}))(fixture(), 'webhook')).resolves.toBe(
			'whsec_stored',
		);
	});

	it('answers an empty webhook secret when none is stored, so deliveries are rejected, not accepted unverified', async () => {
		await expect(
			keyBuilderOf(parsio({}))(fixture(null, null), 'webhook'),
		).resolves.toBe('');
	});
});
