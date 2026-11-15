import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────
//
// tl;dv returns ISO 8601 strings for timestamps and numbers for durations in
// seconds. Fields the docs mark nullable are typed `.nullish()`.

/** An ISO 8601 timestamp, e.g. `2024-01-15T10:00:00Z`. */
const isoTimestamp = z.string().describe('ISO 8601 timestamp');

// The spec marks `name` required, but a calendar guest can have an email and
// no display name, and one such invitee must not fail the whole read.
const UserSchema = z
	.object({
		name: z.string().nullish(),
		email: z.string(),
	})
	.loose();

export type TldvUser = z.infer<typeof UserSchema>;

const ExtraPropertiesSchema = z
	.object({
		conferenceId: z.string().nullish().describe('Meeting room id'),
	})
	.loose();

const MeetingSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		happenedAt: isoTimestamp.describe('When the meeting happened'),
		url: z.string().describe('Console URL for the meeting'),
		duration: z.number().describe('Length in seconds'),
		organizer: UserSchema,
		invitees: z.array(UserSchema),
		// Documented as an object with id and label, and nullable for a meeting
		// recorded without a template.
		template: z
			.object({ id: z.string().nullish(), label: z.string().nullish() })
			.loose()
			.nullish(),
		extraProperties: ExtraPropertiesSchema.nullish(),
		phoneNumber: z
			.string()
			.nullish()
			.describe('Only on a single-meeting read, not the list'),
		// unknown: the caller supplies this map on import, so its keys are theirs.
		metadata: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Only on a single-meeting read, not the list'),
	})
	.loose();

export type TldvMeeting = z.infer<typeof MeetingSchema>;

const PaginationSchema = {
	page: z.number().int().describe('Current page number'),
	pages: z.number().int().describe('Total pages available'),
	total: z.number().int().describe('Total results available'),
	pageSize: z.number().int().describe('Results per page'),
};

// ── meetings.list ─────────────────────────────────────────────────────────

