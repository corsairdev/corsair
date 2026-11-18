import {
	litescrapeEndpointMeta,
	litescrapeEndpointSchemas,
	litescrapeEndpointsNested,
} from './endpoints/catalog';
import {
	KeysStatusInputSchema,
	KeysStatusResponseSchema,
	KeysUsageInputSchema,
	KeysUsageResponseSchema,
} from './endpoints/keys';
import {
	LitescrapeManifestSchema,
	litescrapeDefinitions,
	litescrapeManifest,
	litescrapeOperations,
} from './endpoints/manifest';
import {
	getLitescrapeInputSchema,
	getLitescrapeOutputSchema,
	litescrapeQueryFields,
} from './endpoints/openapi-schema';
import { LITESCRAPE_OPERATION_IDS } from './endpoints/operation-types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './endpoints/types';
import { LitescrapeSchema } from './schema';
import { litescrapeEntities } from './schema/database';

const ids = litescrapeOperations.map((operation) => operation.id);

// The 36 operations the plugin published before the full import (0.1.x).
// Their names and inputs must keep working for existing callers.
const PUBLISHED_BEFORE = [
	'google.search',
	'google.aiOverview',
	'google.aiMode',
	'google.ads',
	'google.local',
	'google.shopping',
	'google.shoppingProduct',
	'googleMaps.search',
	'googleMaps.reviews',
	'googleMaps.contributorReviews',
	'googleMaps.popularTimes',
	'googleMaps.posts',
	'googleMaps.photoMeta',
	'bing.search',
	'bing.maps',
	'duckduckgo.search',
	'duckduckgo.maps',
	'yelp.search',
	'yelp.reviews',
	'tripadvisor.search',
	'tripadvisor.place',
	'tripadvisor.reviews',
	'appleMaps.places',
	'appleMaps.reviews',
	'googlePlay.apps',
	'googlePlay.games',
	'googlePlay.books',
	'googlePlay.movies',
	'googlePlay.product',
	'googlePlay.reviews',
	'appleAppStore.search',
	'appleAppStore.product',
	'appleAppStore.reviews',
	'web.fetch',
	'web.screenshot',
	'keys.status',
];

function collectRefs(value: unknown, refs: Set<string>): Set<string> {
	if (Array.isArray(value)) {
		for (const item of value) collectRefs(item, refs);
	} else if (typeof value === 'object' && value !== null) {
		for (const [key, item] of Object.entries(value)) {
			if (key === '$ref' && typeof item === 'string') refs.add(item);
			else collectRefs(item, refs);
		}
	}
	return refs;
}

