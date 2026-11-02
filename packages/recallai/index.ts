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
import type {
	RecallaiEndpointInputs,
	RecallaiEndpointOutputs,
} from './endpoints/types';

import {
	RecallaiEndpointInputSchemas,
	RecallaiEndpointOutputSchemas,
	RecallaiBotActionInputSchemas,
} from './endpoints/types';
import {
	createBot,
	deleteBot,
	listBots,
	listMeetingMetadata,
	listParticipantEvents,
	listTranscripts,
	retrieveBot,
	retrieveMeetingMetadata,
	retrieveParticipantEvents,
	retrieveTranscript,
	updateParticipantEvents,
	updateBot,
	deleteBotMedia,
	leaveBotCall,
	outputAudio,
	stopOutputAudio,
	outputMedia,
	stopOutputMedia,
	startScreenshare,
	stopScreenshare,
	outputVideo,
	stopOutputVideo,
	pauseRecording,
	pinParticipant,
	resumeRecording,
	sendChatMessage,
	startRecording,
	stopRecording,
	createAsyncTranscript,
	deleteRecording,
	listRecording,
	retrieveRecording,
	updateRecording,
	listRealtimeEndpoints,
	retrieveRealtimeEndpoints,
	updateRealtimeEndpoints,
	listSdkUploads,
	recordingSchemas,
} from './endpoints';
import {
	ArtifactListInputSchema,
	ArtifactListResponseSchema,
	ArtifactResponseSchema,
	RetrieveArtifactInputSchema,
	UpdateParticipantEventsInputSchema,
} from './endpoints/artifact-types';
import { errorHandlers } from './error-handlers';
import { RecallaiSchema } from './schema';

export type RecallaiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRecallaiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof recallaiEndpointsNested>;
};

export type RecallaiContext = CorsairPluginContext<
	typeof RecallaiSchema,
	RecallaiPluginOptions
>;
export type RecallaiKeyBuilderContext =
	KeyBuilderContext<RecallaiPluginOptions>;
export type RecallaiBoundEndpoints = BindEndpoints<
	typeof recallaiEndpointsNested
>;

type RecallaiEndpoint<K extends keyof RecallaiEndpointOutputs> =
	CorsairEndpoint<
		RecallaiContext,
		RecallaiEndpointInputs[K],
		RecallaiEndpointOutputs[K]
	>;

export type RecallaiEndpoints = {
	listBots: RecallaiEndpoint<'listBots'>;
	createBot: RecallaiEndpoint<'createBot'>;
	retrieveBot: RecallaiEndpoint<'retrieveBot'>;
	updateBot: RecallaiEndpoint<'updateBot'>;
	deleteBot: RecallaiEndpoint<'deleteBot'>;
	deleteBotMedia: RecallaiEndpoint<'deleteBotMedia'>;
	leaveBotCall: RecallaiEndpoint<'leaveBotCall'>;
	outputAudio: RecallaiEndpoint<'outputAudio'>;
	stopOutputAudio: RecallaiEndpoint<'stopOutputAudio'>;
	outputMedia: RecallaiEndpoint<'outputMedia'>;
	stopOutputMedia: RecallaiEndpoint<'stopOutputMedia'>;
	startScreenshare: RecallaiEndpoint<'startScreenshare'>;
	stopScreenshare: RecallaiEndpoint<'stopScreenshare'>;
	outputVideo: RecallaiEndpoint<'outputVideo'>;
	stopOutputVideo: RecallaiEndpoint<'stopOutputVideo'>;
	pauseRecording: RecallaiEndpoint<'pauseRecording'>;
	pinParticipant: RecallaiEndpoint<'pinParticipant'>;
	resumeRecording: RecallaiEndpoint<'resumeRecording'>;
	sendChatMessage: RecallaiEndpoint<'sendChatMessage'>;
	startRecording: RecallaiEndpoint<'startRecording'>;
	stopRecording: RecallaiEndpoint<'stopRecording'>;
	listRecording: RecallaiEndpoint<'listRecording'>;
	retrieveRecording: RecallaiEndpoint<'retrieveRecording'>;
	updateRecording: RecallaiEndpoint<'updateRecording'>;
	deleteRecording: RecallaiEndpoint<'deleteRecording'>;
	createAsyncTranscript: RecallaiEndpoint<'createAsyncTranscript'>;
	listRealtimeEndpoints: RecallaiEndpoint<'listRealtimeEndpoints'>;
	retrieveRealtimeEndpoints: RecallaiEndpoint<'retrieveRealtimeEndpoints'>;
	updateRealtimeEndpoints: RecallaiEndpoint<'updateRealtimeEndpoints'>;
	listSdkUploads: RecallaiEndpoint<'listSdkUploads'>;
	listMeetingMetadata: RecallaiEndpoint<'listMeetingMetadata'>;
	retrieveMeetingMetadata: RecallaiEndpoint<'retrieveMeetingMetadata'>;
	listParticipantEvents: RecallaiEndpoint<'listParticipantEvents'>;
	retrieveParticipantEvents: RecallaiEndpoint<'retrieveParticipantEvents'>;
	updateParticipantEvents: RecallaiEndpoint<'updateParticipantEvents'>;
	listTranscripts: RecallaiEndpoint<'listTranscripts'>;
	retrieveTranscript: RecallaiEndpoint<'retrieveTranscript'>;
};