const MeetingsListInputSchema = z.object({
	query: z.string().optional().describe('Search text'),
	page: z.number().int().min(1).optional().describe('Page number, from 1'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page, max 100'),
	from: z.string().optional().describe('Earliest date, as a date or date-time'),
	to: z.string().optional().describe('Latest date, as a date or date-time'),
	onlyParticipated: z
		.boolean()
		.optional()
		.describe('Only meetings the user took part in'),
	meetingType: z
		.enum(['internal', 'external'])
		.optional()
		.describe('internal means only participants from the org'),
	folderIds: z.array(z.string()).optional().describe('Folders to include'),
	folderIdsOp: z
		.enum(['and', 'or'])
		.optional()
		.describe('Whether a meeting must be in every folder or any'),
});

export type MeetingsListInput = z.input<typeof MeetingsListInputSchema>;

const MeetingsListResponseSchema = z
	.object({
		...PaginationSchema,
		results: z.array(MeetingSchema),
	})
	.loose();

export type MeetingsListResponse = z.infer<typeof MeetingsListResponseSchema>;

// ── meetings.get ──────────────────────────────────────────────────────────

const MeetingsGetInputSchema = z.object({
	meetingId: z.string().min(1),
});

export type MeetingsGetInput = z.input<typeof MeetingsGetInputSchema>;

const MeetingsGetResponseSchema = MeetingSchema;

export type MeetingsGetResponse = z.infer<typeof MeetingsGetResponseSchema>;

// ── meetings.transcript ───────────────────────────────────────────────────

const MeetingsTranscriptInputSchema = z.object({
	meetingId: z.string().min(1),
});

export type MeetingsTranscriptInput = z.input<
	typeof MeetingsTranscriptInputSchema
>;

const SentenceSchema = z
	.object({
		speaker: z.string().describe('Who said it'),
		text: z.string(),
		startTime: z.number().describe('Start offset in seconds'),
		endTime: z.number().describe('End offset in seconds'),
	})
	.loose();

export type TldvSentence = z.infer<typeof SentenceSchema>;

/** The same shape a TranscriptReady webhook carries under `data`. */
const TranscriptSchema = z
	.object({
		id: z.string(),
		meetingId: z.string(),
		data: z.array(SentenceSchema),
	})
	.loose();

export type TldvTranscript = z.infer<typeof TranscriptSchema>;

const MeetingsTranscriptResponseSchema = TranscriptSchema;

export type MeetingsTranscriptResponse = z.infer<
	typeof MeetingsTranscriptResponseSchema
>;

// ── meetings.notes ────────────────────────────────────────────────────────

const MeetingsNotesInputSchema = z.object({
	meetingId: z.string().min(1),
});

export type MeetingsNotesInput = z.input<typeof MeetingsNotesInputSchema>;

const NoteSchema = z
	.object({
		segmentId: z.string(),
		timestamp: z.number().describe('Seconds into the meeting'),
		text: z.string(),
		topicId: z.string(),
	})
	.loose();

export type TldvNote = z.infer<typeof NoteSchema>;

const TopicSchema = z
	.object({
		id: z.string(),
		order: z.number().int(),
		title: z.string(),
		summary: z.string(),
	})
	.loose();

export type TldvTopic = z.infer<typeof TopicSchema>;

const MeetingsNotesResponseSchema = z
	.object({
		structuredNotes: z.array(NoteSchema),
		markdownContent: z.string().describe('The notes rendered as markdown'),
		topics: z.array(TopicSchema),
	})
	.loose();

export type MeetingsNotesResponse = z.infer<typeof MeetingsNotesResponseSchema>;

// ── meetings.import ───────────────────────────────────────────────────────

const MeetingsImportInputSchema = z.object({
	url: z
		.string()
		.min(1)
		.describe(
			'Publicly reachable media URL. Supported: .mp3 .mp4 .wav .m4a .mkv .mov .avi .wma .flac',
		),
	// Required by the spec's MeetingImportControllerBody, alongside `url`.
	name: z.string().min(1).max(500).describe('Name for the new meeting'),
	happenedAt: z
		.string()
		.optional()
		.describe('Meeting date, ISO 8601 with milliseconds'),
	participants: z
		.array(z.string())
		.optional()
		.describe('Emails of the invited participants'),
	phoneNumber: z.string().max(64).optional(),
	// The documented limits: at most 20 keys matching ^[A-Za-z0-9_-]{1,64}$, and
	// values that are strings of up to 256 characters, numbers or booleans.
	// tl;dv answers 400 to a nested object or an array.
	metadata: z
		.record(
			z.string().regex(/^[A-Za-z0-9_-]{1,64}$/),
			z.union([z.string().max(256), z.number(), z.boolean()]),
		)
		.refine((value) => Object.keys(value).length <= 20, {
			message: 'metadata can hold at most 20 keys',
		})
		.optional()
		.describe(
			'Flat key/value map with your own identifiers: up to 20 keys, values are strings, numbers or booleans',
		),
});

export type MeetingsImportInput = z.input<typeof MeetingsImportInputSchema>;

const MeetingsImportResponseSchema = z
	.object({
		success: z.boolean(),
		jobId: z.string().describe('Id of the import job'),
		message: z.string(),
	})
	.loose();

export type MeetingsImportResponse = z.infer<
	typeof MeetingsImportResponseSchema
>;

// ── folders.list ──────────────────────────────────────────────────────────

const FoldersListInputSchema = z.object({
	query: z.string().optional().describe('Folder name to search for'),
	meetingIds: z
		.array(z.string())
		.optional()
		.describe('Folders must contain these meeting ids'),
	meetingIdsOp: z
		.enum(['and', 'or'])
		.optional()
		.describe('Whether a folder must contain every id or any'),
	space: z
		.enum(['all', 'personal', 'team', 'organization'])
		.optional()
		.describe('Which folder scopes to search'),
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

export type FoldersListInput = z.input<typeof FoldersListInputSchema>;

const FolderSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		meetingIds: z.array(z.string()),
	})
	.loose();

export type TldvFolder = z.infer<typeof FolderSchema>;

const FoldersListResponseSchema = z
	.object({
		...PaginationSchema,
		results: z.array(FolderSchema),
	})
	.loose();

export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type TldvEndpointInputs = {
	meetingsList: MeetingsListInput;
	meetingsGet: MeetingsGetInput;
	meetingsTranscript: MeetingsTranscriptInput;
	meetingsNotes: MeetingsNotesInput;
	meetingsImport: MeetingsImportInput;
	foldersList: FoldersListInput;
};

export type TldvEndpointOutputs = {
	meetingsList: MeetingsListResponse;
	meetingsGet: MeetingsGetResponse;
	meetingsTranscript: MeetingsTranscriptResponse;
	meetingsNotes: MeetingsNotesResponse;
	meetingsImport: MeetingsImportResponse;
	foldersList: FoldersListResponse;
};

export const TldvEndpointInputSchemas = {
	meetingsList: MeetingsListInputSchema,
	meetingsGet: MeetingsGetInputSchema,
	meetingsTranscript: MeetingsTranscriptInputSchema,
	meetingsNotes: MeetingsNotesInputSchema,
	meetingsImport: MeetingsImportInputSchema,
	foldersList: FoldersListInputSchema,
} as const;

export const TldvEndpointOutputSchemas = {
	meetingsList: MeetingsListResponseSchema,
	meetingsGet: MeetingsGetResponseSchema,
	meetingsTranscript: MeetingsTranscriptResponseSchema,
	meetingsNotes: MeetingsNotesResponseSchema,
	meetingsImport: MeetingsImportResponseSchema,
	foldersList: FoldersListResponseSchema,
} as const;

// Reused by the webhook schemas, which carry these objects under `data`.
export { MeetingSchema, SentenceSchema, TranscriptSchema };
