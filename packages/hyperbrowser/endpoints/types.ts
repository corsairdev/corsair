import { z } from 'zod';

// ==========================================
// Profiles Schemas
// ==========================================

export const CreateProfileInputSchema = z
	.object({
		name: z.string().optional(),
	})
	.strict();

export const CreateProfileOutputSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
});

export const ForkProfileInputSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
	})
	.strict();

export const ForkProfileOutputSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
});

export const GetProfileInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const ProfileResponseSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	teamId: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const GetProfileOutputSchema = ProfileResponseSchema;

export const DeleteProfileInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const DeleteProfileOutputSchema = z.object({
	success: z.boolean().optional(),
});

export const ListProfilesInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		limit: z.number().int().positive().optional(),
		name: z.string().optional(),
	})
	.strict();

export const ListProfilesOutputSchema = z.object({
	profiles: z.array(ProfileResponseSchema).optional(),
	totalCount: z.number().optional(),
	page: z.number().optional(),
	perPage: z.number().optional(),
});

// ==========================================
// Sessions Schemas
// ==========================================

export const CreateSessionInputSchema = z
	.object({
		useUltraStealth: z.boolean().optional(),
		useStealth: z.boolean().optional(),
		useProxy: z.boolean().optional(),
		proxyServer: z.string().optional(),
		proxyServerPassword: z.string().optional(),
		proxyServerUsername: z.string().optional(),
		proxyCountry: z.string().optional(),
		proxyState: z.string().optional(),
		proxyCity: z.string().nullable().optional(),
		region: z.string().optional(),
		operatingSystems: z.array(z.string()).optional(),
		device: z.array(z.string()).optional(),
		platform: z.array(z.string()).optional(),
		locales: z.array(z.string()).optional(),
		screen: z
			.object({
				width: z.number().optional(),
				height: z.number().optional(),
				deviceScaleFactor: z.number().optional(),
			})
			.optional(),
		solveCaptchas: z.boolean().optional(),
		solverType: z.enum(['visual']).optional(),
		adblock: z.boolean().optional(),
		trackers: z.boolean().optional(),
		annoyances: z.boolean().optional(),
		enableWebRecording: z.boolean().optional(),
		enableVideoWebRecording: z.boolean().optional(),
		profile: z
			.object({
				id: z.string().optional(),
				persistChanges: z.boolean().optional(),
			})
			.optional(),
		acceptCookies: z.boolean().optional(),
		staticIpId: z.string().optional(),
		saveDownloads: z.boolean().optional(),
		extensionIds: z.array(z.string()).optional(),
		urlBlocklist: z.array(z.string()).optional(),
		browserArgs: z.array(z.string()).optional(),
		timeoutMinutes: z.number().min(1).max(720).optional(),
		enableWindowManager: z.boolean().optional(),
		enableWindowManagerTaskbar: z.boolean().optional(),
		viewOnlyLiveView: z.boolean().optional(),
		disablePasswordManager: z.boolean().optional(),
		enableAlwaysOpenPdfExternally: z.boolean().optional(),
		disablePostQuantumKeyAgreement: z.boolean().optional(),
		enableWebMcp: z.boolean().optional(),
	})
	.strict();

export const SessionDetailSchema = z.object({
	id: z.string().optional(),
	teamId: z.string().optional(),
	status: z.enum(['active', 'closed', 'error', 'close-error']).optional(),
	startTime: z.string().nullable().optional(),
	endTime: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	creditsUsed: z.number().nullable().optional(),
	sessionUrl: z.string().optional(),
	liveUrl: z.string().optional(),
	token: z.string().optional(),
	wsEndpoint: z.string().optional(),
	webdriverEndpoint: z.string().optional(),
	computerActionEndpoint: z.string().optional(),
});

export const CreateSessionOutputSchema = SessionDetailSchema;
export const GetSessionOutputSchema = SessionDetailSchema;

export const GetSessionInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const StopSessionInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const StopSessionOutputSchema = z.object({
	success: z.boolean().optional(),
});

