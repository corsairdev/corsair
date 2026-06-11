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
import { BusinessProfiles, Messages, PhoneNumbers } from './endpoints';
import type {
	WhatsappEndpointInputs,
	WhatsappEndpointOutputs,
} from './endpoints/types';
import {
	WhatsappEndpointInputSchemas,
	WhatsappEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WhatsappSchema } from './schema';
import { MessagesWebhooks } from './webhooks';
import type {
	WhatsappWebhookOutputs,
	WhatsappWebhookPayload,
} from './webhooks/types';
import {
	WhatsappMessageEventSchema,
	WhatsappStatusEventSchema,
} from './webhooks/types';

export const whatsappAuthConfig = {
	api_key: {
		account: [
			'phone_number_id',
			'business_account_id',
			'webhook_verify_token',
		] as const,
	},
} as const satisfies PluginAuthConfig;

export type WhatsappPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Meta system-user access token. Prefer encrypted account credentials in production. */
	key?: string;
	/** Default phone number ID used when an endpoint input omits phoneNumberId. */
	phoneNumberId?: string;
	/** Meta app secret used for X-Hub-Signature-256 verification. */
	webhookSecret?: string;
	hooks?: InternalWhatsappPlugin['hooks'];
	webhookHooks?: InternalWhatsappPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof whatsappEndpointsNested>;
};

export type WhatsappContext = CorsairPluginContext<
	typeof WhatsappSchema,
	WhatsappPluginOptions,
	undefined,
	typeof whatsappAuthConfig
>;

export type WhatsappKeyBuilderContext = KeyBuilderContext<
	WhatsappPluginOptions,
	typeof whatsappAuthConfig
>;

type WhatsappEndpoint<K extends keyof WhatsappEndpointOutputs> =
	CorsairEndpoint<
		WhatsappContext,
		WhatsappEndpointInputs[K],
		WhatsappEndpointOutputs[K]
	>;

export type WhatsappEndpoints = {
	messagesSend: WhatsappEndpoint<'messagesSend'>;
	messagesMarkRead: WhatsappEndpoint<'messagesMarkRead'>;
	phoneNumbersGet: WhatsappEndpoint<'phoneNumbersGet'>;
	businessProfilesGet: WhatsappEndpoint<'businessProfilesGet'>;
};

export type WhatsappBoundEndpoints = BindEndpoints<
	typeof whatsappEndpointsNested
>;

const whatsappEndpointsNested = {
	messages: {
		send: Messages.send,
		markRead: Messages.markRead,
	},
	phoneNumbers: {
		get: PhoneNumbers.get,
	},
	businessProfiles: {
		get: BusinessProfiles.get,
	},
} as const;

