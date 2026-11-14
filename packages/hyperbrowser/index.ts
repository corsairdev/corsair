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
import { Crawl, Extract, Profiles, Scrape, Sessions, Web } from './endpoints';
import type {
	HyperbrowserEndpointInputs,
	HyperbrowserEndpointOutputs,
} from './endpoints/types';
import {
	HyperbrowserEndpointInputSchemas,
	HyperbrowserEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HyperbrowserSchema } from './schema';

export type HyperbrowserPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHyperbrowserPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hyperbrowserEndpointsNested>;
};

export type HyperbrowserContext = CorsairPluginContext<
	typeof HyperbrowserSchema,
	HyperbrowserPluginOptions
>;

export type HyperbrowserKeyBuilderContext =
	KeyBuilderContext<HyperbrowserPluginOptions>;

export type HyperbrowserBoundEndpoints = BindEndpoints<
	typeof hyperbrowserEndpointsNested
>;

type HyperbrowserEndpoint<K extends keyof HyperbrowserEndpointOutputs> =
	CorsairEndpoint<
		HyperbrowserContext,
		HyperbrowserEndpointInputs[K],
		HyperbrowserEndpointOutputs[K]
	>;

export type HyperbrowserEndpoints = {
	'profiles.create': HyperbrowserEndpoint<'profiles.create'>;
	'profiles.fork': HyperbrowserEndpoint<'profiles.fork'>;
	'profiles.get': HyperbrowserEndpoint<'profiles.get'>;
	'profiles.delete': HyperbrowserEndpoint<'profiles.delete'>;
	'profiles.list': HyperbrowserEndpoint<'profiles.list'>;

	'sessions.create': HyperbrowserEndpoint<'sessions.create'>;
	'sessions.get': HyperbrowserEndpoint<'sessions.get'>;
	'sessions.stop': HyperbrowserEndpoint<'sessions.stop'>;
	'sessions.update': HyperbrowserEndpoint<'sessions.update'>;
	'sessions.evaluateCaptcha': HyperbrowserEndpoint<'sessions.evaluateCaptcha'>;
	'sessions.list': HyperbrowserEndpoint<'sessions.list'>;
	'sessions.getRecordingUrl': HyperbrowserEndpoint<'sessions.getRecordingUrl'>;
	'sessions.getVideoRecordingUrl': HyperbrowserEndpoint<'sessions.getVideoRecordingUrl'>;
	'sessions.getDownloadsUrl': HyperbrowserEndpoint<'sessions.getDownloadsUrl'>;

	'scrape.create': HyperbrowserEndpoint<'scrape.create'>;
	'scrape.get': HyperbrowserEndpoint<'scrape.get'>;
	'scrape.getStatus': HyperbrowserEndpoint<'scrape.getStatus'>;
	'scrape.createBatch': HyperbrowserEndpoint<'scrape.createBatch'>;
	'scrape.getBatch': HyperbrowserEndpoint<'scrape.getBatch'>;
	'scrape.getBatchStatus': HyperbrowserEndpoint<'scrape.getBatchStatus'>;

	'crawl.create': HyperbrowserEndpoint<'crawl.create'>;
	'crawl.get': HyperbrowserEndpoint<'crawl.get'>;
	'crawl.getStatus': HyperbrowserEndpoint<'crawl.getStatus'>;
	'crawl.createWeb': HyperbrowserEndpoint<'crawl.createWeb'>;
	'crawl.getWeb': HyperbrowserEndpoint<'crawl.getWeb'>;
	'crawl.getWebStatus': HyperbrowserEndpoint<'crawl.getWebStatus'>;

	'extract.create': HyperbrowserEndpoint<'extract.create'>;
	'extract.get': HyperbrowserEndpoint<'extract.get'>;
	'extract.getStatus': HyperbrowserEndpoint<'extract.getStatus'>;

	'web.fetch': HyperbrowserEndpoint<'web.fetch'>;
	'web.search': HyperbrowserEndpoint<'web.search'>;
};

