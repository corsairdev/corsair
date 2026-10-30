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
import {
	Account,
	Bulk,
	Crawl,
	CustomApi,
	Enhance,
	Extract,
	KgBulkEnhance,
	Search,
} from './endpoints';
import type {
	DiffbotEndpointInputs,
	DiffbotEndpointOutputs,
} from './endpoints/types';
import {
	DiffbotEndpointInputSchemas,
	DiffbotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DiffbotSchema } from './schema';

export type DiffbotPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDiffbotPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof diffbotEndpointsNested>;
};

export type DiffbotContext = CorsairPluginContext<
	typeof DiffbotSchema,
	DiffbotPluginOptions
>;

export type DiffbotKeyBuilderContext = KeyBuilderContext<DiffbotPluginOptions>;

export type DiffbotBoundEndpoints = BindEndpoints<
	typeof diffbotEndpointsNested
>;

type DiffbotEndpoint<K extends keyof DiffbotEndpointOutputs> = CorsairEndpoint<
	DiffbotContext,
	DiffbotEndpointInputs[K],
	DiffbotEndpointOutputs[K]
>;

export type DiffbotEndpoints = {
	// Account
	getAccount: DiffbotEndpoint<'getAccount'>;

	// Extract
	getArticle: DiffbotEndpoint<'getArticle'>;
	getProduct: DiffbotEndpoint<'getProduct'>;
	getAnalyze: DiffbotEndpoint<'getAnalyze'>;
	getImage: DiffbotEndpoint<'getImage'>;
	getVideo: DiffbotEndpoint<'getVideo'>;
	getDiscussion: DiffbotEndpoint<'getDiscussion'>;
	getEvent: DiffbotEndpoint<'getEvent'>;
	extractList: DiffbotEndpoint<'extractList'>;
	extractJob: DiffbotEndpoint<'extractJob'>;

	// Search
	search: DiffbotEndpoint<'search'>;
	searchCrawlData: DiffbotEndpoint<'searchCrawlData'>;

	// Enhance
	enhanceEntity: DiffbotEndpoint<'enhanceEntity'>;
	combineEntityProfiles: DiffbotEndpoint<'combineEntityProfiles'>;
	resolveLostId: DiffbotEndpoint<'resolveLostId'>;
	getKgCoverageReportById: DiffbotEndpoint<'getKgCoverageReportById'>;

	// KG Bulk Enhance
	createKgBulkEnhance: DiffbotEndpoint<'createKgBulkEnhance'>;
	getBulkJobStatus: DiffbotEndpoint<'getBulkJobStatus'>;
	listBulkJobsStatusForToken: DiffbotEndpoint<'listBulkJobsStatusForToken'>;
	getBulkResults: DiffbotEndpoint<'getBulkResults'>;
	downloadBulkResults: DiffbotEndpoint<'downloadBulkResults'>;
	getBulkSingleResult: DiffbotEndpoint<'getBulkSingleResult'>;
	stopKgBulkJobById: DiffbotEndpoint<'stopKgBulkJobById'>;
	deleteKgEnhanceBulkjob: DiffbotEndpoint<'deleteKgEnhanceBulkjob'>;

	// Bulk Extract
	createBulk: DiffbotEndpoint<'createBulk'>;
	startBulk: DiffbotEndpoint<'startBulk'>;
	stopBulkJob: DiffbotEndpoint<'stopBulkJob'>;
	getBulkData: DiffbotEndpoint<'getBulkData'>;
	listBulkJobs: DiffbotEndpoint<'listBulkJobs'>;

	// Crawl
	startCrawl: DiffbotEndpoint<'startCrawl'>;
	manageCrawl: DiffbotEndpoint<'manageCrawl'>;
	getCrawlData: DiffbotEndpoint<'getCrawlData'>;

	// Custom API
	createCustomApi: DiffbotEndpoint<'createCustomApi'>;
	listCustomApis: DiffbotEndpoint<'listCustomApis'>;
	deleteCustomApi: DiffbotEndpoint<'deleteCustomApi'>;
};

