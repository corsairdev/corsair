import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	getValidConfluenceAccessToken,
	normalizeConfluenceCloudUrl,
	resolveConfluenceCloudResource,
} from './client';
import { Pages, Spaces } from './endpoints';
import type {
	ConfluenceEndpointInputs,
	ConfluenceEndpointOutputs,
} from './endpoints/types';
import {
	ConfluenceEndpointInputSchemas,
	ConfluenceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ConfluenceSchema } from './schema';

export type ConfluencePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	/** Atlassian account email used with a Confluence Cloud API token. */
	email?: string;
	/** Confluence Cloud URL, e.g. 'https://your-domain.atlassian.net'. */
	cloudUrl?: string;
	hooks?: InternalConfluencePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof confluenceEndpointsNested>;
};

export type ConfluenceContext = CorsairPluginContext<
	typeof ConfluenceSchema,
	ConfluencePluginOptions,
	undefined,
	typeof confluenceAuthConfig
>;

export type ConfluenceKeyBuilderContext = KeyBuilderContext<
	ConfluencePluginOptions,
	typeof confluenceAuthConfig
>;

export type ConfluenceBoundEndpoints = BindEndpoints<
	typeof confluenceEndpointsNested
>;

type ConfluenceEndpoint<K extends keyof ConfluenceEndpointOutputs> =
	CorsairEndpoint<
		ConfluenceContext,
		ConfluenceEndpointInputs[K],
		ConfluenceEndpointOutputs[K]
	>;

export type ConfluenceEndpoints = {
	pagesGet: ConfluenceEndpoint<'pagesGet'>;
	pagesSearch: ConfluenceEndpoint<'pagesSearch'>;
	spacesList: ConfluenceEndpoint<'spacesList'>;
};

const confluenceEndpointsNested = {
	pages: {
		get: Pages.get,
		search: Pages.search,
	},
	spaces: {
		list: Spaces.list,
	},
} as const;

export const confluenceEndpointSchemas = {
	'pages.get': {
		input: ConfluenceEndpointInputSchemas.pagesGet,
		output: ConfluenceEndpointOutputSchemas.pagesGet,
	},
	'pages.search': {
		input: ConfluenceEndpointInputSchemas.pagesSearch,
		output: ConfluenceEndpointOutputSchemas.pagesSearch,
	},
	'spaces.list': {
		input: ConfluenceEndpointInputSchemas.spacesList,
		output: ConfluenceEndpointOutputSchemas.spacesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof confluenceEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const confluenceEndpointMeta = {
	'pages.get': {
		riskLevel: 'read',
		description: 'List Confluence pages',
	},
	'pages.search': {
		riskLevel: 'read',
		description: 'Search Confluence pages via CQL',
	},
	'spaces.list': {
		riskLevel: 'read',
		description: 'List Confluence spaces',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof confluenceEndpointsNested
>;

export const confluenceAuthConfig = {
	api_key: {
		account: ['email', 'cloud_url'] as const,
	},
	oauth_2: {
		account: ['cloud_id', 'cloud_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseConfluencePlugin<T extends ConfluencePluginOptions> =
	CorsairPlugin<
		'confluence',
		typeof ConfluenceSchema,
		typeof confluenceEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof confluenceAuthConfig
	>;

export type InternalConfluencePlugin =
	BaseConfluencePlugin<ConfluencePluginOptions>;

export type ExternalConfluencePlugin<T extends ConfluencePluginOptions> =
	BaseConfluencePlugin<T>;

export function confluence<const T extends ConfluencePluginOptions>(
	incomingOptions: ConfluencePluginOptions & T = {} as ConfluencePluginOptions &
		T,
): ExternalConfluencePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'confluence',
		authConfig: confluenceAuthConfig,
		oauthConfig: {
			providerName: 'Confluence',
			authUrl: 'https://auth.atlassian.com/authorize',
			tokenUrl: 'https://auth.atlassian.com/oauth/token',
			scopes: [
				'read:page:confluence',
				'read:space:confluence',
				'search:confluence',
				'offline_access',
			],
			authParams: { audience: 'api.atlassian.com', prompt: 'consent' },
		},
		schema: ConfluenceSchema,
		options: options,
		hooks: options.hooks,
		endpoints: confluenceEndpointsNested,
		webhooks: {},
		endpointMeta: confluenceEndpointMeta,
		endpointSchemas: confluenceEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ConfluenceKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				if (ctx.authType !== 'api_key' || options.key.includes(':')) {
					return options.key;
				}
				if (!options.email) {
					throw new AuthMissingError('confluence', 'email');
				}
				return `${options.email}:${options.key}`;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiToken = await ctx.keys.get_api_key();
				if (!apiToken) {
					throw new AuthMissingError('confluence', 'api_key');
				}
				if (apiToken.includes(':')) return apiToken;

				const email = await ctx.keys.get_email();
				if (!email) {
					throw new AuthMissingError('confluence', 'email');
				}
				return `${email}:${apiToken}`;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const [
					accessToken,
					expiresAt,
					refreshToken,
					storedCloudId,
					storedCloudUrl,
					credentials,
				] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
					ctx.keys.get_cloud_id(),
					ctx.keys.get_cloud_url(),
					ctx.keys.get_integration_credentials(),
				]);

				if (!refreshToken) {
					throw new AuthMissingError('confluence', 'refresh_token');
				}
				if (!credentials.client_id || !credentials.client_secret) {
					throw new AuthMissingError('confluence', 'client_credentials');
				}

				const result = await getValidConfluenceAccessToken({
					accessToken,
					expiresAt,
					refreshToken,
					clientId: credentials.client_id,
					clientSecret: credentials.client_secret,
				});

				if (result.refreshed) {
					await Promise.all([
						ctx.keys.set_access_token(result.accessToken),
						ctx.keys.set_expires_at(String(result.expiresAt)),
						ctx.keys.set_refresh_token(result.refreshToken),
					]);
				}

				const configuredCloudUrl = options.cloudUrl ?? storedCloudUrl;
				const normalizedConfiguredUrl = configuredCloudUrl
					? normalizeConfluenceCloudUrl(configuredCloudUrl)
					: undefined;
				const normalizedStoredUrl = storedCloudUrl
					? normalizeConfluenceCloudUrl(storedCloudUrl)
					: undefined;
				if (
					!storedCloudId ||
					!storedCloudUrl ||
					(normalizedConfiguredUrl &&
						normalizedConfiguredUrl !== normalizedStoredUrl)
				) {
					const resource = await resolveConfluenceCloudResource(
						result.accessToken,
						configuredCloudUrl,
					);
					await Promise.all([
						ctx.keys.set_cloud_id(resource.id),
						ctx.keys.set_cloud_url(resource.url),
					]);
				}

				return result.accessToken;
			}

			throw new AuthMissingError('confluence', 'api_key');
		},
	} satisfies InternalConfluencePlugin;
}

export type {
	ConfluenceEndpointInputs,
	ConfluenceEndpointOutputs,
	PagesGetInput,
	PagesGetResponse,
	PagesSearchInput,
	PagesSearchResponse,
	SpacesListInput,
	SpacesListResponse,
} from './endpoints/types';
