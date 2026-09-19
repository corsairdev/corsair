import { z } from 'zod';

// Request shapes follow https://crowterminal.com/llms.txt. Response shapes were
// captured from live api.crowterminal.com responses and are loose, because the
// service adds advisory fields (_tip, _note, _docs, _sandbox) and returns only
// what a plan is entitled to.

/**
 * Ids are spliced into request paths, so anything that could retarget the
 * request is rejected here rather than only escaped at the call site.
 *
 * `.` and `..` need their own check: encodeURIComponent leaves dots alone, so
 * a bare `..` survives encoding and URL normalisation then collapses
 * `/api/agent/memory/../changelog` down to `/api/agent/changelog`.
 */
const IdSchema = z
	.string()
	.min(1)
	.refine((v) => !/[/?#]/.test(v), {
		message: 'must not contain /, ? or #',
	})
	.refine((v) => v !== '.' && v !== '..', {
		message: 'must not be a . or .. path segment',
	});

export const CrowterminalPlatformSchema = z.enum([
	'TIKTOK',
	'INSTAGRAM',
	'YOUTUBE',
]);

/** Values come from GET /api/agent/data/types, which is per-platform. */
export const CrowterminalDataTypeSchema = z.enum([
	'retention',
	'demographics',
	'traffic_sources',
	'watch_time',
	'audience_activity',
	'follower_growth',
	'video_performance',
	'sound_performance',
	'hashtag_performance',
	'reach_sources',
	'content_interactions',
	'story_metrics',
	'reel_metrics',
	'subscriber_growth',
	'click_through_rate',
	'impression_sources',
	'end_screen_performance',
]);

export const CrowterminalWebhookEventNameSchema = z.enum([
	'skill.updated',
	'skill.version_created',
	'data.ingested',
	'validation.blocked',
	'posting.completed',
	'posting.failed',
]);

const NoInputSchema = z.object({});
const ClientInputSchema = z.object({ clientId: IdSchema });

/** Every response carries `success`; failures come back as HTTP errors. */
const ok = z.boolean().optional();

// ── Memory ──────────────────────────────────────────────────────────────────

export const SkillSchema = z.looseObject({
	primaryNiche: z.string().optional(),
	subNiches: z.array(z.string()).optional(),
	contentStyle: z.string().optional(),
	signatureStyle: z.string().optional(),
	hookPatterns: z.array(z.string()).optional(),
	avgEngagement: z.number().optional(),
	bestPostingTimes: z
		.array(
			z.looseObject({
				day: z.number().int().optional(),
				hour: z.number().int().optional(),
				score: z.number().optional(),
			}),
		)
		.optional(),
});

export const GetMemoryInputSchema = ClientInputSchema;
export const GetMemoryResponseSchema = z.looseObject({
	success: ok,
	clientId: z.string().optional(),
	clientName: z.string().optional(),
	version: z.number().optional(),
	updatedAt: z.string().optional(),
	skill: SkillSchema.nullable().optional(),
});

/** Up to 50 clients per call. */
export const BulkMemoryInputSchema = z.object({
	clientIds: z.array(IdSchema).min(1).max(50),
});
export const BulkMemoryResponseSchema = z.looseObject({
	success: ok,
	total: z.number().optional(),
	clients: z.array(
		z.looseObject({
			clientId: z.string(),
			success: ok,
			skill: SkillSchema.nullable().optional(),
		}),
	),
});

export const GetChangelogInputSchema = ClientInputSchema;
export const GetChangelogResponseSchema = z.looseObject({
	success: ok,
	clientId: z.string().optional(),
	message: z.string().optional(),
	changelog: z.array(z.unknown()),
});

export const GetPatternInputSchema = z.object({
	clientId: IdSchema,
	/** Skill field to trend, e.g. primaryNiche. Required by the API. */
	field: z.string().min(1),
});
export const GetPatternResponseSchema = z.looseObject({
	success: ok,
	clientId: z.string().optional(),
	field: z.string().optional(),
	trend: z.string().optional(),
	versionsAnalyzed: z.number().optional(),
	dataPoints: z.array(z.unknown()),
});

