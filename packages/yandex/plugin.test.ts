import { AuthMissingError } from 'corsair/core';
import { yandex, yandexEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof yandex>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'detectLanguages.run',
	'listLanguages.run',
	'translate.text',
];

describe('yandex plugin definition', () => {
	const plugin = yandex();

	it('registers as yandex with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('yandex');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the three catalog operations', () => {
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

	it('marks all three as reads, since translating changes nothing', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		expect(reads.sort()).toEqual(operations);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(yandexEndpointSchemas['translate.text'].input).toBeDefined();
		expect(Object.keys(yandexEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a translation is per request', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('yandex key builder', () => {
	const plugin = yandex();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(yandex({ key: 'from-options' }), keyContext(null)),
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
