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
import { tryGetStoredKey } from './client';
import {
	Chat,
	Files,
	Image,
	Models,
	Music,
	Speech,
	Video,
	Voice,
} from './endpoints';
import type {
	MinimaxEndpointInputs,
	MinimaxEndpointOutputs,
} from './endpoints/types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MinimaxSchema } from './schema';

export type MinimaxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMinimaxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the MiniMax plugin. Controls what the AI
	 * agent is allowed to do. Overrides use dot-notation paths from the
	 * MiniMax endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof minimaxEndpointsNested>;
};

export type MinimaxContext = CorsairPluginContext<
	typeof MinimaxSchema,
	MinimaxPluginOptions
>;

export type MinimaxKeyBuilderContext = KeyBuilderContext<MinimaxPluginOptions>;

export type MinimaxBoundEndpoints = BindEndpoints<
	typeof minimaxEndpointsNested
>;

type MinimaxEndpoint<K extends keyof MinimaxEndpointOutputs> = CorsairEndpoint<
	MinimaxContext,
	MinimaxEndpointInputs[K],
	MinimaxEndpointOutputs[K]
>;

export type MinimaxEndpoints = {
	[K in keyof MinimaxEndpointOutputs]: MinimaxEndpoint<K>;
};

const minimaxEndpointsNested = {
	chat: {
		completion: Chat.completion,
		createResponse: Chat.createResponse,
		estimateInputTokens: Chat.estimateInputTokens,
	},
	speech: {
		t2a: Speech.t2a,
		createAsyncTask: Speech.createAsyncTask,
		queryAsyncTask: Speech.queryAsyncTask,
	},
	voice: {
		list: Voice.list,
		clone: Voice.clone,
		design: Voice.design,
		delete: Voice.delete,
	},
	music: {
		generate: Music.generate,
		coverPreprocess: Music.coverPreprocess,
		generateLyrics: Music.generateLyrics,
	},
	image: {
		generate: Image.generate,
	},
	video: {
		generate: Video.generate,
		query: Video.query,
		generateV2: Video.generateV2,
		queryV2: Video.queryV2,
		listV2: Video.listV2,
		cancelOrDeleteV2: Video.cancelOrDeleteV2,
		contextIr: Video.contextIr,
		regenerate: Video.regenerate,
		templateGenerate: Video.templateGenerate,
		templateQuery: Video.templateQuery,
	},
	files: {
		list: Files.list,
		retrieve: Files.retrieve,
		delete: Files.delete,
	},
	models: {
		list: Models.list,
		retrieve: Models.retrieve,
		listAnthropic: Models.listAnthropic,
		retrieveAnthropic: Models.retrieveAnthropic,
	},
} as const;

