import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import type {
	FirefliesEndpointInputs,
	FirefliesEndpointOutputs,
} from './endpoints';
import {
	AiApp,
	AskFred,
	Audio,
	FirefliesEndpointInputSchemas,
	FirefliesEndpointOutputSchemas,
	Transcripts,
	Users,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { FirefliesSchema } from './schema';
import { MeetingWebhooks, TranscriptionWebhooks } from './webhooks';
import type {
	FirefliesWebhookOutputs,
	InMeetingEvent,
	MeetingDeletedEvent,
	NewMeetingEvent,
	TranscriptionCompleteEvent,
	TranscriptProcessingEvent,
} from './webhooks/types';
import {
	InMeetingPayloadSchema,
	MeetingDeletedPayloadSchema,
	NewMeetingPayloadSchema,
	TranscriptionCompletePayloadSchema,
	TranscriptProcessingPayloadSchema,
} from './webhooks/types';

export type FirefliesEndpoints = {
	transcriptsList: FirefliesEndpoint<
		'transcriptsList',
		FirefliesEndpointInputs['transcriptsList']
	>;
	transcriptsGet: FirefliesEndpoint<
		'transcriptsGet',
		FirefliesEndpointInputs['transcriptsGet']
	>;
	transcriptsGetAnalytics: FirefliesEndpoint<
		'transcriptsGetAnalytics',
		FirefliesEndpointInputs['transcriptsGetAnalytics']
	>;
	transcriptsGetAudioUrl: FirefliesEndpoint<
		'transcriptsGetAudioUrl',
		FirefliesEndpointInputs['transcriptsGetAudioUrl']
	>;
	transcriptsGetVideoUrl: FirefliesEndpoint<
		'transcriptsGetVideoUrl',
		FirefliesEndpointInputs['transcriptsGetVideoUrl']
	>;
	transcriptsGetSummary: FirefliesEndpoint<
		'transcriptsGetSummary',
		FirefliesEndpointInputs['transcriptsGetSummary']
	>;
	usersGetCurrent: FirefliesEndpoint<
		'usersGetCurrent',
		FirefliesEndpointInputs['usersGetCurrent']
	>;
	usersList: FirefliesEndpoint<
		'usersList',
		FirefliesEndpointInputs['usersList']
	>;
	askFredGetThreads: FirefliesEndpoint<
		'askFredGetThreads',
		FirefliesEndpointInputs['askFredGetThreads']
	>;
	askFredGetThread: FirefliesEndpoint<
		'askFredGetThread',
		FirefliesEndpointInputs['askFredGetThread']
	>;
	askFredCreateThread: FirefliesEndpoint<
		'askFredCreateThread',
		FirefliesEndpointInputs['askFredCreateThread']
	>;
	askFredContinueThread: FirefliesEndpoint<
		'askFredContinueThread',
		FirefliesEndpointInputs['askFredContinueThread']
	>;
	askFredDeleteThread: FirefliesEndpoint<
		'askFredDeleteThread',
		FirefliesEndpointInputs['askFredDeleteThread']
	>;
	audioUpload: FirefliesEndpoint<
		'audioUpload',
		FirefliesEndpointInputs['audioUpload']
	>;
	aiAppGetOutputs: FirefliesEndpoint<
		'aiAppGetOutputs',
		FirefliesEndpointInputs['aiAppGetOutputs']
	>;
};

export type FirefliesWebhooks = {
	transcriptionComplete: FirefliesWebhook<
		'transcriptionComplete',
		TranscriptionCompleteEvent
	>;
	transcriptProcessing: FirefliesWebhook<
		'transcriptProcessing',
		TranscriptProcessingEvent
	>;
	newMeeting: FirefliesWebhook<'newMeeting', NewMeetingEvent>;
	inMeeting: FirefliesWebhook<'inMeeting', InMeetingEvent>;
	meetingDeleted: FirefliesWebhook<'meetingDeleted', MeetingDeletedEvent>;
};

const firefliesEndpointsNested = {
	transcripts: {
		list: Transcripts.list,
		get: Transcripts.get,
		getAnalytics: Transcripts.getAnalytics,
		getAudioUrl: Transcripts.getAudioUrl,
		getVideoUrl: Transcripts.getVideoUrl,
		getSummary: Transcripts.getSummary,
	},
	users: {
		getCurrent: Users.getCurrent,
		list: Users.list,
	},
	askFred: {
		getThreads: AskFred.getThreads,
		getThread: AskFred.getThread,
		createThread: AskFred.createThread,
		continueThread: AskFred.continueThread,
		deleteThread: AskFred.deleteThread,
	},
	audio: {
		upload: Audio.upload,
	},
	aiApp: {
		getOutputs: AiApp.getOutputs,
	},
} as const;

const firefliesWebhooksNested = {
	transcriptions: {
		transcriptionComplete: TranscriptionWebhooks.transcriptionComplete,
		transcriptProcessing: TranscriptionWebhooks.transcriptProcessing,
	},
	meetings: {
		newMeeting: MeetingWebhooks.newMeeting,
		inMeeting: MeetingWebhooks.inMeeting,
		meetingDeleted: MeetingWebhooks.meetingDeleted,
	},
} as const;

export const firefliesEndpointSchemas = {
	'transcripts.list': {
		input: FirefliesEndpointInputSchemas.transcriptsList,
		output: FirefliesEndpointOutputSchemas.transcriptsList,
	},
	'transcripts.get': {
		input: FirefliesEndpointInputSchemas.transcriptsGet,
		output: FirefliesEndpointOutputSchemas.transcriptsGet,
	},
	'transcripts.getAnalytics': {
		input: FirefliesEndpointInputSchemas.transcriptsGetAnalytics,
		output: FirefliesEndpointOutputSchemas.transcriptsGetAnalytics,
	},
	'transcripts.getAudioUrl': {
		input: FirefliesEndpointInputSchemas.transcriptsGetAudioUrl,
		output: FirefliesEndpointOutputSchemas.transcriptsGetAudioUrl,
	},
	'transcripts.getVideoUrl': {
		input: FirefliesEndpointInputSchemas.transcriptsGetVideoUrl,
		output: FirefliesEndpointOutputSchemas.transcriptsGetVideoUrl,
	},
	'transcripts.getSummary': {
		input: FirefliesEndpointInputSchemas.transcriptsGetSummary,
		output: FirefliesEndpointOutputSchemas.transcriptsGetSummary,
	},
	'users.getCurrent': {
		input: FirefliesEndpointInputSchemas.usersGetCurrent,
		output: FirefliesEndpointOutputSchemas.usersGetCurrent,
	},
	'users.list': {
		input: FirefliesEndpointInputSchemas.usersList,
		output: FirefliesEndpointOutputSchemas.usersList,
	},
	'askFred.getThreads': {
		input: FirefliesEndpointInputSchemas.askFredGetThreads,
		output: FirefliesEndpointOutputSchemas.askFredGetThreads,
	},
	'askFred.getThread': {
		input: FirefliesEndpointInputSchemas.askFredGetThread,
		output: FirefliesEndpointOutputSchemas.askFredGetThread,
	},
	'askFred.createThread': {
		input: FirefliesEndpointInputSchemas.askFredCreateThread,
		output: FirefliesEndpointOutputSchemas.askFredCreateThread,
	},
	'askFred.continueThread': {
		input: FirefliesEndpointInputSchemas.askFredContinueThread,
		output: FirefliesEndpointOutputSchemas.askFredContinueThread,
	},
	'askFred.deleteThread': {
		input: FirefliesEndpointInputSchemas.askFredDeleteThread,
		output: FirefliesEndpointOutputSchemas.askFredDeleteThread,
	},
	'audio.upload': {
		input: FirefliesEndpointInputSchemas.audioUpload,
		output: FirefliesEndpointOutputSchemas.audioUpload,
	},
	'aiApp.getOutputs': {
		input: FirefliesEndpointInputSchemas.aiAppGetOutputs,
		output: FirefliesEndpointOutputSchemas.aiAppGetOutputs,
	},
} as const;

const firefliesEndpointMeta = {
	'transcripts.list': {
		riskLevel: 'read',
		description: 'List transcripts with optional filters',
	},
	'transcripts.get': {
		riskLevel: 'read',
		description: 'Get a single transcript by ID with full details',
	},
	'transcripts.getAnalytics': {
		riskLevel: 'read',
		description: 'Get analytics data for a transcript',
	},
	'transcripts.getAudioUrl': {
		riskLevel: 'read',
		description: 'Get the audio URL for a transcript',
	},
	'transcripts.getVideoUrl': {
		riskLevel: 'read',
		description: 'Get the video URL for a transcript',
	},
	'transcripts.getSummary': {
		riskLevel: 'read',
		description: 'Get the AI-generated summary for a transcript',
	},
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Get the current authenticated user',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List all users in the workspace',
	},
	'askFred.getThreads': {
		riskLevel: 'read',
		description: 'Get all AskFred conversation threads for a transcript',
	},
	'askFred.getThread': {
		riskLevel: 'read',
		description: 'Get a single AskFred conversation thread by ID',
	},
	'askFred.createThread': {
		riskLevel: 'write',
		description: 'Create a new AskFred conversation thread',
	},
	'askFred.continueThread': {
		riskLevel: 'write',
		description: 'Continue an existing AskFred conversation thread',
	},
	'askFred.deleteThread': {
		riskLevel: 'destructive',
		description: 'Delete an AskFred conversation thread [DESTRUCTIVE]',
	},
	'audio.upload': {
		riskLevel: 'write',
		description: 'Upload an audio file for transcription',
	},
	'aiApp.getOutputs': {
		riskLevel: 'read',
		description: 'Get the outputs of an AI app for a transcript',
	},
} satisfies RequiredPluginEndpointMeta<typeof firefliesEndpointsNested>;

