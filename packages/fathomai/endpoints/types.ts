import { z } from 'zod';

const RecordingId = z.number().int().positive();

// Response enums accept values Fathom adds later instead of failing the whole response.
const openEnum = <const T extends readonly [string, ...string[]]>(values: T) =>
	z.union([z.enum(values), z.string()]);
const Cursor = z.string().min(1).optional();

const TranscriptItemSchema = z.object({
	speaker: z.object({
		display_name: z.string(),
		matched_calendar_invitee_email: z.string().nullish(),
	}),
	text: z.string(),
	timestamp: z.string(),
});

const MeetingSummarySchema = z.object({
	template_name: z.string().nullable(),
	markdown_formatted: z.string().nullable(),
});

const ActionItemSchema = z.object({
	description: z.string(),
	user_generated: z.boolean(),
	completed: z.boolean(),
	recording_timestamp: z.string(),
	recording_playback_url: z.string(),
	assignee: z.object({
		name: z.string().nullable(),
		email: z.string().nullable(),
		team: z.string().nullable(),
	}),
});

const HighlightSchema = z.object({
	type: z.string(),
	summary: z.string().nullable(),
	text: z.string().optional(),
	start_time: z.number(),
	end_time: z.number(),
});

const InviteeSchema = z.object({
	name: z.string().nullable(),
	matched_speaker_display_name: z.string().nullish(),
	email: z.string().nullable(),
	email_domain: z.string().nullable(),
	is_external: z.boolean(),
});

const CrmMatchesSchema = z.object({
	contacts: z
		.array(
			z.object({ name: z.string(), email: z.string(), record_url: z.string() }),
		)
		.optional(),
	companies: z
		.array(z.object({ name: z.string(), record_url: z.string() }))
		.optional(),
	deals: z
		.array(
			z.object({
				name: z.string(),
				amount: z.number(),
				record_url: z.string(),
			}),
		)
		.optional(),
	error: z.string().nullish(),
});

export const MeetingSchema = z.object({
	title: z.string(),
	meeting_title: z.string().nullable(),
	meeting_type: z.string().nullable(),
	recording_id: RecordingId,
	url: z.string(),
	meeting_url: z.string().nullish(),
	share_url: z.string(),
	created_at: z.string(),
	scheduled_start_time: z.string(),
	scheduled_end_time: z.string(),
	recording_start_time: z.string(),
	recording_end_time: z.string(),
	calendar_invitees_domains_type: openEnum([
		'only_internal',
		'one_or_more_external',
	]),
	shared_with: openEnum([
		'no_teams',
		'single_team',
		'multiple_teams',
		'all_teams',
	]),
	transcript_language: z.string(),
	transcript: z.array(TranscriptItemSchema).nullish(),
	default_summary: MeetingSummarySchema.nullish(),
	action_items: z.array(ActionItemSchema).nullish(),
	highlights: z.array(HighlightSchema).nullish(),
	calendar_invitees: z.array(InviteeSchema),
	recorded_by: z.object({
		name: z.string(),
		email: z.string(),
		email_domain: z.string(),
		team: z.string().nullable(),
	}),
	crm_matches: CrmMatchesSchema.nullish(),
});

export const MeetingTypeSchema = z.object({
	name: z.string(),
	status: openEnum(['active', 'inactive']),
	created_at: z.string(),
});

export const TeamSchema = z.object({
	name: z.string(),
	created_at: z.string(),
});

export const TeamMemberSchema = z.object({
	name: z.string(),
	email: z.string(),
	created_at: z.string(),
});

const UserStatusValues = ['active', 'deactivated', 'invited'] as const;
const SettingsAccessLevelValues = [
	'none',
	'team_admin',
	'account_admin',
] as const;
const UserStatus = z.enum(UserStatusValues);
const SettingsAccessLevel = z.enum(SettingsAccessLevelValues);

export const UserSchema = z.object({
	name: z.string().nullable(),
	email: z.string(),
	created_at: z.string(),
	status: openEnum(UserStatusValues),
	permissions: z
		.object({
			settings_access: z.object({
				level: openEnum(SettingsAccessLevelValues),
				teams: z.array(z.string()),
			}),
			view_access: z.object({
				level: openEnum([
					'own_meetings',
					'team',
					'multiple_teams',
					'all_teams',
				]),
				teams: z.array(z.string()),
			}),
		})
		.optional(),
});

const DownloadFileSchema = z.object({
	url: z.string(),
	content_type: z.string(),
	file_size_bytes: z.number().int(),
	expires_at: z.string(),
});

const RecordingDownloadSchema = z.object({
	download_id: z.string(),
	recording_id: RecordingId,
	status: openEnum(['processing', 'completed', 'failed', 'expired']),
	video: DownloadFileSchema.optional(),
	audio: DownloadFileSchema.optional(),
	failure_reason: openEnum([
		'generation_failed',
		'generation_timeout',
	]).optional(),
});

const WebhookTriggerValues = [
	'my_recordings',
	'shared_external_recordings',
	'my_shared_with_team_recordings',
	'shared_team_recordings',
] as const;
const WebhookTrigger = z.enum(WebhookTriggerValues);

const WebhookSchema = z.object({
	id: z.string(),
	url: z.string(),
	secret: z.string(),
	created_at: z.string(),
	include_transcript: z.boolean(),
	include_crm_matches: z.boolean(),
	include_summary: z.boolean(),
	include_action_items: z.boolean(),
	triggered_for: z.array(openEnum(WebhookTriggerValues)),
});

