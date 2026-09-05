import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared Resource Schemas (strongly typed with .passthrough() for API safety)
// ─────────────────────────────────────────────────────────────────────────────

export const PhoneGatewayItemSchema = z
	.object({
		country: z.string().optional(),
		country_name: z.string().optional(),
		phone: z.string().optional(),
	})
	.passthrough();

export const ConferenceItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		room_type: z.string().optional(),
		status: z.string().optional(),
		room_url: z.string().optional(),
		permanent_room: z.union([z.number(), z.boolean()]).optional(),
		access_type: z.number().optional(),
		starts_at: z.string().optional(),
		duration: z.union([z.number(), z.string()]).optional(),
		timezone: z.string().optional(),
		lobby_description: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

export const ConferenceFileItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		size: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();

export const ConferenceSkinItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const TokenItemSchema = z
	.object({
		token: z.string().optional(),
		email: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const RegistrationItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		status: z.string().optional(),
		registered_at: z.string().optional(),
	})
	.passthrough();

export const SessionItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		starts_at: z.string().optional(),
		duration: z.union([z.number(), z.string()]).optional(),
		attendees_count: z.number().optional(),
	})
	.passthrough();

export const AttendeeItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		nickname: z.string().optional(),
		email: z.string().optional(),
		role: z.string().optional(),
		duration: z.number().optional(),
	})
	.passthrough();

export const PollItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const SurveyItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const QaHistoryItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		question: z.string().optional(),
		answer: z.string().optional(),
		author: z.string().optional(),
	})
	.passthrough();

export const RecordingItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		duration: z.number().optional(),
		recording_url: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const ChatItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		conference_id: z.union([z.string(), z.number()]).optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const FileLibraryItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		size: z.union([z.string(), z.number()]).optional(),
		created_at: z.string().optional(),
		download_url: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Utility Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const PingInputSchema = z.object({});
export const PingOutputSchema = z
	.object({
		ping: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const TimeZoneListInputSchema = z.object({});
export const TimeZoneListOutputSchema = z.union([
	z.array(z.string()),
	z.record(z.string(), z.string()),
]);

export const TimeZoneListByCountryInputSchema = z.object({
	country: z.string().describe('ISO 3166-1 alpha-2 country code (e.g. US)'),
});
export const TimeZoneListByCountryOutputSchema = z.union([
	z.array(z.string()),
	z.record(z.string(), z.string()),
]);

export const PhoneGatewaysInputSchema = z.object({});
export const PhoneGatewaysOutputSchema = z.array(PhoneGatewayItemSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Conferences Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GetConferencesInputSchema = z.object({
	status: z.enum(['active', 'inactive']).default('active').optional(),
	page: z.number().optional(),
});
export const GetConferencesOutputSchema = z.array(ConferenceItemSchema);

export const GetConferenceDetailsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]).describe('Conference / Room ID'),
});
export const GetConferenceDetailsOutputSchema = ConferenceItemSchema;

export const CreateConferenceInputSchema = z
	.object({
		name: z.string().describe('Conference room name'),
		room_type: z.enum(['meeting', 'webinar']).default('webinar').optional(),
		permanent_room: z.boolean().optional(),
		access_type: z
			.number()
			.optional()
			.describe('1: open, 2: password, 3: token'),
		password: z
			.string()
			.optional()
			.describe('Required when access_type is 2 (password-protected)'),
		starts_at: z
			.string()
			.optional()
			.describe('Scheduled start date/time (YYYY-MM-DD HH:MM:SS)'),
		duration: z
			.string()
			.optional()
			.describe('Duration in H:MM format, e.g. 1:20'),
		timezone: z.string().optional(),
		lobby_description: z.string().optional(),
		description: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.access_type === 2) return !!data.password;
			return true;
		},
		{
			message: 'password is required when access_type is 2',
			path: ['password'],
		},
	);
export const CreateConferenceOutputSchema = ConferenceItemSchema;

