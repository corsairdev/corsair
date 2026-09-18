import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	ChatsEndpoints,
	ConferencesEndpoints,
	FilesEndpoints,
	RecordingsEndpoints,
	RegistrationsEndpoints,
	SessionsEndpoints,
	TokensEndpoints,
	UtilityEndpoints,
} from './endpoints';
import type {
	ClickmeetingEndpointInputs,
	ClickmeetingEndpointOutputs,
} from './endpoints/types';
import {
	ClickmeetingEndpointInputSchemas,
	ClickmeetingEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClickmeetingSchema } from './schema';

export type ClickmeetingPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalClickmeetingPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clickmeetingEndpointsNested>;
};

export type ClickmeetingContext = CorsairPluginContext<
	typeof ClickmeetingSchema,
	ClickmeetingPluginOptions
>;

export type ClickmeetingKeyBuilderContext =
	KeyBuilderContext<ClickmeetingPluginOptions>;

export type ClickmeetingBoundEndpoints = BindEndpoints<
	typeof clickmeetingEndpointsNested
>;

type ClickmeetingEndpoint<K extends keyof ClickmeetingEndpointOutputs> =
	CorsairEndpoint<
		ClickmeetingContext,
		ClickmeetingEndpointInputs[K],
		ClickmeetingEndpointOutputs[K]
	>;

export type ClickmeetingEndpoints = {
	// utility
	getPing: ClickmeetingEndpoint<'getPing'>;
	getTimeZoneList: ClickmeetingEndpoint<'getTimeZoneList'>;
	getTimeZoneListByCountry: ClickmeetingEndpoint<'getTimeZoneListByCountry'>;
	getPhoneGateways: ClickmeetingEndpoint<'getPhoneGateways'>;
	// conferences
	getConferences: ClickmeetingEndpoint<'getConferences'>;
	getConferenceDetails: ClickmeetingEndpoint<'getConferenceDetails'>;
	createConference: ClickmeetingEndpoint<'createConference'>;
	updateConference: ClickmeetingEndpoint<'updateConference'>;
	deleteConference: ClickmeetingEndpoint<'deleteConference'>;
	getConferenceFiles: ClickmeetingEndpoint<'getConferenceFiles'>;
	getConferenceSkins: ClickmeetingEndpoint<'getConferenceSkins'>;
	sendInvitation: ClickmeetingEndpoint<'sendInvitation'>;
	generateAutologinUrl: ClickmeetingEndpoint<'generateAutologinUrl'>;
	// tokens
	createAccessTokens: ClickmeetingEndpoint<'createAccessTokens'>;
	listAccessTokens: ClickmeetingEndpoint<'listAccessTokens'>;
	getTokenByEmail: ClickmeetingEndpoint<'getTokenByEmail'>;
	// registrations
	registerParticipant: ClickmeetingEndpoint<'registerParticipant'>;
	getRegistrations: ClickmeetingEndpoint<'getRegistrations'>;
	listRegistrationsByStatus: ClickmeetingEndpoint<'listRegistrationsByStatus'>;
	createContact: ClickmeetingEndpoint<'createContact'>;
	// sessions
	getConferenceSessions: ClickmeetingEndpoint<'getConferenceSessions'>;
	getSessionDetails: ClickmeetingEndpoint<'getSessionDetails'>;
	getSessionAttendees: ClickmeetingEndpoint<'getSessionAttendees'>;
	getSessionAttendeeDetails: ClickmeetingEndpoint<'getSessionAttendeeDetails'>;
	generateSessionPdfReport: ClickmeetingEndpoint<'generateSessionPdfReport'>;
	getSessionRegistrations: ClickmeetingEndpoint<'getSessionRegistrations'>;
	getSessionPolls: ClickmeetingEndpoint<'getSessionPolls'>;
	getSessionPollDetails: ClickmeetingEndpoint<'getSessionPollDetails'>;
	getSessionSurveys: ClickmeetingEndpoint<'getSessionSurveys'>;
	getSessionSurveyDetails: ClickmeetingEndpoint<'getSessionSurveyDetails'>;
	getSessionQaHistory: ClickmeetingEndpoint<'getSessionQaHistory'>;
	// recordings
	getSessionRecordings: ClickmeetingEndpoint<'getSessionRecordings'>;
	getSessionRecordingDetails: ClickmeetingEndpoint<'getSessionRecordingDetails'>;
	deleteRecording: ClickmeetingEndpoint<'deleteRecording'>;
	deleteRecordings: ClickmeetingEndpoint<'deleteRecordings'>;
	// chats
	getChats: ClickmeetingEndpoint<'getChats'>;
	getChatDetails: ClickmeetingEndpoint<'getChatDetails'>;
	// files
	getFileLibrary: ClickmeetingEndpoint<'getFileLibrary'>;
	getFileDetails: ClickmeetingEndpoint<'getFileDetails'>;
	uploadFile: ClickmeetingEndpoint<'uploadFile'>;
	deleteFile: ClickmeetingEndpoint<'deleteFile'>;
	downloadFile: ClickmeetingEndpoint<'downloadFile'>;
};

