import { AuthMissingError } from 'corsair/core';
import type { PolygonioKeyBuilderContext } from './index';
import {
	polygonio,
	polygonioAuthConfig,
	polygonioEndpointSchemas,
} from './index';

const OPERATIONS = [
	'aggregates.bars',
	'aggregates.previousDay',
	'aggregates.dailySummary',
	'aggregates.marketSummary',
	'snapshots.snapshot',
	'snapshots.movers',
	'tickers.list',
	'tickers.overview',
	'tickers.types',
	'market.status',
	'market.holidays',
	'market.exchanges',
] as const;

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: PolygonioKeyBuilderContext,
	source: string,
) => Promise<string>;

/** A value only cast, never read: the plugin's own types disagree. */
type Untyped = unknown; // unknown: see the note above.

const keyBuilderOf = (candidate: { keyBuilder?: Untyped }): KeyBuilder =>
	candidate.keyBuilder as KeyBuilder;

function keyBuilderContext(apiKey: string | null): PolygonioKeyBuilderContext {
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
	} as Untyped as PolygonioKeyBuilderContext;
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

describe('polygonio plugin', () => {
	const plugin = polygonio();
	const meta = plugin.endpointMeta as Untyped as Record<string, EndpointMeta>;

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('polygonio');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks: the API sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation across four groups', () => {
		const endpoints = plugin.endpoints as Record<string, Untyped>;
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
		expect(Object.keys(endpoints)).toEqual([
			'aggregates',
			'snapshots',
			'tickers',
			'market',
		]);
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks every operation a read, because the API only serves market data', () => {
		for (const path of OPERATIONS) {
			expect(meta[path]?.riskLevel).toBe('read');
			// Nothing here is irreversible either.
			expect(meta[path]?.irreversible).toBeUndefined();
		}
	});

	it('registers an input and an output schema for every operation', () => {
		const schemas = polygonioEndpointSchemas as Record<
			string,
			{ input?: Untyped; output?: Untyped }
		>;
		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares api_key as the only credential, since a key is all the API needs', () => {
		expect(polygonioAuthConfig).toEqual({ api_key: {} });
	});
});

describe('polygonio keyBuilder', () => {
	it('prefers the inline key', async () => {
		await expect(
			keyBuilderOf(polygonio({ key: 'inline-key' }))(
				keyBuilderContext('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(polygonio())(keyBuilderContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		await expect(
			keyBuilderOf(polygonio())(keyBuilderContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(polygonio({ key: 'inline-key' }))(
				keyBuilderContext('stored-key'),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
