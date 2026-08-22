import { z } from 'zod';

const ClientIdSchema = z.string().min(1);

const CrowterminalPlatformSchema = z.enum(['TIKTOK', 'INSTAGRAM', 'YOUTUBE']);

const CrowterminalDataTypeSchema = z.enum([
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

const CrowterminalWebhookEventNameSchema = z.enum([
	'skill.updated',
	'skill.version_created',
	'data.ingested',
	'validation.blocked',
	'posting.completed',
	'posting.failed',
]);

const GetMemoryInputSchema = z.object({
	clientId: ClientIdSchema,
});

const EngagementAnalysisInputSchema = z.object({
	clientId: ClientIdSchema,
	agentMd: z.record(z.string(), z.unknown()),
});

const IngestDataInputSchema = z.object({
	clientId: ClientIdSchema,
	platform: CrowterminalPlatformSchema,
	dataType: CrowterminalDataTypeSchema,
	videoId: z.string().min(1).optional(),
	data: z.record(z.string(), z.unknown()),
	confidence: z.number().min(0).max(1).optional(),
});

const GetStatusInputSchema = z.object({});

const CreateWebhookInputSchema = z.object({
	url: z.string().url(),
	events: z.array(CrowterminalWebhookEventNameSchema),
	secret: z.string().min(1).optional(),
});

const ListWebhooksInputSchema = z.object({});

const UpdateWebhookInputSchema = z.object({
	webhookId: z.string().min(1),
	url: z.string().url().optional(),
	events: z.array(CrowterminalWebhookEventNameSchema).optional(),
	isActive: z.boolean().optional(),
});

const DeleteWebhookInputSchema = z.object({
	webhookId: z.string().min(1),
});

const TestWebhookInputSchema = z.object({
	url: z.string().url(),
	secret: z.string().min(1).optional(),
});

const SkillSchema = z
	.object({
		primaryNiche: z.string().optional(),
		hookPatterns: z.array(z.string()).optional(),
		avgEngagement: z.number().optional(),
		bestPostingTimes: z
			.array(
				z.object({
					day: z.number().int(),
					hour: z.number().int(),
					score: z.number(),
				}),
			)
			.optional(),
	})
	.loose();

const GetMemoryResponseSchema = z.object({
	success: z.literal(true),
	version: z.number().int(),
	skill: SkillSchema,
});

const EngagementAnalysisResponseSchema = z.object({
	success: z.literal(true),
	versionsAnalyzed: z.number().int().nonnegative(),
	overallStats: z.object({
		peakEngagement: z.number(),
		peakVersion: z.number().int(),
		yourSimilarityToTop: z.string(),
		yourSimilarityToBottom: z.string(),
	}),
	fieldAnalysis: z.array(
		z.object({
			field: z.string(),
			yourValue: z.unknown(),
			bestValue: z.unknown(),
			bestEngagement: z.number(),
			yourPredictedEngagement: z.number(),
			improvement: z.string(),
			confidence: z.string(),
		}),
	),
	recommendations: z.array(z.string()),
});

const IngestDataResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	id: z.string(),
	clientId: z.string(),
	platform: CrowterminalPlatformSchema,
	dataType: CrowterminalDataTypeSchema,
	_tip: z.string().optional(),
});

// The docs describe status and webhook-management responses as JSON objects but
// do not publish their field shapes. Keep them object-validated without
// fabricating fields that CrowTerminal has not documented.
const DocumentedObjectResponseSchema = z.object({}).loose();

const CreateWebhookResponseSchema = z
	.object({
		id: z.string(),
		secret: z.string(),
	})
	.loose();

export const CrowterminalEndpointInputSchemas = {
	memoryGet: GetMemoryInputSchema,
	memoryEngagementAnalysis: EngagementAnalysisInputSchema,
	dataIngest: IngestDataInputSchema,
	statusGet: GetStatusInputSchema,
	webhooksCreate: CreateWebhookInputSchema,
	webhooksList: ListWebhooksInputSchema,
	webhooksUpdate: UpdateWebhookInputSchema,
	webhooksDelete: DeleteWebhookInputSchema,
	webhooksTest: TestWebhookInputSchema,
} as const;

export type CrowterminalEndpointInputs = {
	[K in keyof typeof CrowterminalEndpointInputSchemas]: z.infer<
		(typeof CrowterminalEndpointInputSchemas)[K]
	>;
};

export const CrowterminalEndpointOutputSchemas = {
	memoryGet: GetMemoryResponseSchema,
	memoryEngagementAnalysis: EngagementAnalysisResponseSchema,
	dataIngest: IngestDataResponseSchema,
	statusGet: DocumentedObjectResponseSchema,
	webhooksCreate: CreateWebhookResponseSchema,
	webhooksList: DocumentedObjectResponseSchema,
	webhooksUpdate: DocumentedObjectResponseSchema,
	webhooksDelete: DocumentedObjectResponseSchema,
	webhooksTest: DocumentedObjectResponseSchema,
} as const;

export type CrowterminalEndpointOutputs = {
	[K in keyof typeof CrowterminalEndpointOutputSchemas]: z.infer<
		(typeof CrowterminalEndpointOutputSchemas)[K]
	>;
};

export type GetMemoryInput = CrowterminalEndpointInputs['memoryGet'];
export type GetMemoryResponse = CrowterminalEndpointOutputs['memoryGet'];
export type EngagementAnalysisInput =
	CrowterminalEndpointInputs['memoryEngagementAnalysis'];
export type EngagementAnalysisResponse =
	CrowterminalEndpointOutputs['memoryEngagementAnalysis'];
export type IngestDataInput = CrowterminalEndpointInputs['dataIngest'];
export type IngestDataResponse = CrowterminalEndpointOutputs['dataIngest'];
export type GetStatusInput = CrowterminalEndpointInputs['statusGet'];
export type GetStatusResponse = CrowterminalEndpointOutputs['statusGet'];
export type CreateWebhookInput = CrowterminalEndpointInputs['webhooksCreate'];
export type CreateWebhookResponse =
	CrowterminalEndpointOutputs['webhooksCreate'];
export type ListWebhooksInput = CrowterminalEndpointInputs['webhooksList'];
export type ListWebhooksResponse = CrowterminalEndpointOutputs['webhooksList'];
export type UpdateWebhookInput = CrowterminalEndpointInputs['webhooksUpdate'];
export type UpdateWebhookResponse =
	CrowterminalEndpointOutputs['webhooksUpdate'];
export type DeleteWebhookInput = CrowterminalEndpointInputs['webhooksDelete'];
export type DeleteWebhookResponse =
	CrowterminalEndpointOutputs['webhooksDelete'];
export type TestWebhookInput = CrowterminalEndpointInputs['webhooksTest'];
export type TestWebhookResponse = CrowterminalEndpointOutputs['webhooksTest'];