export const whatsappEndpointSchemas = {
	'messages.send': {
		input: WhatsappEndpointInputSchemas.messagesSend,
		output: WhatsappEndpointOutputSchemas.messagesSend,
	},
	'messages.markRead': {
		input: WhatsappEndpointInputSchemas.messagesMarkRead,
		output: WhatsappEndpointOutputSchemas.messagesMarkRead,
	},
	'phoneNumbers.get': {
		input: WhatsappEndpointInputSchemas.phoneNumbersGet,
		output: WhatsappEndpointOutputSchemas.phoneNumbersGet,
	},
	'businessProfiles.get': {
		input: WhatsappEndpointInputSchemas.businessProfilesGet,
		output: WhatsappEndpointOutputSchemas.businessProfilesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof whatsappEndpointsNested
>;

const whatsappEndpointMeta = {
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send a text, media, template, or interactive WhatsApp message',
	},
	'messages.markRead': {
		riskLevel: 'write',
		description: 'Mark an incoming WhatsApp message as read',
	},
	'phoneNumbers.get': {
		riskLevel: 'read',
		description: 'Validate credentials and retrieve phone number health',
	},
	'businessProfiles.get': {
		riskLevel: 'read',
		description: 'Retrieve the WhatsApp Business profile',
	},
} satisfies RequiredPluginEndpointMeta<typeof whatsappEndpointsNested>;

type WhatsappWebhook<
	K extends keyof WhatsappWebhookOutputs,
	TEvent,
> = CorsairWebhook<WhatsappContext, TEvent, WhatsappWebhookOutputs[K]>;

export type WhatsappWebhooks = {
	messages: WhatsappWebhook<'messages', WhatsappWebhookPayload>;
	statuses: WhatsappWebhook<'statuses', WhatsappWebhookPayload>;
};

export type WhatsappBoundWebhooks = BindWebhooks<WhatsappWebhooks>;

const whatsappWebhooksNested = {
	messages: {
		received: MessagesWebhooks.messages,
		statusChanged: MessagesWebhooks.statuses,
	},
} as const;

const whatsappWebhookSchemas = {
	'messages.received': {
		description: 'Incoming WhatsApp messages from customers',
		payload: WhatsappMessageEventSchema,
		response: WhatsappMessageEventSchema,
	},
	'messages.statusChanged': {
		description:
			'WhatsApp sent, delivered, read, failed, deleted, or error updates',
		payload: WhatsappStatusEventSchema,
		response: WhatsappStatusEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof whatsappWebhooksNested
>;

const defaultAuthType = 'api_key' as const;

export type BaseWhatsappPlugin<T extends WhatsappPluginOptions> = CorsairPlugin<
	'whatsapp',
	typeof WhatsappSchema,
	typeof whatsappEndpointsNested,
	typeof whatsappWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof whatsappAuthConfig
>;

export type InternalWhatsappPlugin = BaseWhatsappPlugin<WhatsappPluginOptions>;
export type ExternalWhatsappPlugin<T extends WhatsappPluginOptions> =
	BaseWhatsappPlugin<T>;

export function whatsapp<const T extends WhatsappPluginOptions>(
	// The empty default cannot satisfy an arbitrary generic extension at compile time.
	incomingOptions: WhatsappPluginOptions & T = {} as WhatsappPluginOptions & T,
): ExternalWhatsappPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'whatsapp',
		schema: WhatsappSchema,
		options,
		authConfig: whatsappAuthConfig,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: whatsappEndpointsNested,
		webhooks: whatsappWebhooksNested,
		endpointMeta: whatsappEndpointMeta,
		endpointSchemas: whatsappEndpointSchemas,
		webhookSchemas: whatsappWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const body =
				typeof request.body === 'string'
					? (() => {
							try {
								return JSON.parse(request.body);
							} catch {
								return null;
							}
						})()
					: request.body;
			return (
				body !== null &&
				typeof body === 'object' &&
				'object' in body &&
				body.object === 'whatsapp_business_account'
			);
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}
			if (source === 'webhook') {
				const appSecret = await ctx.keys.get_webhook_signature();
				if (!appSecret) {
					throw new Error(
						'[auth-missing:whatsapp:webhook_signature]: Meta app secret is missing',
					);
				}
				return appSecret;
			}
			if (options.key) return options.key;
			const accessToken = await ctx.keys.get_api_key();
			if (!accessToken) {
				throw new AuthMissingError('whatsapp', 'api_key');
			}
			return accessToken;
		},
	} satisfies InternalWhatsappPlugin;
}

export type {
	MessagesSendInput,
	MessagesSendResponse,
	WhatsappEndpointInputs,
	WhatsappEndpointOutputs,
} from './endpoints/types';
export { WhatsappSchema } from './schema';
export type {
	WhatsappMessageEvent,
	WhatsappStatusEvent,
	WhatsappWebhookOutputs,
	WhatsappWebhookPayload,
} from './webhooks/types';
export {
	verifyWhatsappWebhookChallenge,
	verifyWhatsappWebhookSignature,
} from './webhooks/types';
