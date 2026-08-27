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
import type { PlainEndpointInputs, PlainEndpointOutputs } from './endpoints/types';
import { PlainEndpointInputSchemas, PlainEndpointOutputSchemas } from './endpoints/types';
import type {
	PlainWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { PlainSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchPlainTenantWebhook } from './webhooks/tenant-matcher';
import { resolvePlainOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type PlainPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPlainPlugin['hooks'];
	webhookHooks?: InternalPlainPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof plainEndpointsNested>;
};

export type PlainContext = CorsairPluginContext<
	typeof PlainSchema,
	PlainPluginOptions
>;

export type PlainKeyBuilderContext = KeyBuilderContext<PlainPluginOptions>;

export type PlainBoundEndpoints = BindEndpoints<typeof plainEndpointsNested>;

type PlainEndpoint<
	K extends keyof PlainEndpointOutputs,
> = CorsairEndpoint<
	PlainContext,
	PlainEndpointInputs[K],
	PlainEndpointOutputs[K]
>;

export type PlainEndpoints = {
	exampleGet: PlainEndpoint<'exampleGet'>;
};

type PlainWebhook<
	K extends keyof PlainWebhookOutputs,
	TEvent,
> = CorsairWebhook<PlainContext, TEvent, PlainWebhookOutputs[K]>;

export type PlainWebhooks = {
	example: PlainWebhook<'example', ExampleEvent>;
};

export type PlainBoundWebhooks = BindWebhooks<PlainWebhooks>;

const plainEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const plainWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const plainEndpointSchemas = {
	'example.get': {
		input: PlainEndpointInputSchemas.exampleGet,
		output: PlainEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof plainEndpointsNested>;

const plainWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof plainWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const plainEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof plainEndpointsNested>;

export const plainAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePlainPlugin<T extends PlainPluginOptions> = CorsairPlugin<
	'plain',
	typeof PlainSchema,
	typeof plainEndpointsNested,
	typeof plainWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalPlainPlugin = BasePlainPlugin<PlainPluginOptions>;

export type ExternalPlainPlugin<T extends PlainPluginOptions> =
	BasePlainPlugin<T>;

export function plain<const T extends PlainPluginOptions>(
	incomingOptions: PlainPluginOptions & T = {} as PlainPluginOptions & T,
): ExternalPlainPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'plain',
		authConfig: plainAuthConfig,
		schema: PlainSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: plainEndpointsNested,
		webhooks: plainWebhooksNested,
		endpointMeta: plainEndpointMeta,
		endpointSchemas: plainEndpointSchemas,
		webhookSchemas: plainWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-plain-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchPlainTenantWebhook,
		oauthWebhookTenantLinkResolver: resolvePlainOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PlainKeyBuilderContext, source) => {
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
	} satisfies InternalPlainPlugin;
}

export type {
	ExampleEvent,
	PlainWebhookOutputs,
} from './webhooks/types';

export type {
	PlainEndpointInputs,
	PlainEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
