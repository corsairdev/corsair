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
} from 'corsair/core';

import { AuthMissingError } from 'corsair/core';

import {
	getAccount,
	getAccountByPhone,
	listAccounts,
	sendMessage,
} from './endpoints';

import { triggerAutomation } from './endpoints/trigger-automation';

import type {
	GetAccountByPhoneResponse,
	GetAccountResponse,
	ListAccountsResponse,
	SendMessageInput,
	SendMessageResponse,
	StartAutomationInput,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';
import { SpokiSchema } from './schema';
import { matchSpokiTenantWebhook } from './webhooks';

export type SpokiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSpokiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof spokiEndpointsNested>;
};

export type SpokiContext = CorsairPluginContext<
	typeof SpokiSchema,
	SpokiPluginOptions
>;

export type SpokiKeyBuilderContext = KeyBuilderContext<SpokiPluginOptions>;

const spokiEndpointsNested = {
	accounts: {
		listAccounts,
		getAccount,
		getAccountByPhone,
	},
	messaging: {
		sendMessage,
	},
	automation: {
		triggerAutomation,
	},
};

type SpokiEndpoint<TInput, TOutput> = CorsairEndpoint<
	SpokiContext,
	TInput,
	TOutput
>;

export type SpokiEndpoints = {
	listAccounts: SpokiEndpoint<unknown, ListAccountsResponse>;
	getAccount: SpokiEndpoint<{ accountId: number }, GetAccountResponse>;
	getAccountByPhone: SpokiEndpoint<
		{ phone: string },
		GetAccountByPhoneResponse
	>;
	sendMessage: SpokiEndpoint<SendMessageInput, SendMessageResponse>;
	triggerAutomation: SpokiEndpoint<
		{
			uuid: string;
			input: StartAutomationInput;
		},
		void
	>;
};

export const spokiEndpointMeta = {
	'accounts.listAccounts': {
		riskLevel: 'read',
		description:
			'List Spoki WhatsApp accounts available to the authenticated API key.',
	},

	'accounts.getAccount': {
		riskLevel: 'read',
		description: 'Retrieve details for a specific Spoki account.',
	},

	'accounts.getAccountByPhone': {
		riskLevel: 'read',
		description: 'Retrieve a Spoki account using its phone number.',
	},

	'messaging.sendMessage': {
		riskLevel: 'write',
		description:
			'Send a WhatsApp message through Spoki to the specified phone number.',
	},

	'automation.triggerAutomation': {
		riskLevel: 'write',
		description:
			'Trigger a Spoki automation using its webhook automation UUID.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof spokiEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export const spokiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseSpokiPlugin<T extends SpokiPluginOptions> = CorsairPlugin<
	'spoki',
	typeof SpokiSchema,
	typeof spokiEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalSpokiPlugin = BaseSpokiPlugin<SpokiPluginOptions>;

export type ExternalSpokiPlugin<T extends SpokiPluginOptions> =
	BaseSpokiPlugin<T>;

export function spoki<const T extends SpokiPluginOptions>(
	incomingOptions: SpokiPluginOptions & T = {} as SpokiPluginOptions & T,
): ExternalSpokiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'spoki',

		authConfig: spokiAuthConfig,

		schema: SpokiSchema,

		options,

		hooks: options.hooks,

		endpoints: spokiEndpointsNested,

		webhooks: {},

		endpointMeta: spokiEndpointMeta,

		pluginWebhookMatcher: () => false,

		pluginTenantWebhookMatcher: matchSpokiTenantWebhook,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (
			ctx: SpokiKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const result = await ctx.keys.get_api_key();

				if (!result) {
					throw new AuthMissingError('spoki', 'api_key');
				}

				return result;
			}

			throw new AuthMissingError('spoki', 'api_key');
		},
	} satisfies InternalSpokiPlugin as ExternalSpokiPlugin<T>;
}

export {
	getAccount,
	getAccountByPhone,
	listAccounts,
	sendMessage,
	triggerAutomation,
};

export {
	SPOKI_BASE_URL,
	SpokiApiError,
	SpokiClient,
} from './client';

export type {
	GetAccountByPhoneResponse,
	GetAccountResponse,
	ListAccountsResponse,
	SendMessageInput,
	SendMessageResponse,
	SpokiAccount,
	SpokiChannel,
	StartAutomationInput,
} from './endpoints/types';
