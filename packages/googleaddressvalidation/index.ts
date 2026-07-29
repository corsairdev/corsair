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
	GoogleAddressValidationEndpointInputs,
	GoogleAddressValidationEndpointOutputs,
} from './endpoints/types';
import {
	GoogleAddressValidationEndpointInputSchemas,
	GoogleAddressValidationEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleAddressValidationSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveGoogleAddressValidationOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchGoogleAddressValidationTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ExampleEvent,
	GoogleAddressValidationWebhookOutputs,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type GoogleAddressValidationPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGoogleAddressValidationPlugin['hooks'];
	webhookHooks?: InternalGoogleAddressValidationPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof googleAddressValidationEndpointsNested
	>;
};

export type GoogleAddressValidationContext = CorsairPluginContext<
	typeof GoogleAddressValidationSchema,
	GoogleAddressValidationPluginOptions
>;

export type GoogleAddressValidationKeyBuilderContext =
	KeyBuilderContext<GoogleAddressValidationPluginOptions>;

export type GoogleAddressValidationBoundEndpoints = BindEndpoints<
	typeof googleAddressValidationEndpointsNested
>;

type GoogleAddressValidationEndpoint<
	K extends keyof GoogleAddressValidationEndpointOutputs,
> = CorsairEndpoint<
	GoogleAddressValidationContext,
	GoogleAddressValidationEndpointInputs[K],
	GoogleAddressValidationEndpointOutputs[K]
>;

export type GoogleAddressValidationEndpoints = {
	exampleGet: GoogleAddressValidationEndpoint<'exampleGet'>;
};

type GoogleAddressValidationWebhook<
	K extends keyof GoogleAddressValidationWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	GoogleAddressValidationContext,
	TEvent,
	GoogleAddressValidationWebhookOutputs[K]
>;

export type GoogleAddressValidationWebhooks = {
	example: GoogleAddressValidationWebhook<'example', ExampleEvent>;
};

export type GoogleAddressValidationBoundWebhooks =
	BindWebhooks<GoogleAddressValidationWebhooks>;

const googleAddressValidationEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const googleAddressValidationWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const googleAddressValidationEndpointSchemas = {
	'example.get': {
		input: GoogleAddressValidationEndpointInputSchemas.exampleGet,
		output: GoogleAddressValidationEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleAddressValidationEndpointsNested
>;

const googleAddressValidationWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof googleAddressValidationWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const googleAddressValidationEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof googleAddressValidationEndpointsNested
>;

export const googleAddressValidationAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleAddressValidationPlugin<
	T extends GoogleAddressValidationPluginOptions,
> = CorsairPlugin<
	'googleaddressvalidation',
	typeof GoogleAddressValidationSchema,
	typeof googleAddressValidationEndpointsNested,
	typeof googleAddressValidationWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGoogleAddressValidationPlugin =
	BaseGoogleAddressValidationPlugin<GoogleAddressValidationPluginOptions>;

export type ExternalGoogleAddressValidationPlugin<
	T extends GoogleAddressValidationPluginOptions,
> = BaseGoogleAddressValidationPlugin<T>;

export function googleaddressvalidation<
	const T extends GoogleAddressValidationPluginOptions,
>(
	incomingOptions: GoogleAddressValidationPluginOptions &
		T = {} as GoogleAddressValidationPluginOptions & T,
): ExternalGoogleAddressValidationPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googleaddressvalidation',
		authConfig: googleAddressValidationAuthConfig,
		schema: GoogleAddressValidationSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleAddressValidationEndpointsNested,
		webhooks: googleAddressValidationWebhooksNested,
		endpointMeta: googleAddressValidationEndpointMeta,
		endpointSchemas: googleAddressValidationEndpointSchemas,
		webhookSchemas: googleAddressValidationWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-googleaddressvalidation-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGoogleAddressValidationTenantWebhook,
		oauthWebhookTenantLinkResolver:
			resolveGoogleAddressValidationOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: GoogleAddressValidationKeyBuilderContext,
			source,
		) => {
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
	} satisfies InternalGoogleAddressValidationPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	GoogleAddressValidationEndpointInputs,
	GoogleAddressValidationEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	GoogleAddressValidationWebhookOutputs,
} from './webhooks/types';