const hyperbrowserEndpointsNested = {
	profiles: {
		create: Profiles.create,
		fork: Profiles.fork,
		get: Profiles.get,
		delete: Profiles.delete,
		list: Profiles.list,
	},
	sessions: {
		create: Sessions.create,
		get: Sessions.get,
		stop: Sessions.stop,
		update: Sessions.update,
		evaluateCaptcha: Sessions.evaluateCaptcha,
		list: Sessions.list,
		getRecordingUrl: Sessions.getRecordingUrl,
		getVideoRecordingUrl: Sessions.getVideoRecordingUrl,
		getDownloadsUrl: Sessions.getDownloadsUrl,
	},
	scrape: {
		create: Scrape.create,
		get: Scrape.get,
		getStatus: Scrape.getStatus,
		createBatch: Scrape.createBatch,
		getBatch: Scrape.getBatch,
		getBatchStatus: Scrape.getBatchStatus,
	},
	crawl: {
		create: Crawl.create,
		get: Crawl.get,
		getStatus: Crawl.getStatus,
		createWeb: Crawl.createWeb,
		getWeb: Crawl.getWeb,
		getWebStatus: Crawl.getWebStatus,
	},
	extract: {
		create: Extract.create,
		get: Extract.get,
		getStatus: Extract.getStatus,
	},
	web: {
		fetch: Web.fetch,
		search: Web.search,
	},
} as const;

