import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Brand,
	Extract,
	Markdown,
	Oembed,
	Query,
	Scrape,
	Screenshot,
	Site,
} from './endpoints';
import type {
	OpengraphEndpointInputs,
	OpengraphEndpointOutputs,
} from './endpoints/types';
import {
	OpengraphEndpointInputSchemas,
	OpengraphEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { OpengraphSchema } from './schema';

export type OpengraphPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalOpengraphPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof opengraphEndpointsNested>;
};

export type OpengraphContext = CorsairPluginContext<
	typeof OpengraphSchema,
	OpengraphPluginOptions
>;

export type OpengraphKeyBuilderContext =
	KeyBuilderContext<OpengraphPluginOptions>;

export type OpengraphBoundEndpoints = BindEndpoints<
	typeof opengraphEndpointsNested
>;

type OpengraphEndpoint<K extends keyof OpengraphEndpointOutputs> =
	CorsairEndpoint<
		OpengraphContext,
		OpengraphEndpointInputs[K],
		OpengraphEndpointOutputs[K]
	>;

export type OpengraphEndpoints = {
	siteGet: OpengraphEndpoint<'siteGet'>;
	scrapeFetch: OpengraphEndpoint<'scrapeFetch'>;
	screenshotCapture: OpengraphEndpoint<'screenshotCapture'>;
	extractRun: OpengraphEndpoint<'extractRun'>;
	queryRun: OpengraphEndpoint<'queryRun'>;
	oembedGet: OpengraphEndpoint<'oembedGet'>;
	markdownGet: OpengraphEndpoint<'markdownGet'>;
	brandAnalyze: OpengraphEndpoint<'brandAnalyze'>;
};

const opengraphEndpointsNested = {
	site: {
		get: Site.get,
	},
	scrape: {
		fetch: Scrape.fetch,
	},
	screenshot: {
		capture: Screenshot.capture,
	},
	extract: {
		run: Extract.run,
	},
	query: {
		run: Query.run,
	},
	oembed: {
		get: Oembed.get,
	},
	markdown: {
		get: Markdown.get,
	},
	brand: {
		analyze: Brand.analyze,
	},
} as const;

export const opengraphEndpointSchemas = {
	'site.get': {
		input: OpengraphEndpointInputSchemas.siteGet,
		output: OpengraphEndpointOutputSchemas.siteGet,
	},
	'scrape.fetch': {
		input: OpengraphEndpointInputSchemas.scrapeFetch,
		output: OpengraphEndpointOutputSchemas.scrapeFetch,
	},
	'screenshot.capture': {
		input: OpengraphEndpointInputSchemas.screenshotCapture,
		output: OpengraphEndpointOutputSchemas.screenshotCapture,
	},
	'extract.run': {
		input: OpengraphEndpointInputSchemas.extractRun,
		output: OpengraphEndpointOutputSchemas.extractRun,
	},
	'query.run': {
		input: OpengraphEndpointInputSchemas.queryRun,
		output: OpengraphEndpointOutputSchemas.queryRun,
	},
	'oembed.get': {
		input: OpengraphEndpointInputSchemas.oembedGet,
		output: OpengraphEndpointOutputSchemas.oembedGet,
	},
	'markdown.get': {
		input: OpengraphEndpointInputSchemas.markdownGet,
		output: OpengraphEndpointOutputSchemas.markdownGet,
	},
	'brand.analyze': {
		input: OpengraphEndpointInputSchemas.brandAnalyze,
		output: OpengraphEndpointOutputSchemas.brandAnalyze,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof opengraphEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const opengraphEndpointMeta = {
	'site.get': {
		riskLevel: 'read',
		description:
			'Extract OpenGraph, Twitter Card and HTML meta tags from a URL as a merged hybrid graph for link previews',
	},
	'scrape.fetch': {
		riskLevel: 'read',
		description:
			'Fetch the raw HTML of a URL, with optional JavaScript rendering and proxy tiers for protected sites',
	},
	'screenshot.capture': {
		riskLevel: 'read',
		description:
			'Capture a screenshot of a URL and get a CDN link that expires after 24 hours, with viewport, format and selector controls',
	},
	'extract.run': {
		riskLevel: 'read',
		description:
			'Extract chosen HTML elements as structured data plus concatenated clean text from a URL, ready for LLM pipelines',
	},
	'query.run': {
		riskLevel: 'read',
		description:
			'Ask an AI question about a URL and get an answer shaped by a requested structure, from a nano or mini model',
	},
	'oembed.get': {
		riskLevel: 'read',
		description:
			'Resolve embeddable HTML for a URL: a native provider embed, an oEmbed discovery link, or a hosted fallback card',
	},
	'markdown.get': {
		riskLevel: 'read',
		description:
			'Convert a URL to clean Markdown with optional heading-aware chunking, keyword passage search and structure extraction',
	},
	'brand.analyze': {
		riskLevel: 'read',
		description:
			'Analyze the brand behind a website: identity, products, audiences, positioning, messaging, voice, visual style and links',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof opengraphEndpointsNested
>;

export type BaseOpengraphPlugin<T extends OpengraphPluginOptions> =
	CorsairPlugin<
		'opengraph',
		typeof OpengraphSchema,
		typeof opengraphEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalOpengraphPlugin =
	BaseOpengraphPlugin<OpengraphPluginOptions>;

export type ExternalOpengraphPlugin<T extends OpengraphPluginOptions> =
	BaseOpengraphPlugin<T>;

export function opengraph<const T extends OpengraphPluginOptions>(
	incomingOptions: OpengraphPluginOptions & T = {} as OpengraphPluginOptions &
		T,
): ExternalOpengraphPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'opengraph',
		schema: OpengraphSchema,
		options: options,
		hooks: options.hooks,
		endpoints: opengraphEndpointsNested,
		webhooks: {},
		endpointMeta: opengraphEndpointMeta,
		endpointSchemas: opengraphEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: OpengraphKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('opengraph', ctx.authType ?? 'api_key');
		},
	} satisfies InternalOpengraphPlugin;
}

export { OpengraphAPIError } from './client';

export type {
	BrandAnalyzeInput,
	BrandAnalyzeResponse,
	ExtractRunInput,
	ExtractRunResponse,
	MarkdownGetInput,
	MarkdownGetResponse,
	OembedGetInput,
	OembedGetResponse,
	OpengraphEndpointInputs,
	OpengraphEndpointOutputs,
	QueryRunInput,
	QueryRunResponse,
	ScrapeFetchInput,
	ScrapeFetchResponse,
	ScreenshotCaptureInput,
	ScreenshotCaptureResponse,
	SiteGetInput,
	SiteGetResponse,
} from './endpoints/types';
