import { makeAhrefsRequest } from './client';
import type {
	BacklinksStatsResponse,
	DomainRatingResponse,
	KeywordsOverviewResponse,
} from './endpoints/types';
import { AhrefsEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.AHREFS_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('Ahrefs API type tests', () => {
	it('domain rating returns the expected shape', async () => {
		const response = await makeAhrefsRequest<DomainRatingResponse>(
			'/site-explorer/domain-rating',
			TEST_API_KEY!,
			{
				query: {
					target: 'ahrefs.com',
					date: '2024-01-01',
					protocol: 'both',
				},
			},
		);

		AhrefsEndpointOutputSchemas.getDomainRating.parse(response);
	});

	it('backlinks stats returns the expected shape', async () => {
		const response = await makeAhrefsRequest<BacklinksStatsResponse>(
			'/site-explorer/backlinks-stats',
			TEST_API_KEY!,
			{
				query: {
					target: 'ahrefs.com',
					date: '2024-01-01',
					mode: 'domain',
				},
			},
		);

		AhrefsEndpointOutputSchemas.backlinksStats.parse(response);
	});

	it('keywords overview returns the expected shape', async () => {
		const response = await makeAhrefsRequest<KeywordsOverviewResponse>(
			'/keywords-explorer/overview',
			TEST_API_KEY!,
			{
				query: {
					keywords: 'seo tools,backlink checker',
					country: 'us',
					select: 'keyword,volume,difficulty',
					limit: 10,
				},
			},
		);

		AhrefsEndpointOutputSchemas.keywordsOverview.parse(response);
	});
});

describeIfApiKey('Ahrefs API live checks for the added endpoints', () => {
	it('keyword volume history for "ahrefs" parses', async () => {
		const response = await makeAhrefsRequest(
			'/keywords-explorer/volume-history',
			TEST_API_KEY!,
			{ query: { keyword: 'ahrefs', country: 'us', date_from: '2026-01-01' } },
		);
		const parsed = AhrefsEndpointOutputSchemas.volumeHistory.parse(response);
		expect(parsed.metrics.length).toBeGreaterThan(0);
	});

	it('site metrics for ahrefs.com parse', async () => {
		const response = await makeAhrefsRequest(
			'/site-explorer/metrics',
			TEST_API_KEY!,
			{ query: { target: 'ahrefs.com', date: '2026-01-01' } },
		);
		const parsed = AhrefsEndpointOutputSchemas.siteMetrics.parse(response);
		expect(parsed.metrics).toBeDefined();
	});

	it('management projects list parses', async () => {
		const response = await makeAhrefsRequest(
			'/management/projects',
			TEST_API_KEY!,
		);
		const parsed =
			AhrefsEndpointOutputSchemas.managementProjects.parse(response);
		expect(Array.isArray(parsed.projects)).toBe(true);
	});
});
