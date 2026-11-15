import { AuthMissingError } from 'corsair/core';
import { RaiselyEndpointInputSchemas } from './endpoints/types';
import type { RaiselyKeyBuilderContext } from './index';
import { raisely } from './index';

function keyContext(
	apiKey: string | undefined,
	authType: 'api_key' = 'api_key',
): RaiselyKeyBuilderContext {
	return {
		authType,
		keys: {
			get_api_key: async () => apiKey,
		},
		// unknown: the fixture implements the one method the builder calls, not
		// the full AccountKeyManager, so the cast sits here rather than at every
		// call site.
	} as unknown as RaiselyKeyBuilderContext;
}

type KeyBuilder = (
	ctx: RaiselyKeyBuilderContext,
	source: string,
) => Promise<string>;

/**
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

function internalsOf(plugin: ReturnType<typeof raisely>): PluginInternals {
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

function required<T>(source: Record<string, T | undefined>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

const OPERATIONS = [
	'campaigns.get',
	'campaigns.list',
	'designations.list',
	'donations.create',
	'donations.get',
	'donations.list',
	'profiles.get',
	'profiles.list',
	'profiles.update',
];

describe('raisely plugin', () => {
	it('has the id and default auth type core registers under', () => {
		const plugin = raisely();

		expect(plugin.id).toBe('raisely');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares every operation as a registered endpoint schema', () => {
		const plugin = internalsOf(raisely());

		expect(Object.keys(plugin.endpointSchemas).sort()).toEqual(OPERATIONS);
	});

	it('gives every operation a description and a risk level', () => {
		const plugin = internalsOf(raisely());

		for (const [operation, meta] of Object.entries(plugin.endpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(operation).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('marks the two writes as writes and the rest as reads', () => {
		const plugin = internalsOf(raisely());

		expect(required(plugin.endpointMeta, 'donations.create').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'profiles.update').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'campaigns.list').riskLevel).toBe(
			'read',
		);
	});

	it('exposes an input schema for every operation the nested map holds', () => {
		const plugin = internalsOf(raisely());
		const nested: string[] = [];
		for (const [group, operations] of Object.entries(plugin.endpoints)) {
			for (const operation of Object.keys(operations)) {
				nested.push(`${group}.${operation}`);
			}
		}

		expect(nested.sort()).toEqual(Object.keys(plugin.endpointSchemas).sort());
	});

	it('declares no webhook receiver, because deliveries are configured in Raisely', () => {
		const plugin = internalsOf(raisely());

		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} })).toBe(false);
	});

	it('exports an input schema for each endpoint key', () => {
		expect(Object.keys(RaiselyEndpointInputSchemas)).toHaveLength(
			OPERATIONS.length,
		);
	});
});

describe('keyBuilder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = raisely({ key: 'inline-key' });

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		const plugin = raisely();

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = raisely();

		await expect(
			keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
