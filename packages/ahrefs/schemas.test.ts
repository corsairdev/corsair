import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	AhrefsEndpointInputSchemas,
	AhrefsEndpointOutputSchemas,
} from './endpoints/types';
import { ahrefs, ahrefsEndpointSchemas } from './index';

describe('Ahrefs schemas', () => {
	it('parses domain rating input and response', () => {
		AhrefsEndpointInputSchemas.getDomainRating.parse({
			target: 'example.com',
			date: '2024-01-01',
		});

		AhrefsEndpointOutputSchemas.getDomainRating.parse({
			domain_rating: {
				ahrefs_rank: 123,
				domain_rating: 76.5,
			},
		});
	});

	it('parses backlinks stats input and response', () => {
		AhrefsEndpointInputSchemas.backlinksStats.parse({
			target: 'example.com',
			date: '2024-01-01',
			mode: 'domain',
		});

		AhrefsEndpointOutputSchemas.backlinksStats.parse({
			metrics: {
				all_time: 10,
				all_time_refdomains: 5,
				live: 8,
				live_refdomains: 4,
			},
		});
	});

	it('parses keywords overview input and response', () => {
		AhrefsEndpointInputSchemas.keywordsOverview.parse({
			keywords: ['seo tools', 'backlink checker'],
			country: 'us',
			select: 'keyword,volume,difficulty',
		});

		AhrefsEndpointOutputSchemas.keywordsOverview.parse({
			keywords: [
				{
					keyword: 'seo tools',
					volume: 1000,
					difficulty: 42,
				},
			],
		});
	});
});

// Real responses recorded from api.ahrefs.com through the plugin's endpoint
// functions (Search Console, Site Audit, Web Analytics and Rank Tracker from
// a verified project; Site Explorer on ahrefs.com/wordcount.com and Keywords
// Explorer on "ahrefs", Ahrefs' free test targets; management writes on
// throwaway objects), trimmed to three rows and anonymised.
// Fixture inputs and responses are raw JSON; the schemas under test decide
// whether they are valid, so they stay unknown here.
type LiveFixture = { input: unknown; response: unknown };
const readFixtures = (file: string) =>
	JSON.parse(
		readFileSync(join(__dirname, '__fixtures__', file), 'utf8'),
	) as Record<string, LiveFixture>;
const liveFixtures = readFixtures('live-responses.json');
// Built from Ahrefs' OpenAPI spec, not recorded: these need a connected
// social channel or an existing post, and the test account has neither.
const specSamples = readFixtures('spec-samples.json');
const allFixtures = { ...liveFixtures, ...specSamples };

// The schema map is indexed by a runtime string, so each entry is read through
// the one method these tests call, on raw (unknown) JSON.
type EndpointSchemaEntry = {
	input: { safeParse(value: unknown): { success: boolean } };
	output: { safeParse(value: unknown): { success: boolean } };
};
const schemaEntries = ahrefsEndpointSchemas as Record<
	string,
	EndpointSchemaEntry
>;

describe('Ahrefs recorded responses', () => {
	it('has a recorded response for every endpoint added beyond the original nine', () => {
		const original = new Set([
			'siteExplorer.getDomainRating',
			'siteExplorer.backlinksStats',
			'siteExplorer.organicKeywords',
			'siteExplorer.refdomains',
			'siteExplorer.topPages',
			'keywordsExplorer.overview',
			'rankTracker.overview',
			'serp.overview',
		]);
		const missing = Object.keys(schemaEntries).filter(
			(path) => !original.has(path) && !(path in allFixtures),
		);
		expect(missing).toEqual([]);
	});

	it('registers every endpoint in the nested endpoint map', () => {
		const plugin = ahrefs({ key: 'test' });
		// Only the presence of each function is checked, not its signature.
		const endpoints = plugin.endpoints as Record<
			string,
			Record<string, unknown>
		>;
		for (const path of Object.keys(schemaEntries)) {
			const [group, name] = path.split('.') as [string, string];
			expect(typeof endpoints[group]?.[name]).toBe('function');
		}
	});

	for (const [path, fixture] of Object.entries(allFixtures)) {
		const kind = path in specSamples ? 'spec sample' : 'recorded response';
		it(`${path}: input and ${kind} parse`, () => {
			const schemas = schemaEntries[path];
			expect(schemas).toBeDefined();
			expect(schemas!.input.safeParse(fixture.input).success).toBe(true);
			expect(schemas!.output.safeParse(fixture.response).success).toBe(true);
		});
	}
});

describe('Ahrefs endpoint risk levels', () => {
	const meta = ahrefs({ key: 'test' }).endpointMeta as Record<
		string,
		{ riskLevel: string }
	>;

	it('marks deletes destructive and creates or updates as writes', () => {
		for (const [path, entry] of Object.entries(meta)) {
			const name = path.split('.')[1] ?? '';
			if (/^delete/.test(name)) {
				expect([path, entry.riskLevel]).toEqual([path, 'destructive']);
			} else if (/^(create|update|add)/.test(name)) {
				expect([path, entry.riskLevel]).toEqual([path, 'write']);
			} else {
				expect([path, entry.riskLevel]).toEqual([path, 'read']);
			}
		}
	});

	it('exposes social posting only as explicit write actions', () => {
		expect(meta['socialMedia.createPost']?.riskLevel).toBe('write');
		expect(meta['socialMedia.deletePost']?.riskLevel).toBe('destructive');
	});
});

