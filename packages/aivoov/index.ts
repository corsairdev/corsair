import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import { createAudio, listVoices } from './endpoints';
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

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options & Context
// ─────────────────────────────────────────────────────────────────────────────

export type AivoovPluginOptions = {
	/** Auth scheme — AiVOOV only supports API key authentication. */
	authType?: PickAuth<'api_key'>;
	/** Inline API key (overrides stored credential). */
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

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Map
// ─────────────────────────────────────────────────────────────────────────────

type AivoovEndpoint<K extends keyof AivoovEndpointOutputs> = CorsairEndpoint<
	AivoovContext,
	AivoovEndpointInputs[K],
	AivoovEndpointOutputs[K]
>;

export type AivoovEndpoints = {
	listVoices: AivoovEndpoint<'listVoices'>;
	createAudio: AivoovEndpoint<'createAudio'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Webhooks (AiVOOV has no inbound webhooks)
// ─────────────────────────────────────────────────────────────────────────────

export type AivoovWebhooks = {};
export type AivoovBoundWebhooks = BindWebhooks<AivoovWebhooks>;

// ─────────────────────────────────────────────────────────────────────────────
// Nested Endpoint Tree
//
// Available endpoints:
//   voices.list  — AIVOOV_LIST_VOICES
//   audio.create — AIVOOV_CREATE_AUDIO
// ─────────────────────────────────────────────────────────────────────────────

const aivoovEndpointsNested = {
	voices: {
		list: listVoices,
	},
	audio: {
		create: createAudio,
	},
} as const;

const aivoovWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const aivoovEndpointSchemas: RequiredPluginEndpointSchemas<{
	voices: {
		list: AivoovEndpoints['listVoices'];
	};
	audio: {
		create: AivoovEndpoints['createAudio'];
	};
}> = {
	'voices.list': {
		input: AivoovEndpointInputSchemas.listVoices,
		output: AivoovEndpointOutputSchemas.listVoices,
	},
	'audio.create': {
		input: AivoovEndpointInputSchemas.createAudio,
		output: AivoovEndpointOutputSchemas.createAudio,
	},
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta
// ─────────────────────────────────────────────────────────────────────────────

const aivoovEndpointMeta = {
	'voices.list': {
		riskLevel: 'read',
		description:
			'Retrieves available text-to-speech voices from AiVOOV. Returns voice details including voice_id (required for audio creation), name, gender, and language information. Rate limited to 20 daily calls — consider caching results.',
	},
	'audio.create': {
		riskLevel: 'write',
		description:
			'Generates audio from text using AiVOOV. Accepts an array of voice IDs and text segments with optional SSML parameters (pitch, speaking rate, volume).',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof aivoovEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Config & Plugin Definition
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const aivoovAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAivoovPlugin<T extends AivoovPluginOptions> = CorsairPlugin<
	'aivoov',
	typeof AivoovSchema,
	typeof aivoovEndpointsNested,
	typeof aivoovWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof aivoovAuthConfig
>;

export type InternalAivoovPlugin = BaseAivoovPlugin<AivoovPluginOptions>;

export type ExternalAivoovPlugin<T extends AivoovPluginOptions> =
	BaseAivoovPlugin<T>;

export function aivoov<const T extends AivoovPluginOptions>(
	incomingOptions: AivoovPluginOptions & T = {} as AivoovPluginOptions & T,
): ExternalAivoovPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'aivoov',
		authConfig: aivoovAuthConfig,
		schema: AivoovSchema,
		options,
		hooks: options.hooks,
		endpoints: aivoovEndpointsNested,
		webhooks: aivoovWebhooksNested,
		endpointMeta: aivoovEndpointMeta,
		endpointSchemas: aivoovEndpointSchemas,

		// AiVOOV does not send inbound webhooks to Corsair.
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: undefined,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: AivoovKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('aivoov', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('aivoov', 'api_key');
		},
	} satisfies InternalAivoovPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AivoovEndpointInputs,
	AivoovEndpointOutputs,
	CreateAudioInput,
	CreateAudioResponse,
	ListVoicesInput,
	ListVoicesResponse,
	Voice,
} from './endpoints/types';

export type { AivoovAudio, AivoovVoice } from './schema/database';
