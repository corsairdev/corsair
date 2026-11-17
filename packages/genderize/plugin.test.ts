import { genderize, genderizeEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof genderize>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = ['batch.names', 'name.predict'];

describe('genderize plugin definition', () => {
	const plugin = genderize();

	it('registers as genderize with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('genderize');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('adds no account credential fields beyond the key itself', () => {
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});

	it('exposes exactly the catalog operations', () => {
		// A caller writes `api.name.predict` or `api.batch.names`.
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'batch',
			'name',
		]);
		expect(Object.keys(plugin.endpoints?.name ?? {}).sort()).toEqual([
			'predict',
		]);
		expect(Object.keys(plugin.endpoints?.batch ?? {}).sort()).toEqual([
			'names',
		]);
	});

	it('gives every endpoint a description and a read risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(entry.riskLevel).toBe('read');
		}
	});

	it('declares a schema pair for every endpoint', () => {
		expect(Object.keys(genderizeEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operations,
		);
	});
});

describe('genderize key builder', () => {
	it('prefers the option key', async () => {
		const plugin = genderize({ key: 'option-key' });

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'option-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = genderize();

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('returns an empty string when no key is set, so the IP allowance is used', async () => {
		const plugin = genderize();

		// Unlike most plugins this does not throw: a keyless call is valid, and
		// Genderize serves an IP-scoped allowance for it.
		await expect(buildKey(plugin, keyContext(null))).resolves.toBe('');
	});

	it('returns an empty string for a webhook source, since there are no webhooks', async () => {
		const plugin = genderize();

		await expect(
			plugin.keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).resolves.toBe('');
	});
});

describe('genderize schemas', () => {
	const predictInput = genderizeEndpointSchemas['name.predict'].input;
	const batchInput = genderizeEndpointSchemas['batch.names'].input;

	it('accepts a bare name and rejects an empty one', () => {
		expect(predictInput.safeParse({ name: 'peter' }).success).toBe(true);
		expect(predictInput.safeParse({ name: '' }).success).toBe(false);
		expect(predictInput.safeParse({}).success).toBe(false);
	});

	it('accepts a two-letter country and rejects a name', () => {
		expect(
			predictInput.safeParse({ name: 'kim', country_id: 'DK' }).success,
		).toBe(true);
		expect(
			predictInput.safeParse({ name: 'kim', country_id: 'Denmark' }).success,
		).toBe(false);
		// Genderize answers 200 with gender null for a malformed code, so the
		// schema is the only place it is caught.
		expect(
			predictInput.safeParse({ name: 'kim', country_id: '1!' }).success,
		).toBe(false);
	});

	it('requires at least one name in a batch', () => {
		expect(batchInput.safeParse({ names: ['a'] }).success).toBe(true);
		expect(batchInput.safeParse({ names: [] }).success).toBe(false);
		expect(batchInput.safeParse({ names: [''] }).success).toBe(false);
	});

	it('caps a batch at the documented 100 names', () => {
		const names = (count: number) =>
			Array.from({ length: count }, (_, i) => `name${i}`);
		expect(batchInput.safeParse({ names: names(100) }).success).toBe(true);
		expect(batchInput.safeParse({ names: names(101) }).success).toBe(false);
	});

	it('accepts the response a live keyless call returned', () => {
		const parsed = genderizeEndpointSchemas['name.predict'].output.safeParse({
			name: 'lisa',
			gender: 'female',
			probability: 0.98,
			count: 806,
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts a null gender, which is how an unknown name answers', () => {
		const parsed = genderizeEndpointSchemas['name.predict'].output.safeParse({
			name: '',
			gender: null,
			probability: 0,
			count: 0,
		});
		expect(parsed.success).toBe(true);
	});
});
