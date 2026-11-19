// Generated with endpoints/operation-types.ts from OpenSEO's MCP tool list: one
// entry per tool in openseo-manifest.json.
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { openseoSchemaEntry } from './json-schema';
import { createOpenseoOperation as op } from './operations';

export const openseoEndpointsNested = {
	account: {
		whoami: op('account.whoami'),
	},
	aiVisibility: {
		completeResearchSetup: op('aiVisibility.completeResearchSetup'),
		estimateCost: op('aiVisibility.estimateCost'),
		explorePrompt: op('aiVisibility.explorePrompt'),
		export: op('aiVisibility.export'),
		generatePrompts: op('aiVisibility.generatePrompts'),
		getAnswer: op('aiVisibility.getAnswer'),
		getResults: op('aiVisibility.getResults'),
		getRun: op('aiVisibility.getRun'),
		getSources: op('aiVisibility.getSources'),
		getTracker: op('aiVisibility.getTracker'),
		getTrend: op('aiVisibility.getTrend'),
		researchPrompts: op('aiVisibility.researchPrompts'),
		runCheck: op('aiVisibility.runCheck'),
		saveTracker: op('aiVisibility.saveTracker'),
		setSchedule: op('aiVisibility.setSchedule'),
		updateResearchKeywords: op('aiVisibility.updateResearchKeywords'),
	},
	backlinks: {
		list: op('backlinks.list'),
		overview: op('backlinks.overview'),
	},
	domains: {
		keywords: op('domains.keywords'),
		overview: op('domains.overview'),
		rankedKeywords: op('domains.rankedKeywords'),
	},
	googleAnalytics: {
		audienceBreakdown: op('googleAnalytics.audienceBreakdown'),
		ecommercePerformance: op('googleAnalytics.ecommercePerformance'),
		keyEvents: op('googleAnalytics.keyEvents'),
		listProperties: op('googleAnalytics.listProperties'),
		measurementHealth: op('googleAnalytics.measurementHealth'),
		organicLandingPages: op('googleAnalytics.organicLandingPages'),
		organicOverview: op('googleAnalytics.organicOverview'),
		pagePerformance: op('googleAnalytics.pagePerformance'),
		setProperty: op('googleAnalytics.setProperty'),
		siteSearch: op('googleAnalytics.siteSearch'),
		trafficAcquisition: op('googleAnalytics.trafficAcquisition'),
	},
	indexNow: {
		submitUrls: op('indexNow.submitUrls'),
	},
	keywords: {
		listSaved: op('keywords.listSaved'),
		metrics: op('keywords.metrics'),
		removeSaved: op('keywords.removeSaved'),
		research: op('keywords.research'),
		save: op('keywords.save'),
		suggestions: op('keywords.suggestions'),
	},
	local: {
		businessProfile: op('local.businessProfile'),
		businessQuestions: op('local.businessQuestions'),
		businessReviews: op('local.businessReviews'),
		businessUpdates: op('local.businessUpdates'),
		listCategories: op('local.listCategories'),
		rankGrid: op('local.rankGrid'),
		searchBusinesses: op('local.searchBusinesses'),
		serpResults: op('local.serpResults'),
	},
	projects: {
		create: op('projects.create'),
		getContext: op('projects.getContext'),
		list: op('projects.list'),
		researchWebsite: op('projects.researchWebsite'),
		saveWebsiteSetup: op('projects.saveWebsiteSetup'),
		updateContext: op('projects.updateContext'),
	},
	rankTracking: {
		addKeywords: op('rankTracking.addKeywords'),
		create: op('rankTracking.create'),
		estimateCost: op('rankTracking.estimateCost'),
		get: op('rankTracking.get'),
		history: op('rankTracking.history'),
		pinKeywords: op('rankTracking.pinKeywords'),
		removeKeywords: op('rankTracking.removeKeywords'),
		run: op('rankTracking.run'),
	},
	reports: {
		delete: op('reports.delete'),
		deleteTemplate: op('reports.deleteTemplate'),
		get: op('reports.get'),
		list: op('reports.list'),
		listTemplates: op('reports.listTemplates'),
		save: op('reports.save'),
		saveTemplate: op('reports.saveTemplate'),
		setSharing: op('reports.setSharing'),
	},
	searchConsole: {
		inspectUrls: op('searchConsole.inspectUrls'),
		listSites: op('searchConsole.listSites'),
		opportunities: op('searchConsole.opportunities'),
		performance: op('searchConsole.performance'),
		setSite: op('searchConsole.setSite'),
	},
	serp: {
		competitors: op('serp.competitors'),
		results: op('serp.results'),
		searchLocations: op('serp.searchLocations'),
	},
	siteAudits: {
		delete: op('siteAudits.delete'),
		issues: op('siteAudits.issues'),
		lighthouse: op('siteAudits.lighthouse'),
		list: op('siteAudits.list'),
		pages: op('siteAudits.pages'),
		run: op('siteAudits.run'),
		status: op('siteAudits.status'),
	},
} as const;