export const EngagementAnalysisInputSchema = z.object({
	clientId: IdSchema,
	agentMd: z.record(z.string(), z.unknown()),
});
export const EngagementAnalysisResponseSchema = z.looseObject({
	success: ok,
	clientId: z.string().optional(),
	/** 'insufficient_data' when the client has too few stored versions. */
	analysis: z.string().optional(),
	message: z.string().optional(),
	versionsAnalyzed: z.number().optional(),
	overallStats: z.looseObject({}).optional(),
	fieldAnalysis: z.array(z.unknown()).optional(),
});

export const CompareMdInputSchema = z.object({
	clientId: IdSchema,
	agentMd: z.record(z.string(), z.unknown()),
});
export const CompareMdResponseSchema = z.looseObject({
	success: ok,
	clientId: z.string().optional(),
	/** 'no_our_data' when CrowTerminal has nothing stored for the client. */
	comparison: z.string().optional(),
	message: z.string().optional(),
	recommendation: z.string().optional(),
	differences: z.array(z.unknown()).optional(),
	missingFields: z.array(z.string()).optional(),
});

const ProposedChangeSchema = z.object({
	field: z.string().min(1),
	oldValue: z.unknown().optional(),
	newValue: z.unknown().optional(),
});

export const ValidateChangesInputSchema = z.object({
	clientId: IdSchema,
	proposedChanges: z.array(ProposedChangeSchema).min(1),
});
export const ValidateChangesResponseSchema = z.looseObject({
	success: ok,
	clientId: z.string().optional(),
	/** 'blocked' or 'no_history'. */
	validation: z.string().optional(),
	message: z.string().optional(),
	warnings: z.array(z.unknown()),
	recommendations: z.array(z.unknown()),
});

// ── Data ────────────────────────────────────────────────────────────────────

export const IngestDataInputSchema = z.object({
	clientId: IdSchema,
	platform: CrowterminalPlatformSchema,
	dataType: CrowterminalDataTypeSchema,
	videoId: z.string().min(1).optional(),
	data: z.record(z.string(), z.unknown()),
	confidence: z.number().min(0).max(1).optional(),
});
export const IngestDataResponseSchema = z.looseObject({ success: ok });

/** Up to 50 points per call; the API names the array `items`. */
export const BulkIngestInputSchema = z.object({
	items: z.array(IngestDataInputSchema).min(1).max(50),
});
export const BulkIngestResponseSchema = z.looseObject({
	success: ok,
	total: z.number().optional(),
	results: z.array(z.unknown()).optional(),
});

export const GetDataTypesInputSchema = NoInputSchema;
export const GetDataTypesResponseSchema = z.looseObject({
	success: ok,
	dataTypes: z.record(z.string(), z.array(z.string())),
});

// ── Intelligence ────────────────────────────────────────────────────────────

export const GetPlatformIntelInputSchema = NoInputSchema;
export const GetPlatformIntelResponseSchema = z.looseObject({
	success: ok,
	data: z.unknown().optional(),
});

export const GetByokPlatformIntelInputSchema = NoInputSchema;
export const GetByokPlatformIntelResponseSchema = z.looseObject({
	success: ok,
	platforms: z.array(z.string()).optional(),
	intelligence: z.unknown().optional(),
});

// ── Status ──────────────────────────────────────────────────────────────────

const ServiceHealthSchema = z.looseObject({
	status: z.string(),
	latency: z.string().optional(),
	description: z.string().optional(),
});

export const GetStatusInputSchema = NoInputSchema;
export const GetStatusResponseSchema = z.looseObject({
	status: z.string(),
	timestamp: z.string().optional(),
	version: z.string().optional(),
	services: z.record(z.string(), ServiceHealthSchema).optional(),
	metrics: z.looseObject({}).optional(),
	endpoints: z.record(z.string(), z.string()).optional(),
});

export const PingInputSchema = NoInputSchema;
export const PingResponseSchema = z.looseObject({
	pong: z.boolean(),
	timestamp: z.string().optional(),
});

export const GetComponentsInputSchema = NoInputSchema;
export const GetComponentsResponseSchema = z.looseObject({
	timestamp: z.string().optional(),
	components: z.array(
		z.looseObject({
			name: z.string(),
			status: z.string(),
			latency: z.string().optional(),
			details: z.string().optional(),
		}),
	),
	summary: z.looseObject({}).optional(),
});

