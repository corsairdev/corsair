import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	BatchAnalysis,
	BrandRadar,
	ContentHelper,
	Gsc,
	KeywordsExplorer,
	Management,
	PublicApi,
	RankTracker,
	SerpOverview,
	SiteAudit,
	SiteExplorer,
	SocialMedia,
	SubscriptionInfo,
	WebAnalytics,
} from './endpoints';
import type {
	AhrefsEndpointInputs,
	AhrefsEndpointOutputs,
} from './endpoints/types';
import {
	AhrefsEndpointInputSchemas,
	AhrefsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AhrefsSchema } from './schema';

export type AhrefsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAhrefsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ahrefsEndpointsNested>;
};

export type AhrefsContext = CorsairPluginContext<
	typeof AhrefsSchema,
	AhrefsPluginOptions
>;

export type AhrefsKeyBuilderContext = KeyBuilderContext<AhrefsPluginOptions>;

export type AhrefsBoundEndpoints = BindEndpoints<typeof ahrefsEndpointsNested>;

type AhrefsEndpoint<K extends keyof AhrefsEndpointOutputs> = CorsairEndpoint<
	AhrefsContext,
	AhrefsEndpointInputs[K],
	AhrefsEndpointOutputs[K]
>;

export type AhrefsEndpoints = {
	getDomainRating: AhrefsEndpoint<'getDomainRating'>;
	backlinksStats: AhrefsEndpoint<'backlinksStats'>;
	organicKeywords: AhrefsEndpoint<'organicKeywords'>;
	refdomains: AhrefsEndpoint<'refdomains'>;
	topPages: AhrefsEndpoint<'topPages'>;
	keywordsOverview: AhrefsEndpoint<'keywordsOverview'>;
	rankTrackerOverview: AhrefsEndpoint<'rankTrackerOverview'>;
	serpOverview: AhrefsEndpoint<'serpOverview'>;
	limitsAndUsage: AhrefsEndpoint<'limitsAndUsage'>;
	gscKeywords: AhrefsEndpoint<'gscKeywords'>;
	gscPages: AhrefsEndpoint<'gscPages'>;
	gscPerformanceHistory: AhrefsEndpoint<'gscPerformanceHistory'>;
	gscKeywordHistory: AhrefsEndpoint<'gscKeywordHistory'>;
	gscPageHistory: AhrefsEndpoint<'gscPageHistory'>;
	gscPagesHistory: AhrefsEndpoint<'gscPagesHistory'>;
	gscPositionsHistory: AhrefsEndpoint<'gscPositionsHistory'>;
	gscCtrByPosition: AhrefsEndpoint<'gscCtrByPosition'>;
	gscPerformanceByDevice: AhrefsEndpoint<'gscPerformanceByDevice'>;
	gscPerformanceByPosition: AhrefsEndpoint<'gscPerformanceByPosition'>;
	gscMetricsByCountry: AhrefsEndpoint<'gscMetricsByCountry'>;
	gscAnonymousQueries: AhrefsEndpoint<'gscAnonymousQueries'>;
	siteAuditProjects: AhrefsEndpoint<'siteAuditProjects'>;
	siteAuditIssues: AhrefsEndpoint<'siteAuditIssues'>;
	siteAuditPageExplorer: AhrefsEndpoint<'siteAuditPageExplorer'>;
	siteAuditPageContent: AhrefsEndpoint<'siteAuditPageContent'>;
	matchingTerms: AhrefsEndpoint<'matchingTerms'>;
	relatedTerms: AhrefsEndpoint<'relatedTerms'>;
	searchSuggestions: AhrefsEndpoint<'searchSuggestions'>;
	volumeHistory: AhrefsEndpoint<'volumeHistory'>;
	volumeByCountry: AhrefsEndpoint<'volumeByCountry'>;
	siteMetrics: AhrefsEndpoint<'siteMetrics'>;
	metricsHistory: AhrefsEndpoint<'metricsHistory'>;
	domainRatingHistory: AhrefsEndpoint<'domainRatingHistory'>;
	allBacklinks: AhrefsEndpoint<'allBacklinks'>;
	brokenBacklinks: AhrefsEndpoint<'brokenBacklinks'>;
	anchors: AhrefsEndpoint<'anchors'>;
	organicCompetitors: AhrefsEndpoint<'organicCompetitors'>;
	pagesByTraffic: AhrefsEndpoint<'pagesByTraffic'>;
	refdomainsHistory: AhrefsEndpoint<'refdomainsHistory'>;
	keywordsHistory: AhrefsEndpoint<'keywordsHistory'>;
	linkedDomains: AhrefsEndpoint<'linkedDomains'>;
	pagesByBacklinks: AhrefsEndpoint<'pagesByBacklinks'>;
	rankTrackerSerpOverview: AhrefsEndpoint<'rankTrackerSerpOverview'>;
	rankTrackerCompetitorsOverview: AhrefsEndpoint<'rankTrackerCompetitorsOverview'>;
	managementProjects: AhrefsEndpoint<'managementProjects'>;
	managementProjectKeywords: AhrefsEndpoint<'managementProjectKeywords'>;
	managementKeywordLists: AhrefsEndpoint<'managementKeywordLists'>;
	managementKeywordListKeywords: AhrefsEndpoint<'managementKeywordListKeywords'>;
	managementLocations: AhrefsEndpoint<'managementLocations'>;
	brandRadarAiResponses: AhrefsEndpoint<'brandRadarAiResponses'>;
	brandRadarAiResponsesEntities: AhrefsEndpoint<'brandRadarAiResponsesEntities'>;
	brandRadarCitationsHistoryEntities: AhrefsEndpoint<'brandRadarCitationsHistoryEntities'>;
	brandRadarCitationsOverviewEntities: AhrefsEndpoint<'brandRadarCitationsOverviewEntities'>;
	brandRadarCitedDomains: AhrefsEndpoint<'brandRadarCitedDomains'>;
	brandRadarCitedDomainsEntities: AhrefsEndpoint<'brandRadarCitedDomainsEntities'>;
	brandRadarCitedPages: AhrefsEndpoint<'brandRadarCitedPages'>;
	brandRadarCitedPagesEntities: AhrefsEndpoint<'brandRadarCitedPagesEntities'>;
	brandRadarImpressionsHistory: AhrefsEndpoint<'brandRadarImpressionsHistory'>;
	brandRadarImpressionsHistoryEntities: AhrefsEndpoint<'brandRadarImpressionsHistoryEntities'>;
	brandRadarImpressionsOverview: AhrefsEndpoint<'brandRadarImpressionsOverview'>;
	brandRadarImpressionsOverviewEntities: AhrefsEndpoint<'brandRadarImpressionsOverviewEntities'>;
	brandRadarMentionsHistory: AhrefsEndpoint<'brandRadarMentionsHistory'>;
	brandRadarMentionsHistoryEntities: AhrefsEndpoint<'brandRadarMentionsHistoryEntities'>;
	brandRadarMentionsOverview: AhrefsEndpoint<'brandRadarMentionsOverview'>;
	brandRadarMentionsOverviewEntities: AhrefsEndpoint<'brandRadarMentionsOverviewEntities'>;
	brandRadarSovHistory: AhrefsEndpoint<'brandRadarSovHistory'>;
	brandRadarSovHistoryEntities: AhrefsEndpoint<'brandRadarSovHistoryEntities'>;
	brandRadarSovOverview: AhrefsEndpoint<'brandRadarSovOverview'>;
	brandRadarSovOverviewEntities: AhrefsEndpoint<'brandRadarSovOverviewEntities'>;
	socialMediaChannels: AhrefsEndpoint<'socialMediaChannels'>;
	socialMediaAuthors: AhrefsEndpoint<'socialMediaAuthors'>;
	socialMediaPosts: AhrefsEndpoint<'socialMediaPosts'>;
	socialMediaChannelMetrics: AhrefsEndpoint<'socialMediaChannelMetrics'>;
	socialMediaPostMetrics: AhrefsEndpoint<'socialMediaPostMetrics'>;
	socialMediaActivityHistory: AhrefsEndpoint<'socialMediaActivityHistory'>;
	socialMediaCreatePost: AhrefsEndpoint<'socialMediaCreatePost'>;
	socialMediaUpdatePost: AhrefsEndpoint<'socialMediaUpdatePost'>;
	socialMediaDeletePost: AhrefsEndpoint<'socialMediaDeletePost'>;
	managementCreateProject: AhrefsEndpoint<'managementCreateProject'>;
	managementUpdateProject: AhrefsEndpoint<'managementUpdateProject'>;
	managementDeleteProjects: AhrefsEndpoint<'managementDeleteProjects'>;
	managementAddProjectKeywords: AhrefsEndpoint<'managementAddProjectKeywords'>;
	managementDeleteProjectKeywords: AhrefsEndpoint<'managementDeleteProjectKeywords'>;
	managementAddProjectKeywordTags: AhrefsEndpoint<'managementAddProjectKeywordTags'>;
	managementDeleteProjectKeywordTags: AhrefsEndpoint<'managementDeleteProjectKeywordTags'>;
	managementProjectCompetitors: AhrefsEndpoint<'managementProjectCompetitors'>;
	managementAddProjectCompetitors: AhrefsEndpoint<'managementAddProjectCompetitors'>;
	managementDeleteProjectCompetitors: AhrefsEndpoint<'managementDeleteProjectCompetitors'>;
	managementCreateKeywordList: AhrefsEndpoint<'managementCreateKeywordList'>;
	managementDeleteKeywordLists: AhrefsEndpoint<'managementDeleteKeywordLists'>;
	managementAddKeywordListKeywords: AhrefsEndpoint<'managementAddKeywordListKeywords'>;
	managementDeleteKeywordListKeywords: AhrefsEndpoint<'managementDeleteKeywordListKeywords'>;
	managementBrandRadarReports: AhrefsEndpoint<'managementBrandRadarReports'>;
	managementCreateBrandRadarReport: AhrefsEndpoint<'managementCreateBrandRadarReport'>;
	managementUpdateBrandRadarReport: AhrefsEndpoint<'managementUpdateBrandRadarReport'>;
	managementBrandRadarPrompts: AhrefsEndpoint<'managementBrandRadarPrompts'>;
	managementAddBrandRadarPrompts: AhrefsEndpoint<'managementAddBrandRadarPrompts'>;
	managementUpdateBrandRadarPrompts: AhrefsEndpoint<'managementUpdateBrandRadarPrompts'>;
	managementDeleteBrandRadarPrompts: AhrefsEndpoint<'managementDeleteBrandRadarPrompts'>;
	siteExplorerAiResponsesCount: AhrefsEndpoint<'siteExplorerAiResponsesCount'>;
	siteExplorerCrawledPages: AhrefsEndpoint<'siteExplorerCrawledPages'>;
	siteExplorerLinkedAnchorsExternal: AhrefsEndpoint<'siteExplorerLinkedAnchorsExternal'>;
	siteExplorerLinkedAnchorsInternal: AhrefsEndpoint<'siteExplorerLinkedAnchorsInternal'>;
	siteExplorerMetricsByCountry: AhrefsEndpoint<'siteExplorerMetricsByCountry'>;
	siteExplorerOutlinksStats: AhrefsEndpoint<'siteExplorerOutlinksStats'>;
	siteExplorerPagesByInternalLinks: AhrefsEndpoint<'siteExplorerPagesByInternalLinks'>;
	siteExplorerPagesHistory: AhrefsEndpoint<'siteExplorerPagesHistory'>;
	siteExplorerPaidPages: AhrefsEndpoint<'siteExplorerPaidPages'>;
	siteExplorerTotalSearchVolumeHistory: AhrefsEndpoint<'siteExplorerTotalSearchVolumeHistory'>;
	siteExplorerUrlRatingHistory: AhrefsEndpoint<'siteExplorerUrlRatingHistory'>;
	rankTrackerCompetitorsDomains: AhrefsEndpoint<'rankTrackerCompetitorsDomains'>;
	rankTrackerCompetitorsPages: AhrefsEndpoint<'rankTrackerCompetitorsPages'>;
	rankTrackerCompetitorsStats: AhrefsEndpoint<'rankTrackerCompetitorsStats'>;
	batchAnalysisAnalyze: AhrefsEndpoint<'batchAnalysisAnalyze'>;
	contentHelperTopics: AhrefsEndpoint<'contentHelperTopics'>;
	publicCrawlerIps: AhrefsEndpoint<'publicCrawlerIps'>;
	publicCrawlerIpRanges: AhrefsEndpoint<'publicCrawlerIpRanges'>;
	publicDomainRatingFree: AhrefsEndpoint<'publicDomainRatingFree'>;
	publicDomainRatingFreeBatch: AhrefsEndpoint<'publicDomainRatingFreeBatch'>;
	publicDomainRatingTopDomains: AhrefsEndpoint<'publicDomainRatingTopDomains'>;
	webAnalyticsStats: AhrefsEndpoint<'webAnalyticsStats'>;
	webAnalyticsChart: AhrefsEndpoint<'webAnalyticsChart'>;
	webAnalyticsTopPages: AhrefsEndpoint<'webAnalyticsTopPages'>;
	webAnalyticsTopPagesChart: AhrefsEndpoint<'webAnalyticsTopPagesChart'>;
	webAnalyticsEntryPages: AhrefsEndpoint<'webAnalyticsEntryPages'>;
	webAnalyticsEntryPagesChart: AhrefsEndpoint<'webAnalyticsEntryPagesChart'>;
	webAnalyticsExitPages: AhrefsEndpoint<'webAnalyticsExitPages'>;
	webAnalyticsExitPagesChart: AhrefsEndpoint<'webAnalyticsExitPagesChart'>;
	webAnalyticsReferrers: AhrefsEndpoint<'webAnalyticsReferrers'>;
	webAnalyticsReferrersChart: AhrefsEndpoint<'webAnalyticsReferrersChart'>;
	webAnalyticsSources: AhrefsEndpoint<'webAnalyticsSources'>;
	webAnalyticsSourcesChart: AhrefsEndpoint<'webAnalyticsSourcesChart'>;
	webAnalyticsSourceChannels: AhrefsEndpoint<'webAnalyticsSourceChannels'>;
	webAnalyticsSourceChannelsChart: AhrefsEndpoint<'webAnalyticsSourceChannelsChart'>;
	webAnalyticsUtmParams: AhrefsEndpoint<'webAnalyticsUtmParams'>;
	webAnalyticsUtmParamsChart: AhrefsEndpoint<'webAnalyticsUtmParamsChart'>;
	webAnalyticsCountries: AhrefsEndpoint<'webAnalyticsCountries'>;
	webAnalyticsCountriesChart: AhrefsEndpoint<'webAnalyticsCountriesChart'>;
	webAnalyticsCities: AhrefsEndpoint<'webAnalyticsCities'>;
	webAnalyticsCitiesChart: AhrefsEndpoint<'webAnalyticsCitiesChart'>;
	webAnalyticsContinents: AhrefsEndpoint<'webAnalyticsContinents'>;
	webAnalyticsContinentsChart: AhrefsEndpoint<'webAnalyticsContinentsChart'>;
	webAnalyticsLanguages: AhrefsEndpoint<'webAnalyticsLanguages'>;
	webAnalyticsLanguagesChart: AhrefsEndpoint<'webAnalyticsLanguagesChart'>;
	webAnalyticsDevices: AhrefsEndpoint<'webAnalyticsDevices'>;
	webAnalyticsDevicesChart: AhrefsEndpoint<'webAnalyticsDevicesChart'>;
	webAnalyticsBrowsers: AhrefsEndpoint<'webAnalyticsBrowsers'>;
	webAnalyticsBrowsersChart: AhrefsEndpoint<'webAnalyticsBrowsersChart'>;
	webAnalyticsBrowserVersions: AhrefsEndpoint<'webAnalyticsBrowserVersions'>;
	webAnalyticsBrowserVersionsChart: AhrefsEndpoint<'webAnalyticsBrowserVersionsChart'>;
	webAnalyticsOperatingSystems: AhrefsEndpoint<'webAnalyticsOperatingSystems'>;
	webAnalyticsOperatingSystemsChart: AhrefsEndpoint<'webAnalyticsOperatingSystemsChart'>;
	webAnalyticsOperatingSystemsVersions: AhrefsEndpoint<'webAnalyticsOperatingSystemsVersions'>;
	webAnalyticsOperatingSystemsVersionsChart: AhrefsEndpoint<'webAnalyticsOperatingSystemsVersionsChart'>;
};

