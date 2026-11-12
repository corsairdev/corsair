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
	Gsc,
	KeywordsExplorer,
	Management,
	RankTracker,
	SerpOverview,
	SiteAudit,
	SiteExplorer,
	SubscriptionInfo,
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
	BrokenBacklinksInput,
	BrokenBacklinksResponse,
	BrokenBacklinksRow,
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
	ManagementKeywordListKeywordsInput,
	ManagementKeywordListKeywordsResponse,
	ManagementKeywordListKeywordsRow,
	ManagementKeywordListsInput,
	ManagementKeywordListsResponse,
	ManagementKeywordListsRow,
	ManagementLocationsInput,
	ManagementLocationsResponse,
	ManagementProjectKeywordsInput,
	ManagementProjectKeywordsResponse,
	ManagementProjectKeywordsRow,
	ManagementProjectsInput,
	ManagementProjectsResponse,
	ManagementProjectsRow,
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
	RankTrackerCompetitorsOverviewInput,
	RankTrackerCompetitorsOverviewResponse,
	RankTrackerCompetitorsOverviewRow,
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
	SiteMetricsInput,
	SiteMetricsResponse,
	TopPage,
	TopPagesInput,
	TopPagesResponse,
	VolumeByCountryInput,
	VolumeByCountryResponse,
	VolumeByCountryRow,
	VolumeHistoryInput,
	VolumeHistoryResponse,
	VolumeHistoryRow,
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
	BrokenBacklinksInputSchema,
	BrokenBacklinksResponseSchema,
	BrokenBacklinksRowSchema,
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
	ManagementKeywordListKeywordsInputSchema,
	ManagementKeywordListKeywordsResponseSchema,
	ManagementKeywordListKeywordsRowSchema,
	ManagementKeywordListsInputSchema,
	ManagementKeywordListsResponseSchema,
	ManagementKeywordListsRowSchema,
	ManagementLocationsInputSchema,
	ManagementLocationsResponseSchema,
	ManagementProjectKeywordsInputSchema,
	ManagementProjectKeywordsResponseSchema,
	ManagementProjectKeywordsRowSchema,
	ManagementProjectsInputSchema,
	ManagementProjectsResponseSchema,
	ManagementProjectsRowSchema,
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
	RankTrackerCompetitorsOverviewInputSchema,
	RankTrackerCompetitorsOverviewResponseSchema,
	RankTrackerCompetitorsOverviewRowSchema,
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
	SiteMetricsInputSchema,
	SiteMetricsResponseSchema,
	TopPagesInputSchema,
	TopPagesResponseSchema,
	VolumeByCountryInputSchema,
	VolumeByCountryResponseSchema,
	VolumeByCountryRowSchema,
	VolumeHistoryInputSchema,
	VolumeHistoryResponseSchema,
	VolumeHistoryRowSchema,
} from './endpoints/types';
