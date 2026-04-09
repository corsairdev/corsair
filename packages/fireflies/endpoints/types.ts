import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const SentenceSchema = z.object({
	index: z.number().nullable().optional(),
	// speaker_id is Int in Fireflies GraphQL schema (not String)
	speaker_id: z.number().nullable().optional(),
	speaker_name: z.string().nullable().optional(),
	raw_text: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
	start_time: z.number().nullable().optional(),
	end_time: z.number().nullable().optional(),
	ai_filters: z
		.object({
			task: z.string().nullable().optional(),
			pricing: z.string().nullable().optional(),
			metric: z.string().nullable().optional(),
			question: z.string().nullable().optional(),
			date_and_time: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
});

const SpeakerSchema = z.object({
	id: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
});

const MeetingAttendeeSchema = z.object({
	displayName: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phoneNumber: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
});

const SummarySchema = z.object({
	keywords: z.array(z.string()).nullable().optional(),
	// action_items and outline are Strings in Fireflies schema (not arrays)
	action_items: z.string().nullable().optional(),
	outline: z.string().nullable().optional(),
	shorthand_bullet: z.string().nullable().optional(),
	overview: z.string().nullable().optional(),
	bullet_gist: z.string().nullable().optional(),
	gist: z.string().nullable().optional(),
	short_summary: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	short_overview: z.string().nullable().optional(),
	meeting_type: z.string().nullable().optional(),
});

const TranscriptSchema = z.object({
	id: z.string(),
	title: z.string().nullable().optional(),
	// date is a Float (Unix ms timestamp) in Fireflies; coerce to Date
	date: z.coerce.date().nullable().optional(),
	duration: z.number().nullable().optional(),
	host_email: z.string().nullable().optional(),
	organizer_email: z.string().nullable().optional(),
	calendar_id: z.string().nullable().optional(),
	transcript_url: z.string().nullable().optional(),
	meeting_link: z.string().nullable().optional(),
	video_url: z.string().nullable().optional(),
	audio_url: z.string().nullable().optional(),
	privacy: z.string().nullable().optional(),
});

const TranscriptFullSchema = TranscriptSchema.extend({
	sentences: z.array(SentenceSchema).nullable().optional(),
	summary: SummarySchema.nullable().optional(),
	speakers: z.array(SpeakerSchema).nullable().optional(),
	meeting_attendees: z.array(MeetingAttendeeSchema).nullable().optional(),
});

const UserSchema = z.object({
	user_id: z.string(),
	email: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	num_transcripts: z.number().nullable().optional(),
	minutes_consumed: z.number().nullable().optional(),
	is_admin: z.boolean().nullable().optional(),
	integrations: z.array(z.string()).nullable().optional(),
});

const AskFredMessageSchema = z.object({
	id: z.string(),
	thread_id: z.string(),
	query: z.string(),
	answer: z.string(),
	suggested_queries: z.array(z.string()).nullable().optional(),
	status: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

// AskFredThreadSummary: returned by askfred_threads list query (no messages field)
const AskFredThreadSummarySchema = z.object({
	id: z.string(),
	title: z.string(),
	transcript_id: z.string().nullable().optional(),
	user_id: z.string(),
	created_at: z.string(),
});

// AskFredThread: returned by askfred_thread single query and deleteAskFredThread
const AskFredThreadSchema = AskFredThreadSummarySchema.extend({
	messages: z.array(AskFredMessageSchema).nullable().optional(),
});

// Return type of createAskFredThread and continueAskFredThread mutations
const AskFredResponseSchema = z.object({
	message: AskFredMessageSchema,
	cost: z.number().nullable().optional(),
});

const AppOutputSchema = z.object({
	transcript_id: z.string().nullable().optional(),
	user_id: z.string().nullable().optional(),
	app_id: z.string().nullable().optional(),
	// created_at is Float (Unix timestamp) in Fireflies schema
	created_at: z.number().nullable().optional(),
	title: z.string().nullable().optional(),
	prompt: z.string().nullable().optional(),
	response: z.string().nullable().optional(),
});

// MeetingAnalytics actual fields: sentiments, categories, speakers
const MeetingAnalyticsSchema = z.object({
	sentiments: z
		.object({
			negative_pct: z.number().nullable().optional(),
			neutral_pct: z.number().nullable().optional(),
			positive_pct: z.number().nullable().optional(),
		})
		.nullable()
		.optional(),
	categories: z
		.object({
			questions: z.number().nullable().optional(),
			date_times: z.number().nullable().optional(),
			metrics: z.number().nullable().optional(),
			tasks: z.number().nullable().optional(),
		})
		.nullable()
		.optional(),
	// speakers is a list; sub-type fields vary — use passthrough
	// type: unknown[] - Fireflies speaker analytics sub-type is not publicly documented
	speakers: z.array(z.record(z.unknown())).nullable().optional(),
});

// ── Input Schemas ────────────────────────────────────────────────────────────

const TranscriptsListInputSchema = z.object({
	title: z.string().optional(),
	// Fireflies uses fromDate/toDate (DateTime) as camelCase args
	fromDate: z.string().optional(),
	toDate: z.string().optional(),
	limit: z.number().optional(),
	skip: z.number().optional(),
	host_email: z.string().optional(),
	participant_email: z.string().optional(),
	mine: z.boolean().optional(),
});

const TranscriptsGetInputSchema = z.object({
	transcriptId: z.string(),
});

const TranscriptsGetAnalyticsInputSchema = z.object({
	transcriptId: z.string(),
});

const TranscriptsGetAudioUrlInputSchema = z.object({
	transcriptId: z.string(),
});

const TranscriptsGetVideoUrlInputSchema = z.object({
	transcriptId: z.string(),
});

const TranscriptsGetSummaryInputSchema = z.object({
	transcriptId: z.string(),
});

const UsersGetCurrentInputSchema = z.object({});

const UsersListInputSchema = z.object({});

const AskFredGetThreadsInputSchema = z.object({
	transcriptId: z.string().optional(),
});

const AskFredGetThreadInputSchema = z.object({
	threadId: z.string(),
});

const AskFredCreateThreadInputSchema = z.object({
	transcriptId: z.string().optional(),
	query: z.string(),
});

const AskFredContinueThreadInputSchema = z.object({
	threadId: z.string(),
	query: z.string(),
});

const AskFredDeleteThreadInputSchema = z.object({
	threadId: z.string(),
});

const AudioUploadInputSchema = z.object({
	url: z.string(),
	title: z.string().optional(),
	webhook: z.string().optional(),
	// Fireflies uses custom_language (not language)
	custom_language: z.string().optional(),
	client_reference_id: z.string().optional(),
});

const AiAppGetOutputsInputSchema = z.object({
	transcriptId: z.string().optional(),
	appId: z.string().optional(),
	limit: z.number().optional(),
	skip: z.number().optional(),
});

// ── Output Schemas ───────────────────────────────────────────────────────────

const TranscriptsListResponseSchema = z.object({
	transcripts: z.array(TranscriptSchema),
});

const TranscriptsGetResponseSchema = z.object({
	transcript: TranscriptFullSchema.nullable().optional(),
});

const TranscriptsGetAnalyticsResponseSchema = z.object({
	transcript: z
		.object({
			id: z.string(),
			analytics: MeetingAnalyticsSchema.nullable().optional(),
		})
		.nullable()
		.optional(),
});

const TranscriptsGetAudioUrlResponseSchema = z.object({
	transcript: z
		.object({
			id: z.string(),
			audio_url: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
});

const TranscriptsGetVideoUrlResponseSchema = z.object({
	transcript: z
		.object({
			id: z.string(),
			video_url: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
});

const TranscriptsGetSummaryResponseSchema = z.object({
	transcript: z
		.object({
			id: z.string(),
			summary: SummarySchema.nullable().optional(),
		})
		.nullable()
		.optional(),
});

const UsersGetCurrentResponseSchema = z.object({
	user: UserSchema.nullable().optional(),
});

const UsersListResponseSchema = z.object({
	users: z.array(UserSchema),
});

// Fireflies uses snake_case query names: askfred_threads, askfred_thread
const AskFredGetThreadsResponseSchema = z.object({
	askfred_threads: z.array(AskFredThreadSummarySchema),
});

const AskFredGetThreadResponseSchema = z.object({
	askfred_thread: AskFredThreadSchema.nullable().optional(),
});

const AskFredCreateThreadResponseSchema = z.object({
	createAskFredThread: AskFredResponseSchema,
});

const AskFredContinueThreadResponseSchema = z.object({
	continueAskFredThread: AskFredResponseSchema,
});

// deleteAskFredThread returns the deleted AskFredThread
const AskFredDeleteThreadResponseSchema = z.object({
	deleteAskFredThread: AskFredThreadSchema,
});

const AudioUploadResponseSchema = z.object({
	uploadAudio: z.object({
		success: z.boolean(),
		title: z.string(),
		message: z.string(),
	}),
});

const AiAppGetOutputsResponseSchema = z.object({
	apps: z
		.object({
			outputs: z.array(AppOutputSchema).nullable().optional(),
		})
		.nullable()
		.optional(),
});

// ── Endpoint I/O Maps ────────────────────────────────────────────────────────

export const FirefliesEndpointInputSchemas = {
	transcriptsList: TranscriptsListInputSchema,
	transcriptsGet: TranscriptsGetInputSchema,
	transcriptsGetAnalytics: TranscriptsGetAnalyticsInputSchema,
	transcriptsGetAudioUrl: TranscriptsGetAudioUrlInputSchema,
	transcriptsGetVideoUrl: TranscriptsGetVideoUrlInputSchema,
	transcriptsGetSummary: TranscriptsGetSummaryInputSchema,
	usersGetCurrent: UsersGetCurrentInputSchema,
	usersList: UsersListInputSchema,
	askFredGetThreads: AskFredGetThreadsInputSchema,
	askFredGetThread: AskFredGetThreadInputSchema,
	askFredCreateThread: AskFredCreateThreadInputSchema,
	askFredContinueThread: AskFredContinueThreadInputSchema,
	askFredDeleteThread: AskFredDeleteThreadInputSchema,
	audioUpload: AudioUploadInputSchema,
	aiAppGetOutputs: AiAppGetOutputsInputSchema,
} as const;

export const FirefliesEndpointOutputSchemas = {
	transcriptsList: TranscriptsListResponseSchema,
	transcriptsGet: TranscriptsGetResponseSchema,
	transcriptsGetAnalytics: TranscriptsGetAnalyticsResponseSchema,
	transcriptsGetAudioUrl: TranscriptsGetAudioUrlResponseSchema,
	transcriptsGetVideoUrl: TranscriptsGetVideoUrlResponseSchema,
	transcriptsGetSummary: TranscriptsGetSummaryResponseSchema,
	usersGetCurrent: UsersGetCurrentResponseSchema,
	usersList: UsersListResponseSchema,
	askFredGetThreads: AskFredGetThreadsResponseSchema,
	askFredGetThread: AskFredGetThreadResponseSchema,
	askFredCreateThread: AskFredCreateThreadResponseSchema,
	askFredContinueThread: AskFredContinueThreadResponseSchema,
	askFredDeleteThread: AskFredDeleteThreadResponseSchema,
	audioUpload: AudioUploadResponseSchema,
	aiAppGetOutputs: AiAppGetOutputsResponseSchema,
} as const;

export type FirefliesEndpointInputs = {
	[K in keyof typeof FirefliesEndpointInputSchemas]: z.infer<
		(typeof FirefliesEndpointInputSchemas)[K]
	>;
};

export type FirefliesEndpointOutputs = {
	[K in keyof typeof FirefliesEndpointOutputSchemas]: z.infer<
		(typeof FirefliesEndpointOutputSchemas)[K]
	>;
};

export type TranscriptsListResponse = z.infer<
	typeof TranscriptsListResponseSchema
>;
export type TranscriptsGetResponse = z.infer<
	typeof TranscriptsGetResponseSchema
>;
export type TranscriptsGetAnalyticsResponse = z.infer<
	typeof TranscriptsGetAnalyticsResponseSchema
>;
export type TranscriptsGetAudioUrlResponse = z.infer<
	typeof TranscriptsGetAudioUrlResponseSchema
>;
export type TranscriptsGetVideoUrlResponse = z.infer<
	typeof TranscriptsGetVideoUrlResponseSchema
>;
export type TranscriptsGetSummaryResponse = z.infer<
	typeof TranscriptsGetSummaryResponseSchema
>;
export type UsersGetCurrentResponse = z.infer<
	typeof UsersGetCurrentResponseSchema
>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type AskFredGetThreadsResponse = z.infer<
	typeof AskFredGetThreadsResponseSchema
>;
export type AskFredGetThreadResponse = z.infer<
	typeof AskFredGetThreadResponseSchema
>;
export type AskFredCreateThreadResponse = z.infer<
	typeof AskFredCreateThreadResponseSchema
>;
export type AskFredContinueThreadResponse = z.infer<
	typeof AskFredContinueThreadResponseSchema
>;
export type AskFredDeleteThreadResponse = z.infer<
	typeof AskFredDeleteThreadResponseSchema
>;
export type AudioUploadResponse = z.infer<typeof AudioUploadResponseSchema>;
export type AiAppGetOutputsResponse = z.infer<
	typeof AiAppGetOutputsResponseSchema
>;
