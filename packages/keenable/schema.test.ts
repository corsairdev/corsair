import {
	FetchInputSchema,
	FetchResponseSchema,
	SearchInputSchema,
	SearchResponseSchema,
} from './endpoints/types';
import { KeenableSchema } from './schema';
import { keenableEntities } from './schema/database';

describe('Keenable schema', () => {
	it('declares a semver version', () => {
		expect(KeenableSchema.version).toBeDefined();
		expect(KeenableSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(KeenableSchema.entities).toBe(keenableEntities);
		expect(KeenableSchema.entities).toEqual({});
	});
});

// Fixtures mirror the canonical OpenAPI spec shapes for POST /v1/search and
// GET /v1/fetch plus the docs examples (docs /api-reference/search, /fetch).

describe('Search input schema', () => {
	it('accepts a minimal query-only body', () => {
		expect(SearchInputSchema.safeParse({ query: 'keenable' }).success).toBe(
			true,
		);
	});

	it('accepts every documented field', () => {
		const result = SearchInputSchema.safeParse({
			query: 'typescript best practices',
			mode: 'realtime',
			site: 'techcrunch.com',
			acquired_after: '2026-01-01',
			acquired_before: '2026-05-18T14:23:45.123Z',
			published_after: '7d',
			published_before: '30min',
			query_time: '2026-05-18T14:23:45Z',
			snippet_max_length: 180,
			max_results: 50,
		});
		expect(result.success).toBe(true);
	});

	it('rejects a missing or empty query', () => {
		expect(SearchInputSchema.safeParse({}).success).toBe(false);
		expect(SearchInputSchema.safeParse({ query: '' }).success).toBe(false);
	});

	it('rejects an undocumented mode', () => {
		expect(
			SearchInputSchema.safeParse({ query: 'x', mode: 'fast' }).success,
		).toBe(false);
	});

	it('validates date filter formats', () => {
		for (const value of [
			'2026-05-18',
			'2026-05-18T14:23:45',
			'2026-05-18T14:23:45.123+02:00',
			'7d',
			'30min',
			'2mo',
			'1y',
		]) {
			expect(
				SearchInputSchema.safeParse({ query: 'x', published_after: value })
					.success,
			).toBe(true);
		}
		for (const value of ['yesterday', 'last week', '18-05-2026', '']) {
			expect(
				SearchInputSchema.safeParse({ query: 'x', published_after: value })
					.success,
			).toBe(false);
		}
	});

	it('accepts the query_time divergence superset (epoch, w unit)', () => {
		// research §Divergences #3 (UNVERIFIED): only the older spec documents
		// epoch seconds and the `w` unit for query_time.
		for (const value of ['2026-05-18', '1768435200', '2w', '7d']) {
			expect(
				SearchInputSchema.safeParse({ query: 'x', query_time: value }).success,
			).toBe(true);
		}
		expect(
			SearchInputSchema.safeParse({ query: 'x', query_time: 'soon' }).success,
		).toBe(false);
	});

	it('enforces snippet_max_length and max_results ranges', () => {
		expect(
			SearchInputSchema.safeParse({ query: 'x', snippet_max_length: 179 })
				.success,
		).toBe(false);
		expect(
			SearchInputSchema.safeParse({ query: 'x', snippet_max_length: 10001 })
				.success,
		).toBe(false);
		expect(
			SearchInputSchema.safeParse({ query: 'x', snippet_max_length: 180.5 })
				.success,
		).toBe(false);
		expect(
			SearchInputSchema.safeParse({ query: 'x', max_results: 0 }).success,
		).toBe(false);
		expect(
			SearchInputSchema.safeParse({ query: 'x', max_results: 51 }).success,
		).toBe(false);
	});
});

describe('Search output schema', () => {
	it('parses the documented response shape', () => {
		const parsed = SearchResponseSchema.parse({
			query: 'typescript best practices',
			mode: 'pro',
			results: [
				{
					title: 'TypeScript Best Practices 2026',
					url: 'https://example.com/ts-best-practices',
					description: 'A comprehensive guide to modern TypeScript patterns.',
					snippet: 'Use strict mode, prefer interfaces...',
					published_at: '2026-01-15T10:30:00Z',
					acquired_at: '2026-01-16T08:12:34Z',
				},
			],
		});

		expect(parsed.results).toHaveLength(1);
		expect(parsed.results[0]?.url).toBe(
			'https://example.com/ts-best-practices',
		);
	});

	it('accepts results with only the required fields', () => {
		expect(
			SearchResponseSchema.safeParse({
				query: 'x',
				mode: 'realtime',
				results: [{ title: 't', url: 'https://example.com' }],
			}).success,
		).toBe(true);
	});

	it('keeps the legacy warning field via passthrough', () => {
		const parsed = SearchResponseSchema.parse({
			query: 'https://example.com',
			mode: 'pro',
			results: [],
			warning: 'Query was a URL; the page was fetched directly.',
		});
		expect(parsed.results).toEqual([]);
		expect('warning' in parsed).toBe(true);
	});

	it('rejects a response missing results or a result missing url', () => {
		expect(
			SearchResponseSchema.safeParse({ query: 'x', mode: 'pro' }).success,
		).toBe(false);
		expect(
			SearchResponseSchema.safeParse({
				query: 'x',
				mode: 'pro',
				results: [{ title: 't' }],
			}).success,
		).toBe(false);
	});
});

describe('Fetch input schema', () => {
	it('accepts a minimal url and the full param set', () => {
		expect(
			FetchInputSchema.safeParse({ url: 'https://example.com' }).success,
		).toBe(true);
		expect(
			FetchInputSchema.safeParse({
				url: 'https://example.com',
				max_chars: 20000,
				live: true,
				prompt: 'List all pricing tiers with their monthly prices',
			}).success,
		).toBe(true);
	});

	it('rejects a missing or malformed url', () => {
		expect(FetchInputSchema.safeParse({}).success).toBe(false);
		expect(FetchInputSchema.safeParse({ url: 'not a url' }).success).toBe(
			false,
		);
	});

	it('enforces max_chars >= 1 and prompt length <= 2000', () => {
		expect(
			FetchInputSchema.safeParse({ url: 'https://example.com', max_chars: 0 })
				.success,
		).toBe(false);
		expect(
			FetchInputSchema.safeParse({
				url: 'https://example.com',
				prompt: 'x'.repeat(2001),
			}).success,
		).toBe(false);
	});
});

describe('Fetch output schema', () => {
	const base = {
		url: 'https://example.com/ts-best-practices',
		title: 'TypeScript Best Practices 2026',
		description: 'A comprehensive guide to modern TypeScript patterns.',
		author: 'Jane Doe',
		content: '# TypeScript Best Practices 2026\n\nUse strict mode...',
	};

	it('accepts an ISO string published_at', () => {
		const parsed = FetchResponseSchema.parse({
			...base,
			published_at: '2026-01-15T00:00:00Z',
		});
		expect(parsed.published_at).toBe('2026-01-15T00:00:00Z');
	});

	it('accepts a Unix integer published_at (documented divergence)', () => {
		// research §Divergences #2 (UNVERIFIED): the canonical spec says ISO
		// string, the docs example returns Unix seconds.
		const parsed = FetchResponseSchema.parse({
			...base,
			published_at: 1768435200,
		});
		expect(parsed.published_at).toBe(1768435200);
	});

	it('rejects a non string/number published_at and a missing content', () => {
		expect(
			FetchResponseSchema.safeParse({ ...base, published_at: true }).success,
		).toBe(false);
		expect(
			FetchResponseSchema.safeParse({
				url: base.url,
				title: base.title,
			}).success,
		).toBe(false);
	});
});