export const UpdateConferenceInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	name: z.string().optional(),
	room_type: z.enum(['meeting', 'webinar']).optional(),
	permanent_room: z.boolean().optional(),
	access_type: z.number().optional(),
	password: z.string().optional().describe('Required when access_type is 2'),
	starts_at: z.string().optional(),
	duration: z
		.string()
		.optional()
		.describe('Duration in H:MM format, e.g. 1:20'),
	timezone: z.string().optional(),
	lobby_description: z.string().optional(),
	description: z.string().optional(),
});
export const UpdateConferenceOutputSchema = ConferenceItemSchema;

export const DeleteConferenceInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
});
export const DeleteConferenceOutputSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export const GetConferenceFilesInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
});
export const GetConferenceFilesOutputSchema = z.array(ConferenceFileItemSchema);

export const GetConferenceSkinsInputSchema = z.object({});
export const GetConferenceSkinsOutputSchema = z.array(ConferenceSkinItemSchema);

export const SendInvitationInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	lang: z
		.string()
		.describe('Language code for the invitation email (e.g. en, pl)'),
	attendees: z.array(z.string()).describe('List of attendee email addresses'),
	role: z.enum(['listener', 'presenter']).default('listener').optional(),
	template: z.enum(['advanced', 'basic']).default('advanced').optional(),
});
export const SendInvitationOutputSchema = z
	.object({
		status: z.string().optional(),
		queued: z.number().optional(),
		failed: z.number().optional(),
	})
	.passthrough();

export const GenerateAutologinUrlInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	email: z.string().email(),
	nickname: z.string(),
	role: z
		.enum(['listener', 'presenter', 'moderator', 'guest_speaker', 'host'])
		.default('listener')
		.optional(),
	password: z
		.string()
		.optional()
		.describe('Required when room is password-protected'),
	token: z
		.string()
		.optional()
		.describe('Required when room is token-protected'),
});
export const GenerateAutologinUrlOutputSchema = z
	.object({
		autologin_hash: z.string().optional(),
		url: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Tokens Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const CreateAccessTokensInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	how_many: z.number().default(1).optional(),
});
export const CreateAccessTokensOutputSchema = z
	.object({
		tokens: z.array(z.string()).optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const ListAccessTokensInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
});
export const ListAccessTokensOutputSchema = z.array(TokenItemSchema);

export const GetTokenByEmailInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	email: z.string().email(),
});
export const GetTokenByEmailOutputSchema = z
	.array(z.string())
	.describe('Array of token strings for the given email');

// ─────────────────────────────────────────────────────────────────────────────
// Registrations Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const RegisterParticipantInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	registration: z
		.record(z.string(), z.unknown())
		.describe(
			'Participant registration fields (e.g. first_name, last_name, email)',
		),
});
export const RegisterParticipantOutputSchema = z
	.object({
		registration_hash: z.string().optional(),
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export const GetRegistrationsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	status: z
		.enum(['all', 'waiting', 'confirmed', 'rejected'])
		.default('all')
		.optional(),
});
export const GetRegistrationsOutputSchema = z.array(RegistrationItemSchema);

export const ListRegistrationsByStatusInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	status: z
		.enum(['all', 'waiting', 'confirmed', 'rejected'])
		.default('all')
		.optional(),
});
export const ListRegistrationsByStatusOutputSchema = z.array(
	RegistrationItemSchema,
);

export const CreateContactInputSchema = z.object({
	email: z.string().email(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone: z.string().optional(),
	country: z.string().optional(),
	city: z.string().optional(),
});
export const CreateContactOutputSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		email: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		phone: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Sessions Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GetConferenceSessionsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
});
export const GetConferenceSessionsOutputSchema = z.array(SessionItemSchema);

export const GetSessionDetailsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
});
export const GetSessionDetailsOutputSchema = SessionItemSchema;

export const GetSessionAttendeesInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
});
export const GetSessionAttendeesOutputSchema = z.array(AttendeeItemSchema);

export const GetSessionAttendeeDetailsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
	attendeeId: z.union([z.string(), z.number()]),
});
export const GetSessionAttendeeDetailsOutputSchema = AttendeeItemSchema;

export const GenerateSessionPdfReportInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
	lang: z.string().optional(),
});
export const GenerateSessionPdfReportOutputSchema = z
	.object({
		status: z.string().optional(),
		report_url: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export const GetSessionRegistrationsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
});
export const GetSessionRegistrationsOutputSchema = z.array(
	RegistrationItemSchema,
);

export const GetSessionPollsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
});
export const GetSessionPollsOutputSchema = z.array(PollItemSchema);

export const GetSessionPollDetailsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
	pollId: z.union([z.string(), z.number()]),
});
export const GetSessionPollDetailsOutputSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		questions: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const GetSessionSurveysInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
});
export const GetSessionSurveysOutputSchema = z.array(SurveyItemSchema);

export const GetSessionSurveyDetailsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
	surveyId: z.union([z.string(), z.number()]),
});
export const GetSessionSurveyDetailsOutputSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		answers: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const GetSessionQaHistoryInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	sessionId: z.union([z.string(), z.number()]),
});
export const GetSessionQaHistoryOutputSchema = z.array(QaHistoryItemSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Recordings Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GetSessionRecordingsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
});
export const GetSessionRecordingsOutputSchema = z.array(RecordingItemSchema);

export const GetSessionRecordingDetailsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	recordingId: z.union([z.string(), z.number()]),
});
export const GetSessionRecordingDetailsOutputSchema = RecordingItemSchema;

