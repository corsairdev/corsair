import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────

const PaginationInputSchema = z.object({
	page: z.number().int().positive().optional(),
	items: z.number().int().min(1).max(100).optional(),
});

const PaginationSchema = z.object({
	page: z.number(),
	items: z.number(),
	count: z.number(),
});

const UuidInputSchema = z.object({
	uuid: z.string(),
});
export type UuidInput = z.infer<typeof UuidInputSchema>;

// ── Meeting Events ───────────────────────────────────────────────────────

const MeetingEventOrganizerSchema = z.object({
	email: z.string(),
});

const MeetingEventAttendeeSchema = z.object({
	email: z.string(),
});

const MeetingEventBotRunSchema = z.object({
	uuid: z.string(),
	start_time: z.string().nullable().optional(),
	end_time: z.string().nullable().optional(),
	recording_start_time: z.string().nullable().optional(),
	end_reason: z.string().nullable().optional(),
});

const IntegrationUserUserSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
});

const IntegrationUserIntegrationSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	slug: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
	active: z.boolean().optional(),
	url: z.string().nullable().optional(),
	logo: z.string().nullable().optional(),
});

const IntegrationUserCallSchema = z.object({
	uuid: z.string(),
	source: z.string().nullable().optional(),
	source_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	performed_at: z.string().nullable().optional(),
	locale: z.string().nullable().optional(),
	duration: z.number().nullable().optional(),
	direction: z.string().nullable().optional(),
	is_video: z.boolean().optional(),
	visible: z.boolean().optional(),
	recording_url: z.string().nullable().optional(),
	transcript_url: z.string().nullable().optional(),
	leexi_url: z.string().nullable().optional(),
});

const IntegrationUserSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	active: z.boolean().optional(),
	user: IntegrationUserUserSchema.nullable().optional(),
	integration: IntegrationUserIntegrationSchema.nullable().optional(),
	calls: z.array(IntegrationUserCallSchema).optional(),
});

const MeetingEventSchema = z.object({
	uuid: z.string(),
	title: z.string().nullable().optional(),
	organizer: MeetingEventOrganizerSchema.nullable().optional(),
	attendees: z.array(MeetingEventAttendeeSchema).optional(),
	meeting_url: z.string().nullable().optional(),
	meeting_provider: z.string().nullable().optional(),
	internal: z.boolean().optional(),
	direction: z.string().nullable().optional(),
	start_time: z.string().nullable().optional(),
	end_time: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	owned: z.boolean().optional(),
	to_record: z.boolean().optional(),
	bot_scheduled: z.boolean().optional(),
	bot_running: z.boolean().optional(),
	bot_runs: z.array(MeetingEventBotRunSchema).optional(),
	origin: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	recording_notified: z.boolean().optional(),
	active: z.boolean().optional(),
});

const MeetingEventDetailSchema = MeetingEventSchema.extend({
	integration_user: IntegrationUserSchema.nullable().optional(),
});

const MeetingEventsListInputSchema = PaginationInputSchema.extend({
	order: z
		.enum([
			'created_at desc',
			'created_at asc',
			'start_time desc',
			'start_time asc',
			'end_time desc',
			'end_time asc',
		])
		.optional(),
	origin: z.enum(['calendar', 'manual', 'api']).optional(),
	date_filter: z.enum(['start_time', 'end_time']).optional(),
	from: z.string().optional(),
	to: z.string().optional(),
});
export type MeetingEventsListInput = z.infer<
	typeof MeetingEventsListInputSchema
>;

const MeetingEventsListResponseSchema = z.object({
	data: z.array(MeetingEventSchema),
	pagination: PaginationSchema,
});
export type MeetingEventsListResponse = z.infer<
	typeof MeetingEventsListResponseSchema
>;

const MeetingEventsGetResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: MeetingEventDetailSchema,
});
export type MeetingEventsGetResponse = z.infer<
	typeof MeetingEventsGetResponseSchema
>;

const MeetingEventsCreateInputSchema = z.object({
	meeting_url: z.string(),
	user_uuid: z.string(),
	start_time: z.string(),
	end_time: z.string(),
	owned: z.boolean(),
	internal: z.boolean(),
	to_record: z.boolean(),
	organizer: z.string().email(),
	title: z.string().optional(),
	description: z.string().optional(),
	attendees: z.array(z.string().email()).optional(),
	direction: z.enum(['inbound', 'outbound']).optional(),
});
export type MeetingEventsCreateInput = z.infer<
	typeof MeetingEventsCreateInputSchema
>;

const MeetingEventsCreateResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: z.object({
		uuid: z.string(),
		meeting_url: z.string().nullable().optional(),
		start_time: z.string().nullable().optional(),
		end_time: z.string().nullable().optional(),
		owned: z.boolean().optional(),
		internal: z.boolean().optional(),
		to_record: z.boolean().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		active: z.boolean().optional(),
		bot_scheduled: z.boolean().optional(),
		bot_running: z.boolean().optional(),
		origin: z.string().nullable().optional(),
	}),
});
export type MeetingEventsCreateResponse = z.infer<
	typeof MeetingEventsCreateResponseSchema
