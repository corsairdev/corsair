import { AuthMissingError } from 'corsair/core';
import {
	realPhoneValidationEndpointSchemas,
	realphonevalidation,
} from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof realphonevalidation>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'active',
	'dncLookup',
	'dncPlus',
	'emailVerify',
	'fraudCheck',
	'reassigned',
	'scrub',
	'scrubPlus',
	'turbo',
	'turboStandard',
	'turboV3',
	'wirelessId',
];

describe('realphonevalidation plugin definition', () => {
	const plugin = realphonevalidation();

	it('registers as realphonevalidation with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('realphonevalidation');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twelve service operations', () => {
		// This plugin's tree is flat: each service is one function keyed by its own
		// name, rather than grouped like a multi-resource API.
		const endpoints = plugin.endpoints ?? {};
		expect(Object.keys(endpoints).sort()).toEqual(operations);
	});

	it('declares a schema and an output schema for every operation', () => {
		const schemas = plugin.endpointSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual(operations);
		for (const operation of operations) {
			const schema = schemas[operation as keyof typeof schemas];
			expect(schema?.input).toBeDefined();
			expect(schema?.output).toBeDefined();
		}
	});

	it('declares metadata with a risk level and description for every operation', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const operation of operations) {
			const entry = meta[operation as keyof typeof meta];
			expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			expect((entry?.description ?? '').length).toBeGreaterThan(10);
		}
	});

	it('marks every service as a read, since each one looks up a number', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel !== 'read',
		);

		expect(writes).toEqual([]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(realPhoneValidationEndpointSchemas.turboV3.input).toBeDefined();
		expect(Object.keys(realPhoneValidationEndpointSchemas).sort()).toEqual(
			operations,
		);
	});

	it('caches nothing, since a disposition goes stale', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('realphonevalidation key builder', () => {
	const plugin = realphonevalidation();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(realphonevalidation({ key: 'from-options' }), keyContext(null)),
		).resolves.toBe('from-options');
	});

	it('falls back to the stored api_key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no key is available', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
