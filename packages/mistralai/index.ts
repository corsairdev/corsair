import type {
	AuthTypes,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { errorHandlers } from './error-handlers';
import { MistralAiSchema } from './schema';

export type MistralAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMistralAiPlugin['hooks'];
	webhookHooks?: InternalMistralAiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mistralAiEndpointsNested>;
};

export type MistralAiContext = CorsairPluginContext<
	typeof MistralAiSchema,
	MistralAiPluginOptions
>;

export type MistralAiKeyBuilderContext =
	KeyBuilderContext<MistralAiPluginOptions>;

export type MistralAiBoundEndpoints = BindEndpoints<
	typeof mistralAiEndpointsNested
>;

export type MistralAiWebhooks = Record<string, never>;

export type MistralAiBoundWebhooks = Record<string, never>;

// One group per API family; operations are added group by group.
const mistralAiEndpointsNested = {
	chat: {},
	fim: {},
	agents: {},
	embeddings: {},
	classifiers: {},
	ocr: {},
	audio: {},
	voices: {},
	audioAgents: {},
	models: {},
	files: {},
	batch: {},
	responses: {},
} as const;

const mistralAiWebhooksNested = {} as const;

export const mistralAiEndpointSchemas =
	{} as const satisfies RequiredPluginEndpointSchemas<
		typeof mistralAiEndpointsNested
	>;

const mistralAiWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof mistralAiWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mistralAiEndpointMeta = {} as const satisfies RequiredPluginEndpointMeta<
	typeof mistralAiEndpointsNested
>;

export const mistralAiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMistralAiPlugin<T extends MistralAiPluginOptions> =
	CorsairPlugin<
		'mistralai',
		typeof MistralAiSchema,
		typeof mistralAiEndpointsNested,
		typeof mistralAiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalMistralAiPlugin =
	BaseMistralAiPlugin<MistralAiPluginOptions>;

export type ExternalMistralAiPlugin<T extends MistralAiPluginOptions> =
	BaseMistralAiPlugin<T>;

export function mistralai<const T extends MistralAiPluginOptions>(
	incomingOptions: MistralAiPluginOptions & T = {} as MistralAiPluginOptions &
		T,
): ExternalMistralAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mistralai',
		authConfig: mistralAiAuthConfig,
		schema: MistralAiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mistralAiEndpointsNested,
		webhooks: mistralAiWebhooksNested,
		endpointMeta: mistralAiEndpointMeta,
		endpointSchemas: mistralAiEndpointSchemas,
		webhookSchemas: mistralAiWebhookSchemas,
		// This plugin declares no webhooks.
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MistralAiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalMistralAiPlugin;
}

export { MistralAiAPIError } from './client';
export type {
	MistralAiEndpointInputs,
	MistralAiEndpointOutputs,
} from './endpoints/types';
