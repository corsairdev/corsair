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
import {
	getStatus,
	sendChat,
	sendImage,
	sendLink,
	sendMedia,
} from './endpoints';
import type {
	WaboxappEndpointInputs,
	WaboxappEndpointOutputs,
} from './endpoints/types';
import {
	WaboxappEndpointInputSchemas,
	WaboxappEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WaboxappSchema } from './schema';

export const waboxappAuthConfig = {
	api_key: {
		account: ['uid'] as const,
	},
} as const satisfies PluginAuthConfig;

export type WaboxappPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	uid?: string;
	hooks?: InternalWaboxappPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof waboxappEndpointsNested>;
};

export type WaboxappContext = CorsairPluginContext<
	typeof WaboxappSchema,
	WaboxappPluginOptions,
	undefined,
	typeof waboxappAuthConfig
>;

export type WaboxappKeyBuilderContext = KeyBuilderContext<
	WaboxappPluginOptions,
	typeof waboxappAuthConfig
>;

type WaboxappEndpoint<K extends keyof WaboxappEndpointOutputs> =
	CorsairEndpoint<
		WaboxappContext,
		WaboxappEndpointInputs[K],
		WaboxappEndpointOutputs[K]
	>;

export type WaboxappEndpoints = {
	messagesSendChat: WaboxappEndpoint<'messagesSendChat'>;
	messagesSendImage: WaboxappEndpoint<'messagesSendImage'>;
	messagesSendLink: WaboxappEndpoint<'messagesSendLink'>;
	messagesSendMedia: WaboxappEndpoint<'messagesSendMedia'>;
	accountsGetStatus: WaboxappEndpoint<'accountsGetStatus'>;
};

export type WaboxappBoundEndpoints = BindEndpoints<
	typeof waboxappEndpointsNested
>;

const waboxappEndpointsNested = {
	messages: {
		sendChat,
		sendImage,
		sendLink,
		sendMedia,
	},
	accounts: {
		getStatus,
	},
} as const;

// No webhooks — Waboxapp integration provides REST API operations.
const waboxappWebhooksNested = {} as const;

export const waboxappEndpointSchemas = {
	'messages.sendChat': {
		input: WaboxappEndpointInputSchemas.messagesSendChat,
		output: WaboxappEndpointOutputSchemas.messagesSendChat,
	},
	'messages.sendImage': {
		input: WaboxappEndpointInputSchemas.messagesSendImage,
		output: WaboxappEndpointOutputSchemas.messagesSendImage,
	},
	'messages.sendLink': {
		input: WaboxappEndpointInputSchemas.messagesSendLink,
		output: WaboxappEndpointOutputSchemas.messagesSendLink,
	},
	'messages.sendMedia': {
		input: WaboxappEndpointInputSchemas.messagesSendMedia,
		output: WaboxappEndpointOutputSchemas.messagesSendMedia,
	},
	'accounts.getStatus': {
		input: WaboxappEndpointInputSchemas.accountsGetStatus,
		output: WaboxappEndpointOutputSchemas.accountsGetStatus,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof waboxappEndpointsNested
>;

const waboxappEndpointMeta = {
	'messages.sendChat': {
		riskLevel: 'write',
		description: 'Send a WhatsApp text message',
	},
	'messages.sendImage': {
		riskLevel: 'write',
		description: 'Send a WhatsApp image by URL',
	},
	'messages.sendLink': {
		riskLevel: 'write',
		description: 'Send a WhatsApp link preview',
	},
	'messages.sendMedia': {
		riskLevel: 'write',
		description: 'Send a WhatsApp media file by URL',
	},
	'accounts.getStatus': {
		riskLevel: 'read',
		description: 'Get WhatsApp session status',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof waboxappEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseWaboxappPlugin<T extends WaboxappPluginOptions> = CorsairPlugin<
	'waboxapp',
	typeof WaboxappSchema,
	typeof waboxappEndpointsNested,
	typeof waboxappWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof waboxappAuthConfig
>;

export type InternalWaboxappPlugin = BaseWaboxappPlugin<WaboxappPluginOptions>;

export type ExternalWaboxappPlugin<T extends WaboxappPluginOptions> =
	BaseWaboxappPlugin<T>;

export function waboxapp<const T extends WaboxappPluginOptions>(
	// Safe factory default: empty options object satisfies optional WaboxappPluginOptions & T when no options provided.
	incomingOptions: WaboxappPluginOptions & T = {} as WaboxappPluginOptions & T,
): ExternalWaboxappPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'waboxapp',
		authConfig: waboxappAuthConfig,
		schema: WaboxappSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: waboxappEndpointsNested,
		webhooks: waboxappWebhooksNested,
		endpointMeta: waboxappEndpointMeta,
		endpointSchemas: waboxappEndpointSchemas,
		pluginWebhookMatcher: undefined,
		pluginTenantWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WaboxappKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('waboxapp', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('waboxapp', 'api_key');
		},
	} satisfies InternalWaboxappPlugin;
}

export type {
	AccountsGetStatusInput,
	AccountsGetStatusResponse,
	MessagesSendChatInput,
	MessagesSendChatResponse,
	MessagesSendImageInput,
	MessagesSendImageResponse,
	MessagesSendLinkInput,
	MessagesSendLinkResponse,
	MessagesSendMediaInput,
	MessagesSendMediaResponse,
	WaboxappEndpointInputs,
	WaboxappEndpointOutputs,
} from './endpoints/types';