export const UpdateSessionInputSchema = z
	.object({
		id: z.string(),
		type: z.enum(['profile', 'proxy', 'screen', 'solveCaptchas']),
		// `unknown` because update params are polymorphic based on the discriminated type.
		params: z.record(z.string(), z.unknown()),
	})
	.strict();

export const UpdateSessionOutputSchema = z.object({
	success: z.boolean().optional(),
	solveCaptchas: z.boolean().optional(),
	sessionId: z.string().optional(),
	telemetryReady: z.boolean().optional(),
});

export const EvaluateCaptchaInputSchema = z
	.object({
		id: z.string(),
		captcha: z.string().optional(),
		captchaType: z.string().optional(),
		text: z.string().optional(),
		iterations: z.number().int().min(1).max(20).optional(),
		maxIterations: z.number().int().min(1).max(20).optional(),
		solverType: z.enum(['visual']).optional(),
		useUltraStealth: z.boolean().optional(),
	})
	.strict();

export const EvaluateCaptchaOutputSchema = z.object({
	success: z.boolean().optional(),
	captcha: z.string().nullable().optional(),
	iterationsRequested: z.number().int().optional(),
	iterationsRun: z.number().int().optional(),
	solved: z.boolean().optional(),
	solvedCaptchas: z.array(z.string()).optional(),
	// `unknown` because CAPTCHA page diagnostics are arbitrary page-level evaluation objects.
	pages: z.array(z.record(z.string(), z.unknown())).optional(),
});

export const ListSessionsInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		status: z.string().optional(),
	})
	.strict();

export const ListSessionsOutputSchema = z.object({
	sessions: z.array(SessionDetailSchema).optional(),
	totalCount: z.number().optional(),
	page: z.number().optional(),
	pageSize: z.number().optional(),
});

export const GetSessionRecordingUrlInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetSessionRecordingUrlOutputSchema = z.object({
	status: z.enum([
		'not_enabled',
		'pending',
		'in_progress',
		'completed',
		'failed',
	]),
	recordingUrl: z.string().nullable().optional(),
	error: z.string().nullable().optional(),
});

export const GetSessionVideoRecordingUrlInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetSessionVideoRecordingUrlOutputSchema =
	GetSessionRecordingUrlOutputSchema;

export const GetSessionDownloadsUrlInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetSessionDownloadsUrlOutputSchema = z.object({
	status: z.enum([
		'not_enabled',
		'pending',
		'in_progress',
		'completed',
		'failed',
	]),
	downloadsUrl: z.string().nullable().optional(),
	error: z.string().nullable().optional(),
});

// ==========================================
// Scrape Schemas
// ==========================================

export const JobStatusEnum = z.enum([
	'pending',
	'running',
	'completed',
	'failed',
	'stopped',
]);

export const ScrapeOptionsSchema = z.object({
	formats: z
		.array(z.enum(['html', 'links', 'markdown', 'screenshot']))
		.optional(),
	includeTags: z.array(z.string()).optional(),
	excludeTags: z.array(z.string()).optional(),
	onlyMainContent: z.boolean().optional(),
	waitFor: z.number().optional(),
	timeout: z.number().optional(),
	waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle']).optional(),
});

export const CreateScrapeJobInputSchema = z
	.object({
		url: z.string().min(1),
		sessionOptions: CreateSessionInputSchema.optional(),
		scrapeOptions: ScrapeOptionsSchema.optional(),
	})
	.strict();

export const CreateScrapeJobOutputSchema = z.object({
	jobId: z.string(),
});

export const GetScrapeJobInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const ScrapeJobDataSchema = z.object({
	markdown: z.string().optional(),
	html: z.string().optional(),
	links: z.array(z.string()).optional(),
	screenshot: z.string().optional(),
	metadata: z
		.record(z.string(), z.union([z.string(), z.array(z.string())]))
		.optional(),
});

export const GetScrapeJobOutputSchema = z.object({
	jobId: z.string(),
	status: JobStatusEnum,
	data: ScrapeJobDataSchema.optional(),
	error: z.string().optional(),
});

export const GetScrapeJobStatusInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetScrapeJobStatusOutputSchema = z.object({
	status: JobStatusEnum,
});