const ahrefsEndpointsNested = {
	siteExplorer: {
		getDomainRating: SiteExplorer.getDomainRating,
		backlinksStats: SiteExplorer.backlinksStats,
		organicKeywords: SiteExplorer.organicKeywords,
		refdomains: SiteExplorer.refdomains,
		topPages: SiteExplorer.topPages,
		metrics: SiteExplorer.metrics,
		metricsHistory: SiteExplorer.metricsHistory,
		domainRatingHistory: SiteExplorer.domainRatingHistory,
		allBacklinks: SiteExplorer.allBacklinks,
		brokenBacklinks: SiteExplorer.brokenBacklinks,
		anchors: SiteExplorer.anchors,
		organicCompetitors: SiteExplorer.organicCompetitors,
		pagesByTraffic: SiteExplorer.pagesByTraffic,
		refdomainsHistory: SiteExplorer.refdomainsHistory,
		keywordsHistory: SiteExplorer.keywordsHistory,
		linkedDomains: SiteExplorer.linkedDomains,
		pagesByBacklinks: SiteExplorer.pagesByBacklinks,
		aiResponsesCount: SiteExplorer.aiResponsesCount,
		crawledPages: SiteExplorer.crawledPages,
		linkedAnchorsExternal: SiteExplorer.linkedAnchorsExternal,
		linkedAnchorsInternal: SiteExplorer.linkedAnchorsInternal,
		metricsByCountry: SiteExplorer.metricsByCountry,
		outlinksStats: SiteExplorer.outlinksStats,
		pagesByInternalLinks: SiteExplorer.pagesByInternalLinks,
		pagesHistory: SiteExplorer.pagesHistory,
		paidPages: SiteExplorer.paidPages,
		totalSearchVolumeHistory: SiteExplorer.totalSearchVolumeHistory,
		urlRatingHistory: SiteExplorer.urlRatingHistory,
	},
	keywordsExplorer: {
		overview: KeywordsExplorer.overview,
		matchingTerms: KeywordsExplorer.matchingTerms,
		relatedTerms: KeywordsExplorer.relatedTerms,
		searchSuggestions: KeywordsExplorer.searchSuggestions,
		volumeHistory: KeywordsExplorer.volumeHistory,
		volumeByCountry: KeywordsExplorer.volumeByCountry,
	},
	rankTracker: {
		overview: RankTracker.overview,
		serpOverview: RankTracker.serpOverview,
		competitorsOverview: RankTracker.competitorsOverview,
		competitorsDomains: RankTracker.competitorsDomains,
		competitorsPages: RankTracker.competitorsPages,
		competitorsStats: RankTracker.competitorsStats,
	},
	serp: {
		overview: SerpOverview.overview,
	},
	subscriptionInfo: {
		limitsAndUsage: SubscriptionInfo.limitsAndUsage,
	},
	gsc: {
		keywords: Gsc.keywords,
		pages: Gsc.pages,
		performanceHistory: Gsc.performanceHistory,
		keywordHistory: Gsc.keywordHistory,
		pageHistory: Gsc.pageHistory,
		pagesHistory: Gsc.pagesHistory,
		positionsHistory: Gsc.positionsHistory,
		ctrByPosition: Gsc.ctrByPosition,
		performanceByDevice: Gsc.performanceByDevice,
		performanceByPosition: Gsc.performanceByPosition,
		metricsByCountry: Gsc.metricsByCountry,
		anonymousQueries: Gsc.anonymousQueries,
	},
	siteAudit: {
		projects: SiteAudit.projects,
		issues: SiteAudit.issues,
		pageExplorer: SiteAudit.pageExplorer,
		pageContent: SiteAudit.pageContent,
	},
	management: {
		projects: Management.projects,
		projectKeywords: Management.projectKeywords,
		keywordLists: Management.keywordLists,
		keywordListKeywords: Management.keywordListKeywords,
		locations: Management.locations,
		createProject: Management.createProject,
		updateProject: Management.updateProject,
		deleteProjects: Management.deleteProjects,
		addProjectKeywords: Management.addProjectKeywords,
		deleteProjectKeywords: Management.deleteProjectKeywords,
		addProjectKeywordTags: Management.addProjectKeywordTags,
		deleteProjectKeywordTags: Management.deleteProjectKeywordTags,
		projectCompetitors: Management.projectCompetitors,
		addProjectCompetitors: Management.addProjectCompetitors,
		deleteProjectCompetitors: Management.deleteProjectCompetitors,
		createKeywordList: Management.createKeywordList,
		deleteKeywordLists: Management.deleteKeywordLists,
		addKeywordListKeywords: Management.addKeywordListKeywords,
		deleteKeywordListKeywords: Management.deleteKeywordListKeywords,
		brandRadarReports: Management.brandRadarReports,
		createBrandRadarReport: Management.createBrandRadarReport,
		updateBrandRadarReport: Management.updateBrandRadarReport,
		brandRadarPrompts: Management.brandRadarPrompts,
		addBrandRadarPrompts: Management.addBrandRadarPrompts,
		updateBrandRadarPrompts: Management.updateBrandRadarPrompts,
		deleteBrandRadarPrompts: Management.deleteBrandRadarPrompts,
	},
	brandRadar: {
		aiResponses: BrandRadar.aiResponses,
		aiResponsesEntities: BrandRadar.aiResponsesEntities,
		citationsHistoryEntities: BrandRadar.citationsHistoryEntities,
		citationsOverviewEntities: BrandRadar.citationsOverviewEntities,
		citedDomains: BrandRadar.citedDomains,
		citedDomainsEntities: BrandRadar.citedDomainsEntities,
		citedPages: BrandRadar.citedPages,
		citedPagesEntities: BrandRadar.citedPagesEntities,
		impressionsHistory: BrandRadar.impressionsHistory,
		impressionsHistoryEntities: BrandRadar.impressionsHistoryEntities,
		impressionsOverview: BrandRadar.impressionsOverview,
		impressionsOverviewEntities: BrandRadar.impressionsOverviewEntities,
		mentionsHistory: BrandRadar.mentionsHistory,
		mentionsHistoryEntities: BrandRadar.mentionsHistoryEntities,
		mentionsOverview: BrandRadar.mentionsOverview,
		mentionsOverviewEntities: BrandRadar.mentionsOverviewEntities,
		sovHistory: BrandRadar.sovHistory,
		sovHistoryEntities: BrandRadar.sovHistoryEntities,
		sovOverview: BrandRadar.sovOverview,
		sovOverviewEntities: BrandRadar.sovOverviewEntities,
	},
	socialMedia: {
		channels: SocialMedia.channels,
		authors: SocialMedia.authors,
		posts: SocialMedia.posts,
		channelMetrics: SocialMedia.channelMetrics,
		postMetrics: SocialMedia.postMetrics,
		activityHistory: SocialMedia.activityHistory,
		createPost: SocialMedia.createPost,
		updatePost: SocialMedia.updatePost,
		deletePost: SocialMedia.deletePost,
	},
	batchAnalysis: {
		analyze: BatchAnalysis.analyze,
	},
	contentHelper: {
		topics: ContentHelper.topics,
	},
	public: {
		crawlerIps: PublicApi.crawlerIps,
		crawlerIpRanges: PublicApi.crawlerIpRanges,
		domainRatingFree: PublicApi.domainRatingFree,
		domainRatingFreeBatch: PublicApi.domainRatingFreeBatch,
		domainRatingTopDomains: PublicApi.domainRatingTopDomains,
	},
	webAnalytics: {
		stats: WebAnalytics.stats,
		chart: WebAnalytics.chart,
		topPages: WebAnalytics.topPages,
		topPagesChart: WebAnalytics.topPagesChart,
		entryPages: WebAnalytics.entryPages,
		entryPagesChart: WebAnalytics.entryPagesChart,
		exitPages: WebAnalytics.exitPages,
		exitPagesChart: WebAnalytics.exitPagesChart,
		referrers: WebAnalytics.referrers,
		referrersChart: WebAnalytics.referrersChart,
		sources: WebAnalytics.sources,
		sourcesChart: WebAnalytics.sourcesChart,
		sourceChannels: WebAnalytics.sourceChannels,
		sourceChannelsChart: WebAnalytics.sourceChannelsChart,
		utmParams: WebAnalytics.utmParams,
		utmParamsChart: WebAnalytics.utmParamsChart,
		countries: WebAnalytics.countries,
		countriesChart: WebAnalytics.countriesChart,
		cities: WebAnalytics.cities,
		citiesChart: WebAnalytics.citiesChart,
		continents: WebAnalytics.continents,
		continentsChart: WebAnalytics.continentsChart,
		languages: WebAnalytics.languages,
		languagesChart: WebAnalytics.languagesChart,
		devices: WebAnalytics.devices,
		devicesChart: WebAnalytics.devicesChart,
		browsers: WebAnalytics.browsers,
		browsersChart: WebAnalytics.browsersChart,
		browserVersions: WebAnalytics.browserVersions,
		browserVersionsChart: WebAnalytics.browserVersionsChart,
		operatingSystems: WebAnalytics.operatingSystems,
		operatingSystemsChart: WebAnalytics.operatingSystemsChart,
		operatingSystemsVersions: WebAnalytics.operatingSystemsVersions,
		operatingSystemsVersionsChart: WebAnalytics.operatingSystemsVersionsChart,
	},
} as const;

