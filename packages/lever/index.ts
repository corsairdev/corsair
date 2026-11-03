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
import type { LeverEndpointInputs, LeverEndpointOutputs } from './endpoints/types';
import { LeverEndpointInputSchemas, LeverEndpointOutputSchemas } from './endpoints/types';
import type {
	LeverWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { LeverSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchLeverTenantWebhook } from './webhooks/tenant-matcher';
import { resolveLeverOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type LeverPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLeverPlugin['hooks'];
	webhookHooks?: InternalLeverPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof leverEndpointsNested>;
};

export type LeverContext = CorsairPluginContext<
	typeof LeverSchema,
	LeverPluginOptions
>;

export type LeverKeyBuilderContext = KeyBuilderContext<LeverPluginOptions>;

export type LeverBoundEndpoints = BindEndpoints<typeof leverEndpointsNested>;

type LeverEndpoint<
	K extends keyof LeverEndpointOutputs,
> = CorsairEndpoint<
	LeverContext,
	LeverEndpointInputs[K],
	LeverEndpointOutputs[K]
>;

export type LeverEndpoints = {
	exampleGet: LeverEndpoint<'exampleGet'>;
};

type LeverWebhook<
	K extends keyof LeverWebhookOutputs,
	TEvent,
> = CorsairWebhook<LeverContext, TEvent, LeverWebhookOutputs[K]>;

export type LeverWebhooks = {
	example: LeverWebhook<'example', ExampleEvent>;
};

export type LeverBoundWebhooks = BindWebhooks<LeverWebhooks>;

const leverEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const leverWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const leverEndpointSchemas = {
	'example.get': {
		input: LeverEndpointInputSchemas.exampleGet,
		output: LeverEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof leverEndpointsNested>;

const leverWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof leverWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const leverEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof leverEndpointsNested>;

export const leverAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLeverPlugin<T extends LeverPluginOptions> = CorsairPlugin<
	'lever',
	typeof LeverSchema,
	typeof leverEndpointsNested,
	typeof leverWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLeverPlugin = BaseLeverPlugin<LeverPluginOptions>;

export type ExternalLeverPlugin<T extends LeverPluginOptions> =
	BaseLeverPlugin<T>;

export function lever<const T extends LeverPluginOptions>(
	incomingOptions: LeverPluginOptions & T = {} as LeverPluginOptions & T,
): ExternalLeverPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lever',
		authConfig: leverAuthConfig,
		schema: LeverSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: leverEndpointsNested,
		webhooks: leverWebhooksNested,
		endpointMeta: leverEndpointMeta,
		endpointSchemas: leverEndpointSchemas,
		webhookSchemas: leverWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-lever-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchLeverTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveLeverOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LeverKeyBuilderContext, source) => {
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
	} satisfies InternalLeverPlugin;
}

export type {
	ExampleEvent,
	LeverWebhookOutputs,
} from './webhooks/types';

export type {
	LeverEndpointInputs,
	LeverEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
