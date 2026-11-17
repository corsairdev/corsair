import { AuthMissingError } from 'corsair/core';
import type { PostizKeyBuilderContext } from './index';
import { postiz, postizAuthConfig, postizEndpointSchemas } from './index';

const OPERATIONS = [
	'integrations.list',
	'integrations.isConnected',
	'integrations.findSlot',
	'posts.list',
	'posts.create',
	'posts.delete',
	'posts.changeStatus',
	'media.list',
	'media.uploadFromUrl',
	'notifications.list',
	'analytics.platform',
] as const;

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: PostizKeyBuilderContext,
	source: string,
) => Promise<string>;

/** A value only cast, never read: the plugin's own types disagree. */
type Untyped = unknown; // unknown: see the note above.

const keyBuilderOf = (candidate: { keyBuilder?: Untyped }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

function keyBuilderContext(apiKey: string | null): PostizKeyBuilderContext {
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
	} as Untyped as PostizKeyBuilderContext;
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

describe('postiz plugin', () => {
	const plugin = postiz();
	const meta = plugin.endpointMeta as Untyped as Record<string, EndpointMeta>;

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('postiz');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks: Postiz notifies external systems, and this plugin does not handle them', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation across five groups', () => {
		const endpoints = plugin.endpoints as Record<string, Untyped>;
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
		expect(Object.keys(endpoints)).toEqual([
			'integrations',
			'posts',
			'media',
			'notifications',
			'analytics',
		]);
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks publishing and deleting destructive, because neither can be undone', () => {
		expect(meta['posts.create']?.riskLevel).toBe('destructive');
		expect(meta['posts.delete']?.riskLevel).toBe('destructive');
	});

	it('marks a status change destructive, because scheduling queues a post to publish', () => {
		expect(meta['posts.changeStatus']?.riskLevel).toBe('destructive');
	});

	it('treats an upload as a write, since it only stores a file', () => {
		expect(meta['media.uploadFromUrl']?.riskLevel).toBe('write');
	});

	it('keeps every read-only operation a read', () => {
		for (const path of [
			'integrations.list',
			'integrations.isConnected',
			'integrations.findSlot',
			'posts.list',
			'media.list',
			'notifications.list',
			'analytics.platform',
		]) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
	});

	it('registers an input and an output schema for every operation', () => {
		const schemas = postizEndpointSchemas as Record<
			string,
			{ input?: Untyped; output?: Untyped }
		>;
		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares an api_key with an optional self-hosted base_url per account', () => {
		expect(postizAuthConfig).toEqual({ api_key: { account: ['base_url'] } });
	});
});

describe('postiz keyBuilder', () => {
	it('prefers the inline key', async () => {
		await expect(
			keyBuilderOf(postiz({ key: 'inline-key' }))(
				keyBuilderContext('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(postiz())(keyBuilderContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		await expect(
			keyBuilderOf(postiz())(keyBuilderContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(postiz({ key: 'inline-key' }))(
				keyBuilderContext('stored-key'),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
