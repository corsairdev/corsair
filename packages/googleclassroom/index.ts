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
import type { GoogleClassroomEndpointInputs, GoogleClassroomEndpointOutputs } from './endpoints/types';
import { GoogleClassroomEndpointInputSchemas, GoogleClassroomEndpointOutputSchemas } from './endpoints/types';
import type {
	GoogleClassroomWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GoogleClassroomSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGoogleClassroomTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGoogleClassroomOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GoogleClassroomPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGoogleClassroomPlugin['hooks'];
	webhookHooks?: InternalGoogleClassroomPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleClassroomEndpointsNested>;
};

export type GoogleClassroomContext = CorsairPluginContext<
	typeof GoogleClassroomSchema,
	GoogleClassroomPluginOptions
>;

export type GoogleClassroomKeyBuilderContext = KeyBuilderContext<GoogleClassroomPluginOptions>;

export type GoogleClassroomBoundEndpoints = BindEndpoints<typeof googleClassroomEndpointsNested>;

type GoogleClassroomEndpoint<
	K extends keyof GoogleClassroomEndpointOutputs,
> = CorsairEndpoint<
	GoogleClassroomContext,
	GoogleClassroomEndpointInputs[K],
	GoogleClassroomEndpointOutputs[K]
>;

export type GoogleClassroomEndpoints = {
	exampleGet: GoogleClassroomEndpoint<'exampleGet'>;
};

type GoogleClassroomWebhook<
	K extends keyof GoogleClassroomWebhookOutputs,
	TEvent,
> = CorsairWebhook<GoogleClassroomContext, TEvent, GoogleClassroomWebhookOutputs[K]>;

export type GoogleClassroomWebhooks = {
	example: GoogleClassroomWebhook<'example', ExampleEvent>;
};

export type GoogleClassroomBoundWebhooks = BindWebhooks<GoogleClassroomWebhooks>;

const googleClassroomEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const googleClassroomWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const googleClassroomEndpointSchemas = {
	'example.get': {
		input: GoogleClassroomEndpointInputSchemas.exampleGet,
		output: GoogleClassroomEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof googleClassroomEndpointsNested>;

const googleClassroomWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof googleClassroomWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const googleClassroomEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof googleClassroomEndpointsNested>;

export const googleClassroomAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleClassroomPlugin<T extends GoogleClassroomPluginOptions> = CorsairPlugin<
	'googleclassroom',
	typeof GoogleClassroomSchema,
	typeof googleClassroomEndpointsNested,
	typeof googleClassroomWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGoogleClassroomPlugin = BaseGoogleClassroomPlugin<GoogleClassroomPluginOptions>;

export type ExternalGoogleClassroomPlugin<T extends GoogleClassroomPluginOptions> =
	BaseGoogleClassroomPlugin<T>;

export function googleclassroom<const T extends GoogleClassroomPluginOptions>(
	incomingOptions: GoogleClassroomPluginOptions & T = {} as GoogleClassroomPluginOptions & T,
): ExternalGoogleClassroomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googleclassroom',
		authConfig: googleClassroomAuthConfig,
		schema: GoogleClassroomSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleClassroomEndpointsNested,
		webhooks: googleClassroomWebhooksNested,
		endpointMeta: googleClassroomEndpointMeta,
		endpointSchemas: googleClassroomEndpointSchemas,
		webhookSchemas: googleClassroomWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-googleclassroom-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGoogleClassroomTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGoogleClassroomOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleClassroomKeyBuilderContext, source) => {
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
	} satisfies InternalGoogleClassroomPlugin;
}

export type {
	ExampleEvent,
	GoogleClassroomWebhookOutputs,
} from './webhooks/types';

export type {
	GoogleClassroomEndpointInputs,
	GoogleClassroomEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