const recallaiEndpointsNested = {
	bots: {
		list: listBots,
		create: createBot,
		retrieve: retrieveBot,
		update: updateBot,
		delete: deleteBot,
	},
	botActions: {
		deleteBotMedia,
		leaveBotCall,
		outputAudio,
		stopOutputAudio,
		outputMedia,
		stopOutputMedia,
		startScreenshare,
		stopScreenshare,
		outputVideo,
		stopOutputVideo,
		pauseRecording,
		pinParticipant,
		resumeRecording,
		sendChatMessage,
		startRecording,
		stopRecording,
	},
	recordings: {
		list: listRecording,
		retrieve: retrieveRecording,
		update: updateRecording,
		delete: deleteRecording,
		createTranscript: createAsyncTranscript,
	},
	realtimeEndpoints: {
		list: listRealtimeEndpoints,
		retrieve: retrieveRealtimeEndpoints,
		update: updateRealtimeEndpoints,
	},
	sdkUploads: { list: listSdkUploads },
	meetingMetadata: {
		list: listMeetingMetadata,
		retrieve: retrieveMeetingMetadata,
	},
	participantEvents: {
		list: listParticipantEvents,
		retrieve: retrieveParticipantEvents,
		update: updateParticipantEvents,
	},
	transcripts: { list: listTranscripts, retrieve: retrieveTranscript },
} as const;

