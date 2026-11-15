import { AuthMissingError } from 'corsair/core';
import type { PostmarkKeyBuilderContext } from './index';
import { postmark, postmarkAuthConfig, postmarkEndpointSchemas } from './index';

const OPERATIONS = [
	'email.send',
	'email.sendBatch',
	'templates.list',
	'templates.get',
	'templates.create',
	'templates.update',
	'templates.delete',
	'templates.validate',
	'server.get',
	'server.update',
	'streams.list',
	'streams.get',
	'streams.archive',
	'bounces.list',
	'bounces.get',
	'bounces.activate',
	'bounces.delivery',
	'stats.overview',
	'stats.sends',
] as const;

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: PostmarkKeyBuilderContext,
	source: string,
) => Promise<string>;

/** Values only cast, never read: the plugin's own types disagree. */
type Untyped = unknown; // unknown: see the note above.

const keyBuilderOf = (candidate: { keyBuilder?: Untyped }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

function keyBuilderContext(apiKey: string | null): PostmarkKeyBuilderContext {
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
	} as Untyped as PostmarkKeyBuilderContext;
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

describe('postmark plugin', () => {
	const plugin = postmark();
	const meta = plugin.endpointMeta as Untyped as Record<string, EndpointMeta>;

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('postmark');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks: Postmark posts to a URL you register, and the plugin does not handle deliveries', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation across six groups', () => {
		const endpoints = plugin.endpoints as Record<string, Untyped>;
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
		expect(Object.keys(endpoints)).toEqual([
			'email',
			'templates',
			'server',
			'streams',
			'bounces',
			'stats',
		]);
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks both send operations destructive, because a send cannot be recalled', () => {
		expect(meta['email.send']?.riskLevel).toBe('destructive');
		expect(meta['email.sendBatch']?.riskLevel).toBe('destructive');
	});

	it('marks the irreversible admin actions destructive', () => {
		expect(meta['templates.delete']?.riskLevel).toBe('destructive');
		expect(meta['streams.archive']?.riskLevel).toBe('destructive');
	});

	it('treats a reactivation and a settings change as writes, since both survive', () => {
		expect(meta['bounces.activate']?.riskLevel).toBe('write');
		expect(meta['server.update']?.riskLevel).toBe('write');
	});

	it('keeps every read-only operation a read', () => {
		for (const path of [
			'templates.list',
			'templates.get',
			'templates.validate',
			'server.get',
			'streams.list',
			'streams.get',
			'bounces.list',
			'bounces.get',
			'bounces.delivery',
			'stats.overview',
			'stats.sends',
		]) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
	});

	it('registers an input and an output schema for every operation', () => {
		const schemas = postmarkEndpointSchemas as Record<
			string,
			{ input?: Untyped; output?: Untyped }
		>;
		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares api_key as the only credential: every route here needs the server token', () => {
		expect(postmarkAuthConfig).toEqual({ api_key: {} });
	});
});

describe('postmark keyBuilder', () => {
	it('prefers the inline key', async () => {
		await expect(
			keyBuilderOf(postmark({ key: 'inline-token' }))(
				keyBuilderContext('stored-token'),
				'endpoint',
			),
		).resolves.toBe('inline-token');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(postmark())(keyBuilderContext('stored-token'), 'endpoint'),
		).resolves.toBe('stored-token');
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		await expect(
			keyBuilderOf(postmark())(keyBuilderContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(postmark({ key: 'inline-token' }))(
				keyBuilderContext('stored-token'),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
