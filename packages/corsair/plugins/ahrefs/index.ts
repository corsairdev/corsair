import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PluginAuthConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	PluginPermissionsConfig,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type { AhrefsEndpointInputs, AhrefsEndpointOutputs } from './endpoints/types';
import { AhrefsEndpointInputSchemas, AhrefsEndpointOutputSchemas } from './endpoints/types';
import {
	Crawler,
	Keywords,
	RankTracker,
	Serp,
	SiteAudit,
	SiteExplorer,
	Subscription,
} from './endpoints';
import { AhrefsSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type AhrefsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAhrefsPlugin['hooks'];
	webhookHooks?: InternalAhrefsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ahrefsEndpointsNested>;
};

export type AhrefsContext = CorsairPluginContext<
	typeof AhrefsSchema,
	AhrefsPluginOptions
>;

export type AhrefsKeyBuilderContext = KeyBuilderContext<AhrefsPluginOptions>;

export type AhrefsBoundEndpoints = BindEndpoints<typeof ahrefsEndpointsNested>;

type AhrefsEndpoint<
	K extends keyof AhrefsEndpointOutputs,
	Input,
> = CorsairEndpoint<AhrefsContext, Input, AhrefsEndpointOutputs[K]>;

export type AhrefsEndpoints = {
	// Site Explorer
	siteExplorerBacklinksStats: AhrefsEndpoint<'siteExplorerBacklinksStats', AhrefsEndpointInputs['siteExplorerBacklinksStats']>;
	siteExplorerBatchUrlAnalysis: AhrefsEndpoint<'siteExplorerBatchUrlAnalysis', AhrefsEndpointInputs['siteExplorerBatchUrlAnalysis']>;
	siteExplorerDomainRating: AhrefsEndpoint<'siteExplorerDomainRating', AhrefsEndpointInputs['siteExplorerDomainRating']>;
	siteExplorerDomainRatingHistory: AhrefsEndpoint<'siteExplorerDomainRatingHistory', AhrefsEndpointInputs['siteExplorerDomainRatingHistory']>;
	siteExplorerAllBacklinks: AhrefsEndpoint<'siteExplorerAllBacklinks', AhrefsEndpointInputs['siteExplorerAllBacklinks']>;
	siteExplorerBrokenBacklinks: AhrefsEndpoint<'siteExplorerBrokenBacklinks', AhrefsEndpointInputs['siteExplorerBrokenBacklinks']>;
	siteExplorerReferringDomains: AhrefsEndpoint<'siteExplorerReferringDomains', AhrefsEndpointInputs['siteExplorerReferringDomains']>;
	siteExplorerCountryMetrics: AhrefsEndpoint<'siteExplorerCountryMetrics', AhrefsEndpointInputs['siteExplorerCountryMetrics']>;
	siteExplorerLinkedAnchorsExternal: AhrefsEndpoint<'siteExplorerLinkedAnchorsExternal', AhrefsEndpointInputs['siteExplorerLinkedAnchorsExternal']>;
	siteExplorerUrlRatingHistory: AhrefsEndpoint<'siteExplorerUrlRatingHistory', AhrefsEndpointInputs['siteExplorerUrlRatingHistory']>;
	siteExplorerLinkedAnchors: AhrefsEndpoint<'siteExplorerLinkedAnchors', AhrefsEndpointInputs['siteExplorerLinkedAnchors']>;
	siteExplorerBestByExternalLinks: AhrefsEndpoint<'siteExplorerBestByExternalLinks', AhrefsEndpointInputs['siteExplorerBestByExternalLinks']>;
	siteExplorerPagesByTraffic: AhrefsEndpoint<'siteExplorerPagesByTraffic', AhrefsEndpointInputs['siteExplorerPagesByTraffic']>;
	siteExplorerAnchorData: AhrefsEndpoint<'siteExplorerAnchorData', AhrefsEndpointInputs['siteExplorerAnchorData']>;
	siteExplorerBestByInternalLinks: AhrefsEndpoint<'siteExplorerBestByInternalLinks', AhrefsEndpointInputs['siteExplorerBestByInternalLinks']>;
	siteExplorerOrganicCompetitors: AhrefsEndpoint<'siteExplorerOrganicCompetitors', AhrefsEndpointInputs['siteExplorerOrganicCompetitors']>;
	siteExplorerOrganicKeywords: AhrefsEndpoint<'siteExplorerOrganicKeywords', AhrefsEndpointInputs['siteExplorerOrganicKeywords']>;
	siteExplorerOutlinksStats: AhrefsEndpoint<'siteExplorerOutlinksStats', AhrefsEndpointInputs['siteExplorerOutlinksStats']>;
	siteExplorerPaidPages: AhrefsEndpoint<'siteExplorerPaidPages', AhrefsEndpointInputs['siteExplorerPaidPages']>;
	siteExplorerKeywordsHistory: AhrefsEndpoint<'siteExplorerKeywordsHistory', AhrefsEndpointInputs['siteExplorerKeywordsHistory']>;
	siteExplorerMetrics: AhrefsEndpoint<'siteExplorerMetrics', AhrefsEndpointInputs['siteExplorerMetrics']>;
	siteExplorerMetricsHistory: AhrefsEndpoint<'siteExplorerMetricsHistory', AhrefsEndpointInputs['siteExplorerMetricsHistory']>;
	siteExplorerPagesHistory: AhrefsEndpoint<'siteExplorerPagesHistory', AhrefsEndpointInputs['siteExplorerPagesHistory']>;
	siteExplorerReferringDomainsHistory: AhrefsEndpoint<'siteExplorerReferringDomainsHistory', AhrefsEndpointInputs['siteExplorerReferringDomainsHistory']>;
	siteExplorerTopPages: AhrefsEndpoint<'siteExplorerTopPages', AhrefsEndpointInputs['siteExplorerTopPages']>;
	siteExplorerLinkedDomains: AhrefsEndpoint<'siteExplorerLinkedDomains', AhrefsEndpointInputs['siteExplorerLinkedDomains']>;
	// Keywords Explorer
	keywordsExplorerOverview: AhrefsEndpoint<'keywordsExplorerOverview', AhrefsEndpointInputs['keywordsExplorerOverview']>;
	keywordsExplorerVolumeByCountry: AhrefsEndpoint<'keywordsExplorerVolumeByCountry', AhrefsEndpointInputs['keywordsExplorerVolumeByCountry']>;
	keywordsExplorerMatchingTerms: AhrefsEndpoint<'keywordsExplorerMatchingTerms', AhrefsEndpointInputs['keywordsExplorerMatchingTerms']>;
	keywordsExplorerTotalSearchVolumeHistory: AhrefsEndpoint<'keywordsExplorerTotalSearchVolumeHistory', AhrefsEndpointInputs['keywordsExplorerTotalSearchVolumeHistory']>;
	keywordsExplorerRelatedTerms: AhrefsEndpoint<'keywordsExplorerRelatedTerms', AhrefsEndpointInputs['keywordsExplorerRelatedTerms']>;
	keywordsExplorerVolumeHistory: AhrefsEndpoint<'keywordsExplorerVolumeHistory', AhrefsEndpointInputs['keywordsExplorerVolumeHistory']>;
	keywordsExplorerSearchSuggestions: AhrefsEndpoint<'keywordsExplorerSearchSuggestions', AhrefsEndpointInputs['keywordsExplorerSearchSuggestions']>;
	// Rank Tracker
	rankTrackerCompetitorsOverview: AhrefsEndpoint<'rankTrackerCompetitorsOverview', AhrefsEndpointInputs['rankTrackerCompetitorsOverview']>;
	rankTrackerOverview: AhrefsEndpoint<'rankTrackerOverview', AhrefsEndpointInputs['rankTrackerOverview']>;
	// SERP
	serpOverview: AhrefsEndpoint<'serpOverview', AhrefsEndpointInputs['serpOverview']>;
	// Site Audit
	siteAuditProjects: AhrefsEndpoint<'siteAuditProjects', AhrefsEndpointInputs['siteAuditProjects']>;
	// Subscription
	subscriptionLimitsAndUsage: AhrefsEndpoint<'subscriptionLimitsAndUsage', AhrefsEndpointInputs['subscriptionLimitsAndUsage']>;
	// Crawler
	crawlerIpRanges: AhrefsEndpoint<'crawlerIpRanges', AhrefsEndpointInputs['crawlerIpRanges']>;
	crawlerPublicIps: AhrefsEndpoint<'crawlerPublicIps', AhrefsEndpointInputs['crawlerPublicIps']>;
};