export const recallaiEndpointSchemas = {
	'bots.list': {
		input: RecallaiEndpointInputSchemas.listBots,
		output: RecallaiEndpointOutputSchemas.listBots,
	},
	'bots.create': {
		input: RecallaiEndpointInputSchemas.createBot,
		output: RecallaiEndpointOutputSchemas.createBot,
	},
	'bots.retrieve': {
		input: RecallaiEndpointInputSchemas.retrieveBot,
		output: RecallaiEndpointOutputSchemas.retrieveBot,
	},
	'bots.update': {
		input: RecallaiEndpointInputSchemas.updateBot,
		output: RecallaiEndpointOutputSchemas.updateBot,
	},
	'bots.delete': {
		input: RecallaiEndpointInputSchemas.deleteBot,
		output: RecallaiEndpointOutputSchemas.deleteBot,
	},
	'botActions.deleteBotMedia': {
		input: RecallaiBotActionInputSchemas.deleteBotMedia,
		output: RecallaiEndpointOutputSchemas.deleteBotMedia,
	},
	'botActions.leaveBotCall': {
		input: RecallaiBotActionInputSchemas.leaveBotCall,
		output: RecallaiEndpointOutputSchemas.leaveBotCall,
	},
	'botActions.outputAudio': {
		input: RecallaiBotActionInputSchemas.outputAudio,
		output: RecallaiEndpointOutputSchemas.outputAudio,
	},
	'botActions.stopOutputAudio': {
		input: RecallaiBotActionInputSchemas.outputAudio,
		output: RecallaiEndpointOutputSchemas.stopOutputAudio,
	},
	'botActions.outputMedia': {
		input: RecallaiBotActionInputSchemas.outputMedia,
		output: RecallaiEndpointOutputSchemas.outputMedia,
	},
	'botActions.stopOutputMedia': {
		input: RecallaiBotActionInputSchemas.outputMedia,
		output: RecallaiEndpointOutputSchemas.stopOutputMedia,
	},
	'botActions.startScreenshare': {
		input: RecallaiBotActionInputSchemas.outputScreenshare,
		output: RecallaiEndpointOutputSchemas.startScreenshare,
	},
	'botActions.stopScreenshare': {
		input: RecallaiBotActionInputSchemas.outputScreenshare,
		output: RecallaiEndpointOutputSchemas.stopScreenshare,
	},
	'botActions.outputVideo': {
		input: RecallaiBotActionInputSchemas.outputVideo,
		output: RecallaiEndpointOutputSchemas.outputVideo,
	},
	'botActions.stopOutputVideo': {
		input: RecallaiBotActionInputSchemas.outputVideo,
		output: RecallaiEndpointOutputSchemas.stopOutputVideo,
	},
	'botActions.pauseRecording': {
		input: RecallaiBotActionInputSchemas.pauseRecording,
		output: RecallaiEndpointOutputSchemas.pauseRecording,
	},
	'botActions.pinParticipant': {
		input: RecallaiBotActionInputSchemas.pinParticipant,
		output: RecallaiEndpointOutputSchemas.pinParticipant,
	},
	'botActions.resumeRecording': {
		input: RecallaiBotActionInputSchemas.resumeRecording,
		output: RecallaiEndpointOutputSchemas.resumeRecording,
	},
	'botActions.sendChatMessage': {
		input: RecallaiBotActionInputSchemas.sendChatMessage,
		output: RecallaiEndpointOutputSchemas.sendChatMessage,
	},
	'botActions.startRecording': {
		input: RecallaiBotActionInputSchemas.startRecording,
		output: RecallaiEndpointOutputSchemas.startRecording,
	},
	'botActions.stopRecording': {
		input: RecallaiBotActionInputSchemas.stopRecording,
		output: RecallaiEndpointOutputSchemas.stopRecording,
	},
	'recordings.list': {
		input: recordingSchemas.listRecording.input,
		output: recordingSchemas.listRecording.output,
	},
	'recordings.retrieve': {
		input: recordingSchemas.retrieveRecording.input,
		output: recordingSchemas.retrieveRecording.output,
	},
	'recordings.update': {
		input: recordingSchemas.updateRecording.input,
		output: recordingSchemas.updateRecording.output,
	},
	'recordings.delete': {
		input: recordingSchemas.deleteRecording.input,
		output: recordingSchemas.deleteRecording.output,
	},
	'recordings.createTranscript': {
		input: recordingSchemas.createAsyncTranscript.input,
		output: recordingSchemas.createAsyncTranscript.output,
	},
	'realtimeEndpoints.list': {
		input: recordingSchemas.listRealtimeEndpoints.input,
		output: recordingSchemas.listRealtimeEndpoints.output,
	},
	'realtimeEndpoints.retrieve': {
		input: recordingSchemas.retrieveRealtimeEndpoints.input,
		output: recordingSchemas.retrieveRealtimeEndpoints.output,
	},
	'realtimeEndpoints.update': {
		input: recordingSchemas.updateRealtimeEndpoints.input,
		output: recordingSchemas.updateRealtimeEndpoints.output,
	},
	'sdkUploads.list': {
		input: recordingSchemas.listSdkUploads.input,
		output: recordingSchemas.listSdkUploads.output,
	},
	'meetingMetadata.list': {
		input: ArtifactListInputSchema,
		output: ArtifactListResponseSchema,
	},
	'meetingMetadata.retrieve': {
		input: RetrieveArtifactInputSchema,
		output: ArtifactResponseSchema,
	},
	'participantEvents.list': {
		input: ArtifactListInputSchema,
		output: ArtifactListResponseSchema,
	},
	'participantEvents.retrieve': {
		input: RetrieveArtifactInputSchema,
		output: ArtifactResponseSchema,
	},
	'participantEvents.update': {
		input: UpdateParticipantEventsInputSchema,
		output: ArtifactResponseSchema,
	},
	'transcripts.list': {
		input: ArtifactListInputSchema,
		output: ArtifactListResponseSchema,
	},
	'transcripts.retrieve': {
		input: RetrieveArtifactInputSchema,
		output: ArtifactResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof recallaiEndpointsNested
>;

// unknown: endpoint trees contain nested groups and callable handlers, so the
// wrapper narrows each branch before applying its public Zod contract.
type RecallaiEndpointTree = Record<string, unknown>;
// unknown: the core invokes endpoint handlers with a context and input whose
// concrete types are recovered by the endpoint's public contract.
type RecallaiEndpointHandler = (
	ctx: unknown,
	input: unknown,
) => Promise<unknown>;

function withRecallaiSchemas<T extends RecallaiEndpointTree>(
	tree: T,
	prefix = '',
): T {
	const entries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				recallaiEndpointSchemas[
					operation as keyof typeof recallaiEndpointSchemas
				];
			if (!schema)
				throw new Error(`Missing Recall.ai endpoint schema for ${operation}`);
			const endpoint = value as RecallaiEndpointHandler;
			const validated: RecallaiEndpointHandler = async (ctx, input) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				withRecallaiSchemas(value as RecallaiEndpointTree, operation),
			];
		}
		return [key, value];
	});
	return Object.fromEntries(entries) as T;
}

const validatedRecallaiEndpointsNested = withRecallaiSchemas(
	recallaiEndpointsNested,
);

