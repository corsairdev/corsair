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
import type { PipedriveEndpointInputs, PipedriveEndpointOutputs } from './endpoints/types';
import { PipedriveEndpointInputSchemas, PipedriveEndpointOutputSchemas } from './endpoints/types';
import type {
	PipedriveWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { PipedriveSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchPipedriveTenantWebhook } from './webhooks/tenant-matcher';
import { resolvePipedriveOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type PipedrivePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPipedrivePlugin['hooks'];
	webhookHooks?: InternalPipedrivePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pipedriveEndpointsNested>;
};

export type PipedriveContext = CorsairPluginContext<
	typeof PipedriveSchema,
	PipedrivePluginOptions
>;

export type PipedriveKeyBuilderContext = KeyBuilderContext<PipedrivePluginOptions>;

export type PipedriveBoundEndpoints = BindEndpoints<typeof pipedriveEndpointsNested>;

type PipedriveEndpoint<
	K extends keyof PipedriveEndpointOutputs,
> = CorsairEndpoint<
	PipedriveContext,
	PipedriveEndpointInputs[K],
	PipedriveEndpointOutputs[K]
>;

export type PipedriveEndpoints = {
	exampleGet: PipedriveEndpoint<'exampleGet'>;
};

type PipedriveWebhook<
	K extends keyof PipedriveWebhookOutputs,
	TEvent,
> = CorsairWebhook<PipedriveContext, TEvent, PipedriveWebhookOutputs[K]>;

export type PipedriveWebhooks = {
	example: PipedriveWebhook<'example', ExampleEvent>;
};

export type PipedriveBoundWebhooks = BindWebhooks<PipedriveWebhooks>;

const pipedriveEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const pipedriveWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const pipedriveEndpointSchemas = {
	'example.get': {
		input: PipedriveEndpointInputSchemas.exampleGet,
		output: PipedriveEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof pipedriveEndpointsNested>;

const pipedriveWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof pipedriveWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const pipedriveEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pipedriveEndpointsNested>;

export const pipedriveAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePipedrivePlugin<T extends PipedrivePluginOptions> = CorsairPlugin<
	'pipedrive',
	typeof PipedriveSchema,
	typeof pipedriveEndpointsNested,
	typeof pipedriveWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalPipedrivePlugin = BasePipedrivePlugin<PipedrivePluginOptions>;

export type ExternalPipedrivePlugin<T extends PipedrivePluginOptions> =
	BasePipedrivePlugin<T>;

export function pipedrive<const T extends PipedrivePluginOptions>(
	incomingOptions: PipedrivePluginOptions & T = {} as PipedrivePluginOptions & T,
): ExternalPipedrivePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pipedrive',
		authConfig: pipedriveAuthConfig,
		schema: PipedriveSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: pipedriveEndpointsNested,
		webhooks: pipedriveWebhooksNested,
		endpointMeta: pipedriveEndpointMeta,
		endpointSchemas: pipedriveEndpointSchemas,
		webhookSchemas: pipedriveWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-pipedrive-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchPipedriveTenantWebhook,
		oauthWebhookTenantLinkResolver: resolvePipedriveOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PipedriveKeyBuilderContext, source) => {
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
	} satisfies InternalPipedrivePlugin;
}

export type {
	ExampleEvent,
	PipedriveWebhookOutputs,
} from './webhooks/types';

export type {
	PipedriveEndpointInputs,
	PipedriveEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