export const GetIncidentsInputSchema = NoInputSchema;
export const GetIncidentsResponseSchema = z.looseObject({
	timestamp: z.string().optional(),
	incidents: z.array(
		z.looseObject({
			timestamp: z.string().optional(),
			status: z.string().optional(),
			duration: z.string().optional(),
			components: z.array(z.string()).optional(),
		}),
	),
	subscribe: z.string().optional(),
});

export const GetStatusHistoryInputSchema = NoInputSchema;
export const GetStatusHistoryResponseSchema = z.looseObject({
	timestamp: z.string().optional(),
	period: z.string().optional(),
	dataPoints: z.array(
		z.looseObject({
			date: z.string(),
			uptime: z.number().optional(),
		}),
	),
	summary: z.looseObject({}).optional(),
});

export const GetUptimeInputSchema = NoInputSchema;
export const GetUptimeResponseSchema = z.looseObject({
	timestamp: z.string().optional(),
	currentStatus: z.string().optional(),
	uptime: z.looseObject({}),
	recentIncidents: z.array(z.unknown()).optional(),
});

// ── Sandbox ─────────────────────────────────────────────────────────────────

export const SandboxClientInputSchema = NoInputSchema;
export const SandboxClientResponseSchema = z.looseObject({
	success: ok,
	clientId: z.string().optional(),
	clientName: z.string().optional(),
	version: z.number().optional(),
	skill: SkillSchema.optional(),
});

export const SandboxMemoryInputSchema = NoInputSchema;
export const SandboxMemoryResponseSchema = SandboxClientResponseSchema;

export const SandboxEngagementInputSchema = z.object({
	agentMd: z.record(z.string(), z.unknown()).optional(),
});
export const SandboxEngagementResponseSchema = z.looseObject({
	success: ok,
	versionsAnalyzed: z.number().optional(),
	overallStats: z.looseObject({}).optional(),
	fieldAnalysis: z.array(z.unknown()).optional(),
});

export const SandboxValidateInputSchema = z.object({
	proposedChanges: z.array(ProposedChangeSchema).min(1),
});
export const SandboxValidateResponseSchema = z.looseObject({
	success: ok,
	validation: z.string().optional(),
	warnings: z.array(z.unknown()),
	recommendations: z.array(z.unknown()),
});

// ── Agent registration ──────────────────────────────────────────────────────

/** No auth; rate limited to 5 per hour per IP. */
export const RegisterAgentInputSchema = z.object({
	agentName: z.string().min(1),
	agentDescription: z.string().optional(),
});
export const RegisterAgentResponseSchema = z.looseObject({
	success: ok,
	message: z.string().optional(),
	/** Returned once at creation and never again. */
	apiKey: z.string().optional(),
	agentId: z.string().optional(),
});

// ── Webhooks ────────────────────────────────────────────────────────────────

export const CreateWebhookInputSchema = z.object({
	url: z.url(),
	events: z.array(CrowterminalWebhookEventNameSchema).min(1),
	secret: z.string().min(1).optional(),
});
export const CreateWebhookResponseSchema = z.looseObject({
	success: ok,
	id: z.string().optional(),
	/** Generated when the caller did not supply one. */
	secret: z.string().optional(),
});

export const ListWebhooksInputSchema = NoInputSchema;
export const ListWebhooksResponseSchema = z.looseObject({
	success: ok,
	webhooks: z.array(z.looseObject({ id: z.string().optional() })),
});

export const UpdateWebhookInputSchema = z.object({
	webhookId: IdSchema,
	url: z.url().optional(),
	events: z.array(CrowterminalWebhookEventNameSchema).min(1).optional(),
	isActive: z.boolean().optional(),
});
export const UpdateWebhookResponseSchema = z.looseObject({ success: ok });

export const DeleteWebhookInputSchema = z.object({ webhookId: IdSchema });
export const DeleteWebhookResponseSchema = z.looseObject({ success: ok });

export const TestWebhookInputSchema = z.object({
	url: z.url(),
	secret: z.string().min(1).optional(),
});
export const TestWebhookResponseSchema = z.looseObject({ success: ok });

