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
import { Audio, Voices } from './endpoints';
import type {
	AivoovEndpointInputs,
	AivoovEndpointOutputs,
} from './endpoints/types';
import {
	AivoovEndpointInputSchemas,
	AivoovEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AivoovSchema } from './schema';

export type AivoovPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAivoovPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof aivoovEndpointsNested>;
};

export type AivoovContext = CorsairPluginContext<
	typeof AivoovSchema,
	AivoovPluginOptions
>;

export type AivoovKeyBuilderContext = KeyBuilderContext<AivoovPluginOptions>;

export type AivoovBoundEndpoints = BindEndpoints<typeof aivoovEndpointsNested>;

type AivoovEndpoint<K extends keyof AivoovEndpointOutputs> = CorsairEndpoint<
	AivoovContext,
	AivoovEndpointInputs[K],
	AivoovEndpointOutputs[K]
>;

export type AivoovEndpoints = {
	listVoices: AivoovEndpoint<'listVoices'>;
	createAudio: AivoovEndpoint<'createAudio'>;
};

const aivoovEndpointsNested = {
	voices: {
		list: Voices.list,
	},
	audio: {
		create: Audio.create,
	},
} as const;

export const aivoovEndpointSchemas = {
	'voices.list': {
		input: AivoovEndpointInputSchemas.listVoices,
		output: AivoovEndpointOutputSchemas.listVoices,
	},
	'audio.create': {
		input: AivoovEndpointInputSchemas.createAudio,
		output: AivoovEndpointOutputSchemas.createAudio,
	},
} satisfies RequiredPluginEndpointSchemas<typeof aivoovEndpointsNested>;

const aivoovEndpointMeta = {
	'voices.list': {
		riskLevel: 'read',
		description:
			'List available text-to-speech voices, optionally filtered by BCP-47 language code. Limited to 20 calls per day, so results are mirrored to the voices entity',
	},
	'audio.create': {
		riskLevel: 'write',
		description:
			'Synthesise speech from one or more voice and text pairs, returning Base64-encoded audio. Consumes character credits',
	},
} satisfies RequiredPluginEndpointMeta<typeof aivoovEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const aivoovAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAivoovPlugin<T extends AivoovPluginOptions> = CorsairPlugin<
	'aivoov',
	typeof AivoovSchema,
	typeof aivoovEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof aivoovAuthConfig
>;

export type InternalAivoovPlugin = BaseAivoovPlugin<AivoovPluginOptions>;

export type ExternalAivoovPlugin<T extends AivoovPluginOptions> =
	BaseAivoovPlugin<T>;

// The assertion is safe: AivoovPluginOptions has no required fields (all are
// optional), so an empty object satisfies the constraint at runtime even
// though TypeScript cannot verify it without the assertion.
export function aivoov<const T extends AivoovPluginOptions>(
	incomingOptions: AivoovPluginOptions & T = {} as AivoovPluginOptions & T,
): ExternalAivoovPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'aivoov',
		schema: AivoovSchema,
		options,
		hooks: options.hooks,
		endpoints: aivoovEndpointsNested,
		// AiVOOV has no webhook or callback surface.
		webhooks: {},
		endpointMeta: aivoovEndpointMeta,
		endpointSchemas: aivoovEndpointSchemas,
		authConfig: aivoovAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AivoovKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('aivoov', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('aivoov', 'api_key');
		},
	} satisfies InternalAivoovPlugin;
}

export { AivoovAPIError } from './client';
export type {
	AivoovEndpointInputs,
	AivoovEndpointOutputs,
	CreateAudioInput,
	CreateAudioResponse,
	ListVoicesInput,
	ListVoicesResponse,
	Voice,
} from './endpoints/types';
export {
	AivoovEndpointInputSchemas,
	AivoovEndpointOutputSchemas,
	CreateAudioInputSchema,
	CreateAudioResponseSchema,
	ListVoicesInputSchema,
	ListVoicesResponseSchema,
	VoiceSchema,
} from './endpoints/types';
export { AivoovVoice } from './schema';
