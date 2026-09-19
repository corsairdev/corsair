import type {
	BindEndpoints,
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
import { GladiaEndpoints } from './endpoints';
import type {
	GladiaEndpointInputs,
	GladiaEndpointOutputs,
} from './endpoints/types';
import {
	GladiaEndpointInputSchemas,
	GladiaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GladiaSchema } from './schema';

export type GladiaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGladiaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gladiaEndpointsNested>;
};

export type GladiaContext = CorsairPluginContext<
	typeof GladiaSchema,
	GladiaPluginOptions
>;
export type GladiaKeyBuilderContext = KeyBuilderContext<GladiaPluginOptions>;
export type GladiaBoundEndpoints = BindEndpoints<typeof gladiaEndpointsNested>;

type GladiaEndpoint<K extends keyof GladiaEndpointOutputs> = (
	ctx: GladiaContext,
	input: GladiaEndpointInputs[K],
) => Promise<GladiaEndpointOutputs[K]>;

export type GladiaEndpoints = {
	uploadAudioVideoFile: GladiaEndpoint<'uploadAudioVideoFile'>;
	initiateLiveTranscriptionSession: GladiaEndpoint<'initiateLiveTranscriptionSession'>;
	listLiveTranscriptionJobs: GladiaEndpoint<'listLiveTranscriptionJobs'>;
	getLiveTranscriptionResult: GladiaEndpoint<'getLiveTranscriptionResult'>;
	deleteLiveSession: GladiaEndpoint<'deleteLiveSession'>;
	initiatePreRecordedTranscription: GladiaEndpoint<'initiatePreRecordedTranscription'>;
	listPreRecordedJobs: GladiaEndpoint<'listPreRecordedJobs'>;
	getPreRecordedJob: GladiaEndpoint<'getPreRecordedJob'>;
	deletePreRecordedJob: GladiaEndpoint<'deletePreRecordedJob'>;
};

const gladiaEndpointsNested = {
	upload: { audioVideoFile: GladiaEndpoints.uploadAudioVideoFile },
	live: {
		initiateTranscriptionSession:
			GladiaEndpoints.initiateLiveTranscriptionSession,
		listTranscriptionJobs: GladiaEndpoints.listLiveTranscriptionJobs,
		getTranscriptionResult: GladiaEndpoints.getLiveTranscriptionResult,
		deleteSession: GladiaEndpoints.deleteLiveSession,
	},
	preRecorded: {
		initiateTranscription: GladiaEndpoints.initiatePreRecordedTranscription,
		listJobs: GladiaEndpoints.listPreRecordedJobs,
		getJob: GladiaEndpoints.getPreRecordedJob,
		deleteJob: GladiaEndpoints.deletePreRecordedJob,
	},
} as const;

export const gladiaEndpointSchemas = {
	'upload.audioVideoFile': {
		input: GladiaEndpointInputSchemas.uploadAudioVideoFile,
		output: GladiaEndpointOutputSchemas.uploadAudioVideoFile,
	},
	'live.initiateTranscriptionSession': {
		input: GladiaEndpointInputSchemas.initiateLiveTranscriptionSession,
		output: GladiaEndpointOutputSchemas.initiateLiveTranscriptionSession,
	},
	'live.listTranscriptionJobs': {
		input: GladiaEndpointInputSchemas.listLiveTranscriptionJobs,
		output: GladiaEndpointOutputSchemas.listLiveTranscriptionJobs,
	},
	'live.getTranscriptionResult': {
		input: GladiaEndpointInputSchemas.getLiveTranscriptionResult,
		output: GladiaEndpointOutputSchemas.getLiveTranscriptionResult,
	},
	'live.deleteSession': {
		input: GladiaEndpointInputSchemas.deleteLiveSession,
		output: GladiaEndpointOutputSchemas.deleteLiveSession,
	},
	'preRecorded.initiateTranscription': {
		input: GladiaEndpointInputSchemas.initiatePreRecordedTranscription,
		output: GladiaEndpointOutputSchemas.initiatePreRecordedTranscription,
	},
	'preRecorded.listJobs': {
		input: GladiaEndpointInputSchemas.listPreRecordedJobs,
		output: GladiaEndpointOutputSchemas.listPreRecordedJobs,
	},
	'preRecorded.getJob': {
		input: GladiaEndpointInputSchemas.getPreRecordedJob,
		output: GladiaEndpointOutputSchemas.getPreRecordedJob,
	},
	'preRecorded.deleteJob': {
		input: GladiaEndpointInputSchemas.deletePreRecordedJob,
		output: GladiaEndpointOutputSchemas.deletePreRecordedJob,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gladiaEndpointsNested
>;

const gladiaEndpointMeta = {
	'upload.audioVideoFile': {
		riskLevel: 'write',
		description: 'Upload an audio or video file for a pre-recorded job',
	},
	'live.initiateTranscriptionSession': {
		riskLevel: 'write',
		description:
			'Create a live transcription session and return its WebSocket URL',
	},
	'live.listTranscriptionJobs': {
		riskLevel: 'read',
		description: 'List live transcription jobs with pagination and filters',
	},
	'live.getTranscriptionResult': {
		riskLevel: 'read',
		description: 'Retrieve a live transcription session result',
	},
	'live.deleteSession': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a live transcription session',
	},
	'preRecorded.initiateTranscription': {
		riskLevel: 'write',
		description: 'Start a pre-recorded transcription job',
	},
	'preRecorded.listJobs': {
		riskLevel: 'read',
		description:
			'List pre-recorded transcription jobs with pagination and filters',
	},
	'preRecorded.getJob': {
		riskLevel: 'read',
		description: 'Retrieve a pre-recorded transcription job and result',
	},
	'preRecorded.deleteJob': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a pre-recorded transcription job',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gladiaEndpointsNested>;

const defaultAuthType = 'api_key' as const;
export const gladiaAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseGladiaPlugin<T extends GladiaPluginOptions> = CorsairPlugin<
	'gladia',
	typeof GladiaSchema,
	typeof gladiaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalGladiaPlugin = BaseGladiaPlugin<GladiaPluginOptions>;
export type ExternalGladiaPlugin<T extends GladiaPluginOptions> =
	BaseGladiaPlugin<T>;

export function gladia<const T extends GladiaPluginOptions>(
	incomingOptions: GladiaPluginOptions & T = {} as GladiaPluginOptions & T,
): ExternalGladiaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gladia',
		authConfig: gladiaAuthConfig,
		schema: GladiaSchema,
		options,
		hooks: options.hooks,
		endpoints: gladiaEndpointsNested,
		webhooks: {},
		endpointMeta: gladiaEndpointMeta,
		endpointSchemas: gladiaEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: GladiaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('gladia', 'api_key');
		},
	} satisfies InternalGladiaPlugin;
}

export type {
	GladiaEndpointInputs,
	GladiaEndpointOutputs,
} from './endpoints/types';