export const CreateBatchScrapeJobInputSchema = z
	.object({
		urls: z.array(z.string().min(1)),
		sessionOptions: CreateSessionInputSchema.optional(),
		scrapeOptions: ScrapeOptionsSchema.optional(),
	})
	.strict();

export const CreateBatchScrapeJobOutputSchema = z.object({
	jobId: z.string(),
});

export const GetBatchScrapeJobInputSchema = z
	.object({
		id: z.string(),
		page: z.number().int().positive().optional(),
		batchSize: z.number().int().positive().optional(),
	})
	.strict();

export const ScrapedPageSchema = z.object({
	url: z.string(),
	status: JobStatusEnum,
	error: z.string().nullable().optional(),
	markdown: z.string().optional(),
	html: z.string().optional(),
	links: z.array(z.string()).optional(),
	screenshot: z.string().optional(),
	metadata: z
		.record(z.string(), z.union([z.string(), z.array(z.string())]))
		.optional(),
});

export const GetBatchScrapeJobOutputSchema = z.object({
	jobId: z.string().optional(),
	status: JobStatusEnum.optional(),
	data: z.array(ScrapedPageSchema).optional(),
	error: z.string().optional(),
	totalScrapedPages: z.number().optional(),
	totalPageBatches: z.number().optional(),
	currentPageBatch: z.number().optional(),
	batchSize: z.number().optional(),
});

export const GetBatchScrapeJobStatusInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetBatchScrapeJobStatusOutputSchema =
	GetScrapeJobStatusOutputSchema;

// ==========================================
// Crawl Schemas
// ==========================================

export const CreateCrawlJobInputSchema = z
	.object({
		url: z.string().min(1),
		maxPages: z.number().int().min(1).optional(),
		followLinks: z.boolean().optional(),
		ignoreSitemap: z.boolean().optional(),
		excludePatterns: z.array(z.string()).optional(),
		includePatterns: z.array(z.string()).optional(),
		sessionOptions: CreateSessionInputSchema.optional(),
		scrapeOptions: ScrapeOptionsSchema.optional(),
	})
	.strict();

export const CreateCrawlJobOutputSchema = z.object({
	jobId: z.string(),
});

export const GetCrawlJobInputSchema = z
	.object({
		id: z.string(),
		page: z.number().int().positive().optional(),
		batchSize: z.number().int().positive().optional(),
	})
	.strict();

export const CrawledPageSchema = z.object({
	url: z.string(),
	status: z.enum(['completed', 'failed']),
	error: z.string().nullable().optional(),
	markdown: z.string().optional(),
	html: z.string().optional(),
	links: z.array(z.string()).optional(),
	screenshot: z.string().optional(),
	metadata: z
		.record(z.string(), z.union([z.string(), z.array(z.string())]))
		.optional(),
});

export const GetCrawlJobOutputSchema = z.object({
	jobId: z.string(),
	status: JobStatusEnum,
	error: z.string().nullable().optional(),
	totalCrawledPages: z.number().int().optional(),
	totalPageBatches: z.number().int().optional(),
	currentPageBatch: z.number().int().optional(),
	batchSize: z.number().int().optional(),
	data: z.array(CrawledPageSchema).optional(),
});

export const GetCrawlJobStatusInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetCrawlJobStatusOutputSchema = GetScrapeJobStatusOutputSchema;

export const CreateWebCrawlJobInputSchema = z
	.object({
		url: z.string().min(1),
		stealth: z.enum(['none', 'auto', 'ultra']).optional(),
		crawlOptions: z
			.object({
				maxPages: z.number().int().min(1).max(100).optional(),
				followLinks: z.boolean().optional(),
				ignoreSitemap: z.boolean().optional(),
				excludePatterns: z.array(z.string()).optional(),
				includePatterns: z.array(z.string()).optional(),
			})
			.optional(),
	})
	.strict();

export const CreateWebCrawlJobOutputSchema = z.object({
	jobId: z.string(),
});

export const GetWebCrawlJobInputSchema = z
	.object({
		id: z.string(),
		page: z.number().int().positive().optional(),
		batchSize: z.number().int().positive().optional(),
	})
	.strict();

