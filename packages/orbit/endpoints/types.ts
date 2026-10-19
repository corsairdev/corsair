import { z } from 'zod';

const ProfileDepth = z.enum(['partial', 'full']);
const EnrichOperation = z.enum(['partial', 'full', 'regenerate']);
const WatcherPhase = z.enum([
	'existing_sources',
	'existing_socials',
	'new_sources',
]);
const WebhookEvent = z.enum([
	'profile.updated',
	'company.thesis.changed',
	'company.alert',
	'portfolio.changed',
	'search.profile.updated',
	'search.completed',
]);

const FaceBox = z.array(z.number().min(0)).length(4);

const FaceSource = z
	.object({
		image_url: z.string().min(1),
		bbox: FaceBox.optional(),
	})
	.strict();

const IdentitySignals = z
	.object({
		address: z.string().min(1).optional(),
		email: z.string().email().optional(),
		phone: z.string().min(1).optional(),
		linkedin_url: z.string().url().optional(),
		urls: z.array(z.string().url()).optional(),
		usernames: z.array(z.string().min(1)).optional(),
		face_source: FaceSource.optional(),
	})
	.strict()
	.refine((value) => Object.values(value).some((item) => item !== undefined), {
		message: 'signals needs at least one field',
	});

const StructuredIntent = z
	.object({
		names: z.array(z.string().min(1)).optional(),
		experiences: z.array(z.looseObject({})).optional(),
		semanticClauses: z.array(z.looseObject({})).optional(),
		schools: z.array(z.looseObject({})).optional(),
		geo: z.looseObject({}).nullable().optional(),
		demographics: z.looseObject({}).nullable().optional(),
		personalization: z.looseObject({}).nullable().optional(),
	})
	.strict()
	.refine((value) => Object.values(value).some((item) => item !== undefined), {
		message: 'intent needs at least one field',
	});

const Population = z
	.object({
		kind: z.enum(['company', 'school']),
		id: z.string().min(1),
		name: z.string().min(1).max(200),
	})
	.strict();

export const StartSearchInput = z
	.object({
		request_id: z.string().min(1).optional(),
		query: z.string().min(1).optional(),
		intent: StructuredIntent.optional(),
		signals: IdentitySignals.optional(),
		candidate_discovery: z.boolean().optional(),
		candidate_discovery_limit: z.number().int().min(1).max(50).optional(),
		profile_depth: ProfileDepth.optional(),
		include_profile: z.boolean().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		webhooks: z.boolean().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		if (!value.query && !value.intent && !value.signals) {
			context.addIssue({
				code: 'custom',
				message: 'query, intent, or signals is required',
			});
		}
		if (
			value.candidate_discovery_limit !== undefined &&
			value.candidate_discovery !== true
		) {
			context.addIssue({
				code: 'custom',
				message: 'candidate_discovery_limit requires candidate_discovery',
			});
		}
	});
export const QuotePopulationInput = z
	.object({
		population: Population,
		size: z.number().int().min(0).nullable().optional(),
		profile_depth: ProfileDepth.optional(),
	})
	.strict();
export const StartPopulationInput = QuotePopulationInput.extend({
	request_id: z.string().max(200).optional(),
});
export const GetSearchInput = z
	.object({ search_id: z.string().min(1) })
	.strict();

export const ReadProfileInput = z
	.object({
		profile_id: z.string().min(1),
		format: z.enum(['json', 'markdown']).optional(),
		idempotencyKey: z.string().max(200).optional(),
	})
	.strict();
export const EnrichProfileInput = z
	.object({
		profile_id: z.string().min(1),
		operation: EnrichOperation,
		request_id: z.string().min(1).optional(),
		include_profile: z.boolean().optional(),
		idempotencyKey: z.string().max(200).optional(),
	})
	.strict();
export const GetEnrichInput = z
	.object({ request_id: z.string().min(1) })
	.strict();
