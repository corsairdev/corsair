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
import type { DocmosisEndpointInputs, DocmosisEndpointOutputs } from './endpoints/types';
import { DocmosisEndpointInputSchemas, DocmosisEndpointOutputSchemas } from './endpoints/types';
import type {
	DocmosisWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { DocmosisSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchDocmosisTenantWebhook } from './webhooks/tenant-matcher';
import { resolveDocmosisOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type DocmosisPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDocmosisPlugin['hooks'];
	webhookHooks?: InternalDocmosisPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docmosisEndpointsNested>;
};

export type DocmosisContext = CorsairPluginContext<
	typeof DocmosisSchema,
	DocmosisPluginOptions
>;

export type DocmosisKeyBuilderContext = KeyBuilderContext<DocmosisPluginOptions>;

export type DocmosisBoundEndpoints = BindEndpoints<typeof docmosisEndpointsNested>;

type DocmosisEndpoint<
	K extends keyof DocmosisEndpointOutputs,
> = CorsairEndpoint<
	DocmosisContext,
	DocmosisEndpointInputs[K],
	DocmosisEndpointOutputs[K]
>;

export type DocmosisEndpoints = {
	exampleGet: DocmosisEndpoint<'exampleGet'>;
};

type DocmosisWebhook<
	K extends keyof DocmosisWebhookOutputs,
	TEvent,
> = CorsairWebhook<DocmosisContext, TEvent, DocmosisWebhookOutputs[K]>;

export type DocmosisWebhooks = {
	example: DocmosisWebhook<'example', ExampleEvent>;
};

export type DocmosisBoundWebhooks = BindWebhooks<DocmosisWebhooks>;

const docmosisEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const docmosisWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const docmosisEndpointSchemas = {
	'example.get': {
		input: DocmosisEndpointInputSchemas.exampleGet,
		output: DocmosisEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof docmosisEndpointsNested>;

const docmosisWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof docmosisWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const docmosisEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof docmosisEndpointsNested>;

export const docmosisAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDocmosisPlugin<T extends DocmosisPluginOptions> = CorsairPlugin<
	'docmosis',
	typeof DocmosisSchema,
	typeof docmosisEndpointsNested,
	typeof docmosisWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDocmosisPlugin = BaseDocmosisPlugin<DocmosisPluginOptions>;

export type ExternalDocmosisPlugin<T extends DocmosisPluginOptions> =
	BaseDocmosisPlugin<T>;

export function docmosis<const T extends DocmosisPluginOptions>(
	incomingOptions: DocmosisPluginOptions & T = {} as DocmosisPluginOptions & T,
): ExternalDocmosisPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'docmosis',
		authConfig: docmosisAuthConfig,
		schema: DocmosisSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: docmosisEndpointsNested,
		webhooks: docmosisWebhooksNested,
		endpointMeta: docmosisEndpointMeta,
		endpointSchemas: docmosisEndpointSchemas,
		webhookSchemas: docmosisWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-docmosis-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDocmosisTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDocmosisOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DocmosisKeyBuilderContext, source) => {
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
	} satisfies InternalDocmosisPlugin;
}

export type {
	ExampleEvent,
	DocmosisWebhookOutputs,
} from './webhooks/types';

export type {
	DocmosisEndpointInputs,
	DocmosisEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
