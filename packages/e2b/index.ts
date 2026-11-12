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
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { E2bEndpointInputs, E2bEndpointOutputs } from './endpoints/types';
import { E2bEndpointInputSchemas, E2bEndpointOutputSchemas } from './endpoints/types';
import type { E2bWebhookOutputs } from './webhooks/types';
import { Health } from './endpoints';
import { E2bSchema } from './schema';
import { errorHandlers } from './error-handlers';
import { matchE2bTenantWebhook } from './webhooks/tenant-matcher';
import { resolveE2bOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type E2bPluginOptions = {
	/** E2B provides isolated cloud sandboxes for secure code execution. */
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalE2bPlugin['hooks'];
	webhookHooks?: InternalE2bPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof e2bEndpointsNested>;
};

export type E2bContext = CorsairPluginContext<typeof E2bSchema, E2bPluginOptions>;
export type E2bKeyBuilderContext = KeyBuilderContext<E2bPluginOptions>;
export type E2bBoundEndpoints = BindEndpoints<typeof e2bEndpointsNested>;

type E2bEndpoint<K extends keyof E2bEndpointOutputs> = CorsairEndpoint<
	E2bContext,
	E2bEndpointInputs[K],
	E2bEndpointOutputs[K]
>;

export type E2bEndpoints = {
	getHealth: E2bEndpoint<'getHealth'>;
};

export type E2bBoundWebhooks = BindWebhooks<Record<string, never>>;

const e2bEndpointsNested = {
	health: {
		getHealth: Health.getHealth,
	},
} as const;

const e2bWebhooksNested = {
	// TODO: Add webhook handlers here once implemented
} as const;

export const e2bEndpointSchemas = {
	'health.getHealth': {
		input: E2bEndpointInputSchemas.getHealth,
		output: E2bEndpointOutputSchemas.getHealth,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const e2bEndpointMeta = {
	'health.getHealth': {
			riskLevel: 'read',
			description: 'Check API Health',
		},
} satisfies RequiredPluginEndpointMeta<typeof e2bEndpointsNested>;

export const e2bAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseE2bPlugin<T extends E2bPluginOptions> = CorsairPlugin<
	'e2b',
	typeof E2bSchema,
	typeof e2bEndpointsNested,
	typeof e2bWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalE2bPlugin = BaseE2bPlugin<E2bPluginOptions>;
export type ExternalE2bPlugin<T extends E2bPluginOptions> = BaseE2bPlugin<T>;

export function e2b<const T extends E2bPluginOptions>(
	incomingOptions: E2bPluginOptions & T = {} as E2bPluginOptions & T,
): ExternalE2bPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'e2b',
		authConfig: e2bAuthConfig,
		schema: E2bSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: e2bEndpointsNested,
		webhooks: e2bWebhooksNested,
		endpointMeta: e2bEndpointMeta,
		endpointSchemas: e2bEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			// TODO: Update to match E2b webhook signature headers
			return 'x-e2b-signature' in request.headers;
		},
		pluginTenantWebhookMatcher: matchE2bTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveE2bOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: E2bKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) return options.webhookSecret;
			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}
			if (source === 'endpoint' && options.key) return options.key;
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
	} satisfies InternalE2bPlugin;
}

export type { E2bWebhookOutputs } from './webhooks/types';
export type { E2bEndpointInputs, E2bEndpointOutputs } from './endpoints/types';