export const BatchEnrichInput = z
	.object({
		profile_ids: z.array(z.string().min(1)).min(1).max(20),
		operation: EnrichOperation,
		request_id: z.string().min(1).optional(),
		include_profile: z.boolean().optional(),
	})
	.strict();

const BulkItem = z
	.object({
		query: z.string().min(1).optional(),
		intent: StructuredIntent.optional(),
		signals: IdentitySignals.optional(),
		candidate_discovery: z.boolean().optional(),
		candidate_discovery_limit: z.number().int().min(1).max(50).optional(),
		profile_depth: ProfileDepth.optional(),
		include_profile: z.boolean().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		if (!value.query && !value.intent && !value.signals) {
			context.addIssue({
				code: 'custom',
				message: 'each bulk item needs query, intent, or signals',
			});
		}
		if (value.signals && 'face_source' in value.signals) {
			context.addIssue({
				code: 'custom',
				message: 'bulk items cannot include face_source',
			});
		}
	});

export const SubmitBulkInput = z
	.object({
		request_id: z.string().min(1).max(128),
		items: z.array(BulkItem).min(1).max(5000),
	})
	.strict();
export const BulkJobInput = z.object({ job_id: z.string().uuid() }).strict();
export const BulkResultsInput = z
	.object({
		job_id: z.string().uuid(),
		offset: z.number().int().min(0).max(5000).optional(),
	})
	.strict();

export const DetectFacesInput = z
	.object({
		imageBase64: z.string().min(1),
		contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']).optional(),
	})
	.strict();
export const FaceIndexInput = FaceSource;

export const CreateWatcherInput = z
	.object({
		orbit_id: z.string().uuid(),
		interval_seconds: z.number().int().min(3600).max(2_592_000),
		phases: z.array(WatcherPhase).nullable().optional(),
	})
	.strict();
export const UpdateWatcherInput = z
	.object({
		watcher_id: z.string().uuid(),
		enabled: z.boolean().optional(),
		interval_seconds: z.number().int().min(3600).max(2_592_000).optional(),
		phases: z.array(WatcherPhase).nullable().optional(),
	})
	.strict();
export const WatcherIdInput = z
	.object({ watcher_id: z.string().uuid() })
	.strict();
export const WatcherRunsInput = z
	.object({
		watcher_id: z.string().uuid(),
		limit: z.number().int().min(1).max(200).optional(),
	})
	.strict();

export const CreateWebhookInput = z
	.object({
		url: z.string().url(),
		event_types: z.array(WebhookEvent).optional(),
		description: z.string().optional(),
	})
	.strict();
export const WebhookIdInput = z
	.object({ webhook_id: z.string().uuid() })
	.strict();
export const TestWebhookInput = z
	.object({
		webhook_id: z.string().uuid(),
		event_type: WebhookEvent.optional(),
	})
	.strict();

const SearchStatus = z.enum([
	'running',
	'completed',
	'completed_with_errors',
	'failed',
]);
const EnrichStatus = z.enum(['running', 'completed', 'failed']);
const BulkStatus = z.enum([
	'queued',
	'running',
	'waiting_for_credits',
	'needs_attention',
	'completed',
	'completed_with_errors',
	'canceled',
]);

