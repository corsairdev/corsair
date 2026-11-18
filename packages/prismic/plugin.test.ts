import { AuthMissingError } from 'corsair/core';
import type { PrismicKeyBuilderContext } from './index';
import { prismic, prismicAuthConfig, prismicEndpointSchemas } from './index';

const OPERATIONS = [
	'repository.info',
	'documents.search',
	'documents.get',
	'migration.create',
	'migration.update',
] as const;

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: PrismicKeyBuilderContext,
	source: string,
) => Promise<string>;

/** Values only cast, never read: the plugin's own types disagree. */
type Untyped = unknown; // unknown: see the note above.

const keyBuilderOf = (candidate: { keyBuilder?: Untyped }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

function keyBuilderContext(apiKey: string | null): PrismicKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		tenantId: 'default',
		keys: {
			get_dek: async () => 'dek',
			issue_new_dek: async () => 'dek',
			get_api_key: async () => apiKey,
			set_api_key: async () => {},
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => {},
		},
	} as Untyped as PrismicKeyBuilderContext;
}

/** Every dot-notation path in the nested endpoint tree. */
function flatten(endpoints: Record<string, Untyped>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, Untyped>)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('prismic plugin', () => {
	const plugin = prismic();
	const meta = plugin.endpointMeta as Untyped as Record<string, EndpointMeta>;

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('prismic');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks: Prismic publishes through its own API, not deliveries', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation across three groups', () => {
		const endpoints = plugin.endpoints as Record<string, Untyped>;
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
		expect(Object.keys(endpoints)).toEqual([
			'repository',
			'documents',
			'migration',
		]);
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks only the migration writes as writes, since they change content', () => {
		expect(meta['migration.create']?.riskLevel).toBe('write');
		expect(meta['migration.update']?.riskLevel).toBe('write');
	});

	it('keeps every Content API operation a read', () => {
		for (const path of [
			'repository.info',
			'documents.search',
			'documents.get',
		]) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
	});

	it('registers an input and an output schema for every operation', () => {
		const schemas = prismicEndpointSchemas as Record<
			string,
			{ input?: Untyped; output?: Untyped }
		>;
		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('stores the repository and access token on each account, beside the write token', () => {
		// Hub serves many accounts from one plugin, so a code option cannot hold
		// a tenant's repository.
		expect(prismicAuthConfig).toEqual({
			api_key: { account: ['repository', 'access_token'] },
		});
	});
});

describe('prismic keyBuilder', () => {
	it('prefers the inline key', async () => {
		await expect(
			keyBuilderOf(prismic({ key: 'inline-token' }))(
				keyBuilderContext('stored-token'),
				'endpoint',
			),
		).resolves.toBe('inline-token');
	});

	it('takes writeToken as the inline key too', async () => {
		await expect(
			keyBuilderOf(prismic({ writeToken: 'inline-write-token' }))(
				keyBuilderContext('stored-token'),
				'endpoint',
			),
		).resolves.toBe('inline-write-token');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(prismic())(keyBuilderContext('stored-token'), 'endpoint'),
		).resolves.toBe('stored-token');
	});

	it('returns empty for an endpoint with no token, so a public repository reads', async () => {
		// The write token is only needed by `migration.*`, so an absent one must not
		// stop a read.
		await expect(
			keyBuilderOf(prismic())(keyBuilderContext(null), 'endpoint'),
		).resolves.toBe('');
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(prismic({ key: 'inline-token' }))(
				keyBuilderContext('stored-token'),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
