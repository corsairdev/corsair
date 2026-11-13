import { AuthMissingError } from 'corsair/core';
import { RedcircleEndpointInputSchemas } from './endpoints/types';
import type { RedcircleKeyBuilderContext } from './index';
import { redcircle } from './index';

function keyContext(
	apiKey: string | undefined,
	authType: 'api_key' = 'api_key',
): RedcircleKeyBuilderContext {
	return {
		authType,
		keys: {
			get_api_key: async () => apiKey,
		},
		// unknown: the fixture implements the one method the builder calls, not
		// the full AccountKeyManager, so the cast sits here rather than at every
		// call site.
	} as unknown as RedcircleKeyBuilderContext;
}

type KeyBuilder = (
	ctx: RedcircleKeyBuilderContext,
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

function internalsOf(plugin: ReturnType<typeof redcircle>): PluginInternals {
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

const OPERATIONS = [
	'account.get',
	'categories.list',
	'products.get',
	'reviews.list',
	'search.products',
];

describe('redcircle plugin', () => {
	it('has the id and default auth type core registers under', () => {
		const plugin = redcircle();

		expect(plugin.id).toBe('redcircle');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares every operation as a registered endpoint schema', () => {
		const plugin = internalsOf(redcircle());

		expect(Object.keys(plugin.endpointSchemas).sort()).toEqual(OPERATIONS);
	});

	it('gives every operation a description and a risk level', () => {
		const plugin = internalsOf(redcircle());

		for (const [operation, meta] of Object.entries(plugin.endpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(operation).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('marks every operation as a read, because the API only reads Target data', () => {
		const plugin = internalsOf(redcircle());

		for (const meta of Object.values(plugin.endpointMeta)) {
			expect(meta.riskLevel).toBe('read');
		}
	});

	it('exposes an input schema for every operation the nested map holds', () => {
		const plugin = internalsOf(redcircle());
		const nested: string[] = [];
		for (const [group, operations] of Object.entries(plugin.endpoints)) {
			for (const operation of Object.keys(operations)) {
				nested.push(`${group}.${operation}`);
			}
		}

		expect(nested.sort()).toEqual(Object.keys(plugin.endpointSchemas).sort());
	});

	it('declares no webhook receiver, because this plugin receives no deliveries', () => {
		const plugin = internalsOf(redcircle());

		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} })).toBe(false);
	});

	it('exports an input schema for each endpoint key', () => {
		expect(Object.keys(RedcircleEndpointInputSchemas)).toHaveLength(
			OPERATIONS.length,
		);
	});
});

describe('keyBuilder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = redcircle({ key: 'inline-key' });

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		const plugin = redcircle();

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = redcircle();

		await expect(
			keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
