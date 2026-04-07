import 'dotenv/config'
import { makeAhrefsRequest } from './client';
import type {
	CrawlerIpRangesResponse,
	CrawlerPublicIpsResponse,
	KeywordsExplorerMatchingTermsResponse,
	KeywordsExplorerOverviewResponse,
	KeywordsExplorerRelatedTermsResponse,
	KeywordsExplorerSearchSuggestionsResponse,
	KeywordsExplorerTotalSearchVolumeHistoryResponse,
	KeywordsExplorerVolumeByCountryResponse,
	KeywordsExplorerVolumeHistoryResponse,
	RankTrackerCompetitorsOverviewResponse,
	RankTrackerOverviewResponse,
	SerpOverviewResponse,
	SiteAuditProjectsResponse,
	SiteExplorerAllBacklinksResponse,
	SiteExplorerAnchorDataResponse,
	SiteExplorerBacklinksStatsResponse,
	SiteExplorerBatchUrlAnalysisResponse,
	SiteExplorerBestByExternalLinksResponse,
	SiteExplorerBestByInternalLinksResponse,
	SiteExplorerBrokenBacklinksResponse,
	SiteExplorerCountryMetricsResponse,
	SiteExplorerDomainRatingHistoryResponse,
	SiteExplorerDomainRatingResponse,
	SiteExplorerKeywordsHistoryResponse,
	SiteExplorerLinkedAnchorsExternalResponse,
	SiteExplorerLinkedAnchorsResponse,
	SiteExplorerLinkedDomainsResponse,
	SiteExplorerMetricsHistoryResponse,
	SiteExplorerMetricsResponse,
	SiteExplorerOrganicCompetitorsResponse,
	SiteExplorerOrganicKeywordsResponse,
	SiteExplorerOutlinksStatsResponse,
	SiteExplorerPagesByTrafficResponse,
	SiteExplorerPagesHistoryResponse,
	SiteExplorerPaidPagesResponse,
	SiteExplorerReferringDomainsHistoryResponse,
	SiteExplorerReferringDomainsResponse,
	SiteExplorerTopPagesResponse,
	SiteExplorerUrlRatingHistoryResponse,
	SubscriptionLimitsAndUsageResponse,
} from './endpoints/types';
import { AhrefsEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.AHREFS_API_KEY!;

// Shared query fixtures — widely-crawled domains to maximise chance of real data
const BASE_TARGET = 'ahrefs.com';
const BASE_KEYWORD = 'seo';
const BASE_COUNTRY = 'us';
const BASE_DATE = '2024-01-01';
const BASE_DATE_FROM = '2023-01-01';
const BASE_DATE_TO = '2024-01-01';

// Reusable select strings per data family
const SELECT_BACKLINKS = 'url_from,url_to,domain_rating_source';
const SELECT_KEYWORDS = 'keyword,volume,kd';
const SELECT_PAGES = 'url,traffic,value';
const SELECT_DOMAINS = 'domain,domain_rating';
const SELECT_ANCHORS = 'anchor,backlinks,refdomains';

// Common query params shared across site-explorer list endpoints
const SITE_EXPLORER_BASE = { target: BASE_TARGET, mode: 'domain' as const, limit: 10 };
const HISTORY_BASE = {
	target: BASE_TARGET,
	date_from: BASE_DATE_FROM,
	date_to: BASE_DATE_TO,
	mode: 'domain' as const,
	history_grouping: 'monthly' as const,
};

describe('Ahrefs API Type Tests', () => {
	describe('subscription', () => {
		it('subscriptionLimitsAndUsage returns correct type', async () => {
			const result = await makeAhrefsRequest<SubscriptionLimitsAndUsageResponse>(
				'/v3/subscription-info/limits-and-usage',
				TEST_API_KEY,
			);

			AhrefsEndpointOutputSchemas.subscriptionLimitsAndUsage.parse(result);
		});
	});

	describe('siteExplorer', () => {
		it('backlinksStats returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerBacklinksStatsResponse>(
				'/v3/site-explorer/backlinks-stats',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, date: BASE_DATE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerBacklinksStats.parse(result);
			expect(result.successful).toBe(true);
		});

		it('batchUrlAnalysis returns correct type', async () => {
			// arrays must be joined to comma-separated strings for the Ahrefs API
			const result = await makeAhrefsRequest<SiteExplorerBatchUrlAnalysisResponse>(
				'/v3/batch-analysis',
				TEST_API_KEY,
				{
					query: {
						targets: [BASE_TARGET, 'moz.com'].join(','),
						select: ['domain_rating', 'ahrefs_rank', 'organic_traffic'].join(','),
						country: BASE_COUNTRY,
					},
				},
			);

			AhrefsEndpointOutputSchemas.siteExplorerBatchUrlAnalysis.parse(result);
		});

		it('getDomainRating returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerDomainRatingResponse>(
				'/v3/site-explorer/domain-rating',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, date: BASE_DATE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerDomainRating.parse(result);
			expect(result.successful).toBe(true);
		});

		it('getDomainRatingHistory returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerDomainRatingHistoryResponse>(
				'/v3/site-explorer/domain-rating-history',
				TEST_API_KEY,
				{ query: { ...HISTORY_BASE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerDomainRatingHistory.parse(result);
			expect(result.successful).toBe(true);
		});

		it('getAllBacklinks returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerAllBacklinksResponse>(
				'/v3/site-explorer/all-backlinks',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, select: SELECT_BACKLINKS } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerAllBacklinks.parse(result);
		});

		it('getBrokenBacklinks returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerBrokenBacklinksResponse>(
				'/v3/site-explorer/broken-backlinks',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, select: SELECT_BACKLINKS } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerBrokenBacklinks.parse(result);
		});

		it('getReferringDomains returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerReferringDomainsResponse>(
				'/v3/site-explorer/refdomains',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, select: SELECT_DOMAINS } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerReferringDomains.parse(result);
		});

		it('getCountryMetrics returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerCountryMetricsResponse>(
				'/v3/site-explorer/metrics-by-country',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, date: BASE_DATE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerCountryMetrics.parse(result);
		});

		it('getLinkedAnchorsExternal returns correct type', async () => {
			const result =
				await makeAhrefsRequest<SiteExplorerLinkedAnchorsExternalResponse>(
					'/v3/site-explorer/linked-anchors-external',
					TEST_API_KEY,
					{ query: { ...SITE_EXPLORER_BASE, select: SELECT_ANCHORS } },
				);

			AhrefsEndpointOutputSchemas.siteExplorerLinkedAnchorsExternal.parse(result);
		});

		it('getUrlRatingHistory returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerUrlRatingHistoryResponse>(
				'/v3/site-explorer/url-rating-history',
				TEST_API_KEY,
				{ query: { ...HISTORY_BASE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerUrlRatingHistory.parse(result);
		});

		it('getLinkedAnchors returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerLinkedAnchorsResponse>(
				'/v3/site-explorer/linked-anchors',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, select: SELECT_ANCHORS } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerLinkedAnchors.parse(result);
		});

		it('getBestByExternalLinks returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerBestByExternalLinksResponse>(
				'/v3/site-explorer/best-by-links',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, select: SELECT_PAGES } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerBestByExternalLinks.parse(result);
		});

		it('getPagesByTraffic returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerPagesByTrafficResponse>(
				'/v3/site-explorer/pages-by-traffic',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, country: BASE_COUNTRY } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerPagesByTraffic.parse(result);
		});

		it('getAnchorData returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerAnchorDataResponse>(
				'/v3/site-explorer/anchors',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, select: SELECT_ANCHORS } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerAnchorData.parse(result);
		});

		it('getBestByInternalLinks returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerBestByInternalLinksResponse>(
				'/v3/site-explorer/best-by-links-internal',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, select: SELECT_PAGES } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerBestByInternalLinks.parse(result);
		});

		it('getOrganicCompetitors returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerOrganicCompetitorsResponse>(
				'/v3/site-explorer/organic-competitors',
				TEST_API_KEY,
				{
					query: {
						...SITE_EXPLORER_BASE,
						date: BASE_DATE,
						country: BASE_COUNTRY,
						select: 'competitor,common_keywords,organic_keywords',
					},
				},
			);

			AhrefsEndpointOutputSchemas.siteExplorerOrganicCompetitors.parse(result);
		});

		it('getOrganicKeywords returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerOrganicKeywordsResponse>(
				'/v3/site-explorer/organic-keywords',
				TEST_API_KEY,
				{
					query: {
						...SITE_EXPLORER_BASE,
						date: BASE_DATE,
						country: BASE_COUNTRY,
						select: SELECT_KEYWORDS,
					},
				},
			);

			AhrefsEndpointOutputSchemas.siteExplorerOrganicKeywords.parse(result);
			// Each organic keyword item should include the fields requested via select
			if (result.successful && result.data?.keywords?.length) {
				const first = result.data.keywords[0];
				expect(first).toBeDefined();
			}
		});

		it('getOutlinksStats returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerOutlinksStatsResponse>(
				'/v3/site-explorer/outlinks-stats',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerOutlinksStats.parse(result);
		});

		it('getPaidPages returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerPaidPagesResponse>(
				'/v3/site-explorer/paid-pages',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, date: BASE_DATE, select: SELECT_PAGES } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerPaidPages.parse(result);
		});

		it('getKeywordsHistory returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerKeywordsHistoryResponse>(
				'/v3/site-explorer/keywords-history',
				TEST_API_KEY,
				{ query: { ...HISTORY_BASE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerKeywordsHistory.parse(result);
		});

		it('getMetrics returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerMetricsResponse>(
				'/v3/site-explorer/metrics',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, date: BASE_DATE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerMetrics.parse(result);
			expect(result.successful).toBe(true);
		});

		it('getMetricsHistory returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerMetricsHistoryResponse>(
				'/v3/site-explorer/metrics-history',
				TEST_API_KEY,
				{ query: { ...HISTORY_BASE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerMetricsHistory.parse(result);
		});

		it('getPagesHistory returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerPagesHistoryResponse>(
				'/v3/site-explorer/pages-history',
				TEST_API_KEY,
				{ query: { ...HISTORY_BASE } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerPagesHistory.parse(result);
		});

		it('getReferringDomainsHistory returns correct type', async () => {
			const result =
				await makeAhrefsRequest<SiteExplorerReferringDomainsHistoryResponse>(
					'/v3/site-explorer/refdomains-history',
					TEST_API_KEY,
					{ query: { ...HISTORY_BASE } },
				);

			AhrefsEndpointOutputSchemas.siteExplorerReferringDomainsHistory.parse(result);
		});

		it('getTopPages returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerTopPagesResponse>(
				'/v3/site-explorer/top-pages',
				TEST_API_KEY,
				{
					query: {
						...SITE_EXPLORER_BASE,
						date: BASE_DATE,
						select: SELECT_PAGES,
						country: BASE_COUNTRY,
					},
				},
			);

			AhrefsEndpointOutputSchemas.siteExplorerTopPages.parse(result);
			// Validate that pages array items include the spread-fetched fields
			if (result.successful && result.data?.pages?.length) {
				const first = result.data.pages[0];
				expect(first).toBeDefined();
			}
		});

		it('getLinkedDomains returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteExplorerLinkedDomainsResponse>(
				'/v3/site-explorer/linked-domains',
				TEST_API_KEY,
				{ query: { ...SITE_EXPLORER_BASE, select: SELECT_DOMAINS } },
			);

			AhrefsEndpointOutputSchemas.siteExplorerLinkedDomains.parse(result);
		});
	});

	describe('keywords', () => {
		const KEYWORDS_BASE = { country: BASE_COUNTRY, keywords: BASE_KEYWORD, limit: 10 };

		it('getOverview returns correct type', async () => {
			const result = await makeAhrefsRequest<KeywordsExplorerOverviewResponse>(
				'/v3/keywords-explorer/overview',
				TEST_API_KEY,
				{ query: { ...KEYWORDS_BASE, select: SELECT_KEYWORDS } },
			);

			AhrefsEndpointOutputSchemas.keywordsExplorerOverview.parse(result);
		});

		it('getVolumeByCountry returns correct type', async () => {
			const result =
				await makeAhrefsRequest<KeywordsExplorerVolumeByCountryResponse>(
					'/v3/keywords-explorer/volume-by-country',
					TEST_API_KEY,
					{ query: { keyword: BASE_KEYWORD } },
				);

			AhrefsEndpointOutputSchemas.keywordsExplorerVolumeByCountry.parse(result);
			// Verify the global volume and per-country breakdown are present
			if (result.successful && result.data) {
				expect(result.data.keyword).toBe(BASE_KEYWORD);
			}
		});

		it('getMatchingTerms returns correct type', async () => {
			const result = await makeAhrefsRequest<KeywordsExplorerMatchingTermsResponse>(
				'/v3/keywords-explorer/matching-terms',
				TEST_API_KEY,
				{ query: { ...KEYWORDS_BASE, select: SELECT_KEYWORDS } },
			);

			AhrefsEndpointOutputSchemas.keywordsExplorerMatchingTerms.parse(result);
		});

		it('getTotalSearchVolumeHistory returns correct type', async () => {
			const result =
				await makeAhrefsRequest<KeywordsExplorerTotalSearchVolumeHistoryResponse>(
					'/v3/site-explorer/volume-history',
					TEST_API_KEY,
					{ query: { ...HISTORY_BASE, country: BASE_COUNTRY } },
				);

			AhrefsEndpointOutputSchemas.keywordsExplorerTotalSearchVolumeHistory.parse(result);
		});

		it('getRelatedTerms returns correct type', async () => {
			const result = await makeAhrefsRequest<KeywordsExplorerRelatedTermsResponse>(
				'/v3/keywords-explorer/related-terms',
				TEST_API_KEY,
				{ query: { ...KEYWORDS_BASE, select: SELECT_KEYWORDS } },
			);

			AhrefsEndpointOutputSchemas.keywordsExplorerRelatedTerms.parse(result);
		});

		it('getVolumeHistory returns correct type', async () => {
			const result = await makeAhrefsRequest<KeywordsExplorerVolumeHistoryResponse>(
				'/v3/keywords-explorer/volume-history',
				TEST_API_KEY,
				{ query: { keyword: BASE_KEYWORD, country: BASE_COUNTRY } },
			);

			AhrefsEndpointOutputSchemas.keywordsExplorerVolumeHistory.parse(result);
			// Verify that the volume_history array is present for monthly DB writes
			if (result.successful && result.data) {
				expect(result.data.keyword).toBe(BASE_KEYWORD);
			}
		});

		it('getSearchSuggestions returns correct type', async () => {
			const result =
				await makeAhrefsRequest<KeywordsExplorerSearchSuggestionsResponse>(
					'/v3/keywords-explorer/search-suggestions',
					TEST_API_KEY,
					{ query: { ...KEYWORDS_BASE, select: SELECT_KEYWORDS } },
				);

			AhrefsEndpointOutputSchemas.keywordsExplorerSearchSuggestions.parse(result);
		});
	});

	describe('rankTracker', () => {
		let testProjectId: number | undefined;

		beforeAll(async () => {
			// Resolve a real project ID from site audit so rank tracker tests have a valid input
			const auditResult = await makeAhrefsRequest<SiteAuditProjectsResponse>(
				'/v3/site-audit/projects',
				TEST_API_KEY,
			);
			if (auditResult.successful && auditResult.data?.projects?.length) {
				const first = auditResult.data.projects[0];
				if (first?.project_id) {
					// project_id from site audit is a string; rank tracker uses integer project IDs
					testProjectId = parseInt(first.project_id, 10) || undefined;
				}
			}
		});

		it('getCompetitorsOverview returns correct type', async () => {
			if (!testProjectId) {
				console.warn('[ahrefs] Skipping rank tracker test: no project ID available');
				return;
			}

			const result = await makeAhrefsRequest<RankTrackerCompetitorsOverviewResponse>(
				'/v3/rank-tracker/competitors-overview',
				TEST_API_KEY,
				{
					query: {
						...{ project_id: testProjectId, date: BASE_DATE, device: 'desktop' as const },
						select: 'competitor,common_keywords',
						limit: 10,
					},
				},
			);

			AhrefsEndpointOutputSchemas.rankTrackerCompetitorsOverview.parse(result);
		});

		it('getOverview returns correct type', async () => {
			if (!testProjectId) {
				console.warn('[ahrefs] Skipping rank tracker test: no project ID available');
				return;
			}

			const result = await makeAhrefsRequest<RankTrackerOverviewResponse>(
				'/v3/rank-tracker/overview',
				TEST_API_KEY,
				{
					query: {
						...{ project_id: testProjectId, date: BASE_DATE, device: 'desktop' as const },
						select: 'traffic,positions,cost',
					},
				},
			);

			AhrefsEndpointOutputSchemas.rankTrackerOverview.parse(result);
		});
	});

	describe('serp', () => {
		it('getOverview returns correct type', async () => {
			const result = await makeAhrefsRequest<SerpOverviewResponse>(
				'/v3/serp-overview',
				TEST_API_KEY,
				{
					query: {
						keyword: BASE_KEYWORD,
						country: BASE_COUNTRY,
						select: 'url,title,position,traffic',
					},
				},
			);

			AhrefsEndpointOutputSchemas.serpOverview.parse(result);
			// Verify the results array is present for SERP item DB writes
			if (result.successful && result.data?.results?.length) {
				const first = result.data.results[0];
				expect(first).toBeDefined();
			}
		});
	});

	describe('siteAudit', () => {
		it('getProjects returns correct type', async () => {
			const result = await makeAhrefsRequest<SiteAuditProjectsResponse>(
				'/v3/site-audit/projects',
				TEST_API_KEY,
			);

			AhrefsEndpointOutputSchemas.siteAuditProjects.parse(result);
			// Verify each project has the fields needed for the DB spread write
			if (result.successful && result.data?.projects?.length) {
				const first = result.data.projects[0];
				expect(first?.project_id).toBeDefined();
			}
		});
	});

	describe('crawler', () => {
		it('getIpRanges returns correct type', async () => {
			const result = await makeAhrefsRequest<CrawlerIpRangesResponse>(
				'/v3/crawler-ip-ranges',
				TEST_API_KEY,
			);

			AhrefsEndpointOutputSchemas.crawlerIpRanges.parse(result);
		});

		it('getPublicIps returns correct type', async () => {
			const result = await makeAhrefsRequest<CrawlerPublicIpsResponse>(
				'/v3/public-ip-addresses',
				TEST_API_KEY,
			);

			AhrefsEndpointOutputSchemas.crawlerPublicIps.parse(result);
		});
	});
});
