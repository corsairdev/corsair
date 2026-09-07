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
	ClassmarkerEndpointInputs,
	ClassmarkerEndpointOutputs,
} from './endpoints/types';
import {
	ClassmarkerEndpointInputSchemas,
	ClassmarkerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClassmarkerSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveClassmarkerOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchClassmarkerTenantWebhook } from './webhooks/tenant-matcher';
import type { ClassmarkerWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ClassmarkerPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalClassmarkerPlugin['hooks'];
	webhookHooks?: InternalClassmarkerPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof classmarkerEndpointsNested>;
};

export type ClassmarkerContext = CorsairPluginContext<
	typeof ClassmarkerSchema,
	ClassmarkerPluginOptions
>;

export type ClassmarkerKeyBuilderContext =
	KeyBuilderContext<ClassmarkerPluginOptions>;

export type ClassmarkerBoundEndpoints = BindEndpoints<
	typeof classmarkerEndpointsNested
>;

type ClassmarkerEndpoint<K extends keyof ClassmarkerEndpointOutputs> =
	CorsairEndpoint<
		ClassmarkerContext,
		ClassmarkerEndpointInputs[K],
		ClassmarkerEndpointOutputs[K]
	>;

export type ClassmarkerEndpoints = {
	exampleGet: ClassmarkerEndpoint<'exampleGet'>;
};

type ClassmarkerWebhook<
	K extends keyof ClassmarkerWebhookOutputs,
	TEvent,
> = CorsairWebhook<ClassmarkerContext, TEvent, ClassmarkerWebhookOutputs[K]>;

export type ClassmarkerWebhooks = {
	example: ClassmarkerWebhook<'example', ExampleEvent>;
};

export type ClassmarkerBoundWebhooks = BindWebhooks<ClassmarkerWebhooks>;

const classmarkerEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const classmarkerWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const classmarkerEndpointSchemas = {
	'example.get': {
		input: ClassmarkerEndpointInputSchemas.exampleGet,
		output: ClassmarkerEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof classmarkerEndpointsNested
>;

const classmarkerWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof classmarkerWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const classmarkerEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof classmarkerEndpointsNested
>;

export const classmarkerAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClassmarkerPlugin<T extends ClassmarkerPluginOptions> =
	CorsairPlugin<
		'classmarker',
		typeof ClassmarkerSchema,
		typeof classmarkerEndpointsNested,
		typeof classmarkerWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalClassmarkerPlugin =
	BaseClassmarkerPlugin<ClassmarkerPluginOptions>;

export type ExternalClassmarkerPlugin<T extends ClassmarkerPluginOptions> =
	BaseClassmarkerPlugin<T>;

export function classmarker<const T extends ClassmarkerPluginOptions>(
	incomingOptions: ClassmarkerPluginOptions &
		T = {} as ClassmarkerPluginOptions & T,
): ExternalClassmarkerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'classmarker',
		authConfig: classmarkerAuthConfig,
		schema: ClassmarkerSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: classmarkerEndpointsNested,
		webhooks: classmarkerWebhooksNested,
		endpointMeta: classmarkerEndpointMeta,
		endpointSchemas: classmarkerEndpointSchemas,
		webhookSchemas: classmarkerWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-classmarker-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchClassmarkerTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveClassmarkerOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClassmarkerKeyBuilderContext, source) => {
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
	} satisfies InternalClassmarkerPlugin;
}

export type {
	ClassmarkerEndpointInputs,
	ClassmarkerEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	ClassmarkerWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
