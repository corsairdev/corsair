import { AuthMissingError } from 'corsair/core';
import {
	GEOKEO_STATUS,
	geokeo,
	geokeoEndpointSchemas,
	parseCoordinate,
	parseDistanceKm,
} from './index';

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
	plugin: ReturnType<typeof geokeo>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = ['geocode.forward', 'geocode.reverse'];

describe('geokeo plugin definition', () => {
	const plugin = geokeo();

	it('registers as geokeo with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('geokeo');
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
		// A caller writes `api.geocode.forward`, so the group is part of the path.
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual(['geocode']);
		expect(Object.keys(plugin.endpoints?.geocode ?? {}).sort()).toEqual([
			'forward',
			'reverse',
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
		expect(Object.keys(geokeoEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operations,
		);
	});
});

describe('geokeo key builder', () => {
	it('prefers the option key', async () => {
		const plugin = geokeo({ key: 'option-key' });

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'option-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = geokeo();

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		const plugin = geokeo();

		// Geokeo has no keyless mode: without a key it answers INVALID_REQUEST.
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

describe('geokeo schemas', () => {
	const forward = geokeoEndpointSchemas['geocode.forward'].input;
	const reverse = geokeoEndpointSchemas['geocode.reverse'].input;

	it('accepts a query and caps it at 50 characters', () => {
		expect(forward.safeParse({ q: 'empire state building' }).success).toBe(
			true,
		);
		expect(forward.safeParse({ q: 'a'.repeat(50) }).success).toBe(true);
		expect(forward.safeParse({ q: 'a'.repeat(51) }).success).toBe(false);
		expect(forward.safeParse({ q: '' }).success).toBe(false);
		expect(forward.safeParse({}).success).toBe(false);
	});

	it('accepts a two-letter country and rejects a name', () => {
		expect(forward.safeParse({ q: 'x', country: 'us' }).success).toBe(true);
		expect(forward.safeParse({ q: 'x', country: 'USA' }).success).toBe(false);
	});

	it('requires both coordinates for a reverse lookup, in range', () => {
		expect(reverse.safeParse({ lat: 40.7, lng: -73.9 }).success).toBe(true);
		expect(reverse.safeParse({ lat: 40.7 }).success).toBe(false);
		expect(reverse.safeParse({ lat: 91, lng: 0 }).success).toBe(false);
		expect(reverse.safeParse({ lat: 0, lng: -181 }).success).toBe(false);
	});

	it('accepts only json or xml, since the schemas describe json', () => {
		expect(forward.safeParse({ q: 'x', format: 'json' }).success).toBe(true);
		expect(forward.safeParse({ q: 'x', format: 'xml' }).success).toBe(true);
		expect(forward.safeParse({ q: 'x', format: 'csv' }).success).toBe(false);
	});

	it('accepts the documented answer, with coordinates as strings', () => {
		const parsed = geokeoEndpointSchemas['geocode.forward'].output.safeParse({
			results: [
				{
					class: 'tourism',
					type: 'attraction',
					address_components: {
						city: 'New York City',
						country: 'United States',
					},
					formatted_address: 'Empire State Building, New York',
					geometry: { location: { lat: '40.7', lng: '-73.9' } },
				},
			],
			credits: 'https://geokeo.com/credits.php',
			status: 'ok',
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts an empty result list, which is how ZERO_RESULTS answers', () => {
		const parsed = geokeoEndpointSchemas['geocode.forward'].output.safeParse({
			results: [],
			status: 'ZERO_RESULTS',
		});
		expect(parsed.success).toBe(true);
	});

	it('names every documented status', () => {
		expect(GEOKEO_STATUS).toEqual({
			OK: 'ok',
			INVALID_REQUEST: 'INVALID_REQUEST',
			ACCESS_DENIED: 'ACCESS_DENIED',
			OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
			ZERO_RESULTS: 'ZERO_RESULTS',
		});
	});
});

describe('coordinate and distance parsing', () => {
	it('reads a coordinate that Geokeo sent as a string', () => {
		expect(parseCoordinate('40.74843124430164')).toBeCloseTo(40.7484, 4);
		expect(parseCoordinate('-73.9856567114413')).toBeCloseTo(-73.9857, 4);
	});

	it('returns null for an absent or unreadable coordinate', () => {
		expect(parseCoordinate(undefined)).toBeNull();
		expect(parseCoordinate('')).toBeNull();
		expect(parseCoordinate('not-a-number')).toBeNull();
	});

	it('strips the unit from a distance', () => {
		expect(parseDistanceKm('0.0010302984507433km')).toBeCloseTo(0.00103, 6);
	});

	it('reads a distance that has no unit suffix', () => {
		expect(parseDistanceKm('1.5')).toBe(1.5);
	});

	it('returns null for an absent or unreadable distance', () => {
		expect(parseDistanceKm(undefined)).toBeNull();
		expect(parseDistanceKm('far')).toBeNull();
	});
});