const clickmeetingEndpointsNested = {
	utility: {
		getPing: UtilityEndpoints.getPing,
		getTimeZoneList: UtilityEndpoints.getTimeZoneList,
		getTimeZoneListByCountry: UtilityEndpoints.getTimeZoneListByCountry,
		getPhoneGateways: UtilityEndpoints.getPhoneGateways,
	},
	conferences: {
		getConferences: ConferencesEndpoints.getConferences,
		getConferenceDetails: ConferencesEndpoints.getConferenceDetails,
		createConference: ConferencesEndpoints.createConference,
		updateConference: ConferencesEndpoints.updateConference,
		deleteConference: ConferencesEndpoints.deleteConference,
		getConferenceFiles: ConferencesEndpoints.getConferenceFiles,
		getConferenceSkins: ConferencesEndpoints.getConferenceSkins,
		sendInvitation: ConferencesEndpoints.sendInvitation,
		generateAutologinUrl: ConferencesEndpoints.generateAutologinUrl,
	},
	tokens: {
		createAccessTokens: TokensEndpoints.createAccessTokens,
		listAccessTokens: TokensEndpoints.listAccessTokens,
		getTokenByEmail: TokensEndpoints.getTokenByEmail,
	},
	registrations: {
		registerParticipant: RegistrationsEndpoints.registerParticipant,
		getRegistrations: RegistrationsEndpoints.getRegistrations,
		listRegistrationsByStatus: RegistrationsEndpoints.listRegistrationsByStatus,
		createContact: RegistrationsEndpoints.createContact,
	},
	sessions: {
		getConferenceSessions: SessionsEndpoints.getConferenceSessions,
		getSessionDetails: SessionsEndpoints.getSessionDetails,
		getSessionAttendees: SessionsEndpoints.getSessionAttendees,
		getSessionAttendeeDetails: SessionsEndpoints.getSessionAttendeeDetails,
		generateSessionPdfReport: SessionsEndpoints.generateSessionPdfReport,
		getSessionRegistrations: SessionsEndpoints.getSessionRegistrations,
		getSessionPolls: SessionsEndpoints.getSessionPolls,
		getSessionPollDetails: SessionsEndpoints.getSessionPollDetails,
		getSessionSurveys: SessionsEndpoints.getSessionSurveys,
		getSessionSurveyDetails: SessionsEndpoints.getSessionSurveyDetails,
		getSessionQaHistory: SessionsEndpoints.getSessionQaHistory,
	},
	recordings: {
		getSessionRecordings: RecordingsEndpoints.getSessionRecordings,
		getSessionRecordingDetails: RecordingsEndpoints.getSessionRecordingDetails,
		deleteRecording: RecordingsEndpoints.deleteRecording,
		deleteRecordings: RecordingsEndpoints.deleteRecordings,
	},
	chats: {
		getChats: ChatsEndpoints.getChats,
		getChatDetails: ChatsEndpoints.getChatDetails,
	},
	files: {
		getFileLibrary: FilesEndpoints.getFileLibrary,
		getFileDetails: FilesEndpoints.getFileDetails,
		uploadFile: FilesEndpoints.uploadFile,
		deleteFile: FilesEndpoints.deleteFile,
		downloadFile: FilesEndpoints.downloadFile,
	},
} as const;

