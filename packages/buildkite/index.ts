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
import { BuildkiteEndpointsImpl as Endpoints } from './endpoints';
import type {
	BuildkiteEndpointInputs,
	BuildkiteEndpointOutputs,
} from './endpoints/types';
import {
	BuildkiteEndpointInputSchemas,
	BuildkiteEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BuildkiteSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBuildkiteOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBuildkiteTenantWebhook } from './webhooks/tenant-matcher';
import type { BuildkiteWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BuildkitePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBuildkitePlugin['hooks'];
	webhookHooks?: InternalBuildkitePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof buildkiteEndpointsNested>;
};

export type BuildkiteContext = CorsairPluginContext<
	typeof BuildkiteSchema,
	BuildkitePluginOptions
>;

export type BuildkiteKeyBuilderContext =
	KeyBuilderContext<BuildkitePluginOptions>;

export type BuildkiteBoundEndpoints = BindEndpoints<
	typeof buildkiteEndpointsNested
>;

type BuildkiteEndpoint<K extends keyof BuildkiteEndpointOutputs> =
	CorsairEndpoint<
		BuildkiteContext,
		BuildkiteEndpointInputs[K],
		BuildkiteEndpointOutputs[K]
	>;

export type BuildkiteEndpoints = {
	getCurrentAccessToken: BuildkiteEndpoint<'getCurrentAccessToken'>;
	getMeta: BuildkiteEndpoint<'getMeta'>;
	getUser: BuildkiteEndpoint<'getUser'>;
	listOrganizations: BuildkiteEndpoint<'listOrganizations'>;
	listPipelineAgents: BuildkiteEndpoint<'listPipelineAgents'>;
};

type BuildkiteWebhook<
	K extends keyof BuildkiteWebhookOutputs,
	TEvent,
> = CorsairWebhook<BuildkiteContext, TEvent, BuildkiteWebhookOutputs[K]>;

export type BuildkiteWebhooks = {
	example: BuildkiteWebhook<'example', ExampleEvent>;
};

export type BuildkiteBoundWebhooks = BindWebhooks<BuildkiteWebhooks>;

const buildkiteEndpointsNested = {
	getCurrentAccessToken: Endpoints.getCurrentAccessToken,
	getMeta: Endpoints.getMeta,
	getUser: Endpoints.getUser,
	listOrganizations: Endpoints.listOrganizations,
	listPipelineAgents: Endpoints.listPipelineAgents,
} as const;

const buildkiteWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const buildkiteEndpointSchemas = {
	getCurrentAccessToken: {
		input: BuildkiteEndpointInputSchemas.getCurrentAccessToken,
		output: BuildkiteEndpointOutputSchemas.getCurrentAccessToken,
	},
	getMeta: {
		input: BuildkiteEndpointInputSchemas.getMeta,
		output: BuildkiteEndpointOutputSchemas.getMeta,
	},
	getUser: {
		input: BuildkiteEndpointInputSchemas.getUser,
		output: BuildkiteEndpointOutputSchemas.getUser,
	},
	listOrganizations: {
		input: BuildkiteEndpointInputSchemas.listOrganizations,
		output: BuildkiteEndpointOutputSchemas.listOrganizations,
	},
	listPipelineAgents: {
		input: BuildkiteEndpointInputSchemas.listPipelineAgents,
		output: BuildkiteEndpointOutputSchemas.listPipelineAgents,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof buildkiteEndpointsNested
>;

const buildkiteWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof buildkiteWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const buildkiteEndpointMeta = {
	getCurrentAccessToken: {
		riskLevel: 'read',
		description:
			'Retrieve details about the API access token used to authenticate the request.',
	},
	getMeta: {
		riskLevel: 'read',
		description:
			'Retrieve Buildkite metadata, including current webhook IP information.',
	},
	getUser: {
		riskLevel: 'read',
		description:
			'Retrieve details about the currently authenticated Buildkite user.',
	},
	listOrganizations: {
		riskLevel: 'read',
		description:
			'List organizations accessible to the authenticated Buildkite user/token.',
	},
	listPipelineAgents: {
		riskLevel: 'read',
		description:
			'List connected and stopping agents for a Buildkite organization.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof buildkiteEndpointsNested
>;

export const buildkiteAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBuildkitePlugin<T extends BuildkitePluginOptions> =
	CorsairPlugin<
		'buildkite',
		typeof BuildkiteSchema,
		typeof buildkiteEndpointsNested,
		typeof buildkiteWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBuildkitePlugin =
	BaseBuildkitePlugin<BuildkitePluginOptions>;

export type ExternalBuildkitePlugin<T extends BuildkitePluginOptions> =
	BaseBuildkitePlugin<T>;

export function buildkite<const T extends BuildkitePluginOptions>(
	incomingOptions: BuildkitePluginOptions & T = {} as BuildkitePluginOptions &
		T,
): ExternalBuildkitePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'buildkite',
		authConfig: buildkiteAuthConfig,
		schema: BuildkiteSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: buildkiteEndpointsNested,
		webhooks: buildkiteWebhooksNested,
		endpointMeta: buildkiteEndpointMeta,
		endpointSchemas: buildkiteEndpointSchemas,
		webhookSchemas: buildkiteWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-buildkite-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBuildkiteTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBuildkiteOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BuildkiteKeyBuilderContext, source) => {
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
	} satisfies InternalBuildkitePlugin;
}

export type {
	BuildkiteEndpointInputs,
	BuildkiteEndpointOutputs,
} from './endpoints/types';
export type {
	BuildkiteWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
