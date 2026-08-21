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
import { GetCredential } from './endpoints';
import type {
	AccredibleCertificatesEndpointInputs,
	AccredibleCertificatesEndpointOutputs,
} from './endpoints/types';
import {
	AccredibleCertificatesEndpointInputSchemas,
	AccredibleCertificatesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AccredibleCertificatesSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveAccredibleCertificatesOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAccredibleCertificatesTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AccredibleCertificatesWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type AccredibleCertificatesPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAccredibleCertificatesPlugin['hooks'];
	webhookHooks?: InternalAccredibleCertificatesPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof accredibleCertificatesEndpointsNested
	>;
};

export type AccredibleCertificatesContext = CorsairPluginContext<
	typeof AccredibleCertificatesSchema,
	AccredibleCertificatesPluginOptions
>;

export type AccredibleCertificatesKeyBuilderContext =
	KeyBuilderContext<AccredibleCertificatesPluginOptions>;

export type AccredibleCertificatesBoundEndpoints = BindEndpoints<
	typeof accredibleCertificatesEndpointsNested
>;

type AccredibleCertificatesEndpoint<
	K extends keyof AccredibleCertificatesEndpointOutputs,
> = CorsairEndpoint<
	AccredibleCertificatesContext,
	AccredibleCertificatesEndpointInputs[K],
	AccredibleCertificatesEndpointOutputs[K]
>;

export type AccredibleCertificatesEndpoints = {
	getCredential: AccredibleCertificatesEndpoint<'getCredential'>;
};

type AccredibleCertificatesWebhook<
	K extends keyof AccredibleCertificatesWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	AccredibleCertificatesContext,
	TEvent,
	AccredibleCertificatesWebhookOutputs[K]
>;

export type AccredibleCertificatesWebhooks = {
	example: AccredibleCertificatesWebhook<'example', ExampleEvent>;
};

export type AccredibleCertificatesBoundWebhooks =
	BindWebhooks<AccredibleCertificatesWebhooks>;

const accredibleCertificatesEndpointsNested = {
	credentials: {
		get: GetCredential.get,
	},
} as const;

const accredibleCertificatesWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const accredibleCertificatesEndpointSchemas = {
	'credentials.get': {
		input: AccredibleCertificatesEndpointInputSchemas.getCredential,
		output: AccredibleCertificatesEndpointOutputSchemas.getCredential,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof accredibleCertificatesEndpointsNested
>;

const accredibleCertificatesWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof accredibleCertificatesWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const accredibleCertificatesEndpointMeta = {
	'credentials.get': {
		riskLevel: 'read',
		description: 'Get an credential resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof accredibleCertificatesEndpointsNested
>;

export const accredibleCertificatesAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAccredibleCertificatesPlugin<
	T extends AccredibleCertificatesPluginOptions,
> = CorsairPlugin<
	'accrediblecertificates',
	typeof AccredibleCertificatesSchema,
	typeof accredibleCertificatesEndpointsNested,
	typeof accredibleCertificatesWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAccredibleCertificatesPlugin =
	BaseAccredibleCertificatesPlugin<AccredibleCertificatesPluginOptions>;

export type ExternalAccredibleCertificatesPlugin<
	T extends AccredibleCertificatesPluginOptions,
> = BaseAccredibleCertificatesPlugin<T>;

export function accrediblecertificates<
	const T extends AccredibleCertificatesPluginOptions,
>(
	incomingOptions: AccredibleCertificatesPluginOptions &
		T = {} as AccredibleCertificatesPluginOptions & T,
): ExternalAccredibleCertificatesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'accrediblecertificates',
		authConfig: accredibleCertificatesAuthConfig,
		schema: AccredibleCertificatesSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: accredibleCertificatesEndpointsNested,
		webhooks: accredibleCertificatesWebhooksNested,
		endpointMeta: accredibleCertificatesEndpointMeta,
		endpointSchemas: accredibleCertificatesEndpointSchemas,
		webhookSchemas: accredibleCertificatesWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-accrediblecertificates-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAccredibleCertificatesTenantWebhook,
		oauthWebhookTenantLinkResolver:
			resolveAccredibleCertificatesOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: AccredibleCertificatesKeyBuilderContext,
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
	} satisfies InternalAccredibleCertificatesPlugin;
}

export type {
	AccredibleCertificatesEndpointInputs,
	AccredibleCertificatesEndpointOutputs,
	GetCredentialInput,
	GetCredentialResponse,
} from './endpoints/types';
export type {
	AccredibleCertificatesWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