// ── Registry ────────────────────────────────────────────────────────────────

export const CrowterminalEndpointInputSchemas = {
	memoryGet: GetMemoryInputSchema,
	memoryGetBulk: BulkMemoryInputSchema,
	memoryGetChangelog: GetChangelogInputSchema,
	memoryGetPattern: GetPatternInputSchema,
	memoryEngagementAnalysis: EngagementAnalysisInputSchema,
	memoryCompareMd: CompareMdInputSchema,
	memoryValidateChanges: ValidateChangesInputSchema,
	dataIngest: IngestDataInputSchema,
	dataIngestBulk: BulkIngestInputSchema,
	dataGetTypes: GetDataTypesInputSchema,
	intelGetPlatform: GetPlatformIntelInputSchema,
	intelGetByokPlatform: GetByokPlatformIntelInputSchema,
	statusGet: GetStatusInputSchema,
	statusPing: PingInputSchema,
	statusGetComponents: GetComponentsInputSchema,
	statusGetIncidents: GetIncidentsInputSchema,
	statusGetHistory: GetStatusHistoryInputSchema,
	statusGetUptime: GetUptimeInputSchema,
	sandboxGetClient: SandboxClientInputSchema,
	sandboxGetMemory: SandboxMemoryInputSchema,
	sandboxEngagementAnalysis: SandboxEngagementInputSchema,
	sandboxValidate: SandboxValidateInputSchema,
	agentRegister: RegisterAgentInputSchema,
	webhooksCreate: CreateWebhookInputSchema,
	webhooksList: ListWebhooksInputSchema,
	webhooksUpdate: UpdateWebhookInputSchema,
	webhooksDelete: DeleteWebhookInputSchema,
	webhooksTest: TestWebhookInputSchema,
} as const;

export const CrowterminalEndpointOutputSchemas = {
	memoryGet: GetMemoryResponseSchema,
	memoryGetBulk: BulkMemoryResponseSchema,
	memoryGetChangelog: GetChangelogResponseSchema,
	memoryGetPattern: GetPatternResponseSchema,
	memoryEngagementAnalysis: EngagementAnalysisResponseSchema,
	memoryCompareMd: CompareMdResponseSchema,
	memoryValidateChanges: ValidateChangesResponseSchema,
	dataIngest: IngestDataResponseSchema,
	dataIngestBulk: BulkIngestResponseSchema,
	dataGetTypes: GetDataTypesResponseSchema,
	intelGetPlatform: GetPlatformIntelResponseSchema,
	intelGetByokPlatform: GetByokPlatformIntelResponseSchema,
	statusGet: GetStatusResponseSchema,
	statusPing: PingResponseSchema,
	statusGetComponents: GetComponentsResponseSchema,
	statusGetIncidents: GetIncidentsResponseSchema,
	statusGetHistory: GetStatusHistoryResponseSchema,
	statusGetUptime: GetUptimeResponseSchema,
	sandboxGetClient: SandboxClientResponseSchema,
	sandboxGetMemory: SandboxMemoryResponseSchema,
	sandboxEngagementAnalysis: SandboxEngagementResponseSchema,
	sandboxValidate: SandboxValidateResponseSchema,
	agentRegister: RegisterAgentResponseSchema,
	webhooksCreate: CreateWebhookResponseSchema,
	webhooksList: ListWebhooksResponseSchema,
	webhooksUpdate: UpdateWebhookResponseSchema,
	webhooksDelete: DeleteWebhookResponseSchema,
	webhooksTest: TestWebhookResponseSchema,
} as const;

export type CrowterminalEndpointInputs = {
	[K in keyof typeof CrowterminalEndpointInputSchemas]: z.infer<
		(typeof CrowterminalEndpointInputSchemas)[K]
	>;
};

export type CrowterminalEndpointOutputs = {
	[K in keyof typeof CrowterminalEndpointOutputSchemas]: z.infer<
		(typeof CrowterminalEndpointOutputSchemas)[K]
	>;
};

export type CrowterminalSkill = z.infer<typeof SkillSchema>;
export type CrowterminalWebhookEventName = z.infer<
	typeof CrowterminalWebhookEventNameSchema
>;
