import { AuthMissingError } from 'corsair/core';
import { geocodio, geocodioEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof geocodio>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'distance.fromOrigin',
	'distance.matrix',
	'geocode.batch',
	'geocode.batchReverse',
	'geocode.forward',
	'geocode.parse',
	'geocode.reverse',
	'jobs.delete',
	'jobs.get',
	'jobs.list',
	'lists.all',
	'lists.delete',
	'lists.get',
];

/** Flattens the endpoint tree, since `lists` is nested and the rest are flat. */
function catalogPaths() {
	const nested = geocodio().endpoints ?? {};
	const paths: string[] = [];
	const walk = (prefix: string, value: Record<string, unknown>) => {
		for (const [name, entry] of Object.entries(value)) {
			const path = `${prefix}.${name}`;
			if (typeof entry === 'function') paths.push(path);
			else if (entry && typeof entry === 'object') {
				walk(path, entry as Record<string, unknown>);
			}
		}
	};
	walk('', nested as unknown as Record<string, unknown>);
	return paths.map((path) => path.replace(/^\./, '')).sort();
}

describe('geocodio plugin definition', () => {
	const plugin = geocodio();

	it('registers as geocodio with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('geocodio');
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
		expect(catalogPaths()).toEqual(operations);
		// A caller writes `api.geocode.forward`, `api.distance.matrix` and so on.
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'distance',
			'geocode',
			'jobs',
			'lists',
		]);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks only the two delete routes destructive, and both irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([key]) => key)
			.sort();

		expect(destructive).toEqual(['jobs.delete', 'lists.delete']);
		for (const key of destructive) {
			expect(meta[key as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('declares a schema pair for every endpoint, including the nested list group', () => {
		expect(Object.keys(geocodioEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operations,
		);
	});
});

describe('geocodio key builder', () => {
	it('prefers the option key', async () => {
		const plugin = geocodio({ key: 'option-key' });

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'option-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = geocodio();

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		const plugin = geocodio();

		// Geocodio has no keyless mode, so this is a real configuration error.
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

describe('geocodio schemas', () => {
	const forward = geocodioEndpointSchemas['geocode.forward'].input;
	const reverse = geocodioEndpointSchemas['geocode.reverse'].input;
	const batch = geocodioEndpointSchemas['geocode.batch'].input;
	const distanceInput = geocodioEndpointSchemas['distance.fromOrigin'].input;

	it('accepts a single-line address or the components, since both are optional', () => {
		expect(forward.safeParse({ q: '1109 N Highland St' }).success).toBe(true);
		expect(
			forward.safeParse({ street: '1109 N Highland St', city: 'Arlington' })
				.success,
		).toBe(true);
		// An empty object is valid here: the API is what rejects a missing address.
		expect(forward.safeParse({}).success).toBe(true);
	});

	it('caps the geocode limit at 100', () => {
		expect(forward.safeParse({ q: 'x', limit: 100 }).success).toBe(true);
		expect(forward.safeParse({ q: 'x', limit: 101 }).success).toBe(false);
	});

	it('requires a coordinate pair for a reverse lookup', () => {
		expect(reverse.safeParse({ q: '38.8,-77.0' }).success).toBe(true);
		expect(reverse.safeParse({ q: '' }).success).toBe(false);
		expect(reverse.safeParse({}).success).toBe(false);
	});

	it('caps a batch at 10,000 entries', () => {
		expect(batch.safeParse({ addresses: ['a'] }).success).toBe(true);
		expect(
			batch.safeParse({
				addresses: Array.from({ length: 10_001 }, (_, i) => `a${i}`),
			}).success,
		).toBe(false);
	});

	it('accepts haversine on the distance route but not on a geocode', () => {
		expect(
			distanceInput.safeParse({
				origin: 'a',
				destinations: ['b'],
				mode: 'haversine',
			}).success,
		).toBe(true);
		expect(
			geocodioEndpointSchemas['geocode.forward'].input.safeParse({
				q: 'x',
				// `mode` is not a geocode parameter at all, so it is simply absent
				// rather than invalid; the geocode distance mode lives in its own field.
				country: 'US',
			}).success,
		).toBe(true);
	});

	it('accepts the geocode answer shape, with its components and accuracy', () => {
		const parsed = geocodioEndpointSchemas['geocode.forward'].output.safeParse({
			results: [
				{
					address_components: { city: 'Arlington', nation: 'US' },
					formatted_address: 'Arlington, VA',
					location: { lat: 38.88, lng: -77.09 },
					accuracy: 1,
					accuracy_type: 'rooftop',
					match_type: 'exact',
				},
			],
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts an empty result list, which is how "no match" answers', () => {
		const parsed = geocodioEndpointSchemas['geocode.forward'].output.safeParse({
			results: [],
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts the distance answer shape, with both units', () => {
		const parsed = geocodioEndpointSchemas[
			'distance.fromOrigin'
		].output.safeParse({
			mode: 'driving',
			destinations: [
				{ distance_miles: 5.42, distance_km: 8.72, duration_seconds: 1080 },
			],
		});
		expect(parsed.success).toBe(true);
	});
});
