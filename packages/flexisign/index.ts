import type {
	AuthTypes,
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
import { Example } from './endpoints';
import type {
	FlexisignEndpointInputs,
	FlexisignEndpointOutputs,
} from './endpoints/types';
import {
	FlexisignEndpointInputSchemas,
	FlexisignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FlexisignSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveFlexisignOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchFlexisignTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, FlexisignWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type FlexisignPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFlexisignPlugin['hooks'];
	webhookHooks?: InternalFlexisignPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof flexisignEndpointsNested>;
};

export type FlexisignContext = CorsairPluginContext<
	typeof FlexisignSchema,
	FlexisignPluginOptions
>;

export type FlexisignKeyBuilderContext =
	KeyBuilderContext<FlexisignPluginOptions>;

export type FlexisignBoundEndpoints = BindEndpoints<
	typeof flexisignEndpointsNested
>;

type FlexisignEndpoint<K extends keyof FlexisignEndpointOutputs> =
	CorsairEndpoint<
		FlexisignContext,
		FlexisignEndpointInputs[K],
		FlexisignEndpointOutputs[K]
	>;

export type FlexisignEndpoints = {
	ListTemplates: FlexisignEndpoint<'ListTemplates'>;
};

type FlexisignWebhook<
	K extends keyof FlexisignWebhookOutputs,
	TEvent,
> = CorsairWebhook<FlexisignContext, TEvent, FlexisignWebhookOutputs[K]>;

export type FlexisignWebhooks = {
	list: { templates: FlexisignWebhook<'example', ExampleEvent> };
};

export type FlexisignBoundWebhooks = BindWebhooks<FlexisignWebhooks>;

const flexisignEndpointsNested = {
	list: { templates: Example.listTemplates },
} as const;

const flexisignWebhooksNested = {
	list: { templates: ExampleWebhooks.example },
} as const;

export const flexisignEndpointSchemas = {
	'list.templates': {
		input: FlexisignEndpointInputSchemas.ListTemplates,
		output: FlexisignEndpointOutputSchemas.ListTemplates,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof flexisignEndpointsNested
>;

const flexisignWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof flexisignWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const flexisignEndpointMeta = {
	'list.templates': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof flexisignEndpointsNested
>;

export const flexisignAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFlexisignPlugin<T extends FlexisignPluginOptions> =
	CorsairPlugin<
		'flexisign',
		typeof FlexisignSchema,
		typeof flexisignEndpointsNested,
		typeof flexisignWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalFlexisignPlugin =
	BaseFlexisignPlugin<FlexisignPluginOptions>;

export type ExternalFlexisignPlugin<T extends FlexisignPluginOptions> =
	BaseFlexisignPlugin<T>;

export function flexisign<const T extends FlexisignPluginOptions>(
	incomingOptions: FlexisignPluginOptions & T = {} as FlexisignPluginOptions &
		T,
): ExternalFlexisignPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'flexisign',
		authConfig: flexisignAuthConfig,
		schema: FlexisignSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: flexisignEndpointsNested,
		webhooks: flexisignWebhooksNested,
		endpointMeta: flexisignEndpointMeta,
		endpointSchemas: flexisignEndpointSchemas,
		webhookSchemas: flexisignWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-flexisign-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFlexisignTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFlexisignOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FlexisignKeyBuilderContext, source) => {
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
	} satisfies InternalFlexisignPlugin;
}

export type {
	FlexisignEndpointInputs,
	FlexisignEndpointOutputs,
	ListTemplatesInput,
	ListTemplatesResponse,
} from './endpoints/types';
export type {
	ExampleEvent,
	FlexisignWebhookOutputs,
} from './webhooks/types';
