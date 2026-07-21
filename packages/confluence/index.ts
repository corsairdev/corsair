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
import { AuthMissingError } from 'corsair/core';
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
import { ExampleWebhooks } from './webhooks';
import { resolveConfluenceOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchConfluenceTenantWebhook } from './webhooks/tenant-matcher';
import type { ConfluenceWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ConfluencePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	/** Confluence Cloud URL, e.g. 'https://your-domain.atlassian.net'. */
	cloudUrl?: string;
	webhookSecret?: string;
	hooks?: InternalConfluencePlugin['hooks'];
	webhookHooks?: InternalConfluencePlugin['webhookHooks'];
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

type ConfluenceWebhook<
	K extends keyof ConfluenceWebhookOutputs,
	TEvent,
> = CorsairWebhook<ConfluenceContext, TEvent, ConfluenceWebhookOutputs[K]>;

export type ConfluenceWebhooks = {
	example: ConfluenceWebhook<'example', ExampleEvent>;
};

export type ConfluenceBoundWebhooks = BindWebhooks<ConfluenceWebhooks>;

const confluenceEndpointsNested = {
	pages: {
		get: Pages.get,
		search: Pages.search,
	},
	spaces: {
		list: Spaces.list,
	},
} as const;

const confluenceWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
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

const confluenceWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof confluenceWebhooksNested
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
		account: ['cloud_url'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id', 'cloud_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseConfluencePlugin<T extends ConfluencePluginOptions> =
	CorsairPlugin<
		'confluence',
		typeof ConfluenceSchema,
		typeof confluenceEndpointsNested,
		typeof confluenceWebhooksNested,
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
		schema: ConfluenceSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: confluenceEndpointsNested,
		webhooks: confluenceWebhooksNested,
		endpointMeta: confluenceEndpointMeta,
		endpointSchemas: confluenceEndpointSchemas,
		webhookSchemas: confluenceWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			if (!('x-atlassian-webhook-identifier' in headers)) return false;
			// Confluence webhook events use page_/space_/blogpost_ prefixes
			// while Jira uses jira:/comment_/sprint_ prefixes. This prevents
			// a Jira webhook from matching the Confluence plugin.
			let parsedBody: unknown = request.body;
			if (typeof request.body === 'string') {
				try {
					parsedBody = JSON.parse(request.body);
				} catch {
					parsedBody = null;
				}
			}
			if (parsedBody && typeof parsedBody === 'object') {
				const eventType = (parsedBody as Record<string, unknown>).webhookEvent;
				if (typeof eventType === 'string') {
					return (
						eventType.startsWith('page_') ||
						eventType.startsWith('space_') ||
						eventType.startsWith('blogpost_') ||
						eventType.startsWith('attachment_') ||
						eventType.startsWith('content_')
					);
				}
			}
			return true;
		},
		pluginTenantWebhookMatcher: matchConfluenceTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveConfluenceOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ConfluenceKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new AuthMissingError('confluence', 'webhook_signature');
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('confluence', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('confluence', 'access_token');
				}
				return res;
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
export type {
	ConfluenceWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