export const WebCrawlPageDataSchema = z.object({
	url: z.string(),
	status: z.enum(['completed', 'failed', 'pending', 'running']),
	error: z.string().nullable().optional(),
	markdown: z.string().optional(),
	html: z.string().optional(),
	links: z.array(z.string()).optional(),
	screenshot: z.string().optional(),
	// `unknown` because extracted JSON structure depends on user-defined page extract schemas.
	json: z.record(z.string(), z.unknown()).optional(),
	metadata: z
		.record(z.string(), z.union([z.string(), z.array(z.string())]))
		.optional(),
});

export const GetWebCrawlJobOutputSchema = z.object({
	jobId: z.string(),
	status: JobStatusEnum,
	error: z.string().nullable().optional(),
	totalPages: z.number().int().optional(),
	totalPageBatches: z.number().int().optional(),
	currentPageBatch: z.number().int().optional(),
	batchSize: z.number().int().optional(),
	data: z.array(WebCrawlPageDataSchema).optional(),
});

export const GetWebCrawlJobStatusInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetWebCrawlJobStatusOutputSchema = GetScrapeJobStatusOutputSchema;

// ==========================================
// Extract Schemas
// ==========================================

export const CreateExtractJobInputSchema = z
	.object({
		urls: z.array(z.string().min(1)),
		systemPrompt: z.string().optional(),
		maxLinks: z.number().optional(),
		prompt: z.string().optional(),
		// `unknown` because the extraction schema is a dynamic caller-provided JSON schema.
		schema: z.record(z.string(), z.unknown()).optional(),
		sessionOptions: CreateSessionInputSchema.optional(),
		waitFor: z.number().optional(),
	})
	.strict();

export const CreateExtractJobOutputSchema = z.object({
	jobId: z.string(),
});

export const GetExtractJobInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetExtractJobOutputSchema = z.object({
	jobId: z.string(),
	status: JobStatusEnum,
	// `unknown` because extract output data conforms to the caller-supplied extraction schema.
	data: z.record(z.string(), z.unknown()).optional(),
	error: z.string().optional(),
});

export const GetExtractJobStatusInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const GetExtractJobStatusOutputSchema = GetScrapeJobStatusOutputSchema;

// ==========================================
// Web (Fetch & Search) Schemas
// ==========================================

export const FetchPageInputSchema = z
	.object({
		url: z.string().min(1),
		stealth: z.enum(['none', 'auto', 'ultra']).optional(),
		outputs: z
			.object({
				formats: z.array(z.string()).optional(),
				sanitize: z.string().optional(),
				includeSelectors: z.array(z.string()).optional(),
				excludeSelectors: z.array(z.string()).optional(),
			})
			.optional(),
		browser: z
			.object({
				profileId: z.string().optional(),
				solveCaptchas: z.string().optional(),
			})
			.optional(),
		navigation: z
			.object({
				waitUntil: z.string().optional(),
				timeoutMs: z.number().int().optional(),
				waitFor: z.number().int().optional(),
			})
			.optional(),
		cache: z
			.object({
				maxAgeSeconds: z.number().int().optional(),
			})
			.optional(),
	})
	.strict();

export const FetchPageOutputSchema = z.object({
	jobId: z.string(),
	status: z.enum(['completed', 'failed', 'pending', 'running']),
	error: z.string().nullable().optional(),
	data: z
		.object({
			markdown: z.string().optional(),
			html: z.string().optional(),
			links: z.array(z.string()).optional(),
			screenshot: z.string().optional(),
			// `unknown` because structured JSON output depends on requested page formats.
			json: z.record(z.string(), z.unknown()).optional(),
			metadata: z
				.record(z.string(), z.union([z.string(), z.array(z.string())]))
				.optional(),
		})
		.optional(),
});

export const SearchWebInputSchema = z
	.object({
		query: z.string().min(1),
		page: z.number().int().positive().optional(),
		maxAgeSeconds: z.number().int().positive().optional(),
	})
	.strict();

