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
import { Account, Contacts, Webhooks } from './endpoints';
import type {
	CreateContactInput,
	CreateContactResponse,
	GetApiUsageInfoInput,
	GetApiUsageInfoResponse,
	ListContactsInput,
	ListContactsResponse,
	ListWebhooksInput,
	ListWebhooksResponse,
	TestApiKeyInput,
	TestApiKeyResponse,
	TwoChatEndpointInputs,
	TwoChatEndpointOutputs,
} from './endpoints/types';
import {
	CreateContactInputSchema,
	CreateContactResponseSchema,
	GetApiUsageInfoInputSchema,
	GetApiUsageInfoResponseSchema,
	ListContactsInputSchema,
	ListContactsResponseSchema,
	ListWebhooksInputSchema,
	ListWebhooksResponseSchema,
	TestApiKeyInputSchema,
	TestApiKeyResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TwoChatSchema } from './schema';
import { matchTwoChatTenantWebhook } from './webhooks/tenant-matcher';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin options
// ─────────────────────────────────────────────────────────────────────────────

export type TwoChatPluginOptions = {
	// 2Chat supports API key authentication only (X-User-API-Key header)
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTwoChatPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof twochatEndpointsNested>;
};

export type TwoChatContext = CorsairPluginContext<
	typeof TwoChatSchema,
	TwoChatPluginOptions
>;

export type TwoChatKeyBuilderContext = KeyBuilderContext<TwoChatPluginOptions>;

export type TwoChatBoundEndpoints = BindEndpoints<
	typeof twochatEndpointsNested
>;

type TwoChatEndpoint<K extends keyof TwoChatEndpointOutputs> = CorsairEndpoint<
	TwoChatContext,
	TwoChatEndpointInputs[K],
	TwoChatEndpointOutputs[K]
>;

export type TwoChatEndpoints = {
	createContact: TwoChatEndpoint<'createContact'>;
	getApiUsageInfo: TwoChatEndpoint<'getApiUsageInfo'>;
	testApiKey: TwoChatEndpoint<'testApiKey'>;
	listContacts: TwoChatEndpoint<'listContacts'>;
	listWebhooks: TwoChatEndpoint<'listWebhooks'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint nesting (namespace → endpoint)
// ─────────────────────────────────────────────────────────────────────────────

const twochatEndpointsNested = {
	contacts: {
		createContact: Contacts.createContact,
		listContacts: Contacts.listContacts,
	},
	account: {
		getApiUsageInfo: Account.getApiUsageInfo,
		testApiKey: Account.testApiKey,
	},
	webhookSubscriptions: {
		listWebhooks: Webhooks.listWebhooks,
	},
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint schemas
// ─────────────────────────────────────────────────────────────────────────────

export const twochatEndpointSchemas = {
	'contacts.createContact': {
		input: CreateContactInputSchema,
		output: CreateContactResponseSchema,
	},
	'contacts.listContacts': {
		input: ListContactsInputSchema,
		output: ListContactsResponseSchema,
	},
	'account.getApiUsageInfo': {
		input: GetApiUsageInfoInputSchema,
		output: GetApiUsageInfoResponseSchema,
	},
	'account.testApiKey': {
		input: TestApiKeyInputSchema,
		output: TestApiKeyResponseSchema,
	},
	'webhookSubscriptions.listWebhooks': {
		input: ListWebhooksInputSchema,
		output: ListWebhooksResponseSchema,
	},
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint metadata
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

const twochatEndpointMeta = {
	'contacts.createContact': {
		riskLevel: 'write',
		description:
			'Create a new contact in your 2Chat account. Use after gathering and verifying first name and at least one contact detail (email, phone, or address).',
	},
	'contacts.listContacts': {
		riskLevel: 'read',
		description:
			'List all contacts in your 2Chat account. Use when you need to retrieve your contact list after confirming your account connection.',
	},
	'account.getApiUsageInfo': {
		riskLevel: 'read',
		description:
			'Retrieve current API usage and account information. Use when you need to monitor your remaining quotas before sending more requests.',
	},
	'account.testApiKey': {
		riskLevel: 'read',
		description:
			'Validate your API key and retrieve account info. Use when confirming credentials before performing other operations.',
	},
	'webhookSubscriptions.listWebhooks': {
		riskLevel: 'read',
		description:
			'List all configured webhook subscriptions for WhatsApp and phone call events. Returns details including webhook UUID, event type, channel UUID, callback URL, and creation timestamp.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof twochatEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth config
// ─────────────────────────────────────────────────────────────────────────────

export const twochatAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin type
// ─────────────────────────────────────────────────────────────────────────────

export type BaseTwoChatPlugin<T extends TwoChatPluginOptions> = CorsairPlugin<
	'twochat',
	typeof TwoChatSchema,
	typeof twochatEndpointsNested,
	// biome-ignore lint/complexity/noBannedTypes: empty webhooks object is intentional per spec
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTwoChatPlugin = BaseTwoChatPlugin<TwoChatPluginOptions>;

export type ExternalTwoChatPlugin<T extends TwoChatPluginOptions> =
	BaseTwoChatPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Factory function
// ─────────────────────────────────────────────────────────────────────────────

export function twochat<const T extends TwoChatPluginOptions>(
	incomingOptions: TwoChatPluginOptions & T = {} as TwoChatPluginOptions & T,
): ExternalTwoChatPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'twochat',
		authConfig: twochatAuthConfig,
		schema: TwoChatSchema,
		options: options,
		hooks: options.hooks,
		endpoints: twochatEndpointsNested,
		webhooks: {},
		endpointMeta: twochatEndpointMeta,
		endpointSchemas: twochatEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchTwoChatTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: TwoChatKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('twochat', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('twochat', 'api_key');
		},
	} satisfies InternalTwoChatPlugin as ExternalTwoChatPlugin<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CreateContactInput,
	CreateContactResponse,
	GetApiUsageInfoInput,
	GetApiUsageInfoResponse,
	ListContactsInput,
	ListContactsResponse,
	ListWebhooksInput,
	ListWebhooksResponse,
	TestApiKeyInput,
	TestApiKeyResponse,
	TwoChatEndpointInputs,
	TwoChatEndpointOutputs,
} from './endpoints/types';
