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
import type { ListenNotesEndpointInputs, ListenNotesEndpointOutputs } from './endpoints/types';
import { ListenNotesEndpointInputSchemas, ListenNotesEndpointOutputSchemas } from './endpoints/types';
import type {
	ListenNotesWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ListenNotesSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchListenNotesTenantWebhook } from './webhooks/tenant-matcher';
import { resolveListenNotesOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ListenNotesPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalListenNotesPlugin['hooks'];
	webhookHooks?: InternalListenNotesPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof listenNotesEndpointsNested>;
};

export type ListenNotesContext = CorsairPluginContext<
	typeof ListenNotesSchema,
	ListenNotesPluginOptions
>;

export type ListenNotesKeyBuilderContext = KeyBuilderContext<ListenNotesPluginOptions>;

export type ListenNotesBoundEndpoints = BindEndpoints<typeof listenNotesEndpointsNested>;

type ListenNotesEndpoint<
	K extends keyof ListenNotesEndpointOutputs,
> = CorsairEndpoint<
	ListenNotesContext,
	ListenNotesEndpointInputs[K],
	ListenNotesEndpointOutputs[K]
>;

export type ListenNotesEndpoints = {
	exampleGet: ListenNotesEndpoint<'exampleGet'>;
};

type ListenNotesWebhook<
	K extends keyof ListenNotesWebhookOutputs,
	TEvent,
> = CorsairWebhook<ListenNotesContext, TEvent, ListenNotesWebhookOutputs[K]>;

export type ListenNotesWebhooks = {
	example: ListenNotesWebhook<'example', ExampleEvent>;
};

export type ListenNotesBoundWebhooks = BindWebhooks<ListenNotesWebhooks>;

const listenNotesEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const listenNotesWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const listenNotesEndpointSchemas = {
	'example.get': {
		input: ListenNotesEndpointInputSchemas.exampleGet,
		output: ListenNotesEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof listenNotesEndpointsNested>;

const listenNotesWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof listenNotesWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const listenNotesEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof listenNotesEndpointsNested>;

export const listenNotesAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseListenNotesPlugin<T extends ListenNotesPluginOptions> = CorsairPlugin<
	'listennotes',
	typeof ListenNotesSchema,
	typeof listenNotesEndpointsNested,
	typeof listenNotesWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalListenNotesPlugin = BaseListenNotesPlugin<ListenNotesPluginOptions>;

export type ExternalListenNotesPlugin<T extends ListenNotesPluginOptions> =
	BaseListenNotesPlugin<T>;

export function listennotes<const T extends ListenNotesPluginOptions>(
	incomingOptions: ListenNotesPluginOptions & T = {} as ListenNotesPluginOptions & T,
): ExternalListenNotesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'listennotes',
		authConfig: listenNotesAuthConfig,
		schema: ListenNotesSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: listenNotesEndpointsNested,
		webhooks: listenNotesWebhooksNested,
		endpointMeta: listenNotesEndpointMeta,
		endpointSchemas: listenNotesEndpointSchemas,
		webhookSchemas: listenNotesWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-listennotes-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchListenNotesTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveListenNotesOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ListenNotesKeyBuilderContext, source) => {
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
	} satisfies InternalListenNotesPlugin;
}

export type {
	ExampleEvent,
	ListenNotesWebhookOutputs,
} from './webhooks/types';

export type {
	ListenNotesEndpointInputs,
	ListenNotesEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
