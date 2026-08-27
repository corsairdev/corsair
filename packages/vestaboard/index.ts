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
import type { VestaboardEndpointInputs, VestaboardEndpointOutputs } from './endpoints/types';
import { VestaboardEndpointInputSchemas, VestaboardEndpointOutputSchemas } from './endpoints/types';
import type {
	VestaboardWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { VestaboardSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchVestaboardTenantWebhook } from './webhooks/tenant-matcher';
import { resolveVestaboardOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type VestaboardPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalVestaboardPlugin['hooks'];
	webhookHooks?: InternalVestaboardPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vestaboardEndpointsNested>;
};

export type VestaboardContext = CorsairPluginContext<
	typeof VestaboardSchema,
	VestaboardPluginOptions
>;

export type VestaboardKeyBuilderContext = KeyBuilderContext<VestaboardPluginOptions>;

export type VestaboardBoundEndpoints = BindEndpoints<typeof vestaboardEndpointsNested>;

type VestaboardEndpoint<
	K extends keyof VestaboardEndpointOutputs,
> = CorsairEndpoint<
	VestaboardContext,
	VestaboardEndpointInputs[K],
	VestaboardEndpointOutputs[K]
>;

export type VestaboardEndpoints = {
	exampleGet: VestaboardEndpoint<'exampleGet'>;
};

type VestaboardWebhook<
	K extends keyof VestaboardWebhookOutputs,
	TEvent,
> = CorsairWebhook<VestaboardContext, TEvent, VestaboardWebhookOutputs[K]>;

export type VestaboardWebhooks = {
	example: VestaboardWebhook<'example', ExampleEvent>;
};

export type VestaboardBoundWebhooks = BindWebhooks<VestaboardWebhooks>;

const vestaboardEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const vestaboardWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const vestaboardEndpointSchemas = {
	'example.get': {
		input: VestaboardEndpointInputSchemas.exampleGet,
		output: VestaboardEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof vestaboardEndpointsNested>;

const vestaboardWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof vestaboardWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const vestaboardEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof vestaboardEndpointsNested>;

export const vestaboardAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseVestaboardPlugin<T extends VestaboardPluginOptions> = CorsairPlugin<
	'vestaboard',
	typeof VestaboardSchema,
	typeof vestaboardEndpointsNested,
	typeof vestaboardWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalVestaboardPlugin = BaseVestaboardPlugin<VestaboardPluginOptions>;

export type ExternalVestaboardPlugin<T extends VestaboardPluginOptions> =
	BaseVestaboardPlugin<T>;

export function vestaboard<const T extends VestaboardPluginOptions>(
	incomingOptions: VestaboardPluginOptions & T = {} as VestaboardPluginOptions & T,
): ExternalVestaboardPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'vestaboard',
		authConfig: vestaboardAuthConfig,
		schema: VestaboardSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: vestaboardEndpointsNested,
		webhooks: vestaboardWebhooksNested,
		endpointMeta: vestaboardEndpointMeta,
		endpointSchemas: vestaboardEndpointSchemas,
		webhookSchemas: vestaboardWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-vestaboard-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchVestaboardTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveVestaboardOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VestaboardKeyBuilderContext, source) => {
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
	} satisfies InternalVestaboardPlugin;
}

export type {
	ExampleEvent,
	VestaboardWebhookOutputs,
} from './webhooks/types';

export type {
	VestaboardEndpointInputs,
	VestaboardEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