describe('Ahrefs input validation', () => {
	it('accepts the SERP overview filters Ahrefs documents', () => {
		const parsed = AhrefsEndpointInputSchemas.serpOverview.parse({
			keyword: 'ahrefs',
			country: 'us',
			select: 'position,url',
			comparison_countries: 'gb,de',
			type: 'organic,snippet',
		});
		expect(parsed).toMatchObject({
			comparison_countries: 'gb,de',
			type: 'organic,snippet',
		});
	});

	it('accepts all as the country for Keywords Explorer', () => {
		expect(
			AhrefsEndpointInputSchemas.matchingTerms.safeParse({
				keywords: 'ahrefs',
				country: 'all',
				select: 'keyword,volume',
			}).success,
		).toBe(true);
		expect(
			AhrefsEndpointInputSchemas.volumeHistory.safeParse({
				keyword: 'ahrefs',
				country: 'all',
			}).success,
		).toBe(true);
		expect(
			AhrefsEndpointInputSchemas.keywordsOverview.safeParse({
				keywords: 'ahrefs',
				country: 'all',
				select: 'keyword,volume',
			}).success,
		).toBe(true);
		expect(
			AhrefsEndpointInputSchemas.volumeHistory.safeParse({
				keyword: 'ahrefs',
				country: 'usa',
			}).success,
		).toBe(false);
	});

	it('accepts comma-separated models and countries on Brand Radar reads', () => {
		expect(
			AhrefsEndpointInputSchemas.brandRadarSovOverview.safeParse({
				brand: 'ahrefs,ahrefs seo',
				data_source: 'chatgpt,perplexity',
				country: 'us,gb',
			}).success,
		).toBe(true);
		expect(
			AhrefsEndpointInputSchemas.brandRadarAiResponses.safeParse({
				select: 'question,volume',
				data_source: 'chatgpt,gemini',
				country: 'us,de,fr',
			}).success,
		).toBe(true);
		expect(
			AhrefsEndpointInputSchemas.brandRadarSovOverview.safeParse({
				data_source: '',
			}).success,
		).toBe(false);
	});

	it('accepts Web Analytics counts sent as numeric strings', () => {
		expect(
			AhrefsEndpointOutputSchemas.webAnalyticsStats.safeParse({
				stats: { visitors: '536', pageviews: '689', session_bounce_rate: 90.7 },
			}).success,
		).toBe(true);
	});

	it('requires a granularity for Web Analytics charts', () => {
		expect(
			AhrefsEndpointInputSchemas.webAnalyticsBrowsersChart.safeParse({
				project_id: 1,
			}).success,
		).toBe(false);
	});

	it('requires a UTM parameter for UTM tables', () => {
		expect(
			AhrefsEndpointInputSchemas.webAnalyticsUtmParams.safeParse({
				project_id: 1,
			}).success,
		).toBe(false);
	});

	it('rejects a social post without channels or with an unknown timing', () => {
		expect(
			AhrefsEndpointInputSchemas.socialMediaCreatePost.safeParse({
				text_content: 'hello',
				timing: 'draft',
			}).success,
		).toBe(false);
		expect(
			AhrefsEndpointInputSchemas.socialMediaCreatePost.safeParse({
				channel_ids: ['ch_1'],
				text_content: 'hello',
				timing: 'later',
			}).success,
		).toBe(false);
	});

	it('requires prompt frequencies on Brand Radar report updates', () => {
		expect(
			AhrefsEndpointInputSchemas.managementUpdateBrandRadarReport.safeParse({
				report_id: 'r1',
			}).success,
		).toBe(false);
	});

	it('requires a project or portfolio for Search Console reads', () => {
		expect(
			AhrefsEndpointInputSchemas.gscKeywords.safeParse({
				date_from: '2026-10-01',
			}).success,
		).toBe(false);
		expect(
			AhrefsEndpointInputSchemas.gscKeywords.safeParse({
				date_from: '2026-10-01',
				portfolio_id: 12,
			}).success,
		).toBe(true);
	});

	it('requires seed keywords or a keyword list for keyword ideas', () => {
		expect(
			AhrefsEndpointInputSchemas.matchingTerms.safeParse({
				select: 'keyword,volume',
				country: 'us',
			}).success,
		).toBe(false);
		expect(
			AhrefsEndpointInputSchemas.volumeByCountry.safeParse({
				keyword_list_id: 3,
			}).success,
		).toBe(true);
	});

	it('rejects malformed dates and missing required fields', () => {
		expect(
			AhrefsEndpointInputSchemas.metricsHistory.safeParse({
				target: 'ahrefs.com',
				date_from: '11/01/2026',
			}).success,
		).toBe(false);
		expect(
			AhrefsEndpointInputSchemas.siteAuditPageContent.safeParse({
				project_id: 1,
				select: 'page_text_md',
			}).success,
		).toBe(false);
	});

	it('rejects a Search Console response without its row array', () => {
		expect(
			AhrefsEndpointOutputSchemas.gscKeywords.safeParse({ rows: [] }).success,
		).toBe(false);
	});
});
