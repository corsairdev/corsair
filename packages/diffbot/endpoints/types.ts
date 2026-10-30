import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

export const DiffbotImageItemSchema = z
	.object({
		url: z.string().optional(),
		title: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		naturalWidth: z.number().optional(),
		naturalHeight: z.number().optional(),
		primary: z.boolean().optional(),
		xpath: z.string().optional(),
		attrTitle: z.string().optional(),
		attrAlt: z.string().optional(),
		caption: z.string().optional(),
	})
	.passthrough();

export const DiffbotTagSchema = z
	.object({
		id: z.number().optional(),
		label: z.string(),
		uri: z.string().optional(),
		types: z.array(z.string()).optional(),
		score: z.number().optional(),
		count: z.number().optional(),
		prevalence: z.number().optional(),
		rdfTypes: z.array(z.string()).optional(),
	})
	.passthrough();

export const DiffbotRequestMetaSchema = z
	.object({
		pageUrl: z.string().optional(),
		api: z.string().optional(),
		version: z.number().optional(),
	})
	.passthrough()
	.optional();

// ---------------------------------------------------------------------------
// 1. Account
// ---------------------------------------------------------------------------

export const GetAccountInputSchema = z.object({});
export type GetAccountInput = z.infer<typeof GetAccountInputSchema>;

