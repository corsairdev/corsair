import { z } from 'zod';

const DocsDestination = z.object({
	document: z.string().optional(),
	exportUri: z.string().optional(),
});

const DriveDestination = z.object({
	file: z.string().optional(),
	exportUri: z.string().optional(),
});

const AutoGenerationType = z.enum([
	'AUTO_GENERATION_TYPE_UNSPECIFIED',
	'ON',
	'OFF',
]);

const ArtifactState = z.enum([
	'STATE_UNSPECIFIED',
	'STARTED',
	'ENDED',
	'FILE_GENERATED',
]);

const RestrictionType = z.enum([
	'RESTRICTION_TYPE_UNSPECIFIED',
	'HOSTS_ONLY',
	'NO_RESTRICTION',
]);

const PhoneAccess = z.object({
	languageCode: z.string().optional(),
	phoneNumber: z.string().optional(),
	pin: z.string().optional(),
	regionCode: z.string().optional(),
});

const GatewaySipAccess = z.object({
	uri: z.string().optional(),
	sipAccessCode: z.string().optional(),
});

const ArtifactConfig = z.object({
	recordingConfig: z
		.object({
			autoRecordingGeneration: AutoGenerationType.optional(),
		})
		.optional(),
	transcriptionConfig: z
		.object({
			autoTranscriptionGeneration: AutoGenerationType.optional(),
		})
		.optional(),
	smartNotesConfig: z
		.object({
			autoSmartNotesGeneration: AutoGenerationType.optional(),
		})
		.optional(),
});

const ModerationRestrictions = z.object({
	chatRestriction: RestrictionType.optional(),
	reactionRestriction: RestrictionType.optional(),
	presentRestriction: RestrictionType.optional(),
	defaultJoinAsViewerType: z
		.enum(['DEFAULT_JOIN_AS_VIEWER_TYPE_UNSPECIFIED', 'ON', 'OFF'])
		.optional(),
});

const SpaceConfig = z.object({
	accessType: z
		.enum(['ACCESS_TYPE_UNSPECIFIED', 'OPEN', 'TRUSTED', 'RESTRICTED'])
		.optional(),
	entryPointAccess: z
		.enum(['ENTRY_POINT_ACCESS_UNSPECIFIED', 'CREATOR_APP_ONLY', 'ALL'])
		.optional(),
	moderation: z.enum(['MODERATION_UNSPECIFIED', 'OFF', 'ON']).optional(),
	moderationRestrictions: ModerationRestrictions.optional(),
	attendanceReportGenerationType: z
		.enum([
			'ATTENDANCE_REPORT_GENERATION_TYPE_UNSPECIFIED',
			'DO_NOT_GENERATE',
			'GENERATE_REPORT',
		])
		.optional(),
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
	state: ArtifactState.optional(),
	driveDestination: DriveDestination.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const GoogleMeetTranscript = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	state: ArtifactState.optional(),
	docsDestination: DocsDestination.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const GoogleMeetSmartNote = z.object({
	name: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	state: ArtifactState.optional(),
	docsDestination: DocsDestination.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type GoogleMeetSpace = z.infer<typeof GoogleMeetSpace>;
export type GoogleMeetConferenceRecord = z.infer<
	typeof GoogleMeetConferenceRecord
>;
export type GoogleMeetParticipant = z.infer<typeof GoogleMeetParticipant>;
export type GoogleMeetRecording = z.infer<typeof GoogleMeetRecording>;
export type GoogleMeetTranscript = z.infer<typeof GoogleMeetTranscript>;
export type GoogleMeetSmartNote = z.infer<typeof GoogleMeetSmartNote>;