const ahrefsEndpointsNested = {
	siteExplorer: {
		backlinksStats: SiteExplorer.backlinksStats,
		batchUrlAnalysis: SiteExplorer.batchUrlAnalysis,
		getDomainRating: SiteExplorer.getDomainRating,
		getDomainRatingHistory: SiteExplorer.getDomainRatingHistory,
		getAllBacklinks: SiteExplorer.getAllBacklinks,
		getBrokenBacklinks: SiteExplorer.getBrokenBacklinks,
		getReferringDomains: SiteExplorer.getReferringDomains,
		getCountryMetrics: SiteExplorer.getCountryMetrics,
		getLinkedAnchorsExternal: SiteExplorer.getLinkedAnchorsExternal,
		getUrlRatingHistory: SiteExplorer.getUrlRatingHistory,
		getLinkedAnchors: SiteExplorer.getLinkedAnchors,
		getBestByExternalLinks: SiteExplorer.getBestByExternalLinks,
		getPagesByTraffic: SiteExplorer.getPagesByTraffic,
		getAnchorData: SiteExplorer.getAnchorData,
		getBestByInternalLinks: SiteExplorer.getBestByInternalLinks,
		getOrganicCompetitors: SiteExplorer.getOrganicCompetitors,
		getOrganicKeywords: SiteExplorer.getOrganicKeywords,
		getOutlinksStats: SiteExplorer.getOutlinksStats,
		getPaidPages: SiteExplorer.getPaidPages,
		getKeywordsHistory: SiteExplorer.getKeywordsHistory,
		getMetrics: SiteExplorer.getMetrics,
		getMetricsHistory: SiteExplorer.getMetricsHistory,
		getPagesHistory: SiteExplorer.getPagesHistory,
		getReferringDomainsHistory: SiteExplorer.getReferringDomainsHistory,
		getTopPages: SiteExplorer.getTopPages,
		getLinkedDomains: SiteExplorer.getLinkedDomains,
	},
	keywords: {
		getOverview: Keywords.getOverview,
		getVolumeByCountry: Keywords.getVolumeByCountry,
		getMatchingTerms: Keywords.getMatchingTerms,
		getTotalSearchVolumeHistory: Keywords.getTotalSearchVolumeHistory,
		getRelatedTerms: Keywords.getRelatedTerms,
		getVolumeHistory: Keywords.getVolumeHistory,
		getSearchSuggestions: Keywords.getSearchSuggestions,
	},
	rankTracker: {
		getCompetitorsOverview: RankTracker.getCompetitorsOverview,
		getOverview: RankTracker.getOverview,
	},
	serp: {
		getOverview: Serp.getOverview,
	},
	siteAudit: {
		getProjects: SiteAudit.getProjects,
	},
	subscription: {
		getLimitsAndUsage: Subscription.getLimitsAndUsage,
	},
	crawler: {
		getIpRanges: Crawler.getIpRanges,
		getPublicIps: Crawler.getPublicIps,
	},
} as const;