const firefliesWebhookSchemas = {
	'transcriptions.transcriptionComplete': {
		description: 'Transcription is complete and available',
		payload: TranscriptionCompletePayloadSchema,
		response: TranscriptionCompletePayloadSchema,
	},
	'transcriptions.transcriptProcessing': {
		description: 'Transcript is being processed',
		payload: TranscriptProcessingPayloadSchema,
		response: TranscriptProcessingPayloadSchema,
	},
	'meetings.newMeeting': {
		description: 'A new meeting has been detected',
		payload: NewMeetingPayloadSchema,
		response: NewMeetingPayloadSchema,
	},
	'meetings.inMeeting': {
		description: 'Fireflies bot has joined a meeting',
		payload: InMeetingPayloadSchema,
		response: InMeetingPayloadSchema,
	},
	'meetings.meetingDeleted': {
		description: 'A meeting has been deleted',
		payload: MeetingDeletedPayloadSchema,
		response: MeetingDeletedPayloadSchema,
	},
} as const;

type FirefliesEndpoint<
	K extends keyof FirefliesEndpointOutputs,
	Input,
> = CorsairEndpoint<FirefliesContext, Input, FirefliesEndpointOutputs[K]>;

type FirefliesWebhook<
	K extends keyof FirefliesWebhookOutputs,
	TEvent,
