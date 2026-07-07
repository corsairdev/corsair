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
import type { CloudinaryEndpointInputs, CloudinaryEndpointOutputs } from './endpoints/types';
import { CloudinaryEndpointInputSchemas, CloudinaryEndpointOutputSchemas } from './endpoints/types';
import type {
	CloudinaryWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { CloudinarySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchCloudinaryTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCloudinaryOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type CloudinaryPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCloudinaryPlugin['hooks'];
	webhookHooks?: InternalCloudinaryPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudinaryEndpointsNested>;
};

export type CloudinaryContext = CorsairPluginContext<
	typeof CloudinarySchema,
	CloudinaryPluginOptions
>;

export type CloudinaryKeyBuilderContext = KeyBuilderContext<CloudinaryPluginOptions>;

export type CloudinaryBoundEndpoints = BindEndpoints<typeof cloudinaryEndpointsNested>;

type CloudinaryEndpoint<
	K extends keyof CloudinaryEndpointOutputs,
> = CorsairEndpoint<
	CloudinaryContext,
	CloudinaryEndpointInputs[K],
	CloudinaryEndpointOutputs[K]
>;

export type CloudinaryEndpoints = {
	exampleGet: CloudinaryEndpoint<'exampleGet'>;
};

type CloudinaryWebhook<
	K extends keyof CloudinaryWebhookOutputs,
	TEvent,
> = CorsairWebhook<CloudinaryContext, TEvent, CloudinaryWebhookOutputs[K]>;

export type CloudinaryWebhooks = {
	example: CloudinaryWebhook<'example', ExampleEvent>;
};

export type CloudinaryBoundWebhooks = BindWebhooks<CloudinaryWebhooks>;

const cloudinaryEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const cloudinaryWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const cloudinaryEndpointSchemas = {
	'example.get': {
		input: CloudinaryEndpointInputSchemas.exampleGet,
		output: CloudinaryEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof cloudinaryEndpointsNested>;

const cloudinaryWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof cloudinaryWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudinaryEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof cloudinaryEndpointsNested>;

export const cloudinaryAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCloudinaryPlugin<T extends CloudinaryPluginOptions> = CorsairPlugin<
	'cloudinary',
	typeof CloudinarySchema,
	typeof cloudinaryEndpointsNested,
	typeof cloudinaryWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCloudinaryPlugin = BaseCloudinaryPlugin<CloudinaryPluginOptions>;

export type ExternalCloudinaryPlugin<T extends CloudinaryPluginOptions> =
	BaseCloudinaryPlugin<T>;

export function cloudinary<const T extends CloudinaryPluginOptions>(
	incomingOptions: CloudinaryPluginOptions & T = {} as CloudinaryPluginOptions & T,
): ExternalCloudinaryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cloudinary',
		authConfig: cloudinaryAuthConfig,
		schema: CloudinarySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: cloudinaryEndpointsNested,
		webhooks: cloudinaryWebhooksNested,
		endpointMeta: cloudinaryEndpointMeta,
		endpointSchemas: cloudinaryEndpointSchemas,
		webhookSchemas: cloudinaryWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-cloudinary-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCloudinaryTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCloudinaryOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudinaryKeyBuilderContext, source) => {
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


			return '';
		},
	} satisfies InternalCloudinaryPlugin;
}

export type {
	ExampleEvent,
	CloudinaryWebhookOutputs,
} from './webhooks/types';

export type {
	CloudinaryEndpointInputs,
	CloudinaryEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