export const minimaxEndpointSchemas = {
	'chat.completion': {
		input: MinimaxEndpointInputSchemas.chatCompletion,
		output: MinimaxEndpointOutputSchemas.chatCompletion,
	},
	'chat.createResponse': {
		input: MinimaxEndpointInputSchemas.chatCreateResponse,
		output: MinimaxEndpointOutputSchemas.chatCreateResponse,
	},
	'chat.estimateInputTokens': {
		input: MinimaxEndpointInputSchemas.chatEstimateInputTokens,
		output: MinimaxEndpointOutputSchemas.chatEstimateInputTokens,
	},
	'speech.t2a': {
		input: MinimaxEndpointInputSchemas.speechT2a,
		output: MinimaxEndpointOutputSchemas.speechT2a,
	},
	'speech.createAsyncTask': {
		input: MinimaxEndpointInputSchemas.speechCreateAsyncTask,
		output: MinimaxEndpointOutputSchemas.speechCreateAsyncTask,
	},
	'speech.queryAsyncTask': {
		input: MinimaxEndpointInputSchemas.speechQueryAsyncTask,
		output: MinimaxEndpointOutputSchemas.speechQueryAsyncTask,
	},
	'voice.list': {
		input: MinimaxEndpointInputSchemas.voiceList,
		output: MinimaxEndpointOutputSchemas.voiceList,
	},
	'voice.clone': {
		input: MinimaxEndpointInputSchemas.voiceClone,
		output: MinimaxEndpointOutputSchemas.voiceClone,
	},
	'voice.design': {
		input: MinimaxEndpointInputSchemas.voiceDesign,
		output: MinimaxEndpointOutputSchemas.voiceDesign,
	},
	'voice.delete': {
		input: MinimaxEndpointInputSchemas.voiceDelete,
		output: MinimaxEndpointOutputSchemas.voiceDelete,
	},
	'music.generate': {
		input: MinimaxEndpointInputSchemas.musicGenerate,
		output: MinimaxEndpointOutputSchemas.musicGenerate,
	},
	'music.coverPreprocess': {
		input: MinimaxEndpointInputSchemas.musicCoverPreprocess,
		output: MinimaxEndpointOutputSchemas.musicCoverPreprocess,
	},
	'music.generateLyrics': {
		input: MinimaxEndpointInputSchemas.musicGenerateLyrics,
		output: MinimaxEndpointOutputSchemas.musicGenerateLyrics,
	},
	'image.generate': {
		input: MinimaxEndpointInputSchemas.imageGenerate,
		output: MinimaxEndpointOutputSchemas.imageGenerate,
	},
	'video.generate': {
		input: MinimaxEndpointInputSchemas.videoGenerate,
		output: MinimaxEndpointOutputSchemas.videoGenerate,
	},
	'video.query': {
		input: MinimaxEndpointInputSchemas.videoQuery,
		output: MinimaxEndpointOutputSchemas.videoQuery,
	},
	'video.generateV2': {
		input: MinimaxEndpointInputSchemas.videoGenerateV2,
		output: MinimaxEndpointOutputSchemas.videoGenerateV2,
	},
	'video.queryV2': {
		input: MinimaxEndpointInputSchemas.videoQueryV2,
		output: MinimaxEndpointOutputSchemas.videoQueryV2,
	},
	'video.listV2': {
		input: MinimaxEndpointInputSchemas.videoListV2,
		output: MinimaxEndpointOutputSchemas.videoListV2,
	},
	'video.cancelOrDeleteV2': {
		input: MinimaxEndpointInputSchemas.videoCancelOrDeleteV2,
		output: MinimaxEndpointOutputSchemas.videoCancelOrDeleteV2,
	},
	'video.contextIr': {
		input: MinimaxEndpointInputSchemas.videoContextIr,
		output: MinimaxEndpointOutputSchemas.videoContextIr,
	},
	'video.regenerate': {
		input: MinimaxEndpointInputSchemas.videoRegenerate,
		output: MinimaxEndpointOutputSchemas.videoRegenerate,
	},
	'video.templateGenerate': {
		input: MinimaxEndpointInputSchemas.videoTemplateGenerate,
		output: MinimaxEndpointOutputSchemas.videoTemplateGenerate,
	},
	'video.templateQuery': {
		input: MinimaxEndpointInputSchemas.videoTemplateQuery,
		output: MinimaxEndpointOutputSchemas.videoTemplateQuery,
	},
	'files.list': {
		input: MinimaxEndpointInputSchemas.filesList,
		output: MinimaxEndpointOutputSchemas.filesList,
	},
	'files.retrieve': {
		input: MinimaxEndpointInputSchemas.filesRetrieve,
		output: MinimaxEndpointOutputSchemas.filesRetrieve,
	},
	'files.delete': {
		input: MinimaxEndpointInputSchemas.filesDelete,
		output: MinimaxEndpointOutputSchemas.filesDelete,
	},
	'models.list': {
		input: MinimaxEndpointInputSchemas.modelsList,
		output: MinimaxEndpointOutputSchemas.modelsList,
	},
	'models.retrieve': {
		input: MinimaxEndpointInputSchemas.modelsRetrieve,
		output: MinimaxEndpointOutputSchemas.modelsRetrieve,
	},
	'models.listAnthropic': {
		input: MinimaxEndpointInputSchemas.modelsListAnthropic,
		output: MinimaxEndpointOutputSchemas.modelsListAnthropic,
	},
	'models.retrieveAnthropic': {
		input: MinimaxEndpointInputSchemas.modelsRetrieveAnthropic,
		output: MinimaxEndpointOutputSchemas.modelsRetrieveAnthropic,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof minimaxEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const minimaxEndpointMeta = {
	'chat.completion': {
		riskLevel: 'read',
		description: 'Create a chat completion with a MiniMax text model',
	},
	'chat.createResponse': {
		riskLevel: 'read',
		description: 'Create a model response via the Responses API',
	},
	'chat.estimateInputTokens': {
		riskLevel: 'read',
		description: 'Estimate the input token count of a request',
	},
	'speech.t2a': {
		riskLevel: 'write',
		description: 'Synthesize speech from text (synchronous T2A)',
	},
	'speech.createAsyncTask': {
		riskLevel: 'write',
		description: 'Create an asynchronous long-text speech synthesis task',
	},
	'speech.queryAsyncTask': {
		riskLevel: 'read',
		description: 'Query the status of an asynchronous speech synthesis task',
	},
	'voice.list': {
		riskLevel: 'read',
		description: 'List system, cloned and generated voices',
	},
	'voice.clone': {
		riskLevel: 'write',
		description: 'Clone a voice from uploaded audio',
	},
	'voice.design': {
		riskLevel: 'write',
		description: 'Design a custom voice from a description',
	},
	'voice.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a generated voice permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'music.generate': {
		riskLevel: 'write',
		description: 'Generate a song from a prompt and lyrics',
	},
	'music.coverPreprocess': {
		riskLevel: 'write',
		description:
			'Preprocess reference audio for two-step music cover generation',
	},
	'music.generateLyrics': {
		riskLevel: 'write',
		description: 'Generate or edit song lyrics',
	},
	'image.generate': {
		riskLevel: 'write',
		description:
			'Generate images from a prompt, optionally with a subject reference',
	},
	'video.generate': {
		riskLevel: 'write',
		description:
			'Create a Hailuo video generation task (text, image, first/last frame or subject reference)',
	},
	'video.query': {
		riskLevel: 'read',
		description: 'Query a Hailuo video generation task',
	},
	'video.generateV2': {
		riskLevel: 'write',
		description: 'Create an H3 multimodal video generation task',
	},
	'video.queryV2': {
		riskLevel: 'read',
		description: 'Query an H3 video task by id',
	},
	'video.listV2': {
		riskLevel: 'read',
		description: 'List H3 video tasks from the last 7 days',
	},
	'video.cancelOrDeleteV2': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a queued task or delete a finished task record permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'video.contextIr': {
		riskLevel: 'write',
		description: 'Create an H3-Context-IR task that enriches a video prompt',
	},
	'video.regenerate': {
		riskLevel: 'write',
		description: 'Create a 2K video regeneration task',
	},
	'video.templateGenerate': {
		riskLevel: 'write',
		description: 'Create a Video Agent task from a template',
	},
	'video.templateQuery': {
		riskLevel: 'read',
		description: 'Query a Video Agent template generation task',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List uploaded files for a purpose',
	},
	'files.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve the metadata of an uploaded file',
	},
	'files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an uploaded file permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'models.list': {
		riskLevel: 'read',
		description: 'List available models (OpenAI-compatible)',
	},
	'models.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a model (OpenAI-compatible)',
	},
	'models.listAnthropic': {
		riskLevel: 'read',
		description: 'List available models (Anthropic-compatible)',
	},
	'models.retrieveAnthropic': {
		riskLevel: 'read',
		description: 'Retrieve a model (Anthropic-compatible)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof minimaxEndpointsNested>;

export const minimaxAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseMinimaxPlugin<T extends MinimaxPluginOptions> = CorsairPlugin<
	'minimax',
	typeof MinimaxSchema,
	typeof minimaxEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalMinimaxPlugin = BaseMinimaxPlugin<MinimaxPluginOptions>;

export type ExternalMinimaxPlugin<T extends MinimaxPluginOptions> =
	BaseMinimaxPlugin<T>;

export function minimax<const T extends MinimaxPluginOptions>(
	incomingOptions: MinimaxPluginOptions & T = {} as MinimaxPluginOptions & T,
): ExternalMinimaxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'minimax',
		authConfig: minimaxAuthConfig,
		schema: MinimaxSchema,
		options,
		hooks: options.hooks,
		endpoints: minimaxEndpointsNested,
		// MiniMax exposes no inbound webhooks with a verification spec: video,
		// music and speech generation are asynchronous and their results are
		// polled through the query endpoints (or delivered to a caller-supplied
		// callback_url, which MiniMax POSTs to without a documented signature).
		webhooks: {},
		endpointMeta: minimaxEndpointMeta,
		endpointSchemas: minimaxEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		// When no key is configured the keyBuilder throws AuthMissingError so
		// Core can surface its account-connect prompt instead of letting the
		// request fail at the provider.
		keyBuilder: async (ctx: MinimaxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('minimax', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalMinimaxPlugin;
}

export type {
	MinimaxEndpointInputs,
	MinimaxEndpointOutputs,
} from './endpoints/types';