const CallbackResponseSchema = z.object({ destination_url: z.string() });

const page = <T extends z.ZodType>(item: T) =>
	z.object({
		limit: z.number().int().nullable(),
		next_cursor: z.string().nullable(),
		items: z.array(item),
	});

const MeetingsListInputSchema = z.object({
	cursor: Cursor,
	created_after: z.string().optional(),
	created_before: z.string().optional(),
	calendar_invitees_domains: z.array(z.string()).optional(),
	calendar_invitees_domains_type: z
		.enum(['all', 'only_internal', 'one_or_more_external'])
		.optional(),
	meeting_type: z.string().optional(),
	recorded_by: z.array(z.email()).optional(),
	teams: z.array(z.string()).optional(),
	include_action_items: z.boolean().optional(),
	include_crm_matches: z.boolean().optional(),
	include_highlights: z.boolean().optional(),
	include_summary: z.boolean().optional(),
	include_transcript: z.boolean().optional(),
});

const CursorInputSchema = z.object({ cursor: Cursor });

const TeamMembersListInputSchema = z.object({
	cursor: Cursor,
	team: z.string().optional(),
});

const UsersListInputSchema = z.object({
	cursor: Cursor,
	team: z.string().optional(),
	status: UserStatus.optional(),
	settings_access: SettingsAccessLevel.optional(),
});

const RecordingContentInputSchema = z.object({
	recording_id: RecordingId,
	destination_url: z.url().optional(),
});

const RecordingsGetDownloadInputSchema = z.object({
	recording_id: RecordingId,
	download_id: z.string().min(1),
});

const WebhooksCreateInputSchema = z
	.object({
		destination_url: z.url(),
		triggered_for: z.array(WebhookTrigger).min(1),
		include_action_items: z.boolean().optional(),
		include_crm_matches: z.boolean().optional(),
		include_summary: z.boolean().optional(),
		include_transcript: z.boolean().optional(),
	})
	.refine(
		(input) =>
			input.include_action_items ||
			input.include_crm_matches ||
			input.include_summary ||
			input.include_transcript,
		{
			message:
				'Set at least one of include_transcript, include_summary, include_action_items or include_crm_matches',
		},
	);

const WebhooksDeleteInputSchema = z.object({ id: z.string().min(1) });

export const FathomAiEndpointInputSchemas = {
	meetingsList: MeetingsListInputSchema,
	meetingTypesList: CursorInputSchema,
	recordingsGetSummary: RecordingContentInputSchema,
	recordingsGetTranscript: RecordingContentInputSchema,
	recordingsRequestDownload: RecordingContentInputSchema,
	recordingsGetDownload: RecordingsGetDownloadInputSchema,
	teamsList: CursorInputSchema,
	teamMembersList: TeamMembersListInputSchema,
	usersList: UsersListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
} as const;

export const FathomAiEndpointOutputSchemas = {
	meetingsList: page(MeetingSchema),
	meetingTypesList: page(MeetingTypeSchema),
	recordingsGetSummary: z.union([
		z.object({ summary: MeetingSummarySchema }),
		CallbackResponseSchema,
	]),
	recordingsGetTranscript: z.union([
		z.object({ transcript: z.array(TranscriptItemSchema) }),
		CallbackResponseSchema,
	]),
	recordingsRequestDownload: RecordingDownloadSchema,
	recordingsGetDownload: RecordingDownloadSchema,
	teamsList: page(TeamSchema),
	teamMembersList: page(TeamMemberSchema),
	usersList: page(UserSchema),
	webhooksCreate: WebhookSchema,
	webhooksDelete: z.object({ id: z.string(), deleted: z.literal(true) }),
} as const;

export type FathomAiEndpointInputs = {
	[K in keyof typeof FathomAiEndpointInputSchemas]: z.input<
		(typeof FathomAiEndpointInputSchemas)[K]
	>;
};

export type FathomAiEndpointOutputs = {
	[K in keyof typeof FathomAiEndpointOutputSchemas]: z.infer<
		(typeof FathomAiEndpointOutputSchemas)[K]
	>;
};

export type Meeting = z.infer<typeof MeetingSchema>;

// The fields a meeting only carries when an `include_*` flag (or a webhook setting) asks for them.
// `unknown` in storableMeeting's bound: their values are dropped, never read.
const MEETING_CONTENT_FIELDS = [
	'transcript',
	'default_summary',
	'action_items',
	'highlights',
	'crm_matches',
] as const;

/**
 * The meeting record kept in the local database: metadata only. Transcripts, summaries, action items,
 * highlights and CRM matches are returned to the caller but not stored, so a later list call without
 * the `include_*` flags writes the same record instead of wiping content an earlier call saved.
 */
export function storableMeeting<
	T extends Partial<Record<(typeof MEETING_CONTENT_FIELDS)[number], unknown>>,
>(meeting: T): Omit<T, (typeof MEETING_CONTENT_FIELDS)[number]> {
	const {
		transcript,
		default_summary,
		action_items,
		highlights,
		crm_matches,
		...stored
	} = meeting;
	return stored;
}
export type MeetingType = z.infer<typeof MeetingTypeSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type User = z.infer<typeof UserSchema>;
export type RecordingDownload =
	FathomAiEndpointOutputs['recordingsGetDownload'];
export type Webhook = FathomAiEndpointOutputs['webhooksCreate'];