export const SearchWebOutputSchema = z.object({
	jobId: z.string(),
	status: z.enum(['completed', 'failed', 'pending', 'running', 'stopped']),
	error: z.string().nullable().optional(),
	data: z
		.object({
			query: z.string(),
			results: z.array(
				z.object({
					title: z.string(),
					url: z.string(),
					description: z.string(),
				}),
			),
		})
		.optional(),
});

// ==========================================
// Registry Types and Schemas
// ==========================================

export const HyperbrowserEndpointInputSchemas = {
	'profiles.create': CreateProfileInputSchema,
	'profiles.fork': ForkProfileInputSchema,
	'profiles.get': GetProfileInputSchema,
	'profiles.delete': DeleteProfileInputSchema,
	'profiles.list': ListProfilesInputSchema,

	'sessions.create': CreateSessionInputSchema,
	'sessions.get': GetSessionInputSchema,
	'sessions.stop': StopSessionInputSchema,
	'sessions.update': UpdateSessionInputSchema,
	'sessions.evaluateCaptcha': EvaluateCaptchaInputSchema,
	'sessions.list': ListSessionsInputSchema,
	'sessions.getRecordingUrl': GetSessionRecordingUrlInputSchema,
	'sessions.getVideoRecordingUrl': GetSessionVideoRecordingUrlInputSchema,
	'sessions.getDownloadsUrl': GetSessionDownloadsUrlInputSchema,

	'scrape.create': CreateScrapeJobInputSchema,
	'scrape.get': GetScrapeJobInputSchema,
	'scrape.getStatus': GetScrapeJobStatusInputSchema,
	'scrape.createBatch': CreateBatchScrapeJobInputSchema,
	'scrape.getBatch': GetBatchScrapeJobInputSchema,
	'scrape.getBatchStatus': GetBatchScrapeJobStatusInputSchema,

	'crawl.create': CreateCrawlJobInputSchema,
	'crawl.get': GetCrawlJobInputSchema,
	'crawl.getStatus': GetCrawlJobStatusInputSchema,
	'crawl.createWeb': CreateWebCrawlJobInputSchema,
	'crawl.getWeb': GetWebCrawlJobInputSchema,
	'crawl.getWebStatus': GetWebCrawlJobStatusInputSchema,

	'extract.create': CreateExtractJobInputSchema,
	'extract.get': GetExtractJobInputSchema,
	'extract.getStatus': GetExtractJobStatusInputSchema,

	'web.fetch': FetchPageInputSchema,
	'web.search': SearchWebInputSchema,
} as const;

export const HyperbrowserEndpointOutputSchemas = {
	'profiles.create': CreateProfileOutputSchema,
	'profiles.fork': ForkProfileOutputSchema,
	'profiles.get': GetProfileOutputSchema,
	'profiles.delete': DeleteProfileOutputSchema,
	'profiles.list': ListProfilesOutputSchema,

	'sessions.create': CreateSessionOutputSchema,
	'sessions.get': GetSessionOutputSchema,
	'sessions.stop': StopSessionOutputSchema,
	'sessions.update': UpdateSessionOutputSchema,
	'sessions.evaluateCaptcha': EvaluateCaptchaOutputSchema,
	'sessions.list': ListSessionsOutputSchema,
	'sessions.getRecordingUrl': GetSessionRecordingUrlOutputSchema,
	'sessions.getVideoRecordingUrl': GetSessionVideoRecordingUrlOutputSchema,
	'sessions.getDownloadsUrl': GetSessionDownloadsUrlOutputSchema,

	'scrape.create': CreateScrapeJobOutputSchema,
	'scrape.get': GetScrapeJobOutputSchema,
	'scrape.getStatus': GetScrapeJobStatusOutputSchema,
	'scrape.createBatch': CreateBatchScrapeJobOutputSchema,
	'scrape.getBatch': GetBatchScrapeJobOutputSchema,
	'scrape.getBatchStatus': GetBatchScrapeJobStatusOutputSchema,

	'crawl.create': CreateCrawlJobOutputSchema,
	'crawl.get': GetCrawlJobOutputSchema,
	'crawl.getStatus': GetCrawlJobStatusOutputSchema,
	'crawl.createWeb': CreateWebCrawlJobOutputSchema,
	'crawl.getWeb': GetWebCrawlJobOutputSchema,
	'crawl.getWebStatus': GetWebCrawlJobStatusOutputSchema,

	'extract.create': CreateExtractJobOutputSchema,
	'extract.get': GetExtractJobOutputSchema,
	'extract.getStatus': GetExtractJobStatusOutputSchema,

	'web.fetch': FetchPageOutputSchema,
	'web.search': SearchWebOutputSchema,
} as const;

