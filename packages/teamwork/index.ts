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
import type { TeamworkEndpointInputs, TeamworkEndpointOutputs } from './endpoints/types';
import { TeamworkEndpointInputSchemas, TeamworkEndpointOutputSchemas } from './endpoints/types';
import type {
	TeamworkWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { TeamworkSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchTeamworkTenantWebhook } from './webhooks/tenant-matcher';
import { resolveTeamworkOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type TeamworkPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTeamworkPlugin['hooks'];
	webhookHooks?: InternalTeamworkPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof teamworkEndpointsNested>;
};

export type TeamworkContext = CorsairPluginContext<
	typeof TeamworkSchema,
	TeamworkPluginOptions
>;

export type TeamworkKeyBuilderContext = KeyBuilderContext<TeamworkPluginOptions>;

export type TeamworkBoundEndpoints = BindEndpoints<typeof teamworkEndpointsNested>;

type TeamworkEndpoint<
	K extends keyof TeamworkEndpointOutputs,
> = CorsairEndpoint<
	TeamworkContext,
	TeamworkEndpointInputs[K],
	TeamworkEndpointOutputs[K]
>;

export type TeamworkEndpoints = {
	exampleGet: TeamworkEndpoint<'exampleGet'>;
};

type TeamworkWebhook<
	K extends keyof TeamworkWebhookOutputs,
	TEvent,
> = CorsairWebhook<TeamworkContext, TEvent, TeamworkWebhookOutputs[K]>;

export type TeamworkWebhooks = {
	example: TeamworkWebhook<'example', ExampleEvent>;
};

export type TeamworkBoundWebhooks = BindWebhooks<TeamworkWebhooks>;

const teamworkEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const teamworkWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const teamworkEndpointSchemas = {
	'example.get': {
		input: TeamworkEndpointInputSchemas.exampleGet,
		output: TeamworkEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof teamworkEndpointsNested>;

const teamworkWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof teamworkWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const teamworkEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof teamworkEndpointsNested>;

export const teamworkAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTeamworkPlugin<T extends TeamworkPluginOptions> = CorsairPlugin<
	'teamwork',
	typeof TeamworkSchema,
	typeof teamworkEndpointsNested,
	typeof teamworkWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTeamworkPlugin = BaseTeamworkPlugin<TeamworkPluginOptions>;

export type ExternalTeamworkPlugin<T extends TeamworkPluginOptions> =
	BaseTeamworkPlugin<T>;

export function teamwork<const T extends TeamworkPluginOptions>(
	incomingOptions: TeamworkPluginOptions & T = {} as TeamworkPluginOptions & T,
): ExternalTeamworkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'teamwork',
		authConfig: teamworkAuthConfig,
		schema: TeamworkSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: teamworkEndpointsNested,
		webhooks: teamworkWebhooksNested,
		endpointMeta: teamworkEndpointMeta,
		endpointSchemas: teamworkEndpointSchemas,
		webhookSchemas: teamworkWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-teamwork-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTeamworkTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTeamworkOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TeamworkKeyBuilderContext, source) => {
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
	} satisfies InternalTeamworkPlugin;
}

export type {
	ExampleEvent,
	TeamworkWebhookOutputs,
} from './webhooks/types';

export type {
	TeamworkEndpointInputs,
	TeamworkEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