// Ahrefs has no webhooks
const ahrefsWebhooksNested = {} as const;

export const ahrefsEndpointSchemas = {
	// Site Explorer
	'siteExplorer.backlinksStats': {
		input: AhrefsEndpointInputSchemas.siteExplorerBacklinksStats,
		output: AhrefsEndpointOutputSchemas.siteExplorerBacklinksStats,
	},
	'siteExplorer.batchUrlAnalysis': {
		input: AhrefsEndpointInputSchemas.siteExplorerBatchUrlAnalysis,
		output: AhrefsEndpointOutputSchemas.siteExplorerBatchUrlAnalysis,
	},
	'siteExplorer.getDomainRating': {
		input: AhrefsEndpointInputSchemas.siteExplorerDomainRating,
		output: AhrefsEndpointOutputSchemas.siteExplorerDomainRating,
	},
	'siteExplorer.getDomainRatingHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerDomainRatingHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerDomainRatingHistory,
	},
	'siteExplorer.getAllBacklinks': {
		input: AhrefsEndpointInputSchemas.siteExplorerAllBacklinks,
		output: AhrefsEndpointOutputSchemas.siteExplorerAllBacklinks,
	},
	'siteExplorer.getBrokenBacklinks': {
		input: AhrefsEndpointInputSchemas.siteExplorerBrokenBacklinks,
		output: AhrefsEndpointOutputSchemas.siteExplorerBrokenBacklinks,
	},
	'siteExplorer.getReferringDomains': {
		input: AhrefsEndpointInputSchemas.siteExplorerReferringDomains,
		output: AhrefsEndpointOutputSchemas.siteExplorerReferringDomains,
	},
	'siteExplorer.getCountryMetrics': {
		input: AhrefsEndpointInputSchemas.siteExplorerCountryMetrics,
		output: AhrefsEndpointOutputSchemas.siteExplorerCountryMetrics,
	},
	'siteExplorer.getLinkedAnchorsExternal': {
		input: AhrefsEndpointInputSchemas.siteExplorerLinkedAnchorsExternal,
		output: AhrefsEndpointOutputSchemas.siteExplorerLinkedAnchorsExternal,
	},
	'siteExplorer.getUrlRatingHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerUrlRatingHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerUrlRatingHistory,
	},
	'siteExplorer.getLinkedAnchors': {
		input: AhrefsEndpointInputSchemas.siteExplorerLinkedAnchors,
		output: AhrefsEndpointOutputSchemas.siteExplorerLinkedAnchors,
	},
	'siteExplorer.getBestByExternalLinks': {
		input: AhrefsEndpointInputSchemas.siteExplorerBestByExternalLinks,
		output: AhrefsEndpointOutputSchemas.siteExplorerBestByExternalLinks,
	},
	'siteExplorer.getPagesByTraffic': {
		input: AhrefsEndpointInputSchemas.siteExplorerPagesByTraffic,
		output: AhrefsEndpointOutputSchemas.siteExplorerPagesByTraffic,
	},
	'siteExplorer.getAnchorData': {
		input: AhrefsEndpointInputSchemas.siteExplorerAnchorData,
		output: AhrefsEndpointOutputSchemas.siteExplorerAnchorData,
	},
	'siteExplorer.getBestByInternalLinks': {
		input: AhrefsEndpointInputSchemas.siteExplorerBestByInternalLinks,
		output: AhrefsEndpointOutputSchemas.siteExplorerBestByInternalLinks,
	},
	'siteExplorer.getOrganicCompetitors': {
		input: AhrefsEndpointInputSchemas.siteExplorerOrganicCompetitors,
		output: AhrefsEndpointOutputSchemas.siteExplorerOrganicCompetitors,
	},
	'siteExplorer.getOrganicKeywords': {
		input: AhrefsEndpointInputSchemas.siteExplorerOrganicKeywords,
		output: AhrefsEndpointOutputSchemas.siteExplorerOrganicKeywords,
	},
	'siteExplorer.getOutlinksStats': {
		input: AhrefsEndpointInputSchemas.siteExplorerOutlinksStats,
		output: AhrefsEndpointOutputSchemas.siteExplorerOutlinksStats,
	},
	'siteExplorer.getPaidPages': {
		input: AhrefsEndpointInputSchemas.siteExplorerPaidPages,
		output: AhrefsEndpointOutputSchemas.siteExplorerPaidPages,
	},
	'siteExplorer.getKeywordsHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerKeywordsHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerKeywordsHistory,
	},
	'siteExplorer.getMetrics': {
		input: AhrefsEndpointInputSchemas.siteExplorerMetrics,
		output: AhrefsEndpointOutputSchemas.siteExplorerMetrics,
	},
	'siteExplorer.getMetricsHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerMetricsHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerMetricsHistory,
	},
	'siteExplorer.getPagesHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerPagesHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerPagesHistory,
	},
	'siteExplorer.getReferringDomainsHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerReferringDomainsHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerReferringDomainsHistory,
	},
	'siteExplorer.getTopPages': {
		input: AhrefsEndpointInputSchemas.siteExplorerTopPages,
		output: AhrefsEndpointOutputSchemas.siteExplorerTopPages,
	},
	'siteExplorer.getLinkedDomains': {
		input: AhrefsEndpointInputSchemas.siteExplorerLinkedDomains,
		output: AhrefsEndpointOutputSchemas.siteExplorerLinkedDomains,
	},
	// Keywords Explorer
	'keywords.getOverview': {
		input: AhrefsEndpointInputSchemas.keywordsExplorerOverview,
		output: AhrefsEndpointOutputSchemas.keywordsExplorerOverview,
	},
	'keywords.getVolumeByCountry': {
		input: AhrefsEndpointInputSchemas.keywordsExplorerVolumeByCountry,
		output: AhrefsEndpointOutputSchemas.keywordsExplorerVolumeByCountry,
	},
	'keywords.getMatchingTerms': {
		input: AhrefsEndpointInputSchemas.keywordsExplorerMatchingTerms,
		output: AhrefsEndpointOutputSchemas.keywordsExplorerMatchingTerms,
	},
	'keywords.getTotalSearchVolumeHistory': {
		input: AhrefsEndpointInputSchemas.keywordsExplorerTotalSearchVolumeHistory,
		output: AhrefsEndpointOutputSchemas.keywordsExplorerTotalSearchVolumeHistory,
	},
	'keywords.getRelatedTerms': {
		input: AhrefsEndpointInputSchemas.keywordsExplorerRelatedTerms,
		output: AhrefsEndpointOutputSchemas.keywordsExplorerRelatedTerms,
	},
	'keywords.getVolumeHistory': {
		input: AhrefsEndpointInputSchemas.keywordsExplorerVolumeHistory,
		output: AhrefsEndpointOutputSchemas.keywordsExplorerVolumeHistory,
	},
	'keywords.getSearchSuggestions': {
		input: AhrefsEndpointInputSchemas.keywordsExplorerSearchSuggestions,
		output: AhrefsEndpointOutputSchemas.keywordsExplorerSearchSuggestions,
	},
	// Rank Tracker
	'rankTracker.getCompetitorsOverview': {
		input: AhrefsEndpointInputSchemas.rankTrackerCompetitorsOverview,
		output: AhrefsEndpointOutputSchemas.rankTrackerCompetitorsOverview,
	},
	'rankTracker.getOverview': {
		input: AhrefsEndpointInputSchemas.rankTrackerOverview,
		output: AhrefsEndpointOutputSchemas.rankTrackerOverview,
	},
	// SERP
	'serp.getOverview': {
		input: AhrefsEndpointInputSchemas.serpOverview,
		output: AhrefsEndpointOutputSchemas.serpOverview,
	},
	// Site Audit
	'siteAudit.getProjects': {
		input: AhrefsEndpointInputSchemas.siteAuditProjects,
		output: AhrefsEndpointOutputSchemas.siteAuditProjects,
	},
	// Subscription
	'subscription.getLimitsAndUsage': {
		input: AhrefsEndpointInputSchemas.subscriptionLimitsAndUsage,
		output: AhrefsEndpointOutputSchemas.subscriptionLimitsAndUsage,
	},
	// Crawler
	'crawler.getIpRanges': {
		input: AhrefsEndpointInputSchemas.crawlerIpRanges,
		output: AhrefsEndpointOutputSchemas.crawlerIpRanges,
	},
	'crawler.getPublicIps': {
		input: AhrefsEndpointInputSchemas.crawlerPublicIps,
		output: AhrefsEndpointOutputSchemas.crawlerPublicIps,
	},
} satisfies RequiredPluginEndpointSchemas<typeof ahrefsEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ahrefsEndpointMeta = {
	// Site Explorer
	'siteExplorer.backlinksStats': { riskLevel: 'read', description: 'Retrieve backlink statistics for a target URL or domain' },
	'siteExplorer.batchUrlAnalysis': { riskLevel: 'read', description: 'Analyze multiple URLs in batch for SEO metrics' },
	'siteExplorer.getDomainRating': { riskLevel: 'read', description: 'Get Domain Rating (DR) score for a target' },
	'siteExplorer.getDomainRatingHistory': { riskLevel: 'read', description: 'Get historical Domain Rating data for a target' },
	'siteExplorer.getAllBacklinks': { riskLevel: 'read', description: 'Fetch all backlinks pointing to a target' },
	'siteExplorer.getBrokenBacklinks': { riskLevel: 'read', description: 'Fetch broken backlinks pointing to a target' },
	'siteExplorer.getReferringDomains': { riskLevel: 'read', description: 'List domains that link to a target' },
	'siteExplorer.getCountryMetrics': { riskLevel: 'read', description: 'Get organic traffic metrics broken down by country' },
	'siteExplorer.getLinkedAnchorsExternal': { riskLevel: 'read', description: 'Get external linked anchors for a target' },
	'siteExplorer.getUrlRatingHistory': { riskLevel: 'read', description: 'Get URL Rating history for a target' },
	'siteExplorer.getLinkedAnchors': { riskLevel: 'read', description: 'Explore linked anchors for a target' },
	'siteExplorer.getBestByExternalLinks': { riskLevel: 'read', description: 'List pages with the most external backlinks' },
	'siteExplorer.getPagesByTraffic': { riskLevel: 'read', description: 'Get pages ranked by organic traffic' },
	'siteExplorer.getAnchorData': { riskLevel: 'read', description: 'Retrieve anchor text data for a target' },
	'siteExplorer.getBestByInternalLinks': { riskLevel: 'read', description: 'List pages with the most internal links' },
	'siteExplorer.getOrganicCompetitors': { riskLevel: 'read', description: 'Retrieve organic search competitors for a target' },
	'siteExplorer.getOrganicKeywords': { riskLevel: 'read', description: 'List organic keywords a target ranks for' },
	'siteExplorer.getOutlinksStats': { riskLevel: 'read', description: 'Get outbound link statistics for a target' },
	'siteExplorer.getPaidPages': { riskLevel: 'read', description: 'Get paid search pages data for a target' },
	'siteExplorer.getKeywordsHistory': { riskLevel: 'read', description: 'Get historical keyword ranking data for a target' },
	'siteExplorer.getMetrics': { riskLevel: 'read', description: 'Get comprehensive site explorer metrics for a target' },
	'siteExplorer.getMetricsHistory': { riskLevel: 'read', description: 'Get historical site explorer metrics for a target' },
	'siteExplorer.getPagesHistory': { riskLevel: 'read', description: 'Get historical pages data for a target' },
	'siteExplorer.getReferringDomainsHistory': { riskLevel: 'read', description: 'Get historical referring domains data for a target' },
	'siteExplorer.getTopPages': { riskLevel: 'read', description: 'Get top organic pages from site explorer' },
	'siteExplorer.getLinkedDomains': { riskLevel: 'read', description: 'Explore domains linked from a target' },
	// Keywords Explorer
	'keywords.getOverview': { riskLevel: 'read', description: 'Get keywords explorer overview for a country' },
	'keywords.getVolumeByCountry': { riskLevel: 'read', description: 'Get keyword search volume broken down by country' },
	'keywords.getMatchingTerms': { riskLevel: 'read', description: 'Find keywords matching given seed terms' },
	'keywords.getTotalSearchVolumeHistory': { riskLevel: 'read', description: 'Get total search volume history for a target' },
	'keywords.getRelatedTerms': { riskLevel: 'read', description: 'Retrieve related keyword terms' },
	'keywords.getVolumeHistory': { riskLevel: 'read', description: 'Get monthly search volume history for a keyword' },
	'keywords.getSearchSuggestions': { riskLevel: 'read', description: 'Get keyword search suggestions' },
	// Rank Tracker
	'rankTracker.getCompetitorsOverview': { riskLevel: 'read', description: 'Fetch rank tracker competitors overview for a project' },
	'rankTracker.getOverview': { riskLevel: 'read', description: 'Fetch rank tracker overview metrics for a project' },
	// SERP
	'serp.getOverview': { riskLevel: 'read', description: 'Get SERP overview for a keyword and country' },
	// Site Audit
	'siteAudit.getProjects': { riskLevel: 'read', description: 'List all site audit projects' },
	// Subscription
	'subscription.getLimitsAndUsage': { riskLevel: 'read', description: 'Retrieve API subscription limits and current usage' },
	// Crawler
	'crawler.getIpRanges': { riskLevel: 'read', description: 'Retrieve Ahrefs crawler IP ranges' },
	'crawler.getPublicIps': { riskLevel: 'read', description: 'Retrieve public Ahrefs crawler IP addresses' },
} satisfies RequiredPluginEndpointMeta<typeof ahrefsEndpointsNested>;