export type HyperbrowserEndpointInputs = {
	'profiles.create': z.infer<typeof CreateProfileInputSchema>;
	'profiles.fork': z.infer<typeof ForkProfileInputSchema>;
	'profiles.get': z.infer<typeof GetProfileInputSchema>;
	'profiles.delete': z.infer<typeof DeleteProfileInputSchema>;
	'profiles.list': z.infer<typeof ListProfilesInputSchema>;

	'sessions.create': z.infer<typeof CreateSessionInputSchema>;
	'sessions.get': z.infer<typeof GetSessionInputSchema>;
	'sessions.stop': z.infer<typeof StopSessionInputSchema>;
	'sessions.update': z.infer<typeof UpdateSessionInputSchema>;
	'sessions.evaluateCaptcha': z.infer<typeof EvaluateCaptchaInputSchema>;
	'sessions.list': z.infer<typeof ListSessionsInputSchema>;
	'sessions.getRecordingUrl': z.infer<typeof GetSessionRecordingUrlInputSchema>;
	'sessions.getVideoRecordingUrl': z.infer<
		typeof GetSessionVideoRecordingUrlInputSchema
	>;
	'sessions.getDownloadsUrl': z.infer<typeof GetSessionDownloadsUrlInputSchema>;

	'scrape.create': z.infer<typeof CreateScrapeJobInputSchema>;
	'scrape.get': z.infer<typeof GetScrapeJobInputSchema>;
	'scrape.getStatus': z.infer<typeof GetScrapeJobStatusInputSchema>;
	'scrape.createBatch': z.infer<typeof CreateBatchScrapeJobInputSchema>;
	'scrape.getBatch': z.infer<typeof GetBatchScrapeJobInputSchema>;
	'scrape.getBatchStatus': z.infer<typeof GetBatchScrapeJobStatusInputSchema>;

	'crawl.create': z.infer<typeof CreateCrawlJobInputSchema>;
	'crawl.get': z.infer<typeof GetCrawlJobInputSchema>;
	'crawl.getStatus': z.infer<typeof GetCrawlJobStatusInputSchema>;
	'crawl.createWeb': z.infer<typeof CreateWebCrawlJobInputSchema>;
	'crawl.getWeb': z.infer<typeof GetWebCrawlJobInputSchema>;
	'crawl.getWebStatus': z.infer<typeof GetWebCrawlJobStatusInputSchema>;

	'extract.create': z.infer<typeof CreateExtractJobInputSchema>;
	'extract.get': z.infer<typeof GetExtractJobInputSchema>;
	'extract.getStatus': z.infer<typeof GetExtractJobStatusInputSchema>;

	'web.fetch': z.infer<typeof FetchPageInputSchema>;
	'web.search': z.infer<typeof SearchWebInputSchema>;
};

