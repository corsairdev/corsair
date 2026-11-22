import { AuthMissingError } from 'corsair/core';
import type { InternalPasscreatorPlugin } from './index';
import { passcreator, passcreatorEndpointSchemas } from './index';

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

describe('passcreator plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalPasscreatorPlugin = passcreator({});
		expect(instance.id).toBe('passcreator');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 21 operations across 3 groups', () => {
		const groups = passcreator({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['passes', 12],
			['templates', 5],
			['webhooks', 4],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = passcreator({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					passcreatorEndpointSchemas[
						key as keyof typeof passcreatorEndpointSchemas
					],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks deletes, pushes and emails destructive and irreversible', () => {
		const meta = passcreator({}).endpointMeta!;
		for (const key of [
			'passes.delete',
			'passes.pushNotification',
			'passes.sendEmail',
			'templates.delete',
			'webhooks.unsubscribe',
		] as const) {
			expect(meta[key]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
	});

	it('marks reads and writes with the right risk level', () => {
		const meta = passcreator({}).endpointMeta!;
		expect(meta['passes.get']).toMatchObject({ riskLevel: 'read' });
		expect(meta['passes.create']).toMatchObject({ riskLevel: 'write' });
		expect(meta['templates.copy']).toMatchObject({ riskLevel: 'write' });
		expect(meta['webhooks.subscribe']).toMatchObject({ riskLevel: 'write' });
	});

	it('registers the inbound webhook and its matcher', () => {
		const instance: InternalPasscreatorPlugin = passcreator({});
		expect(instance.pluginWebhookMatcher).toBeDefined();
		expect(Object.keys(instance.webhooks ?? {})).toEqual(['passcreator']);
	});
});

describe('passcreator keyBuilder', () => {
	it('uses the inline key first for endpoints', async () => {
		await expect(
			keyBuilderOf(passcreator({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored api key for endpoints', async () => {
		await expect(
			keyBuilderOf(passcreator({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(passcreator({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('prefers the configured public key for webhook deliveries', async () => {
		await expect(
			keyBuilderOf(passcreator({ webhookSecret: 'pem_inline' }))(
				fixture('pem_stored'),
				'webhook',
			),
		).resolves.toBe('pem_inline');
	});

	it('falls back to the stored webhook signature', async () => {
		await expect(
			keyBuilderOf(passcreator({}))(fixture(), 'webhook'),
		).resolves.toBe('whsec_stored');
	});

	it('answers an empty webhook key when none is stored, so deliveries are rejected, not accepted unverified', async () => {
		await expect(
			keyBuilderOf(passcreator({}))(fixture(null, null), 'webhook'),
		).resolves.toBe('');
	});
});
