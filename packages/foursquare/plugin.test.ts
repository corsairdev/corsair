import { AuthMissingError, BASE_AUTH_FIELDS } from 'corsair/core';
import {
	foursquare,
	foursquareAuthConfig,
	foursquareEndpointSchemas,
} from './index';

const OPERATIONS = [
	'places.autocomplete',
	'places.get',
	'places.match',
	'places.photos',
	'places.search',
	'places.tips',
] as const;

/**
 * Nested `group -> function` maps, as the plugin registers them.
 * unknown: only the keys are walked, so the handler leaf type is never used.
 */
type NestedMap = Record<string, Record<string, unknown>>;

function flatten(tree: NestedMap): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(tree)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

/**
 * unknown: `endpoints` and `endpointMeta` are optionals on `CorsairPlugin`, so
 * the assertions widen them one cast at a time. Typing each leaf precisely would
 * mean restating the whole plugin surface in the test.
 */
function asNested(value: unknown): NestedMap {
	return value as NestedMap;
}

describe('foursquare plugin definition', () => {
	const plugin = foursquare();
	// unknown: same widening as `asNested`, for the meta map.
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string }
	>;

	it('registers as foursquare with api_key auth', () => {
		expect(plugin.id).toBe('foursquare');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(foursquareAuthConfig)).toEqual(['api_key']);
	});

	it('lists each account field once', () => {
		// `webhook_signature` is already a base api_key field; declaring it again
		// in the plugin's auth config lists it twice.
		// Core builds the account field list as the base fields plus the plugin's.
		const extra: readonly string[] =
			(foursquareAuthConfig.api_key as { account?: readonly string[] })
				.account ?? [];
		const fields = [...BASE_AUTH_FIELDS.api_key.account, ...extra];
		expect(fields).toEqual(['api_key', 'webhook_signature']);
	});

	it('declares no inbound webhooks, which the Places API does not send', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers exactly the six read operations', () => {
		expect(flatten(asNested(plugin.endpoints))).toEqual([...OPERATIONS]);
	});

	it('marks every operation as a read', () => {
		// Nothing here mutates Foursquare, so a read-only caller can use all of it.
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		for (const entry of Object.values(meta)) {
			expect(entry.riskLevel).toBe('read');
			expect(entry.description.length).toBeGreaterThan(10);
		}
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(foursquareEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
		for (const schemas of Object.values(foursquareEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('rejects an unknown search sort before sending', () => {
		const search = foursquareEndpointSchemas['places.search'];
		expect(search.input.safeParse({ sort: 'DISTANCE' }).success).toBe(true);
		// The API documents RELEVANCE, RATING, DISTANCE and POPULARITY.
		expect(search.input.safeParse({ sort: 'PRICE' }).success).toBe(false);
	});

	it('accepts every search sort the reference lists', () => {
		const search = foursquareEndpointSchemas['places.search'];
		for (const sort of ['RELEVANCE', 'RATING', 'DISTANCE', 'POPULARITY']) {
			expect(search.input.safeParse({ sort }).success).toBe(true);
		}
	});

	it('accepts only the tel_format values the reference lists', () => {
		const search = foursquareEndpointSchemas['places.search'];
		expect(search.input.safeParse({ tel_format: 'E164' }).success).toBe(true);
		expect(search.input.safeParse({ tel_format: 'NATIONAL' }).success).toBe(
			true,
		);
		expect(
			search.input.safeParse({ tel_format: 'INTERNATIONAL' }).success,
		).toBe(false);
	});

	it('accepts only POPULAR and NEWEST as a tips or photos sort', () => {
		for (const path of ['places.tips', 'places.photos'] as const) {
			const { input } = foursquareEndpointSchemas[path];
			const base = { fsq_place_id: '4b28f2aef964a520f9d024e3' };
			expect(input.safeParse({ ...base, sort: 'POPULAR' }).success).toBe(true);
			expect(input.safeParse({ ...base, sort: 'NEWEST' }).success).toBe(true);
			// Not in the reference's enum for either endpoint.
			expect(input.safeParse({ ...base, sort: 'OLDEST' }).success).toBe(false);
		}
	});

	it('accepts only place, search and geo as autocomplete types', () => {
		const { input } = foursquareEndpointSchemas['places.autocomplete'];
		expect(
			input.safeParse({ query: 'star', types: ['place', 'search', 'geo'] })
				.success,
		).toBe(true);
		expect(input.safeParse({ query: 'star', bias: 'geo' }).success).toBe(true);
		// The current reference no longer lists address for types or bias.
		expect(input.safeParse({ query: 'star', types: ['address'] }).success).toBe(
			false,
		);
		expect(input.safeParse({ query: 'star', bias: 'address' }).success).toBe(
			false,
		);
	});

	it('rejects a search limit above the documented cap of 50', () => {
		const search = foursquareEndpointSchemas['places.search'];
		expect(search.input.safeParse({ limit: 50 }).success).toBe(true);
		expect(search.input.safeParse({ limit: 51 }).success).toBe(false);
	});

	it('rejects a radius above 100000 metres', () => {
		const search = foursquareEndpointSchemas['places.search'];
		expect(search.input.safeParse({ radius: 100_000 }).success).toBe(true);
		expect(search.input.safeParse({ radius: 100_001 }).success).toBe(false);
	});

	it('requires the four match fields the API documents', () => {
		const match = foursquareEndpointSchemas['places.match'];
		const base = {
			name: 'Wrigley Field',
			address: '1060 W Addison St',
			city: 'Chicago',
			cc: 'US',
		};
		expect(match.input.safeParse(base).success).toBe(true);
		for (const field of ['name', 'address', 'city', 'cc'] as const) {
			const { [field]: _removed, ...rest } = base;
			expect(match.input.safeParse(rest).success).toBe(false);
		}
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = foursquare({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});
});

describe('foursquare key builder', () => {
	function ctx(stored: string | null) {
		return {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
			keys: { get_api_key: jest.fn().mockResolvedValue(stored) },
		};
	}

	it('prefers an explicit key without reading the store', async () => {
		const fixture = ctx('stored');

		const key = await foursquare({ key: 'explicit' }).keyBuilder?.(
			fixture as never,
			'endpoint',
		);

		expect(key).toBe('explicit');
		expect(fixture.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored Service Key', async () => {
		await expect(
			foursquare().keyBuilder?.(ctx('stored') as never, 'endpoint'),
		).resolves.toBe('stored');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		await expect(
			foursquare().keyBuilder?.(ctx(null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses a webhook source, because there are no webhooks', async () => {
		await expect(
			foursquare().keyBuilder?.(ctx('stored') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