export const GetAccountResponseSchema = z
	.object({
		token: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		plan: z.string().optional(),
		planStart: z.string().optional(),
		planCalls: z.number().optional(),
		apiCalls: z.number().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export type GetAccountResponse = z.infer<typeof GetAccountResponseSchema>;

// ---------------------------------------------------------------------------
// 2. Extract APIs (9 operations)
// ---------------------------------------------------------------------------

// 2.1 Get Article Data
export const GetArticleInputSchema = z.object({
	url: z.string().describe('The URL of the article to extract'),
	fields: z
		.string()
		.optional()
		.describe('Comma-separated list of optional fields (e.g. "links,meta")'),
	timeout: z
		.number()
		.optional()
		.describe('Timeout in milliseconds (default 30000)'),
	paging: z
		.enum(['false', 'true'])
		.optional()
		.describe('Set to "false" to disable automatic pagination following'),
	maxTags: z.number().optional().describe('Maximum number of tags to return'),
	naturalLanguage: z.string().optional().describe('Language hint for NLP'),
});
export type GetArticleInput = z.infer<typeof GetArticleInputSchema>;

export const GetArticleResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		objects: z.array(
			z
				.object({
					type: z.literal('article').optional(),
					title: z.string().optional(),
					text: z.string().optional(),
					html: z.string().optional(),
					date: z.string().optional(),
					estimatedDate: z.string().optional(),
					author: z.string().optional(),
					authorUrl: z.string().optional(),
					siteName: z.string().optional(),
					pageUrl: z.string().optional(),
					resolvedPageUrl: z.string().optional(),
					humanLanguage: z.string().optional(),
					numPages: z.number().optional(),
					nextPage: z.string().optional(),
					nextPages: z.array(z.string()).optional(),
					images: z.array(DiffbotImageItemSchema).optional(),
					videos: z.array(z.record(z.string(), z.unknown())).optional(),
					tags: z.array(DiffbotTagSchema).optional(),
					links: z.array(z.string()).optional(),
					breadcrumb: z
						.array(
							z.object({
								link: z.string().optional(),
								name: z.string().optional(),
							}),
						)
						.optional(),
					publisherRegion: z.string().optional(),
					publisherCountry: z.string().optional(),
					sentiment: z.number().optional(),
					diffbotUri: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type GetArticleResponse = z.infer<typeof GetArticleResponseSchema>;

// 2.2 Get Product Data
export const GetProductInputSchema = z.object({
	url: z.string().describe('The URL of the product page to extract'),
	fields: z
		.string()
		.optional()
		.describe('Comma-separated list of optional fields'),
	timeout: z
		.number()
		.optional()
		.describe('Timeout in milliseconds (default 30000)'),
	discussion: z
		.enum(['false', 'true'])
		.optional()
		.describe('Set to "false" to disable review/discussion extraction'),
});
export type GetProductInput = z.infer<typeof GetProductInputSchema>;

export const GetProductResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		objects: z.array(
			z
				.object({
					type: z.literal('product').optional(),
					title: z.string().optional(),
					text: z.string().optional(),
					brand: z.string().optional(),
					offerPrice: z.string().optional(),
					offerPriceDetails: z
						.object({
							amount: z.number().optional(),
							symbol: z.string().optional(),
							text: z.string().optional(),
						})
						.passthrough()
						.optional(),
					regularPrice: z.string().optional(),
					saveAmount: z.string().optional(),
					shippingAmount: z.string().optional(),
					availability: z.boolean().optional(),
					sku: z.string().optional(),
					mpn: z.string().optional(),
					upc: z.string().optional(),
					isbn: z.string().optional(),
					images: z.array(DiffbotImageItemSchema).optional(),
					offers: z.array(z.record(z.string(), z.unknown())).optional(),
					colors: z.array(z.string()).optional(),
					pageUrl: z.string().optional(),
					humanLanguage: z.string().optional(),
					tags: z.array(DiffbotTagSchema).optional(),
					diffbotUri: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type GetProductResponse = z.infer<typeof GetProductResponseSchema>;

// 2.3 Analyze (Auto-detect page type)
export const GetAnalyzeInputSchema = z.object({
	url: z
		.string()
		.describe('The URL to analyze — Diffbot auto-detects the page type'),
	fields: z
		.string()
		.optional()
		.describe('Comma-separated list of optional fields'),
	timeout: z.number().optional().describe('Timeout in milliseconds'),
	fallback: z
		.string()
		.optional()
		.describe(
			'API to fall back to if page type cannot be detected (e.g. "article")',
		),
	discussion: z
		.enum(['false', 'true'])
		.optional()
		.describe('Set to "false" to disable comment extraction'),
});
export type GetAnalyzeInput = z.infer<typeof GetAnalyzeInputSchema>;

export const GetAnalyzeResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		type: z
			.string()
			.optional()
			.describe('Detected page type (article, product, discussion, etc.)'),
		humanLanguage: z.string().optional(),
		title: z.string().optional(),
		objects: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type GetAnalyzeResponse = z.infer<typeof GetAnalyzeResponseSchema>;

// 2.4 Get Image Data
export const GetImageInputSchema = z.object({
	url: z.string().describe('The URL of the page or image to extract'),
	fields: z.string().optional().describe('Optional fields to return'),
	timeout: z.number().optional().describe('Timeout in milliseconds'),
});
export type GetImageInput = z.infer<typeof GetImageInputSchema>;

export const GetImageResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		objects: z.array(
			z
				.object({
					type: z.literal('image').optional(),
					url: z.string().optional(),
					title: z.string().optional(),
					naturalHeight: z.number().optional(),
					naturalWidth: z.number().optional(),
					width: z.number().optional(),
					height: z.number().optional(),
					primary: z.boolean().optional(),
					xpath: z.string().optional(),
					attrTitle: z.string().optional(),
					attrAlt: z.string().optional(),
					caption: z.string().optional(),
					pageUrl: z.string().optional(),
					humanLanguage: z.string().optional(),
					diffbotUri: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type GetImageResponse = z.infer<typeof GetImageResponseSchema>;

// 2.5 Get Video Data
export const GetVideoInputSchema = z.object({
	url: z.string().describe('The URL of the video page to extract'),
	fields: z.string().optional().describe('Optional fields to return'),
	timeout: z.number().optional().describe('Timeout in milliseconds'),
});
export type GetVideoInput = z.infer<typeof GetVideoInputSchema>;

export const GetVideoResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		objects: z.array(
			z
				.object({
					type: z.literal('video').optional(),
					url: z.string().optional(),
					title: z.string().optional(),
					naturalHeight: z.number().optional(),
					naturalWidth: z.number().optional(),
					duration: z.number().optional(),
					viewCount: z.number().optional(),
					uploadDate: z.string().optional(),
					author: z.string().optional(),
					embedUrl: z.string().optional(),
					html: z.string().optional(),
					pageUrl: z.string().optional(),
					humanLanguage: z.string().optional(),
					diffbotUri: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type GetVideoResponse = z.infer<typeof GetVideoResponseSchema>;

// 2.6 Get Discussion Thread
export const GetDiscussionInputSchema = z.object({
	url: z.string().describe('The URL of the discussion / forum / comment page'),
	fields: z.string().optional().describe('Optional fields to return'),
	timeout: z.number().optional().describe('Timeout in milliseconds'),
	maxTags: z.number().optional().describe('Max tags to return'),
});
export type GetDiscussionInput = z.infer<typeof GetDiscussionInputSchema>;

export const GetDiscussionResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		objects: z.array(
			z
				.object({
					type: z.literal('discussion').optional(),
					title: z.string().optional(),
					text: z.string().optional(),
					numPosts: z.number().optional(),
					numParticipants: z.number().optional(),
					participants: z.array(z.string()).optional(),
					rssUrl: z.string().optional(),
					posts: z.array(z.record(z.string(), z.unknown())).optional(),
					pageUrl: z.string().optional(),
					humanLanguage: z.string().optional(),
					diffbotUri: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type GetDiscussionResponse = z.infer<typeof GetDiscussionResponseSchema>;

// 2.7 Get Event Data
export const GetEventInputSchema = z.object({
	url: z.string().describe('The URL of the event page to extract'),
	fields: z.string().optional().describe('Optional fields to return'),
	timeout: z.number().optional().describe('Timeout in milliseconds'),
});
export type GetEventInput = z.infer<typeof GetEventInputSchema>;

export const GetEventResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		objects: z.array(
			z
				.object({
					type: z.literal('event').optional(),
					title: z.string().optional(),
					description: z.string().optional(),
					startDate: z.string().optional(),
					endDate: z.string().optional(),
					location: z.string().optional(),
					venue: z.record(z.string(), z.unknown()).optional(),
					organizer: z.string().optional(),
					ticketUrl: z.string().optional(),
					pageUrl: z.string().optional(),
					humanLanguage: z.string().optional(),
					diffbotUri: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type GetEventResponse = z.infer<typeof GetEventResponseSchema>;

// 2.8 Extract List
export const ExtractListInputSchema = z.object({
	url: z.string().describe('The URL of the list / directory / index page'),
	fields: z.string().optional().describe('Optional fields to return'),
	timeout: z.number().optional().describe('Timeout in milliseconds'),
});
export type ExtractListInput = z.infer<typeof ExtractListInputSchema>;

export const ExtractListResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		objects: z.array(
			z
				.object({
					type: z.literal('list').optional(),
					title: z.string().optional(),
					numItems: z.number().optional(),
					items: z.array(z.record(z.string(), z.unknown())).optional(),
					pageUrl: z.string().optional(),
					humanLanguage: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type ExtractListResponse = z.infer<typeof ExtractListResponseSchema>;

// 2.9 Extract Job
export const ExtractJobInputSchema = z.object({
	url: z.string().describe('The URL of the job posting page'),
	fields: z.string().optional().describe('Optional fields to return'),
	timeout: z.number().optional().describe('Timeout in milliseconds'),
});
export type ExtractJobInput = z.infer<typeof ExtractJobInputSchema>;

export const ExtractJobResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		objects: z.array(
			z
				.object({
					type: z.literal('job').optional(),
					title: z.string().optional(),
					description: z.string().optional(),
					company: z.record(z.string(), z.unknown()).optional(),
					locations: z.array(z.string()).optional(),
					employmentType: z.string().optional(),
					compensation: z.record(z.string(), z.unknown()).optional(),
					requirements: z.array(z.string()).optional(),
					skills: z.array(z.string()).optional(),
					postedDate: z.string().optional(),
					pageUrl: z.string().optional(),
					humanLanguage: z.string().optional(),
					diffbotUri: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export type ExtractJobResponse = z.infer<typeof ExtractJobResponseSchema>;

// ---------------------------------------------------------------------------
// 3. Search / DQL APIs (2 operations)
// ---------------------------------------------------------------------------

// 3.1 Diffbot Knowledge Graph Search (DIFFBOT_SEARCH)
export const SearchInputSchema = z.object({
	query: z
		.string()
		.describe('DQL query string (e.g. "type:Organization name:\\"OpenAI\\"")'),
	entityType: z
		.string()
		.optional()
		.describe('Entity type filter prepended to query (e.g. "Organization")'),
	queryType: z
		.enum(['query', 'text', 'queryTextFallback', 'crawl'])
		.optional()
		.describe('Execution mode for the DQL request'),
	size: z.number().optional().describe('Number of results to return'),
	from: z.number().optional().describe('Zero-indexed offset for pagination'),
	col: z.string().optional().describe('Crawl collection name to query'),
});
export type SearchInput = z.infer<typeof SearchInputSchema>;

export const SearchResponseSchema = z
	.object({
		version: z.number().optional(),
		hits: z.number().optional(),
		results: z.number().optional(),
		kgversion: z.string().optional(),
		diffbot_type: z.string().optional(),
		facet: z.record(z.string(), z.unknown()).optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		cursor: z.string().optional(),
	})
	.passthrough();
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// 3.2 Search Crawl Job Data (DIFFBOT_SEARCH_CRAWL_DATA)
export const SearchCrawlDataInputSchema = z.object({
	col: z.string().describe('The name of the crawl job collection to search'),
	query: z.string().describe('Search query string or DQL filter'),
	num: z
		.number()
		.min(1)
		.max(25)
		.optional()
		.describe('Number of results to return (max 25)'),
	start: z.number().optional().describe('Zero-indexed offset for pagination'),
});
export type SearchCrawlDataInput = z.infer<typeof SearchCrawlDataInputSchema>;

export const SearchCrawlDataResponseSchema = z
	.object({
		request: DiffbotRequestMetaSchema,
		results: z.array(z.record(z.string(), z.unknown())).optional(),
		numResults: z.number().optional(),
		hits: z.number().optional(),
	})
	.passthrough();
export type SearchCrawlDataResponse = z.infer<
	typeof SearchCrawlDataResponseSchema
>;

// ---------------------------------------------------------------------------
// 4. Enhance APIs (4 operations)
// ---------------------------------------------------------------------------

// 4.1 Enhance Entity with Knowledge Graph (DIFFBOT_ENHANCE_ENTITY)
export const EnhanceEntityInputSchema = z.object({
	name: z.string().optional().describe('Entity name (person or organization)'),
	type: z
		.string()
		.optional()
		.describe('Entity type filter: "Organization" or "Person"'),
	email: z.string().optional().describe('Email address of the entity'),
	employer: z
		.string()
		.optional()
		.describe('Current employer of a Person entity'),
	url: z
		.string()
		.optional()
		.describe('Homepage or profile URL (e.g. LinkedIn / Website)'),
	phone: z.string().optional().describe('Phone number'),
	location: z.string().optional().describe('Location or address'),
	size: z
		.number()
		.optional()
		.describe('Number of matching entity records to return'),
	refresh: z
		.boolean()
		.optional()
		.describe('Force refresh data from live web sources'),
});
export type EnhanceEntityInput = z.infer<typeof EnhanceEntityInputSchema>;

export const EnhanceEntityResponseSchema = z
	.object({
		version: z.number().optional(),
		hits: z.number().optional(),
		kgversion: z.string().optional(),
		request_ctx: z.record(z.string(), z.unknown()).optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		errors: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type EnhanceEntityResponse = z.infer<typeof EnhanceEntityResponseSchema>;

// 4.2 Combine Entity Profiles (DIFFBOT_COMBINE_ENTITY_PROFILES)
export const CombineEntityProfilesInputSchema = z.object({
	name: z.string().optional().describe('Person name'),
	type: z.string().optional().describe('Entity type (defaults to Person)'),
	email: z.string().optional().describe('Email address'),
	employer: z.string().optional().describe('Employer name or organization'),
	url: z.string().optional().describe('Profile URL or organization homepage'),
});
export type CombineEntityProfilesInput = z.infer<
	typeof CombineEntityProfilesInputSchema
>;

export const CombineEntityProfilesResponseSchema = z
	.object({
		version: z.number().optional(),
		hits: z.number().optional(),
		kgversion: z.string().optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		errors: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type CombineEntityProfilesResponse = z.infer<
	typeof CombineEntityProfilesResponseSchema
>;

// 4.3 Resolve Lost ID (DIFFBOT_RESOLVE_LOST_ID)
export const ResolveLostIdInputSchema = z.object({
	id: z.string().describe('The lost or non-canonical identifier to resolve'),
});
export type ResolveLostIdInput = z.infer<typeof ResolveLostIdInputSchema>;

export const ResolveLostIdResponseSchema = z
	.object({
		id: z.string().optional(),
		canonicalId: z.string().optional(),
		diffbotUri: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
		hits: z.number().optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type ResolveLostIdResponse = z.infer<typeof ResolveLostIdResponseSchema>;

// 4.4 Get KG Coverage Report by ID (DIFFBOT_GET_KG_COVERAGE_REPORT_BY_ID)
export const GetKgCoverageReportByIdInputSchema = z.object({
	reportId: z
		.string()
		.describe('Coverage report ID generated from DQL query or bulk job'),
	bulkjobId: z
		.string()
		.optional()
		.describe('Optional bulkjob ID associated with the report'),
});
export type GetKgCoverageReportByIdInput = z.infer<
	typeof GetKgCoverageReportByIdInputSchema
>;

export const GetKgCoverageReportByIdResponseSchema = z
	.object({
		reportId: z.string().optional(),
		status: z.string().optional(),
		coverage: z.record(z.string(), z.unknown()).optional(),
		data: z.unknown().optional(),
		csv: z.string().optional(),
	})
	.passthrough();
export type GetKgCoverageReportByIdResponse = z.infer<
	typeof GetKgCoverageReportByIdResponseSchema
>;

// ---------------------------------------------------------------------------
// 5. KG Bulk Enhance APIs (8 operations)
// ---------------------------------------------------------------------------

// 5.1 Create Bulk Enhance Job (DIFFBOT_CREATE_KG_BULK_ENHANCE)
export const CreateKgBulkEnhanceInputSchema = z.object({
	entities: z
		.array(
			z
				.object({
					name: z.string().optional(),
					type: z.string().optional(),
					email: z.string().optional(),
					employer: z.string().optional(),
					url: z.string().optional(),
					phone: z.string().optional(),
					location: z.string().optional(),
				})
				.passthrough(),
		)
		.describe('Array of entity objects to enhance'),
	notifyEmail: z
		.string()
		.optional()
		.describe('Email address to notify upon job completion'),
	name: z.string().optional().describe('Custom name for the bulk job'),
});
export type CreateKgBulkEnhanceInput = z.infer<
	typeof CreateKgBulkEnhanceInputSchema
>;

export const CreateKgBulkEnhanceResponseSchema = z
	.object({
		bulkjobId: z.string().optional(),
		job_id: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type CreateKgBulkEnhanceResponse = z.infer<
	typeof CreateKgBulkEnhanceResponseSchema
>;

// 5.2 Get Bulk Job Status (DIFFBOT_GET_BULK_JOB_STATUS)
export const GetBulkJobStatusInputSchema = z.object({
	bulkjobId: z.string().describe('The ID of the bulk enhance job to check'),
});
export type GetBulkJobStatusInput = z.infer<typeof GetBulkJobStatusInputSchema>;

export const GetBulkJobStatusResponseSchema = z
	.object({
		bulkjobId: z.string().optional(),
		status: z.string().optional(),
		jobStatus: z.record(z.string(), z.unknown()).optional(),
		total: z.number().optional(),
		completed: z.number().optional(),
		failed: z.number().optional(),
		progress: z.number().optional(),
	})
	.passthrough();
export type GetBulkJobStatusResponse = z.infer<
	typeof GetBulkJobStatusResponseSchema
>;

// 5.3 List Bulk Jobs Status For Token (DIFFBOT_LIST_BULK_JOBS_STATUS_FOR_TOKEN)
export const ListBulkJobsStatusForTokenInputSchema = z.object({});
export type ListBulkJobsStatusForTokenInput = z.infer<
	typeof ListBulkJobsStatusForTokenInputSchema
>;

export const ListBulkJobsStatusForTokenResponseSchema = z
	.object({
		jobs: z.array(z.record(z.string(), z.unknown())).optional(),
		bulkjobs: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type ListBulkJobsStatusForTokenResponse = z.infer<
	typeof ListBulkJobsStatusForTokenResponseSchema
>;

// 5.4 Get Bulk Job Results (DIFFBOT_GET_BULK_RESULTS)
export const GetBulkResultsInputSchema = z.object({
	bulkjobId: z.string().describe('The ID of the bulk enhance job to download'),
	format: z
		.enum(['json', 'jsonl', 'csv', 'xls', 'xlsx'])
		.optional()
		.describe('Download output format (default jsonl)'),
	head: z
		.number()
		.optional()
		.describe('Preview only the first N results from the job'),
});
export type GetBulkResultsInput = z.infer<typeof GetBulkResultsInputSchema>;

export const GetBulkResultsResponseSchema = z
	.object({
		bulkjobId: z.string().optional(),
		status: z.string().optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		raw: z.string().optional(),
	})
	.passthrough();
export type GetBulkResultsResponse = z.infer<
	typeof GetBulkResultsResponseSchema
>;

// 5.5 Download Bulk Job Results (DIFFBOT_DOWNLOAD_BULK_RESULTS)
export const DownloadBulkResultsInputSchema = z.object({
	bulkjobId: z.string().describe('The ID of the bulk enhance job to download'),
	format: z
		.enum(['json', 'jsonl', 'csv', 'xls', 'xlsx'])
		.optional()
		.describe('Export format'),
	filter: z
		.string()
		.optional()
		.describe('DQL filter criteria to apply to the output'),
	fields: z
		.string()
		.optional()
		.describe('Comma-separated list of fields to include'),
	head: z.number().optional().describe('Number of records to export'),
});
export type DownloadBulkResultsInput = z.infer<
	typeof DownloadBulkResultsInputSchema
>;

export const DownloadBulkResultsResponseSchema = z
	.object({
		bulkjobId: z.string().optional(),
		status: z.string().optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		raw: z.string().optional(),
	})
	.passthrough();
export type DownloadBulkResultsResponse = z.infer<
	typeof DownloadBulkResultsResponseSchema
>;

// 5.6 Get Bulk Single Result (DIFFBOT_GET_BULK_SINGLE_RESULT)
export const GetBulkSingleResultInputSchema = z.object({
	bulkjobId: z.string().describe('The bulk enhance job ID'),
	jobIndex: z
		.number()
		.describe('Zero-indexed position of the entity record within the bulk job'),
});
export type GetBulkSingleResultInput = z.infer<
	typeof GetBulkSingleResultInputSchema
>;

export const GetBulkSingleResultResponseSchema = z
	.object({
		bulkjobId: z.string().optional(),
		jobIndex: z.number().optional(),
		data: z.record(z.string(), z.unknown()).optional(),
		entity: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type GetBulkSingleResultResponse = z.infer<
	typeof GetBulkSingleResultResponseSchema
>;

// 5.7 Stop KG Bulk Job By ID (DIFFBOT_STOP_KG_BULK_JOB_BY_ID)
export const StopKgBulkJobByIdInputSchema = z.object({
	bulkjobId: z
		.string()
		.describe('The ID of the bulk enhance job to pause/stop'),
});
export type StopKgBulkJobByIdInput = z.infer<
	typeof StopKgBulkJobByIdInputSchema
>;

export const StopKgBulkJobByIdResponseSchema = z
	.object({
		bulkjobId: z.string().optional(),
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type StopKgBulkJobByIdResponse = z.infer<
	typeof StopKgBulkJobByIdResponseSchema
>;

// 5.8 Delete KG Enhance Bulkjob (DIFFBOT_DELETE_KG_ENHANCE_BULKJOB)
export const DeleteKgEnhanceBulkjobInputSchema = z.object({
	bulkjobId: z.string().describe('The ID of the bulk enhance job to delete'),
});
export type DeleteKgEnhanceBulkjobInput = z.infer<
	typeof DeleteKgEnhanceBulkjobInputSchema
>;

export const DeleteKgEnhanceBulkjobResponseSchema = z
	.object({
		bulkjobId: z.string().optional(),
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type DeleteKgEnhanceBulkjobResponse = z.infer<
	typeof DeleteKgEnhanceBulkjobResponseSchema
>;

// ---------------------------------------------------------------------------
// 6. Bulk Extract APIs (5 operations)
// ---------------------------------------------------------------------------

// 6.1 Create Bulk Extract Job (DIFFBOT_CREATE_BULK)
export const CreateBulkInputSchema = z.object({
	name: z.string().describe('Name of the bulk job (unique per token)'),
	apiUrl: z
		.string()
		.describe(
			'Full Diffbot Extract API URL (e.g. "https://api.diffbot.com/v3/article")',
		),
	urls: z
		.array(z.string())
		.describe('Array of URLs to process with the Extract API'),
	notifyEmail: z
		.string()
		.optional()
		.describe('Email to notify when processing is completed'),
	maxRounds: z.number().optional().describe('Max rounds of URL processing'),
});
export type CreateBulkInput = z.infer<typeof CreateBulkInputSchema>;

export const CreateBulkResponseSchema = z
	.object({
		response: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type CreateBulkResponse = z.infer<typeof CreateBulkResponseSchema>;

// 6.2 Start Bulk Job (DIFFBOT_START_BULK)
export const StartBulkInputSchema = z.object({
	name: z.string().describe('Unique name for the bulk extract job'),
	apiUrl: z.string().describe('Full Diffbot Extract API URL'),
	urls: z
		.string()
		.describe('Comma-separated or space-separated list of URLs to process'),
	notifyEmail: z.string().optional().describe('Notification email address'),
	maxRounds: z.number().optional().describe('Max rounds of URL processing'),
});
export type StartBulkInput = z.infer<typeof StartBulkInputSchema>;

export const StartBulkResponseSchema = z
	.object({
		response: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type StartBulkResponse = z.infer<typeof StartBulkResponseSchema>;

// 6.3 Stop Bulk Job (DIFFBOT_STOP_BULK_JOB)
export const StopBulkJobInputSchema = z.object({
	name: z.string().describe('The name of the bulk extract job to pause/stop'),
});
export type StopBulkJobInput = z.infer<typeof StopBulkJobInputSchema>;

export const StopBulkJobResponseSchema = z
	.object({
		response: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type StopBulkJobResponse = z.infer<typeof StopBulkJobResponseSchema>;

// 6.4 Get Bulk Job Data (DIFFBOT_GET_BULK_DATA)
export const GetBulkDataInputSchema = z.object({
	name: z.string().describe('The name of the completed bulk job to download'),
	format: z
		.enum(['json', 'csv'])
		.optional()
		.describe('Download format (default json)'),
});
export type GetBulkDataInput = z.infer<typeof GetBulkDataInputSchema>;

export const GetBulkDataResponseSchema = z
	.object({
		name: z.string().optional(),
		data: z.unknown().optional(),
	})
	.passthrough();
export type GetBulkDataResponse = z.infer<typeof GetBulkDataResponseSchema>;

// 6.5 List Bulk Jobs (DIFFBOT_LIST_BULK_JOBS)
export const ListBulkJobsInputSchema = z.object({});
export type ListBulkJobsInput = z.infer<typeof ListBulkJobsInputSchema>;

export const ListBulkJobsResponseSchema = z
	.object({
		jobs: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type ListBulkJobsResponse = z.infer<typeof ListBulkJobsResponseSchema>;

// ---------------------------------------------------------------------------
// 7. Crawl APIs (3 operations)
// ---------------------------------------------------------------------------

// 7.1 Start Crawl Job (DIFFBOT_START_CRAWL)
export const StartCrawlInputSchema = z.object({
	name: z.string().describe('Unique name for the crawl job'),
	seeds: z
		.string()
		.describe('Space-separated seed URL(s) from which the crawl begins'),
	apiUrl: z
		.string()
		.describe(
			'Full Diffbot Extract API URL used to process pages (e.g. "https://api.diffbot.com/v3/article")',
		),
	maxHops: z
		.number()
		.optional()
		.describe(
			'Max depth of links to crawl from seeds (default -1 for no limit)',
		),
	maxRounds: z
		.number()
		.optional()
		.describe('Max rounds of repeat crawling for recurring crawls'),
	maxTags: z.number().optional().describe('Max tags to extract per page'),
	crawlSubdomains: z
		.number()
		.optional()
		.describe('Set to 1 to crawl subdomains of seeds'),
	notifyEmail: z
		.string()
		.optional()
		.describe('Email notification upon crawl completion'),
});
export type StartCrawlInput = z.infer<typeof StartCrawlInputSchema>;

export const StartCrawlResponseSchema = z
	.object({
		response: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type StartCrawlResponse = z.infer<typeof StartCrawlResponseSchema>;

// 7.2 Manage Crawl Job (DIFFBOT_MANAGE_CRAWL)
export const ManageCrawlInputSchema = z.object({
	name: z
		.string()
		.optional()
		.describe('The name of the crawl job to inspect or modify'),
	pause: z
		.number()
		.optional()
		.describe('Set to 1 to pause an active crawl job, 0 to resume'),
	restart: z
		.number()
		.optional()
		.describe('Set to 1 to restart a completed/paused crawl job'),
	delete: z
		.number()
		.optional()
		.describe('Set to 1 to delete a crawl job and its data'),
	roundProxy: z
		.number()
		.optional()
		.describe('Set to 1 to rotate proxy IP on each round'),
	maxRounds: z.number().optional().describe('Update max rounds'),
	maxHops: z.number().optional().describe('Update max hops'),
});
export type ManageCrawlInput = z.infer<typeof ManageCrawlInputSchema>;

export const ManageCrawlResponseSchema = z
	.object({
		jobs: z.array(z.record(z.string(), z.unknown())).optional(),
		response: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type ManageCrawlResponse = z.infer<typeof ManageCrawlResponseSchema>;

// 7.3 Get Crawl Data (DIFFBOT_GET_CRAWL_DATA)
export const GetCrawlDataInputSchema = z.object({
	name: z.string().describe('The name of the completed crawl job to download'),
	format: z
		.enum(['json', 'csv'])
		.optional()
		.describe('Download format (default json)'),
});
export type GetCrawlDataInput = z.infer<typeof GetCrawlDataInputSchema>;

export const GetCrawlDataResponseSchema = z
	.object({
		name: z.string().optional(),
		data: z.unknown().optional(),
	})
	.passthrough();
export type GetCrawlDataResponse = z.infer<typeof GetCrawlDataResponseSchema>;

// ---------------------------------------------------------------------------
// 8. Custom API (3 operations)
// ---------------------------------------------------------------------------

// 8.1 Create or Update Custom API (DIFFBOT_CREATE_CUSTOM_API)
export const CreateCustomApiInputSchema = z.object({
	api: z
		.string()
		.describe('Name of the custom API (e.g. "myCustomArticleApi")'),
	url: z.string().describe('Sample URL that this custom API applies to'),
	pattern: z
		.string()
		.optional()
		.describe('URL regex pattern to match pages for this custom API'),
	rules: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Extraction rules and CSS selector definitions'),
});
export type CreateCustomApiInput = z.infer<typeof CreateCustomApiInputSchema>;

export const CreateCustomApiResponseSchema = z
	.object({
		response: z.string().optional(),
		api: z.string().optional(),
		url: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type CreateCustomApiResponse = z.infer<
	typeof CreateCustomApiResponseSchema
>;

// 8.2 List Custom APIs (DIFFBOT_LIST_CUSTOM_APIS)
export const ListCustomApisInputSchema = z.object({});
export type ListCustomApisInput = z.infer<typeof ListCustomApisInputSchema>;

export const ListCustomApisResponseSchema = z
	.object({
		customApis: z.array(z.record(z.string(), z.unknown())).optional(),
		apis: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type ListCustomApisResponse = z.infer<
	typeof ListCustomApisResponseSchema
>;

// 8.3 Delete Custom API (DIFFBOT_DELETE_CUSTOM_API)
export const DeleteCustomApiInputSchema = z.object({
	api: z.string().describe('Name of the custom API to delete'),
	url: z
		.string()
		.optional()
		.describe('URL pattern or test URL of the custom API'),
});
export type DeleteCustomApiInput = z.infer<typeof DeleteCustomApiInputSchema>;

export const DeleteCustomApiResponseSchema = z
	.object({
		response: z.string().optional(),
		api: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type DeleteCustomApiResponse = z.infer<
	typeof DeleteCustomApiResponseSchema
>;

// ---------------------------------------------------------------------------
// Aggregated type maps (35 operations keyed by camelCase endpoint name)
// ---------------------------------------------------------------------------

export type DiffbotEndpointInputs = {
	// Account
	getAccount: GetAccountInput;

	// Extract
	getArticle: GetArticleInput;
	getProduct: GetProductInput;
	getAnalyze: GetAnalyzeInput;
	getImage: GetImageInput;
	getVideo: GetVideoInput;
	getDiscussion: GetDiscussionInput;
	getEvent: GetEventInput;
	extractList: ExtractListInput;
	extractJob: ExtractJobInput;

	// Search
	search: SearchInput;
	searchCrawlData: SearchCrawlDataInput;

	// Enhance
	enhanceEntity: EnhanceEntityInput;
	combineEntityProfiles: CombineEntityProfilesInput;
	resolveLostId: ResolveLostIdInput;
	getKgCoverageReportById: GetKgCoverageReportByIdInput;

	// KG Bulk Enhance
	createKgBulkEnhance: CreateKgBulkEnhanceInput;
	getBulkJobStatus: GetBulkJobStatusInput;
	listBulkJobsStatusForToken: ListBulkJobsStatusForTokenInput;
	getBulkResults: GetBulkResultsInput;
	downloadBulkResults: DownloadBulkResultsInput;
	getBulkSingleResult: GetBulkSingleResultInput;
	stopKgBulkJobById: StopKgBulkJobByIdInput;
	deleteKgEnhanceBulkjob: DeleteKgEnhanceBulkjobInput;

	// Bulk Extract
	createBulk: CreateBulkInput;
	startBulk: StartBulkInput;
	stopBulkJob: StopBulkJobInput;
	getBulkData: GetBulkDataInput;
	listBulkJobs: ListBulkJobsInput;

	// Crawl
	startCrawl: StartCrawlInput;
	manageCrawl: ManageCrawlInput;
	getCrawlData: GetCrawlDataInput;

	// Custom API
	createCustomApi: CreateCustomApiInput;
	listCustomApis: ListCustomApisInput;
	deleteCustomApi: DeleteCustomApiInput;
};

export type DiffbotEndpointOutputs = {
	// Account
	getAccount: GetAccountResponse;

	// Extract
	getArticle: GetArticleResponse;
	getProduct: GetProductResponse;
	getAnalyze: GetAnalyzeResponse;
	getImage: GetImageResponse;
	getVideo: GetVideoResponse;
	getDiscussion: GetDiscussionResponse;
	getEvent: GetEventResponse;
	extractList: ExtractListResponse;
	extractJob: ExtractJobResponse;

	// Search
	search: SearchResponse;
	searchCrawlData: SearchCrawlDataResponse;

	// Enhance
	enhanceEntity: EnhanceEntityResponse;
	combineEntityProfiles: CombineEntityProfilesResponse;
	resolveLostId: ResolveLostIdResponse;
	getKgCoverageReportById: GetKgCoverageReportByIdResponse;

	// KG Bulk Enhance
	createKgBulkEnhance: CreateKgBulkEnhanceResponse;
	getBulkJobStatus: GetBulkJobStatusResponse;
	listBulkJobsStatusForToken: ListBulkJobsStatusForTokenResponse;
	getBulkResults: GetBulkResultsResponse;
	downloadBulkResults: DownloadBulkResultsResponse;
	getBulkSingleResult: GetBulkSingleResultResponse;
	stopKgBulkJobById: StopKgBulkJobByIdResponse;
	deleteKgEnhanceBulkjob: DeleteKgEnhanceBulkjobResponse;

	// Bulk Extract
	createBulk: CreateBulkResponse;
	startBulk: StartBulkResponse;
	stopBulkJob: StopBulkJobResponse;
	getBulkData: GetBulkDataResponse;
	listBulkJobs: ListBulkJobsResponse;

	// Crawl
	startCrawl: StartCrawlResponse;
	manageCrawl: ManageCrawlResponse;
	getCrawlData: GetCrawlDataResponse;

	// Custom API
	createCustomApi: CreateCustomApiResponse;
	listCustomApis: ListCustomApisResponse;
	deleteCustomApi: DeleteCustomApiResponse;
};

export const DiffbotEndpointInputSchemas = {
	getAccount: GetAccountInputSchema,
	getArticle: GetArticleInputSchema,
	getProduct: GetProductInputSchema,
	getAnalyze: GetAnalyzeInputSchema,
	getImage: GetImageInputSchema,
	getVideo: GetVideoInputSchema,
	getDiscussion: GetDiscussionInputSchema,
	getEvent: GetEventInputSchema,
	extractList: ExtractListInputSchema,
	extractJob: ExtractJobInputSchema,
	search: SearchInputSchema,
	searchCrawlData: SearchCrawlDataInputSchema,
	enhanceEntity: EnhanceEntityInputSchema,
	combineEntityProfiles: CombineEntityProfilesInputSchema,
	resolveLostId: ResolveLostIdInputSchema,
	getKgCoverageReportById: GetKgCoverageReportByIdInputSchema,
	createKgBulkEnhance: CreateKgBulkEnhanceInputSchema,
	getBulkJobStatus: GetBulkJobStatusInputSchema,
	listBulkJobsStatusForToken: ListBulkJobsStatusForTokenInputSchema,
	getBulkResults: GetBulkResultsInputSchema,
	downloadBulkResults: DownloadBulkResultsInputSchema,
	getBulkSingleResult: GetBulkSingleResultInputSchema,
	stopKgBulkJobById: StopKgBulkJobByIdInputSchema,
	deleteKgEnhanceBulkjob: DeleteKgEnhanceBulkjobInputSchema,
	createBulk: CreateBulkInputSchema,
	startBulk: StartBulkInputSchema,
	stopBulkJob: StopBulkJobInputSchema,
	getBulkData: GetBulkDataInputSchema,
	listBulkJobs: ListBulkJobsInputSchema,
	startCrawl: StartCrawlInputSchema,
	manageCrawl: ManageCrawlInputSchema,
	getCrawlData: GetCrawlDataInputSchema,
	createCustomApi: CreateCustomApiInputSchema,
	listCustomApis: ListCustomApisInputSchema,
	deleteCustomApi: DeleteCustomApiInputSchema,
} as const;

export const DiffbotEndpointOutputSchemas = {
	getAccount: GetAccountResponseSchema,
	getArticle: GetArticleResponseSchema,
	getProduct: GetProductResponseSchema,
	getAnalyze: GetAnalyzeResponseSchema,
	getImage: GetImageResponseSchema,
	getVideo: GetVideoResponseSchema,
	getDiscussion: GetDiscussionResponseSchema,
	getEvent: GetEventResponseSchema,
	extractList: ExtractListResponseSchema,
	extractJob: ExtractJobResponseSchema,
	search: SearchResponseSchema,
	searchCrawlData: SearchCrawlDataResponseSchema,
	enhanceEntity: EnhanceEntityResponseSchema,
	combineEntityProfiles: CombineEntityProfilesResponseSchema,
	resolveLostId: ResolveLostIdResponseSchema,
	getKgCoverageReportById: GetKgCoverageReportByIdResponseSchema,
	createKgBulkEnhance: CreateKgBulkEnhanceResponseSchema,
	getBulkJobStatus: GetBulkJobStatusResponseSchema,
	listBulkJobsStatusForToken: ListBulkJobsStatusForTokenResponseSchema,
	getBulkResults: GetBulkResultsResponseSchema,
	downloadBulkResults: DownloadBulkResultsResponseSchema,
	getBulkSingleResult: GetBulkSingleResultResponseSchema,
	stopKgBulkJobById: StopKgBulkJobByIdResponseSchema,
	deleteKgEnhanceBulkjob: DeleteKgEnhanceBulkjobResponseSchema,
	createBulk: CreateBulkResponseSchema,
	startBulk: StartBulkResponseSchema,
	stopBulkJob: StopBulkJobResponseSchema,
	getBulkData: GetBulkDataResponseSchema,
	listBulkJobs: ListBulkJobsResponseSchema,
	startCrawl: StartCrawlResponseSchema,
	manageCrawl: ManageCrawlResponseSchema,
	getCrawlData: GetCrawlDataResponseSchema,
	createCustomApi: CreateCustomApiResponseSchema,
	listCustomApis: ListCustomApisResponseSchema,
	deleteCustomApi: DeleteCustomApiResponseSchema,
} as const;