export type HyperbrowserEndpointOutputs = {
	'profiles.create': z.infer<typeof CreateProfileOutputSchema>;
	'profiles.fork': z.infer<typeof ForkProfileOutputSchema>;
	'profiles.get': z.infer<typeof GetProfileOutputSchema>;
	'profiles.delete': z.infer<typeof DeleteProfileOutputSchema>;
	'profiles.list': z.infer<typeof ListProfilesOutputSchema>;

	'sessions.create': z.infer<typeof CreateSessionOutputSchema>;
	'sessions.get': z.infer<typeof GetSessionOutputSchema>;
	'sessions.stop': z.infer<typeof StopSessionOutputSchema>;
	'sessions.update': z.infer<typeof UpdateSessionOutputSchema>;
	'sessions.evaluateCaptcha': z.infer<typeof EvaluateCaptchaOutputSchema>;
	'sessions.list': z.infer<typeof ListSessionsOutputSchema>;
	'sessions.getRecordingUrl': z.infer<
		typeof GetSessionRecordingUrlOutputSchema
	>;
	'sessions.getVideoRecordingUrl': z.infer<
		typeof GetSessionVideoRecordingUrlOutputSchema
	>;
	'sessions.getDownloadsUrl': z.infer<
		typeof GetSessionDownloadsUrlOutputSchema
	>;

	'scrape.create': z.infer<typeof CreateScrapeJobOutputSchema>;
	'scrape.get': z.infer<typeof GetScrapeJobOutputSchema>;
	'scrape.getStatus': z.infer<typeof GetScrapeJobStatusOutputSchema>;
	'scrape.createBatch': z.infer<typeof CreateBatchScrapeJobOutputSchema>;
	'scrape.getBatch': z.infer<typeof GetBatchScrapeJobOutputSchema>;
	'scrape.getBatchStatus': z.infer<typeof GetBatchScrapeJobStatusOutputSchema>;

	'crawl.create': z.infer<typeof CreateCrawlJobOutputSchema>;
	'crawl.get': z.infer<typeof GetCrawlJobOutputSchema>;
	'crawl.getStatus': z.infer<typeof GetCrawlJobStatusOutputSchema>;
	'crawl.createWeb': z.infer<typeof CreateWebCrawlJobOutputSchema>;
	'crawl.getWeb': z.infer<typeof GetWebCrawlJobOutputSchema>;
	'crawl.getWebStatus': z.infer<typeof GetWebCrawlJobStatusOutputSchema>;

	'extract.create': z.infer<typeof CreateExtractJobOutputSchema>;
	'extract.get': z.infer<typeof GetExtractJobOutputSchema>;
	'extract.getStatus': z.infer<typeof GetExtractJobStatusOutputSchema>;

	'web.fetch': z.infer<typeof FetchPageOutputSchema>;
	'web.search': z.infer<typeof SearchWebOutputSchema>;
};

export type CreateProfileInput = HyperbrowserEndpointInputs['profiles.create'];
export type CreateProfileOutput =
	HyperbrowserEndpointOutputs['profiles.create'];
export type ForkProfileInput = HyperbrowserEndpointInputs['profiles.fork'];
export type ForkProfileOutput = HyperbrowserEndpointOutputs['profiles.fork'];
export type GetProfileInput = HyperbrowserEndpointInputs['profiles.get'];
export type GetProfileOutput = HyperbrowserEndpointOutputs['profiles.get'];
export type DeleteProfileInput = HyperbrowserEndpointInputs['profiles.delete'];
export type DeleteProfileOutput =
	HyperbrowserEndpointOutputs['profiles.delete'];
export type ListProfilesInput = HyperbrowserEndpointInputs['profiles.list'];
export type ListProfilesOutput = HyperbrowserEndpointOutputs['profiles.list'];

export type CreateSessionInput = HyperbrowserEndpointInputs['sessions.create'];
export type CreateSessionOutput =
	HyperbrowserEndpointOutputs['sessions.create'];
export type GetSessionInput = HyperbrowserEndpointInputs['sessions.get'];
export type GetSessionOutput = HyperbrowserEndpointOutputs['sessions.get'];
export type StopSessionInput = HyperbrowserEndpointInputs['sessions.stop'];
export type StopSessionOutput = HyperbrowserEndpointOutputs['sessions.stop'];
export type UpdateSessionInput = HyperbrowserEndpointInputs['sessions.update'];
export type UpdateSessionOutput =
	HyperbrowserEndpointOutputs['sessions.update'];
export type EvaluateCaptchaInput =
	HyperbrowserEndpointInputs['sessions.evaluateCaptcha'];
export type EvaluateCaptchaOutput =
	HyperbrowserEndpointOutputs['sessions.evaluateCaptcha'];
export type ListSessionsInput = HyperbrowserEndpointInputs['sessions.list'];
export type ListSessionsOutput = HyperbrowserEndpointOutputs['sessions.list'];
export type GetSessionRecordingUrlInput =
	HyperbrowserEndpointInputs['sessions.getRecordingUrl'];
export type GetSessionRecordingUrlOutput =
	HyperbrowserEndpointOutputs['sessions.getRecordingUrl'];
