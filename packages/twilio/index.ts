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
import type { AuthTypes } from 'corsair/core';
import type { TwilioEndpointInputs, TwilioEndpointOutputs } from './endpoints/types';
import { TwilioEndpointInputSchemas, TwilioEndpointOutputSchemas } from './endpoints/types';
import type {
	TwilioWebhookOutputs,
	TwilioMessageReceivedWebhook,
	TwilioMessageStatusWebhook,
	TwilioCallStatusWebhook,
} from './webhooks/types';
import {
	TwilioCallStatusWebhookSchema,
	TwilioMessageReceivedWebhookSchema,
	TwilioMessageStatusWebhookSchema,
} from './webhooks/types';
import { Calls, Messages } from './endpoints';
import { TwilioSchema } from './schema';
import { Calls as TwilioCallsWebhooks, Messages as TwilioMessagesWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type TwilioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	accountSid?: string;
	authToken?: string;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTwilioPlugin['hooks'];
	webhookHooks?: InternalTwilioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof twilioEndpointsNested>;
};

export type TwilioContext = CorsairPluginContext<
	typeof TwilioSchema,
	TwilioPluginOptions
>;

export type TwilioKeyBuilderContext = KeyBuilderContext<TwilioPluginOptions>;

export type TwilioBoundEndpoints = BindEndpoints<typeof twilioEndpointsNested>;

type TwilioEndpoint<
	K extends keyof TwilioEndpointOutputs,
> = CorsairEndpoint<
	TwilioContext,
	TwilioEndpointInputs[K],
	TwilioEndpointOutputs[K]
>;

export type TwilioEndpoints = {
	messagesList: TwilioEndpoint<'messagesList'>;
	messagesGet: TwilioEndpoint<'messagesGet'>;
	callsList: TwilioEndpoint<'callsList'>;
	callsGet: TwilioEndpoint<'callsGet'>;
};

type TwilioWebhook<
	K extends keyof TwilioWebhookOutputs,
	TEvent,
> = CorsairWebhook<TwilioContext, TEvent, TwilioWebhookOutputs[K]>;

export type TwilioWebhooks = {
	messagesReceived: TwilioWebhook<'messagesReceived', TwilioMessageReceivedWebhook>;
	messagesStatus: TwilioWebhook<'messagesStatus', TwilioMessageStatusWebhook>;
	callsStatus: TwilioWebhook<'callsStatus', TwilioCallStatusWebhook>;
};

export type TwilioBoundWebhooks = BindWebhooks<TwilioWebhooks>;

const twilioEndpointsNested = {
	messages: {
		list: Messages.list,
		get: Messages.get,
	},
	calls: {
		list: Calls.list,
		get: Calls.get,
	},
} as const;

const twilioWebhooksNested = {
	messages: {
		received: TwilioMessagesWebhooks.received,
		status: TwilioMessagesWebhooks.status,
	},
	calls: {
		status: TwilioCallsWebhooks.status,
	},
} as const;

export const twilioEndpointSchemas = {
	'messages.list': {
		input: TwilioEndpointInputSchemas.messagesList,
		output: TwilioEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: TwilioEndpointInputSchemas.messagesGet,
		output: TwilioEndpointOutputSchemas.messagesGet,
	},
	'calls.list': {
		input: TwilioEndpointInputSchemas.callsList,
		output: TwilioEndpointOutputSchemas.callsList,
	},
	'calls.get': {
		input: TwilioEndpointInputSchemas.callsGet,
		output: TwilioEndpointOutputSchemas.callsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof twilioEndpointsNested>;

const twilioWebhookSchemas = {
	'messages.received': {
		description: 'Incoming message webhook from Twilio',
		payload: TwilioMessageReceivedWebhookSchema,
		response: TwilioMessageReceivedWebhookSchema,
	},
	'messages.status': {
		description: 'Message status callback webhook from Twilio',
		payload: TwilioMessageStatusWebhookSchema,
		response: TwilioMessageStatusWebhookSchema,
	},
	'calls.status': {
		description: 'Call status callback webhook from Twilio',
		payload: TwilioCallStatusWebhookSchema,
		response: TwilioCallStatusWebhookSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof twilioWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const twilioEndpointMeta = {
	'messages.list': {
		riskLevel: 'read',
		description: 'List Twilio messages for an account',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Fetch a Twilio message by SID',
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List Twilio calls for an account',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Fetch a Twilio call by SID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof twilioEndpointsNested>;

export const twilioAuthConfig = {
	api_key: {
		integration: ['account_sid'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTwilioPlugin<T extends TwilioPluginOptions> = CorsairPlugin<
	'twilio',
	typeof TwilioSchema,
	typeof twilioEndpointsNested,
	typeof twilioWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTwilioPlugin = BaseTwilioPlugin<TwilioPluginOptions>;

export type ExternalTwilioPlugin<T extends TwilioPluginOptions> =
	BaseTwilioPlugin<T>;

export function twilio<const T extends TwilioPluginOptions>(
	incomingOptions: TwilioPluginOptions & T = {} as TwilioPluginOptions & T,
): ExternalTwilioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'twilio',
		schema: TwilioSchema,
		options: options,
		authConfig: twilioAuthConfig,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: twilioEndpointsNested,
		webhooks: twilioWebhooksNested,
		endpointMeta: twilioEndpointMeta,
		endpointSchemas: twilioEndpointSchemas,
		webhookSchemas: twilioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-twilio-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TwilioKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && options.authToken) {
				return options.authToken;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalTwilioPlugin;
}

export type {
	TwilioWebhookOutputs,
	TwilioMessageReceivedWebhook,
	TwilioMessageStatusWebhook,
	TwilioCallStatusWebhook,
} from './webhooks/types';

export type {
	TwilioEndpointInputs,
	TwilioEndpointOutputs,
	TwilioMessagesListInput,
	TwilioMessagesGetInput,
	TwilioCallsListInput,
	TwilioCallsGetInput,
} from './endpoints/types';
