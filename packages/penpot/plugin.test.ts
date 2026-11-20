import { AuthMissingError } from 'corsair/core';
import type { InternalPenpotPlugin } from './index';
import { penpot, penpotEndpointSchemas } from './index';

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

describe('penpot plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalPenpotPlugin = penpot({});
		expect(instance.id).toBe('penpot');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 32 operations across 6 groups', () => {
		const groups = penpot({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['teams', 4],
			['projects', 6],
			['files', 10],
			['comments', 5],
			['webhooks', 4],
			['accessTokens', 3],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = penpot({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					penpotEndpointSchemas[key as keyof typeof penpotEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks deletes destructive and irreversible', () => {
		const meta = penpot({}).endpointMeta!;
		for (const key of [
			'teams.delete',
			'projects.delete',
			'files.delete',
			'files.snapshotsDelete',
			'webhooks.delete',
			'accessTokens.delete',
		] as const) {
			expect(meta[key]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
	});

	it('registers the inbound webhook and its matcher', () => {
		const instance: InternalPenpotPlugin = penpot({});
		expect(instance.pluginWebhookMatcher).toBeDefined();
		expect(Object.keys(instance.webhooks ?? {})).toEqual(['penpot']);
	});
});

describe('penpot keyBuilder', () => {
	it('uses the inline key first for endpoints', async () => {
		await expect(
			keyBuilderOf(penpot({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored api key for endpoints', async () => {
		await expect(
			keyBuilderOf(penpot({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(penpot({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});

	it('answers the configured webhook secret for webhook deliveries', async () => {
		await expect(
			keyBuilderOf(penpot({ webhookSecret: 'whsec_inline' }))(
				fixture('whsec_stored'),
				'webhook',
			),
		).resolves.toBe('whsec_inline');
	});

	it('falls back to the stored webhook signature', async () => {
		await expect(keyBuilderOf(penpot({}))(fixture(), 'webhook')).resolves.toBe(
			'whsec_stored',
		);
	});

	it('answers an empty webhook secret when none is stored', async () => {
		await expect(
			keyBuilderOf(penpot({}))(fixture(null, null), 'webhook'),
		).resolves.toBe('');
	});
});
