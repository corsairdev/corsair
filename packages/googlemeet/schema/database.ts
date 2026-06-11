import { z } from 'zod';

const DocsDestination = z.object({
	documentUrl: z.string().optional(),
	exportUri: z.string().optional(),
});

const PhoneAccess = z.object({
	languageCode: z.string().optional(),
	phoneNumber: z.string().optional(),
	pin: z.string().optional(),
	regionCode: z.string().optional(),
});

const GatewaySipAccess = z.object({
	sipAccessUri: z.string().optional(),
});

const ArtifactConfig = z.object({
	recordingConfig: z
		.object({
			autoRecordingGeneration: z.enum(['AUTO_RECORDING_GENERATION_UNSPECIFIED', 'OFF', 'ACTIVE_CONFERENCE']).optional(),
		})
		.optional(),
	transcriptionConfig: z
		.object({
			autoTranscriptionGeneration: z.enum(['AUTO_TRANSCRIPTION_GENERATION_UNSPECIFIED', 'OFF', 'ACTIVE_CONFERENCE']).optional(),
		})
		.optional(),
	smartNotesConfig: z
		.object({
			autoSmartNotesGeneration: z.enum(['AUTO_SMART_NOTES_GENERATION_UNSPECIFIED', 'OFF', 'ACTIVE_CONFERENCE']).optional(),
		})
		.optional(),
});

const SpaceConfig = z.object({
	accessType: z.enum(['ACCESS_TYPE_UNSPECIFIED', 'OPEN', 'TRUSTED', 'RESTRICTED']).optional(),
	entryPointAccess: z.enum(['ENTRY_POINT_ACCESS_UNSPECIFIED', 'CREATOR_APP_ONLY', 'ALL']).optional(),
	autoRecordingType: z.enum(['AUTO_RECORDING_TYPE_UNSPECIFIED', 'OFF', 'ACTIVE_CONFERENCE']).optional(),
	moderation: z.enum(['MODERATION_UNSPECIFIED', 'OFF', 'ON']).optional(),
	attendanceReportGenerationType: z.enum(['ATTENDANCE_REPORT_GENERATION_TYPE_UNSPECIFIED', 'DO_NOT_GENERATE', 'GENERATE']).optional(),
	artifactConfig: ArtifactConfig.optional(),
});

const ActiveConference = z.object({
	conferenceRecord: z.string().optional(),
});

export const GoogleMeetSpace = z.object({
	name: z.string().optional(),
	meetingUri: z.string().optional(),
	meetingCode: z.string().optional(),
	config: SpaceConfig.optional(),
	activeConference: ActiveConference.optional(),
	phoneAccess: z.array(PhoneAccess).optional(),
	gatewaySipAccess: z.array(GatewaySipAccess).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const GoogleMeetConferenceRecord = z.object({
	name: z.string().optional(),
	space: z.string().optional(),
	fixedExternalMeetingId: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	expireTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const GoogleMeetParticipant = z.object({
	name: z.string().optional(),
	signedInUser: z
		.object({
			user: z.string().optional(),
			displayName: z.string().optional(),
		})
		.optional(),
	anonymousUser: z
		.object({
			displayName: z.string().optional(),
		})
		.optional(),
	phoneUser: z
		.object({
			displayName: z.string().optional(),
		})
		.optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const GoogleMeetRecording = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	state: z.enum(['STATE_UNSPECIFIED', 'STARTED', 'ENDED', 'FAILED']).optional(),
	driveDestination: DocsDestination.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const GoogleMeetTranscript = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	state: z.enum(['STATE_UNSPECIFIED', 'STARTED', 'ENDED', 'FAILED']).optional(),
	driveDestination: DocsDestination.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const GoogleMeetSmartNote = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	state: z.enum(['STATE_UNSPECIFIED', 'STARTED', 'ENDED', 'FAILED']).optional(),
	driveDestination: DocsDestination.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type GoogleMeetSpace = z.infer<typeof GoogleMeetSpace>;
export type GoogleMeetConferenceRecord = z.infer<typeof GoogleMeetConferenceRecord>;
export type GoogleMeetParticipant = z.infer<typeof GoogleMeetParticipant>;
export type GoogleMeetRecording = z.infer<typeof GoogleMeetRecording>;
export type GoogleMeetTranscript = z.infer<typeof GoogleMeetTranscript>;
export type GoogleMeetSmartNote = z.infer<typeof GoogleMeetSmartNote>;