export const ahrefsEndpointSchemas = {
	'siteExplorer.getDomainRating': {
		input: AhrefsEndpointInputSchemas.getDomainRating,
		output: AhrefsEndpointOutputSchemas.getDomainRating,
	},
	'siteExplorer.backlinksStats': {
		input: AhrefsEndpointInputSchemas.backlinksStats,
		output: AhrefsEndpointOutputSchemas.backlinksStats,
	},
	'siteExplorer.organicKeywords': {
		input: AhrefsEndpointInputSchemas.organicKeywords,
		output: AhrefsEndpointOutputSchemas.organicKeywords,
	},
	'siteExplorer.refdomains': {
		input: AhrefsEndpointInputSchemas.refdomains,
		output: AhrefsEndpointOutputSchemas.refdomains,
	},
	'siteExplorer.topPages': {
		input: AhrefsEndpointInputSchemas.topPages,
		output: AhrefsEndpointOutputSchemas.topPages,
	},
	'keywordsExplorer.overview': {
		input: AhrefsEndpointInputSchemas.keywordsOverview,
		output: AhrefsEndpointOutputSchemas.keywordsOverview,
	},
	'rankTracker.overview': {
		input: AhrefsEndpointInputSchemas.rankTrackerOverview,
		output: AhrefsEndpointOutputSchemas.rankTrackerOverview,
	},
	'serp.overview': {
		input: AhrefsEndpointInputSchemas.serpOverview,
		output: AhrefsEndpointOutputSchemas.serpOverview,
	},
	'subscriptionInfo.limitsAndUsage': {
		input: AhrefsEndpointInputSchemas.limitsAndUsage,
		output: AhrefsEndpointOutputSchemas.limitsAndUsage,
	},
	'gsc.keywords': {
		input: AhrefsEndpointInputSchemas.gscKeywords,
		output: AhrefsEndpointOutputSchemas.gscKeywords,
	},
	'gsc.pages': {
		input: AhrefsEndpointInputSchemas.gscPages,
		output: AhrefsEndpointOutputSchemas.gscPages,
	},
	'gsc.performanceHistory': {
		input: AhrefsEndpointInputSchemas.gscPerformanceHistory,
		output: AhrefsEndpointOutputSchemas.gscPerformanceHistory,
	},
	'gsc.keywordHistory': {
		input: AhrefsEndpointInputSchemas.gscKeywordHistory,
		output: AhrefsEndpointOutputSchemas.gscKeywordHistory,
	},
	'gsc.pageHistory': {
		input: AhrefsEndpointInputSchemas.gscPageHistory,
		output: AhrefsEndpointOutputSchemas.gscPageHistory,
	},
	'gsc.pagesHistory': {
		input: AhrefsEndpointInputSchemas.gscPagesHistory,
		output: AhrefsEndpointOutputSchemas.gscPagesHistory,
	},
	'gsc.positionsHistory': {
		input: AhrefsEndpointInputSchemas.gscPositionsHistory,
		output: AhrefsEndpointOutputSchemas.gscPositionsHistory,
	},
	'gsc.ctrByPosition': {
		input: AhrefsEndpointInputSchemas.gscCtrByPosition,
		output: AhrefsEndpointOutputSchemas.gscCtrByPosition,
	},
	'gsc.performanceByDevice': {
		input: AhrefsEndpointInputSchemas.gscPerformanceByDevice,
		output: AhrefsEndpointOutputSchemas.gscPerformanceByDevice,
	},
	'gsc.performanceByPosition': {
		input: AhrefsEndpointInputSchemas.gscPerformanceByPosition,
		output: AhrefsEndpointOutputSchemas.gscPerformanceByPosition,
	},
	'gsc.metricsByCountry': {
		input: AhrefsEndpointInputSchemas.gscMetricsByCountry,
		output: AhrefsEndpointOutputSchemas.gscMetricsByCountry,
	},
	'gsc.anonymousQueries': {
		input: AhrefsEndpointInputSchemas.gscAnonymousQueries,
		output: AhrefsEndpointOutputSchemas.gscAnonymousQueries,
	},
	'siteAudit.projects': {
		input: AhrefsEndpointInputSchemas.siteAuditProjects,
		output: AhrefsEndpointOutputSchemas.siteAuditProjects,
	},
	'siteAudit.issues': {
		input: AhrefsEndpointInputSchemas.siteAuditIssues,
		output: AhrefsEndpointOutputSchemas.siteAuditIssues,
	},
	'siteAudit.pageExplorer': {
		input: AhrefsEndpointInputSchemas.siteAuditPageExplorer,
		output: AhrefsEndpointOutputSchemas.siteAuditPageExplorer,
	},
	'siteAudit.pageContent': {
		input: AhrefsEndpointInputSchemas.siteAuditPageContent,
		output: AhrefsEndpointOutputSchemas.siteAuditPageContent,
	},
	'keywordsExplorer.matchingTerms': {
		input: AhrefsEndpointInputSchemas.matchingTerms,
		output: AhrefsEndpointOutputSchemas.matchingTerms,
	},
	'keywordsExplorer.relatedTerms': {
		input: AhrefsEndpointInputSchemas.relatedTerms,
		output: AhrefsEndpointOutputSchemas.relatedTerms,
	},
	'keywordsExplorer.searchSuggestions': {
		input: AhrefsEndpointInputSchemas.searchSuggestions,
		output: AhrefsEndpointOutputSchemas.searchSuggestions,
	},
	'keywordsExplorer.volumeHistory': {
		input: AhrefsEndpointInputSchemas.volumeHistory,
		output: AhrefsEndpointOutputSchemas.volumeHistory,
	},
	'keywordsExplorer.volumeByCountry': {
		input: AhrefsEndpointInputSchemas.volumeByCountry,
		output: AhrefsEndpointOutputSchemas.volumeByCountry,
	},
	'siteExplorer.metrics': {
		input: AhrefsEndpointInputSchemas.siteMetrics,
		output: AhrefsEndpointOutputSchemas.siteMetrics,
	},
	'siteExplorer.metricsHistory': {
		input: AhrefsEndpointInputSchemas.metricsHistory,
		output: AhrefsEndpointOutputSchemas.metricsHistory,
	},
	'siteExplorer.domainRatingHistory': {
		input: AhrefsEndpointInputSchemas.domainRatingHistory,
		output: AhrefsEndpointOutputSchemas.domainRatingHistory,
	},
	'siteExplorer.allBacklinks': {
		input: AhrefsEndpointInputSchemas.allBacklinks,
		output: AhrefsEndpointOutputSchemas.allBacklinks,
	},
	'siteExplorer.brokenBacklinks': {
		input: AhrefsEndpointInputSchemas.brokenBacklinks,
		output: AhrefsEndpointOutputSchemas.brokenBacklinks,
	},
	'siteExplorer.anchors': {
		input: AhrefsEndpointInputSchemas.anchors,
		output: AhrefsEndpointOutputSchemas.anchors,
	},
	'siteExplorer.organicCompetitors': {
		input: AhrefsEndpointInputSchemas.organicCompetitors,
		output: AhrefsEndpointOutputSchemas.organicCompetitors,
	},
	'siteExplorer.pagesByTraffic': {
		input: AhrefsEndpointInputSchemas.pagesByTraffic,
		output: AhrefsEndpointOutputSchemas.pagesByTraffic,
	},
	'siteExplorer.refdomainsHistory': {
		input: AhrefsEndpointInputSchemas.refdomainsHistory,
		output: AhrefsEndpointOutputSchemas.refdomainsHistory,
	},
	'siteExplorer.keywordsHistory': {
		input: AhrefsEndpointInputSchemas.keywordsHistory,
		output: AhrefsEndpointOutputSchemas.keywordsHistory,
	},
	'siteExplorer.linkedDomains': {
		input: AhrefsEndpointInputSchemas.linkedDomains,
		output: AhrefsEndpointOutputSchemas.linkedDomains,
	},
	'siteExplorer.pagesByBacklinks': {
		input: AhrefsEndpointInputSchemas.pagesByBacklinks,
		output: AhrefsEndpointOutputSchemas.pagesByBacklinks,
	},
	'rankTracker.serpOverview': {
		input: AhrefsEndpointInputSchemas.rankTrackerSerpOverview,
		output: AhrefsEndpointOutputSchemas.rankTrackerSerpOverview,
	},
	'rankTracker.competitorsOverview': {
		input: AhrefsEndpointInputSchemas.rankTrackerCompetitorsOverview,
		output: AhrefsEndpointOutputSchemas.rankTrackerCompetitorsOverview,
	},
	'management.projects': {
		input: AhrefsEndpointInputSchemas.managementProjects,
		output: AhrefsEndpointOutputSchemas.managementProjects,
	},
	'management.projectKeywords': {
		input: AhrefsEndpointInputSchemas.managementProjectKeywords,
		output: AhrefsEndpointOutputSchemas.managementProjectKeywords,
	},
	'management.keywordLists': {
		input: AhrefsEndpointInputSchemas.managementKeywordLists,
		output: AhrefsEndpointOutputSchemas.managementKeywordLists,
	},
	'management.keywordListKeywords': {
		input: AhrefsEndpointInputSchemas.managementKeywordListKeywords,
		output: AhrefsEndpointOutputSchemas.managementKeywordListKeywords,
	},
	'management.locations': {
		input: AhrefsEndpointInputSchemas.managementLocations,
		output: AhrefsEndpointOutputSchemas.managementLocations,
	},
	'brandRadar.aiResponses': {
		input: AhrefsEndpointInputSchemas.brandRadarAiResponses,
		output: AhrefsEndpointOutputSchemas.brandRadarAiResponses,
	},
	'brandRadar.aiResponsesEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarAiResponsesEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarAiResponsesEntities,
	},
	'brandRadar.citationsHistoryEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarCitationsHistoryEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarCitationsHistoryEntities,
	},
	'brandRadar.citationsOverviewEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarCitationsOverviewEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarCitationsOverviewEntities,
	},
	'brandRadar.citedDomains': {
		input: AhrefsEndpointInputSchemas.brandRadarCitedDomains,
		output: AhrefsEndpointOutputSchemas.brandRadarCitedDomains,
	},
	'brandRadar.citedDomainsEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarCitedDomainsEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarCitedDomainsEntities,
	},
	'brandRadar.citedPages': {
		input: AhrefsEndpointInputSchemas.brandRadarCitedPages,
		output: AhrefsEndpointOutputSchemas.brandRadarCitedPages,
	},
	'brandRadar.citedPagesEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarCitedPagesEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarCitedPagesEntities,
	},
	'brandRadar.impressionsHistory': {
		input: AhrefsEndpointInputSchemas.brandRadarImpressionsHistory,
		output: AhrefsEndpointOutputSchemas.brandRadarImpressionsHistory,
	},
	'brandRadar.impressionsHistoryEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarImpressionsHistoryEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarImpressionsHistoryEntities,
	},
	'brandRadar.impressionsOverview': {
		input: AhrefsEndpointInputSchemas.brandRadarImpressionsOverview,
		output: AhrefsEndpointOutputSchemas.brandRadarImpressionsOverview,
	},
	'brandRadar.impressionsOverviewEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarImpressionsOverviewEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarImpressionsOverviewEntities,
	},
	'brandRadar.mentionsHistory': {
		input: AhrefsEndpointInputSchemas.brandRadarMentionsHistory,
		output: AhrefsEndpointOutputSchemas.brandRadarMentionsHistory,
	},
	'brandRadar.mentionsHistoryEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarMentionsHistoryEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarMentionsHistoryEntities,
	},
	'brandRadar.mentionsOverview': {
		input: AhrefsEndpointInputSchemas.brandRadarMentionsOverview,
		output: AhrefsEndpointOutputSchemas.brandRadarMentionsOverview,
	},
	'brandRadar.mentionsOverviewEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarMentionsOverviewEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarMentionsOverviewEntities,
	},
	'brandRadar.sovHistory': {
		input: AhrefsEndpointInputSchemas.brandRadarSovHistory,
		output: AhrefsEndpointOutputSchemas.brandRadarSovHistory,
	},
	'brandRadar.sovHistoryEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarSovHistoryEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarSovHistoryEntities,
	},
	'brandRadar.sovOverview': {
		input: AhrefsEndpointInputSchemas.brandRadarSovOverview,
		output: AhrefsEndpointOutputSchemas.brandRadarSovOverview,
	},
	'brandRadar.sovOverviewEntities': {
		input: AhrefsEndpointInputSchemas.brandRadarSovOverviewEntities,
		output: AhrefsEndpointOutputSchemas.brandRadarSovOverviewEntities,
	},
	'socialMedia.channels': {
		input: AhrefsEndpointInputSchemas.socialMediaChannels,
		output: AhrefsEndpointOutputSchemas.socialMediaChannels,
	},
	'socialMedia.authors': {
		input: AhrefsEndpointInputSchemas.socialMediaAuthors,
		output: AhrefsEndpointOutputSchemas.socialMediaAuthors,
	},
	'socialMedia.posts': {
		input: AhrefsEndpointInputSchemas.socialMediaPosts,
		output: AhrefsEndpointOutputSchemas.socialMediaPosts,
	},
	'socialMedia.channelMetrics': {
		input: AhrefsEndpointInputSchemas.socialMediaChannelMetrics,
		output: AhrefsEndpointOutputSchemas.socialMediaChannelMetrics,
	},
	'socialMedia.postMetrics': {
		input: AhrefsEndpointInputSchemas.socialMediaPostMetrics,
		output: AhrefsEndpointOutputSchemas.socialMediaPostMetrics,
	},
	'socialMedia.activityHistory': {
		input: AhrefsEndpointInputSchemas.socialMediaActivityHistory,
		output: AhrefsEndpointOutputSchemas.socialMediaActivityHistory,
	},
	'socialMedia.createPost': {
		input: AhrefsEndpointInputSchemas.socialMediaCreatePost,
		output: AhrefsEndpointOutputSchemas.socialMediaCreatePost,
	},
	'socialMedia.updatePost': {
		input: AhrefsEndpointInputSchemas.socialMediaUpdatePost,
		output: AhrefsEndpointOutputSchemas.socialMediaUpdatePost,
	},
	'socialMedia.deletePost': {
		input: AhrefsEndpointInputSchemas.socialMediaDeletePost,
		output: AhrefsEndpointOutputSchemas.socialMediaDeletePost,
	},
	'management.createProject': {
		input: AhrefsEndpointInputSchemas.managementCreateProject,
		output: AhrefsEndpointOutputSchemas.managementCreateProject,
	},
	'management.updateProject': {
		input: AhrefsEndpointInputSchemas.managementUpdateProject,
		output: AhrefsEndpointOutputSchemas.managementUpdateProject,
	},
	'management.deleteProjects': {
		input: AhrefsEndpointInputSchemas.managementDeleteProjects,
		output: AhrefsEndpointOutputSchemas.managementDeleteProjects,
	},
	'management.addProjectKeywords': {
		input: AhrefsEndpointInputSchemas.managementAddProjectKeywords,
		output: AhrefsEndpointOutputSchemas.managementAddProjectKeywords,
	},
	'management.deleteProjectKeywords': {
		input: AhrefsEndpointInputSchemas.managementDeleteProjectKeywords,
		output: AhrefsEndpointOutputSchemas.managementDeleteProjectKeywords,
	},
	'management.addProjectKeywordTags': {
		input: AhrefsEndpointInputSchemas.managementAddProjectKeywordTags,
		output: AhrefsEndpointOutputSchemas.managementAddProjectKeywordTags,
	},
	'management.deleteProjectKeywordTags': {
		input: AhrefsEndpointInputSchemas.managementDeleteProjectKeywordTags,
		output: AhrefsEndpointOutputSchemas.managementDeleteProjectKeywordTags,
	},
	'management.projectCompetitors': {
		input: AhrefsEndpointInputSchemas.managementProjectCompetitors,
		output: AhrefsEndpointOutputSchemas.managementProjectCompetitors,
	},
	'management.addProjectCompetitors': {
		input: AhrefsEndpointInputSchemas.managementAddProjectCompetitors,
		output: AhrefsEndpointOutputSchemas.managementAddProjectCompetitors,
	},
	'management.deleteProjectCompetitors': {
		input: AhrefsEndpointInputSchemas.managementDeleteProjectCompetitors,
		output: AhrefsEndpointOutputSchemas.managementDeleteProjectCompetitors,
	},
	'management.createKeywordList': {
		input: AhrefsEndpointInputSchemas.managementCreateKeywordList,
		output: AhrefsEndpointOutputSchemas.managementCreateKeywordList,
	},
	'management.deleteKeywordLists': {
		input: AhrefsEndpointInputSchemas.managementDeleteKeywordLists,
		output: AhrefsEndpointOutputSchemas.managementDeleteKeywordLists,
	},
	'management.addKeywordListKeywords': {
		input: AhrefsEndpointInputSchemas.managementAddKeywordListKeywords,
		output: AhrefsEndpointOutputSchemas.managementAddKeywordListKeywords,
	},
	'management.deleteKeywordListKeywords': {
		input: AhrefsEndpointInputSchemas.managementDeleteKeywordListKeywords,
		output: AhrefsEndpointOutputSchemas.managementDeleteKeywordListKeywords,
	},
	'management.brandRadarReports': {
		input: AhrefsEndpointInputSchemas.managementBrandRadarReports,
		output: AhrefsEndpointOutputSchemas.managementBrandRadarReports,
	},
	'management.createBrandRadarReport': {
		input: AhrefsEndpointInputSchemas.managementCreateBrandRadarReport,
		output: AhrefsEndpointOutputSchemas.managementCreateBrandRadarReport,
	},
	'management.updateBrandRadarReport': {
		input: AhrefsEndpointInputSchemas.managementUpdateBrandRadarReport,
		output: AhrefsEndpointOutputSchemas.managementUpdateBrandRadarReport,
	},
	'management.brandRadarPrompts': {
		input: AhrefsEndpointInputSchemas.managementBrandRadarPrompts,
		output: AhrefsEndpointOutputSchemas.managementBrandRadarPrompts,
	},
	'management.addBrandRadarPrompts': {
		input: AhrefsEndpointInputSchemas.managementAddBrandRadarPrompts,
		output: AhrefsEndpointOutputSchemas.managementAddBrandRadarPrompts,
	},
	'management.updateBrandRadarPrompts': {
		input: AhrefsEndpointInputSchemas.managementUpdateBrandRadarPrompts,
		output: AhrefsEndpointOutputSchemas.managementUpdateBrandRadarPrompts,
	},
	'management.deleteBrandRadarPrompts': {
		input: AhrefsEndpointInputSchemas.managementDeleteBrandRadarPrompts,
		output: AhrefsEndpointOutputSchemas.managementDeleteBrandRadarPrompts,
	},
	'siteExplorer.aiResponsesCount': {
		input: AhrefsEndpointInputSchemas.siteExplorerAiResponsesCount,
		output: AhrefsEndpointOutputSchemas.siteExplorerAiResponsesCount,
	},
	'siteExplorer.crawledPages': {
		input: AhrefsEndpointInputSchemas.siteExplorerCrawledPages,
		output: AhrefsEndpointOutputSchemas.siteExplorerCrawledPages,
	},
	'siteExplorer.linkedAnchorsExternal': {
		input: AhrefsEndpointInputSchemas.siteExplorerLinkedAnchorsExternal,
		output: AhrefsEndpointOutputSchemas.siteExplorerLinkedAnchorsExternal,
	},
	'siteExplorer.linkedAnchorsInternal': {
		input: AhrefsEndpointInputSchemas.siteExplorerLinkedAnchorsInternal,
		output: AhrefsEndpointOutputSchemas.siteExplorerLinkedAnchorsInternal,
	},
	'siteExplorer.metricsByCountry': {
		input: AhrefsEndpointInputSchemas.siteExplorerMetricsByCountry,
		output: AhrefsEndpointOutputSchemas.siteExplorerMetricsByCountry,
	},
	'siteExplorer.outlinksStats': {
		input: AhrefsEndpointInputSchemas.siteExplorerOutlinksStats,
		output: AhrefsEndpointOutputSchemas.siteExplorerOutlinksStats,
	},
	'siteExplorer.pagesByInternalLinks': {
		input: AhrefsEndpointInputSchemas.siteExplorerPagesByInternalLinks,
		output: AhrefsEndpointOutputSchemas.siteExplorerPagesByInternalLinks,
	},
	'siteExplorer.pagesHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerPagesHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerPagesHistory,
	},
	'siteExplorer.paidPages': {
		input: AhrefsEndpointInputSchemas.siteExplorerPaidPages,
		output: AhrefsEndpointOutputSchemas.siteExplorerPaidPages,
	},
	'siteExplorer.totalSearchVolumeHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerTotalSearchVolumeHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerTotalSearchVolumeHistory,
	},
	'siteExplorer.urlRatingHistory': {
		input: AhrefsEndpointInputSchemas.siteExplorerUrlRatingHistory,
		output: AhrefsEndpointOutputSchemas.siteExplorerUrlRatingHistory,
	},
	'rankTracker.competitorsDomains': {
		input: AhrefsEndpointInputSchemas.rankTrackerCompetitorsDomains,
		output: AhrefsEndpointOutputSchemas.rankTrackerCompetitorsDomains,
	},
	'rankTracker.competitorsPages': {
		input: AhrefsEndpointInputSchemas.rankTrackerCompetitorsPages,
		output: AhrefsEndpointOutputSchemas.rankTrackerCompetitorsPages,
	},
	'rankTracker.competitorsStats': {
		input: AhrefsEndpointInputSchemas.rankTrackerCompetitorsStats,
		output: AhrefsEndpointOutputSchemas.rankTrackerCompetitorsStats,
	},
	'batchAnalysis.analyze': {
		input: AhrefsEndpointInputSchemas.batchAnalysisAnalyze,
		output: AhrefsEndpointOutputSchemas.batchAnalysisAnalyze,
	},
	'contentHelper.topics': {
		input: AhrefsEndpointInputSchemas.contentHelperTopics,
		output: AhrefsEndpointOutputSchemas.contentHelperTopics,
	},
	'public.crawlerIps': {
		input: AhrefsEndpointInputSchemas.publicCrawlerIps,
		output: AhrefsEndpointOutputSchemas.publicCrawlerIps,
	},
	'public.crawlerIpRanges': {
		input: AhrefsEndpointInputSchemas.publicCrawlerIpRanges,
		output: AhrefsEndpointOutputSchemas.publicCrawlerIpRanges,
	},
	'public.domainRatingFree': {
		input: AhrefsEndpointInputSchemas.publicDomainRatingFree,
		output: AhrefsEndpointOutputSchemas.publicDomainRatingFree,
	},
	'public.domainRatingFreeBatch': {
		input: AhrefsEndpointInputSchemas.publicDomainRatingFreeBatch,
		output: AhrefsEndpointOutputSchemas.publicDomainRatingFreeBatch,
	},
	'public.domainRatingTopDomains': {
		input: AhrefsEndpointInputSchemas.publicDomainRatingTopDomains,
		output: AhrefsEndpointOutputSchemas.publicDomainRatingTopDomains,
	},
	'webAnalytics.stats': {
		input: AhrefsEndpointInputSchemas.webAnalyticsStats,
		output: AhrefsEndpointOutputSchemas.webAnalyticsStats,
	},
	'webAnalytics.chart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsChart,
	},
	'webAnalytics.topPages': {
		input: AhrefsEndpointInputSchemas.webAnalyticsTopPages,
		output: AhrefsEndpointOutputSchemas.webAnalyticsTopPages,
	},
	'webAnalytics.topPagesChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsTopPagesChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsTopPagesChart,
	},
	'webAnalytics.entryPages': {
		input: AhrefsEndpointInputSchemas.webAnalyticsEntryPages,
		output: AhrefsEndpointOutputSchemas.webAnalyticsEntryPages,
	},
	'webAnalytics.entryPagesChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsEntryPagesChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsEntryPagesChart,
	},
	'webAnalytics.exitPages': {
		input: AhrefsEndpointInputSchemas.webAnalyticsExitPages,
		output: AhrefsEndpointOutputSchemas.webAnalyticsExitPages,
	},
	'webAnalytics.exitPagesChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsExitPagesChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsExitPagesChart,
	},
	'webAnalytics.referrers': {
		input: AhrefsEndpointInputSchemas.webAnalyticsReferrers,
		output: AhrefsEndpointOutputSchemas.webAnalyticsReferrers,
	},
	'webAnalytics.referrersChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsReferrersChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsReferrersChart,
	},
	'webAnalytics.sources': {
		input: AhrefsEndpointInputSchemas.webAnalyticsSources,
		output: AhrefsEndpointOutputSchemas.webAnalyticsSources,
	},
	'webAnalytics.sourcesChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsSourcesChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsSourcesChart,
	},
	'webAnalytics.sourceChannels': {
		input: AhrefsEndpointInputSchemas.webAnalyticsSourceChannels,
		output: AhrefsEndpointOutputSchemas.webAnalyticsSourceChannels,
	},
	'webAnalytics.sourceChannelsChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsSourceChannelsChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsSourceChannelsChart,
	},
	'webAnalytics.utmParams': {
		input: AhrefsEndpointInputSchemas.webAnalyticsUtmParams,
		output: AhrefsEndpointOutputSchemas.webAnalyticsUtmParams,
	},
	'webAnalytics.utmParamsChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsUtmParamsChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsUtmParamsChart,
	},
	'webAnalytics.countries': {
		input: AhrefsEndpointInputSchemas.webAnalyticsCountries,
		output: AhrefsEndpointOutputSchemas.webAnalyticsCountries,
	},
	'webAnalytics.countriesChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsCountriesChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsCountriesChart,
	},
	'webAnalytics.cities': {
		input: AhrefsEndpointInputSchemas.webAnalyticsCities,
		output: AhrefsEndpointOutputSchemas.webAnalyticsCities,
	},
	'webAnalytics.citiesChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsCitiesChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsCitiesChart,
	},
	'webAnalytics.continents': {
		input: AhrefsEndpointInputSchemas.webAnalyticsContinents,
		output: AhrefsEndpointOutputSchemas.webAnalyticsContinents,
	},
	'webAnalytics.continentsChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsContinentsChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsContinentsChart,
	},
	'webAnalytics.languages': {
		input: AhrefsEndpointInputSchemas.webAnalyticsLanguages,
		output: AhrefsEndpointOutputSchemas.webAnalyticsLanguages,
	},
	'webAnalytics.languagesChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsLanguagesChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsLanguagesChart,
	},
	'webAnalytics.devices': {
		input: AhrefsEndpointInputSchemas.webAnalyticsDevices,
		output: AhrefsEndpointOutputSchemas.webAnalyticsDevices,
	},
	'webAnalytics.devicesChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsDevicesChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsDevicesChart,
	},
	'webAnalytics.browsers': {
		input: AhrefsEndpointInputSchemas.webAnalyticsBrowsers,
		output: AhrefsEndpointOutputSchemas.webAnalyticsBrowsers,
	},
	'webAnalytics.browsersChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsBrowsersChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsBrowsersChart,
	},
	'webAnalytics.browserVersions': {
		input: AhrefsEndpointInputSchemas.webAnalyticsBrowserVersions,
		output: AhrefsEndpointOutputSchemas.webAnalyticsBrowserVersions,
	},
	'webAnalytics.browserVersionsChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsBrowserVersionsChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsBrowserVersionsChart,
	},
	'webAnalytics.operatingSystems': {
		input: AhrefsEndpointInputSchemas.webAnalyticsOperatingSystems,
		output: AhrefsEndpointOutputSchemas.webAnalyticsOperatingSystems,
	},
	'webAnalytics.operatingSystemsChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsOperatingSystemsChart,
		output: AhrefsEndpointOutputSchemas.webAnalyticsOperatingSystemsChart,
	},
	'webAnalytics.operatingSystemsVersions': {
		input: AhrefsEndpointInputSchemas.webAnalyticsOperatingSystemsVersions,
		output: AhrefsEndpointOutputSchemas.webAnalyticsOperatingSystemsVersions,
	},
	'webAnalytics.operatingSystemsVersionsChart': {
		input: AhrefsEndpointInputSchemas.webAnalyticsOperatingSystemsVersionsChart,
		output:
			AhrefsEndpointOutputSchemas.webAnalyticsOperatingSystemsVersionsChart,
	},
} satisfies RequiredPluginEndpointSchemas<typeof ahrefsEndpointsNested>;

