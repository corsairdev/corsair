import { AuthMissingError } from 'corsair/core';
import type { PolygonKeyBuilderContext } from './index';
import { polygon, polygonAuthConfig, polygonEndpointSchemas } from './index';

const OPERATIONS = [
	'customers.list',
	'customers.get',
	'customers.create',
	'customers.update',
	'customers.delete',
	'wallets.list',
	'wallets.get',
	'wallets.create',
	'wallets.balance',
	'networks.list',
	'quotes.create',
	'quotes.get',
	'transactions.list',
	'transactions.get',
	'transactions.create',
	'webhooks.list',
	'webhooks.get',
	'webhooks.create',
	'webhooks.update',
	'webhooks.delete',
	'cashLocations.list',
] as const;

/** A value only cast, never read directly: the plugin types disagree. */
type Untyped = unknown; // unknown: see the note above.

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: PolygonKeyBuilderContext,
	source: string,
) => Promise<string>;

const keyBuilderOf = (candidate: { keyBuilder?: Untyped }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

function keyBuilderContext(apiKey: string | null): PolygonKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		tenantId: 'default',
		keys: {
			get_dek: async () => 'dek',
			issue_new_dek: async () => 'dek',
			get_api_key: async () => apiKey,
			set_api_key: async () => {},
			get_api_secret: async () => 'stored-secret',
			set_api_secret: async () => {},
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => {},
		},
		// Only the fields above are read, and the real manager carries more.
	} as Untyped as PolygonKeyBuilderContext;
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

describe('polygon plugin', () => {
	const plugin = polygon();
	const meta = plugin.endpointMeta as Untyped as Record<string, EndpointMeta>;

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('polygon');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks: it registers endpoints, but deliveries are not handled', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation across seven groups', () => {
		const endpoints = plugin.endpoints as Record<string, unknown>; // unknown: names only.
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
		expect(Object.keys(endpoints)).toEqual([
			'customers',
			'wallets',
			'networks',
			'quotes',
			'transactions',
			'webhooks',
			'cashLocations',
		]);
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks only the irreversible operation destructive and irreversible', () => {
		// Moving money is the one step a caller cannot undo.
		expect(meta['transactions.create']?.riskLevel).toBe('destructive');
		expect(meta['customers.delete']?.riskLevel).toBe('destructive');
		expect(meta['webhooks.delete']?.riskLevel).toBe('destructive');
		for (const path of [
			'customers.list',
			'customers.get',
			'wallets.list',
			'wallets.get',
			'wallets.balance',
			'networks.list',
			'quotes.get',
			'transactions.list',
			'transactions.get',
			'webhooks.list',
			'webhooks.get',
			'cashLocations.list',
		]) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
	});

	it('treats a quote as a write, not a read, because it locks pricing', () => {
		expect(meta['quotes.create']?.riskLevel).toBe('write');
	});

	it('registers an input and an output schema for every operation', () => {
		// Entries are only checked for presence, never parsed.
		const schemas = polygonEndpointSchemas as Record<
			string,
			{ input?: Untyped; output?: Untyped }
		>;
		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares api_secret as an account field, so the key manager creates its accessor', () => {
		// The account key manager only generates accessors for account-level
		// fields, so the second credential must not be declared under integration.
		expect(polygonAuthConfig).toEqual({
			api_key: { account: ['api_secret'] },
		});
	});
});

describe('polygon keyBuilder', () => {
	it('prefers the inline key', async () => {
		await expect(
			keyBuilderOf(polygon({ apiKey: 'sk_inline' }))(
				keyBuilderContext('sk_stored'),
				'endpoint',
			),
		).resolves.toBe('sk_inline');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(polygon())(keyBuilderContext('sk_stored'), 'endpoint'),
		).resolves.toBe('sk_stored');
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		await expect(
			keyBuilderOf(polygon())(keyBuilderContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(polygon({ apiKey: 'sk_inline' }))(
				keyBuilderContext('sk_stored'),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
