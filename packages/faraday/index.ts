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
import type { FaradayEndpointInputs, FaradayEndpointOutputs } from './endpoints/types';
import { FaradayEndpointInputSchemas, FaradayEndpointOutputSchemas } from './endpoints/types';
import type {
	FaradayWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Accounts } from './endpoints';
import { FaradaySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFaradayTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFaradayOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FaradayPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFaradayPlugin['hooks'];
	webhookHooks?: InternalFaradayPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof faradayEndpointsNested>;
};

export type FaradayContext = CorsairPluginContext<
	typeof FaradaySchema,
	FaradayPluginOptions
>;

export type FaradayKeyBuilderContext = KeyBuilderContext<FaradayPluginOptions>;

export type FaradayBoundEndpoints = BindEndpoints<typeof faradayEndpointsNested>;

type FaradayEndpoint<
	K extends keyof FaradayEndpointOutputs,
> = CorsairEndpoint<
	FaradayContext,
	FaradayEndpointInputs[K],
	FaradayEndpointOutputs[K]
>;

export type FaradayEndpoints = {
	getAccounts: FaradayEndpoint<'getAccounts'>;
};

type FaradayWebhook<
	K extends keyof FaradayWebhookOutputs,
	TEvent,
> = CorsairWebhook<FaradayContext, TEvent, FaradayWebhookOutputs[K]>;

export type FaradayWebhooks = {
	example: FaradayWebhook<'example', ExampleEvent>;
};

export type FaradayBoundWebhooks = BindWebhooks<FaradayWebhooks>;

const faradayEndpointsNested = {
	accounts: {
		getAccounts: Accounts.getAccounts,
	},
} as const;

const faradayWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const faradayEndpointSchemas = {
	'accounts.getAccounts': {
		input: FaradayEndpointInputSchemas.getAccounts,
		output: FaradayEndpointOutputSchemas.getAccounts,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof faradayEndpointsNested>;

const faradayWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof faradayWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const faradayEndpointMeta = {
	'accounts.getAccounts': {
		riskLevel: 'read',
		description: 'Get accounts from Faraday',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof faradayEndpointsNested>;

export const faradayAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFaradayPlugin<T extends FaradayPluginOptions> = CorsairPlugin<
	'faraday',
	typeof FaradaySchema,
	typeof faradayEndpointsNested,
	typeof faradayWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFaradayPlugin = BaseFaradayPlugin<FaradayPluginOptions>;

export type ExternalFaradayPlugin<T extends FaradayPluginOptions> =
	BaseFaradayPlugin<T>;

export function faraday<const T extends FaradayPluginOptions>(
	incomingOptions: FaradayPluginOptions & T = {} as FaradayPluginOptions & T,
): ExternalFaradayPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'faraday',
		authConfig: faradayAuthConfig,
		schema: FaradaySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: faradayEndpointsNested,
		webhooks: faradayWebhooksNested,
		endpointMeta: faradayEndpointMeta,
		endpointSchemas: faradayEndpointSchemas,
		webhookSchemas: faradayWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-faraday-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFaradayTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFaradayOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FaradayKeyBuilderContext, source) => {
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

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalFaradayPlugin;
}

export type {
	ExampleEvent,
	FaradayWebhookOutputs,
} from './webhooks/types';

export type {
	FaradayEndpointInputs,
	FaradayEndpointOutputs,
	GetAccountsInput,
	GetAccountsResponse,
} from './endpoints/types';