const ahrefsEndpointMeta = {
	'siteExplorer.getDomainRating': {
		riskLevel: 'read',
		description: 'Get Ahrefs Domain Rating and Ahrefs Rank for a target',
	},
	'siteExplorer.backlinksStats': {
		riskLevel: 'read',
		description:
			'Get live and all-time backlink and referring-domain counts for a target',
	},
	'siteExplorer.organicKeywords': {
		riskLevel: 'read',
		description:
			'List organic keywords a target ranks for, including positions and traffic metrics',
	},
	'siteExplorer.refdomains': {
		riskLevel: 'read',
		description: 'List referring domains linking to a target',
	},
	'siteExplorer.topPages': {
		riskLevel: 'read',
		description:
			'List top organic pages for a target with traffic, keyword, and link metrics',
	},
	'keywordsExplorer.overview': {
		riskLevel: 'read',
		description:
			'Get keyword metrics such as volume, difficulty, CPC, clicks, and traffic potential',
	},
	'rankTracker.overview': {
		riskLevel: 'read',
		description:
			'Get Rank Tracker keyword overview data for a project and device',
	},
	'serp.overview': {
		riskLevel: 'read',
		description:
			'Get SERP positions for a keyword and country, including ranking page metrics',
	},
	'subscriptionInfo.limitsAndUsage': {
		riskLevel: 'read',
		description: 'Get Ahrefs subscription limits and API unit usage',
	},
	'gsc.keywords': {
		riskLevel: 'read',
		description:
			'List Search Console queries for a project with clicks, impressions, CTR and average position',
	},
	'gsc.pages': {
		riskLevel: 'read',
		description:
			'List Search Console pages for a project with clicks, impressions, CTR and average position',
	},
	'gsc.performanceHistory': {
		riskLevel: 'read',
		description:
			'Get Search Console clicks, impressions, CTR and position over time',
	},
	'gsc.keywordHistory': {
		riskLevel: 'read',
		description: 'Get Search Console history for specific queries',
	},
	'gsc.pageHistory': {
		riskLevel: 'read',
		description: 'Get Search Console history for specific pages',
	},
	'gsc.pagesHistory': {
		riskLevel: 'read',
		description:
			'Get the number of pages with Search Console impressions over time',
	},
	'gsc.positionsHistory': {
		riskLevel: 'read',
		description:
			'Get how many queries rank in each position bucket over time in Search Console',
	},
	'gsc.ctrByPosition': {
		riskLevel: 'read',
		description: 'Get average Search Console CTR for each ranking position',
	},
	'gsc.performanceByDevice': {
		riskLevel: 'read',
		description: 'Get Search Console performance split by device',
	},
	'gsc.performanceByPosition': {
		riskLevel: 'read',
		description:
			'Get Search Console clicks and impressions split by position range',
	},
	'gsc.metricsByCountry': {
		riskLevel: 'read',
		description: 'Get Search Console clicks by country',
	},
	'gsc.anonymousQueries': {
		riskLevel: 'read',
		description:
			'Estimate the queries Search Console hides as anonymous for a project',
	},
	'siteAudit.projects': {
		riskLevel: 'read',
		description: 'List Site Audit projects with health scores and issue counts',
	},
	'siteAudit.issues': {
		riskLevel: 'read',
		description:
			'List Site Audit issues for a project with affected URL counts',
	},
	'siteAudit.pageExplorer': {
		riskLevel: 'read',
		description:
			'List crawled pages from a Site Audit project, optionally only those with a given issue',
	},
	'siteAudit.pageContent': {
		riskLevel: 'read',
		description:
			'Get the crawled content of one page from a Site Audit project',
	},
	'keywordsExplorer.matchingTerms': {
		riskLevel: 'read',
		description: 'Find keyword ideas that contain the seed keywords',
	},
	'keywordsExplorer.relatedTerms': {
		riskLevel: 'read',
		description:
			'Find related keyword ideas that top pages also rank for or talk about',
	},
	'keywordsExplorer.searchSuggestions': {
		riskLevel: 'read',
		description: 'Get search autocomplete suggestions for seed keywords',
	},
	'keywordsExplorer.volumeHistory': {
		riskLevel: 'read',
		description: 'Get monthly search volume history for a keyword',
	},
	'keywordsExplorer.volumeByCountry': {
		riskLevel: 'read',
		description: 'Get search volume for keywords in each country',
	},
	'siteExplorer.metrics': {
		riskLevel: 'read',
		description:
			'Get organic and paid traffic, keyword and value metrics for a target',
	},
	'siteExplorer.metricsHistory': {
		riskLevel: 'read',
		description: 'Get organic and paid traffic and value history for a target',
	},
	'siteExplorer.domainRatingHistory': {
		riskLevel: 'read',
		description: 'Get Domain Rating history for a target',
	},
	'siteExplorer.allBacklinks': {
		riskLevel: 'read',
		description: 'List backlinks pointing to a target',
	},
	'siteExplorer.brokenBacklinks': {
		riskLevel: 'read',
		description: 'List backlinks pointing to broken pages on a target',
	},
	'siteExplorer.anchors': {
		riskLevel: 'read',
		description: 'List anchor texts of backlinks pointing to a target',
	},
	'siteExplorer.organicCompetitors': {
		riskLevel: 'read',
		description:
			'List sites that compete with a target for the same organic keywords',
	},
	'siteExplorer.pagesByTraffic': {
		riskLevel: 'read',
		description:
			'Get how many pages of a target fall into each organic traffic range',
	},
	'siteExplorer.refdomainsHistory': {
		riskLevel: 'read',
		description: 'Get referring domains count history for a target',
	},
	'siteExplorer.keywordsHistory': {
		riskLevel: 'read',
		description:
			'Get organic keyword counts by position bucket over time for a target',
	},
	'siteExplorer.linkedDomains': {
		riskLevel: 'read',
		description: 'List external domains a target links to',
	},
	'siteExplorer.pagesByBacklinks': {
		riskLevel: 'read',
		description:
			'List pages of a target ranked by backlinks and referring domains',
	},
	'rankTracker.serpOverview': {
		riskLevel: 'read',
		description:
			'Get the latest search results for a tracked keyword in a Rank Tracker project',
	},
	'rankTracker.competitorsOverview': {
		riskLevel: 'read',
		description:
			'Compare positions of tracked keywords against project competitors',
	},
	'management.projects': {
		riskLevel: 'read',
		description: 'List Ahrefs projects in the workspace',
	},
	'management.projectKeywords': {
		riskLevel: 'read',
		description: 'List keywords tracked in a Rank Tracker project',
	},
	'management.keywordLists': {
		riskLevel: 'read',
		description: 'List saved Keywords Explorer keyword lists',
	},
	'management.keywordListKeywords': {
		riskLevel: 'read',
		description: 'List keywords in a saved keyword list',
	},
	'management.locations': {
		riskLevel: 'read',
		description: 'Look up Rank Tracker location ids for a country',
	},
	'brandRadar.aiResponses': {
		riskLevel: 'read',
		description:
			'Brand Radar: get AI assistant answers that mention the brand or competitors',
	},
	'brandRadar.aiResponsesEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get AI assistant answers that mention the brand or competitors, with brands and competitors given as names or URL groups',
	},
	'brandRadar.citationsHistoryEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get citation counts over time, with brands and competitors given as names or URL groups',
	},
	'brandRadar.citationsOverviewEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get citation counts per brand, with brands and competitors given as names or URL groups',
	},
	'brandRadar.citedDomains': {
		riskLevel: 'read',
		description:
			'Brand Radar: get domains AI assistants cite in answers about the brand',
	},
	'brandRadar.citedDomainsEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get domains AI assistants cite in answers about the brand, with brands and competitors given as names or URL groups',
	},
	'brandRadar.citedPages': {
		riskLevel: 'read',
		description:
			'Brand Radar: get pages AI assistants cite in answers about the brand',
	},
	'brandRadar.citedPagesEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get pages AI assistants cite in answers about the brand, with brands and competitors given as names or URL groups',
	},
	'brandRadar.impressionsHistory': {
		riskLevel: 'read',
		description: 'Brand Radar: get AI answer impressions over time',
	},
	'brandRadar.impressionsHistoryEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get AI answer impressions over time, with brands and competitors given as names or URL groups',
	},
	'brandRadar.impressionsOverview': {
		riskLevel: 'read',
		description: 'Brand Radar: get AI answer impressions per brand',
	},
	'brandRadar.impressionsOverviewEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get AI answer impressions per brand, with brands and competitors given as names or URL groups',
	},
	'brandRadar.mentionsHistory': {
		riskLevel: 'read',
		description: 'Brand Radar: get brand mentions in AI answers over time',
	},
	'brandRadar.mentionsHistoryEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get brand mentions in AI answers over time, with brands and competitors given as names or URL groups',
	},
	'brandRadar.mentionsOverview': {
		riskLevel: 'read',
		description: 'Brand Radar: get brand mentions in AI answers per brand',
	},
	'brandRadar.mentionsOverviewEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get brand mentions in AI answers per brand, with brands and competitors given as names or URL groups',
	},
	'brandRadar.sovHistory': {
		riskLevel: 'read',
		description: 'Brand Radar: get AI share of voice over time',
	},
	'brandRadar.sovHistoryEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get AI share of voice over time, with brands and competitors given as names or URL groups',
	},
	'brandRadar.sovOverview': {
		riskLevel: 'read',
		description: 'Brand Radar: get AI share of voice per brand',
	},
	'brandRadar.sovOverviewEntities': {
		riskLevel: 'read',
		description:
			'Brand Radar: get AI share of voice per brand, with brands and competitors given as names or URL groups',
	},
	'socialMedia.channels': {
		riskLevel: 'read',
		description: 'List connected social media channels',
	},
	'socialMedia.authors': {
		riskLevel: 'read',
		description: 'List social media post authors in the workspace',
	},
	'socialMedia.posts': {
		riskLevel: 'read',
		description: 'List social media posts by status, channel or author',
	},
	'socialMedia.channelMetrics': {
		riskLevel: 'read',
		description: 'Get follower count history for a social media channel',
	},
	'socialMedia.postMetrics': {
		riskLevel: 'read',
		description: 'Get views, likes and platform metrics for a published post',
	},
	'socialMedia.activityHistory': {
		riskLevel: 'read',
		description: 'List the activity log of a social media post',
	},
	'socialMedia.createPost': {
		riskLevel: 'write',
		description:
			'Create a social media post: publish now, schedule it or save a draft',
	},
	'socialMedia.updatePost': {
		riskLevel: 'write',
		description: "Update a social media post's text, channels or timing",
	},
	'socialMedia.deletePost': {
		riskLevel: 'destructive',
		description: 'Delete a social media post',
	},
	'management.createProject': {
		riskLevel: 'write',
		description: 'Create an Ahrefs project for a target',
	},
	'management.updateProject': {
		riskLevel: 'write',
		description: "Change a project's access or folder",
	},
	'management.deleteProjects': {
		riskLevel: 'destructive',
		description: 'Delete Ahrefs projects',
	},
	'management.addProjectKeywords': {
		riskLevel: 'write',
		description: 'Add tracked keywords to a Rank Tracker project',
	},
	'management.deleteProjectKeywords': {
		riskLevel: 'destructive',
		description: 'Remove tracked keywords from a Rank Tracker project',
	},
	'management.addProjectKeywordTags': {
		riskLevel: 'write',
		description: 'Add or replace tags on tracked keywords',
	},
	'management.deleteProjectKeywordTags': {
		riskLevel: 'destructive',
		description: 'Remove tags from tracked keywords',
	},
	'management.projectCompetitors': {
		riskLevel: 'read',
		description: 'List competitors of a Rank Tracker project',
	},
	'management.addProjectCompetitors': {
		riskLevel: 'write',
		description: 'Add competitors to a Rank Tracker project',
	},
	'management.deleteProjectCompetitors': {
		riskLevel: 'destructive',
		description: 'Remove competitors from a Rank Tracker project',
	},
	'management.createKeywordList': {
		riskLevel: 'write',
		description: 'Create a Keywords Explorer keyword list',
	},
	'management.deleteKeywordLists': {
		riskLevel: 'destructive',
		description: 'Delete Keywords Explorer keyword lists',
	},
	'management.addKeywordListKeywords': {
		riskLevel: 'write',
		description: 'Add keywords to a keyword list',
	},
	'management.deleteKeywordListKeywords': {
		riskLevel: 'destructive',
		description: 'Remove keywords from a keyword list',
	},
	'management.brandRadarReports': {
		riskLevel: 'read',
		description: 'List Brand Radar reports',
	},
	'management.createBrandRadarReport': {
		riskLevel: 'write',
		description: 'Create a Brand Radar report for a brand and its competitors',
	},
	'management.updateBrandRadarReport': {
		riskLevel: 'write',
		description: "Update a Brand Radar report's brands, countries or filters",
	},
	'management.brandRadarPrompts': {
		riskLevel: 'read',
		description: 'List custom prompts of a Brand Radar report',
	},
	'management.addBrandRadarPrompts': {
		riskLevel: 'write',
		description: 'Add custom prompts to a Brand Radar report',
	},
	'management.updateBrandRadarPrompts': {
		riskLevel: 'write',
		description: 'Change countries or tags of Brand Radar prompts',
	},
	'management.deleteBrandRadarPrompts': {
		riskLevel: 'destructive',
		description: 'Remove custom prompts from a Brand Radar report',
	},
	'siteExplorer.aiResponsesCount': {
		riskLevel: 'read',
		description: 'Count AI assistant answers that cite a target, per platform',
	},
	'siteExplorer.crawledPages': {
		riskLevel: 'read',
		description:
			'List pages of a target that Ahrefs has crawled, with status and type',
	},
	'siteExplorer.linkedAnchorsExternal': {
		riskLevel: 'read',
		description:
			'List anchor texts a target uses in its outgoing external links',
	},
	'siteExplorer.linkedAnchorsInternal': {
		riskLevel: 'read',
		description: 'List anchor texts a target uses in its internal links',
	},
	'siteExplorer.metricsByCountry': {
		riskLevel: 'read',
		description:
			'Get organic and paid traffic metrics for a target split by country',
	},
	'siteExplorer.outlinksStats': {
		riskLevel: 'read',
		description: 'Get counts of outgoing links and linked domains for a target',
	},
	'siteExplorer.pagesByInternalLinks': {
		riskLevel: 'read',
		description:
			'List pages of a target ranked by internal links pointing to them',
	},
	'siteExplorer.pagesHistory': {
		riskLevel: 'read',
		description: 'Get the number of ranking pages of a target over time',
	},
	'siteExplorer.paidPages': {
		riskLevel: 'read',
		description: 'List pages of a target that get paid search traffic',
	},
	'siteExplorer.totalSearchVolumeHistory': {
		riskLevel: 'read',
		description:
			'Get the total search volume of keywords a target ranks for over time',
	},
	'siteExplorer.urlRatingHistory': {
		riskLevel: 'read',
		description: 'Get URL Rating history for a page',
	},
	'rankTracker.competitorsDomains': {
		riskLevel: 'read',
		description:
			'Compare traffic and share of voice of competitor domains in a Rank Tracker project',
	},
	'rankTracker.competitorsPages': {
		riskLevel: 'read',
		description:
			"List competitor pages ranking for a Rank Tracker project's keywords",
	},
	'rankTracker.competitorsStats': {
		riskLevel: 'read',
		description:
			'Get position distribution and SERP feature counts for project competitors',
	},
	'batchAnalysis.analyze': {
		riskLevel: 'read',
		description: 'Get SEO metrics for up to 200 targets in one request',
	},
	'contentHelper.topics': {
		riskLevel: 'read',
		description:
			'Get the topics top-ranking pages cover for a keyword, with coverage scores',
	},
	'public.crawlerIps': {
		riskLevel: 'read',
		description: 'List the IP addresses Ahrefs crawlers use',
	},
	'public.crawlerIpRanges': {
		riskLevel: 'read',
		description: 'List the IP ranges Ahrefs crawlers use',
	},
	'public.domainRatingFree': {
		riskLevel: 'read',
		description: 'Get the free Domain Rating for one domain',
	},
	'public.domainRatingFreeBatch': {
		riskLevel: 'read',
		description: 'Get the free Domain Rating for several domains',
	},
	'public.domainRatingTopDomains': {
		riskLevel: 'read',
		description: 'List domains ranked by Domain Rating',
	},
	'webAnalytics.stats': {
		riskLevel: 'read',
		description:
			'Web Analytics: get visitors, visits, pageviews, bounce rate and session length for a period',
	},
	'webAnalytics.chart': {
		riskLevel: 'read',
		description:
			'Web Analytics: chart visitors, visits and pageviews over time',
	},
	'webAnalytics.topPages': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by page',
	},
	'webAnalytics.topPagesChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by page over time',
	},
	'webAnalytics.entryPages': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by entry page',
	},
	'webAnalytics.entryPagesChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by entry page over time',
	},
	'webAnalytics.exitPages': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by exit page',
	},
	'webAnalytics.exitPagesChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by exit page over time',
	},
	'webAnalytics.referrers': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by referrer',
	},
	'webAnalytics.referrersChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by referrer over time',
	},
	'webAnalytics.sources': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by traffic source',
	},
	'webAnalytics.sourcesChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by traffic source over time',
	},
	'webAnalytics.sourceChannels': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by source channel',
	},
	'webAnalytics.sourceChannelsChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by source channel over time',
	},
	'webAnalytics.utmParams': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by UTM parameter value',
	},
	'webAnalytics.utmParamsChart': {
		riskLevel: 'read',
		description:
			'Web Analytics: chart visitors by UTM parameter value over time',
	},
	'webAnalytics.countries': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by country',
	},
	'webAnalytics.countriesChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by country over time',
	},
	'webAnalytics.cities': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by city',
	},
	'webAnalytics.citiesChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by city over time',
	},
	'webAnalytics.continents': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by continent',
	},
	'webAnalytics.continentsChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by continent over time',
	},
	'webAnalytics.languages': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by browser language',
	},
	'webAnalytics.languagesChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by browser language over time',
	},
	'webAnalytics.devices': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by device type',
	},
	'webAnalytics.devicesChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by device type over time',
	},
	'webAnalytics.browsers': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by browser',
	},
	'webAnalytics.browsersChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by browser over time',
	},
	'webAnalytics.browserVersions': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by browser version',
	},
	'webAnalytics.browserVersionsChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by browser version over time',
	},
	'webAnalytics.operatingSystems': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by operating system',
	},
	'webAnalytics.operatingSystemsChart': {
		riskLevel: 'read',
		description: 'Web Analytics: chart visitors by operating system over time',
	},
	'webAnalytics.operatingSystemsVersions': {
		riskLevel: 'read',
		description: 'Web Analytics: list visitors by operating system version',
	},
	'webAnalytics.operatingSystemsVersionsChart': {
		riskLevel: 'read',
		description:
			'Web Analytics: chart visitors by operating system version over time',
	},
} satisfies RequiredPluginEndpointMeta<typeof ahrefsEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const ahrefsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAhrefsPlugin<T extends AhrefsPluginOptions> = CorsairPlugin<
	'ahrefs',
	typeof AhrefsSchema,
	typeof ahrefsEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof ahrefsAuthConfig
