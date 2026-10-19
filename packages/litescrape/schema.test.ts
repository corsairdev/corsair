import {
	BingSearchInputSchema,
	GoogleSearchInputSchema,
	KeysStatusInputSchema,
	KeysStatusResponseSchema,
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
	TripadvisorPlaceInputSchema,
	WebFetchInputSchema,
	WebScreenshotResponseSchema,
} from './endpoints/types';
import { LitescrapeSchema } from './schema';
import { litescrapeEntities } from './schema/database';

describe('Litescrape schema', () => {
	it('declares a semver version', () => {
		expect(LitescrapeSchema.version).toBeDefined();
		expect(LitescrapeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(LitescrapeSchema.entities).toBe(litescrapeEntities);
		expect(LitescrapeSchema.entities).toEqual({});
	});
});

describe('Litescrape endpoint schema registry', () => {
	it('wires a zod input and output schema for every documented endpoint', () => {
		const inputKeys = Object.keys(LitescrapeEndpointInputSchemas).sort();
		const outputKeys = Object.keys(LitescrapeEndpointOutputSchemas).sort();

		expect(inputKeys).toHaveLength(36);
		expect(outputKeys).toEqual(inputKeys);
	});

	it('exposes a parser on every input and output schema', () => {
		for (const schema of Object.values(LitescrapeEndpointInputSchemas)) {
			expect(typeof schema.safeParse).toBe('function');
		}
		for (const schema of Object.values(LitescrapeEndpointOutputSchemas)) {
			expect(typeof schema.safeParse).toBe('function');
		}
	});
});

// Fixtures below mirror the request and response shapes published at
// https://litescrape.com/docs/reference and the per-endpoint pages linked from
// https://litescrape.com/docs.

describe('Litescrape request schemas', () => {
	it('requires a Google query, ludocid or kgmid', () => {
		expect(GoogleSearchInputSchema.safeParse({ q: 'coffee' }).success).toBe(
			true,
		);
		expect(GoogleSearchInputSchema.safeParse({ ludocid: '123' }).success).toBe(
			true,
		);
		expect(GoogleSearchInputSchema.safeParse({}).success).toBe(false);
	});

	it('requires a Bing query', () => {
		expect(BingSearchInputSchema.safeParse({ q: 'coffee' }).success).toBe(true);
		expect(BingSearchInputSchema.safeParse({}).success).toBe(false);
	});

	it('requires a positive Tripadvisor place id', () => {
		expect(
			TripadvisorPlaceInputSchema.safeParse({ place_id: 12345 }).success,
		).toBe(true);
		expect(TripadvisorPlaceInputSchema.safeParse({ place_id: 0 }).success).toBe(
			false,
		);
		expect(TripadvisorPlaceInputSchema.safeParse({}).success).toBe(false);
	});

	it('requires a non-empty web fetch url', () => {
		expect(
			WebFetchInputSchema.safeParse({ url: 'https://example.com' }).success,
		).toBe(true);
		expect(WebFetchInputSchema.safeParse({ url: '' }).success).toBe(false);
		expect(WebFetchInputSchema.safeParse({}).success).toBe(false);
	});

	it('accepts an empty key-status request', () => {
		expect(KeysStatusInputSchema.safeParse({}).success).toBe(true);
	});
});

describe('Litescrape response schemas', () => {
	it('accepts a Google search response and keeps unknown fields', () => {
		const parsed = GoogleSearchInputSchema.safeParse({ q: 'coffee' });
		expect(parsed.success).toBe(true);

		const output = {
			search_metadata: { id: 'abc', status: 'Success' },
			organic_results: [
				{ position: 1, title: 'Coffee', link: 'https://example.com' },
			],
			future_field: 'kept by passthrough',
		};
		const result =
			LitescrapeEndpointOutputSchemas.googleSearch.safeParse(output);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.future_field).toBe('kept by passthrough');
		}
	});

	it('requires the key-status accounting fields', () => {
		expect(
			KeysStatusResponseSchema.safeParse({
				remaining_calls: 100,
				concurrency_limit: 5,
				status: 'active',
			}).success,
		).toBe(true);
		expect(KeysStatusResponseSchema.safeParse({}).success).toBe(false);
	});

	it('requires a screenshot download url', () => {
		expect(
			WebScreenshotResponseSchema.safeParse({
				screenshot_url: 'https://cdn.example.com/1.png',
			}).success,
		).toBe(true);
		expect(WebScreenshotResponseSchema.safeParse({}).success).toBe(false);
	});
});
