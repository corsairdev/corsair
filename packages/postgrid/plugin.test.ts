import { AuthMissingError } from 'corsair/core';
import type { PostgridKeyBuilderContext } from './index';
import { postgrid, postgridAuthConfig, postgridEndpointSchemas } from './index';

const OPERATIONS = [
	'contacts.list',
	'contacts.get',
	'contacts.create',
	'contacts.delete',
	'templates.list',
	'templates.get',
	'templates.create',
	'templates.update',
	'templates.delete',
	'letters.list',
	'letters.get',
	'letters.create',
	'letters.cancel',
	'postcards.list',
	'postcards.get',
	'postcards.create',
	'postcards.cancel',
	'selfMailers.list',
	'selfMailers.get',
	'selfMailers.create',
	'trackers.get',
] as const;

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: PostgridKeyBuilderContext,
	source: string,
) => Promise<string>;

/** A value only cast, never read: the plugin's own types disagree. */
type Untyped = unknown; // unknown: see the note above.

const keyBuilderOf = (candidate: { keyBuilder?: Untyped }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

function keyBuilderContext(apiKey: string | null): PostgridKeyBuilderContext {
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
	} as Untyped as PostgridKeyBuilderContext;
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

describe('postgrid plugin', () => {
	const plugin = postgrid();
	const meta = plugin.endpointMeta as Untyped as Record<string, EndpointMeta>;

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('postgrid');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks: PostGrid posts to a URL you register, and the plugin does not handle deliveries', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation across six groups', () => {
		const endpoints = plugin.endpoints as Record<string, Untyped>;
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
		expect(Object.keys(endpoints)).toEqual([
			'contacts',
			'templates',
			'letters',
			'postcards',
			'selfMailers',
			'trackers',
		]);
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks every order creation destructive, because it spends postage', () => {
		for (const path of [
			'letters.create',
			'postcards.create',
			'selfMailers.create',
		]) {
			expect(meta[path]?.riskLevel).toBe('destructive');
		}
	});

	it('marks a cancellation destructive, because it cannot be undone', () => {
		for (const path of ['letters.cancel', 'postcards.cancel']) {
			expect(meta[path]?.riskLevel).toBe('destructive');
		}
	});

	it('keeps deletes and every read at their real risk level', () => {
		expect(meta['contacts.delete']?.riskLevel).toBe('destructive');
		expect(meta['templates.delete']?.riskLevel).toBe('destructive');
		// A contact save is reversible; it only stores an address.
		expect(meta['contacts.create']?.riskLevel).toBe('write');
		for (const path of [
			'contacts.list',
			'contacts.get',
			'templates.list',
			'templates.get',
			'letters.list',
			'letters.get',
			'postcards.list',
			'postcards.get',
			'selfMailers.list',
			'selfMailers.get',
			'trackers.get',
		]) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
	});

	it('registers an input and an output schema for every operation', () => {
		const schemas = postgridEndpointSchemas as Record<
			string,
			{ input?: Untyped; output?: Untyped }
		>;
		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares api_key as the only credential, which is all PostGrid needs', () => {
		expect(postgridAuthConfig).toEqual({ api_key: {} });
	});
});

describe('postgrid keyBuilder', () => {
	it('prefers the inline key', async () => {
		await expect(
			keyBuilderOf(postgrid({ key: 'inline-key' }))(
				keyBuilderContext('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(postgrid())(keyBuilderContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		await expect(
			keyBuilderOf(postgrid())(keyBuilderContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(postgrid({ key: 'inline-key' }))(
				keyBuilderContext('stored-key'),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
