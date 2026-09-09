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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Accounts, Messages } from './endpoints';
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
import { MessageWebhooks } from './webhooks';
import { matchWaboxappTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AckEvent,
	MessageEvent,
	WaboxappWebhookOutputs,
} from './webhooks/types';
import {
	AckEventSchema,
	isWaboxappWebhookPayload,
	MessageEventSchema,
	parseWaboxappWebhookBody,
} from './webhooks/types';

export const waboxappAuthConfig = {
	api_key: {
		account: ['uid'] as const,
	},
} as const satisfies PluginAuthConfig;

export type WaboxappPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	uid?: string;
	webhookSecret?: string;
	hooks?: InternalWaboxappPlugin['hooks'];
	webhookHooks?: InternalWaboxappPlugin['webhookHooks'];
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

type WaboxappWebhook<
	K extends keyof WaboxappWebhookOutputs,
	TEvent,
> = CorsairWebhook<WaboxappContext, TEvent, WaboxappWebhookOutputs[K]>;

export type WaboxappWebhooks = {
	message: WaboxappWebhook<'message', MessageEvent>;
	ack: WaboxappWebhook<'ack', AckEvent>;
};

export type WaboxappBoundWebhooks = BindWebhooks<WaboxappWebhooks>;

const waboxappEndpointsNested = {
	messages: {
		sendChat: Messages.sendChat,
		sendImage: Messages.sendImage,
		sendLink: Messages.sendLink,
		sendMedia: Messages.sendMedia,
	},
	accounts: {
		getStatus: Accounts.getStatus,
	},
} as const;

const waboxappWebhooksNested = {
	message: {
		received: MessageWebhooks.received,
		ack: MessageWebhooks.ack,
	},
} as const;

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

const waboxappWebhookSchemas = {
	'message.received': {
		description: 'An incoming WhatsApp message',
		payload: MessageEventSchema,
		response: MessageEventSchema,
	},
	'message.ack': {
		description: 'A WhatsApp message acknowledgement',
		payload: AckEventSchema,
		response: AckEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof waboxappWebhooksNested
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

const defaultAuthType = 'api_key' as const;

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
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: waboxappEndpointsNested,
		webhooks: waboxappWebhooksNested,
		endpointMeta: waboxappEndpointMeta,
		endpointSchemas: waboxappEndpointSchemas,
		webhookSchemas: waboxappWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const body = parseWaboxappWebhookBody(request.body);
			return isWaboxappWebhookPayload(body);
		},
		pluginTenantWebhookMatcher: matchWaboxappTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WaboxappKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				if (options.key) return options.key;
				const webhookSig = await ctx.keys.get_webhook_signature();
				if (webhookSig) return webhookSig;
				const apiKey = await ctx.keys.get_api_key();
				if (apiKey) return apiKey;
				throw new AuthMissingError('waboxapp', 'api_key');
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
				throw new AuthMissingError('waboxapp', 'api_key');
			}

			throw new AuthMissingError('waboxapp', String(ctx.authType));
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
export type {
	AckEvent,
	MessageEvent,
	WaboxappWebhookOutputs,
} from './webhooks/types';
