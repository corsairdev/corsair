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
import { Content, Images, Models, Videos } from './endpoints';
import type {
	GeminiEndpointInputs,
	GeminiEndpointOutputs,
} from './endpoints/types';
import {
	GeminiEndpointInputSchemas,
	GeminiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GeminiSchema } from './schema';

export type GeminiPluginOptions = {
	/** Authentication method. Gemini is API-key only. */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager) */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalGeminiPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/** Permission configuration for the Gemini plugin. */
	permissions?: PluginPermissionsConfig<typeof geminiEndpointsNested>;
};

export type GeminiContext = CorsairPluginContext<
	typeof GeminiSchema,
	GeminiPluginOptions
>;

export type GeminiKeyBuilderContext = KeyBuilderContext<GeminiPluginOptions>;

export type GeminiBoundEndpoints = BindEndpoints<typeof geminiEndpointsNested>;

type GeminiEndpoint<K extends keyof GeminiEndpointOutputs> = CorsairEndpoint<
	GeminiContext,
	GeminiEndpointInputs[K],
	GeminiEndpointOutputs[K]
>;

export type GeminiEndpoints = {
	countTokens: GeminiEndpoint<'countTokens'>;
	embedContent: GeminiEndpoint<'embedContent'>;
	generateContent: GeminiEndpoint<'generateContent'>;
	generateImage: GeminiEndpoint<'generateImage'>;
	generateVideos: GeminiEndpoint<'generateVideos'>;
	getVideosOperation: GeminiEndpoint<'getVideosOperation'>;
	waitForVideo: GeminiEndpoint<'waitForVideo'>;
	listModels: GeminiEndpoint<'listModels'>;
};

const geminiEndpointsNested = {
	content: {
		countTokens: Content.countTokens,
		embedContent: Content.embedContent,
		generateContent: Content.generateContent,
	},
	images: {
		generateImage: Images.generateImage,
	},
	videos: {
		generateVideos: Videos.generateVideos,
		getVideosOperation: Videos.getVideosOperation,
		waitForVideo: Videos.waitForVideo,
	},
	models: {
		listModels: Models.listModels,
	},
} as const;

// Gemini is a pull-based API — no webhooks to route.
const geminiWebhooksNested = {} as const;

export const geminiEndpointSchemas = {
	'content.countTokens': {
		input: GeminiEndpointInputSchemas.countTokens,
		output: GeminiEndpointOutputSchemas.countTokens,
	},
	'content.embedContent': {
		input: GeminiEndpointInputSchemas.embedContent,
		output: GeminiEndpointOutputSchemas.embedContent,
	},
	'content.generateContent': {
		input: GeminiEndpointInputSchemas.generateContent,
		output: GeminiEndpointOutputSchemas.generateContent,
	},
	'images.generateImage': {
		input: GeminiEndpointInputSchemas.generateImage,
		output: GeminiEndpointOutputSchemas.generateImage,
	},
	'videos.generateVideos': {
		input: GeminiEndpointInputSchemas.generateVideos,
		output: GeminiEndpointOutputSchemas.generateVideos,
	},
	'videos.getVideosOperation': {
		input: GeminiEndpointInputSchemas.getVideosOperation,
		output: GeminiEndpointOutputSchemas.getVideosOperation,
	},
	'videos.waitForVideo': {
		input: GeminiEndpointInputSchemas.waitForVideo,
		output: GeminiEndpointOutputSchemas.waitForVideo,
	},
	'models.listModels': {
		input: GeminiEndpointInputSchemas.listModels,
		output: GeminiEndpointOutputSchemas.listModels,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof geminiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const geminiEndpointMeta = {
	'content.countTokens': {
		riskLevel: 'read',
		description:
			'Count tokens in text using Gemini tokenization, for cost estimation and input limit checks',
	},
	'content.embedContent': {
		riskLevel: 'read',
		description:
			'Generate a numerical vector embedding for text, for semantic search and similarity comparison',
	},
	'content.generateContent': {
		riskLevel: 'read',
		description:
			'Generate text or speech audio from a prompt using a Gemini Flash/Pro model',
	},
	'images.generateImage': {
		riskLevel: 'write',
		description:
			'Generate a raster image (JPG/PNG/WebP) from a prompt using a Nano Banana image model',
	},
	'videos.generateVideos': {
		riskLevel: 'write',
		description:
			'Generate a text-to-video clip using a Veo model; returns an operation name for status tracking',
	},
	'videos.getVideosOperation': {
		riskLevel: 'read',
		description:
			'(Deprecated — use videos.waitForVideo) Check the status of a Veo video generation operation',
	},
	'videos.waitForVideo': {
		riskLevel: 'write',
		description:
			'Poll a Veo video generation operation until it completes and return the generated video',
	},
	'models.listModels': {
		riskLevel: 'read',
		description:
			'List available Gemini and Veo models and their capabilities/limits',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof geminiEndpointsNested>;

export const geminiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGeminiPlugin<T extends GeminiPluginOptions> = CorsairPlugin<
	'gemini',
	typeof GeminiSchema,
	typeof geminiEndpointsNested,
	typeof geminiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGeminiPlugin = BaseGeminiPlugin<GeminiPluginOptions>;

export type ExternalGeminiPlugin<T extends GeminiPluginOptions> =
	BaseGeminiPlugin<T>;

export function gemini<const T extends GeminiPluginOptions>(
	// Type assertion required to provide a default empty options object while
	// satisfying the generic `T extends GeminiPluginOptions` constraint —
	// TypeScript cannot verify `{}` matches `T` for an arbitrary caller-supplied T.
	incomingOptions: GeminiPluginOptions & T = {} as GeminiPluginOptions & T,
): ExternalGeminiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gemini',
		authConfig: geminiAuthConfig,
		schema: GeminiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: geminiEndpointsNested,
		webhooks: geminiWebhooksNested,
		endpointMeta: geminiEndpointMeta,
		endpointSchemas: geminiEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			// DEFAULT matches everything (`() => true`), so it must always be last.
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: GeminiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('gemini', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('gemini', 'api_key');
		},
	} satisfies InternalGeminiPlugin;
}

export type {
	GeminiEndpointInputs,
	GeminiEndpointOutputs,
} from './endpoints/types';
