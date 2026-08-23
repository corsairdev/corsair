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
import { Extract, Search } from './endpoints';
import type {
	DiffbotEndpointInputs,
	DiffbotEndpointOutputs,
} from './endpoints/types';
import {
	DiffbotEndpointInputSchemas,
	DiffbotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DiffbotSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDiffbotOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDiffbotTenantWebhook } from './webhooks/tenant-matcher';
import type { DiffbotWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DiffbotPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDiffbotPlugin['hooks'];
	webhookHooks?: InternalDiffbotPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof diffbotEndpointsNested>;
};

export type DiffbotContext = CorsairPluginContext<
	typeof DiffbotSchema,
	DiffbotPluginOptions
>;

export type DiffbotKeyBuilderContext = KeyBuilderContext<DiffbotPluginOptions>;

export type DiffbotBoundEndpoints = BindEndpoints<
	typeof diffbotEndpointsNested
>;

type DiffbotEndpoint<K extends keyof DiffbotEndpointOutputs> = CorsairEndpoint<
	DiffbotContext,
	DiffbotEndpointInputs[K],
	DiffbotEndpointOutputs[K]
>;

export type DiffbotEndpoints = {
	extractArticle: DiffbotEndpoint<'extractArticle'>;
	extractProduct: DiffbotEndpoint<'extractProduct'>;
	extractAnalyze: DiffbotEndpoint<'extractAnalyze'>;
	searchWeb: DiffbotEndpoint<'searchWeb'>;
	searchDql: DiffbotEndpoint<'searchDql'>;
};

type DiffbotWebhook<
	K extends keyof DiffbotWebhookOutputs,
	TEvent,
> = CorsairWebhook<DiffbotContext, TEvent, DiffbotWebhookOutputs[K]>;

export type DiffbotWebhooks = {
	// Diffbot does not have a native webhook system.
	// This placeholder webhook is kept for Corsair plugin structure compliance.
	example: DiffbotWebhook<'example', ExampleEvent>;
};

export type DiffbotBoundWebhooks = BindWebhooks<DiffbotWebhooks>;

const diffbotEndpointsNested = {
	extract: {
		article: Extract.article,
		product: Extract.product,
		analyze: Extract.analyze,
	},
	search: {
		web: Search.web,
		dql: Search.dql,
	},
} as const;

const diffbotWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const diffbotEndpointSchemas = {
	'extract.article': {
		input: DiffbotEndpointInputSchemas.extractArticle,
		output: DiffbotEndpointOutputSchemas.extractArticle,
	},
	'extract.product': {
		input: DiffbotEndpointInputSchemas.extractProduct,
		output: DiffbotEndpointOutputSchemas.extractProduct,
	},
	'extract.analyze': {
		input: DiffbotEndpointInputSchemas.extractAnalyze,
		output: DiffbotEndpointOutputSchemas.extractAnalyze,
	},
	'search.web': {
		input: DiffbotEndpointInputSchemas.searchWeb,
		output: DiffbotEndpointOutputSchemas.searchWeb,
	},
	'search.dql': {
		input: DiffbotEndpointInputSchemas.searchDql,
		output: DiffbotEndpointOutputSchemas.searchDql,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof diffbotEndpointsNested
>;

const diffbotWebhookSchemas = {
	'example.example': {
		description:
			'Placeholder webhook event (Diffbot does not have a native webhook system)',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof diffbotWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const diffbotEndpointMeta = {
	'extract.article': {
		riskLevel: 'read',
		description:
			'Extract article title, text, author, date, and metadata from any URL',
	},
	'extract.product': {
		riskLevel: 'read',
		description:
			'Extract product price, availability, images, and specs from any e-commerce URL',
	},
	'extract.analyze': {
		riskLevel: 'read',
		description:
			'Auto-detect page type and extract structured data from any URL',
	},
	'search.web': {
		riskLevel: 'read',
		description:
			'Search the web and return structured results with article metadata',
	},
	'search.dql': {
		riskLevel: 'read',
		description:
			'Query the Diffbot Knowledge Graph using DQL (Diffbot Query Language)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof diffbotEndpointsNested>;

export const diffbotAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDiffbotPlugin<T extends DiffbotPluginOptions> = CorsairPlugin<
	'diffbot',
	typeof DiffbotSchema,
	typeof diffbotEndpointsNested,
	typeof diffbotWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDiffbotPlugin = BaseDiffbotPlugin<DiffbotPluginOptions>;

export type ExternalDiffbotPlugin<T extends DiffbotPluginOptions> =
	BaseDiffbotPlugin<T>;

export function diffbot<const T extends DiffbotPluginOptions>(
	incomingOptions: DiffbotPluginOptions & T = {} as DiffbotPluginOptions & T,
): ExternalDiffbotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'diffbot',
		authConfig: diffbotAuthConfig,
		schema: DiffbotSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: diffbotEndpointsNested,
		webhooks: diffbotWebhooksNested,
		endpointMeta: diffbotEndpointMeta,
		endpointSchemas: diffbotEndpointSchemas,
		webhookSchemas: diffbotWebhookSchemas,
		// Diffbot does not use webhook signatures — this is a no-op matcher
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-diffbot-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDiffbotTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDiffbotOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DiffbotKeyBuilderContext, source) => {
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

			return '';
		},
	} satisfies InternalDiffbotPlugin;
}

export type {
	AnalyzeInput,
	AnalyzeResponse,
	DiffbotEndpointInputs,
	DiffbotEndpointOutputs,
	DqlSearchInput,
	DqlSearchResponse,
	ExtractArticleInput,
	ExtractArticleResponse,
	ExtractProductInput,
	ExtractProductResponse,
	WebSearchInput,
	WebSearchResponse,
} from './endpoints/types';
export type {
	DiffbotWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
