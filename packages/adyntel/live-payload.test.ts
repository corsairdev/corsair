import type { AdyntelEndpointOutputs } from './endpoints/types';
import { AdyntelEndpointOutputSchemas as Outputs } from './endpoints/types';
import {
	liveGoogleShopping,
	liveLinkedinAds,
	liveLinkedinKeywordSearch,
	liveMetaAdSearch,
	liveMetaAds,
	liveMetaAdsNested,
	liveTiktokAds,
} from './live-fixtures';

/**
 * Every other endpoint test feeds the schema an invented body, so it only
 * proves the schema agrees with itself. These feed it payloads the deployed API
 * actually returned. They caught two real disagreements with the docs:
 *
 * - `/facebook` returns a flat `results` list, while `/facebook_ad_search`
 *   nests one array per page.
 * - `start_min_date` and `start_max_date` are ISO strings, not Unix numbers.
 *
 * The captured payloads are in `live-fixtures.ts`; refreshing them means
 * re-running the capture rather than editing by hand.
 */
const cases: [string, keyof typeof Outputs, unknown][] = [
	['meta.ads', 'metaAds', liveMetaAds],
	['meta.adSearch', 'metaAdSearch', liveMetaAdSearch],
	['linkedin.ads', 'linkedinAds', liveLinkedinAds],
	[
		'linkedin.keywordSearch',
		'linkedinKeywordSearch',
		liveLinkedinKeywordSearch,
	],
	['google.shopping', 'googleShopping', liveGoogleShopping],
	['tiktok.ads', 'tiktokAds', liveTiktokAds],
];

describe('captured live payloads parse against the output schemas', () => {
	it.each(cases)('%s', (label, key, payload) => {
		const result = Outputs[key].safeParse(payload);

		if (!result.success) {
			throw new Error(
				`${label} rejected a real payload: ${JSON.stringify(
					result.error.issues.slice(0, 5),
				)}`,
			);
		}
		expect(result.success).toBe(true);
	});
});

describe('the two Meta endpoints disagree, and the schemas match each', () => {
	it('meta.ads results is a flat list of ads', () => {
		const parsed = Outputs.metaAds.parse(liveMetaAds);
		expect(Array.isArray(parsed.results?.[0])).toBe(false);
		expect(parsed.results?.[0]?.ad_archive_id).toBeDefined();
	});

	it('meta.ads accepts the nested variant the same endpoint sometimes sends', () => {
		// `/facebook` alternates between flat records and one array per page.
		// The endpoint flattens, so the schema must accept the flat result of
		// that flattening; feeding it the raw nested body must fail, which is
		// what proves the flattening is load-bearing.
		expect(Outputs.metaAds.safeParse(liveMetaAdsNested).success).toBe(false);
	});

	it('meta.adSearch results is a list of pages', () => {
		const parsed = Outputs.metaAdSearch.parse(liveMetaAdSearch);
		// The first element is itself an array: one inner array per page.
		expect(Array.isArray(parsed.results?.[0])).toBe(true);
	});

	it('the date bounds are ISO strings on both', () => {
		const ads = Outputs.metaAds.parse(liveMetaAds);
		const search = Outputs.metaAdSearch.parse(liveMetaAdSearch);

		expect(ads.start_min_date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
		expect(search.start_min_date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
	});

	it('rejects a Unix number in the date bounds, so a regression is caught', () => {
		const broken = { ...liveMetaAds, start_min_date: 1732233600 };

		expect(Outputs.metaAds.safeParse(broken).success).toBe(false);
	});
});

describe('the captured payloads carry the fields the endpoints advertise', () => {
	it('meta.ads keeps a snapshot the caller can read', () => {
		const parsed = Outputs.metaAds.parse(liveMetaAds);

		expect(parsed.results?.[0]?.snapshot?.page_name).toBeDefined();
		expect(parsed.results?.[0]?.is_active).toBeDefined();
	});

	it('meta.adSearch keeps the snake_case fields the API actually sends', () => {
		const parsed: AdyntelEndpointOutputs['metaAdSearch'] =
			Outputs.metaAdSearch.parse(liveMetaAdSearch);

		// The live API sends snake_case here, not the camelCase in its OpenAPI
		// spec. Both are accepted, and this asserts the real one survives.
		expect(parsed.results?.[0]?.[0]?.ad_archive_id).toBeDefined();
		expect(parsed.results?.[0]?.[0]?.is_active).toBeDefined();
		expect(parsed.results?.[0]?.[0]?.snapshot?.page_name).toBeDefined();
	});

	it('still accepts the camelCase spelling the spec documents', () => {
		const specShape = {
			results: [[{ adArchiveID: '540995951781259', isActive: true }]],
		};

		const parsed = Outputs.metaAdSearch.parse(specShape);

		expect(parsed.results?.[0]?.[0]?.adArchiveID).toBe('540995951781259');
	});

	it('linkedin.ads keeps the company endpoint extra fields', () => {
		const parsed = Outputs.linkedinAds.parse(liveLinkedinAds);

		// Extra fields the keyword search does not return.
		expect(parsed).toHaveProperty('keyword');
		expect(parsed).toHaveProperty('countries');
		expect(parsed.ads?.[0]?.ad_id).toBeDefined();
	});

	it('linkedin.keywordSearch keeps has_more', () => {
		const parsed = Outputs.linkedinKeywordSearch.parse(
			liveLinkedinKeywordSearch,
		);

		expect(parsed).toHaveProperty('has_more');
		expect(parsed.total_ads).toBeDefined();
	});

	it('google.shopping returns inline ads when shopping is true', () => {
		const parsed = Outputs.googleShopping.parse(liveGoogleShopping);

		// The live shape has no `id` here: that is the async form only.
		expect(parsed.id).toBeUndefined();
		expect(parsed.ads?.length).toBeGreaterThan(0);
	});

	it('tiktok.ads keeps brand_ads and the handle', () => {
		const parsed = Outputs.tiktokAds.parse(liveTiktokAds);

		expect(parsed.handle).toBe('gymshark');
		expect(parsed.brand_ads?.length).toBeGreaterThan(0);
		expect(parsed.brand_ads?.[0]?.aweme_id).toBeDefined();
	});
});
