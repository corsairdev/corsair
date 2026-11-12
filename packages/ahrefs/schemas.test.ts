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
// functions (Search Console and Site Audit from a verified project; Site
// Explorer on ahrefs.com/wordcount.com and Keywords Explorer on "ahrefs",
// Ahrefs' free test targets), trimmed to three rows.
type LiveFixture = { input: unknown; response: unknown };
const liveFixtures = JSON.parse(
	readFileSync(join(__dirname, '__fixtures__', 'live-responses.json'), 'utf8'),
) as Record<string, LiveFixture>;

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
			(path) => !original.has(path) && !(path in liveFixtures),
		);
		expect(missing).toEqual([]);
	});

	it('registers every endpoint in the nested endpoint map', () => {
		const plugin = ahrefs({ key: 'test' });
		const endpoints = plugin.endpoints as Record<
			string,
			Record<string, unknown>
		>;
		for (const path of Object.keys(schemaEntries)) {
			const [group, name] = path.split('.') as [string, string];
			expect(typeof endpoints[group]?.[name]).toBe('function');
		}
	});

	for (const [path, fixture] of Object.entries(liveFixtures)) {
		it(`${path}: input and recorded response parse`, () => {
			const schemas = schemaEntries[path];
			expect(schemas).toBeDefined();
			expect(schemas!.input.safeParse(fixture.input).success).toBe(true);
			expect(schemas!.output.safeParse(fixture.response).success).toBe(true);
		});
	}
});

describe('Ahrefs input validation', () => {
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
