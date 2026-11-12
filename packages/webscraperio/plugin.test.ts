import { AuthMissingError } from 'corsair/core';
import { webscraperio, webscraperioEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof webscraperio>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations: (keyof typeof webscraperioEndpointSchemas)[] = [
	'account.get',
	'sitemaps.create',
	'sitemaps.get',
	'sitemaps.list',
];

describe('webscraperio plugin definition', () => {
	const plugin = webscraperio();

	it('registers as webscraperio with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('webscraperio');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		// never: the matcher takes a full webhook request and returns false
		// before reading any field.
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the four catalog operations this plugin wraps', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		// The plugin wraps sitemaps and the account. The Cloud API's scraping-job
		// and scheduler routes are not wrapped yet.
		expect(nested.sort()).toEqual(operations);
	});

	it('declares a schema and an output schema for every operation', () => {
		const schemas = plugin.endpointSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual(operations);
		for (const operation of operations) {
			const schema = schemas[operation];
			expect(schema?.input).toBeDefined();
			expect(schema?.output).toBeDefined();
		}
	});

	it('declares metadata with a risk level and description for every operation', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const operation of operations) {
			const entry = meta[operation];
			expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			expect((entry?.description ?? '').length).toBeGreaterThan(10);
		}
	});

	it('marks only creating a sitemap as a write', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) => meta[operation]?.riskLevel === 'write',
		);

		expect(writes).toEqual(['sitemaps.create']);
	});

	it('marks nothing destructive, since the API has no delete route', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) => meta[operation]?.riskLevel === 'destructive',
		);

		expect(destructive).toEqual([]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(webscraperioEndpointSchemas['sitemaps.list'].input).toBeDefined();
		expect(Object.keys(webscraperioEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a sitemap changes whenever it is edited', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('webscraperio key builder', () => {
	const plugin = webscraperio();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(webscraperio({ key: 'from-options' }), keyContext(null)),
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
