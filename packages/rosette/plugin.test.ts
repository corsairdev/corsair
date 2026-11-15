import { AuthMissingError } from 'corsair/core';
import { rosette, rosetteEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof rosette>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'categories',
	'entities',
	'info',
	'language',
	'morphology',
	'nameSimilarity',
	'nameTranslation',
	'ping',
	'relationships',
	'semantics.similarTerms',
	'semantics.vector',
	'sentences',
	'sentiment',
	'tokens',
	'topics',
	'transliteration',
];

describe('rosette plugin definition', () => {
	const plugin = rosette();

	it('registers as rosette with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('rosette');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the sixteen catalog operations', () => {
		// The tree mixes flat operations with a `semantics` group, so both shapes are
		// walked. unknown: a value is an endpoint function or a nested group, told
		// apart by the typeof check.
		const names = (tree: Record<string, unknown>, prefix = ''): string[] =>
			Object.entries(tree).flatMap(([key, value]) =>
				typeof value === 'function'
					? [prefix ? `${prefix}.${key}` : key]
					: names(
							value as Record<string, unknown>,
							prefix ? `${prefix}.${key}` : key,
						),
			);

		expect(names(plugin.endpoints ?? {}).sort()).toEqual(operations);
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

	it('marks every operation as a read, since each derives an answer from its text', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel !== 'read',
		);

		expect(writes).toEqual([]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(rosetteEndpointSchemas.language.input).toBeDefined();
		expect(Object.keys(rosetteEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since every answer derives from its input', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('rosette key builder', () => {
	const plugin = rosette();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(rosette({ key: 'from-options' }), keyContext(null)),
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
