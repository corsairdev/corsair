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
import type { FinmeiEndpointInputs, FinmeiEndpointOutputs } from './endpoints/types';
import { FinmeiEndpointInputSchemas, FinmeiEndpointOutputSchemas } from './endpoints/types';
import type {
	FinmeiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { FinmeiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchFinmeiTenantWebhook } from './webhooks/tenant-matcher';
import { resolveFinmeiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type FinmeiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFinmeiPlugin['hooks'];
	webhookHooks?: InternalFinmeiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof finmeiEndpointsNested>;
};

export type FinmeiContext = CorsairPluginContext<
	typeof FinmeiSchema,
	FinmeiPluginOptions
>;

export type FinmeiKeyBuilderContext = KeyBuilderContext<FinmeiPluginOptions>;

export type FinmeiBoundEndpoints = BindEndpoints<typeof finmeiEndpointsNested>;

type FinmeiEndpoint<
	K extends keyof FinmeiEndpointOutputs,
> = CorsairEndpoint<
	FinmeiContext,
	FinmeiEndpointInputs[K],
	FinmeiEndpointOutputs[K]
>;

export type FinmeiEndpoints = {
	exampleGet: FinmeiEndpoint<'exampleGet'>;
};

type FinmeiWebhook<
	K extends keyof FinmeiWebhookOutputs,
	TEvent,
> = CorsairWebhook<FinmeiContext, TEvent, FinmeiWebhookOutputs[K]>;

export type FinmeiWebhooks = {
	example: FinmeiWebhook<'example', ExampleEvent>;
};

export type FinmeiBoundWebhooks = BindWebhooks<FinmeiWebhooks>;

const finmeiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const finmeiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const finmeiEndpointSchemas = {
	'example.get': {
		input: FinmeiEndpointInputSchemas.exampleGet,
		output: FinmeiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof finmeiEndpointsNested>;

const finmeiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof finmeiWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const finmeiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof finmeiEndpointsNested>;

export const finmeiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFinmeiPlugin<T extends FinmeiPluginOptions> = CorsairPlugin<
	'finmei',
	typeof FinmeiSchema,
	typeof finmeiEndpointsNested,
	typeof finmeiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFinmeiPlugin = BaseFinmeiPlugin<FinmeiPluginOptions>;

export type ExternalFinmeiPlugin<T extends FinmeiPluginOptions> =
	BaseFinmeiPlugin<T>;

export function finmei<const T extends FinmeiPluginOptions>(
	incomingOptions: FinmeiPluginOptions & T = {} as FinmeiPluginOptions & T,
): ExternalFinmeiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'finmei',
		authConfig: finmeiAuthConfig,
		schema: FinmeiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: finmeiEndpointsNested,
		webhooks: finmeiWebhooksNested,
		endpointMeta: finmeiEndpointMeta,
		endpointSchemas: finmeiEndpointSchemas,
		webhookSchemas: finmeiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-finmei-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchFinmeiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveFinmeiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FinmeiKeyBuilderContext, source) => {
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
	} satisfies InternalFinmeiPlugin;
}

export type {
	ExampleEvent,
	FinmeiWebhookOutputs,
} from './webhooks/types';

export type {
	FinmeiEndpointInputs,
	FinmeiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