> = CorsairWebhook<FirefliesContext, TEvent, FirefliesWebhookOutputs[K]>;

const defaultAuthType = 'api_key' as const;

export const firefliesAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type FirefliesBoundEndpoints = BindEndpoints<
	typeof firefliesEndpointsNested
>;
export type FirefliesBoundWebhooks = BindWebhooks<FirefliesWebhooks>;

export type FirefliesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFirefliesPlugin['hooks'];
	webhookHooks?: InternalFirefliesPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof firefliesEndpointsNested>;
};

export type FirefliesContext = CorsairPluginContext<
	typeof FirefliesSchema,
	FirefliesPluginOptions
>;

export type FirefliesKeyBuilderContext =
	KeyBuilderContext<FirefliesPluginOptions>;

export type BaseFirefliesPlugin<T extends FirefliesPluginOptions> =
	CorsairPlugin<
		'fireflies',
		typeof FirefliesSchema,
		typeof firefliesEndpointsNested,
		typeof firefliesWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalFirefliesPlugin =
	BaseFirefliesPlugin<FirefliesPluginOptions>;

export type ExternalFirefliesPlugin<T extends FirefliesPluginOptions> =
	BaseFirefliesPlugin<T>;

export function fireflies<const T extends FirefliesPluginOptions>(
	// {} as FirefliesPluginOptions & T: default to empty options; T extends FirefliesPluginOptions so the cast is safe
	incomingOptions: FirefliesPluginOptions & T = {} as FirefliesPluginOptions &
		T,
): ExternalFirefliesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fireflies',
		schema: FirefliesSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: firefliesEndpointsNested,
		webhooks: firefliesWebhooksNested,
		endpointMeta: firefliesEndpointMeta,
		endpointSchemas: firefliesEndpointSchemas,
		webhookSchemas: firefliesWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-fireflies-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FirefliesKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalFirefliesPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	FirefliesWebhookOutputs,
	FirefliesWebhookPayload,
	InMeetingEvent,
	MeetingDeletedEvent,
	NewMeetingEvent,
	TranscriptionCompleteEvent,
	TranscriptProcessingEvent,
} from './webhooks/types';

export { createFirefliesMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AiAppGetOutputsResponse,
	AskFredContinueThreadResponse,
	AskFredCreateThreadResponse,
	AskFredDeleteThreadResponse,
	AskFredGetThreadResponse,
	AskFredGetThreadsResponse,
	AudioUploadResponse,
	FirefliesEndpointInputs,
	FirefliesEndpointOutputs,
	TranscriptsGetAnalyticsResponse,
	TranscriptsGetAudioUrlResponse,
	TranscriptsGetResponse,
	TranscriptsGetSummaryResponse,
	TranscriptsGetVideoUrlResponse,
	TranscriptsListResponse,
	UsersGetCurrentResponse,
	UsersListResponse,
} from './endpoints/types';
