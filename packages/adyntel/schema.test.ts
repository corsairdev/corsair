import {
	AdyntelEndpointInputSchemas,
	AdyntelEndpointOutputSchemas,
	META_ACTIVE_STATUSES,
	META_AD_TYPES,
	META_MEDIA_TYPES,
} from './endpoints/types';
import { AdyntelSchema } from './schema';
import {
	googleAdsResponse,
	linkedinAdsResponse,
	metaAdSearchResponse,
	metaAdsResponse,
	tiktokAdsResponse,
	tiktokKeywordSearchResponse,
} from './test-fixtures';

describe('AdyntelSchema', () => {
	it('declares a semver version', () => {
		expect(AdyntelSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities, because every endpoint is a live read', () => {
		expect(Object.keys(AdyntelSchema.entities)).toEqual([]);
	});
});

// These schemas are the contract: a field Adyntel renames or drops should fail
// a test, not a caller's production run. The fixtures are Adyntel's own
// documented examples, trimmed to the modelled fields.
describe('output schemas accept the documented payloads', () => {
	it('meta.ads', () => {
		// `metaAdsResponse` is the docs' example, which nests `results`; the
		// endpoint flattens before parsing, so the schema is fed the flat form.
		expect(
			AdyntelEndpointOutputSchemas.metaAds.safeParse({
				...metaAdsResponse,
				results: metaAdsResponse.results.flat(),
			}).success,
		).toBe(true);
	});

	it('meta.adSearch', () => {
		expect(
			AdyntelEndpointOutputSchemas.metaAdSearch.safeParse(metaAdSearchResponse)
				.success,
		).toBe(true);
	});

	it('google.ads', () => {
		expect(
			AdyntelEndpointOutputSchemas.googleAds.safeParse(googleAdsResponse)
				.success,
		).toBe(true);
	});

	it('linkedin.ads', () => {
		expect(
			AdyntelEndpointOutputSchemas.linkedinAds.safeParse(linkedinAdsResponse)
				.success,
		).toBe(true);
	});

	it('tiktok.ads', () => {
		expect(
			AdyntelEndpointOutputSchemas.tiktokAds.safeParse(tiktokAdsResponse)
				.success,
		).toBe(true);
	});

	it('tiktok.keywordSearch', () => {
		expect(
			AdyntelEndpointOutputSchemas.tiktokKeywordSearch.safeParse(
				tiktokKeywordSearchResponse,
			).success,
		).toBe(true);
	});
});

describe('output schemas survive a sparse payload', () => {
	it('accepts an empty object, which is what a 204 shapes into', () => {
		for (const schema of Object.values(AdyntelEndpointOutputSchemas)) {
			expect(schema.safeParse({}).success).toBe(true);
		}
	});

	it('accepts JSON null for every modelled meta.ads field', () => {
		const nulled = {
			page_id: null,
			country_code: null,
			continuation_token: null,
			platform: null,
			number_of_ads: null,
			results: null,
		};

		expect(AdyntelEndpointOutputSchemas.metaAds.safeParse(nulled).success).toBe(
			true,
		);
	});

	it('keeps fields the schema does not model', () => {
		const parsed = AdyntelEndpointOutputSchemas.googleAds.parse({
			...googleAdsResponse,
			some_future_field: 'kept',
		});

		// unknown: the point of this test is a field the schema has no type for,
		// so the read has to widen to one key at a time.
		expect((parsed as Record<string, unknown>).some_future_field).toBe('kept');
	});
});

describe('input schemas', () => {
	it('leaves a URL in company_domain to the API to reject', () => {
		// The docs say "bare domain, no https:// or www.". The schema accepts a
		// string and the API answers 204, which reads as "no ads" and is not
		// charged, so a URL is a caller mistake that costs nothing but a retry.
		// Pinning the current behaviour here keeps the decision visible.
		expect(
			AdyntelEndpointInputSchemas.googleAds.safeParse({
				company_domain: 'https://clay.com',
			}).success,
		).toBe(true);
	});

	it('defaults nothing, so an empty Google call is rejected', () => {
		expect(AdyntelEndpointInputSchemas.googleAds.safeParse({}).success).toBe(
			false,
		);
	});

	it('rejects an unknown media type where Adyntel documents an enum', () => {
		const result = AdyntelEndpointInputSchemas.metaAds.safeParse({
			company_domain: 'zoom.com',
			media_type: 'audio',
		});

		expect(result.success).toBe(false);
	});

	it('accepts every documented Meta media type', () => {
		for (const media_type of META_MEDIA_TYPES) {
			expect(
				AdyntelEndpointInputSchemas.metaAds.safeParse({
					company_domain: 'zoom.com',
					media_type,
				}).success,
			).toBe(true);
		}
	});

	it('accepts every documented Meta active status and ad type', () => {
		for (const active_status of META_ACTIVE_STATUSES) {
			expect(
				AdyntelEndpointInputSchemas.metaAds.safeParse({
					company_domain: 'zoom.com',
					active_status,
				}).success,
			).toBe(true);
		}
		for (const ad_type of META_AD_TYPES) {
			expect(
				AdyntelEndpointInputSchemas.metaAds.safeParse({
					company_domain: 'zoom.com',
					ad_type,
				}).success,
			).toBe(true);
		}
	});

	it('requires a webhook-shaped URL for webhook_url', () => {
		expect(
			AdyntelEndpointInputSchemas.tiktokAds.safeParse({
				company_domain: 'gymshark.com',
				webhook_url: 'not-a-url',
			}).success,
		).toBe(false);
	});

	it('requires a YYYY-MM-DD date where the docs give that format', () => {
		expect(
			AdyntelEndpointInputSchemas.linkedinKeywordSearch.safeParse({
				keyword: 'webinar',
				startDate: '01/01/2026',
			}).success,
		).toBe(false);
	});

	it('rejects a negative keyword limit', () => {
		expect(
			AdyntelEndpointInputSchemas.paidVsOrganic.safeParse({
				company_domain: 'lokalise.com',
				limit: -1,
			}).success,
		).toBe(false);
	});

	it('rejects an empty LinkedIn keyword', () => {
		expect(
			AdyntelEndpointInputSchemas.linkedinKeywordSearch.safeParse({
				keyword: '',
			}).success,
		).toBe(false);
	});
});