export const openseoEndpointSchemas = {
	'account.whoami': openseoSchemaEntry('account.whoami'),
	'aiVisibility.completeResearchSetup': openseoSchemaEntry(
		'aiVisibility.completeResearchSetup',
	),
	'aiVisibility.estimateCost': openseoSchemaEntry('aiVisibility.estimateCost'),
	'aiVisibility.explorePrompt': openseoSchemaEntry(
		'aiVisibility.explorePrompt',
	),
	'aiVisibility.export': openseoSchemaEntry('aiVisibility.export'),
	'aiVisibility.generatePrompts': openseoSchemaEntry(
		'aiVisibility.generatePrompts',
	),
	'aiVisibility.getAnswer': openseoSchemaEntry('aiVisibility.getAnswer'),
	'aiVisibility.getResults': openseoSchemaEntry('aiVisibility.getResults'),
	'aiVisibility.getRun': openseoSchemaEntry('aiVisibility.getRun'),
	'aiVisibility.getSources': openseoSchemaEntry('aiVisibility.getSources'),
	'aiVisibility.getTracker': openseoSchemaEntry('aiVisibility.getTracker'),
	'aiVisibility.getTrend': openseoSchemaEntry('aiVisibility.getTrend'),
	'aiVisibility.researchPrompts': openseoSchemaEntry(
		'aiVisibility.researchPrompts',
	),
	'aiVisibility.runCheck': openseoSchemaEntry('aiVisibility.runCheck'),
	'aiVisibility.saveTracker': openseoSchemaEntry('aiVisibility.saveTracker'),
	'aiVisibility.setSchedule': openseoSchemaEntry('aiVisibility.setSchedule'),
	'aiVisibility.updateResearchKeywords': openseoSchemaEntry(
		'aiVisibility.updateResearchKeywords',
	),
	'backlinks.list': openseoSchemaEntry('backlinks.list'),
	'backlinks.overview': openseoSchemaEntry('backlinks.overview'),
	'domains.keywords': openseoSchemaEntry('domains.keywords'),
	'domains.overview': openseoSchemaEntry('domains.overview'),
	'domains.rankedKeywords': openseoSchemaEntry('domains.rankedKeywords'),
	'googleAnalytics.audienceBreakdown': openseoSchemaEntry(
		'googleAnalytics.audienceBreakdown',
	),
	'googleAnalytics.ecommercePerformance': openseoSchemaEntry(
		'googleAnalytics.ecommercePerformance',
	),
	'googleAnalytics.keyEvents': openseoSchemaEntry('googleAnalytics.keyEvents'),
	'googleAnalytics.listProperties': openseoSchemaEntry(
		'googleAnalytics.listProperties',
	),
	'googleAnalytics.measurementHealth': openseoSchemaEntry(
		'googleAnalytics.measurementHealth',
	),
	'googleAnalytics.organicLandingPages': openseoSchemaEntry(
		'googleAnalytics.organicLandingPages',
	),
	'googleAnalytics.organicOverview': openseoSchemaEntry(
		'googleAnalytics.organicOverview',
	),
	'googleAnalytics.pagePerformance': openseoSchemaEntry(
		'googleAnalytics.pagePerformance',
	),
	'googleAnalytics.setProperty': openseoSchemaEntry(
		'googleAnalytics.setProperty',
	),
	'googleAnalytics.siteSearch': openseoSchemaEntry(
		'googleAnalytics.siteSearch',
	),
	'googleAnalytics.trafficAcquisition': openseoSchemaEntry(
		'googleAnalytics.trafficAcquisition',
	),
	'indexNow.submitUrls': openseoSchemaEntry('indexNow.submitUrls'),
	'keywords.listSaved': openseoSchemaEntry('keywords.listSaved'),
	'keywords.metrics': openseoSchemaEntry('keywords.metrics'),
	'keywords.removeSaved': openseoSchemaEntry('keywords.removeSaved'),
	'keywords.research': openseoSchemaEntry('keywords.research'),
	'keywords.save': openseoSchemaEntry('keywords.save'),
	'keywords.suggestions': openseoSchemaEntry('keywords.suggestions'),
	'local.businessProfile': openseoSchemaEntry('local.businessProfile'),
	'local.businessQuestions': openseoSchemaEntry('local.businessQuestions'),
	'local.businessReviews': openseoSchemaEntry('local.businessReviews'),
	'local.businessUpdates': openseoSchemaEntry('local.businessUpdates'),
	'local.listCategories': openseoSchemaEntry('local.listCategories'),
	'local.rankGrid': openseoSchemaEntry('local.rankGrid'),
	'local.searchBusinesses': openseoSchemaEntry('local.searchBusinesses'),
	'local.serpResults': openseoSchemaEntry('local.serpResults'),
	'projects.create': openseoSchemaEntry('projects.create'),
	'projects.getContext': openseoSchemaEntry('projects.getContext'),
	'projects.list': openseoSchemaEntry('projects.list'),
	'projects.researchWebsite': openseoSchemaEntry('projects.researchWebsite'),
	'projects.saveWebsiteSetup': openseoSchemaEntry('projects.saveWebsiteSetup'),
	'projects.updateContext': openseoSchemaEntry('projects.updateContext'),
	'rankTracking.addKeywords': openseoSchemaEntry('rankTracking.addKeywords'),
	'rankTracking.create': openseoSchemaEntry('rankTracking.create'),
	'rankTracking.estimateCost': openseoSchemaEntry('rankTracking.estimateCost'),
	'rankTracking.get': openseoSchemaEntry('rankTracking.get'),
	'rankTracking.history': openseoSchemaEntry('rankTracking.history'),
	'rankTracking.pinKeywords': openseoSchemaEntry('rankTracking.pinKeywords'),
	'rankTracking.removeKeywords': openseoSchemaEntry(
		'rankTracking.removeKeywords',
	),
	'rankTracking.run': openseoSchemaEntry('rankTracking.run'),
	'reports.delete': openseoSchemaEntry('reports.delete'),
	'reports.deleteTemplate': openseoSchemaEntry('reports.deleteTemplate'),
	'reports.get': openseoSchemaEntry('reports.get'),
	'reports.list': openseoSchemaEntry('reports.list'),
	'reports.listTemplates': openseoSchemaEntry('reports.listTemplates'),
	'reports.save': openseoSchemaEntry('reports.save'),
	'reports.saveTemplate': openseoSchemaEntry('reports.saveTemplate'),
	'reports.setSharing': openseoSchemaEntry('reports.setSharing'),
	'searchConsole.inspectUrls': openseoSchemaEntry('searchConsole.inspectUrls'),
	'searchConsole.listSites': openseoSchemaEntry('searchConsole.listSites'),
	'searchConsole.opportunities': openseoSchemaEntry(
		'searchConsole.opportunities',
	),
	'searchConsole.performance': openseoSchemaEntry('searchConsole.performance'),
	'searchConsole.setSite': openseoSchemaEntry('searchConsole.setSite'),
	'serp.competitors': openseoSchemaEntry('serp.competitors'),
	'serp.results': openseoSchemaEntry('serp.results'),
	'serp.searchLocations': openseoSchemaEntry('serp.searchLocations'),
	'siteAudits.delete': openseoSchemaEntry('siteAudits.delete'),
	'siteAudits.issues': openseoSchemaEntry('siteAudits.issues'),
	'siteAudits.lighthouse': openseoSchemaEntry('siteAudits.lighthouse'),
	'siteAudits.list': openseoSchemaEntry('siteAudits.list'),
	'siteAudits.pages': openseoSchemaEntry('siteAudits.pages'),
	'siteAudits.run': openseoSchemaEntry('siteAudits.run'),
	'siteAudits.status': openseoSchemaEntry('siteAudits.status'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof openseoEndpointsNested
>;

// A lookup that only spends OpenSEO credits is a metered read (R8). Deletes, public
// sharing, IndexNow submissions and anything that starts or schedules a paid check
// are destructive.
export const openseoEndpointMeta = {
	'account.whoami': {
		riskLevel: 'read',
		description:
			'Get the connected OpenSEO account, token scopes and remaining credits',
	},
	'aiVisibility.completeResearchSetup': {
		riskLevel: 'destructive',
		description:
			'Set up Prompt Research keywords for a project (can turn on weekly paid AI checks)',
	},
	'aiVisibility.estimateCost': {
		riskLevel: 'read',
		description:
			'Estimate the cost of AI visibility checks without running them',
	},
	'aiVisibility.explorePrompt': {
		riskLevel: 'read',
		description:
			'Ask a prompt in ChatGPT, Claude, Gemini or Perplexity and see answers, citations and brand mentions',
	},
	'aiVisibility.export': {
		riskLevel: 'read',
		description:
			'Export stored AI visibility observations as a CSV or JSON download link',
	},
	'aiVisibility.generatePrompts': {
		riskLevel: 'read',
		description:
			'Generate topic and prompt suggestions for AI visibility tracking',
	},
	'aiVisibility.getAnswer': {
		riskLevel: 'read',
		description:
			'Get one stored AI answer with its prompt, mentions and citations',
	},
	'aiVisibility.getResults': {
		riskLevel: 'read',
		description:
			'Get how often the brand and competitors appear in AI answers for a run',
	},
	'aiVisibility.getRun': {
		riskLevel: 'read',
		description: 'Get the progress of an AI visibility check',
	},
	'aiVisibility.getSources': {
		riskLevel: 'read',
		description: 'List the pages or domains AI answers cited in a run',
	},
	'aiVisibility.getTracker': {
		riskLevel: 'read',
		description:
			"Get a project's AI visibility tracking setup: topics, prompts, engines and schedule",
	},
	'aiVisibility.getTrend': {
		riskLevel: 'read',
		description: 'Compare recent AI visibility with the previous period',
	},
	'aiVisibility.researchPrompts': {
		riskLevel: 'read',
		description:
			"Find questions people ask AI about a keyword, with ChatGPT's answers and sources",
	},
	'aiVisibility.runCheck': {
		riskLevel: 'destructive',
		description: 'Start a one-off paid AI visibility check now',
	},
	'aiVisibility.saveTracker': {
		riskLevel: 'write',
		description:
			'Create or update AI visibility tracking prompts, topics, engines and market',
	},
	'aiVisibility.setSchedule': {
		riskLevel: 'destructive',
		description:
			'Turn scheduled AI visibility checks on, change the cadence or pause them',
	},
	'aiVisibility.updateResearchKeywords': {
		riskLevel: 'write',
		description: "Add or remove a project's saved Prompt Research keywords",
	},
	'backlinks.list': {
		riskLevel: 'read',
		description:
			"List a domain's or page's individual backlinks with anchors and authority, paginated",
	},
	'backlinks.overview': {
		riskLevel: 'read',
		description:
			"Summarize a domain's or page's backlinks, referring domains and authority",
	},
	'domains.keywords': {
		riskLevel: 'read',
		description:
			'List the organic keywords a domain ranks for, with position and metrics',
	},
	'domains.overview': {
		riskLevel: 'read',
		description:
			"Estimate a domain's monthly organic traffic and ranking keyword count",
	},
	'domains.rankedKeywords': {
		riskLevel: 'read',
		description:
			'List the keywords a domain or page ranks for in one country, with ranking URL and traffic',
	},
	'googleAnalytics.audienceBreakdown': {
		riskLevel: 'read',
		description:
			'Break down visitors by device, country or new versus returning',
	},
	'googleAnalytics.ecommercePerformance': {
		riskLevel: 'read',
		description:
			'Get GA4 ecommerce item views, add-to-carts, purchases and revenue',
	},
	'googleAnalytics.keyEvents': {
		riskLevel: 'read',
		description:
			'Get GA4 key events (conversions) by event or organic landing page',
	},
	'googleAnalytics.listProperties': {
		riskLevel: 'read',
		description: 'List the GA4 properties of the connected Google accounts',
	},
	'googleAnalytics.measurementHealth': {
		riskLevel: 'read',
		description:
			'Check how Google Analytics is set up on the connected property',
	},
	'googleAnalytics.organicLandingPages': {
		riskLevel: 'read',
		description: 'Get the landing pages that receive organic search traffic',
	},
	'googleAnalytics.organicOverview': {
		riskLevel: 'read',
		description:
			'Get top-line organic search sessions, users and key events with a trend',
	},
	'googleAnalytics.pagePerformance': {
		riskLevel: 'read',
		description: 'Get page views, users, engagement and key events per page',
	},
	'googleAnalytics.setProperty': {
		riskLevel: 'write',
		description: 'Set which GA4 property a project reads',
	},
	'googleAnalytics.siteSearch': {
		riskLevel: 'read',
		description: 'Get the terms visitors search for on the site',
	},
	'googleAnalytics.trafficAcquisition': {
		riskLevel: 'read',
		description: 'Compare traffic by channel group, source/medium or campaign',
	},
	'indexNow.submitUrls': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Notify IndexNow search engines (Bing, Yandex and others) that pages changed',
	},
	'keywords.listSaved': {
		riskLevel: 'read',
		description:
			"List a project's saved keywords with cached volume, difficulty, CPC and tags",
	},
	'keywords.metrics': {
		riskLevel: 'read',
		description:
			'Get search volume, difficulty, intent, CPC and trends for a list of keywords',
	},
	'keywords.removeSaved': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete saved keywords from a project by ID',
	},
	'keywords.research': {
		riskLevel: 'read',
		description:
			'Find keyword ideas for 1-5 seed keywords with volume, difficulty, CPC and intent',
	},
	'keywords.save': {
		riskLevel: 'write',
		description: 'Save keywords to a project, optionally with metrics and tags',
	},
	'keywords.suggestions': {
		riskLevel: 'read',
		description:
			'Suggest up to 10 seed keywords to research next from Search Console and saved keywords',
	},
	'local.businessProfile': {
		riskLevel: 'read',
		description: 'Get a Google Business Profile by name, CID or place ID',
	},
	'local.businessQuestions': {
		riskLevel: 'read',
		description: 'Get the questions and answers on a Google Business Profile',
	},
	'local.businessReviews': {
		riskLevel: 'read',
		description:
			"Get a business's Google reviews with ratings and owner replies",
	},
	'local.businessUpdates': {
		riskLevel: 'read',
		description: 'Get the posts published on a Google Business Profile',
	},
	'local.listCategories': {
		riskLevel: 'read',
		description:
			'List Google Business categories ranked by how many businesses use them',
	},
	'local.rankGrid': {
		riskLevel: 'read',
		description:
			"Map a business's Google Maps rank across a grid of points around a center",
	},
	'local.searchBusinesses': {
		riskLevel: 'read',
		description: 'Search local business listings near a coordinate',
	},
	'local.serpResults': {
		riskLevel: 'read',
		description:
			'Get Google Maps or Local Finder results for a keyword from a coordinate',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project with a name and optional domain and market',
	},
	'projects.getContext': {
		riskLevel: 'read',
		description:
			"Get a project's shared memory: overview, goal, positioning, competitors and key pages",
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects with their ID, name, domain and default market',
	},
	'projects.researchWebsite': {
		riskLevel: 'read',
		description:
			"Research a project's website to draft its brand, overview, competitors and prompt topics",
	},
	'projects.saveWebsiteSetup': {
		riskLevel: 'write',
		description:
			'Save a drafted website setup (brand, overview, competitors, topics) to a project',
	},
	'projects.updateContext': {
		riskLevel: 'write',
		description: "Add, edit or delete entries in a project's shared memory",
	},
	'rankTracking.addKeywords': {
		riskLevel: 'write',
		description: 'Add keywords to a rank tracker',
	},
	'rankTracking.create': {
		riskLevel: 'write',
		description: 'Create a rank tracker for a project',
	},
	'rankTracking.estimateCost': {
		riskLevel: 'read',
		description: 'Estimate what a rank check costs without running it',
	},
	'rankTracking.get': {
		riskLevel: 'read',
		description:
			"List a project's rank trackers or get one with its latest Google positions",
	},
	'rankTracking.history': {
		riskLevel: 'read',
		description: "Get the position history of a rank tracker's keywords",
	},
	'rankTracking.pinKeywords': {
		riskLevel: 'write',
		description: 'Pin or unpin tracked keywords',
	},
	'rankTracking.removeKeywords': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Stop tracking keywords in a rank tracker',
	},
	'rankTracking.run': {
		riskLevel: 'destructive',
		description: 'Start a paid rank check now for every keyword in a tracker',
	},
	'reports.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a saved report and its shared link',
	},
	'reports.deleteTemplate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a report template',
	},
	'reports.get': {
		riskLevel: 'read',
		description: 'Get a saved report with its summary and share link',
	},
	'reports.list': {
		riskLevel: 'read',
		description: "List a project's saved reports",
	},
	'reports.listTemplates': {
		riskLevel: 'read',
		description: "List a project's report templates",
	},
	'reports.save': {
		riskLevel: 'write',
		description: 'Save an HTML report to a project',
	},
	'reports.saveTemplate': {
		riskLevel: 'write',
		description: 'Save a reusable report template to a project',
	},
	'reports.setSharing': {
		riskLevel: 'destructive',
		description: 'Turn public sharing of a saved report on or off',
	},
	'searchConsole.inspectUrls': {
		riskLevel: 'read',
		description: 'Check whether Google has indexed up to 10 pages, and why not',
	},
	'searchConsole.listSites': {
		riskLevel: 'read',
		description:
			'List the Search Console properties of the connected Google accounts',
	},
	'searchConsole.opportunities': {
		riskLevel: 'read',
		description:
			'Find pages ranking 4-20 in Search Console that are most worth improving',
	},
	'searchConsole.performance': {
		riskLevel: 'read',
		description:
			'Get Search Console clicks, impressions, CTR and position by query, page or other dimension',
	},
	'searchConsole.setSite': {
		riskLevel: 'write',
		description: 'Set which Search Console property a project reads',
	},
	'serp.competitors': {
		riskLevel: 'read',
		description:
			'Find the domains that compete in Google results for a set of keywords',
	},
	'serp.results': {
		riskLevel: 'read',
		description: 'Get live Google organic results for 1-10 keywords',
	},
	'serp.searchLocations': {
		riskLevel: 'read',
		description:
			'Find the exact location name of a city or region for local searches',
	},
	'siteAudits.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a site audit with its pages, issues and Lighthouse results',
	},
	'siteAudits.issues': {
		riskLevel: 'read',
		description: 'Get the prioritized issues from a completed site audit',
	},
	'siteAudits.lighthouse': {
		riskLevel: 'read',
		description: 'Get the Lighthouse results from a site audit',
	},
	'siteAudits.list': {
		riskLevel: 'read',
		description: "List a project's site audits with status and page counts",
	},
	'siteAudits.pages': {
		riskLevel: 'read',
		description: 'List the pages a site audit crawled with per-page SEO data',
	},
	'siteAudits.run': {
		riskLevel: 'write',
		description:
			'Start a background site audit (crawl, SEO checks, optional Lighthouse)',
	},
	'siteAudits.status': {
		riskLevel: 'read',
		description: 'Get the progress of a site audit',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof openseoEndpointsNested>;
