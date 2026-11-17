import type {
	BindEndpoints,
	BindWebhooks,
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
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { attachManagedRefreshAuth, getManagedAccessToken } from 'corsair/hub';
import * as aliasesEndpoints from './endpoints/aliases';
import { vercelAliasesMeta } from './endpoints/aliases-meta';
import type { EndpointMeta } from './endpoints/common';
import * as deploymentsEndpoints from './endpoints/deployments';
import { vercelDeploymentsMeta } from './endpoints/deployments-meta';
import * as dnsEndpoints from './endpoints/dns';
import { vercelDnsMeta } from './endpoints/dns-meta';
import * as domainsEndpoints from './endpoints/domains';
import { vercelDomainsMeta } from './endpoints/domains-meta';
import * as edgeConfigEndpoints from './endpoints/edge-config';
import { vercelEdgeConfigMeta } from './endpoints/edge-config-meta';
import * as envsEndpoints from './endpoints/envs';
import { vercelEnvsMeta } from './endpoints/envs-meta';
import * as projectsEndpoints from './endpoints/projects';
import { vercelProjectsMeta } from './endpoints/projects-meta';
import * as teamsEndpoints from './endpoints/teams';
import { vercelTeamsMeta } from './endpoints/teams-meta';
import {
	VercelEndpointInputSchemas,
	VercelEndpointOutputSchemas,
} from './endpoints/types';
import * as userEndpoints from './endpoints/user';
import { vercelUserMeta } from './endpoints/user-meta';
import * as webhooksEndpoints from './endpoints/webhooks';
import { vercelWebhooksMeta } from './endpoints/webhooks-meta';
import { errorHandlers } from './error-handlers';
import { VercelSchema } from './schema';
import type { VercelWebhookOutputs } from './webhooks';
import {
	DeploymentCreatedEventSchema,
	DeploymentErrorEventSchema,
	DeploymentSucceededEventSchema,
	ProjectCreatedEventSchema,
	WebhookHandlers,
} from './webhooks';
import { resolveVercelOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchVercelTenantWebhook } from './webhooks/tenant-matcher';

const defaultAuthType = 'api_key' as const;

/**
 * Token endpoint for refreshing an OAuth token. Integration tokens (the
 * install flow) don't expire and carry no refresh token; Sign in with Vercel
 * tokens last an hour and refresh here.
 */
export const VERCEL_OAUTH_TOKEN_URL =
	'https://api.vercel.com/login/oauth/token';

export type VercelPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2' | 'managed'>;
	/** A Vercel access token (Account Settings → Tokens), or an OAuth token you obtained. */
	key?: string;
	/**
	 * Default team (id `team_…` or slug) for calls that don't pass `teamId`.
	 * A team saved on the connection (an OAuth install, or the `team_id` field)
	 * comes first.
	 */
	teamId?: string;
	webhookSecret?: string;
	hooks?: InternalVercelPlugin['hooks'];
	webhookHooks?: InternalVercelPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vercelEndpointsNested>;
};

export type VercelContext = CorsairPluginContext<
	typeof VercelSchema,
	VercelPluginOptions
>;

export type VercelKeyBuilderContext = KeyBuilderContext<VercelPluginOptions>;

const vercelEndpointsNested = {
	projects: { ...projectsEndpoints },
	deployments: { ...deploymentsEndpoints },
	envs: { ...envsEndpoints },
	domains: { ...domainsEndpoints },
	dns: { ...dnsEndpoints },
	aliases: { ...aliasesEndpoints },
	teams: { ...teamsEndpoints },
	user: { ...userEndpoints },
	webhooks: { ...webhooksEndpoints },
	edgeConfig: { ...edgeConfigEndpoints },
} as const;

export type VercelBoundEndpoints = BindEndpoints<typeof vercelEndpointsNested>;

type Prefixed<G extends string, T> = {
	[K in keyof T & string as `${G}.${K}`]: T[K];
};

function groupMeta<G extends string, M extends Record<string, EndpointMeta>>(
	group: G,
	meta: M,
) {
	const entries = Object.entries(meta).map(([name, entry]) => [
		`${group}.${name}`,
		entry,
	]);
	return Object.fromEntries(entries) as Prefixed<G, M>;
}

type EndpointPath = keyof typeof VercelEndpointInputSchemas;

export const vercelEndpointSchemas = Object.fromEntries(
	(Object.keys(VercelEndpointInputSchemas) as EndpointPath[]).map((path) => [
		path,
		{
			input: VercelEndpointInputSchemas[path],
			output: VercelEndpointOutputSchemas[path],
		},
	]),
) as {
	[P in EndpointPath]: {
		input: (typeof VercelEndpointInputSchemas)[P];
		output: (typeof VercelEndpointOutputSchemas)[P];
	};
} satisfies RequiredPluginEndpointSchemas<typeof vercelEndpointsNested>;

const vercelEndpointMeta = {
	...groupMeta('projects', vercelProjectsMeta),
	...groupMeta('deployments', vercelDeploymentsMeta),
	...groupMeta('envs', vercelEnvsMeta),
	...groupMeta('domains', vercelDomainsMeta),
	...groupMeta('dns', vercelDnsMeta),
	...groupMeta('aliases', vercelAliasesMeta),
	...groupMeta('teams', vercelTeamsMeta),
	...groupMeta('user', vercelUserMeta),
	...groupMeta('webhooks', vercelWebhooksMeta),
	...groupMeta('edgeConfig', vercelEdgeConfigMeta),
} satisfies RequiredPluginEndpointMeta<typeof vercelEndpointsNested>;

