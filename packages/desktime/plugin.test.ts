import { AuthMissingError } from 'corsair/core';
import { deskTimeEndpointSchemas, desktime } from './index';
import { DeskTimeSchema } from './schema';

// The public return type keeps optional members optional. Tests assert on what
// the plugin defines, so they read it once here instead of guarding each access.
const plugin = desktime();
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

describe('plugin shape', () => {
	it('uses the provider id', () => {
		expect(plugin.id).toBe('desktime');
	});

	it('authenticates with an API key only', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares no webhooks, because the API has none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: undefined }),
		).toBe(false);
	});

	it('groups the endpoints by resource', () => {
		expect(Object.keys(endpoints).sort()).toEqual([
			'company',
			'employee',
			'employees',
			'ping',
			'projects',
		]);
	});

	it('nests the three employee reads under employee', () => {
		expect(Object.keys(endpoints.employee).sort()).toEqual([
			'apps',
			'basic',
			'projects',
		]);
	});

	it('carries a schema version and no entities', () => {
		expect(DeskTimeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		// The plugin only reads and every read is current, so a local mirror would
		// only add staleness.
		expect(DeskTimeSchema.entities).toEqual({});
	});
});

describe('endpoint metadata', () => {
	const meta = plugin.endpointMeta ?? {};

	it('marks every operation as a read, because the plugin exposes no writes', () => {
		const paths = Object.keys(meta);
		expect(paths.length).toBe(7);
		for (const path of paths) {
			expect(meta[path as keyof typeof meta]?.riskLevel).toBe('read');
		}
	});

	it('marks nothing destructive or irreversible', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.riskLevel).not.toBe('destructive');
			expect(entry.irreversible).toBeUndefined();
		}
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length ?? 0).toBeGreaterThan(20);
		}
	});
});

describe('endpoint schemas', () => {
	it('declares a schema for every path in the metadata', () => {
		expect(Object.keys(deskTimeEndpointSchemas).sort()).toEqual(
			Object.keys(plugin.endpointMeta ?? {}).sort(),
		);
	});

	it('covers every endpoint in the tree', () => {
		const treePaths: string[] = [];
		for (const [group, operations] of Object.entries(endpoints)) {
			// unknown: the tree holds callables under unknown keys, and only the
			// key names matter here.
			const ops = operations as Record<string, unknown>;
			for (const operation of Object.keys(ops)) {
				treePaths.push(`${group}.${operation}`);
			}
		}
		expect(Object.keys(deskTimeEndpointSchemas).sort()).toEqual(
			treePaths.sort(),
		);
	});
});

/**
 * The plugin's own key builder, typed locally. `KeyBuilderContext` collapses to
 * a non-assignable type for this option shape, so the shape a test can build is
 * spelled out here instead.
 */
type KeyBuilderContext = {
	authType: 'api_key';
	options: Record<string, never>;
	keys: { get_api_key: () => Promise<string | undefined> };
	tenantId: string;
};

describe('keyBuilder', () => {
	// The public type keeps members optional; the plugin always defines this one.
	const keyBuilder = plugin.keyBuilder as unknown as (
		ctx: KeyBuilderContext,
		source: 'endpoint' | 'webhook',
	) => Promise<string>;

	it('prefers the key passed in the options', async () => {
		const configured = desktime({ key: 'inline-key' });
		// Same cast as above: the factory's public type keeps it optional.
		const configuredKeyBuilder = configured.keyBuilder as unknown as (
			ctx: KeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => Promise<string>;
		await expect(
			configuredKeyBuilder(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: async () => 'stored-key' },
					tenantId: 'default',
				},
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: async () => 'stored-key' },
					tenantId: 'default',
				},
				'endpoint',
			),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when neither exists', async () => {
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: async () => undefined },
					tenantId: 'default',
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
