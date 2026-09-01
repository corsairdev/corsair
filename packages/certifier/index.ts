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
import type { CertifierEndpointInputs, CertifierEndpointOutputs } from './endpoints/types';
import { CertifierEndpointInputSchemas, CertifierEndpointOutputSchemas } from './endpoints/types';
import type {
	CertifierWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { CertifierSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchCertifierTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCertifierOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type CertifierPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCertifierPlugin['hooks'];
	webhookHooks?: InternalCertifierPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof certifierEndpointsNested>;
};

export type CertifierContext = CorsairPluginContext<
	typeof CertifierSchema,
	CertifierPluginOptions
>;

export type CertifierKeyBuilderContext = KeyBuilderContext<CertifierPluginOptions>;

export type CertifierBoundEndpoints = BindEndpoints<typeof certifierEndpointsNested>;

type CertifierEndpoint<
	K extends keyof CertifierEndpointOutputs,
> = CorsairEndpoint<
	CertifierContext,
	CertifierEndpointInputs[K],
	CertifierEndpointOutputs[K]
>;

export type CertifierEndpoints = {
	exampleGet: CertifierEndpoint<'exampleGet'>;
};

type CertifierWebhook<
	K extends keyof CertifierWebhookOutputs,
	TEvent,
> = CorsairWebhook<CertifierContext, TEvent, CertifierWebhookOutputs[K]>;

export type CertifierWebhooks = {
	example: CertifierWebhook<'example', ExampleEvent>;
};

export type CertifierBoundWebhooks = BindWebhooks<CertifierWebhooks>;

const certifierEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const certifierWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const certifierEndpointSchemas = {
	'example.get': {
		input: CertifierEndpointInputSchemas.exampleGet,
		output: CertifierEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof certifierEndpointsNested>;

const certifierWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof certifierWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const certifierEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof certifierEndpointsNested>;

export const certifierAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCertifierPlugin<T extends CertifierPluginOptions> = CorsairPlugin<
	'certifier',
	typeof CertifierSchema,
	typeof certifierEndpointsNested,
	typeof certifierWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCertifierPlugin = BaseCertifierPlugin<CertifierPluginOptions>;

export type ExternalCertifierPlugin<T extends CertifierPluginOptions> =
	BaseCertifierPlugin<T>;

export function certifier<const T extends CertifierPluginOptions>(
	incomingOptions: CertifierPluginOptions & T = {} as CertifierPluginOptions & T,
): ExternalCertifierPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'certifier',
		authConfig: certifierAuthConfig,
		schema: CertifierSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: certifierEndpointsNested,
		webhooks: certifierWebhooksNested,
		endpointMeta: certifierEndpointMeta,
		endpointSchemas: certifierEndpointSchemas,
		webhookSchemas: certifierWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-certifier-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCertifierTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCertifierOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CertifierKeyBuilderContext, source) => {
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
	} satisfies InternalCertifierPlugin;
}

export type {
	ExampleEvent,
	CertifierWebhookOutputs,
} from './webhooks/types';

export type {
	CertifierEndpointInputs,
	CertifierEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
