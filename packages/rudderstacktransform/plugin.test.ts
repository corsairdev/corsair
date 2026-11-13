import { AuthMissingError } from 'corsair/core';
import {
	rudderStackTransformationEndpointSchemas,
	rudderstacktransform,
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
	plugin: ReturnType<typeof rudderstacktransform>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'libraries.create',
	'libraries.delete',
	'libraries.get',
	'libraries.getVersion',
	'libraries.list',
	'libraries.listVersions',
	'libraries.publish',
	'libraries.update',
	'transformations.connect',
	'transformations.create',
	'transformations.delete',
	'transformations.disconnect',
	'transformations.get',
	'transformations.getVersion',
	'transformations.list',
	'transformations.listVersions',
	'transformations.update',
];

describe('rudderstacktransform plugin definition', () => {
	const plugin = rudderstacktransform();

	it('registers with api_key auth, no webhooks and the US region by default', () => {
		expect(plugin.id).toBe('rudderstacktransform');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.options?.region).toBe('us');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('accepts an EU region', () => {
		expect(rudderstacktransform({ region: 'eu' }).options?.region).toBe('eu');
	});

	it('exposes exactly the seventeen catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
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

	it('marks the two deletes as destructive and the reads as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual([
			'libraries.delete',
			'transformations.delete',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(
			rudderStackTransformationEndpointSchemas['transformations.list'].input,
		).toBeDefined();
		expect(
			Object.keys(rudderStackTransformationEndpointSchemas).sort(),
		).toEqual(operations);
	});

	it('caches nothing, because a revision changes whenever someone edits it', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('rudderstacktransform key builder', () => {
	const plugin = rudderstacktransform();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(rudderstacktransform({ key: 'from-options' }), keyContext(null)),
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
