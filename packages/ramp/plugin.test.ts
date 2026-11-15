import { AuthMissingError } from 'corsair/core';
import { RampEndpointInputSchemas } from './endpoints/types';
import type { RampKeyBuilderContext } from './index';
import { ramp } from './index';

/**
 * A key-builder context exposing just `get_api_key` and `authType`, which is
 * all the plugin's keyBuilder reads. It is cast because a real context carries
 * an `AccountKeyManager` with `get_dek`, `issue_new_dek` and more; every fixture
 * in this repo implements the one method the builder calls.
 */
// unknown: a fixture cannot be typed as the full AccountKeyManager without
// reimplementing it, so it is cast at this single boundary.
function keyContext(
	apiKey: string | undefined,
	authType: 'api_key' = 'api_key',
): RampKeyBuilderContext {
	return {
		authType,
		keys: {
			get_api_key: async () => apiKey,
		},
		// unknown: the fixture implements the one method the builder calls, not
		// the full AccountKeyManager (`get_dek`, `issue_new_dek`, …), so the cast
		// sits here rather than at every call site.
	} as unknown as RampKeyBuilderContext;
}

/** The plugin's keyBuilder, which is optional on the public type. */
type KeyBuilder = (
	ctx: RampKeyBuilderContext,
	source: string,
) => Promise<string>;

/** Reads the builder off a plugin, failing as an assertion when it is absent. */
// unknown: `keyBuilder` is optional on the public plugin type and its source
// parameter is narrowed per call site, so the builder is widened to this
// signature once rather than casting at each call.
function keyBuilderOf(candidate: { keyBuilder?: unknown }): KeyBuilder {
	return candidate.keyBuilder as KeyBuilder;
}

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

function internalsOf(plugin: ReturnType<typeof ramp>): PluginInternals {
	// unknown: the plugin's own type parameterises these by operation, so one
	// shared view of them has to widen first.
	return plugin as unknown as PluginInternals;
}

/** Reads a key that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T | undefined>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

describe('ramp plugin', () => {
	it('has the id and default auth type core registers under', () => {
		const plugin = ramp();

		expect(plugin.id).toBe('ramp');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares every operation as a registered endpoint schema', () => {
		const plugin = internalsOf(ramp());
		const registered = Object.keys(plugin.endpointSchemas).sort();

		expect(registered).toEqual([
			'bills.get',
			'bills.list',
			'bills.update',
			'business.get',
			'cards.listVirtual',
			'departments.create',
			'departments.list',
			'memos.create',
			'memos.get',
			'merchants.list',
			'reimbursements.list',
			'transactions.get',
			'transactions.list',
			'transactions.update',
			'users.get',
			'users.list',
		]);
	});

	it('gives every operation a description and a risk level', () => {
		const plugin = internalsOf(ramp());

		for (const [operation, meta] of Object.entries(plugin.endpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(operation).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('marks the writes that change provider state as writes', () => {
		const plugin = internalsOf(ramp());

		expect(required(plugin.endpointMeta, 'transactions.update').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'bills.update').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'memos.create').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'departments.create').riskLevel).toBe(
			'write',
		);
	});

	it('marks the reads as reads', () => {
		const plugin = internalsOf(ramp());

		expect(required(plugin.endpointMeta, 'transactions.list').riskLevel).toBe(
			'read',
		);
		expect(required(plugin.endpointMeta, 'bills.get').riskLevel).toBe('read');
		expect(required(plugin.endpointMeta, 'business.get').riskLevel).toBe(
			'read',
		);
	});

	it('exposes an input schema for every operation the nested map holds', () => {
		const plugin = internalsOf(ramp());
		const nested: string[] = [];
		for (const [group, operations] of Object.entries(plugin.endpoints)) {
			for (const operation of Object.keys(operations)) {
				nested.push(`${group}.${operation}`);
			}
		}

		expect(nested.sort()).toEqual(Object.keys(plugin.endpointSchemas).sort());
	});

	it('declares no webhooks, because Ramp needs a delivery receiver to use them', () => {
		const plugin = internalsOf(ramp());

		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('exports an input schema for each endpoint key', () => {
		expect(Object.keys(RampEndpointInputSchemas)).toHaveLength(16);
	});
});

describe('keyBuilder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = ramp({ key: 'inline-token' });

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-token'),
			'endpoint',
		);

		expect(key).toBe('inline-token');
	});

	it('falls back to the stored account key', async () => {
		const plugin = ramp();

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-token'),
			'endpoint',
		);

		expect(key).toBe('stored-token');
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = ramp();

		await expect(
			keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
