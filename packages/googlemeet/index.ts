import type {
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
import { getValidAccessToken } from './client';
import type { GoogleMeetEndpointInputs, GoogleMeetEndpointOutputs } from './endpoints/types';
import { GoogleMeetEndpointInputSchemas, GoogleMeetEndpointOutputSchemas } from './endpoints/types';
import {
	SpacesEndpoints,
	ConferenceRecordsEndpoints,
	ParticipantsEndpoints,
	ParticipantSessionsEndpoints,
	RecordingsEndpoints,
	TranscriptsEndpoints,
	TranscriptEntriesEndpoints,
	SmartNotesEndpoints,
} from './endpoints';
import { GoogleMeetSchema } from './schema';
import { errorHandlers } from './error-handlers';

export const googleMeetAuthConfig = {
	oauth_2: {} as const,
} as const satisfies PluginAuthConfig;

export type GoogleMeetContext = CorsairPluginContext<
	typeof GoogleMeetSchema,
	GoogleMeetPluginOptions,
	undefined,
	typeof googleMeetAuthConfig
>;

type GoogleMeetEndpoint<K extends keyof GoogleMeetEndpointOutputs> = CorsairEndpoint<
	GoogleMeetContext,
	GoogleMeetEndpointInputs[K],
	GoogleMeetEndpointOutputs[K]
>;

export type GoogleMeetEndpoints = {
	spacesCreate: GoogleMeetEndpoint<'spacesCreate'>;
	spacesGet: GoogleMeetEndpoint<'spacesGet'>;
	spacesPatch: GoogleMeetEndpoint<'spacesPatch'>;
	spacesEndActiveConference: GoogleMeetEndpoint<'spacesEndActiveConference'>;
	conferenceRecordsGet: GoogleMeetEndpoint<'conferenceRecordsGet'>;
	conferenceRecordsList: GoogleMeetEndpoint<'conferenceRecordsList'>;
	participantsGet: GoogleMeetEndpoint<'participantsGet'>;
	participantsList: GoogleMeetEndpoint<'participantsList'>;
	participantSessionsGet: GoogleMeetEndpoint<'participantSessionsGet'>;
	participantSessionsList: GoogleMeetEndpoint<'participantSessionsList'>;
	recordingsGet: GoogleMeetEndpoint<'recordingsGet'>;
	recordingsList: GoogleMeetEndpoint<'recordingsList'>;
	transcriptsGet: GoogleMeetEndpoint<'transcriptsGet'>;
	transcriptsList: GoogleMeetEndpoint<'transcriptsList'>;
	transcriptEntriesGet: GoogleMeetEndpoint<'transcriptEntriesGet'>;
	transcriptEntriesList: GoogleMeetEndpoint<'transcriptEntriesList'>;
	smartNotesGet: GoogleMeetEndpoint<'smartNotesGet'>;
	smartNotesList: GoogleMeetEndpoint<'smartNotesList'>;
};

export type GoogleMeetBoundEndpoints = BindEndpoints<typeof googleMeetEndpointsNested>;

const googleMeetWebhooksNested = {} as const;

export const googleMeetEndpointsNested = {
	spaces: {
		create: SpacesEndpoints.create,
		get: SpacesEndpoints.get,
		patch: SpacesEndpoints.patch,
		endActiveConference: SpacesEndpoints.endActiveConference,
	},
	conferenceRecords: {
		get: ConferenceRecordsEndpoints.get,
		list: ConferenceRecordsEndpoints.list,
	},
	participants: {
		get: ParticipantsEndpoints.get,
		list: ParticipantsEndpoints.list,
	},
	participantSessions: {
		get: ParticipantSessionsEndpoints.get,
		list: ParticipantSessionsEndpoints.list,
	},
	recordings: {
		get: RecordingsEndpoints.get,
		list: RecordingsEndpoints.list,
	},
	transcripts: {
		get: TranscriptsEndpoints.get,
		list: TranscriptsEndpoints.list,
	},
	transcriptEntries: {
		get: TranscriptEntriesEndpoints.get,
		list: TranscriptEntriesEndpoints.list,
	},
	smartNotes: {
		get: SmartNotesEndpoints.get,
		list: SmartNotesEndpoints.list,
	},
} as const;

export const googlemeetEndpointSchemas = {
	'spaces.create': {
		input: GoogleMeetEndpointInputSchemas.spacesCreate,
		output: GoogleMeetEndpointOutputSchemas.spacesCreate,
	},
	'spaces.get': {
		input: GoogleMeetEndpointInputSchemas.spacesGet,
		output: GoogleMeetEndpointOutputSchemas.spacesGet,
	},
	'spaces.patch': {
		input: GoogleMeetEndpointInputSchemas.spacesPatch,
		output: GoogleMeetEndpointOutputSchemas.spacesPatch,
	},
	'spaces.endActiveConference': {
		input: GoogleMeetEndpointInputSchemas.spacesEndActiveConference,
		output: GoogleMeetEndpointOutputSchemas.spacesEndActiveConference,
	},
	'conferenceRecords.get': {
		input: GoogleMeetEndpointInputSchemas.conferenceRecordsGet,
		output: GoogleMeetEndpointOutputSchemas.conferenceRecordsGet,
	},
	'conferenceRecords.list': {
		input: GoogleMeetEndpointInputSchemas.conferenceRecordsList,
		output: GoogleMeetEndpointOutputSchemas.conferenceRecordsList,
	},
	'participants.get': {
		input: GoogleMeetEndpointInputSchemas.participantsGet,
		output: GoogleMeetEndpointOutputSchemas.participantsGet,
	},
	'participants.list': {
		input: GoogleMeetEndpointInputSchemas.participantsList,
		output: GoogleMeetEndpointOutputSchemas.participantsList,
	},
	'participantSessions.get': {
		input: GoogleMeetEndpointInputSchemas.participantSessionsGet,
		output: GoogleMeetEndpointOutputSchemas.participantSessionsGet,
	},
	'participantSessions.list': {
		input: GoogleMeetEndpointInputSchemas.participantSessionsList,
		output: GoogleMeetEndpointOutputSchemas.participantSessionsList,
	},
	'recordings.get': {
		input: GoogleMeetEndpointInputSchemas.recordingsGet,
		output: GoogleMeetEndpointOutputSchemas.recordingsGet,
	},
	'recordings.list': {
		input: GoogleMeetEndpointInputSchemas.recordingsList,
		output: GoogleMeetEndpointOutputSchemas.recordingsList,
	},
	'transcripts.get': {
		input: GoogleMeetEndpointInputSchemas.transcriptsGet,
		output: GoogleMeetEndpointOutputSchemas.transcriptsGet,
	},
	'transcripts.list': {
		input: GoogleMeetEndpointInputSchemas.transcriptsList,
		output: GoogleMeetEndpointOutputSchemas.transcriptsList,
	},
	'transcriptEntries.get': {
		input: GoogleMeetEndpointInputSchemas.transcriptEntriesGet,
		output: GoogleMeetEndpointOutputSchemas.transcriptEntriesGet,
	},
	'transcriptEntries.list': {
		input: GoogleMeetEndpointInputSchemas.transcriptEntriesList,
		output: GoogleMeetEndpointOutputSchemas.transcriptEntriesList,
	},
	'smartNotes.get': {
		input: GoogleMeetEndpointInputSchemas.smartNotesGet,
		output: GoogleMeetEndpointOutputSchemas.smartNotesGet,
	},
	'smartNotes.list': {
		input: GoogleMeetEndpointInputSchemas.smartNotesList,
		output: GoogleMeetEndpointOutputSchemas.smartNotesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof googleMeetEndpointsNested>;

const defaultAuthType = 'oauth_2' as const;

const googleMeetEndpointMeta = {
	'spaces.create': { riskLevel: 'write', description: 'Create a new meeting space' },
	'spaces.get': { riskLevel: 'read', description: 'Get a meeting space' },
	'spaces.patch': { riskLevel: 'write', description: 'Update a meeting space' },
	'spaces.endActiveConference': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'End an active conference [DESTRUCTIVE]',
	},
	'conferenceRecords.get': { riskLevel: 'read', description: 'Get a conference record' },
	'conferenceRecords.list': { riskLevel: 'read', description: 'List conference records' },
	'participants.get': { riskLevel: 'read', description: 'Get a participant' },
	'participants.list': { riskLevel: 'read', description: 'List participants' },
	'participantSessions.get': { riskLevel: 'read', description: 'Get a participant session' },
	'participantSessions.list': { riskLevel: 'read', description: 'List participant sessions' },
	'recordings.get': { riskLevel: 'read', description: 'Get a recording' },
	'recordings.list': { riskLevel: 'read', description: 'List recordings' },
	'transcripts.get': { riskLevel: 'read', description: 'Get a transcript' },
	'transcripts.list': { riskLevel: 'read', description: 'List transcripts' },
	'transcriptEntries.get': { riskLevel: 'read', description: 'Get a transcript entry' },
	'transcriptEntries.list': { riskLevel: 'read', description: 'List transcript entries' },
	'smartNotes.get': { riskLevel: 'read', description: 'Get smart notes' },
	'smartNotes.list': { riskLevel: 'read', description: 'List smart notes' },
} satisfies RequiredPluginEndpointMeta<typeof googleMeetEndpointsNested>;

export type GoogleMeetPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleMeetPlugin['hooks'];
	webhookHooks?: InternalGoogleMeetPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleMeetEndpointsNested>;
};

export type GoogleMeetKeyBuilderContext = KeyBuilderContext<
	GoogleMeetPluginOptions,
	typeof googleMeetAuthConfig
>;

export type BaseGoogleMeetPlugin<T extends GoogleMeetPluginOptions> = CorsairPlugin<
	'googlemeet',
	typeof GoogleMeetSchema,
	typeof googleMeetEndpointsNested,
	typeof googleMeetWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof googleMeetAuthConfig
>;

export type InternalGoogleMeetPlugin = BaseGoogleMeetPlugin<GoogleMeetPluginOptions>;

export type ExternalGoogleMeetPlugin<T extends GoogleMeetPluginOptions> =
	BaseGoogleMeetPlugin<T>;

export function googlemeet<const T extends GoogleMeetPluginOptions>(
	incomingOptions: GoogleMeetPluginOptions & T = {} as GoogleMeetPluginOptions & T,
): ExternalGoogleMeetPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlemeet',
		schema: GoogleMeetSchema,
		options: options,
		authConfig: googleMeetAuthConfig,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				'https://www.googleapis.com/auth/meetings.space.created',
				'https://www.googleapis.com/auth/meetings.space.readonly',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleMeetEndpointsNested,
		webhooks: googleMeetWebhooksNested,
		endpointMeta: googleMeetEndpointMeta,
		endpointSchemas: googlemeetEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleMeetKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new AuthMissingError('googlemeet', 'oauth_2');
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error(
						'[auth-missing:googlemeet:client_credentials]: Google Meet client credentials are missing',
					);
				}

				let result: Awaited<ReturnType<typeof getValidAccessToken>>;
				try {
					result = await getValidAccessToken({
						accessToken,
						expiresAt,
						refreshToken,
						clientId: res.client_id,
						clientSecret: res.client_secret,
					});
				} catch (error) {
					throw new Error(
						`[corsair:googlemeet] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await ctx.keys.set_access_token(result.accessToken);
						await ctx.keys.set_expires_at(String(result.expiresAt));
					} catch (error) {
						throw new Error(
							`[corsair:googlemeet] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				(ctx as Record<string, unknown>)._refreshAuth = async () => {
					const freshResult = await getValidAccessToken({
						accessToken: null,
						expiresAt: null,
						refreshToken,
						clientId: res.client_id!,
						clientSecret: res.client_secret!,
						forceRefresh: true,
					});
					await ctx.keys.set_access_token(freshResult.accessToken);
					await ctx.keys.set_expires_at(String(freshResult.expiresAt));
					return freshResult.accessToken;
				};

				return result.accessToken;
			}

			throw new AuthMissingError('googlemeet', 'oauth_2');
		},
	} satisfies InternalGoogleMeetPlugin;
}

export type {
	GoogleMeetEndpointInputs,
	GoogleMeetEndpointOutputs,
} from './endpoints/types';

export * from './error-handlers';
export { GoogleMeetSchema } from './schema';