const diffbotEndpointsNested = {
	account: {
		getAccount: Account.getAccount,
	},
	extract: {
		getArticle: Extract.getArticle,
		getProduct: Extract.getProduct,
		getAnalyze: Extract.getAnalyze,
		getImage: Extract.getImage,
		getVideo: Extract.getVideo,
		getDiscussion: Extract.getDiscussion,
		getEvent: Extract.getEvent,
		extractList: Extract.extractList,
		extractJob: Extract.extractJob,
	},
	search: {
		search: Search.search,
		searchCrawlData: Search.searchCrawlData,
	},
	enhance: {
		enhanceEntity: Enhance.enhanceEntity,
		combineEntityProfiles: Enhance.combineEntityProfiles,
		resolveLostId: Enhance.resolveLostId,
		getKgCoverageReportById: Enhance.getKgCoverageReportById,
	},
	kgBulkEnhance: {
		createKgBulkEnhance: KgBulkEnhance.createKgBulkEnhance,
		getBulkJobStatus: KgBulkEnhance.getBulkJobStatus,
		listBulkJobsStatusForToken: KgBulkEnhance.listBulkJobsStatusForToken,
		getBulkResults: KgBulkEnhance.getBulkResults,
		downloadBulkResults: KgBulkEnhance.downloadBulkResults,
		getBulkSingleResult: KgBulkEnhance.getBulkSingleResult,
		stopKgBulkJobById: KgBulkEnhance.stopKgBulkJobById,
		deleteKgEnhanceBulkjob: KgBulkEnhance.deleteKgEnhanceBulkjob,
	},
	bulk: {
		createBulk: Bulk.createBulk,
		startBulk: Bulk.startBulk,
		stopBulkJob: Bulk.stopBulkJob,
		getBulkData: Bulk.getBulkData,
		listBulkJobs: Bulk.listBulkJobs,
	},
	crawl: {
		startCrawl: Crawl.startCrawl,
		manageCrawl: Crawl.manageCrawl,
		getCrawlData: Crawl.getCrawlData,
	},
	customApi: {
		createCustomApi: CustomApi.createCustomApi,
		listCustomApis: CustomApi.listCustomApis,
		deleteCustomApi: CustomApi.deleteCustomApi,
	},
} as const;

