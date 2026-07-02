import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Common Schemas
// ─────────────────────────────────────────────────────────────────────────────

const DocsDestinationSchema = z.object({
	document: z.string().optional(),
	exportUri: z.string().optional(),
});

const DriveDestinationSchema = z.object({
	file: z.string().optional(),
	exportUri: z.string().optional(),
});

const AutoGenerationTypeSchema = z.enum([
	'AUTO_GENERATION_TYPE_UNSPECIFIED',
	'ON',
	'OFF',
]);

const ArtifactStateSchema = z.enum([
	'STATE_UNSPECIFIED',
	'STARTED',
	'ENDED',
	'FILE_GENERATED',
]);

const RestrictionTypeSchema = z.enum([
	'RESTRICTION_TYPE_UNSPECIFIED',
	'HOSTS_ONLY',
	'NO_RESTRICTION',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Spaces
// ─────────────────────────────────────────────────────────────────────────────

const PhoneAccessSchema = z.object({
	languageCode: z.string().optional(),
	phoneNumber: z.string().optional(),
	pin: z.string().optional(),
	regionCode: z.string().optional(),
});

const GatewaySipAccessSchema = z.object({
	uri: z.string().optional(),
	sipAccessCode: z.string().optional(),
});

const ArtifactConfigSchema = z.object({
	recordingConfig: z
		.object({
			autoRecordingGeneration: AutoGenerationTypeSchema.optional(),
		})
		.optional(),
	transcriptionConfig: z
		.object({
			autoTranscriptionGeneration: AutoGenerationTypeSchema.optional(),
		})
		.optional(),
	smartNotesConfig: z
		.object({
			autoSmartNotesGeneration: AutoGenerationTypeSchema.optional(),
		})
		.optional(),
});

const ModerationRestrictionsSchema = z.object({
	chatRestriction: RestrictionTypeSchema.optional(),
	reactionRestriction: RestrictionTypeSchema.optional(),
	presentRestriction: RestrictionTypeSchema.optional(),
	defaultJoinAsViewerType: z
		.enum(['DEFAULT_JOIN_AS_VIEWER_TYPE_UNSPECIFIED', 'ON', 'OFF'])
		.optional(),
});

const SpaceConfigSchema = z.object({
	accessType: z
		.enum(['ACCESS_TYPE_UNSPECIFIED', 'OPEN', 'TRUSTED', 'RESTRICTED'])
		.optional(),
	entryPointAccess: z
		.enum(['ENTRY_POINT_ACCESS_UNSPECIFIED', 'CREATOR_APP_ONLY', 'ALL'])
		.optional(),
	moderation: z.enum(['MODERATION_UNSPECIFIED', 'OFF', 'ON']).optional(),
	moderationRestrictions: ModerationRestrictionsSchema.optional(),
	attendanceReportGenerationType: z
		.enum([
			'ATTENDANCE_REPORT_GENERATION_TYPE_UNSPECIFIED',
			'DO_NOT_GENERATE',
			'GENERATE_REPORT',
		])
		.optional(),
	artifactConfig: ArtifactConfigSchema.optional(),
});

const ActiveConferenceSchema = z.object({
	conferenceRecord: z.string().optional(),
});

const SpaceSchema = z.object({
	name: z.string().optional(),
	meetingUri: z.string().optional(),
	meetingCode: z.string().optional(),
	config: SpaceConfigSchema.optional(),
	activeConference: ActiveConferenceSchema.optional(),
	phoneAccess: z.array(PhoneAccessSchema).optional(),
	gatewaySipAccess: z.array(GatewaySipAccessSchema).optional(),
});

const CreateSpaceInputSchema = z.object({
	space: z
		.object({
			config: SpaceConfigSchema.optional(),
		})
		.optional(),
	requestId: z.string().optional(),
});

const GetSpaceInputSchema = z.object({
	name: z.string(),
});

const PatchSpaceInputSchema = z.object({
	name: z.string(),
	updateMask: z.string().optional(),
	space: z
		.object({
			config: SpaceConfigSchema.optional(),
		})
		.optional(),
});

const EndActiveConferenceInputSchema = z.object({
	name: z.string(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Conference Records
// ─────────────────────────────────────────────────────────────────────────────

const ConferenceRecordSchema = z.object({
	name: z.string().optional(),
	space: z.string().optional(),
	fixedExternalMeetingId: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	expireTime: z.string().optional(),
});

const GetConferenceRecordInputSchema = z.object({
	name: z.string(),
});

const ListConferenceRecordsInputSchema = z.object({
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	filter: z.string().optional(),
});

const ListConferenceRecordsResponseSchema = z.object({
	conferenceRecords: z.array(ConferenceRecordSchema).optional(),
	nextPageToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Participants
// ─────────────────────────────────────────────────────────────────────────────

const SignedInUserSchema = z.object({
	user: z.string().optional(),
	displayName: z.string().optional(),
});

const AnonymousUserSchema = z.object({
	displayName: z.string().optional(),
});

const PhoneUserSchema = z.object({
	displayName: z.string().optional(),
});

const ParticipantSchema = z.object({
	name: z.string().optional(),
	signedInUser: SignedInUserSchema.optional(),
	anonymousUser: AnonymousUserSchema.optional(),
	phoneUser: PhoneUserSchema.optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
});

const GetParticipantInputSchema = z.object({
	name: z.string(),
});

const ListParticipantsInputSchema = z.object({
	parent: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});

const ListParticipantsResponseSchema = z.object({
	participants: z.array(ParticipantSchema).optional(),
	nextPageToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Participant Sessions
// ─────────────────────────────────────────────────────────────────────────────

const ParticipantSessionSchema = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
});

const GetParticipantSessionInputSchema = z.object({
	name: z.string(),
});

const ListParticipantSessionsInputSchema = z.object({
	parent: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});

const ListParticipantSessionsResponseSchema = z.object({
	participantSessions: z.array(ParticipantSessionSchema).optional(),
	nextPageToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Recordings
// ─────────────────────────────────────────────────────────────────────────────

const RecordingSchema = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	state: ArtifactStateSchema.optional(),
	driveDestination: DriveDestinationSchema.optional(),
});

const GetRecordingInputSchema = z.object({
	name: z.string(),
});

const ListRecordingsInputSchema = z.object({
	parent: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});

const ListRecordingsResponseSchema = z.object({
	recordings: z.array(RecordingSchema).optional(),
	nextPageToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Transcripts
// ─────────────────────────────────────────────────────────────────────────────

const TranscriptSchema = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	state: ArtifactStateSchema.optional(),
	docsDestination: DocsDestinationSchema.optional(),
});

const GetTranscriptInputSchema = z.object({
	name: z.string(),
});

const ListTranscriptsInputSchema = z.object({
	parent: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});

const ListTranscriptsResponseSchema = z.object({
	transcripts: z.array(TranscriptSchema).optional(),
	nextPageToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Transcript Entries
// ─────────────────────────────────────────────────────────────────────────────

const TranscriptEntrySchema = z.object({
	name: z.string().optional(),
	participant: z.string().optional(),
	text: z.string().optional(),
	languageCode: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
});

const GetTranscriptEntryInputSchema = z.object({
	name: z.string(),
});

const ListTranscriptEntriesInputSchema = z.object({
	parent: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});

const ListTranscriptEntriesResponseSchema = z.object({
	transcriptEntries: z.array(TranscriptEntrySchema).optional(),
	nextPageToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Smart Notes
// ─────────────────────────────────────────────────────────────────────────────

const SmartNoteSchema = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	state: ArtifactStateSchema.optional(),
	docsDestination: DocsDestinationSchema.optional(),
});

const GetSmartNoteInputSchema = z.object({
	name: z.string(),
});

const ListSmartNotesInputSchema = z.object({
	parent: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});

const ListSmartNotesResponseSchema = z.object({
	smartNotes: z.array(SmartNoteSchema).optional(),
	nextPageToken: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GoogleMeetEndpointInputSchemas = {
	spacesCreate: CreateSpaceInputSchema,
	spacesGet: GetSpaceInputSchema,
	spacesPatch: PatchSpaceInputSchema,
	spacesEndActiveConference: EndActiveConferenceInputSchema,
	conferenceRecordsGet: GetConferenceRecordInputSchema,
	conferenceRecordsList: ListConferenceRecordsInputSchema,
	participantsGet: GetParticipantInputSchema,
	participantsList: ListParticipantsInputSchema,
	participantSessionsGet: GetParticipantSessionInputSchema,
	participantSessionsList: ListParticipantSessionsInputSchema,
	recordingsGet: GetRecordingInputSchema,
	recordingsList: ListRecordingsInputSchema,
	transcriptsGet: GetTranscriptInputSchema,
	transcriptsList: ListTranscriptsInputSchema,
	transcriptEntriesGet: GetTranscriptEntryInputSchema,
	transcriptEntriesList: ListTranscriptEntriesInputSchema,
	smartNotesGet: GetSmartNoteInputSchema,
	smartNotesList: ListSmartNotesInputSchema,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Output Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GoogleMeetEndpointOutputSchemas = {
	spacesCreate: SpaceSchema,
	spacesGet: SpaceSchema,
	spacesPatch: SpaceSchema,
	spacesEndActiveConference: z.void(),
	conferenceRecordsGet: ConferenceRecordSchema,
	conferenceRecordsList: ListConferenceRecordsResponseSchema,
	participantsGet: ParticipantSchema,
	participantsList: ListParticipantsResponseSchema,
	participantSessionsGet: ParticipantSessionSchema,
	participantSessionsList: ListParticipantSessionsResponseSchema,
	recordingsGet: RecordingSchema,
	recordingsList: ListRecordingsResponseSchema,
	transcriptsGet: TranscriptSchema,
	transcriptsList: ListTranscriptsResponseSchema,
	transcriptEntriesGet: TranscriptEntrySchema,
	transcriptEntriesList: ListTranscriptEntriesResponseSchema,
	smartNotesGet: SmartNoteSchema,
	smartNotesList: ListSmartNotesResponseSchema,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type GoogleMeetEndpointInputs = {
	spacesCreate: z.infer<typeof CreateSpaceInputSchema>;
	spacesGet: z.infer<typeof GetSpaceInputSchema>;
	spacesPatch: z.infer<typeof PatchSpaceInputSchema>;
	spacesEndActiveConference: z.infer<typeof EndActiveConferenceInputSchema>;
	conferenceRecordsGet: z.infer<typeof GetConferenceRecordInputSchema>;
	conferenceRecordsList: z.infer<typeof ListConferenceRecordsInputSchema>;
	participantsGet: z.infer<typeof GetParticipantInputSchema>;
	participantsList: z.infer<typeof ListParticipantsInputSchema>;
	participantSessionsGet: z.infer<typeof GetParticipantSessionInputSchema>;
	participantSessionsList: z.infer<typeof ListParticipantSessionsInputSchema>;
	recordingsGet: z.infer<typeof GetRecordingInputSchema>;
	recordingsList: z.infer<typeof ListRecordingsInputSchema>;
	transcriptsGet: z.infer<typeof GetTranscriptInputSchema>;
	transcriptsList: z.infer<typeof ListTranscriptsInputSchema>;
	transcriptEntriesGet: z.infer<typeof GetTranscriptEntryInputSchema>;
	transcriptEntriesList: z.infer<typeof ListTranscriptEntriesInputSchema>;
	smartNotesGet: z.infer<typeof GetSmartNoteInputSchema>;
	smartNotesList: z.infer<typeof ListSmartNotesInputSchema>;
};

export type GoogleMeetEndpointOutputs = {
	spacesCreate: Space;
	spacesGet: Space;
	spacesPatch: Space;
	spacesEndActiveConference: void;
	conferenceRecordsGet: ConferenceRecord;
	conferenceRecordsList: ListConferenceRecordsResponse;
	participantsGet: Participant;
	participantsList: ListParticipantsResponse;
	participantSessionsGet: ParticipantSession;
	participantSessionsList: ListParticipantSessionsResponse;
	recordingsGet: Recording;
	recordingsList: ListRecordingsResponse;
	transcriptsGet: Transcript;
	transcriptsList: ListTranscriptsResponse;
	transcriptEntriesGet: TranscriptEntry;
	transcriptEntriesList: ListTranscriptEntriesResponse;
	smartNotesGet: SmartNote;
	smartNotesList: ListSmartNotesResponse;
};

// ─────────────────────────────────────────────────────────────────────────────
// Response Types
// ─────────────────────────────────────────────────────────────────────────────

export type Space = z.infer<typeof SpaceSchema>;
export type ConferenceRecord = z.infer<typeof ConferenceRecordSchema>;
export type ListConferenceRecordsResponse = z.infer<
	typeof ListConferenceRecordsResponseSchema
>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type ListParticipantsResponse = z.infer<
	typeof ListParticipantsResponseSchema
>;
export type ParticipantSession = z.infer<typeof ParticipantSessionSchema>;
export type ListParticipantSessionsResponse = z.infer<
	typeof ListParticipantSessionsResponseSchema
>;
export type Recording = z.infer<typeof RecordingSchema>;
export type ListRecordingsResponse = z.infer<
	typeof ListRecordingsResponseSchema
>;
export type Transcript = z.infer<typeof TranscriptSchema>;
export type ListTranscriptsResponse = z.infer<
	typeof ListTranscriptsResponseSchema
>;
export type TranscriptEntry = z.infer<typeof TranscriptEntrySchema>;
export type ListTranscriptEntriesResponse = z.infer<
	typeof ListTranscriptEntriesResponseSchema
>;
export type SmartNote = z.infer<typeof SmartNoteSchema>;
export type ListSmartNotesResponse = z.infer<
	typeof ListSmartNotesResponseSchema
>;
