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
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import type { GitlabEndpointInputs, GitlabEndpointOutputs } from './endpoints/types';
import { GitlabEndpointInputSchemas, GitlabEndpointOutputSchemas } from './endpoints/types';
import type { GitlabWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GitlabSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import {
	getValidGitlabAccessToken,
	gitlabOAuthTokenUrl,
	normalizeGitlabBaseUrl,
} from './client';

export const gitlabAuthConfig = {} as const satisfies PluginAuthConfig;

export type GitlabPluginOptions = {
	/** Self-managed GitLab base URL (default https://gitlab.com) */
	baseUrl?: string;
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGitlabPlugin['hooks'];
	webhookHooks?: InternalGitlabPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gitlabEndpointsNested>;
};

export type GitlabContext = CorsairPluginContext<
	typeof GitlabSchema,
	GitlabPluginOptions,
	undefined,
	typeof gitlabAuthConfig
>;

export type GitlabKeyBuilderContext = KeyBuilderContext<
	GitlabPluginOptions,
	typeof gitlabAuthConfig
>;

export type GitlabBoundEndpoints = BindEndpoints<typeof gitlabEndpointsNested>;

type GitlabEndpoint<K extends keyof GitlabEndpointOutputs> = CorsairEndpoint<
	GitlabContext,
	GitlabEndpointInputs[K],
	GitlabEndpointOutputs[K]
>;

export type GitlabEndpoints = {
	exampleGet: GitlabEndpoint<'exampleGet'>;
};

type GitlabWebhook<
	K extends keyof GitlabWebhookOutputs,
	TEvent,
> = CorsairWebhook<GitlabContext, TEvent, GitlabWebhookOutputs[K]>;

export type GitlabWebhooks = {
	example: GitlabWebhook<'example', ExampleEvent>;
};

export type GitlabBoundWebhooks = BindWebhooks<GitlabWebhooks>;

const gitlabEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const gitlabWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const gitlabEndpointSchemas = {
	'example.get': {
		input: GitlabEndpointInputSchemas.exampleGet,
		output: GitlabEndpointOutputSchemas.exampleGet,
	},
} as const;

const gitlabWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event from GitLab',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const gitlabEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get the current user (validates API key or OAuth token)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gitlabEndpointsNested>;

export type BaseGitlabPlugin<T extends GitlabPluginOptions> = CorsairPlugin<
	'gitlab',
	typeof GitlabSchema,
	typeof gitlabEndpointsNested,
	typeof gitlabWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof gitlabAuthConfig
>;

export type InternalGitlabPlugin = BaseGitlabPlugin<GitlabPluginOptions>;

export type ExternalGitlabPlugin<T extends GitlabPluginOptions> =
	BaseGitlabPlugin<T>;

export function gitlab<const T extends GitlabPluginOptions>(
	incomingOptions: GitlabPluginOptions & T = {} as GitlabPluginOptions & T,
): ExternalGitlabPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const baseUrl = normalizeGitlabBaseUrl(options.baseUrl);

	return {
		id: 'gitlab',
		schema: GitlabSchema,
		options: options,
		authConfig: gitlabAuthConfig,
		oauthConfig: {
			providerName: 'GitLab',
			authUrl: `${baseUrl}/oauth/authorize`,
			tokenUrl: gitlabOAuthTokenUrl(baseUrl),
			scopes: ['read_user', 'read_api', 'api'],
			tokenAuthMethod: 'body',
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gitlabEndpointsNested,
		webhooks: gitlabWebhooksNested,
		endpointMeta: gitlabEndpointMeta,
		endpointSchemas: gitlabEndpointSchemas,
		webhookSchemas: gitlabWebhookSchemas,
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const token = headers['x-gitlab-token'];
			const event = headers['x-gitlab-event'];
			return token !== undefined || event !== undefined;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GitlabKeyBuilderContext, source) => {
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
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new Error(
						'[corsair:gitlab] No refresh token found. Run `corsair auth --plugin=gitlab` to re-authenticate.',
					);
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error(
						'[corsair:gitlab] Missing client_id or client_secret. Configure OAuth application credentials for this integration.',
					);
				}

				const tokenUrl = gitlabOAuthTokenUrl(ctx.options.baseUrl);

				let result: Awaited<ReturnType<typeof getValidGitlabAccessToken>>;
				try {
					result = await getValidGitlabAccessToken({
						tokenUrl,
						accessToken,
						expiresAt,
						refreshToken,
						clientId: res.client_id,
						clientSecret: res.client_secret,
						redirectUri: res.redirect_url,
					});
				} catch (error) {
					throw new Error(
						`[corsair:gitlab] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await ctx.keys.set_access_token(result.accessToken);
						await ctx.keys.set_expires_at(String(result.expiresAt));
					} catch (error) {
						throw new Error(
							`[corsair:gitlab] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				(ctx as Record<string, unknown>)._refreshAuth = async () => {
					const freshResult = await getValidGitlabAccessToken({
						tokenUrl,
						accessToken: null,
						expiresAt: null,
						refreshToken,
						clientId: res.client_id!,
						clientSecret: res.client_secret!,
						redirectUri: res.redirect_url,
						forceRefresh: true,
					});
					await ctx.keys.set_access_token(freshResult.accessToken);
					await ctx.keys.set_expires_at(String(freshResult.expiresAt));
					return freshResult.accessToken;
				};

				return result.accessToken;
			}

			return '';
		},
	} satisfies InternalGitlabPlugin;
}

export type { ExampleEvent, GitlabWebhookOutputs } from './webhooks/types';

export type {
	GitlabEndpointInputs,
	GitlabEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