export const diffbotEndpointSchemas = {
	'account.getAccount': {
		input: DiffbotEndpointInputSchemas.getAccount,
		output: DiffbotEndpointOutputSchemas.getAccount,
	},
	'extract.getArticle': {
		input: DiffbotEndpointInputSchemas.getArticle,
		output: DiffbotEndpointOutputSchemas.getArticle,
	},
	'extract.getProduct': {
		input: DiffbotEndpointInputSchemas.getProduct,
		output: DiffbotEndpointOutputSchemas.getProduct,
	},
	'extract.getAnalyze': {
		input: DiffbotEndpointInputSchemas.getAnalyze,
		output: DiffbotEndpointOutputSchemas.getAnalyze,
	},
	'extract.getImage': {
		input: DiffbotEndpointInputSchemas.getImage,
		output: DiffbotEndpointOutputSchemas.getImage,
	},
	'extract.getVideo': {
		input: DiffbotEndpointInputSchemas.getVideo,
		output: DiffbotEndpointOutputSchemas.getVideo,
	},
	'extract.getDiscussion': {
		input: DiffbotEndpointInputSchemas.getDiscussion,
		output: DiffbotEndpointOutputSchemas.getDiscussion,
	},
	'extract.getEvent': {
		input: DiffbotEndpointInputSchemas.getEvent,
		output: DiffbotEndpointOutputSchemas.getEvent,
	},
	'extract.extractList': {
		input: DiffbotEndpointInputSchemas.extractList,
		output: DiffbotEndpointOutputSchemas.extractList,
	},
	'extract.extractJob': {
		input: DiffbotEndpointInputSchemas.extractJob,
		output: DiffbotEndpointOutputSchemas.extractJob,
	},
	'search.search': {
		input: DiffbotEndpointInputSchemas.search,
		output: DiffbotEndpointOutputSchemas.search,
	},
	'search.searchCrawlData': {
		input: DiffbotEndpointInputSchemas.searchCrawlData,
		output: DiffbotEndpointOutputSchemas.searchCrawlData,
	},
	'enhance.enhanceEntity': {
		input: DiffbotEndpointInputSchemas.enhanceEntity,
		output: DiffbotEndpointOutputSchemas.enhanceEntity,
	},
	'enhance.combineEntityProfiles': {
		input: DiffbotEndpointInputSchemas.combineEntityProfiles,
		output: DiffbotEndpointOutputSchemas.combineEntityProfiles,
	},
	'enhance.resolveLostId': {
		input: DiffbotEndpointInputSchemas.resolveLostId,
		output: DiffbotEndpointOutputSchemas.resolveLostId,
	},
	'enhance.getKgCoverageReportById': {
		input: DiffbotEndpointInputSchemas.getKgCoverageReportById,
		output: DiffbotEndpointOutputSchemas.getKgCoverageReportById,
	},
	'kgBulkEnhance.createKgBulkEnhance': {
		input: DiffbotEndpointInputSchemas.createKgBulkEnhance,
		output: DiffbotEndpointOutputSchemas.createKgBulkEnhance,
	},
	'kgBulkEnhance.getBulkJobStatus': {
		input: DiffbotEndpointInputSchemas.getBulkJobStatus,
		output: DiffbotEndpointOutputSchemas.getBulkJobStatus,
	},
	'kgBulkEnhance.listBulkJobsStatusForToken': {
		input: DiffbotEndpointInputSchemas.listBulkJobsStatusForToken,
		output: DiffbotEndpointOutputSchemas.listBulkJobsStatusForToken,
	},
	'kgBulkEnhance.getBulkResults': {
		input: DiffbotEndpointInputSchemas.getBulkResults,
		output: DiffbotEndpointOutputSchemas.getBulkResults,
	},
	'kgBulkEnhance.downloadBulkResults': {
		input: DiffbotEndpointInputSchemas.downloadBulkResults,
		output: DiffbotEndpointOutputSchemas.downloadBulkResults,
	},
	'kgBulkEnhance.getBulkSingleResult': {
		input: DiffbotEndpointInputSchemas.getBulkSingleResult,
		output: DiffbotEndpointOutputSchemas.getBulkSingleResult,
	},
	'kgBulkEnhance.stopKgBulkJobById': {
		input: DiffbotEndpointInputSchemas.stopKgBulkJobById,
		output: DiffbotEndpointOutputSchemas.stopKgBulkJobById,
	},
	'kgBulkEnhance.deleteKgEnhanceBulkjob': {
		input: DiffbotEndpointInputSchemas.deleteKgEnhanceBulkjob,
		output: DiffbotEndpointOutputSchemas.deleteKgEnhanceBulkjob,
	},
	'bulk.createBulk': {
		input: DiffbotEndpointInputSchemas.createBulk,
		output: DiffbotEndpointOutputSchemas.createBulk,
	},
	'bulk.startBulk': {
		input: DiffbotEndpointInputSchemas.startBulk,
		output: DiffbotEndpointOutputSchemas.startBulk,
	},
	'bulk.stopBulkJob': {
		input: DiffbotEndpointInputSchemas.stopBulkJob,
		output: DiffbotEndpointOutputSchemas.stopBulkJob,
	},
	'bulk.getBulkData': {
		input: DiffbotEndpointInputSchemas.getBulkData,
		output: DiffbotEndpointOutputSchemas.getBulkData,
	},
	'bulk.listBulkJobs': {
		input: DiffbotEndpointInputSchemas.listBulkJobs,
		output: DiffbotEndpointOutputSchemas.listBulkJobs,
	},
	'crawl.startCrawl': {
		input: DiffbotEndpointInputSchemas.startCrawl,
		output: DiffbotEndpointOutputSchemas.startCrawl,
	},
	'crawl.manageCrawl': {
		input: DiffbotEndpointInputSchemas.manageCrawl,
		output: DiffbotEndpointOutputSchemas.manageCrawl,
	},
	'crawl.getCrawlData': {
		input: DiffbotEndpointInputSchemas.getCrawlData,
		output: DiffbotEndpointOutputSchemas.getCrawlData,
	},
	'customApi.createCustomApi': {
		input: DiffbotEndpointInputSchemas.createCustomApi,
		output: DiffbotEndpointOutputSchemas.createCustomApi,
	},
	'customApi.listCustomApis': {
		input: DiffbotEndpointInputSchemas.listCustomApis,
		output: DiffbotEndpointOutputSchemas.listCustomApis,
	},
	'customApi.deleteCustomApi': {
		input: DiffbotEndpointInputSchemas.deleteCustomApi,
		output: DiffbotEndpointOutputSchemas.deleteCustomApi,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof diffbotEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const diffbotEndpointMeta = {
	'account.getAccount': {
		riskLevel: 'read',
		description:
			'Retrieve Diffbot account details, credit balance, and plan usage',
	},
	'extract.getArticle': {
		riskLevel: 'read',
		description:
			'Extract article title, text, author, date, and metadata from any URL',
	},
	'extract.getProduct': {
		riskLevel: 'read',
		description:
			'Extract product price, availability, images, and specifications from any e-commerce URL',
	},
	'extract.getAnalyze': {
		riskLevel: 'read',
		description:
			'Automatically analyze web page to determine its type and extract structured data',
	},
	'extract.getImage': {
		riskLevel: 'read',
		description:
			'Extract detailed image information including dimensions and recognition data',
	},
	'extract.getVideo': {
		riskLevel: 'read',
		description:
			'Extract structured metadata from videos including embed HTML and durations',
	},
	'extract.getDiscussion': {
		riskLevel: 'read',
		description:
			'Extract structured discussion threads, forum posts, and comments from web pages',
	},
	'extract.getEvent': {
		riskLevel: 'read',
		description:
			'Extract event details including dates, venues, organizers, and descriptions',
	},
	'extract.extractList': {
		riskLevel: 'read',
		description:
			'Extract structured items from list-style pages, catalogs, and news indexes',
	},
	'extract.extractJob': {
		riskLevel: 'read',
		description:
			'Extract structured job posting data including compensation, requirements, and company info',
	},
	'search.search': {
		riskLevel: 'read',
		description:
			'Search the Diffbot Knowledge Graph using DQL (Diffbot Query Language)',
	},
	'search.searchCrawlData': {
		riskLevel: 'read',
		description: 'Query crawl job collections using DQL or keyword search',
	},
	'enhance.enhanceEntity': {
		riskLevel: 'read',
		description:
			'Enrich person or organization data with Knowledge Graph records',
	},
	'enhance.combineEntityProfiles': {
		riskLevel: 'read',
		description:
			'Combine entity profiles into a unified view with organization affiliations',
	},
	'enhance.resolveLostId': {
		riskLevel: 'read',
		description:
			'Resolve lost or legacy identifiers to canonical Knowledge Graph entities',
	},
	'enhance.getKgCoverageReportById': {
		riskLevel: 'read',
		description: 'Download Knowledge Graph coverage report by report ID',
	},
	'kgBulkEnhance.createKgBulkEnhance': {
		riskLevel: 'write',
		description:
			'Submit an asynchronous bulk enhance job for multiple entities',
	},
	'kgBulkEnhance.getBulkJobStatus': {
		riskLevel: 'read',
		description:
			'Poll the status and progress of a Knowledge Graph bulk enhance job',
	},
	'kgBulkEnhance.listBulkJobsStatusForToken': {
		riskLevel: 'read',
		description:
			'List all Knowledge Graph bulk enhance jobs and their statuses for token',
	},
	'kgBulkEnhance.getBulkResults': {
		riskLevel: 'read',
		description:
			'Download results of a completed Knowledge Graph bulk enhance job',
	},
	'kgBulkEnhance.downloadBulkResults': {
		riskLevel: 'read',
		description:
			'Download bulk enhance results with filtering and custom output formats',
	},
	'kgBulkEnhance.getBulkSingleResult': {
		riskLevel: 'read',
		description:
			'Download single enriched entity result from a bulk enhance job by index',
	},
	'kgBulkEnhance.stopKgBulkJobById': {
		riskLevel: 'write',
		description:
			'Stop or pause an active Knowledge Graph bulk enhance job by ID',
	},
	'kgBulkEnhance.deleteKgEnhanceBulkjob': {
		riskLevel: 'destructive',
		description: 'Delete a Knowledge Graph bulk enhance job and its results',
	},
	'bulk.createBulk': {
		riskLevel: 'write',
		description:
			'Submit an asynchronous bulk extract job to process multiple URLs',
	},
	'bulk.startBulk': {
		riskLevel: 'write',
		description: 'Start a bulk extract job using query parameters',
	},
	'bulk.stopBulkJob': {
		riskLevel: 'write',
		description: 'Pause or stop an active bulk extract job',
	},
	'bulk.getBulkData': {
		riskLevel: 'read',
		description: 'Download extracted results from a completed bulk extract job',
	},
	'bulk.listBulkJobs': {
		riskLevel: 'read',
		description: 'List all bulk extract jobs associated with the token',
	},
	'crawl.startCrawl': {
		riskLevel: 'write',
		description: 'Initiate a website crawl job starting from seed URLs',
	},
	'crawl.manageCrawl': {
		riskLevel: 'write',
		description: 'Inspect, pause, restart, or delete crawl jobs',
	},
	'crawl.getCrawlData': {
		riskLevel: 'read',
		description: 'Download extracted data from a completed crawl job',
	},
	'customApi.createCustomApi': {
		riskLevel: 'write',
		description:
			'Create or update custom API rules and selectors for URL patterns',
	},
	'customApi.listCustomApis': {
		riskLevel: 'read',
		description: 'List all custom API definitions configured on the account',
	},
	'customApi.deleteCustomApi': {
		riskLevel: 'destructive',
		description: 'Delete custom API definitions for a given URL pattern',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof diffbotEndpointsNested>;

export const diffbotAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDiffbotPlugin<T extends DiffbotPluginOptions> = CorsairPlugin<
	'diffbot',
	typeof DiffbotSchema,
	typeof diffbotEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalDiffbotPlugin = BaseDiffbotPlugin<DiffbotPluginOptions>;

export type ExternalDiffbotPlugin<T extends DiffbotPluginOptions> =
	BaseDiffbotPlugin<T>;

export function diffbot<const T extends DiffbotPluginOptions>(
	incomingOptions: DiffbotPluginOptions & T = {} as DiffbotPluginOptions & T,
): ExternalDiffbotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'diffbot',
		authConfig: diffbotAuthConfig,
		schema: DiffbotSchema,
		options: options,
		hooks: options.hooks,
		endpoints: diffbotEndpointsNested,
		webhooks: {},
		endpointMeta: diffbotEndpointMeta,
		endpointSchemas: diffbotEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DiffbotKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalDiffbotPlugin;
}

export * from './endpoints/types';
export * from './schema';
