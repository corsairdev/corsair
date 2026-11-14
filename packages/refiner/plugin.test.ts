import { AuthMissingError } from 'corsair/core';
import { refiner, refinerEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof refiner>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations: (keyof typeof refinerEndpointSchemas)[] = [
	'account.get',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'forms.archive',
	'forms.duplicate',
	'forms.history',
	'forms.list',
	'forms.publish',
	'reporting.get',
	'responses.list',
	'responses.store',
	'responses.tag',
	'segments.list',
	'segments.sync',
	'users.identify',
	'users.track',
];

describe('refiner plugin definition', () => {
	const plugin = refiner();

	it('registers as refiner with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('refiner');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the seventeen catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('declares a schema and an output schema for every operation', () => {
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operations,
		);
		for (const operation of operations) {
			const schema = plugin.endpointSchemas?.[operation];
			expect(schema?.input).toBeDefined();
			expect(schema?.output).toBeDefined();
		}
	});

	it('declares metadata with a risk level and description for every operation', () => {
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(operations);
		for (const operation of operations) {
			const entry = plugin.endpointMeta?.[operation];
			expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			expect((entry?.description ?? '').length).toBeGreaterThan(10);
		}
	});

	it('tells an agent that identify traits and stored answers are top-level keys', () => {
		// getSchema lists only the declared fields, so the description is the one
		// place an agent learns that extra keys are traits or survey answers.
		expect(plugin.endpointMeta?.['users.identify']?.description).toMatch(
			/top-level key/,
		);
		expect(plugin.endpointMeta?.['responses.store']?.description).toMatch(
			/top-level keys named by question identifier/,
		);
	});

	it('marks contact deletion as the only destructive operation', () => {
		const destructive = operations.filter(
			(operation) =>
				plugin.endpointMeta?.[operation]?.riskLevel === 'destructive',
		);

		expect(destructive).toEqual(['contacts.delete']);
	});

	it('marks the four that change data as writes', () => {
		const writes = operations.filter(
			(operation) => plugin.endpointMeta?.[operation]?.riskLevel === 'write',
		);

		expect(writes.sort()).toEqual([
			'forms.archive',
			'forms.duplicate',
			'forms.publish',
			'responses.store',
			'responses.tag',
			'segments.sync',
			'users.identify',
			'users.track',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(refinerEndpointSchemas['account.get'].input).toBeDefined();
		expect(Object.keys(refinerEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since Refiner owns every record', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('refiner key builder', () => {
	const plugin = refiner();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(refiner({ key: 'from-options' }), keyContext(null)),
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
