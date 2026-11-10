import { AuthMissingError } from 'corsair/core';
import { ritekit, ritekitEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof ritekit>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'companies.brandColors',
	'companies.logo',
	'companies.nameToDomain',
	'emojis.auto',
	'emojis.suggestions',
	'hashtags.auto',
	'hashtags.cleanInstagram',
	'hashtags.forImage',
	'hashtags.forUrl',
	'hashtags.stats',
	'hashtags.suggestions',
	'hashtags.trending',
	'images.animate',
	'images.extractTopImage',
	'images.quote',
	'links.shorten',
	'person.disposable',
	'person.emailTypo',
	'person.freemail',
	'person.nameFromEmail',
	'texts.extractArticle',
	'texts.linkPreview',
];

describe('ritekit plugin definition', () => {
	const plugin = ritekit();

	it('registers as ritekit with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('ritekit');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twenty-two catalog operations', () => {
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

	it('marks only links.shorten as a write, since it creates a short link', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel !== 'read',
		);

		expect(writes).toEqual(['links.shorten']);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(ritekitEndpointSchemas['hashtags.stats'].input).toBeDefined();
		expect(Object.keys(ritekitEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since every answer derives from its input', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('ritekit key builder', () => {
	const plugin = ritekit();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(ritekit({ key: 'from-options' }), keyContext(null)),
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

	it('uses the option without consulting storage', async () => {
		const ctx = keyContext('stored-key');
		await buildKey(ritekit({ key: 'from-options' }), ctx);

		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});
});
