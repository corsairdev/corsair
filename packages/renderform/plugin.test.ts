import { AuthMissingError } from 'corsair/core';
import { renderform, renderformEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof renderform>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'fonts',
	'pdf',
	'render',
	'results.delete',
	'results.get',
	'results.list',
	'screenshot',
	'templates.content',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.list',
	'templates.update',
	'templates.updateContent',
	'usage',
];

describe('renderform plugin definition', () => {
	const plugin = renderform();

	it('registers as renderform with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('renderform');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the fifteen catalog operations', () => {
		// The tree mixes flat operations (render, screenshot, pdf, usage, fonts) with
		// groups, so both shapes are walked.
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

	it('marks the six that change something as writes', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'write',
		);

		// A render, a screenshot and a PDF capture each cost a credit; the three
		// template writes change stored content.
		expect(writes.sort()).toEqual([
			'pdf',
			'render',
			'screenshot',
			'templates.create',
			'templates.update',
			'templates.updateContent',
		]);
	});

	it('marks the two deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual(['results.delete', 'templates.delete']);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(renderformEndpointSchemas.render.input).toBeDefined();
		expect(Object.keys(renderformEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since Renderform has its own render cache', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('renderform key builder', () => {
	const plugin = renderform();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(renderform({ key: 'from-options' }), keyContext(null)),
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
