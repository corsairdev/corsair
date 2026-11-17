import { AuthMissingError } from 'corsair/core';
import { tomtom, tomtomEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof tomtom>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'routing.calculate',
	'search.fuzzy',
	'search.geocode',
	'search.reverseGeocode',
	'traffic.flow',
	'traffic.incidents',
	'traffic.tile',
];

describe('tomtom plugin definition', () => {
	const plugin = tomtom();

	it('registers as tomtom with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('tomtom');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the seven catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and reads only', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
			// Every wrapped route is a GET over map data.
			expect(entry.riskLevel).toBe('read');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(tomtomEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(tomtomEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('names no route twice', () => {
		const nested = Object.values(plugin.endpoints ?? {}).flatMap((group) =>
			Object.values(group),
		);
		expect(new Set(nested).size).toBe(nested.length);
	});
});

describe('tomtom key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = tomtom({ key: 'inline-key' });
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = tomtom();
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = tomtom();
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
