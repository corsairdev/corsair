import { AuthMissingError } from 'corsair/core';
import { geoapify, geoapifyEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof geoapify>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'geo.boundaries',
	'geo.elevation',
	'geo.ip',
	'geo.postcodeList',
	'geo.postcodeSearch',
	'geo.timezone',
	'geocode.autocomplete',
	'geocode.forward',
	'geocode.reverse',
	'places.details',
	'places.search',
	'routing.isoline',
	'routing.matrix',
	'routing.route',
];

describe('geoapify plugin definition', () => {
	const plugin = geoapify();

	it('registers as geoapify with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('geoapify');
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
		// A caller writes `api.geocode.forward`, `api.routing.route` and so on.
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'geo',
			'geocode',
			'places',
			'routing',
		]);
		expect(Object.keys(plugin.endpoints?.geocode ?? {}).sort()).toEqual([
			'autocomplete',
			'forward',
			'reverse',
		]);
	});

	it('gives every endpoint a description and a read risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			// Every Geoapify call computes an answer and changes nothing. Each one
			// uses credits, but metered lookups stay read (as in the Ahrefs plugin).
			expect(entry.riskLevel).toBe('read');
		}
	});

	it('declares a schema pair for every endpoint', () => {
		expect(Object.keys(geoapifyEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operations,
		);
	});
});

describe('geoapify key builder', () => {
	it('prefers the option key', async () => {
		const plugin = geoapify({ key: 'option-key' });

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'option-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = geoapify();

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		const plugin = geoapify();

		// Geoapify has no keyless mode, so this is a real configuration error.
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

describe('geoapify schemas', () => {
	const forward = geoapifyEndpointSchemas['geocode.forward'].input;
	const places = geoapifyEndpointSchemas['places.search'].input;
	const matrix = geoapifyEndpointSchemas['routing.matrix'].input;

	it('accepts a text address and rejects an empty one', () => {
		expect(forward.safeParse({ text: 'Berlin' }).success).toBe(true);
		expect(forward.safeParse({ text: '' }).success).toBe(false);
		expect(forward.safeParse({}).success).toBe(false);
	});

	it('caps the limit at 100 on geocoding and 500 on places', () => {
		expect(forward.safeParse({ text: 'x', limit: 100 }).success).toBe(true);
		expect(forward.safeParse({ text: 'x', limit: 101 }).success).toBe(false);
		expect(places.safeParse({ categories: ['a'], limit: 500 }).success).toBe(
			true,
		);
		expect(places.safeParse({ categories: ['a'], limit: 501 }).success).toBe(
			false,
		);
	});

	it('accepts only the documented place types', () => {
		expect(forward.safeParse({ text: 'x', type: 'city' }).success).toBe(true);
		expect(forward.safeParse({ text: 'x', type: 'planet' }).success).toBe(
			false,
		);
	});

	it('accepts only global or eu as the region', () => {
		expect(forward.safeParse({ text: 'x', region: 'eu' }).success).toBe(true);
		expect(forward.safeParse({ text: 'x', region: 'us' }).success).toBe(false);
	});

	it('caps a country code list at ten', () => {
		const eleven = [
			'de',
			'at',
			'ch',
			'fr',
			'it',
			'es',
			'pt',
			'nl',
			'be',
			'dk',
			'se',
		];
		expect(forward.safeParse({ text: 'x', countrycodes: eleven }).success).toBe(
			false,
		);
		expect(
			forward.safeParse({ text: 'x', countrycodes: eleven.slice(0, 10) })
				.success,
		).toBe(true);
	});

	it('rejects a country code that is not two letters', () => {
		expect(
			forward.safeParse({ text: 'x', countrycodes: ['Germany'] }).success,
		).toBe(false);
	});

	it('requires a source and a target in a matrix', () => {
		const point = { lat: 52.5163, lon: 13.3777 };
		expect(
			matrix.safeParse({ mode: 'drive', sources: [point], targets: [point] })
				.success,
		).toBe(true);
		expect(
			matrix.safeParse({ mode: 'drive', sources: [], targets: [point] })
				.success,
		).toBe(false);
	});

	it('accepts the json shape a geocode answer takes', () => {
		const parsed = geoapifyEndpointSchemas['geocode.forward'].output.safeParse({
			results: [{ lat: 52.5, lon: 13.4, formatted: '10115 Berlin, Germany' }],
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts an unreachable matrix cell, which carries an error instead', () => {
		const parsed = geoapifyEndpointSchemas['routing.matrix'].output.safeParse({
			sources_to_targets: [[{ distance: 1, time: 1 }, { error: 'NoRoute' }]],
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts a place with no optional fields beyond its ID', () => {
		const parsed = geoapifyEndpointSchemas['places.search'].output.safeParse({
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: { place_id: 'abc', lat: 1, lon: 2 },
				},
			],
		});
		expect(parsed.success).toBe(true);
	});
});