const clickmeetingWebhooksNested = {} as const;

export const clickmeetingEndpointSchemas = {
	'utility.getPing': {
		input: ClickmeetingEndpointInputSchemas.getPing,
		output: ClickmeetingEndpointOutputSchemas.getPing,
	},
	'utility.getTimeZoneList': {
		input: ClickmeetingEndpointInputSchemas.getTimeZoneList,
		output: ClickmeetingEndpointOutputSchemas.getTimeZoneList,
	},
	'utility.getTimeZoneListByCountry': {
		input: ClickmeetingEndpointInputSchemas.getTimeZoneListByCountry,
		output: ClickmeetingEndpointOutputSchemas.getTimeZoneListByCountry,
	},
	'utility.getPhoneGateways': {
		input: ClickmeetingEndpointInputSchemas.getPhoneGateways,
		output: ClickmeetingEndpointOutputSchemas.getPhoneGateways,
	},
	'conferences.getConferences': {
		input: ClickmeetingEndpointInputSchemas.getConferences,
		output: ClickmeetingEndpointOutputSchemas.getConferences,
	},
	'conferences.getConferenceDetails': {
		input: ClickmeetingEndpointInputSchemas.getConferenceDetails,
		output: ClickmeetingEndpointOutputSchemas.getConferenceDetails,
	},
	'conferences.createConference': {
		input: ClickmeetingEndpointInputSchemas.createConference,
		output: ClickmeetingEndpointOutputSchemas.createConference,
	},
	'conferences.updateConference': {
		input: ClickmeetingEndpointInputSchemas.updateConference,
		output: ClickmeetingEndpointOutputSchemas.updateConference,
	},
	'conferences.deleteConference': {
		input: ClickmeetingEndpointInputSchemas.deleteConference,
		output: ClickmeetingEndpointOutputSchemas.deleteConference,
	},
	'conferences.getConferenceFiles': {
		input: ClickmeetingEndpointInputSchemas.getConferenceFiles,
		output: ClickmeetingEndpointOutputSchemas.getConferenceFiles,
	},
	'conferences.getConferenceSkins': {
		input: ClickmeetingEndpointInputSchemas.getConferenceSkins,
		output: ClickmeetingEndpointOutputSchemas.getConferenceSkins,
	},
	'conferences.sendInvitation': {
		input: ClickmeetingEndpointInputSchemas.sendInvitation,
		output: ClickmeetingEndpointOutputSchemas.sendInvitation,
	},
	'conferences.generateAutologinUrl': {
		input: ClickmeetingEndpointInputSchemas.generateAutologinUrl,
		output: ClickmeetingEndpointOutputSchemas.generateAutologinUrl,
	},
	'tokens.createAccessTokens': {
		input: ClickmeetingEndpointInputSchemas.createAccessTokens,
		output: ClickmeetingEndpointOutputSchemas.createAccessTokens,
	},
	'tokens.listAccessTokens': {
		input: ClickmeetingEndpointInputSchemas.listAccessTokens,
		output: ClickmeetingEndpointOutputSchemas.listAccessTokens,
	},
	'tokens.getTokenByEmail': {
		input: ClickmeetingEndpointInputSchemas.getTokenByEmail,
		output: ClickmeetingEndpointOutputSchemas.getTokenByEmail,
	},
	'registrations.registerParticipant': {
		input: ClickmeetingEndpointInputSchemas.registerParticipant,
		output: ClickmeetingEndpointOutputSchemas.registerParticipant,
	},
	'registrations.getRegistrations': {
		input: ClickmeetingEndpointInputSchemas.getRegistrations,
		output: ClickmeetingEndpointOutputSchemas.getRegistrations,
	},
	'registrations.listRegistrationsByStatus': {
		input: ClickmeetingEndpointInputSchemas.listRegistrationsByStatus,
		output: ClickmeetingEndpointOutputSchemas.listRegistrationsByStatus,
	},
	'registrations.createContact': {
		input: ClickmeetingEndpointInputSchemas.createContact,
		output: ClickmeetingEndpointOutputSchemas.createContact,
	},
	'sessions.getConferenceSessions': {
		input: ClickmeetingEndpointInputSchemas.getConferenceSessions,
		output: ClickmeetingEndpointOutputSchemas.getConferenceSessions,
	},
	'sessions.getSessionDetails': {
		input: ClickmeetingEndpointInputSchemas.getSessionDetails,
		output: ClickmeetingEndpointOutputSchemas.getSessionDetails,
	},
	'sessions.getSessionAttendees': {
		input: ClickmeetingEndpointInputSchemas.getSessionAttendees,
		output: ClickmeetingEndpointOutputSchemas.getSessionAttendees,
	},
	'sessions.getSessionAttendeeDetails': {
		input: ClickmeetingEndpointInputSchemas.getSessionAttendeeDetails,
		output: ClickmeetingEndpointOutputSchemas.getSessionAttendeeDetails,
	},
	'sessions.generateSessionPdfReport': {
		input: ClickmeetingEndpointInputSchemas.generateSessionPdfReport,
		output: ClickmeetingEndpointOutputSchemas.generateSessionPdfReport,
	},
	'sessions.getSessionRegistrations': {
		input: ClickmeetingEndpointInputSchemas.getSessionRegistrations,
		output: ClickmeetingEndpointOutputSchemas.getSessionRegistrations,
	},
	'sessions.getSessionPolls': {
		input: ClickmeetingEndpointInputSchemas.getSessionPolls,
		output: ClickmeetingEndpointOutputSchemas.getSessionPolls,
	},
	'sessions.getSessionPollDetails': {
		input: ClickmeetingEndpointInputSchemas.getSessionPollDetails,
		output: ClickmeetingEndpointOutputSchemas.getSessionPollDetails,
	},
	'sessions.getSessionSurveys': {
		input: ClickmeetingEndpointInputSchemas.getSessionSurveys,
		output: ClickmeetingEndpointOutputSchemas.getSessionSurveys,
	},
	'sessions.getSessionSurveyDetails': {
		input: ClickmeetingEndpointInputSchemas.getSessionSurveyDetails,
		output: ClickmeetingEndpointOutputSchemas.getSessionSurveyDetails,
	},
	'sessions.getSessionQaHistory': {
		input: ClickmeetingEndpointInputSchemas.getSessionQaHistory,
		output: ClickmeetingEndpointOutputSchemas.getSessionQaHistory,
	},
	'recordings.getSessionRecordings': {
		input: ClickmeetingEndpointInputSchemas.getSessionRecordings,
		output: ClickmeetingEndpointOutputSchemas.getSessionRecordings,
	},
	'recordings.getSessionRecordingDetails': {
		input: ClickmeetingEndpointInputSchemas.getSessionRecordingDetails,
		output: ClickmeetingEndpointOutputSchemas.getSessionRecordingDetails,
	},
	'recordings.deleteRecording': {
		input: ClickmeetingEndpointInputSchemas.deleteRecording,
		output: ClickmeetingEndpointOutputSchemas.deleteRecording,
	},
	'recordings.deleteRecordings': {
		input: ClickmeetingEndpointInputSchemas.deleteRecordings,
		output: ClickmeetingEndpointOutputSchemas.deleteRecordings,
	},
	'chats.getChats': {
		input: ClickmeetingEndpointInputSchemas.getChats,
		output: ClickmeetingEndpointOutputSchemas.getChats,
	},
	'chats.getChatDetails': {
		input: ClickmeetingEndpointInputSchemas.getChatDetails,
		output: ClickmeetingEndpointOutputSchemas.getChatDetails,
	},
	'files.getFileLibrary': {
		input: ClickmeetingEndpointInputSchemas.getFileLibrary,
		output: ClickmeetingEndpointOutputSchemas.getFileLibrary,
	},
	'files.getFileDetails': {
		input: ClickmeetingEndpointInputSchemas.getFileDetails,
		output: ClickmeetingEndpointOutputSchemas.getFileDetails,
	},
	'files.uploadFile': {
		input: ClickmeetingEndpointInputSchemas.uploadFile,
		output: ClickmeetingEndpointOutputSchemas.uploadFile,
	},
	'files.deleteFile': {
		input: ClickmeetingEndpointInputSchemas.deleteFile,
		output: ClickmeetingEndpointOutputSchemas.deleteFile,
	},
	'files.downloadFile': {
		input: ClickmeetingEndpointInputSchemas.downloadFile,
		output: ClickmeetingEndpointOutputSchemas.downloadFile,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clickmeetingEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const clickmeetingEndpointMeta = {
	'utility.getPing': {
		riskLevel: 'read',
		description: 'Check ClickMeeting API service status',
	},
	'utility.getTimeZoneList': {
		riskLevel: 'read',
		description: 'Retrieve all available time zones supported by ClickMeeting',
	},
	'utility.getTimeZoneListByCountry': {
		riskLevel: 'read',
		description: 'Retrieve available time zones for a specific country',
	},
	'utility.getPhoneGateways': {
		riskLevel: 'read',
		description:
			'Retrieve available phone dial-in numbers for ClickMeeting webinars',
	},
	'conferences.getConferences': {
		riskLevel: 'read',
		description: 'Retrieve a list of conference rooms filtered by status',
	},
	'conferences.getConferenceDetails': {
		riskLevel: 'read',
		description:
			'Retrieve detailed information about a specific conference room',
	},
	'conferences.createConference': {
		riskLevel: 'write',
		description: 'Create a new ClickMeeting conference or webinar',
	},
	'conferences.updateConference': {
		riskLevel: 'write',
		description: 'Update an existing conference room parameters',
	},
	'conferences.deleteConference': {
		riskLevel: 'write',
		description: 'Delete a specific conference room',
	},
	'conferences.getConferenceFiles': {
		riskLevel: 'read',
		description:
			'Retrieve list of files uploaded to a specific conference room',
	},
	'conferences.getConferenceSkins': {
		riskLevel: 'read',
		description: 'Retrieve list of available conference room skins',
	},
	'conferences.sendInvitation': {
		riskLevel: 'write',
		description: 'Send invitation emails to participants for a conference',
	},
	'conferences.generateAutologinUrl': {
		riskLevel: 'write',
		description: 'Generate an autologin hash for a conference participant',
	},
	'tokens.createAccessTokens': {
		riskLevel: 'write',
		description: 'Generate access tokens for conference participants',
	},
	'tokens.listAccessTokens': {
		riskLevel: 'read',
		description: 'Retrieve all generated access tokens for a conference',
	},
	'tokens.getTokenByEmail': {
		riskLevel: 'read',
		description: 'Retrieve access tokens assigned to a specific email address',
	},
	'registrations.registerParticipant': {
		riskLevel: 'write',
		description: 'Register a participant for a conference room',
	},
	'registrations.getRegistrations': {
		riskLevel: 'read',
		description: 'Retrieve registrations for a conference room by status',
	},
	'registrations.listRegistrationsByStatus': {
		riskLevel: 'read',
		description: 'Retrieve registered participants filtered by status',
	},
	'registrations.createContact': {
		riskLevel: 'write',
		description: 'Create a new contact in your ClickMeeting account',
	},
	'sessions.getConferenceSessions': {
		riskLevel: 'read',
		description: 'Retrieve past sessions for a conference room',
	},
	'sessions.getSessionDetails': {
		riskLevel: 'read',
		description:
			'Retrieve detailed statistics for a specific past conference session',
	},
	'sessions.getSessionAttendees': {
		riskLevel: 'read',
		description: 'Retrieve list of attendees who participated in a session',
	},
	'sessions.getSessionAttendeeDetails': {
		riskLevel: 'read',
		description:
			'Retrieve details for a specific attendee in a conference session',
	},
	'sessions.generateSessionPdfReport': {
		riskLevel: 'write',
		description: 'Generate a PDF report containing analytics for a session',
	},
	'sessions.getSessionRegistrations': {
		riskLevel: 'read',
		description: 'Retrieve registrations for a specific session',
	},
	'sessions.getSessionPolls': {
		riskLevel: 'read',
		description: 'Retrieve poll data from a specific session',
	},
	'sessions.getSessionPollDetails': {
		riskLevel: 'read',
		description:
			'Retrieve details of a specific poll conducted during a session',
	},
	'sessions.getSessionSurveys': {
		riskLevel: 'read',
		description: 'Retrieve list of surveys conducted during a session',
	},
	'sessions.getSessionSurveyDetails': {
		riskLevel: 'read',
		description:
			'Retrieve details of a specific survey conducted during a session',
	},
	'sessions.getSessionQaHistory': {
		riskLevel: 'read',
		description: 'Retrieve Q&A history for a specific session',
	},
	'recordings.getSessionRecordings': {
		riskLevel: 'read',
		description: 'Retrieve all recordings for a conference room',
	},
	'recordings.getSessionRecordingDetails': {
		riskLevel: 'read',
		description:
			'Retrieve details of a specific recording for a conference room',
	},
	'recordings.deleteRecording': {
		riskLevel: 'write',
		description: 'Delete a specific recording from a conference room',
	},
	'recordings.deleteRecordings': {
		riskLevel: 'write',
		description: 'Delete all recordings for a conference room',
	},
	'chats.getChats': {
		riskLevel: 'read',
		description: 'Retrieve a list of all chat sessions',
	},
	'chats.getChatDetails': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific chat session',
	},
	'files.getFileLibrary': {
		riskLevel: 'read',
		description: 'Retrieve a list of files from ClickMeeting file library',
	},
	'files.getFileDetails': {
		riskLevel: 'read',
		description: 'Retrieve detailed information about a specific file',
	},
	'files.uploadFile': {
		riskLevel: 'write',
		description: 'Upload a file to the ClickMeeting file library',
	},
	'files.deleteFile': {
		riskLevel: 'write',
		description: 'Delete a file from the ClickMeeting file library',
	},
	'files.downloadFile': {
		riskLevel: 'read',
		description: 'Download file content from the ClickMeeting file library',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof clickmeetingEndpointsNested
>;

export const clickmeetingAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseClickmeetingPlugin<T extends ClickmeetingPluginOptions> =
	CorsairPlugin<
		'clickmeeting',
		typeof ClickmeetingSchema,
		typeof clickmeetingEndpointsNested,
		typeof clickmeetingWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalClickmeetingPlugin =
	BaseClickmeetingPlugin<ClickmeetingPluginOptions>;

export type ExternalClickmeetingPlugin<T extends ClickmeetingPluginOptions> =
	BaseClickmeetingPlugin<T>;

export function clickmeeting<const T extends ClickmeetingPluginOptions>(
	incomingOptions: ClickmeetingPluginOptions &
		T = {} as ClickmeetingPluginOptions & T,
): ExternalClickmeetingPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'clickmeeting',
		authConfig: clickmeetingAuthConfig,
		schema: ClickmeetingSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: clickmeetingEndpointsNested,
		webhooks: clickmeetingWebhooksNested,
		endpointMeta: clickmeetingEndpointMeta,
		endpointSchemas: clickmeetingEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClickmeetingKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('clickmeeting', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('clickmeeting', 'api_key');
		},
	} satisfies InternalClickmeetingPlugin;
}

export type {
	ClickmeetingEndpointInputs,
	ClickmeetingEndpointOutputs,
} from './endpoints/types';

export {
	ClickmeetingEndpointInputSchemas,
	ClickmeetingEndpointOutputSchemas,
} from './endpoints/types';