export const DeleteRecordingInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
	recordingId: z.union([z.string(), z.number()]),
});
export const DeleteRecordingOutputSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export const DeleteRecordingsInputSchema = z.object({
	roomId: z.union([z.string(), z.number()]),
});
export const DeleteRecordingsOutputSchema = z
	.object({
		status: z.string().optional(),
		deleted_count: z.number().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Chats Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GetChatsInputSchema = z.object({
	page: z.number().optional(),
});
export const GetChatsOutputSchema = z.array(ChatItemSchema);

export const GetChatDetailsInputSchema = z.object({
	chatId: z.union([z.string(), z.number()]),
});
export const GetChatDetailsOutputSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		messages: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Files Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GetFileLibraryInputSchema = z.object({
	page: z.number().optional(),
});
export const GetFileLibraryOutputSchema = z.array(FileLibraryItemSchema);

export const GetFileDetailsInputSchema = z.object({
	fileId: z.union([z.string(), z.number()]),
});
export const GetFileDetailsOutputSchema = FileLibraryItemSchema;

export const UploadFileInputSchema = z.object({
	name: z.string().describe('File name'),
	content: z.string().describe('Base64 content or file string'),
	conference_id: z.union([z.string(), z.number()]).optional(),
});
export const UploadFileOutputSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const DeleteFileInputSchema = z.object({
	fileId: z.union([z.string(), z.number()]),
});
export const DeleteFileOutputSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export const DownloadFileInputSchema = z.object({
	fileId: z.union([z.string(), z.number()]),
});
export const DownloadFileOutputSchema = z
	.object({
		content: z.string().optional(),
		download_url: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Combined Inputs & Outputs Maps
// ─────────────────────────────────────────────────────────────────────────────

export type ClickmeetingEndpointInputs = {
	// utility
	getPing: z.infer<typeof PingInputSchema>;
	getTimeZoneList: z.infer<typeof TimeZoneListInputSchema>;
	getTimeZoneListByCountry: z.infer<typeof TimeZoneListByCountryInputSchema>;
	getPhoneGateways: z.infer<typeof PhoneGatewaysInputSchema>;
	// conferences
	getConferences: z.infer<typeof GetConferencesInputSchema>;
	getConferenceDetails: z.infer<typeof GetConferenceDetailsInputSchema>;
	createConference: z.infer<typeof CreateConferenceInputSchema>;
	updateConference: z.infer<typeof UpdateConferenceInputSchema>;
	deleteConference: z.infer<typeof DeleteConferenceInputSchema>;
	getConferenceFiles: z.infer<typeof GetConferenceFilesInputSchema>;
	getConferenceSkins: z.infer<typeof GetConferenceSkinsInputSchema>;
	sendInvitation: z.infer<typeof SendInvitationInputSchema>;
	generateAutologinUrl: z.infer<typeof GenerateAutologinUrlInputSchema>;
	// tokens
	createAccessTokens: z.infer<typeof CreateAccessTokensInputSchema>;
	listAccessTokens: z.infer<typeof ListAccessTokensInputSchema>;
	getTokenByEmail: z.infer<typeof GetTokenByEmailInputSchema>;
	// registrations
	registerParticipant: z.infer<typeof RegisterParticipantInputSchema>;
	getRegistrations: z.infer<typeof GetRegistrationsInputSchema>;
	listRegistrationsByStatus: z.infer<
		typeof ListRegistrationsByStatusInputSchema
	>;
	createContact: z.infer<typeof CreateContactInputSchema>;
	// sessions
	getConferenceSessions: z.infer<typeof GetConferenceSessionsInputSchema>;
	getSessionDetails: z.infer<typeof GetSessionDetailsInputSchema>;
	getSessionAttendees: z.infer<typeof GetSessionAttendeesInputSchema>;
	getSessionAttendeeDetails: z.infer<
		typeof GetSessionAttendeeDetailsInputSchema
	>;
	generateSessionPdfReport: z.infer<typeof GenerateSessionPdfReportInputSchema>;
	getSessionRegistrations: z.infer<typeof GetSessionRegistrationsInputSchema>;
	getSessionPolls: z.infer<typeof GetSessionPollsInputSchema>;
	getSessionPollDetails: z.infer<typeof GetSessionPollDetailsInputSchema>;
	getSessionSurveys: z.infer<typeof GetSessionSurveysInputSchema>;
	getSessionSurveyDetails: z.infer<typeof GetSessionSurveyDetailsInputSchema>;
	getSessionQaHistory: z.infer<typeof GetSessionQaHistoryInputSchema>;
	// recordings
	getSessionRecordings: z.infer<typeof GetSessionRecordingsInputSchema>;
	getSessionRecordingDetails: z.infer<
		typeof GetSessionRecordingDetailsInputSchema
	>;
	deleteRecording: z.infer<typeof DeleteRecordingInputSchema>;
	deleteRecordings: z.infer<typeof DeleteRecordingsInputSchema>;
	// chats
	getChats: z.infer<typeof GetChatsInputSchema>;
	getChatDetails: z.infer<typeof GetChatDetailsInputSchema>;
	// files
	getFileLibrary: z.infer<typeof GetFileLibraryInputSchema>;
	getFileDetails: z.infer<typeof GetFileDetailsInputSchema>;
	uploadFile: z.infer<typeof UploadFileInputSchema>;
	deleteFile: z.infer<typeof DeleteFileInputSchema>;
	downloadFile: z.infer<typeof DownloadFileInputSchema>;
};

export type ClickmeetingEndpointOutputs = {
	// utility
	getPing: z.infer<typeof PingOutputSchema>;
	getTimeZoneList: z.infer<typeof TimeZoneListOutputSchema>;
	getTimeZoneListByCountry: z.infer<typeof TimeZoneListByCountryOutputSchema>;
	getPhoneGateways: z.infer<typeof PhoneGatewaysOutputSchema>;
	// conferences
	getConferences: z.infer<typeof GetConferencesOutputSchema>;
	getConferenceDetails: z.infer<typeof GetConferenceDetailsOutputSchema>;
	createConference: z.infer<typeof CreateConferenceOutputSchema>;
	updateConference: z.infer<typeof UpdateConferenceOutputSchema>;
	deleteConference: z.infer<typeof DeleteConferenceOutputSchema>;
	getConferenceFiles: z.infer<typeof GetConferenceFilesOutputSchema>;
	getConferenceSkins: z.infer<typeof GetConferenceSkinsOutputSchema>;
	sendInvitation: z.infer<typeof SendInvitationOutputSchema>;
	generateAutologinUrl: z.infer<typeof GenerateAutologinUrlOutputSchema>;
	// tokens
	createAccessTokens: z.infer<typeof CreateAccessTokensOutputSchema>;
	listAccessTokens: z.infer<typeof ListAccessTokensOutputSchema>;
	getTokenByEmail: z.infer<typeof GetTokenByEmailOutputSchema>;
	// registrations
	registerParticipant: z.infer<typeof RegisterParticipantOutputSchema>;
	getRegistrations: z.infer<typeof GetRegistrationsOutputSchema>;
	listRegistrationsByStatus: z.infer<
		typeof ListRegistrationsByStatusOutputSchema
	>;
	createContact: z.infer<typeof CreateContactOutputSchema>;
	// sessions
	getConferenceSessions: z.infer<typeof GetConferenceSessionsOutputSchema>;
	getSessionDetails: z.infer<typeof GetSessionDetailsOutputSchema>;
	getSessionAttendees: z.infer<typeof GetSessionAttendeesOutputSchema>;
	getSessionAttendeeDetails: z.infer<
		typeof GetSessionAttendeeDetailsOutputSchema
	>;
	generateSessionPdfReport: z.infer<
		typeof GenerateSessionPdfReportOutputSchema
	>;
	getSessionRegistrations: z.infer<typeof GetSessionRegistrationsOutputSchema>;
	getSessionPolls: z.infer<typeof GetSessionPollsOutputSchema>;
	getSessionPollDetails: z.infer<typeof GetSessionPollDetailsOutputSchema>;
	getSessionSurveys: z.infer<typeof GetSessionSurveysOutputSchema>;
	getSessionSurveyDetails: z.infer<typeof GetSessionSurveyDetailsOutputSchema>;
	getSessionQaHistory: z.infer<typeof GetSessionQaHistoryOutputSchema>;
	// recordings
	getSessionRecordings: z.infer<typeof GetSessionRecordingsOutputSchema>;
	getSessionRecordingDetails: z.infer<
		typeof GetSessionRecordingDetailsOutputSchema
	>;
	deleteRecording: z.infer<typeof DeleteRecordingOutputSchema>;
	deleteRecordings: z.infer<typeof DeleteRecordingsOutputSchema>;
	// chats
	getChats: z.infer<typeof GetChatsOutputSchema>;
	getChatDetails: z.infer<typeof GetChatDetailsOutputSchema>;
	// files
	getFileLibrary: z.infer<typeof GetFileLibraryOutputSchema>;
	getFileDetails: z.infer<typeof GetFileDetailsOutputSchema>;
	uploadFile: z.infer<typeof UploadFileOutputSchema>;
	deleteFile: z.infer<typeof DeleteFileOutputSchema>;
	downloadFile: z.infer<typeof DownloadFileOutputSchema>;
};

export const ClickmeetingEndpointInputSchemas = {
	getPing: PingInputSchema,
	getTimeZoneList: TimeZoneListInputSchema,
	getTimeZoneListByCountry: TimeZoneListByCountryInputSchema,
	getPhoneGateways: PhoneGatewaysInputSchema,
	getConferences: GetConferencesInputSchema,
	getConferenceDetails: GetConferenceDetailsInputSchema,
	createConference: CreateConferenceInputSchema,
	updateConference: UpdateConferenceInputSchema,
	deleteConference: DeleteConferenceInputSchema,
	getConferenceFiles: GetConferenceFilesInputSchema,
	getConferenceSkins: GetConferenceSkinsInputSchema,
	sendInvitation: SendInvitationInputSchema,
	generateAutologinUrl: GenerateAutologinUrlInputSchema,
	createAccessTokens: CreateAccessTokensInputSchema,
	listAccessTokens: ListAccessTokensInputSchema,
	getTokenByEmail: GetTokenByEmailInputSchema,
	registerParticipant: RegisterParticipantInputSchema,
	getRegistrations: GetRegistrationsInputSchema,
	listRegistrationsByStatus: ListRegistrationsByStatusInputSchema,
	createContact: CreateContactInputSchema,
	getConferenceSessions: GetConferenceSessionsInputSchema,
	getSessionDetails: GetSessionDetailsInputSchema,
	getSessionAttendees: GetSessionAttendeesInputSchema,
	getSessionAttendeeDetails: GetSessionAttendeeDetailsInputSchema,
	generateSessionPdfReport: GenerateSessionPdfReportInputSchema,
	getSessionRegistrations: GetSessionRegistrationsInputSchema,
	getSessionPolls: GetSessionPollsInputSchema,
	getSessionPollDetails: GetSessionPollDetailsInputSchema,
	getSessionSurveys: GetSessionSurveysInputSchema,
	getSessionSurveyDetails: GetSessionSurveyDetailsInputSchema,
	getSessionQaHistory: GetSessionQaHistoryInputSchema,
	getSessionRecordings: GetSessionRecordingsInputSchema,
	getSessionRecordingDetails: GetSessionRecordingDetailsInputSchema,
	deleteRecording: DeleteRecordingInputSchema,
	deleteRecordings: DeleteRecordingsInputSchema,
	getChats: GetChatsInputSchema,
	getChatDetails: GetChatDetailsInputSchema,
	getFileLibrary: GetFileLibraryInputSchema,
	getFileDetails: GetFileDetailsInputSchema,
	uploadFile: UploadFileInputSchema,
	deleteFile: DeleteFileInputSchema,
	downloadFile: DownloadFileInputSchema,
} as const;

export const ClickmeetingEndpointOutputSchemas = {
	getPing: PingOutputSchema,
	getTimeZoneList: TimeZoneListOutputSchema,
	getTimeZoneListByCountry: TimeZoneListByCountryOutputSchema,
	getPhoneGateways: PhoneGatewaysOutputSchema,
	getConferences: GetConferencesOutputSchema,
	getConferenceDetails: GetConferenceDetailsOutputSchema,
	createConference: CreateConferenceOutputSchema,
	updateConference: UpdateConferenceOutputSchema,
	deleteConference: DeleteConferenceOutputSchema,
	getConferenceFiles: GetConferenceFilesOutputSchema,
	getConferenceSkins: GetConferenceSkinsOutputSchema,
	sendInvitation: SendInvitationOutputSchema,
	generateAutologinUrl: GenerateAutologinUrlOutputSchema,
	createAccessTokens: CreateAccessTokensOutputSchema,
	listAccessTokens: ListAccessTokensOutputSchema,
	getTokenByEmail: GetTokenByEmailOutputSchema,
	registerParticipant: RegisterParticipantOutputSchema,
	getRegistrations: GetRegistrationsOutputSchema,
	listRegistrationsByStatus: ListRegistrationsByStatusOutputSchema,
	createContact: CreateContactOutputSchema,
	getConferenceSessions: GetConferenceSessionsOutputSchema,
	getSessionDetails: GetSessionDetailsOutputSchema,
	getSessionAttendees: GetSessionAttendeesOutputSchema,
	getSessionAttendeeDetails: GetSessionAttendeeDetailsOutputSchema,
	generateSessionPdfReport: GenerateSessionPdfReportOutputSchema,
	getSessionRegistrations: GetSessionRegistrationsOutputSchema,
	getSessionPolls: GetSessionPollsOutputSchema,
	getSessionPollDetails: GetSessionPollDetailsOutputSchema,
	getSessionSurveys: GetSessionSurveysOutputSchema,
	getSessionSurveyDetails: GetSessionSurveyDetailsOutputSchema,
	getSessionQaHistory: GetSessionQaHistoryOutputSchema,
	getSessionRecordings: GetSessionRecordingsOutputSchema,
	getSessionRecordingDetails: GetSessionRecordingDetailsOutputSchema,
	deleteRecording: DeleteRecordingOutputSchema,
	deleteRecordings: DeleteRecordingsOutputSchema,
	getChats: GetChatsOutputSchema,
	getChatDetails: GetChatDetailsOutputSchema,
	getFileLibrary: GetFileLibraryOutputSchema,
	getFileDetails: GetFileDetailsOutputSchema,
	uploadFile: UploadFileOutputSchema,
	deleteFile: DeleteFileOutputSchema,
	downloadFile: DownloadFileOutputSchema,
} as const;