>;

const MeetingEventsDeleteResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: z.object({}),
});
export type MeetingEventsDeleteResponse = z.infer<
	typeof MeetingEventsDeleteResponseSchema
>;

// ── Calls ────────────────────────────────────────────────────────────────

const CallUserRefSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
});

const CallCustomerSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone_number: z.string().nullable().optional(),
});

const CallSpeakerSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	index: z.number().optional(),
	is_user: z.boolean().optional(),
	email_address: z.string().nullable().optional(),
	phone_number: z.string().nullable().optional(),
	duration: z.number().nullable().optional(),
	longest_monologue: z.number().nullable().optional(),
});

const CallChapterSchema = z.object({
	uuid: z.string(),
	index: z.number().optional(),
	title: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
	start_time: z.number().nullable().optional(),
});

const CallPromptSchema = z.object({
	uuid: z.string(),
	category: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	completions: z.array(z.string()).optional(),
});

const CallTaskSchema = z.object({
	uuid: z.string(),
	subject: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	done: z.boolean().optional(),
	active: z.boolean().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	speaker: CallSpeakerSchema.nullable().optional(),
	last_editor: CallUserRefSchema.nullable().optional(),
});

const CallConversationTypeSchema = z.object({
	uuid: z.string(),
	slug: z.string().nullable().optional(),
	active: z.boolean().optional(),
});

const CallTagSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
});

const CallSchema = z.object({
	uuid: z.string(),
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	performed_at: z.string().nullable().optional(),
	duration: z.number().nullable().optional(),
	direction: z.string().nullable().optional(),
	is_video: z.boolean().optional(),
	locale: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	source_id: z.string().nullable().optional(),
	visible: z.boolean().optional(),
	leexi_url: z.string().nullable().optional(),
	recording_url: z.string().nullable().optional(),
	transcript_url: z.string().nullable().optional(),
	simple_transcript: z.string().nullable().optional(),
	audio_archived_at: z.string().nullable().optional(),
	video_archived_at: z.string().nullable().optional(),
	transcript_archived_at: z.string().nullable().optional(),
	completions_archived_at: z.string().nullable().optional(),
	owner: CallUserRefSchema.nullable().optional(),
	participating_users: z.array(CallUserRefSchema).optional(),
	customers: z.array(CallCustomerSchema).optional(),
	speakers: z.array(CallSpeakerSchema).optional(),
	chapters: z.array(CallChapterSchema).optional(),
	prompts: z.array(CallPromptSchema).optional(),
	tasks: z.array(CallTaskSchema).optional(),
	conversation_type: CallConversationTypeSchema.nullable().optional(),
	tags: z.array(CallTagSchema).optional(),
});

const TranscriptItemSchema = z.object({
	content: z.string(),
	start_time: z.number(),
	end_time: z.number(),
});

const TranscriptSegmentSchema = z.object({
	speaker_index: z.number().nullable().optional(),
	start_time: z.number().nullable().optional(),
	end_time: z.number().nullable().optional(),
	items: z.array(TranscriptItemSchema).optional(),
});

