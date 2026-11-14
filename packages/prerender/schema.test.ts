import {
	CacheClearInputSchema,
	CachedUrlSchema,
	ChangeSpeedInputSchema,
	PRERENDER_ADAPTIVE_TYPES,
	PRERENDER_MAX_URLS_PER_HOUR,
	PRERENDER_MIN_URLS_PER_HOUR,
	RecacheInputSchema,
	RecacheMetricsSchema,
	SearchInputSchema,
} from './endpoints/types';
import { PrerenderSchema } from './schema';

describe('Prerender plugin schema', () => {
	it('declares a semver version', () => {
		expect(PrerenderSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing', () => {
		expect(PrerenderSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(PrerenderSchema.entities)).toBe(false);
	});
});

describe('documented vocabularies', () => {
	it('pins the two device variants', () => {
		expect(PRERENDER_ADAPTIVE_TYPES).toEqual(['desktop', 'mobile']);
	});

	it('pins the manual speed band the docs state', () => {
		expect(PRERENDER_MIN_URLS_PER_HOUR).toBe(3600);
		expect(PRERENDER_MAX_URLS_PER_HOUR).toBe(36_000);
	});
});

describe('recache input', () => {
	it('accepts a single url', () => {
		expect(
			RecacheInputSchema.safeParse({ url: 'https://example.com/a' }).success,
		).toBe(true);
	});

	it('accepts a list of urls', () => {
		expect(
			RecacheInputSchema.safeParse({
				urls: ['https://example.com/a', 'https://example.com/b'],
			}).success,
		).toBe(true);
	});

	it('rejects neither and both', () => {
		expect(RecacheInputSchema.safeParse({}).success).toBe(false);
		expect(
			RecacheInputSchema.safeParse({
				url: 'https://example.com/a',
				urls: ['https://example.com/b'],
			}).success,
		).toBe(false);
	});

	it('caps the list at the documented 1000', () => {
		const urls = (count: number) =>
			Array.from(
				{ length: count },
				(_, index) => `https://example.com/${index}`,
			);

		expect(RecacheInputSchema.safeParse({ urls: urls(1000) }).success).toBe(
			true,
		);
		expect(RecacheInputSchema.safeParse({ urls: urls(1001) }).success).toBe(
			false,
		);
	});

	it('rejects an empty list', () => {
		expect(RecacheInputSchema.safeParse({ urls: [] }).success).toBe(false);
	});
});

describe('search input', () => {
	it('accepts a substring query or an exact match', () => {
		expect(SearchInputSchema.safeParse({ query: 'example.com' }).success).toBe(
			true,
		);
		expect(
			SearchInputSchema.safeParse({ exactMatch: 'https://example.com/a' })
				.success,
		).toBe(true);
	});

	it('rejects neither, which would return the whole cache', () => {
		expect(SearchInputSchema.safeParse({}).success).toBe(false);
	});

	it('accepts both, since the API says exactMatch wins', () => {
		expect(
			SearchInputSchema.safeParse({
				query: 'example.com',
				exactMatch: 'https://example.com/a',
			}).success,
		).toBe(true);
	});

	it('accepts a paging offset that is a multiple of the page size', () => {
		expect(
			SearchInputSchema.safeParse({ query: 'example.com', start: 400 }).success,
		).toBe(true);
	});

	it('rejects a negative offset', () => {
		expect(
			SearchInputSchema.safeParse({ query: 'example.com', start: -200 })
				.success,
		).toBe(false);
	});
});

describe('cache clear input', () => {
	it('accepts a pattern with a wildcard', () => {
		expect(
			CacheClearInputSchema.safeParse({ query: 'https://example.com%' })
				.success,
		).toBe(true);
	});

	it('rejects an empty pattern, which the API treats as malformed', () => {
		expect(CacheClearInputSchema.safeParse({ query: '' }).success).toBe(false);
	});
});

describe('change speed input', () => {
	it('accepts 0, which restores the automatic delay', () => {
		expect(ChangeSpeedInputSchema.safeParse({ urlsPerHour: 0 }).success).toBe(
			true,
		);
	});

	it('accepts the boundaries of the manual band', () => {
		expect(
			ChangeSpeedInputSchema.safeParse({
				urlsPerHour: PRERENDER_MIN_URLS_PER_HOUR,
			}).success,
		).toBe(true);
		expect(
			ChangeSpeedInputSchema.safeParse({
				urlsPerHour: PRERENDER_MAX_URLS_PER_HOUR,
			}).success,
		).toBe(true);
	});

	it('rejects a value just below the band, which the API would refuse', () => {
		// 1 through 3599 are neither automatic nor manual, so the plugin refuses
		// them before sending.
		for (const value of [1, 100, 3599]) {
			expect(
				ChangeSpeedInputSchema.safeParse({ urlsPerHour: value }).success,
			).toBe(false);
		}
	});

	it('rejects a value above the band and a negative', () => {
		expect(
			ChangeSpeedInputSchema.safeParse({ urlsPerHour: 36_001 }).success,
		).toBe(false);
		expect(ChangeSpeedInputSchema.safeParse({ urlsPerHour: -1 }).success).toBe(
			false,
		);
	});
});

describe('output schemas', () => {
	it('parses a cached URL with its status and dates', () => {
		expect(
			CachedUrlSchema.safeParse({
				url: 'https://example.com/a',
				status: 'Cached',
				lastCached: '2026-01-01T00:00:00Z',
				expires: '2026-01-08T00:00:00Z',
				adaptiveType: 'desktop',
			}).success,
		).toBe(true);
	});

	it('keeps a cache status the schema has not seen', () => {
		expect(
			CachedUrlSchema.safeParse({
				url: 'https://example.com/a',
				status: 'Some New Status',
			}).success,
		).toBe(true);
	});

	it('parses the recache metrics object', () => {
		expect(
			RecacheMetricsSchema.safeParse({
				delayBetweenURLs: 10286,
				num10Sec: 1,
				num30Sec: 3,
				num1Min: 6,
				num10Min: 59,
				num1Hour: 350,
				num1Day: 8400,
			}).success,
		).toBe(true);
	});
});
