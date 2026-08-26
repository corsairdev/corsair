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
import { Users } from './endpoints';
import type {
	WakaTimeEndpointInputs,
	WakaTimeEndpointOutputs,
} from './endpoints/types';
import {
	WakaTimeEndpointInputSchemas,
	WakaTimeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WakaTimeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveWakaTimeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchWakaTimeTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, WakaTimeWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type WakaTimePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWakaTimePlugin['hooks'];
	webhookHooks?: InternalWakaTimePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wakaTimeEndpointsNested>;
};

export type WakaTimeContext = CorsairPluginContext<
	typeof WakaTimeSchema,
	WakaTimePluginOptions
>;

export type WakaTimeKeyBuilderContext =
	KeyBuilderContext<WakaTimePluginOptions>;

export type WakaTimeBoundEndpoints = BindEndpoints<
	typeof wakaTimeEndpointsNested
>;

type WakaTimeEndpoint<K extends keyof WakaTimeEndpointOutputs> =
	CorsairEndpoint<
		WakaTimeContext,
		WakaTimeEndpointInputs[K],
		WakaTimeEndpointOutputs[K]
	>;

export type WakaTimeEndpoints = {
	getCurrentUser: WakaTimeEndpoint<'getCurrentUser'>;
};

type WakaTimeWebhook<
	K extends keyof WakaTimeWebhookOutputs,
	TEvent,
> = CorsairWebhook<WakaTimeContext, TEvent, WakaTimeWebhookOutputs[K]>;

export type WakaTimeWebhooks = {
	example: WakaTimeWebhook<'example', ExampleEvent>;
};

export type WakaTimeBoundWebhooks = BindWebhooks<WakaTimeWebhooks>;

const wakaTimeEndpointsNested = {
	users: {
		current: Users.current,
	},
} as const;

const wakaTimeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const wakaTimeEndpointSchemas = {
	'users.current': {
		input: WakaTimeEndpointInputSchemas.getCurrentUser,
		output: WakaTimeEndpointOutputSchemas.getCurrentUser,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof wakaTimeEndpointsNested
>;

const wakaTimeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof wakaTimeWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const wakaTimeEndpointMeta = {
	'users.current': {
		riskLevel: 'read',
		description: 'Get the current WakaTime user',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof wakaTimeEndpointsNested>;

export const wakaTimeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWakaTimePlugin<T extends WakaTimePluginOptions> = CorsairPlugin<
	'wakatime',
	typeof WakaTimeSchema,
	typeof wakaTimeEndpointsNested,
	typeof wakaTimeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWakaTimePlugin = BaseWakaTimePlugin<WakaTimePluginOptions>;

export type ExternalWakaTimePlugin<T extends WakaTimePluginOptions> =
	BaseWakaTimePlugin<T>;

export function wakatime<const T extends WakaTimePluginOptions>(
	incomingOptions: WakaTimePluginOptions & T = {} as WakaTimePluginOptions & T,
): ExternalWakaTimePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wakatime',
		authConfig: wakaTimeAuthConfig,
		schema: WakaTimeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: wakaTimeEndpointsNested,
		webhooks: wakaTimeWebhooksNested,
		endpointMeta: wakaTimeEndpointMeta,
		endpointSchemas: wakaTimeEndpointSchemas,
		webhookSchemas: wakaTimeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-wakatime-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchWakaTimeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveWakaTimeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WakaTimeKeyBuilderContext, source) => {
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
	} satisfies InternalWakaTimePlugin;
}

export type {
	GetCurrentUserInput,
	GetCurrentUserResponse,
	WakaTimeEndpointInputs,
	WakaTimeEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	WakaTimeWebhookOutputs,
} from './webhooks/types';