const CallTopicSchema = z.object({
	uuid: z.string(),
	topic_name: z.string().nullable().optional(),
	keyphrase: z.string().nullable().optional(),
	start_time: z.number().nullable().optional(),
	end_time: z.number().nullable().optional(),
	speaker: CallSpeakerSchema.nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

const CallDetailSchema = CallSchema.extend({
	transcript: z.array(TranscriptSegmentSchema).optional(),
	call_topics: z.array(CallTopicSchema).optional(),
	summary: z.string().nullable().optional(),
	deal: z.record(z.string(), z.unknown()).nullable().optional(),
	meeting_event: z.record(z.string(), z.unknown()).nullable().optional(),
	feedbacks: z.array(z.record(z.string(), z.unknown())).optional(),
	scorecards: z.array(z.record(z.string(), z.unknown())).optional(),
});

const CallsListInputSchema = PaginationInputSchema.extend({
	order: z
		.enum([
			'created_at desc',
			'created_at asc',
			'performed_at desc',
			'performed_at asc',
			'updated_at desc',
			'updated_at asc',
		])
		.optional(),
	date_filter: z.enum(['created_at', 'performed_at', 'updated_at']).optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	source: z.string().optional(),
	source_id: z.array(z.string()).optional(),
	owner_uuid: z.array(z.string()).optional(),
	participating_user_uuid: z.array(z.string()).optional(),
	conversation_type_uuid: z.string().optional(),
	customer_phone_number: z.array(z.string()).optional(),
	customer_email_address: z.array(z.string()).optional(),
	with_simple_transcript: z.boolean().optional(),
});
export type CallsListInput = z.infer<typeof CallsListInputSchema>;

const CallsListResponseSchema = z.object({
	data: z.array(CallSchema),
	pagination: PaginationSchema,
});
export type CallsListResponse = z.infer<typeof CallsListResponseSchema>;

const CallsGetResponseSchema = z.object({
	data: CallDetailSchema,
});
export type CallsGetResponse = z.infer<typeof CallsGetResponseSchema>;

const PRESIGNED_URL_EXTENSIONS = [
	'.mp4',
	'.mkv',
	'.avi',
	'.webm',
	'.mov',
	'.wmv',
	'.mpg',
	'.mpeg',
	'.m4v',
	'.mp3',
	'.wav',
	'.aac',
	'.flac',
	'.ogg',
	'.m4a',
	'.wma',
	'.opus',
	'.aiff',
	'.alac',
	'.amr',
	'.ape',
	'.dts',
	'.ac3',
	'.mid',
	'.mp2',
	'.mpc',
	'.ra',
	'.tta',
	'.vox',
] as const;

const CallsRequestPresignedUrlInputSchema = z.object({
	extension: z.enum(PRESIGNED_URL_EXTENSIONS).optional(),
});
export type CallsRequestPresignedUrlInput = z.infer<
	typeof CallsRequestPresignedUrlInputSchema
>;

const CallsRequestPresignedUrlResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: z.object({
		url: z.string(),
		recording_s3_key: z.string(),
		headers: z.record(z.string(), z.string()),
	}),
});
export type CallsRequestPresignedUrlResponse = z.infer<
	typeof CallsRequestPresignedUrlResponseSchema
>;

// ── Teams ────────────────────────────────────────────────────────────────

const TeamSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	active: z.boolean().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

const TeamsListInputSchema = PaginationInputSchema;
export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

const TeamsListResponseSchema = z.object({
	data: z.array(TeamSchema),
	pagination: PaginationSchema,
});
export type TeamsListResponse = z.infer<typeof TeamsListResponseSchema>;

// ── Users ────────────────────────────────────────────────────────────────

const UserTeamRefSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	active: z.boolean().optional(),
});

const UserSchema = z.object({
	uuid: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	active: z.boolean().optional(),
	license: z.string().nullable().optional(),
	roles: z.array(z.string()).optional(),
	team: UserTeamRefSchema.nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});

const UsersListInputSchema = PaginationInputSchema;
export type UsersListInput = z.infer<typeof UsersListInputSchema>;

const UsersListResponseSchema = z.object({
	data: z.array(UserSchema),
	pagination: PaginationSchema,
});
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ── Endpoint Maps ────────────────────────────────────────────────────────

export type LeexiEndpointInputs = {
	meetingEventsList: MeetingEventsListInput;
	meetingEventsGet: UuidInput;
	meetingEventsCreate: MeetingEventsCreateInput;
	meetingEventsDelete: UuidInput;
	callsList: CallsListInput;
	callsGet: UuidInput;
	callsRequestPresignedUrl: CallsRequestPresignedUrlInput;
	teamsList: TeamsListInput;
	usersList: UsersListInput;
};

export type LeexiEndpointOutputs = {
	meetingEventsList: MeetingEventsListResponse;
	meetingEventsGet: MeetingEventsGetResponse;
	meetingEventsCreate: MeetingEventsCreateResponse;
	meetingEventsDelete: MeetingEventsDeleteResponse;
	callsList: CallsListResponse;
	callsGet: CallsGetResponse;
	callsRequestPresignedUrl: CallsRequestPresignedUrlResponse;
	teamsList: TeamsListResponse;
	usersList: UsersListResponse;
};

export const LeexiEndpointInputSchemas = {
	meetingEventsList: MeetingEventsListInputSchema,
	meetingEventsGet: UuidInputSchema,
	meetingEventsCreate: MeetingEventsCreateInputSchema,
	meetingEventsDelete: UuidInputSchema,
	callsList: CallsListInputSchema,
	callsGet: UuidInputSchema,
	callsRequestPresignedUrl: CallsRequestPresignedUrlInputSchema,
	teamsList: TeamsListInputSchema,
	usersList: UsersListInputSchema,
} as const;

export const LeexiEndpointOutputSchemas = {
	meetingEventsList: MeetingEventsListResponseSchema,
	meetingEventsGet: MeetingEventsGetResponseSchema,
	meetingEventsCreate: MeetingEventsCreateResponseSchema,
	meetingEventsDelete: MeetingEventsDeleteResponseSchema,
	callsList: CallsListResponseSchema,
	callsGet: CallsGetResponseSchema,
	callsRequestPresignedUrl: CallsRequestPresignedUrlResponseSchema,
	teamsList: TeamsListResponseSchema,
	usersList: UsersListResponseSchema,
} as const;
