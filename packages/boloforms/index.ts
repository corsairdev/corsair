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
import type { BoloformsEndpointInputs, BoloformsEndpointOutputs } from './endpoints/types';
import { BoloformsEndpointInputSchemas, BoloformsEndpointOutputSchemas } from './endpoints/types';
import type {
	BoloformsWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Documents } from './endpoints';
import { BoloformsSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchBoloformsTenantWebhook } from './webhooks/tenant-matcher';
import { resolveBoloformsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type BoloformsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBoloformsPlugin['hooks'];
	webhookHooks?: InternalBoloformsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boloformsEndpointsNested>;
};

export type BoloformsContext = CorsairPluginContext<
    typeof BoloformsSchema,
	BoloformsPluginOptions
>;

export type BoloformsKeyBuilderContext = KeyBuilderContext<BoloformsPluginOptions>;

export type BoloformsBoundEndpoints = BindEndpoints<typeof boloformsEndpointsNested>;

type BoloformsEndpoint<
    K extends keyof BoloformsEndpointOutputs,
> = CorsairEndpoint<
    BoloformsContext,
	BoloformsEndpointInputs[K],
	BoloformsEndpointOutputs[K]
>;

export type BoloformsEndpoints = {
	getDocumentsList: BoloformsEndpoint<'getDocumentsList'>;
};

type BoloformsWebhook<
    K extends keyof BoloformsWebhookOutputs,
	TEvent,
> = CorsairWebhook<BoloformsContext, TEvent, BoloformsWebhookOutputs[K]>;
export type BoloformsWebhooks = {
	example: BoloformsWebhook<'example', ExampleEvent>;
};

export type BoloformsBoundWebhooks = BindWebhooks<BoloformsWebhooks>;

const boloformsEndpointsNested = {
	documents: {
		list: Documents.list,
	},
} as const;

const boloformsWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const boloformsEndpointSchemas = {
	'documents.list': {
		input: BoloformsEndpointInputSchemas.getDocumentsList,
		output: BoloformsEndpointOutputSchemas.getDocumentsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof boloformsEndpointsNested>;

const boloformsWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof boloformsWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const boloformsEndpointMeta = {
	'documents.list': {
		riskLevel: 'read',
		description: 'Retrieve a list of documents from a Boloforms workspace, with optional filtering and pagination',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof boloformsEndpointsNested>;

export const boloformsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBoloformsPlugin<T extends BoloformsPluginOptions> = CorsairPlugin<
    'boloforms',
	typeof BoloformsSchema,
	typeof boloformsEndpointsNested,
	typeof boloformsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBoloformsPlugin = BaseBoloformsPlugin<BoloformsPluginOptions>;

export type ExternalBoloformsPlugin<T extends BoloformsPluginOptions> =
	BaseBoloformsPlugin<T>;

export function boloforms<const T extends BoloformsPluginOptions>(
	incomingOptions: BoloformsPluginOptions & T = {} as BoloformsPluginOptions & T,
): ExternalBoloformsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'boloforms',
		authConfig: boloformsAuthConfig,
		schema: BoloformsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: boloformsEndpointsNested,
		webhooks: boloformsWebhooksNested,
		endpointMeta: boloformsEndpointMeta,
		endpointSchemas: boloformsEndpointSchemas,
		webhookSchemas: boloformsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-boloforms-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBoloformsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBoloformsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoloformsKeyBuilderContext, source) => {
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
	} satisfies InternalBoloformsPlugin;
}

export type {
	ExampleEvent,
	BoloformsWebhookOutputs,
} from './webhooks/types';

export type {
	BoloformsEndpointInputs,
	BoloformsEndpointOutputs,
	GetDocumentsListInput,
	GetDocumentsListResponse,
} from './endpoints/types';