describe('Litescrape schema', () => {
	it('declares a semver version and no entities', () => {
		expect(LitescrapeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(LitescrapeSchema.entities).toBe(litescrapeEntities);
		expect(LitescrapeSchema.entities).toEqual({});
	});
});

describe('litescrape-manifest.json', () => {
	it('matches the manifest schema', () => {
		const result = LitescrapeManifestSchema.safeParse(litescrapeManifest);
		expect(result.error?.issues ?? []).toEqual([]);
	});

	it('has 200 operations with unique ids', () => {
		expect(ids).toHaveLength(200);
		expect(new Set(ids).size).toBe(ids.length);
		expect([...LITESCRAPE_OPERATION_IDS].sort()).toEqual([...ids].sort());
	});

	it('resolves every $ref to a definition', () => {
		const refs = collectRefs(litescrapeManifest, new Set());
		const missing = [...refs].filter((ref) => !(ref in litescrapeDefinitions));
		expect(missing).toEqual([]);
	});

	it('inlines request bodies (no $ref in inputs) and posts to unique paths', () => {
		for (const operation of litescrapeOperations) {
			expect(collectRefs(operation.input, new Set()).size).toBe(0);
			expect(operation.method).toBe('POST');
		}
		const paths = litescrapeOperations.map((operation) => operation.path);
		expect(new Set(paths).size).toBe(paths.length);
	});

	it('gives every operation the query-string timeout field', () => {
		for (const id of ids) {
			expect(litescrapeQueryFields(id)).toEqual(['timeout']);
		}
	});
});

describe('Litescrape endpoint registry', () => {
	const registered = Object.entries(litescrapeEndpointsNested).flatMap(
		([group, actions]) =>
			Object.keys(actions).map((action) => `${group}.${action}`),
	);

	it('registers every manifest operation plus keys.status and keys.usage', () => {
		expect(registered.sort()).toEqual(
			[...ids, 'keys.status', 'keys.usage'].sort(),
		);
		expect(Object.keys(litescrapeEndpointSchemas).sort()).toEqual(
			registered.sort(),
		);
		expect(Object.keys(litescrapeEndpointMeta).sort()).toEqual(
			registered.sort(),
		);
	});

	it('keeps every operation name published before', () => {
		for (const id of PUBLISHED_BEFORE) {
			expect(registered).toContain(id);
		}
	});

	it('marks every operation a read with a description', () => {
		for (const meta of Object.values(litescrapeEndpointMeta)) {
			expect(meta.riskLevel).toBe('read');
			expect(meta.description.length).toBeGreaterThan(10);
		}
	});

	it('builds an input and output schema for every operation', () => {
		for (const id of ids) {
			expect(typeof getLitescrapeInputSchema(id).safeParse).toBe('function');
			expect(typeof getLitescrapeOutputSchema(id).safeParse).toBe('function');
		}
	});

	it('builds schemas lazily through getters on the schema entries', () => {
		const entry = litescrapeEndpointSchemas['amazon.search'];
		expect(entry.input).toBe(getLitescrapeInputSchema('amazon.search'));
		expect(entry.output).toBe(getLitescrapeOutputSchema('amazon.search'));
	});
});

describe('request schemas', () => {
	const bing = () => getLitescrapeInputSchema('bing.search');

	it('requires documented required fields', () => {
		expect(bing().safeParse({}).success).toBe(false);
		expect(bing().safeParse({ q: 'coffee' }).success).toBe(true);
	});

	it('rejects unknown fields (the API sets additionalProperties: false)', () => {
		expect(bing().safeParse({ q: 'coffee', qq: 1 }).success).toBe(false);
	});

	it('keeps enums, limits and nullable optionals', () => {
		expect(bing().safeParse({ q: 'x', device: 'mobile' }).success).toBe(true);
		expect(bing().safeParse({ q: 'x', device: 'watch' }).success).toBe(false);
		expect(bing().safeParse({ q: 'x', location: null }).success).toBe(true);
		expect(
			getLitescrapeInputSchema('copilot.chat').safeParse({ messages: [] })
				.success,
		).toBe(false);
		expect(bing().safeParse({ q: 'x', timeout: 0 }).success).toBe(false);
		expect(bing().safeParse({ q: 'x', timeout: 91 }).success).toBe(false);
		expect(bing().safeParse({ q: 'x', timeout: 30 }).success).toBe(true);
	});

	it('leaves out the route-fixed engine field but keeps other fixed fields', () => {
		expect(bing().safeParse({ q: 'x', engine: 'bing' }).success).toBe(false);
		const product = getLitescrapeInputSchema('appleAppStore.product');
		expect(
			product.safeParse({ product_id: '570060128', type: 'app' }).success,
		).toBe(true);
		expect(
			product.safeParse({ product_id: '570060128', type: 'game' }).success,
		).toBe(false);
	});

	it('takes nested objects and arrays that only a POST body can carry', () => {
		const fetchSchema = getLitescrapeInputSchema('web.fetch');
		expect(
			fetchSchema.safeParse({
				url: 'https://example.com',
				viewport: { width: 1280, height: 800 },
			}).success,
		).toBe(true);
		const chat = getLitescrapeInputSchema('copilot.chat');
		expect(
			chat.safeParse({ messages: [{ role: 'user', content: 'hi' }] }).success,
		).toBe(true);
	});

	it('keeps the input fields the hand-written 0.1 schemas accepted', () => {
		// Spot checks from the pre-import schemas; see PR description for the full diff.
		expect(
			getLitescrapeInputSchema('google.search').safeParse({
				q: 'coffee',
				location: 'Austin, Texas',
				gl: 'us',
				hl: 'en',
				num: 10,
			}).success,
		).toBe(true);
		expect(
			getLitescrapeInputSchema('tripadvisor.place').safeParse({
				place_id: 437641,
			}).success,
		).toBe(true);
	});
});

describe('response schemas', () => {
	const bing = () => getLitescrapeOutputSchema('bing.search');

	it('accepts nulls, missing fields and unknown fields', () => {
		expect(bing().safeParse({}).success).toBe(true);
		expect(
			bing().safeParse({ organic_results: null, brand_new_group: [1] }).success,
		).toBe(true);
		expect(
			bing().safeParse({
				organic_results: [{ position: 1, title: null, extra: 'kept' }],
			}).success,
		).toBe(true);
	});

	it('still checks the documented types', () => {
		expect(bing().safeParse({ organic_results: 'nope' }).success).toBe(false);
		expect(bing().safeParse(null).success).toBe(false);
	});

	it('passes unknown fields through to the caller', () => {
		const parsed = bing().parse({ organic_results: [], new_field: 'x' }) as {
			new_field?: string;
		};
		expect(parsed.new_field).toBe('x');
	});
});

describe('keys schemas', () => {
	it('parses the documented key status payload', () => {
		expect(KeysStatusInputSchema.safeParse({}).success).toBe(true);
		const parsed = KeysStatusResponseSchema.parse({
			remaining_calls: 100000,
			concurrency_limit: 100,
			status: 'active',
			credits_expire_at: null,
			free_calls: 5,
		});
		expect(parsed.remaining_calls).toBe(100000);
		expect(
			KeysStatusResponseSchema.safeParse({ status: 'active' }).success,
		).toBe(false);
	});

	it('limits usage ranges to the documented windows', () => {
		expect(KeysUsageInputSchema.safeParse({ range: '7d' }).success).toBe(true);
		expect(KeysUsageInputSchema.safeParse({ range: '1y' }).success).toBe(false);
		expect(
			KeysUsageResponseSchema.safeParse({
				range: '7d',
				totals: { requests: 3, success_rate: null },
				series: [{ bucket: '2026-11-18', requests: 3 }],
				apis: [],
			}).success,
		).toBe(true);
	});
});

describe('LitescrapeEndpointInputSchemas / OutputSchemas', () => {
	it('lists every operation, keys included, and builds on read', () => {
		const keys = Object.keys(LitescrapeEndpointInputSchemas).sort();
		expect(keys).toEqual([...ids, 'keys.status', 'keys.usage'].sort());
		expect(Object.keys(LitescrapeEndpointOutputSchemas).sort()).toEqual(keys);
		expect(LitescrapeEndpointInputSchemas['bing.search']).toBe(
			getLitescrapeInputSchema('bing.search'),
		);
		expect(LitescrapeEndpointOutputSchemas['keys.status']).toBe(
			KeysStatusResponseSchema,
		);
	});
});
