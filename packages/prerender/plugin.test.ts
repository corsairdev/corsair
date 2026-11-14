import { AuthMissingError } from 'corsair/core';
import type { PrerenderKeyBuilderContext } from './index';
import {
	prerender,
	prerenderAuthConfig,
	prerenderEndpointSchemas,
} from './index';

const OPERATIONS = [
	'cache.recache',
	'cache.search',
	'cache.sitemap',
	'cache.clear',
	'cache.clearStatus',
	'queue.changeSpeed',
] as const;

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: PrerenderKeyBuilderContext,
	source: string,
) => Promise<string>;

/** Values only cast, never read: the plugin's own types disagree. */
type Untyped = unknown; // unknown: see the note above.

const keyBuilderOf = (candidate: { keyBuilder?: Untyped }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

function keyBuilderContext(apiKey: string | null): PrerenderKeyBuilderContext {
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
	} as Untyped as PrerenderKeyBuilderContext;
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

describe('prerender plugin', () => {
	const plugin = prerender();
	const meta = plugin.endpointMeta as Untyped as Record<string, EndpointMeta>;

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('prerender');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks: Prerender sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation', () => {
		const endpoints = plugin.endpoints as Record<string, Untyped>;
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks only the cache clear destructive, since it deletes cached pages', () => {
		expect(meta['cache.clear']?.riskLevel).toBe('destructive');
	});

	it('treats a recache, a sitemap submit and a speed change as writes', () => {
		// Each changes provider state but can be repeated or reversed.
		expect(meta['cache.recache']?.riskLevel).toBe('write');
		expect(meta['cache.sitemap']?.riskLevel).toBe('write');
		expect(meta['queue.changeSpeed']?.riskLevel).toBe('write');
	});

	it('keeps the two read operations a read', () => {
		expect(meta['cache.search']?.riskLevel).toBe('read');
		expect(meta['cache.clearStatus']?.riskLevel).toBe('read');
	});

	it('registers an input and an output schema for every operation', () => {
		const schemas = prerenderEndpointSchemas as Record<
			string,
			{ input?: Untyped; output?: Untyped }
		>;
		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares api_key as the only credential, which is all Prerender needs', () => {
		expect(prerenderAuthConfig).toEqual({ api_key: {} });
	});
});

describe('prerender keyBuilder', () => {
	it('prefers the inline key', async () => {
		await expect(
			keyBuilderOf(prerender({ key: 'inline-token' }))(
				keyBuilderContext('stored-token'),
				'endpoint',
			),
		).resolves.toBe('inline-token');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(prerender())(keyBuilderContext('stored-token'), 'endpoint'),
		).resolves.toBe('stored-token');
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		await expect(
			keyBuilderOf(prerender())(keyBuilderContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(prerender({ key: 'inline-token' }))(
				keyBuilderContext('stored-token'),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