const recallaiEndpointMeta = {
	'bots.list': {
		riskLevel: 'read',
		description: 'List Recall.ai meeting bots',
	},
	'bots.create': {
		riskLevel: 'write',
		description: 'Create a Recall.ai meeting bot',
	},
	'bots.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai meeting bot',
	},
	'bots.update': {
		riskLevel: 'write',
		description: 'Update a Recall.ai meeting bot',
	},
	'bots.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Recall.ai meeting bot',
	},
	'botActions.deleteBotMedia': {
		riskLevel: 'destructive',
		description: 'Delete stored media for a Recall.ai bot',
	},
	'botActions.leaveBotCall': {
		riskLevel: 'destructive',
		description: 'Remove a Recall.ai bot from its meeting',
	},
	'botActions.outputAudio': {
		riskLevel: 'write',
		description: 'Output audio from a Recall.ai bot',
	},
	'botActions.stopOutputAudio': {
		riskLevel: 'write',
		description: 'Stop bot audio output in Recall.ai',
	},
	'botActions.outputMedia': {
		riskLevel: 'write',
		description: 'Start media output from a Recall.ai bot',
	},
	'botActions.stopOutputMedia': {
		riskLevel: 'write',
		description: 'Stop bot media output in Recall.ai',
	},
	'botActions.startScreenshare': {
		riskLevel: 'write',
		description: 'Start bot screenshare in Recall.ai',
	},
	'botActions.stopScreenshare': {
		riskLevel: 'write',
		description: 'Stop bot screenshare in Recall.ai',
	},
	'botActions.outputVideo': {
		riskLevel: 'write',
		description: 'Output video from a Recall.ai bot',
	},
	'botActions.stopOutputVideo': {
		riskLevel: 'write',
		description: 'Stop bot video output in Recall.ai',
	},
	'botActions.pauseRecording': {
		riskLevel: 'write',
		description: 'Pause a Recall.ai bot recording',
	},
	'botActions.pinParticipant': {
		riskLevel: 'write',
		description: 'Pin a participant for a Recall.ai bot',
	},
	'botActions.resumeRecording': {
		riskLevel: 'write',
		description: 'Resume a Recall.ai bot recording',
	},
	'botActions.sendChatMessage': {
		riskLevel: 'write',
		description: 'Send a chat message from a Recall.ai bot',
	},
	'botActions.startRecording': {
		riskLevel: 'write',
		description: 'Start a Recall.ai bot recording',
	},
	'botActions.stopRecording': {
		riskLevel: 'write',
		description: 'Stop a Recall.ai bot recording',
	},
	'recordings.list': {
		riskLevel: 'read',
		description: 'List Recall.ai recording artifacts',
	},
	'recordings.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai recording artifact',
	},
	'recordings.update': {
		riskLevel: 'write',
		description: 'Update Recall.ai recording metadata',
	},
	'recordings.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Recall.ai recording artifact',
	},
	'recordings.createTranscript': {
		riskLevel: 'write',
		description: 'Create an asynchronous Recall.ai transcript',
	},
	'realtimeEndpoints.list': {
		riskLevel: 'read',
		description: 'List Recall.ai real-time endpoints',
	},
	'realtimeEndpoints.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai real-time endpoint',
	},
	'realtimeEndpoints.update': {
		riskLevel: 'write',
		description: 'Update a Recall.ai real-time endpoint',
	},
	'sdkUploads.list': {
		riskLevel: 'read',
		description: 'List Recall.ai Desktop SDK uploads',
	},
	'meetingMetadata.list': {
		riskLevel: 'read',
		description: 'List Recall.ai meeting metadata artifacts',
	},
	'meetingMetadata.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai meeting metadata artifact',
	},
	'participantEvents.list': {
		riskLevel: 'read',
		description: 'List Recall.ai participant event artifacts',
	},
	'participantEvents.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai participant event artifact',
	},
	'participantEvents.update': {
		riskLevel: 'write',
		description: 'Update Recall.ai participant event metadata',
	},
	'transcripts.list': {
		riskLevel: 'read',
		description: 'List Recall.ai transcript artifacts',
	},
	'transcripts.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai transcript artifact',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof recallaiEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';
export const recallaiAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseRecallaiPlugin<T extends RecallaiPluginOptions> = CorsairPlugin<
	'recallai',
	typeof RecallaiSchema,
	typeof recallaiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalRecallaiPlugin = BaseRecallaiPlugin<RecallaiPluginOptions>;
export type ExternalRecallaiPlugin<T extends RecallaiPluginOptions> =
	BaseRecallaiPlugin<T>;

export function recallai<const T extends RecallaiPluginOptions>(
	incomingOptions: RecallaiPluginOptions & T = {} as RecallaiPluginOptions & T,
): ExternalRecallaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'recallai',
		authConfig: recallaiAuthConfig,
		schema: RecallaiSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedRecallaiEndpointsNested,
		webhooks: {},
		endpointMeta: recallaiEndpointMeta,
		endpointSchemas: recallaiEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: RecallaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('recallai', 'api_key');
		},
	} satisfies InternalRecallaiPlugin;
}

export type {
	RecallaiEndpointInputs,
	RecallaiEndpointOutputs,
} from './endpoints/types';
