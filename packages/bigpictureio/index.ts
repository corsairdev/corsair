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
import { Company } from './endpoints';
import type {
	BigpictureioEndpointInputs,
	BigpictureioEndpointOutputs,
} from './endpoints/types';
import {
	BigpictureioEndpointInputSchemas,
	BigpictureioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BigpictureioSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBigpictureioOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBigpictureioTenantWebhook } from './webhooks/tenant-matcher';
import type {
	BigpictureioWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BigpictureioPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBigpictureioPlugin['hooks'];
	webhookHooks?: InternalBigpictureioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bigpictureioEndpointsNested>;
};

export type BigpictureioContext = CorsairPluginContext<
	typeof BigpictureioSchema,
	BigpictureioPluginOptions
>;

export type BigpictureioKeyBuilderContext =
	KeyBuilderContext<BigpictureioPluginOptions>;

export type BigpictureioBoundEndpoints = BindEndpoints<
	typeof bigpictureioEndpointsNested
>;

type BigpictureioEndpoint<K extends keyof BigpictureioEndpointOutputs> =
	CorsairEndpoint<
		BigpictureioContext,
		BigpictureioEndpointInputs[K],
		BigpictureioEndpointOutputs[K]
	>;

export type BigpictureioEndpoints = {
	companyFind: BigpictureioEndpoint<'companyFind'>;
};

type BigpictureioWebhook<
	K extends keyof BigpictureioWebhookOutputs,
	TEvent,
> = CorsairWebhook<BigpictureioContext, TEvent, BigpictureioWebhookOutputs[K]>;

export type BigpictureioWebhooks = {
	example: BigpictureioWebhook<'example', ExampleEvent>;
};

export type BigpictureioBoundWebhooks = BindWebhooks<BigpictureioWebhooks>;

const bigpictureioEndpointsNested = {
	company: {
		find: Company.find,
	},
} as const;

const bigpictureioWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const bigpictureioEndpointSchemas = {
	'company.find': {
		input: BigpictureioEndpointInputSchemas.companyFind,
		output: BigpictureioEndpointOutputSchemas.companyFind,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bigpictureioEndpointsNested
>;

const bigpictureioWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof bigpictureioWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bigpictureioEndpointMeta = {
	'company.find': {
		riskLevel: 'read',
		description: 'Find detailed company information by domain',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof bigpictureioEndpointsNested
>;

export const bigpictureioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBigpictureioPlugin<T extends BigpictureioPluginOptions> =
	CorsairPlugin<
		'bigpictureio',
		typeof BigpictureioSchema,
		typeof bigpictureioEndpointsNested,
		typeof bigpictureioWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBigpictureioPlugin =
	BaseBigpictureioPlugin<BigpictureioPluginOptions>;

export type ExternalBigpictureioPlugin<T extends BigpictureioPluginOptions> =
	BaseBigpictureioPlugin<T>;

export function bigpictureio<const T extends BigpictureioPluginOptions>(
	incomingOptions: BigpictureioPluginOptions &
		T = {} as BigpictureioPluginOptions & T,
): ExternalBigpictureioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bigpictureio',
		authConfig: bigpictureioAuthConfig,
		schema: BigpictureioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bigpictureioEndpointsNested,
		webhooks: bigpictureioWebhooksNested,
		endpointMeta: bigpictureioEndpointMeta,
		endpointSchemas: bigpictureioEndpointSchemas,
		webhookSchemas: bigpictureioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-bigpictureio-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBigpictureioTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBigpictureioOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BigpictureioKeyBuilderContext, source) => {
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
	} satisfies InternalBigpictureioPlugin;
}

export type {
	BigpictureioEndpointInputs,
	BigpictureioEndpointOutputs,
	CompanyFindInput,
	CompanyFindResponse,
} from './endpoints/types';
export type {
	BigpictureioWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
