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
import { Endpoints } from './endpoints';
import type {
	GroqcloudEndpointInputs,
	GroqcloudEndpointOutputs,
} from './endpoints/types';
import {
	GroqcloudEndpointInputSchemas,
	GroqcloudEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GroqcloudSchema } from './schema';

export type GroqcloudPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGroqcloudPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof groqcloudEndpointsNested>;
};

export type GroqcloudContext = CorsairPluginContext<
	typeof GroqcloudSchema,
	GroqcloudPluginOptions
>;

export type GroqcloudKeyBuilderContext =
	KeyBuilderContext<GroqcloudPluginOptions>;

export type GroqcloudBoundEndpoints = BindEndpoints<
	typeof groqcloudEndpointsNested
>;

type GroqcloudEndpoint<K extends keyof GroqcloudEndpointOutputs> =
	CorsairEndpoint<
		GroqcloudContext,
		GroqcloudEndpointInputs[K],
		GroqcloudEndpointOutputs[K]
	>;

export type GroqcloudEndpoints = {
	audioCreateTranscription: GroqcloudEndpoint<'audioCreateTranscription'>;
	audioCreateTranslation: GroqcloudEndpoint<'audioCreateTranslation'>;
	audioListVoices: GroqcloudEndpoint<'audioListVoices'>;
	chatCreateCompletion: GroqcloudEndpoint<'chatCreateCompletion'>;
	chatCreateResponse: GroqcloudEndpoint<'chatCreateResponse'>;
	modelsListModels: GroqcloudEndpoint<'modelsListModels'>;
	modelsRetrieveModel: GroqcloudEndpoint<'modelsRetrieveModel'>;
};

const groqcloudEndpointsNested = {
	audio: {
		createTranscription: Endpoints.audio.createTranscription,
		createTranslation: Endpoints.audio.createTranslation,
		listVoices: Endpoints.audio.listVoices,
	},
	chat: {
		createCompletion: Endpoints.chat.createCompletion,
		createResponse: Endpoints.chat.createResponse,
	},
	models: {
		listModels: Endpoints.models.listModels,
		retrieveModel: Endpoints.models.retrieveModel,
	},
} as const;

export const groqcloudEndpointSchemas = {
	'audio.createTranscription': {
		input: GroqcloudEndpointInputSchemas.audioCreateTranscription,
		output: GroqcloudEndpointOutputSchemas.audioCreateTranscription,
	},
	'audio.createTranslation': {
		input: GroqcloudEndpointInputSchemas.audioCreateTranslation,
		output: GroqcloudEndpointOutputSchemas.audioCreateTranslation,
	},
	'audio.listVoices': {
		input: GroqcloudEndpointInputSchemas.audioListVoices,
		output: GroqcloudEndpointOutputSchemas.audioListVoices,
	},
	'chat.createCompletion': {
		input: GroqcloudEndpointInputSchemas.chatCreateCompletion,
		output: GroqcloudEndpointOutputSchemas.chatCreateCompletion,
	},
	'chat.createResponse': {
		input: GroqcloudEndpointInputSchemas.chatCreateResponse,
		output: GroqcloudEndpointOutputSchemas.chatCreateResponse,
	},
	'models.listModels': {
		input: GroqcloudEndpointInputSchemas.modelsListModels,
		output: GroqcloudEndpointOutputSchemas.modelsListModels,
	},
	'models.retrieveModel': {
		input: GroqcloudEndpointInputSchemas.modelsRetrieveModel,
		output: GroqcloudEndpointOutputSchemas.modelsRetrieveModel,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof groqcloudEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const groqcloudEndpointMeta = {
	'audio.createTranscription': {
		riskLevel: 'write',
		description: 'Transcribe an audio file into text',
	},
	'audio.createTranslation': {
		riskLevel: 'write',
		description: 'Translate an audio recording into English text',
	},
	'audio.listVoices': {
		riskLevel: 'read',
		description: 'Retrieve available TTS voices for Groq PlayAI models',
	},
	'chat.createCompletion': {
		riskLevel: 'write',
		description: 'Generate a chat completion from a list of messages',
	},
	'chat.createResponse': {
		riskLevel: 'write',
		description: 'Create a model response for the given input (Responses API)',
	},
	'models.listModels': {
		riskLevel: 'read',
		description: 'Retrieve currently available Groq models',
	},
	'models.retrieveModel': {
		riskLevel: 'read',
		description: 'Retrieve detailed metadata for a specific model',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof groqcloudEndpointsNested
>;

export const groqcloudAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGroqcloudPlugin<T extends GroqcloudPluginOptions> =
	CorsairPlugin<
		'groqcloud',
		typeof GroqcloudSchema,
		typeof groqcloudEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalGroqcloudPlugin =
	BaseGroqcloudPlugin<GroqcloudPluginOptions>;

export type ExternalGroqcloudPlugin<T extends GroqcloudPluginOptions> =
	BaseGroqcloudPlugin<T>;

export function groqcloud<const T extends GroqcloudPluginOptions>(
	incomingOptions: GroqcloudPluginOptions & T = {} as GroqcloudPluginOptions &
		T,
): ExternalGroqcloudPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'groqcloud',
		authConfig: groqcloudAuthConfig,
		schema: GroqcloudSchema,
		options: options,
		hooks: options.hooks,
		endpoints: groqcloudEndpointsNested,
		webhooks: {},
		endpointMeta: groqcloudEndpointMeta,
		endpointSchemas: groqcloudEndpointSchemas,
		webhookSchemas: {} as any,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GroqcloudKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalGroqcloudPlugin;
}

export type {
	GroqcloudEndpointInputs,
	GroqcloudEndpointOutputs,
} from './endpoints/types';
