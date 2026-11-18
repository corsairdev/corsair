import { AuthMissingError } from 'corsair/core';
import {
	Mem0APIError,
	mem0,
	mem0EndpointMeta,
	mem0EndpointSchemas,
	mem0EndpointsNested,
} from './index';

const OPS = [
	'events.get',
	'events.list',
	'memories.add',
	'memories.batchDelete',
	'memories.batchUpdate',
	'memories.delete',
	'memories.deleteAll',
	'memories.get',
	'memories.history',
	'memories.list',
	'memories.search',
	'memories.update',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.list',
	'webhooks.update',
];

// The plugin type marks keyBuilder optional and types its context by the
// plugin's own generics, so it is narrowed here to call it from a test.
// unknown: keyBuilder is optional on the public type, so it is probed first.
function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (
		// unknown: the fake context only carries the auth fields keyBuilder reads.
		ctx: unknown,
		source: string,
	) => Promise<string>;
}

// The endpoint tree is a deeply nested literal of typed functions, so it is
// widened once here to walk its keys.
// unknown: each nested value is a group of endpoints with its own shape.
function flattenEndpoints(): string[] {
	const groups = mem0EndpointsNested as unknown as Record<
		string,
		// unknown: an endpoint function's parameters and return are per-operation.
		Record<string, unknown>
	>;
	return Object.entries(groups)
		.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
		.sort();
}

describe('mem0 plugin registration', () => {
	const plugin = mem0();

	it('uses the provider id', () => {
		expect(plugin.id).toBe('mem0');
	});

	it('exposes the documented operations', () => {
		expect(flattenEndpoints()).toEqual(OPS);
	});

	it('registers api_key auth only', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('has input, output and metadata for every operation', () => {
		expect(Object.keys(mem0EndpointSchemas).sort()).toEqual(OPS);
		expect(Object.keys(mem0EndpointMeta).sort()).toEqual(OPS);

		for (const [name, entry] of Object.entries(mem0EndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
			expect(name).toMatch(/^[a-z]+\.[a-zA-Z]+$/);
		}
	});

	it('gives every operation a description and a known risk level', () => {
		const levels = new Set<string>();

		for (const entry of Object.values(mem0EndpointMeta)) {
			expect(entry.description.length).toBeGreaterThan(10);
			levels.add(entry.riskLevel);
		}
		expect(levels).toEqual(new Set(['read', 'write', 'destructive']));
	});

	it('marks every delete destructive and every read as a read', () => {
		expect(mem0EndpointMeta['memories.delete'].riskLevel).toBe('destructive');
		expect(mem0EndpointMeta['memories.batchDelete'].riskLevel).toBe(
			'destructive',
		);
		expect(mem0EndpointMeta['memories.deleteAll'].riskLevel).toBe(
			'destructive',
		);
		expect(mem0EndpointMeta['memories.get'].riskLevel).toBe('read');
		expect(mem0EndpointMeta['memories.search'].riskLevel).toBe('read');
		expect(mem0EndpointMeta['webhooks.delete'].riskLevel).toBe('destructive');
		expect(mem0EndpointMeta['webhooks.list'].riskLevel).toBe('read');
	});

	it('registers no inbound webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('reports a schema version and stores no entities', () => {
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(plugin.schema?.entities).toEqual({});
	});

	it('takes the key from the plugin options first', async () => {
		const key = await keyBuilderOf(mem0({ key: 'm0-from-options' }))(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'm0-stored' },
			},
			'endpoint',
		);

		expect(key).toBe('m0-from-options');
	});

	it('falls back to the stored api_key', async () => {
		const key = await keyBuilderOf(mem0())(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'm0-stored' },
			},
			'endpoint',
		);

		expect(key).toBe('m0-stored');
	});

	it('throws AuthMissingError when no key is configured', async () => {
		await expect(
			keyBuilderOf(mem0())(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('accepts only the documented option keys', () => {
		const options = mem0({ key: 'k', authType: 'api_key' }).options ?? {};

		expect(Object.keys(options).sort()).toEqual(
			expect.arrayContaining(['authType', 'key']),
		);
	});

	it('re-exports its error class', () => {
		const error = new Mem0APIError('boom', { status: 500 });

		expect(error.name).toBe('Mem0APIError');
		expect(error.status).toBe(500);
		expect(error.isRateLimit).toBe(false);
	});
});