export const SearchSnapshot = z.looseObject({
	search_id: z.string(),
	status: SearchStatus,
	request_id: z.string().optional(),
	updated_at: z.string().optional(),
	billing: z.looseObject({}).optional(),
	results: z.array(z.looseObject({})).optional(),
});
export const PopulationQuote = z.looseObject({
	credits: z.number().optional(),
});
export const ProfileRead = z.looseObject({
	profile_id: z.string().optional(),
	id: z.string().optional(),
});
export const EnrichSnapshot = z.looseObject({
	request_id: z.string(),
	profile_id: z.string().optional(),
	status: EnrichStatus,
	billing: z.looseObject({}).optional(),
});
export const BatchEnrichSnapshot = z.looseObject({
	request_id: z.string().optional(),
	status: z.string().optional(),
});
export const BulkJob = z.looseObject({
	job_id: z.string(),
	status: BulkStatus,
	request_id: z.string().optional(),
	updated_at: z.string().optional(),
	billing: z.looseObject({}).optional(),
});
export const BulkResults = z.looseObject({
	job_id: z.string().optional(),
	results: z.array(z.looseObject({})).optional(),
});
export const FaceDetection = z.looseObject({
	image_url: z.string(),
	faces: z.array(z.looseObject({})),
});
export const FaceIndexSearch = z.looseObject({
	matches: z.array(z.looseObject({})),
});
export const Watcher = z.looseObject({
	id: z.string(),
	orbit_id: z.string().optional(),
	enabled: z.boolean().optional(),
});
export const WatcherList = z.looseObject({
	watchers: z.array(Watcher).optional(),
});
export const WatcherRuns = z.looseObject({
	runs: z.array(z.looseObject({})).optional(),
});
export const WebhookEndpoint = z.looseObject({
	id: z.string(),
	url: z.string(),
	event_types: z.array(z.string()),
	enabled: z.boolean(),
	secret: z.string().optional(),
});
export const WebhookList = z.looseObject({
	webhooks: z.array(WebhookEndpoint).optional(),
});
export const DeleteResult = z.looseObject({
	id: z.string(),
	deleted: z.literal(true),
});
export const WebhookTest = z.looseObject({
	delivered: z.boolean().optional(),
});

export const OrbitEndpointInputSchemas = {
	startSearch: StartSearchInput,
	getSearch: GetSearchInput,
	quotePopulation: QuotePopulationInput,
	startPopulation: StartPopulationInput,
	readProfile: ReadProfileInput,
	enrichProfile: EnrichProfileInput,
	getEnrichment: GetEnrichInput,
	batchEnrich: BatchEnrichInput,
	submitBulk: SubmitBulkInput,
	getBulk: BulkJobInput,
	getBulkResults: BulkResultsInput,
	cancelBulk: BulkJobInput,
	detectFaces: DetectFacesInput,
	searchFaceIndex: FaceIndexInput,
	createWatcher: CreateWatcherInput,
	listWatchers: z.object({}),
	getWatcher: WatcherIdInput,
	updateWatcher: UpdateWatcherInput,
	deleteWatcher: WatcherIdInput,
	listWatcherRuns: WatcherRunsInput,
	createWebhook: CreateWebhookInput,
	listWebhooks: z.object({}),
	deleteWebhook: WebhookIdInput,
	testWebhook: TestWebhookInput,
};

export const OrbitEndpointOutputSchemas = {
	startSearch: SearchSnapshot,
	getSearch: SearchSnapshot,
	quotePopulation: PopulationQuote,
	startPopulation: SearchSnapshot,
	readProfile: ProfileRead,
	enrichProfile: EnrichSnapshot,
	getEnrichment: EnrichSnapshot,
	batchEnrich: BatchEnrichSnapshot,
	submitBulk: BulkJob,
	getBulk: BulkJob,
	getBulkResults: BulkResults,
	cancelBulk: BulkJob,
	detectFaces: FaceDetection,
	searchFaceIndex: FaceIndexSearch,
	createWatcher: Watcher,
	listWatchers: WatcherList,
	getWatcher: Watcher,
	updateWatcher: Watcher,
	deleteWatcher: DeleteResult,
	listWatcherRuns: WatcherRuns,
	createWebhook: WebhookEndpoint,
	listWebhooks: WebhookList,
	deleteWebhook: DeleteResult,
	testWebhook: WebhookTest,
};

export type OrbitEndpointInputs = {
	[K in keyof typeof OrbitEndpointInputSchemas]: z.input<
		(typeof OrbitEndpointInputSchemas)[K]
	>;
};
export type OrbitEndpointOutputs = {
	[K in keyof typeof OrbitEndpointOutputSchemas]: z.infer<
		(typeof OrbitEndpointOutputSchemas)[K]
	>;
};
