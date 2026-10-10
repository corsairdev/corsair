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
	IncidentioEndpointInputs,
	IncidentioEndpointOutputs,
} from './endpoints/types';
import {
	IncidentioEndpointInputSchemas,
	IncidentioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { IncidentioSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveIncidentioOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchIncidentioTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, IncidentioWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type IncidentioPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalIncidentioPlugin['hooks'];
	webhookHooks?: InternalIncidentioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof incidentioEndpointsNested>;
};

export type IncidentioContext = CorsairPluginContext<
	typeof IncidentioSchema,
	IncidentioPluginOptions
>;

export type IncidentioKeyBuilderContext =
	KeyBuilderContext<IncidentioPluginOptions>;

export type IncidentioBoundEndpoints = BindEndpoints<
	typeof incidentioEndpointsNested
>;

type IncidentioEndpoint<K extends keyof IncidentioEndpointOutputs> =
	CorsairEndpoint<
		IncidentioContext,
		IncidentioEndpointInputs[K],
		IncidentioEndpointOutputs[K]
	>;

export type IncidentioEndpoints = {
	exampleGet: IncidentioEndpoint<'exampleGet'>;
};

type IncidentioWebhook<
	K extends keyof IncidentioWebhookOutputs,
	TEvent,
> = CorsairWebhook<IncidentioContext, TEvent, IncidentioWebhookOutputs[K]>;

export type IncidentioWebhooks = {
	example: IncidentioWebhook<'example', ExampleEvent>;
};

export type IncidentioBoundWebhooks = BindWebhooks<IncidentioWebhooks>;

const incidentioEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const incidentioWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const incidentioEndpointSchemas = {
	'example.get': {
		input: IncidentioEndpointInputSchemas.exampleGet,
		output: IncidentioEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof incidentioEndpointsNested
>;

const incidentioWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof incidentioWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const incidentioEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof incidentioEndpointsNested
>;

export const incidentioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseIncidentioPlugin<T extends IncidentioPluginOptions> =
	CorsairPlugin<
		'incidentio',
		typeof IncidentioSchema,
		typeof incidentioEndpointsNested,
		typeof incidentioWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalIncidentioPlugin =
	BaseIncidentioPlugin<IncidentioPluginOptions>;

export type ExternalIncidentioPlugin<T extends IncidentioPluginOptions> =
	BaseIncidentioPlugin<T>;

export function incidentio<const T extends IncidentioPluginOptions>(
	incomingOptions: IncidentioPluginOptions & T = {} as IncidentioPluginOptions &
		T,
): ExternalIncidentioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'incidentio',
		authConfig: incidentioAuthConfig,
		schema: IncidentioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: incidentioEndpointsNested,
		webhooks: incidentioWebhooksNested,
		endpointMeta: incidentioEndpointMeta,
		endpointSchemas: incidentioEndpointSchemas,
		webhookSchemas: incidentioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-incidentio-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchIncidentioTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveIncidentioOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: IncidentioKeyBuilderContext, source) => {
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
	} satisfies InternalIncidentioPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	IncidentioEndpointInputs,
	IncidentioEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	IncidentioWebhookOutputs,
} from './webhooks/types';
