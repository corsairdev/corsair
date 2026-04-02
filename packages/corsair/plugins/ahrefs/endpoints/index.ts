import * as SiteExplorerEndpoints from './site-explorer';
import * as KeywordsEndpoints from './keywords';
import * as RankTrackerEndpoints from './rank-tracker';
import * as SerpEndpoints from './serp';
import * as SiteAuditEndpoints from './site-audit';
import * as SubscriptionEndpoints from './subscription';
import * as CrawlerEndpoints from './crawler';

export const SiteExplorer = {
	backlinksStats: SiteExplorerEndpoints.backlinksStats,
	batchUrlAnalysis: SiteExplorerEndpoints.batchUrlAnalysis,
	getDomainRating: SiteExplorerEndpoints.getDomainRating,
	getDomainRatingHistory: SiteExplorerEndpoints.getDomainRatingHistory,
	getAllBacklinks: SiteExplorerEndpoints.getAllBacklinks,
	getBrokenBacklinks: SiteExplorerEndpoints.getBrokenBacklinks,
	getReferringDomains: SiteExplorerEndpoints.getReferringDomains,
	getCountryMetrics: SiteExplorerEndpoints.getCountryMetrics,
	getLinkedAnchorsExternal: SiteExplorerEndpoints.getLinkedAnchorsExternal,
	getUrlRatingHistory: SiteExplorerEndpoints.getUrlRatingHistory,
	getLinkedAnchors: SiteExplorerEndpoints.getLinkedAnchors,
	getBestByExternalLinks: SiteExplorerEndpoints.getBestByExternalLinks,
	getPagesByTraffic: SiteExplorerEndpoints.getPagesByTraffic,
	getAnchorData: SiteExplorerEndpoints.getAnchorData,
	getBestByInternalLinks: SiteExplorerEndpoints.getBestByInternalLinks,
	getOrganicCompetitors: SiteExplorerEndpoints.getOrganicCompetitors,
	getOrganicKeywords: SiteExplorerEndpoints.getOrganicKeywords,
	getOutlinksStats: SiteExplorerEndpoints.getOutlinksStats,
	getPaidPages: SiteExplorerEndpoints.getPaidPages,
	getKeywordsHistory: SiteExplorerEndpoints.getKeywordsHistory,
	getMetrics: SiteExplorerEndpoints.getMetrics,
	getMetricsHistory: SiteExplorerEndpoints.getMetricsHistory,
	getPagesHistory: SiteExplorerEndpoints.getPagesHistory,
	getReferringDomainsHistory: SiteExplorerEndpoints.getReferringDomainsHistory,
	getTopPages: SiteExplorerEndpoints.getTopPages,
	getLinkedDomains: SiteExplorerEndpoints.getLinkedDomains,
};

export const Keywords = {
	getOverview: KeywordsEndpoints.getOverview,
	getVolumeByCountry: KeywordsEndpoints.getVolumeByCountry,
	getMatchingTerms: KeywordsEndpoints.getMatchingTerms,
	getTotalSearchVolumeHistory: KeywordsEndpoints.getTotalSearchVolumeHistory,
	getRelatedTerms: KeywordsEndpoints.getRelatedTerms,
	getVolumeHistory: KeywordsEndpoints.getVolumeHistory,
	getSearchSuggestions: KeywordsEndpoints.getSearchSuggestions,
};

export const RankTracker = {
	getCompetitorsOverview: RankTrackerEndpoints.getCompetitorsOverview,
	getOverview: RankTrackerEndpoints.getOverview,
};

export const Serp = {
	getOverview: SerpEndpoints.getOverview,
};

export const SiteAudit = {
	getProjects: SiteAuditEndpoints.getProjects,
};

export const Subscription = {
	getLimitsAndUsage: SubscriptionEndpoints.getLimitsAndUsage,
};

export const Crawler = {
	getIpRanges: CrawlerEndpoints.getIpRanges,
	getPublicIps: CrawlerEndpoints.getPublicIps,
};

export * from './types';
