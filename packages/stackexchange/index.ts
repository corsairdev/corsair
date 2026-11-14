import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { networkRead, siteRead, siteWrite } from './endpoints';
import type {
	StackExchangeEndpointInputs,
	StackExchangeEndpointOutputs,
} from './endpoints/types';
import {
	StackExchangeEndpointInputSchemas,
	StackExchangeEndpointOutputSchemas,
	StackExchangeResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StackExchangeSchema } from './schema';

export type StackExchangePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalStackExchangePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof stackExchangeEndpointsNested>;
};

export type StackExchangeContext = CorsairPluginContext<
	typeof StackExchangeSchema,
	StackExchangePluginOptions
>;

export type StackExchangeBoundEndpoints = BindEndpoints<
	typeof stackExchangeEndpointsNested
>;

type StackExchangeEndpoint<K extends keyof StackExchangeEndpointOutputs> =
	CorsairEndpoint<
		StackExchangeContext,
		StackExchangeEndpointInputs[K],
		StackExchangeEndpointOutputs[K]
	>;

export type StackExchangeEndpoints = {
	siteRead: StackExchangeEndpoint<'siteRead'>;
	siteWrite: StackExchangeEndpoint<'siteWrite'>;
	networkRead: StackExchangeEndpoint<'networkRead'>;
};

const stackExchangeEndpointsNested = {
	site: {
		read: siteRead,
		write: siteWrite,
	},
	network: { read: networkRead },
} as const;

const stackExchangeWebhooksNested = {} as const;

export const stackExchangeEndpointSchemas = {
	'site.read': {
		input: StackExchangeEndpointInputSchemas.siteRead,
		output: StackExchangeEndpointOutputSchemas.siteRead,
	},
	'site.write': {
		input: StackExchangeEndpointInputSchemas.siteWrite,
		output: StackExchangeEndpointOutputSchemas.siteWrite,
	},
	'network.read': {
		input: StackExchangeEndpointInputSchemas.networkRead,
		output: StackExchangeEndpointOutputSchemas.networkRead,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof stackExchangeEndpointsNested
>;

const stackExchangeWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof stackExchangeWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key';

const stackExchangeEndpointMeta = {
	'site.read': {
		riskLevel: 'read',
		description:
			'Read Stack Exchange per-site API v2.3 resources using a documented route.',
	},
	'site.write': {
		riskLevel: 'destructive',
		description:
			'Invoke a documented per-site POST method; includes edits, votes, flags and deletes.',
	},
	'network.read': {
		riskLevel: 'read',
		description:
			'Read Stack Exchange network API v2.3 resources using a documented route.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof stackExchangeEndpointsNested
>;

export const stackExchangeAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type BaseStackExchangePlugin<T extends StackExchangePluginOptions> =
	CorsairPlugin<
		'stackexchange',
		typeof StackExchangeSchema,
		typeof stackExchangeEndpointsNested,
		typeof stackExchangeWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalStackExchangePlugin =
	BaseStackExchangePlugin<StackExchangePluginOptions>;
export type ExternalStackExchangePlugin<T extends StackExchangePluginOptions> =
	BaseStackExchangePlugin<T>;

export function stackexchange<const T extends StackExchangePluginOptions>(
	incomingOptions: StackExchangePluginOptions &
		T = {} as StackExchangePluginOptions & T,
): ExternalStackExchangePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'stackexchange',
		authConfig: stackExchangeAuthConfig,
		oauthConfig: {
			providerName: 'Stack Exchange',
			authUrl: 'https://stackoverflow.com/oauth',
			tokenUrl: 'https://stackoverflow.com/oauth/access_token/json',
			scopes: ['read_inbox', 'write_access', 'private_info'],
			requiresRegisteredRedirect: true,
		},
		schema: StackExchangeSchema,
		options,
		hooks: options.hooks,
		endpoints: stackExchangeEndpointsNested,
		webhooks: stackExchangeWebhooksNested,
		endpointMeta: stackExchangeEndpointMeta,
		endpointSchemas: stackExchangeEndpointSchemas,
		webhookSchemas: stackExchangeWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx, source) => {
			if (source !== 'endpoint') return '';
			if (ctx.options.key) return ctx.options.key;
			if (!ctx.keys) return '';
			if (ctx.authType === 'oauth_2') {
				return (await ctx.keys.get_access_token()) ?? '';
			}
			return (await ctx.keys.get_api_key()) ?? '';
		},
	} satisfies InternalStackExchangePlugin;
}

export { StackExchangeResponseSchema };
export {
	NETWORK_READ_ROUTES,
	SITE_READ_ROUTES,
	SITE_WRITE_ROUTES,
} from './endpoints/routes';
export type {
	NetworkReadInput,
	SiteReadInput,
	SiteWriteInput,
	StackExchangeEndpointInputs,
	StackExchangeEndpointOutputs,
	StackExchangeResponse,
} from './endpoints/types';