export const hyperbrowserEndpointSchemas = {
	'profiles.create': {
		input: HyperbrowserEndpointInputSchemas['profiles.create'],
		output: HyperbrowserEndpointOutputSchemas['profiles.create'],
	},
	'profiles.fork': {
		input: HyperbrowserEndpointInputSchemas['profiles.fork'],
		output: HyperbrowserEndpointOutputSchemas['profiles.fork'],
	},
	'profiles.get': {
		input: HyperbrowserEndpointInputSchemas['profiles.get'],
		output: HyperbrowserEndpointOutputSchemas['profiles.get'],
	},
	'profiles.delete': {
		input: HyperbrowserEndpointInputSchemas['profiles.delete'],
		output: HyperbrowserEndpointOutputSchemas['profiles.delete'],
	},
	'profiles.list': {
		input: HyperbrowserEndpointInputSchemas['profiles.list'],
		output: HyperbrowserEndpointOutputSchemas['profiles.list'],
	},

	'sessions.create': {
		input: HyperbrowserEndpointInputSchemas['sessions.create'],
		output: HyperbrowserEndpointOutputSchemas['sessions.create'],
	},
	'sessions.get': {
		input: HyperbrowserEndpointInputSchemas['sessions.get'],
		output: HyperbrowserEndpointOutputSchemas['sessions.get'],
	},
	'sessions.stop': {
		input: HyperbrowserEndpointInputSchemas['sessions.stop'],
		output: HyperbrowserEndpointOutputSchemas['sessions.stop'],
	},
	'sessions.update': {
		input: HyperbrowserEndpointInputSchemas['sessions.update'],
		output: HyperbrowserEndpointOutputSchemas['sessions.update'],
	},
	'sessions.evaluateCaptcha': {
		input: HyperbrowserEndpointInputSchemas['sessions.evaluateCaptcha'],
		output: HyperbrowserEndpointOutputSchemas['sessions.evaluateCaptcha'],
	},
	'sessions.list': {
		input: HyperbrowserEndpointInputSchemas['sessions.list'],
		output: HyperbrowserEndpointOutputSchemas['sessions.list'],
	},
	'sessions.getRecordingUrl': {
		input: HyperbrowserEndpointInputSchemas['sessions.getRecordingUrl'],
		output: HyperbrowserEndpointOutputSchemas['sessions.getRecordingUrl'],
	},
	'sessions.getVideoRecordingUrl': {
		input: HyperbrowserEndpointInputSchemas['sessions.getVideoRecordingUrl'],
		output: HyperbrowserEndpointOutputSchemas['sessions.getVideoRecordingUrl'],
	},
	'sessions.getDownloadsUrl': {
		input: HyperbrowserEndpointInputSchemas['sessions.getDownloadsUrl'],
		output: HyperbrowserEndpointOutputSchemas['sessions.getDownloadsUrl'],
	},

	'scrape.create': {
		input: HyperbrowserEndpointInputSchemas['scrape.create'],
		output: HyperbrowserEndpointOutputSchemas['scrape.create'],
	},
	'scrape.get': {
		input: HyperbrowserEndpointInputSchemas['scrape.get'],
		output: HyperbrowserEndpointOutputSchemas['scrape.get'],
	},
	'scrape.getStatus': {
		input: HyperbrowserEndpointInputSchemas['scrape.getStatus'],
		output: HyperbrowserEndpointOutputSchemas['scrape.getStatus'],
	},
	'scrape.createBatch': {
		input: HyperbrowserEndpointInputSchemas['scrape.createBatch'],
		output: HyperbrowserEndpointOutputSchemas['scrape.createBatch'],
	},
	'scrape.getBatch': {
		input: HyperbrowserEndpointInputSchemas['scrape.getBatch'],
		output: HyperbrowserEndpointOutputSchemas['scrape.getBatch'],
	},
	'scrape.getBatchStatus': {
		input: HyperbrowserEndpointInputSchemas['scrape.getBatchStatus'],
		output: HyperbrowserEndpointOutputSchemas['scrape.getBatchStatus'],
	},

	'crawl.create': {
		input: HyperbrowserEndpointInputSchemas['crawl.create'],
		output: HyperbrowserEndpointOutputSchemas['crawl.create'],
	},
	'crawl.get': {
		input: HyperbrowserEndpointInputSchemas['crawl.get'],
		output: HyperbrowserEndpointOutputSchemas['crawl.get'],
	},
	'crawl.getStatus': {
		input: HyperbrowserEndpointInputSchemas['crawl.getStatus'],
		output: HyperbrowserEndpointOutputSchemas['crawl.getStatus'],
	},
	'crawl.createWeb': {
		input: HyperbrowserEndpointInputSchemas['crawl.createWeb'],
		output: HyperbrowserEndpointOutputSchemas['crawl.createWeb'],
	},
	'crawl.getWeb': {
		input: HyperbrowserEndpointInputSchemas['crawl.getWeb'],
		output: HyperbrowserEndpointOutputSchemas['crawl.getWeb'],
	},
	'crawl.getWebStatus': {
		input: HyperbrowserEndpointInputSchemas['crawl.getWebStatus'],
		output: HyperbrowserEndpointOutputSchemas['crawl.getWebStatus'],
	},

	'extract.create': {
		input: HyperbrowserEndpointInputSchemas['extract.create'],
		output: HyperbrowserEndpointOutputSchemas['extract.create'],
	},
	'extract.get': {
		input: HyperbrowserEndpointInputSchemas['extract.get'],
		output: HyperbrowserEndpointOutputSchemas['extract.get'],
	},
	'extract.getStatus': {
		input: HyperbrowserEndpointInputSchemas['extract.getStatus'],
		output: HyperbrowserEndpointOutputSchemas['extract.getStatus'],
	},

	'web.fetch': {
		input: HyperbrowserEndpointInputSchemas['web.fetch'],
		output: HyperbrowserEndpointOutputSchemas['web.fetch'],
	},
	'web.search': {
		input: HyperbrowserEndpointInputSchemas['web.search'],
		output: HyperbrowserEndpointOutputSchemas['web.search'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof hyperbrowserEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const hyperbrowserEndpointMeta = {
	'profiles.create': {
		riskLevel: 'destructive',
		description: 'Create a new persistent browser profile',
	},
	'profiles.fork': {
		riskLevel: 'destructive',
		description: 'Fork an existing persistent browser profile',
	},
	'profiles.get': {
		riskLevel: 'read',
		description: 'Get persistent browser profile details by ID',
	},
	'profiles.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a persistent browser profile by ID',
	},
	'profiles.list': {
		riskLevel: 'read',
		description:
			'List persistent browser profiles with optional pagination and name filter',
	},

	'sessions.create': {
		riskLevel: 'destructive',
		description:
			'Create and launch a cloud browser session (consumes compute credits)',
	},
	'sessions.get': {
		riskLevel: 'read',
		description: 'Get cloud browser session details by ID',
	},
	'sessions.stop': {
		riskLevel: 'destructive',
		description: 'Stop an active cloud browser session',
	},
	'sessions.update': {
		riskLevel: 'destructive',
		description: 'Update live configuration of a running browser session',
	},
	'sessions.evaluateCaptcha': {
		riskLevel: 'destructive',
		description:
			'Run CAPTCHA evaluation and solving on an active session (consumes credits)',
	},
	'sessions.list': {
		riskLevel: 'read',
		description:
			'List cloud browser sessions with optional pagination and status filter',
	},
	'sessions.getRecordingUrl': {
		riskLevel: 'read',
		description: 'Get the web recording replay URL for a browser session',
	},
	'sessions.getVideoRecordingUrl': {
		riskLevel: 'read',
		description: 'Get the video recording URL for a browser session',
	},
	'sessions.getDownloadsUrl': {
		riskLevel: 'read',
		description: 'Get the downloads archive URL for a browser session',
	},

	'scrape.create': {
		riskLevel: 'destructive',
		description:
			'Start an asynchronous web scrape job (consumes compute credits)',
	},
	'scrape.get': {
		riskLevel: 'read',
		description: 'Get scrape job status and content data by job ID',
	},
	'scrape.getStatus': {
		riskLevel: 'read',
		description:
			'Get the current status of an asynchronous scrape job by job ID',
	},
	'scrape.createBatch': {
		riskLevel: 'destructive',
		description:
			'Start an asynchronous batch scrape job across multiple URLs (consumes compute credits)',
	},
	'scrape.getBatch': {
		riskLevel: 'read',
		description: 'Get results and page data of a batch scrape job by job ID',
	},
	'scrape.getBatchStatus': {
		riskLevel: 'read',
		description:
			'Get the current status of an asynchronous batch scrape job by job ID',
	},

	'crawl.create': {
		riskLevel: 'destructive',
		description:
			'Start an asynchronous multi-page crawl job (consumes compute credits)',
	},
	'crawl.get': {
		riskLevel: 'read',
		description: 'Get crawl job status and crawled pages data by job ID',
	},
	'crawl.getStatus': {
		riskLevel: 'read',
		description:
			'Get the current status of an asynchronous crawl job by job ID',
	},
	'crawl.createWeb': {
		riskLevel: 'destructive',
		description:
			'Start an asynchronous web crawl job using the Web API engine (consumes compute credits)',
	},
	'crawl.getWeb': {
		riskLevel: 'read',
		description: 'Get web crawl job status and crawled page data by job ID',
	},
	'crawl.getWebStatus': {
		riskLevel: 'read',
		description:
			'Get the current status of an asynchronous web crawl job by job ID',
	},

	'extract.create': {
		riskLevel: 'destructive',
		description:
			'Start an AI structured data extraction job across URLs (consumes compute credits)',
	},
	'extract.get': {
		riskLevel: 'read',
		description:
			'Get the extracted structured data and status of an extract job by job ID',
	},
	'extract.getStatus': {
		riskLevel: 'read',
		description:
			'Get the current status of an asynchronous extract job by job ID',
	},

	'web.fetch': {
		riskLevel: 'destructive',
		description:
			'Fetch web page content in multiple formats using cloud browser (consumes compute credits)',
	},
	'web.search': {
		riskLevel: 'destructive',
		description:
			'Search the web with clean structured results (consumes compute credits)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof hyperbrowserEndpointsNested
>;

export const hyperbrowserAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseHyperbrowserPlugin<T extends HyperbrowserPluginOptions> =
	CorsairPlugin<
		'hyperbrowser',
		typeof HyperbrowserSchema,
		typeof hyperbrowserEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalHyperbrowserPlugin =
	BaseHyperbrowserPlugin<HyperbrowserPluginOptions>;

export type ExternalHyperbrowserPlugin<T extends HyperbrowserPluginOptions> =
	BaseHyperbrowserPlugin<T>;

export function hyperbrowser<const T extends HyperbrowserPluginOptions>(
	incomingOptions: HyperbrowserPluginOptions &
		T = {} as HyperbrowserPluginOptions & T,
): ExternalHyperbrowserPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'hyperbrowser',
		authConfig: hyperbrowserAuthConfig,
		schema: HyperbrowserSchema,
		options,
		hooks: options.hooks,
		endpoints: hyperbrowserEndpointsNested,
		webhooks: {},
		endpointMeta: hyperbrowserEndpointMeta,
		endpointSchemas: hyperbrowserEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HyperbrowserKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('hyperbrowser', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('hyperbrowser', 'api_key');
			return apiKey;
		},
	} satisfies InternalHyperbrowserPlugin;
}

export type {
	CreateBatchScrapeJobInput,
	CreateBatchScrapeJobOutput,
	CreateCrawlJobInput,
	CreateCrawlJobOutput,
	CreateExtractJobInput,
	CreateExtractJobOutput,
	CreateProfileInput,
	CreateProfileOutput,
	CreateScrapeJobInput,
	CreateScrapeJobOutput,
	CreateSessionInput,
	CreateSessionOutput,
	CreateWebCrawlJobInput,
	CreateWebCrawlJobOutput,
	DeleteProfileInput,
	DeleteProfileOutput,
	EvaluateCaptchaInput,
	EvaluateCaptchaOutput,
	FetchPageInput,
	FetchPageOutput,
	ForkProfileInput,
	ForkProfileOutput,
	GetBatchScrapeJobInput,
	GetBatchScrapeJobOutput,
	GetBatchScrapeJobStatusInput,
	GetBatchScrapeJobStatusOutput,
	GetCrawlJobInput,
	GetCrawlJobOutput,
	GetCrawlJobStatusInput,
	GetCrawlJobStatusOutput,
	GetExtractJobInput,
	GetExtractJobOutput,
	GetExtractJobStatusInput,
	GetExtractJobStatusOutput,
	GetProfileInput,
	GetProfileOutput,
	GetScrapeJobInput,
	GetScrapeJobOutput,
	GetScrapeJobStatusInput,
	GetScrapeJobStatusOutput,
	GetSessionDownloadsUrlInput,
	GetSessionDownloadsUrlOutput,
	GetSessionInput,
	GetSessionOutput,
	GetSessionRecordingUrlInput,
	GetSessionRecordingUrlOutput,
	GetSessionVideoRecordingUrlInput,
	GetSessionVideoRecordingUrlOutput,
	GetWebCrawlJobInput,
	GetWebCrawlJobOutput,
	GetWebCrawlJobStatusInput,
	GetWebCrawlJobStatusOutput,
	HyperbrowserEndpointInputs,
	HyperbrowserEndpointOutputs,
	ListProfilesInput,
	ListProfilesOutput,
	ListSessionsInput,
	ListSessionsOutput,
	SearchWebInput,
	SearchWebOutput,
	StopSessionInput,
	StopSessionOutput,
	UpdateSessionInput,
	UpdateSessionOutput,
} from './endpoints/types';