>;

export type InternalAhrefsPlugin = BaseAhrefsPlugin<AhrefsPluginOptions>;

export type ExternalAhrefsPlugin<T extends AhrefsPluginOptions> =
	BaseAhrefsPlugin<T>;

// The assertion is safe: AhrefsPluginOptions has no required fields (all are
// optional), so an empty object satisfies the constraint at runtime even
// though TypeScript cannot verify it without the assertion.
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
		options,
		hooks: options.hooks,
		endpoints: ahrefsEndpointsNested,
		webhooks: {},
		endpointMeta: ahrefsEndpointMeta,
		endpointSchemas: ahrefsEndpointSchemas,
		authConfig: ahrefsAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AhrefsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('ahrefs', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('ahrefs', 'api_key');
		},
	} satisfies InternalAhrefsPlugin;
}

export type {
	AhrefsEndpointInputs,
	AhrefsEndpointOutputs,
	AllBacklinksInput,
	AllBacklinksResponse,
	AllBacklinksRow,
	AnchorsInput,
	AnchorsResponse,
	AnchorsRow,
	BacklinksStatsInput,
	BacklinksStatsResponse,
	BatchAnalysisAnalyzeInput,
	BatchAnalysisAnalyzeResponse,
	BatchAnalysisAnalyzeRow,
	BrandRadarAiResponsesEntitiesInput,
	BrandRadarAiResponsesEntitiesResponse,
	BrandRadarAiResponsesEntitiesRow,
	BrandRadarAiResponsesInput,
	BrandRadarAiResponsesResponse,
	BrandRadarAiResponsesRow,
	BrandRadarCitationsHistoryEntitiesInput,
	BrandRadarCitationsHistoryEntitiesResponse,
	BrandRadarCitationsHistoryEntitiesRow,
	BrandRadarCitationsOverviewEntitiesInput,
	BrandRadarCitationsOverviewEntitiesResponse,
	BrandRadarCitationsOverviewEntitiesRow,
	BrandRadarCitedDomainsEntitiesInput,
	BrandRadarCitedDomainsEntitiesResponse,
	BrandRadarCitedDomainsEntitiesRow,
	BrandRadarCitedDomainsInput,
	BrandRadarCitedDomainsResponse,
	BrandRadarCitedDomainsRow,
	BrandRadarCitedPagesEntitiesInput,
	BrandRadarCitedPagesEntitiesResponse,
	BrandRadarCitedPagesEntitiesRow,
	BrandRadarCitedPagesInput,
	BrandRadarCitedPagesResponse,
	BrandRadarCitedPagesRow,
	BrandRadarImpressionsHistoryEntitiesInput,
	BrandRadarImpressionsHistoryEntitiesResponse,
	BrandRadarImpressionsHistoryEntitiesRow,
	BrandRadarImpressionsHistoryInput,
	BrandRadarImpressionsHistoryResponse,
	BrandRadarImpressionsHistoryRow,
	BrandRadarImpressionsOverviewEntitiesInput,
	BrandRadarImpressionsOverviewEntitiesResponse,
	BrandRadarImpressionsOverviewEntitiesRow,
	BrandRadarImpressionsOverviewInput,
	BrandRadarImpressionsOverviewResponse,
	BrandRadarImpressionsOverviewRow,
	BrandRadarMentionsHistoryEntitiesInput,
	BrandRadarMentionsHistoryEntitiesResponse,
	BrandRadarMentionsHistoryEntitiesRow,
	BrandRadarMentionsHistoryInput,
	BrandRadarMentionsHistoryResponse,
	BrandRadarMentionsHistoryRow,
	BrandRadarMentionsOverviewEntitiesInput,
	BrandRadarMentionsOverviewEntitiesResponse,
	BrandRadarMentionsOverviewEntitiesRow,
	BrandRadarMentionsOverviewInput,
	BrandRadarMentionsOverviewResponse,
	BrandRadarMentionsOverviewRow,
	BrandRadarSovHistoryEntitiesInput,
	BrandRadarSovHistoryEntitiesResponse,
	BrandRadarSovHistoryEntitiesRow,
	BrandRadarSovHistoryInput,
	BrandRadarSovHistoryResponse,
	BrandRadarSovHistoryRow,
	BrandRadarSovOverviewEntitiesInput,
	BrandRadarSovOverviewEntitiesResponse,
	BrandRadarSovOverviewEntitiesRow,
	BrandRadarSovOverviewInput,
	BrandRadarSovOverviewResponse,
	BrandRadarSovOverviewRow,
	BrokenBacklinksInput,
	BrokenBacklinksResponse,
	BrokenBacklinksRow,
	ContentHelperTopicsInput,
	ContentHelperTopicsResponse,
	ContentHelperTopicsRow,
	DomainRatingHistoryInput,
	DomainRatingHistoryResponse,
	DomainRatingHistoryRow,
	DomainRatingInput,
	DomainRatingResponse,
	GscAnonymousQueriesInput,
	GscAnonymousQueriesResponse,
	GscAnonymousQueriesRow,
	GscCtrByPositionInput,
	GscCtrByPositionResponse,
	GscCtrByPositionRow,
	GscKeywordHistoryInput,
	GscKeywordHistoryResponse,
	GscKeywordHistoryRow,
	GscKeywordsInput,
	GscKeywordsResponse,
	GscKeywordsRow,
	GscMetricsByCountryInput,
	GscMetricsByCountryResponse,
	GscMetricsByCountryRow,
	GscPageHistoryInput,
	GscPageHistoryResponse,
	GscPageHistoryRow,
	GscPagesHistoryInput,
	GscPagesHistoryResponse,
	GscPagesHistoryRow,
	GscPagesInput,
	GscPagesResponse,
	GscPagesRow,
	GscPerformanceByDeviceInput,
	GscPerformanceByDeviceResponse,
	GscPerformanceByDeviceRow,
	GscPerformanceByPositionInput,
	GscPerformanceByPositionResponse,
	GscPerformanceByPositionRow,
	GscPerformanceHistoryInput,
	GscPerformanceHistoryResponse,
	GscPerformanceHistoryRow,
	GscPositionsHistoryInput,
	GscPositionsHistoryResponse,
	GscPositionsHistoryRow,
	KeywordOverview,
	KeywordsHistoryInput,
	KeywordsHistoryResponse,
	KeywordsHistoryRow,
	KeywordsOverviewInput,
	KeywordsOverviewResponse,
	LimitsAndUsage,
	LimitsAndUsageInput,
	LimitsAndUsageResponse,
	LinkedDomainsInput,
	LinkedDomainsResponse,
	LinkedDomainsRow,
	ManagementAddBrandRadarPromptsInput,
	ManagementAddBrandRadarPromptsResponse,
	ManagementAddBrandRadarPromptsRow,
	ManagementAddKeywordListKeywordsInput,
	ManagementAddKeywordListKeywordsResponse,
	ManagementAddKeywordListKeywordsRow,
	ManagementAddProjectCompetitorsInput,
	ManagementAddProjectCompetitorsResponse,
	ManagementAddProjectCompetitorsRow,
	ManagementAddProjectKeywordsInput,
	ManagementAddProjectKeywordsResponse,
	ManagementAddProjectKeywordsRow,
	ManagementAddProjectKeywordTagsInput,
	ManagementAddProjectKeywordTagsResponse,
	ManagementAddProjectKeywordTagsRow,
	ManagementBrandRadarPromptsInput,
	ManagementBrandRadarPromptsResponse,
	ManagementBrandRadarPromptsRow,
	ManagementBrandRadarReportsInput,
	ManagementBrandRadarReportsResponse,
	ManagementBrandRadarReportsRow,
	ManagementCreateBrandRadarReportInput,
	ManagementCreateBrandRadarReportResponse,
	ManagementCreateBrandRadarReportRow,
	ManagementCreateKeywordListInput,
	ManagementCreateKeywordListResponse,
	ManagementCreateProjectInput,
	ManagementCreateProjectResponse,
	ManagementCreateProjectRow,
	ManagementDeleteBrandRadarPromptsInput,
	ManagementDeleteBrandRadarPromptsResponse,
	ManagementDeleteBrandRadarPromptsRow,
	ManagementDeleteKeywordListKeywordsInput,
	ManagementDeleteKeywordListKeywordsResponse,
	ManagementDeleteKeywordListKeywordsRow,
	ManagementDeleteKeywordListsInput,
	ManagementDeleteKeywordListsResponse,
	ManagementDeleteKeywordListsRow,
	ManagementDeleteProjectCompetitorsInput,
	ManagementDeleteProjectCompetitorsResponse,
	ManagementDeleteProjectCompetitorsRow,
	ManagementDeleteProjectKeywordsInput,
	ManagementDeleteProjectKeywordsResponse,
	ManagementDeleteProjectKeywordsRow,
	ManagementDeleteProjectKeywordTagsInput,
	ManagementDeleteProjectKeywordTagsResponse,
	ManagementDeleteProjectKeywordTagsRow,
	ManagementDeleteProjectsInput,
	ManagementDeleteProjectsResponse,
	ManagementDeleteProjectsRow,
	ManagementKeywordListKeywordsInput,
	ManagementKeywordListKeywordsResponse,
	ManagementKeywordListKeywordsRow,
	ManagementKeywordListsInput,
	ManagementKeywordListsResponse,
	ManagementKeywordListsRow,
	ManagementLocationsInput,
	ManagementLocationsResponse,
	ManagementProjectCompetitorsInput,
	ManagementProjectCompetitorsResponse,
	ManagementProjectCompetitorsRow,
	ManagementProjectKeywordsInput,
	ManagementProjectKeywordsResponse,
	ManagementProjectKeywordsRow,
	ManagementProjectsInput,
	ManagementProjectsResponse,
	ManagementProjectsRow,
	ManagementUpdateBrandRadarPromptsInput,
	ManagementUpdateBrandRadarPromptsResponse,
	ManagementUpdateBrandRadarPromptsRow,
	ManagementUpdateBrandRadarReportInput,
	ManagementUpdateBrandRadarReportResponse,
	ManagementUpdateBrandRadarReportRow,
	ManagementUpdateProjectInput,
	ManagementUpdateProjectResponse,
	MatchingTermsInput,
	MatchingTermsResponse,
	MatchingTermsRow,
	MetricsHistoryInput,
	MetricsHistoryResponse,
	MetricsHistoryRow,
	OrganicCompetitorsInput,
	OrganicCompetitorsResponse,
	OrganicCompetitorsRow,
	OrganicKeyword,
	OrganicKeywordsInput,
	OrganicKeywordsResponse,
	PagesByBacklinksInput,
	PagesByBacklinksResponse,
	PagesByBacklinksRow,
	PagesByTrafficInput,
	PagesByTrafficResponse,
	PublicCrawlerIpRangesInput,
	PublicCrawlerIpRangesResponse,
	PublicCrawlerIpRangesRow,
	PublicCrawlerIpsInput,
	PublicCrawlerIpsResponse,
	PublicCrawlerIpsRow,
	PublicDomainRatingFreeBatchInput,
	PublicDomainRatingFreeBatchResponse,
	PublicDomainRatingFreeInput,
	PublicDomainRatingFreeResponse,
	PublicDomainRatingTopDomainsInput,
	PublicDomainRatingTopDomainsResponse,
	PublicDomainRatingTopDomainsRow,
	RankTrackerCompetitorsDomainsInput,
	RankTrackerCompetitorsDomainsResponse,
	RankTrackerCompetitorsDomainsRow,
	RankTrackerCompetitorsOverviewInput,
	RankTrackerCompetitorsOverviewResponse,
	RankTrackerCompetitorsOverviewRow,
	RankTrackerCompetitorsPagesInput,
	RankTrackerCompetitorsPagesResponse,
	RankTrackerCompetitorsPagesRow,
	RankTrackerCompetitorsStatsInput,
	RankTrackerCompetitorsStatsResponse,
	RankTrackerCompetitorsStatsRow,
	RankTrackerOverviewInput,
	RankTrackerOverviewItem,
	RankTrackerOverviewResponse,
	RankTrackerSerpOverviewInput,
	RankTrackerSerpOverviewResponse,
	RankTrackerSerpOverviewRow,
	Refdomain,
	RefdomainsHistoryInput,
	RefdomainsHistoryResponse,
	RefdomainsHistoryRow,
	RefdomainsInput,
	RefdomainsResponse,
	RelatedTermsInput,
	RelatedTermsResponse,
	RelatedTermsRow,
	SearchSuggestionsInput,
	SearchSuggestionsResponse,
	SearchSuggestionsRow,
	SerpOverviewInput,
	SerpOverviewResponse,
	SerpPosition,
	SiteAuditIssuesInput,
	SiteAuditIssuesResponse,
	SiteAuditIssuesRow,
	SiteAuditPageContentInput,
	SiteAuditPageContentResponse,
	SiteAuditPageExplorerInput,
	SiteAuditPageExplorerResponse,
	SiteAuditPageExplorerRow,
	SiteAuditProjectsInput,
	SiteAuditProjectsResponse,
	SiteAuditProjectsRow,
	SiteExplorerAiResponsesCountInput,
	SiteExplorerAiResponsesCountResponse,
	SiteExplorerCrawledPagesInput,
	SiteExplorerCrawledPagesResponse,
	SiteExplorerCrawledPagesRow,
	SiteExplorerLinkedAnchorsExternalInput,
	SiteExplorerLinkedAnchorsExternalResponse,
	SiteExplorerLinkedAnchorsExternalRow,
	SiteExplorerLinkedAnchorsInternalInput,
	SiteExplorerLinkedAnchorsInternalResponse,
	SiteExplorerLinkedAnchorsInternalRow,
	SiteExplorerMetricsByCountryInput,
	SiteExplorerMetricsByCountryResponse,
	SiteExplorerMetricsByCountryRow,
	SiteExplorerOutlinksStatsInput,
	SiteExplorerOutlinksStatsResponse,
	SiteExplorerPagesByInternalLinksInput,
	SiteExplorerPagesByInternalLinksResponse,
	SiteExplorerPagesByInternalLinksRow,
	SiteExplorerPagesHistoryInput,
	SiteExplorerPagesHistoryResponse,
	SiteExplorerPagesHistoryRow,
	SiteExplorerPaidPagesInput,
	SiteExplorerPaidPagesResponse,
	SiteExplorerPaidPagesRow,
	SiteExplorerTotalSearchVolumeHistoryInput,
	SiteExplorerTotalSearchVolumeHistoryResponse,
	SiteExplorerTotalSearchVolumeHistoryRow,
	SiteExplorerUrlRatingHistoryInput,
	SiteExplorerUrlRatingHistoryResponse,
	SiteExplorerUrlRatingHistoryRow,
	SiteMetricsInput,
	SiteMetricsResponse,
	SocialMediaActivityHistoryInput,
	SocialMediaActivityHistoryResponse,
	SocialMediaActivityHistoryRow,
	SocialMediaAuthorsInput,
	SocialMediaAuthorsResponse,
	SocialMediaAuthorsRow,
	SocialMediaChannelMetricsInput,
	SocialMediaChannelMetricsResponse,
	SocialMediaChannelMetricsRow,
	SocialMediaChannelsInput,
	SocialMediaChannelsResponse,
	SocialMediaChannelsRow,
	SocialMediaCreatePostInput,
	SocialMediaCreatePostResponse,
	SocialMediaDeletePostInput,
	SocialMediaDeletePostResponse,
	SocialMediaPostMetricsInput,
	SocialMediaPostMetricsResponse,
	SocialMediaPostMetricsRow,
	SocialMediaPostsInput,
	SocialMediaPostsResponse,
	SocialMediaPostsRow,
	SocialMediaUpdatePostInput,
	SocialMediaUpdatePostResponse,
	TopPage,
	TopPagesInput,
	TopPagesResponse,
	VolumeByCountryInput,
	VolumeByCountryResponse,
	VolumeByCountryRow,
	VolumeHistoryInput,
	VolumeHistoryResponse,
	VolumeHistoryRow,
	WebAnalyticsBrowsersChartInput,
	WebAnalyticsBrowsersChartResponse,
	WebAnalyticsBrowsersInput,
	WebAnalyticsBrowsersResponse,
	WebAnalyticsBrowserVersionsChartInput,
	WebAnalyticsBrowserVersionsChartResponse,
	WebAnalyticsBrowserVersionsInput,
	WebAnalyticsBrowserVersionsResponse,
	WebAnalyticsCitiesChartInput,
	WebAnalyticsCitiesChartResponse,
	WebAnalyticsCitiesInput,
	WebAnalyticsCitiesResponse,
	WebAnalyticsContinentsChartInput,
	WebAnalyticsContinentsChartResponse,
	WebAnalyticsContinentsInput,
	WebAnalyticsContinentsResponse,
	WebAnalyticsCountriesChartInput,
	WebAnalyticsCountriesChartResponse,
	WebAnalyticsCountriesInput,
	WebAnalyticsCountriesResponse,
	WebAnalyticsDevicesChartInput,
	WebAnalyticsDevicesChartResponse,
	WebAnalyticsDevicesInput,
	WebAnalyticsDevicesResponse,
	WebAnalyticsEntryPagesChartInput,
	WebAnalyticsEntryPagesChartResponse,
	WebAnalyticsEntryPagesInput,
	WebAnalyticsEntryPagesResponse,
	WebAnalyticsExitPagesChartInput,
	WebAnalyticsExitPagesChartResponse,
	WebAnalyticsExitPagesInput,
	WebAnalyticsExitPagesResponse,
	WebAnalyticsLanguagesChartInput,
	WebAnalyticsLanguagesChartResponse,
	WebAnalyticsLanguagesInput,
	WebAnalyticsLanguagesResponse,
	WebAnalyticsOperatingSystemsChartInput,
	WebAnalyticsOperatingSystemsChartResponse,
	WebAnalyticsOperatingSystemsInput,
	WebAnalyticsOperatingSystemsResponse,
	WebAnalyticsOperatingSystemsVersionsChartInput,
	WebAnalyticsOperatingSystemsVersionsChartResponse,
	WebAnalyticsOperatingSystemsVersionsInput,
	WebAnalyticsOperatingSystemsVersionsResponse,
	WebAnalyticsReferrersChartInput,
	WebAnalyticsReferrersChartResponse,
	WebAnalyticsReferrersInput,
	WebAnalyticsReferrersResponse,
	WebAnalyticsSourceChannelsChartInput,
	WebAnalyticsSourceChannelsChartResponse,
	WebAnalyticsSourceChannelsInput,
	WebAnalyticsSourceChannelsResponse,
	WebAnalyticsSourcesChartInput,
	WebAnalyticsSourcesChartResponse,
	WebAnalyticsSourcesInput,
	WebAnalyticsSourcesResponse,
	WebAnalyticsStatsInput,
	WebAnalyticsStatsResponse,
	WebAnalyticsTopPagesChartInput,
	WebAnalyticsTopPagesChartResponse,
	WebAnalyticsTopPagesInput,
	WebAnalyticsTopPagesResponse,
	WebAnalyticsTotalsChartInput,
	WebAnalyticsTotalsChartResponse,
	WebAnalyticsUtmParamsChartInput,
	WebAnalyticsUtmParamsChartResponse,
	WebAnalyticsUtmParamsInput,
	WebAnalyticsUtmParamsResponse,
} from './endpoints/types';

