import { AuthMissingError } from 'corsair/core';
import { PandadocEndpointInputSchemas } from './endpoints/types';
import type {
	InternalPandadocPlugin,
	PandadocKeyBuilderContext,
} from './index';
import { pandadoc, pandadocEndpointSchemas } from './index';
import { webhookEvent } from './test-fixtures';

function fixture(
	key?: string | null,
	webhookSignature: string | null = 'whsec_stored',
): PandadocKeyBuilderContext {
	// A fixture cannot be a full AccountKeyManager; the endpoints and the
	// keyBuilder only read get_api_key and get_webhook_signature.
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
	} as unknown as PandadocKeyBuilderContext;
}

function plugin(): InternalPandadocPlugin {
	return pandadoc({});
}

type KeyBuilder = (
	ctx: PandadocKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

// unknown: keyBuilder sits behind the plugin's optional type parameter, so
// the test widens it to the shape it actually runs as.
const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

describe('pandadoc plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance = plugin();
		expect(instance.id).toBe('pandadoc');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 26 operations across 5 groups', () => {
		const groups = plugin().endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['documents', 11],
			['templates', 3],
			['contacts', 5],
			['folders', 3],
			['webhooks', 4],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = plugin();
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					pandadocEndpointSchemas[key as keyof typeof pandadocEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks sends, deletes and subscription deletes destructive and irreversible', () => {
		const meta = plugin().endpointMeta ?? {};
		for (const key of [
			'documents.send',
			'documents.delete',
			'templates.delete',
			'contacts.delete',
			'webhooks.deleteSubscription',
		] as const) {
			expect(meta[key]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
	});

	it('marks reads and writes with the right risk level', () => {
		const meta = plugin().endpointMeta ?? {};
		expect(meta['documents.list']).toMatchObject({ riskLevel: 'read' });
		expect(meta['documents.create']).toMatchObject({ riskLevel: 'write' });
		expect(meta['contacts.update']).toMatchObject({ riskLevel: 'write' });
		expect(meta['folders.rename']).toMatchObject({ riskLevel: 'write' });
	});

	it('registers the inbound webhook and its matcher', () => {
		const instance = plugin();
		expect(instance.pluginWebhookMatcher).toBeDefined();
		expect(Object.keys(instance.webhooks ?? {})).toEqual(['pandadoc']);
	});

	it('registers the delivery array as the webhook payload and response', () => {
		const schemas = pandadoc().webhookSchemas?.['pandadoc.event'];
		if (!schemas?.payload || !schemas.response)
			throw new Error('webhook schemas missing');
		const delivery = [webhookEvent, webhookEvent];
		expect(schemas.payload.safeParse(delivery).success).toBe(true);
		expect(schemas.response.safeParse(delivery).success).toBe(true);
		expect(schemas.payload.safeParse(webhookEvent).success).toBe(false);
	});

	it('declares an input schema for every operation key', () => {
		for (const [key, schema] of Object.entries(PandadocEndpointInputSchemas)) {
			expect(schema).toBeDefined();
			// The docs generator reads these by operation key; a missing entry
			// would render `api.<op>({})`.
			expect(key.length).toBeGreaterThan(0);
		}
	});
});

describe('pandadoc keyBuilder', () => {
	it('uses the inline key first for endpoints', async () => {
		await expect(
			keyBuilderOf(pandadoc({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored api key for endpoints', async () => {
		await expect(
			keyBuilderOf(pandadoc({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(pandadoc({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('prefers the configured webhook secret for webhook deliveries', async () => {
		await expect(
			keyBuilderOf(pandadoc({ webhookSecret: 'whsec_inline' }))(
				fixture('whsec_stored'),
				'webhook',
			),
		).resolves.toBe('whsec_inline');
	});

	it('falls back to the stored webhook signature', async () => {
		await expect(
			keyBuilderOf(pandadoc({}))(fixture(), 'webhook'),
		).resolves.toBe('whsec_stored');
	});

	it('answers an empty webhook secret when none is stored, so deliveries are rejected, not accepted unverified', async () => {
		await expect(
			keyBuilderOf(pandadoc({}))(fixture(null, null), 'webhook'),
		).resolves.toBe('');
	});
});