export const ahrefsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAhrefsPlugin<T extends AhrefsPluginOptions> = CorsairPlugin<
	'ahrefs',
	typeof AhrefsSchema,
	typeof ahrefsEndpointsNested,
	typeof ahrefsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAhrefsPlugin = BaseAhrefsPlugin<AhrefsPluginOptions>;

export type ExternalAhrefsPlugin<T extends AhrefsPluginOptions> =
	BaseAhrefsPlugin<T>;

export function ahrefs<const T extends AhrefsPluginOptions>(
	incomingOptions: AhrefsPluginOptions & T = {} as AhrefsPluginOptions & T,
): ExternalAhrefsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ahrefs',
		schema: AhrefsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ahrefsEndpointsNested,
		webhooks: ahrefsWebhooksNested,
		endpointMeta: ahrefsEndpointMeta,
		endpointSchemas: ahrefsEndpointSchemas,
		pluginWebhookMatcher: (_request) => {
			// Ahrefs does not provide webhooks
			return false;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AhrefsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalAhrefsPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AhrefsEndpointInputs,
	AhrefsEndpointOutputs,
	// Site Explorer
	SiteExplorerBacklinksStatsResponse,
	SiteExplorerBatchUrlAnalysisResponse,
	SiteExplorerDomainRatingResponse,
	SiteExplorerDomainRatingHistoryResponse,
	SiteExplorerAllBacklinksResponse,
	SiteExplorerBrokenBacklinksResponse,
	SiteExplorerReferringDomainsResponse,
	SiteExplorerCountryMetricsResponse,
	SiteExplorerLinkedAnchorsExternalResponse,
	SiteExplorerUrlRatingHistoryResponse,
	SiteExplorerLinkedAnchorsResponse,
	SiteExplorerBestByExternalLinksResponse,
	SiteExplorerPagesByTrafficResponse,
	SiteExplorerAnchorDataResponse,
	SiteExplorerBestByInternalLinksResponse,
	SiteExplorerOrganicCompetitorsResponse,
	SiteExplorerOrganicKeywordsResponse,
	SiteExplorerOutlinksStatsResponse,
	SiteExplorerPaidPagesResponse,
	SiteExplorerKeywordsHistoryResponse,
	SiteExplorerMetricsResponse,
	SiteExplorerMetricsHistoryResponse,
	SiteExplorerPagesHistoryResponse,
	SiteExplorerReferringDomainsHistoryResponse,
	SiteExplorerTopPagesResponse,
	SiteExplorerLinkedDomainsResponse,
	// Keywords Explorer
	KeywordsExplorerOverviewResponse,
	KeywordsExplorerVolumeByCountryResponse,
	KeywordsExplorerMatchingTermsResponse,
	KeywordsExplorerTotalSearchVolumeHistoryResponse,
	KeywordsExplorerRelatedTermsResponse,
	KeywordsExplorerVolumeHistoryResponse,
	KeywordsExplorerSearchSuggestionsResponse,
	// Rank Tracker
	RankTrackerCompetitorsOverviewResponse,
	RankTrackerOverviewResponse,
	// SERP
	SerpOverviewResponse,
	// Site Audit
	SiteAuditProjectsResponse,
	// Subscription
	SubscriptionLimitsAndUsageResponse,
	// Crawler
	CrawlerIpRangesResponse,
	CrawlerPublicIpsResponse,
} from './endpoints/types';
