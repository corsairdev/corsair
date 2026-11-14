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
import type { ShortcutEndpointInputs, ShortcutEndpointOutputs } from './endpoints/types';
import { ShortcutEndpointInputSchemas, ShortcutEndpointOutputSchemas } from './endpoints/types';
import type {
	ShortcutWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ShortcutSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchShortcutTenantWebhook } from './webhooks/tenant-matcher';
import { resolveShortcutOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ShortcutPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalShortcutPlugin['hooks'];
	webhookHooks?: InternalShortcutPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof shortcutEndpointsNested>;
};

export type ShortcutContext = CorsairPluginContext<
	typeof ShortcutSchema,
	ShortcutPluginOptions
>;

export type ShortcutKeyBuilderContext = KeyBuilderContext<ShortcutPluginOptions>;

export type ShortcutBoundEndpoints = BindEndpoints<typeof shortcutEndpointsNested>;

type ShortcutEndpoint<
	K extends keyof ShortcutEndpointOutputs,
> = CorsairEndpoint<
	ShortcutContext,
	ShortcutEndpointInputs[K],
	ShortcutEndpointOutputs[K]
>;

export type ShortcutEndpoints = {
	exampleGet: ShortcutEndpoint<'exampleGet'>;
};

type ShortcutWebhook<
	K extends keyof ShortcutWebhookOutputs,
	TEvent,
> = CorsairWebhook<ShortcutContext, TEvent, ShortcutWebhookOutputs[K]>;

export type ShortcutWebhooks = {
	example: ShortcutWebhook<'example', ExampleEvent>;
};

export type ShortcutBoundWebhooks = BindWebhooks<ShortcutWebhooks>;

const shortcutEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const shortcutWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const shortcutEndpointSchemas = {
	'example.get': {
		input: ShortcutEndpointInputSchemas.exampleGet,
		output: ShortcutEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof shortcutEndpointsNested>;

const shortcutWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof shortcutWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const shortcutEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof shortcutEndpointsNested>;

export const shortcutAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseShortcutPlugin<T extends ShortcutPluginOptions> = CorsairPlugin<
	'shortcut',
	typeof ShortcutSchema,
	typeof shortcutEndpointsNested,
	typeof shortcutWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalShortcutPlugin = BaseShortcutPlugin<ShortcutPluginOptions>;

export type ExternalShortcutPlugin<T extends ShortcutPluginOptions> =
	BaseShortcutPlugin<T>;

export function shortcut<const T extends ShortcutPluginOptions>(
	incomingOptions: ShortcutPluginOptions & T = {} as ShortcutPluginOptions & T,
): ExternalShortcutPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'shortcut',
		authConfig: shortcutAuthConfig,
		schema: ShortcutSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: shortcutEndpointsNested,
		webhooks: shortcutWebhooksNested,
		endpointMeta: shortcutEndpointMeta,
		endpointSchemas: shortcutEndpointSchemas,
		webhookSchemas: shortcutWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-shortcut-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchShortcutTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveShortcutOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ShortcutKeyBuilderContext, source) => {
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
	} satisfies InternalShortcutPlugin;
}

export type {
	ExampleEvent,
	ShortcutWebhookOutputs,
} from './webhooks/types';

export type {
	ShortcutEndpointInputs,
	ShortcutEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