export {
	AhrefsEndpointInputSchemas,
	AhrefsEndpointOutputSchemas,
	AllBacklinksInputSchema,
	AllBacklinksResponseSchema,
	AllBacklinksRowSchema,
	AnchorsInputSchema,
	AnchorsResponseSchema,
	AnchorsRowSchema,
	BacklinksStatsInputSchema,
	BacklinksStatsResponseSchema,
	BatchAnalysisAnalyzeInputSchema,
	BatchAnalysisAnalyzeResponseSchema,
	BatchAnalysisAnalyzeRowSchema,
	BrandRadarAiResponsesEntitiesInputSchema,
	BrandRadarAiResponsesEntitiesResponseSchema,
	BrandRadarAiResponsesEntitiesRowSchema,
	BrandRadarAiResponsesInputSchema,
	BrandRadarAiResponsesResponseSchema,
	BrandRadarAiResponsesRowSchema,
	BrandRadarCitationsHistoryEntitiesInputSchema,
	BrandRadarCitationsHistoryEntitiesResponseSchema,
	BrandRadarCitationsHistoryEntitiesRowSchema,
	BrandRadarCitationsOverviewEntitiesInputSchema,
	BrandRadarCitationsOverviewEntitiesResponseSchema,
	BrandRadarCitationsOverviewEntitiesRowSchema,
	BrandRadarCitedDomainsEntitiesInputSchema,
	BrandRadarCitedDomainsEntitiesResponseSchema,
	BrandRadarCitedDomainsEntitiesRowSchema,
	BrandRadarCitedDomainsInputSchema,
	BrandRadarCitedDomainsResponseSchema,
	BrandRadarCitedDomainsRowSchema,
	BrandRadarCitedPagesEntitiesInputSchema,
	BrandRadarCitedPagesEntitiesResponseSchema,
	BrandRadarCitedPagesEntitiesRowSchema,
	BrandRadarCitedPagesInputSchema,
	BrandRadarCitedPagesResponseSchema,
	BrandRadarCitedPagesRowSchema,
	BrandRadarImpressionsHistoryEntitiesInputSchema,
	BrandRadarImpressionsHistoryEntitiesResponseSchema,
	BrandRadarImpressionsHistoryEntitiesRowSchema,
	BrandRadarImpressionsHistoryInputSchema,
	BrandRadarImpressionsHistoryResponseSchema,
	BrandRadarImpressionsHistoryRowSchema,
	BrandRadarImpressionsOverviewEntitiesInputSchema,
	BrandRadarImpressionsOverviewEntitiesResponseSchema,
	BrandRadarImpressionsOverviewEntitiesRowSchema,
	BrandRadarImpressionsOverviewInputSchema,
	BrandRadarImpressionsOverviewResponseSchema,
	BrandRadarImpressionsOverviewRowSchema,
	BrandRadarMentionsHistoryEntitiesInputSchema,
	BrandRadarMentionsHistoryEntitiesResponseSchema,
	BrandRadarMentionsHistoryEntitiesRowSchema,
	BrandRadarMentionsHistoryInputSchema,
	BrandRadarMentionsHistoryResponseSchema,
	BrandRadarMentionsHistoryRowSchema,
	BrandRadarMentionsOverviewEntitiesInputSchema,
	BrandRadarMentionsOverviewEntitiesResponseSchema,
	BrandRadarMentionsOverviewEntitiesRowSchema,
	BrandRadarMentionsOverviewInputSchema,
	BrandRadarMentionsOverviewResponseSchema,
	BrandRadarMentionsOverviewRowSchema,
	BrandRadarSovHistoryEntitiesInputSchema,
	BrandRadarSovHistoryEntitiesResponseSchema,
	BrandRadarSovHistoryEntitiesRowSchema,
	BrandRadarSovHistoryInputSchema,
	BrandRadarSovHistoryResponseSchema,
	BrandRadarSovHistoryRowSchema,
	BrandRadarSovOverviewEntitiesInputSchema,
	BrandRadarSovOverviewEntitiesResponseSchema,
	BrandRadarSovOverviewEntitiesRowSchema,
	BrandRadarSovOverviewInputSchema,
	BrandRadarSovOverviewResponseSchema,
	BrandRadarSovOverviewRowSchema,
	BrokenBacklinksInputSchema,
	BrokenBacklinksResponseSchema,
	BrokenBacklinksRowSchema,
	ContentHelperTopicsInputSchema,
	ContentHelperTopicsResponseSchema,
	ContentHelperTopicsRowSchema,
	DomainRatingHistoryInputSchema,
	DomainRatingHistoryResponseSchema,
	DomainRatingHistoryRowSchema,
	DomainRatingInputSchema,
	DomainRatingResponseSchema,
	GscAnonymousQueriesInputSchema,
	GscAnonymousQueriesResponseSchema,
	GscAnonymousQueriesRowSchema,
	GscCtrByPositionInputSchema,
	GscCtrByPositionResponseSchema,
	GscCtrByPositionRowSchema,
	GscKeywordHistoryInputSchema,
	GscKeywordHistoryResponseSchema,
	GscKeywordHistoryRowSchema,
	GscKeywordsInputSchema,
	GscKeywordsResponseSchema,
	GscKeywordsRowSchema,
	GscMetricsByCountryInputSchema,
	GscMetricsByCountryResponseSchema,
	GscMetricsByCountryRowSchema,
	GscPageHistoryInputSchema,
	GscPageHistoryResponseSchema,
	GscPageHistoryRowSchema,
	GscPagesHistoryInputSchema,
	GscPagesHistoryResponseSchema,
	GscPagesHistoryRowSchema,
	GscPagesInputSchema,
	GscPagesResponseSchema,
	GscPagesRowSchema,
	GscPerformanceByDeviceInputSchema,
	GscPerformanceByDeviceResponseSchema,
	GscPerformanceByDeviceRowSchema,
	GscPerformanceByPositionInputSchema,
	GscPerformanceByPositionResponseSchema,
	GscPerformanceByPositionRowSchema,
	GscPerformanceHistoryInputSchema,
	GscPerformanceHistoryResponseSchema,
	GscPerformanceHistoryRowSchema,
	GscPositionsHistoryInputSchema,
	GscPositionsHistoryResponseSchema,
	GscPositionsHistoryRowSchema,
	KeywordsHistoryInputSchema,
	KeywordsHistoryResponseSchema,
	KeywordsHistoryRowSchema,
	KeywordsOverviewInputSchema,
	KeywordsOverviewResponseSchema,
	LimitsAndUsageInputSchema,
	LimitsAndUsageResponseSchema,
	LinkedDomainsInputSchema,
	LinkedDomainsResponseSchema,
	LinkedDomainsRowSchema,
	ManagementAddBrandRadarPromptsInputSchema,
	ManagementAddBrandRadarPromptsResponseSchema,
	ManagementAddBrandRadarPromptsRowSchema,
	ManagementAddKeywordListKeywordsInputSchema,
	ManagementAddKeywordListKeywordsResponseSchema,
	ManagementAddKeywordListKeywordsRowSchema,
	ManagementAddProjectCompetitorsInputSchema,
	ManagementAddProjectCompetitorsResponseSchema,
	ManagementAddProjectCompetitorsRowSchema,
	ManagementAddProjectKeywordsInputSchema,
	ManagementAddProjectKeywordsResponseSchema,
	ManagementAddProjectKeywordsRowSchema,
	ManagementAddProjectKeywordTagsInputSchema,
	ManagementAddProjectKeywordTagsResponseSchema,
	ManagementAddProjectKeywordTagsRowSchema,
	ManagementBrandRadarPromptsInputSchema,
	ManagementBrandRadarPromptsResponseSchema,
	ManagementBrandRadarPromptsRowSchema,
	ManagementBrandRadarReportsInputSchema,
	ManagementBrandRadarReportsResponseSchema,
	ManagementBrandRadarReportsRowSchema,
	ManagementCreateBrandRadarReportInputSchema,
	ManagementCreateBrandRadarReportResponseSchema,
	ManagementCreateBrandRadarReportRowSchema,
	ManagementCreateKeywordListInputSchema,
	ManagementCreateKeywordListResponseSchema,
	ManagementCreateProjectInputSchema,
	ManagementCreateProjectResponseSchema,
	ManagementCreateProjectRowSchema,
	ManagementDeleteBrandRadarPromptsInputSchema,
	ManagementDeleteBrandRadarPromptsResponseSchema,
	ManagementDeleteBrandRadarPromptsRowSchema,
	ManagementDeleteKeywordListKeywordsInputSchema,
	ManagementDeleteKeywordListKeywordsResponseSchema,
	ManagementDeleteKeywordListKeywordsRowSchema,
	ManagementDeleteKeywordListsInputSchema,
	ManagementDeleteKeywordListsResponseSchema,
	ManagementDeleteKeywordListsRowSchema,
	ManagementDeleteProjectCompetitorsInputSchema,
	ManagementDeleteProjectCompetitorsResponseSchema,
	ManagementDeleteProjectCompetitorsRowSchema,
	ManagementDeleteProjectKeywordsInputSchema,
	ManagementDeleteProjectKeywordsResponseSchema,
	ManagementDeleteProjectKeywordsRowSchema,
	ManagementDeleteProjectKeywordTagsInputSchema,
	ManagementDeleteProjectKeywordTagsResponseSchema,
	ManagementDeleteProjectKeywordTagsRowSchema,
	ManagementDeleteProjectsInputSchema,
	ManagementDeleteProjectsResponseSchema,
	ManagementDeleteProjectsRowSchema,
	ManagementKeywordListKeywordsInputSchema,
	ManagementKeywordListKeywordsResponseSchema,
	ManagementKeywordListKeywordsRowSchema,
	ManagementKeywordListsInputSchema,
	ManagementKeywordListsResponseSchema,
	ManagementKeywordListsRowSchema,
	ManagementLocationsInputSchema,
	ManagementLocationsResponseSchema,
	ManagementProjectCompetitorsInputSchema,
	ManagementProjectCompetitorsResponseSchema,
	ManagementProjectCompetitorsRowSchema,
	ManagementProjectKeywordsInputSchema,
	ManagementProjectKeywordsResponseSchema,
	ManagementProjectKeywordsRowSchema,
	ManagementProjectsInputSchema,
	ManagementProjectsResponseSchema,
	ManagementProjectsRowSchema,
	ManagementUpdateBrandRadarPromptsInputSchema,
	ManagementUpdateBrandRadarPromptsResponseSchema,
	ManagementUpdateBrandRadarPromptsRowSchema,
	ManagementUpdateBrandRadarReportInputSchema,
	ManagementUpdateBrandRadarReportResponseSchema,
	ManagementUpdateBrandRadarReportRowSchema,
	ManagementUpdateProjectInputSchema,
	ManagementUpdateProjectResponseSchema,
	MatchingTermsInputSchema,
	MatchingTermsResponseSchema,
	MatchingTermsRowSchema,
	MetricsHistoryInputSchema,
	MetricsHistoryResponseSchema,
	MetricsHistoryRowSchema,
	OrganicCompetitorsInputSchema,
	OrganicCompetitorsResponseSchema,
	OrganicCompetitorsRowSchema,
	OrganicKeywordsInputSchema,
	OrganicKeywordsResponseSchema,
	PagesByBacklinksInputSchema,
	PagesByBacklinksResponseSchema,
	PagesByBacklinksRowSchema,
	PagesByTrafficInputSchema,
	PagesByTrafficResponseSchema,
	PublicCrawlerIpRangesInputSchema,
	PublicCrawlerIpRangesResponseSchema,
	PublicCrawlerIpRangesRowSchema,
	PublicCrawlerIpsInputSchema,
	PublicCrawlerIpsResponseSchema,
	PublicCrawlerIpsRowSchema,
	PublicDomainRatingFreeBatchInputSchema,
	PublicDomainRatingFreeBatchResponseSchema,
	PublicDomainRatingFreeInputSchema,
	PublicDomainRatingFreeResponseSchema,
	PublicDomainRatingTopDomainsInputSchema,
	PublicDomainRatingTopDomainsResponseSchema,
	PublicDomainRatingTopDomainsRowSchema,
	RankTrackerCompetitorsDomainsInputSchema,
	RankTrackerCompetitorsDomainsResponseSchema,
	RankTrackerCompetitorsDomainsRowSchema,
	RankTrackerCompetitorsOverviewInputSchema,
	RankTrackerCompetitorsOverviewResponseSchema,
	RankTrackerCompetitorsOverviewRowSchema,
	RankTrackerCompetitorsPagesInputSchema,
	RankTrackerCompetitorsPagesResponseSchema,
	RankTrackerCompetitorsPagesRowSchema,
	RankTrackerCompetitorsStatsInputSchema,
	RankTrackerCompetitorsStatsResponseSchema,
	RankTrackerCompetitorsStatsRowSchema,
	RankTrackerOverviewInputSchema,
	RankTrackerOverviewResponseSchema,
	RankTrackerSerpOverviewInputSchema,
	RankTrackerSerpOverviewResponseSchema,
	RankTrackerSerpOverviewRowSchema,
	RefdomainsHistoryInputSchema,
	RefdomainsHistoryResponseSchema,
	RefdomainsHistoryRowSchema,
	RefdomainsInputSchema,
	RefdomainsResponseSchema,
	RelatedTermsInputSchema,
	RelatedTermsResponseSchema,
	RelatedTermsRowSchema,
	SearchSuggestionsInputSchema,
	SearchSuggestionsResponseSchema,
	SearchSuggestionsRowSchema,
	SerpOverviewInputSchema,
	SerpOverviewResponseSchema,
	SiteAuditIssuesInputSchema,
	SiteAuditIssuesResponseSchema,
	SiteAuditIssuesRowSchema,
	SiteAuditPageContentInputSchema,
	SiteAuditPageContentResponseSchema,
	SiteAuditPageExplorerInputSchema,
	SiteAuditPageExplorerResponseSchema,
	SiteAuditPageExplorerRowSchema,
	SiteAuditProjectsInputSchema,
	SiteAuditProjectsResponseSchema,
	SiteAuditProjectsRowSchema,
	SiteExplorerAiResponsesCountInputSchema,
	SiteExplorerAiResponsesCountResponseSchema,
	SiteExplorerCrawledPagesInputSchema,
	SiteExplorerCrawledPagesResponseSchema,
	SiteExplorerCrawledPagesRowSchema,
	SiteExplorerLinkedAnchorsExternalInputSchema,
	SiteExplorerLinkedAnchorsExternalResponseSchema,
	SiteExplorerLinkedAnchorsExternalRowSchema,
	SiteExplorerLinkedAnchorsInternalInputSchema,
	SiteExplorerLinkedAnchorsInternalResponseSchema,
	SiteExplorerLinkedAnchorsInternalRowSchema,
	SiteExplorerMetricsByCountryInputSchema,
	SiteExplorerMetricsByCountryResponseSchema,
	SiteExplorerMetricsByCountryRowSchema,
	SiteExplorerOutlinksStatsInputSchema,
	SiteExplorerOutlinksStatsResponseSchema,
	SiteExplorerPagesByInternalLinksInputSchema,
	SiteExplorerPagesByInternalLinksResponseSchema,
	SiteExplorerPagesByInternalLinksRowSchema,
	SiteExplorerPagesHistoryInputSchema,
	SiteExplorerPagesHistoryResponseSchema,
	SiteExplorerPagesHistoryRowSchema,
	SiteExplorerPaidPagesInputSchema,
	SiteExplorerPaidPagesResponseSchema,
	SiteExplorerPaidPagesRowSchema,
	SiteExplorerTotalSearchVolumeHistoryInputSchema,
	SiteExplorerTotalSearchVolumeHistoryResponseSchema,
	SiteExplorerTotalSearchVolumeHistoryRowSchema,
	SiteExplorerUrlRatingHistoryInputSchema,
	SiteExplorerUrlRatingHistoryResponseSchema,
	SiteExplorerUrlRatingHistoryRowSchema,
	SiteMetricsInputSchema,
	SiteMetricsResponseSchema,
	SocialMediaActivityHistoryInputSchema,
	SocialMediaActivityHistoryResponseSchema,
	SocialMediaActivityHistoryRowSchema,
	SocialMediaAuthorsInputSchema,
	SocialMediaAuthorsResponseSchema,
	SocialMediaAuthorsRowSchema,
	SocialMediaChannelMetricsInputSchema,
	SocialMediaChannelMetricsResponseSchema,
	SocialMediaChannelMetricsRowSchema,
	SocialMediaChannelsInputSchema,
	SocialMediaChannelsResponseSchema,
	SocialMediaChannelsRowSchema,
	SocialMediaCreatePostInputSchema,
	SocialMediaCreatePostResponseSchema,
	SocialMediaDeletePostInputSchema,
	SocialMediaDeletePostResponseSchema,
	SocialMediaPostMetricsInputSchema,
	SocialMediaPostMetricsResponseSchema,
	SocialMediaPostMetricsRowSchema,
	SocialMediaPostsInputSchema,
	SocialMediaPostsResponseSchema,
	SocialMediaPostsRowSchema,
	SocialMediaUpdatePostInputSchema,
	SocialMediaUpdatePostResponseSchema,
	TopPagesInputSchema,
	TopPagesResponseSchema,
	VolumeByCountryInputSchema,
	VolumeByCountryResponseSchema,
	VolumeByCountryRowSchema,
	VolumeHistoryInputSchema,
	VolumeHistoryResponseSchema,
	VolumeHistoryRowSchema,
	WebAnalyticsBrowsersChartInputSchema,
	WebAnalyticsBrowsersChartResponseSchema,
	WebAnalyticsBrowsersInputSchema,
	WebAnalyticsBrowsersResponseSchema,
	WebAnalyticsBrowserVersionsChartInputSchema,
	WebAnalyticsBrowserVersionsChartResponseSchema,
	WebAnalyticsBrowserVersionsInputSchema,
	WebAnalyticsBrowserVersionsResponseSchema,
	WebAnalyticsCitiesChartInputSchema,
	WebAnalyticsCitiesChartResponseSchema,
	WebAnalyticsCitiesInputSchema,
	WebAnalyticsCitiesResponseSchema,
	WebAnalyticsContinentsChartInputSchema,
	WebAnalyticsContinentsChartResponseSchema,
	WebAnalyticsContinentsInputSchema,
	WebAnalyticsContinentsResponseSchema,
	WebAnalyticsCountriesChartInputSchema,
	WebAnalyticsCountriesChartResponseSchema,
	WebAnalyticsCountriesInputSchema,
	WebAnalyticsCountriesResponseSchema,
	WebAnalyticsDevicesChartInputSchema,
	WebAnalyticsDevicesChartResponseSchema,
	WebAnalyticsDevicesInputSchema,
	WebAnalyticsDevicesResponseSchema,
	WebAnalyticsEntryPagesChartInputSchema,
	WebAnalyticsEntryPagesChartResponseSchema,
	WebAnalyticsEntryPagesInputSchema,
	WebAnalyticsEntryPagesResponseSchema,
	WebAnalyticsExitPagesChartInputSchema,
	WebAnalyticsExitPagesChartResponseSchema,
	WebAnalyticsExitPagesInputSchema,
	WebAnalyticsExitPagesResponseSchema,
	WebAnalyticsLanguagesChartInputSchema,
	WebAnalyticsLanguagesChartResponseSchema,
	WebAnalyticsLanguagesInputSchema,
	WebAnalyticsLanguagesResponseSchema,
	WebAnalyticsOperatingSystemsChartInputSchema,
	WebAnalyticsOperatingSystemsChartResponseSchema,
	WebAnalyticsOperatingSystemsInputSchema,
	WebAnalyticsOperatingSystemsResponseSchema,
	WebAnalyticsOperatingSystemsVersionsChartInputSchema,
	WebAnalyticsOperatingSystemsVersionsChartResponseSchema,
	WebAnalyticsOperatingSystemsVersionsInputSchema,
	WebAnalyticsOperatingSystemsVersionsResponseSchema,
	WebAnalyticsReferrersChartInputSchema,
	WebAnalyticsReferrersChartResponseSchema,
	WebAnalyticsReferrersInputSchema,
	WebAnalyticsReferrersResponseSchema,
	WebAnalyticsSourceChannelsChartInputSchema,
	WebAnalyticsSourceChannelsChartResponseSchema,
	WebAnalyticsSourceChannelsInputSchema,
	WebAnalyticsSourceChannelsResponseSchema,
	WebAnalyticsSourcesChartInputSchema,
	WebAnalyticsSourcesChartResponseSchema,
	WebAnalyticsSourcesInputSchema,
	WebAnalyticsSourcesResponseSchema,
	WebAnalyticsStatsInputSchema,
	WebAnalyticsStatsResponseSchema,
	WebAnalyticsTopPagesChartInputSchema,
	WebAnalyticsTopPagesChartResponseSchema,
	WebAnalyticsTopPagesInputSchema,
	WebAnalyticsTopPagesResponseSchema,
	WebAnalyticsTotalsChartInputSchema,
	WebAnalyticsTotalsChartResponseSchema,
	WebAnalyticsUtmParamsChartInputSchema,
	WebAnalyticsUtmParamsChartResponseSchema,
	WebAnalyticsUtmParamsInputSchema,
	WebAnalyticsUtmParamsResponseSchema,
} from './endpoints/types';