export type GetSessionVideoRecordingUrlInput =
	HyperbrowserEndpointInputs['sessions.getVideoRecordingUrl'];
export type GetSessionVideoRecordingUrlOutput =
	HyperbrowserEndpointOutputs['sessions.getVideoRecordingUrl'];
export type GetSessionDownloadsUrlInput =
	HyperbrowserEndpointInputs['sessions.getDownloadsUrl'];
export type GetSessionDownloadsUrlOutput =
	HyperbrowserEndpointOutputs['sessions.getDownloadsUrl'];

export type CreateScrapeJobInput = HyperbrowserEndpointInputs['scrape.create'];
export type CreateScrapeJobOutput =
	HyperbrowserEndpointOutputs['scrape.create'];
export type GetScrapeJobInput = HyperbrowserEndpointInputs['scrape.get'];
export type GetScrapeJobOutput = HyperbrowserEndpointOutputs['scrape.get'];
export type GetScrapeJobStatusInput =
	HyperbrowserEndpointInputs['scrape.getStatus'];
export type GetScrapeJobStatusOutput =
	HyperbrowserEndpointOutputs['scrape.getStatus'];
export type CreateBatchScrapeJobInput =
	HyperbrowserEndpointInputs['scrape.createBatch'];
export type CreateBatchScrapeJobOutput =
	HyperbrowserEndpointOutputs['scrape.createBatch'];
export type GetBatchScrapeJobInput =
	HyperbrowserEndpointInputs['scrape.getBatch'];
export type GetBatchScrapeJobOutput =
	HyperbrowserEndpointOutputs['scrape.getBatch'];
export type GetBatchScrapeJobStatusInput =
	HyperbrowserEndpointInputs['scrape.getBatchStatus'];
export type GetBatchScrapeJobStatusOutput =
	HyperbrowserEndpointOutputs['scrape.getBatchStatus'];

export type CreateCrawlJobInput = HyperbrowserEndpointInputs['crawl.create'];
export type CreateCrawlJobOutput = HyperbrowserEndpointOutputs['crawl.create'];
export type GetCrawlJobInput = HyperbrowserEndpointInputs['crawl.get'];
export type GetCrawlJobOutput = HyperbrowserEndpointOutputs['crawl.get'];
export type GetCrawlJobStatusInput =
	HyperbrowserEndpointInputs['crawl.getStatus'];
export type GetCrawlJobStatusOutput =
	HyperbrowserEndpointOutputs['crawl.getStatus'];
export type CreateWebCrawlJobInput =
	HyperbrowserEndpointInputs['crawl.createWeb'];
export type CreateWebCrawlJobOutput =
	HyperbrowserEndpointOutputs['crawl.createWeb'];
export type GetWebCrawlJobInput = HyperbrowserEndpointInputs['crawl.getWeb'];
export type GetWebCrawlJobOutput = HyperbrowserEndpointOutputs['crawl.getWeb'];
export type GetWebCrawlJobStatusInput =
	HyperbrowserEndpointInputs['crawl.getWebStatus'];
export type GetWebCrawlJobStatusOutput =
	HyperbrowserEndpointOutputs['crawl.getWebStatus'];

export type CreateExtractJobInput =
	HyperbrowserEndpointInputs['extract.create'];
export type CreateExtractJobOutput =
	HyperbrowserEndpointOutputs['extract.create'];
export type GetExtractJobInput = HyperbrowserEndpointInputs['extract.get'];
export type GetExtractJobOutput = HyperbrowserEndpointOutputs['extract.get'];
export type GetExtractJobStatusInput =
	HyperbrowserEndpointInputs['extract.getStatus'];
export type GetExtractJobStatusOutput =
	HyperbrowserEndpointOutputs['extract.getStatus'];

export type FetchPageInput = HyperbrowserEndpointInputs['web.fetch'];
export type FetchPageOutput = HyperbrowserEndpointOutputs['web.fetch'];
export type SearchWebInput = HyperbrowserEndpointInputs['web.search'];
export type SearchWebOutput = HyperbrowserEndpointOutputs['web.search'];
