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
import type { HelpScoutEndpointInputs, HelpScoutEndpointOutputs } from './endpoints/types';
import { HelpScoutEndpointInputSchemas, HelpScoutEndpointOutputSchemas } from './endpoints/types';
import type {
	HelpScoutWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { HelpScoutSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchHelpScoutTenantWebhook } from './webhooks/tenant-matcher';
import { resolveHelpScoutOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type HelpScoutPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHelpScoutPlugin['hooks'];
	webhookHooks?: InternalHelpScoutPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof helpScoutEndpointsNested>;
};

export type HelpScoutContext = CorsairPluginContext<
	typeof HelpScoutSchema,
	HelpScoutPluginOptions
>;

export type HelpScoutKeyBuilderContext = KeyBuilderContext<HelpScoutPluginOptions>;

export type HelpScoutBoundEndpoints = BindEndpoints<typeof helpScoutEndpointsNested>;

type HelpScoutEndpoint<
	K extends keyof HelpScoutEndpointOutputs,
> = CorsairEndpoint<
	HelpScoutContext,
	HelpScoutEndpointInputs[K],
	HelpScoutEndpointOutputs[K]
>;

export type HelpScoutEndpoints = {
	exampleGet: HelpScoutEndpoint<'exampleGet'>;
};

type HelpScoutWebhook<
	K extends keyof HelpScoutWebhookOutputs,
	TEvent,
> = CorsairWebhook<HelpScoutContext, TEvent, HelpScoutWebhookOutputs[K]>;

export type HelpScoutWebhooks = {
	example: HelpScoutWebhook<'example', ExampleEvent>;
};

export type HelpScoutBoundWebhooks = BindWebhooks<HelpScoutWebhooks>;

const helpScoutEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const helpScoutWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const helpScoutEndpointSchemas = {
	'example.get': {
		input: HelpScoutEndpointInputSchemas.exampleGet,
		output: HelpScoutEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof helpScoutEndpointsNested>;

const helpScoutWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof helpScoutWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const helpScoutEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof helpScoutEndpointsNested>;

export const helpScoutAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHelpScoutPlugin<T extends HelpScoutPluginOptions> = CorsairPlugin<
	'helpscout',
	typeof HelpScoutSchema,
	typeof helpScoutEndpointsNested,
	typeof helpScoutWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHelpScoutPlugin = BaseHelpScoutPlugin<HelpScoutPluginOptions>;

export type ExternalHelpScoutPlugin<T extends HelpScoutPluginOptions> =
	BaseHelpScoutPlugin<T>;

export function helpscout<const T extends HelpScoutPluginOptions>(
	incomingOptions: HelpScoutPluginOptions & T = {} as HelpScoutPluginOptions & T,
): ExternalHelpScoutPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'helpscout',
		authConfig: helpScoutAuthConfig,
		schema: HelpScoutSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: helpScoutEndpointsNested,
		webhooks: helpScoutWebhooksNested,
		endpointMeta: helpScoutEndpointMeta,
		endpointSchemas: helpScoutEndpointSchemas,
		webhookSchemas: helpScoutWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-helpscout-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHelpScoutTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHelpScoutOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HelpScoutKeyBuilderContext, source) => {
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
	} satisfies InternalHelpScoutPlugin;
}

export type {
	ExampleEvent,
	HelpScoutWebhookOutputs,
} from './webhooks/types';

export type {
	HelpScoutEndpointInputs,
	HelpScoutEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