const vercelWebhooksNested = {
	deploymentCreated: WebhookHandlers.deploymentCreated,
	deploymentSucceeded: WebhookHandlers.deploymentSucceeded,
	deploymentError: WebhookHandlers.deploymentError,
	projectCreated: WebhookHandlers.projectCreated,
} as const;

const vercelWebhookSchemas = {
	deploymentCreated: DeploymentCreatedEventSchema,
	deploymentSucceeded: DeploymentSucceededEventSchema,
	deploymentError: DeploymentErrorEventSchema,
	projectCreated: ProjectCreatedEventSchema,
};

export type VercelWebhooks = {
	deploymentCreated: CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['deploymentCreated']
	>;
	deploymentSucceeded: CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['deploymentSucceeded']
	>;
	deploymentError: CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['deploymentError']
	>;
	projectCreated: CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['projectCreated']
	>;
};
export type VercelBoundWebhooks = BindWebhooks<typeof vercelWebhooksNested>;

/**
 * `team_id` is the team calls run against when they don't name one: set by an
 * OAuth install (the team it was made for), or typed beside an access token
 * (team id or slug). Left empty, calls use the token's own scope.
 */
export const vercelAuthConfig = {
	api_key: { account: ['team_id'] as const },
	oauth_2: { account: ['team_id'] as const },
	managed: { account: ['team_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseVercelPlugin<T extends VercelPluginOptions> = CorsairPlugin<
	'vercel',
	typeof VercelSchema,
	typeof vercelEndpointsNested,
	typeof vercelWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalVercelPlugin = BaseVercelPlugin<VercelPluginOptions>;
export type ExternalVercelPlugin<T extends VercelPluginOptions> =
	BaseVercelPlugin<T>;

export function vercel<const T extends VercelPluginOptions>(
	incomingOptions: VercelPluginOptions & T = {} as VercelPluginOptions & T,
): ExternalVercelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'vercel',
		authConfig: vercelAuthConfig,
		schema: VercelSchema,
		options: options,
		oauthConfig: undefined,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: vercelEndpointsNested,
		webhooks: vercelWebhooksNested,
		endpointMeta: vercelEndpointMeta,
		endpointSchemas: vercelEndpointSchemas,
		webhookSchemas: vercelWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-vercel-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchVercelTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveVercelOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VercelKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new Error(
						'[auth-missing:vercel:webhook_signature]: Vercel webhook signature is missing',
					);
				}
				return res;
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('vercel', 'api_key');
				}
				return res;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);
				// With a refresh token, core refreshes before expiry and re-mints
				// after a 401.
				if (refreshToken) {
					return getOAuthAccessToken(ctx, {
						plugin: 'vercel',
						tokenUrl: VERCEL_OAUTH_TOKEN_URL,
					});
				}
				// Without one (integration tokens never expire), use the token
				// until it expires, then ask for a new connection.
				const expired =
					Boolean(expiresAt) &&
					!(Number(expiresAt) > Math.floor(Date.now() / 1000) + 60);
				if (accessToken && !expired) return accessToken;
				throw new AuthMissingError('vercel', 'oauth_2');
			}

			if (ctx.authType === 'managed') {
				if (!ctx.hub) {
					throw new Error(
						'[auth-missing:vercel:managed]: Hub config is required for managed auth. Pass hub: { ... } to createCorsair().',
					);
				}
				const managedContext = {
					keys: ctx.keys,
					hub: ctx.hub,
					plugin: 'vercel',
					tenantId: ctx.tenantId,
				};
				const result = await getManagedAccessToken(managedContext);
				await attachManagedRefreshAuth(ctx, managedContext);
				return result.accessToken;
			}

			throw new AuthMissingError('vercel', defaultAuthType);
		},
	} satisfies InternalVercelPlugin;
}

export type {
	VercelQuery,
	VercelRequestContext,
	VercelRequestOptions,
} from './client';
export {
	makeAuthenticatedVercelRequest,
	makeVercelRequest,
	resolveTeam,
	teamScopeQuery,
	VERCEL_API_BASE,
} from './client';
export type {
	VercelAliasesInputs,
	VercelAliasesOutputs,
} from './endpoints/aliases-types';
export type {
	VercelDeploymentsInputs,
	VercelDeploymentsOutputs,
} from './endpoints/deployments-types';
export type { VercelDnsInputs, VercelDnsOutputs } from './endpoints/dns-types';
export type {
	VercelDomainsInputs,
	VercelDomainsOutputs,
} from './endpoints/domains-types';
export type {
	VercelEdgeConfigInputs,
	VercelEdgeConfigOutputs,
} from './endpoints/edge-config-types';
export type {
	VercelEnvsInputs,
	VercelEnvsOutputs,
} from './endpoints/envs-types';
export type {
	VercelProjectsInputs,
	VercelProjectsOutputs,
} from './endpoints/projects-types';
export type {
	VercelTeamsInputs,
	VercelTeamsOutputs,
} from './endpoints/teams-types';
export type {
	VercelEndpointInputs,
	VercelEndpointOutputs,
} from './endpoints/types';
export type {
	VercelUserInputs,
	VercelUserOutputs,
} from './endpoints/user-types';
export type {
	VercelWebhooksInputs,
	VercelWebhooksOutputs,
} from './endpoints/webhooks-types';
