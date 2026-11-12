import { AuthMissingError } from 'corsair/core';
import { RepairshoprEndpointInputSchemas } from './endpoints/types';
import type { RepairshoprKeyBuilderContext } from './index';
import { repairshopr } from './index';

function keyContext(
	apiKey: string | undefined,
	authType: 'api_key' = 'api_key',
	// null: no stored subdomain (undefined would select the default).
	subdomain: string | null = 'acme',
): RepairshoprKeyBuilderContext {
	return {
		authType,
		options: {},
		keys: {
			get_api_key: async () => apiKey,
			get_subdomain: async () => subdomain ?? undefined,
		},
		// unknown: the fixture implements the one method the builder calls, not
		// the full AccountKeyManager, so the cast sits here rather than at every
		// call site.
	} as unknown as RepairshoprKeyBuilderContext;
}

type KeyBuilder = (
	ctx: RepairshoprKeyBuilderContext,
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
	authConfig?: Record<string, { account?: readonly string[] }>;
	webhooks: Record<string, unknown>;
	// unknown: the matcher narrows its own request argument; a test that calls it
	// with no headers cannot name a stricter parameter type.
	pluginWebhookMatcher?: (request: unknown) => boolean;
};

function internalsOf(plugin: ReturnType<typeof repairshopr>): PluginInternals {
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
	'contacts.list',
	'customers.create',
	'customers.delete',
	'customers.get',
	'customers.list',
	'customers.update',
	'invoices.get',
	'invoices.list',
	'products.create',
	'products.get',
	'products.list',
	'products.update',
	'tickets.create',
	'tickets.delete',
	'tickets.get',
	'tickets.list',
	'tickets.update',
	'vendors.list',
];

describe('repairshopr plugin', () => {
	it('has the id and default auth type core registers under', () => {
		const plugin = repairshopr();

		expect(plugin.id).toBe('repairshopr');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares the subdomain as an account-level credential', () => {
		const plugin = internalsOf(repairshopr());

		// The subdomain is part of the host, so it has to be stored per account
		// beside the key; a per-integration field would not be readable here.
		expect(plugin.authConfig?.api_key?.account).toEqual(['subdomain']);
	});

	it('declares every operation as a registered endpoint schema', () => {
		const plugin = internalsOf(repairshopr());

		expect(Object.keys(plugin.endpointSchemas).sort()).toEqual(OPERATIONS);
	});

	it('gives every operation a description and a risk level', () => {
		const plugin = internalsOf(repairshopr());

		for (const [operation, meta] of Object.entries(plugin.endpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(operation).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('marks every delete as destructive', () => {
		const plugin = internalsOf(repairshopr());

		for (const operation of OPERATIONS.filter((op) => op.endsWith('.delete'))) {
			expect(required(plugin.endpointMeta, operation).riskLevel).toBe(
				'destructive',
			);
		}
	});

	it('marks the creates and updates as writes', () => {
		const plugin = internalsOf(repairshopr());

		expect(required(plugin.endpointMeta, 'customers.create').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'tickets.update').riskLevel).toBe(
			'write',
		);
		expect(required(plugin.endpointMeta, 'products.create').riskLevel).toBe(
			'write',
		);
	});

	it('exposes an input schema for every operation the nested map holds', () => {
		const plugin = internalsOf(repairshopr());
		const nested: string[] = [];
		for (const [group, operations] of Object.entries(plugin.endpoints)) {
			for (const operation of Object.keys(operations)) {
				nested.push(`${group}.${operation}`);
			}
		}

		expect(nested.sort()).toEqual(Object.keys(plugin.endpointSchemas).sort());
	});

	it('declares no webhooks, because this plugin receives no deliveries', () => {
		const plugin = internalsOf(repairshopr());

		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} })).toBe(false);
	});

	it('exports an input schema for each endpoint key', () => {
		expect(Object.keys(RepairshoprEndpointInputSchemas)).toHaveLength(
			OPERATIONS.length,
		);
	});
});

describe('keyBuilder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = repairshopr({ key: 'inline-key' });

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		const plugin = repairshopr();

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key'),
			'endpoint',
		);

		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when the stored account has a key but no subdomain', async () => {
		const plugin = repairshopr();

		// Only an AuthMissingError from the keyBuilder gets a connect link from core.
		const error = await keyBuilderOf(plugin)(
			keyContext('stored-key', 'api_key', null),
			'endpoint',
		).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AuthMissingError);
		expect((error as Error).message).toContain('subdomain');
	});

	it('throws AuthMissingError for a malformed stored subdomain', async () => {
		const plugin = repairshopr();

		await expect(
			keyBuilderOf(plugin)(
				keyContext('stored-key', 'api_key', 'acme.repairshopr.com'),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('takes the subdomain from the plugin options before the account', async () => {
		const plugin = repairshopr({ subdomain: 'acme' });

		const key = await keyBuilderOf(plugin)(
			keyContext('stored-key', 'api_key', null),
			'endpoint',
		);

		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = repairshopr();

		await expect(
			keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
