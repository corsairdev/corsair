import { AuthMissingError } from 'corsair/core';
import { Route4MeEndpointInputSchemas } from './endpoints/types';
import type { Route4meKeyBuilderContext } from './index';
import { route4me } from './index';

/**
 * A key-builder context exposing just `get_api_key` and `authType`, which is
 * all the plugin's keyBuilder reads. A real context also carries an
 * `AccountKeyManager` (`get_dek`, `issue_new_dek`, …), which a fixture does not
 * reimplement.
 */
function keyContext(
	apiKey: string | undefined,
	authType: 'api_key' = 'api_key',
): Route4meKeyBuilderContext {
	return {
		authType,
		keys: {
			get_api_key: async () => apiKey,
		},
		// unknown: the fixture implements the one method the builder calls, not
		// the full AccountKeyManager, so the cast sits here rather than at every
		// call site.
	} as unknown as Route4meKeyBuilderContext;
}

type KeyBuilder = (
	ctx: Route4meKeyBuilderContext,
	source: string,
) => Promise<string>;

/**
 * The public plugin type marks the endpoint map, schemas and metadata optional,
 * because not every plugin carries them. This one does, so the tests read them
 * through a required view rather than narrowing at each assertion.
 *
 * unknown: the map values are concrete endpoints with per-operation signatures,
 * which a single record type cannot name; the tests only read their key names.
 */
type PluginInternals = {
	endpoints: Record<string, Record<string, unknown>>;
	// unknown: a schema's input and output types differ per operation, so the
	// shared view names only that the entries exist.
	endpointSchemas: Record<string, { input?: unknown; output?: unknown }>;
	endpointMeta: Record<string, { riskLevel: string; description: string }>;
	webhooks: Record<string, unknown>;
	// unknown: the matcher narrows its own request argument; a test that calls it
	// with no headers cannot name a stricter parameter type.
	pluginWebhookMatcher?: (request: unknown) => boolean;
};

function internalsOf(plugin: ReturnType<typeof route4me>): PluginInternals {
	// unknown: the plugin's own type parameterises these by operation, so one
	// shared view of them has to widen first.
	return plugin as unknown as PluginInternals;
}

// unknown: `keyBuilder` is optional on the public plugin type and its source
// parameter is narrowed per call site, so the builder is widened to this
// signature once rather than casting at each call.
function keyBuilderOf(candidate: { keyBuilder?: unknown }): KeyBuilder {
	return candidate.keyBuilder as KeyBuilder;
}

/** Reads a key that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T | undefined>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

describe('route4me plugin', () => {
	it('has the id and default auth type core registers under', () => {
		const plugin = route4me();

		expect(plugin.id).toBe('route4me');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares every operation as a registered endpoint schema', () => {
		const plugin = internalsOf(route4me());

		expect(Object.keys(plugin.endpointSchemas).sort()).toEqual([
			'addresses.create',
			'addresses.list',
			'optimizations.create',
			'optimizations.get',
			'optimizations.list',
			'orders.create',
			'orders.list',
			'routes.get',
			'routes.list',
			'team.list',
			'team.me',
			'vehicles.create',
			'vehicles.list',
		]);
	});

	it('gives every operation a description and a risk level', () => {
		const plugin = internalsOf(route4me());

		for (const [operation, meta] of Object.entries(plugin.endpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(operation).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('marks each create as a write and each read as a read', () => {
		const plugin = internalsOf(route4me());

		expect(required(plugin.endpointMeta, 'orders.create').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'vehicles.create').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'addresses.create').riskLevel).toBe(
			'write',
		);
		expect(
			required(plugin.endpointMeta, 'optimizations.create').riskLevel,
		).toBe('write');

		expect(required(plugin.endpointMeta, 'routes.list').riskLevel).toBe('read');
		expect(required(plugin.endpointMeta, 'team.me').riskLevel).toBe('read');
		expect(required(plugin.endpointMeta, 'optimizations.get').riskLevel).toBe(
			'read',
		);
	});

	it('exposes an input schema for every operation the nested map holds', () => {
		const plugin = internalsOf(route4me());
		const nested: string[] = [];
		for (const [group, operations] of Object.entries(plugin.endpoints)) {
			for (const operation of Object.keys(operations)) {
				nested.push(`${group}.${operation}`);
			}
		}

		expect(nested.sort()).toEqual(Object.keys(plugin.endpointSchemas).sort());
	});

	it('declares no webhooks, because Route4Me pushes no delivery this plugin receives', () => {
		const plugin = internalsOf(route4me());

		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} })).toBe(false);
	});

	it('exports an input schema for each endpoint key', () => {
		expect(Object.keys(Route4MeEndpointInputSchemas)).toHaveLength(13);
	});
});

describe('keyBuilder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = route4me({ key: 'inline-key' });

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		const plugin = route4me();

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = route4me();

		await expect(
			keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws rather than returning an empty key', async () => {
		const plugin = route4me();

		const caught = await keyBuilderOf(plugin)(keyContext(''), 'endpoint').catch(
			(error: Error) => error,
		);

		expect(caught).toBeInstanceOf(AuthMissingError);
	});
});
