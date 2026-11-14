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
	AuthEndpoints,
	Javascript,
	Pages,
	Pdf,
	Scrape,
	Screenshot,
} from './endpoints';
import type {
	CustomjsEndpointInputs,
	CustomjsEndpointOutputs,
} from './endpoints/types';
import {
	CustomjsEndpointInputSchemas,
	CustomjsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { CustomjsSchema } from './schema';

export type CustomjsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCustomjsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof customjsEndpointsNested>;
};

export type CustomjsContext = CorsairPluginContext<
	typeof CustomjsSchema,
	CustomjsPluginOptions
>;

export type CustomjsKeyBuilderContext =
	KeyBuilderContext<CustomjsPluginOptions>;

export type CustomjsBoundEndpoints = BindEndpoints<
	typeof customjsEndpointsNested
>;

type CustomjsEndpoint<K extends keyof CustomjsEndpointOutputs> =
	CorsairEndpoint<
		CustomjsContext,
		CustomjsEndpointInputs[K],
		CustomjsEndpointOutputs[K]
	>;

export type CustomjsEndpoints = {
	authCheck: CustomjsEndpoint<'authCheck'>;
	pdfFromHtml: CustomjsEndpoint<'pdfFromHtml'>;
	pdfFromMarkdown: CustomjsEndpoint<'pdfFromMarkdown'>;
	screenshotCapture: CustomjsEndpoint<'screenshotCapture'>;
	javascriptRun: CustomjsEndpoint<'javascriptRun'>;
	javascriptRunBinary: CustomjsEndpoint<'javascriptRunBinary'>;
	scrapePage: CustomjsEndpoint<'scrapePage'>;
	scrapeAgent: CustomjsEndpoint<'scrapeAgent'>;
	pagesList: CustomjsEndpoint<'pagesList'>;
	pagesCreate: CustomjsEndpoint<'pagesCreate'>;
	pagesUpdate: CustomjsEndpoint<'pagesUpdate'>;
	pagesDelete: CustomjsEndpoint<'pagesDelete'>;
};

const customjsEndpointsNested = {
	auth: {
		check: AuthEndpoints.check,
	},
	pdf: {
		fromHtml: Pdf.fromHtml,
		fromMarkdown: Pdf.fromMarkdown,
	},
	screenshot: {
		capture: Screenshot.capture,
	},
	javascript: {
		run: Javascript.run,
		runBinary: Javascript.runBinary,
	},
	scrape: {
		page: Scrape.page,
		agent: Scrape.agent,
	},
	pages: {
		list: Pages.list,
		create: Pages.create,
		update: Pages.update,
		delete: Pages.remove,
	},
} as const;

export const customjsEndpointSchemas = {
	'auth.check': {
		input: CustomjsEndpointInputSchemas.authCheck,
		output: CustomjsEndpointOutputSchemas.authCheck,
	},
	'pdf.fromHtml': {
		input: CustomjsEndpointInputSchemas.pdfFromHtml,
		output: CustomjsEndpointOutputSchemas.pdfFromHtml,
	},
	'pdf.fromMarkdown': {
		input: CustomjsEndpointInputSchemas.pdfFromMarkdown,
		output: CustomjsEndpointOutputSchemas.pdfFromMarkdown,
	},
	'screenshot.capture': {
		input: CustomjsEndpointInputSchemas.screenshotCapture,
		output: CustomjsEndpointOutputSchemas.screenshotCapture,
	},
	'javascript.run': {
		input: CustomjsEndpointInputSchemas.javascriptRun,
		output: CustomjsEndpointOutputSchemas.javascriptRun,
	},
	'javascript.runBinary': {
		input: CustomjsEndpointInputSchemas.javascriptRunBinary,
		output: CustomjsEndpointOutputSchemas.javascriptRunBinary,
	},
	'scrape.page': {
		input: CustomjsEndpointInputSchemas.scrapePage,
		output: CustomjsEndpointOutputSchemas.scrapePage,
	},
	'scrape.agent': {
		input: CustomjsEndpointInputSchemas.scrapeAgent,
		output: CustomjsEndpointOutputSchemas.scrapeAgent,
	},
	'pages.list': {
		input: CustomjsEndpointInputSchemas.pagesList,
		output: CustomjsEndpointOutputSchemas.pagesList,
	},
	'pages.create': {
		input: CustomjsEndpointInputSchemas.pagesCreate,
		output: CustomjsEndpointOutputSchemas.pagesCreate,
	},
	'pages.update': {
		input: CustomjsEndpointInputSchemas.pagesUpdate,
		output: CustomjsEndpointOutputSchemas.pagesUpdate,
	},
	'pages.delete': {
		input: CustomjsEndpointInputSchemas.pagesDelete,
		output: CustomjsEndpointOutputSchemas.pagesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof customjsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const customjsEndpointMeta = {
	'auth.check': {
		riskLevel: 'read',
		description:
			'Verify the API key and read its workspace name, rate-limit window and suspension state; the key and JWT in the raw answer are dropped',
	},
	'pdf.fromHtml': {
		riskLevel: 'read',
		description:
			'Render HTML or a Nunjucks template to PDF in Chromium, returning the bytes as base64 with an optional page size',
	},
	'pdf.fromMarkdown': {
		riskLevel: 'read',
		description: 'Render Markdown to PDF, returning the bytes as base64',
	},
	'screenshot.capture': {
		// `write`, not `read`: `commands` can click and type, which submits forms on
		// the visited site. A capture with no commands is a pure read, but one risk
		// level covers the whole operation.
		riskLevel: 'write',
		description:
			'Capture a URL as PNG after optional click, type, wait and scroll steps, cropped to a box when one is given',
	},
	'javascript.run': {
		riskLevel: 'write',
		description:
			'Run JavaScript inline with the given input and return what it produced as text; the code can call any bundled NPM module and reach the network',
	},
	'javascript.runBinary': {
		riskLevel: 'write',
		description:
			'Run JavaScript inline and return its Buffer result as base64, for PDFs and images; the code can call any bundled NPM module and reach the network',
	},
	'scrape.page': {
		// `write`, not `read`: the steps include `type`, `click` and `evaluate`,
		// which can submit a form or run code on the visited site. `read` would let
		// a read-only caller change a site and skip approval in strict mode.
		riskLevel: 'write',
		description:
			'Drive a browser through exact steps (navigate, click, type, evaluate and extract) and return the extracted values, with no model tokens spent per step',
	},
	'scrape.agent': {
		riskLevel: 'destructive',
		description:
			'Give an AI agent a plain-language goal and let it drive a browser for up to maxSteps actions; it bills model tokens and can submit forms on the site it visits',
		irreversible: true,
	},
	'pages.list': {
		riskLevel: 'read',
		description:
			'List the hosted HTML pages in the workspace with their live URLs',
	},
	'pages.create': {
		riskLevel: 'write',
		description:
			'Publish an HTML page to a new live URL; CustomJS does not enforce unique names, so a repeated call publishes a second page',
	},
	'pages.update': {
		riskLevel: 'write',
		description:
			'Replace the HTML of a hosted page in place, keeping its live URL, and optionally rename it',
	},
	'pages.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a hosted page, which takes its live URL down permanently; an unknown page ID fails with a 404',
		irreversible: true,
	},
} as const satisfies RequiredPluginEndpointMeta<typeof customjsEndpointsNested>;

export type BaseCustomjsPlugin<T extends CustomjsPluginOptions> = CorsairPlugin<
	'customjs',
	typeof CustomjsSchema,
	typeof customjsEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalCustomjsPlugin = BaseCustomjsPlugin<CustomjsPluginOptions>;

export type ExternalCustomjsPlugin<T extends CustomjsPluginOptions> =
	BaseCustomjsPlugin<T>;

export function customjs<const T extends CustomjsPluginOptions>(
	incomingOptions: CustomjsPluginOptions & T = {} as CustomjsPluginOptions & T,
): ExternalCustomjsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'customjs',
		schema: CustomjsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: customjsEndpointsNested,
		webhooks: {},
		endpointMeta: customjsEndpointMeta,
		endpointSchemas: customjsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: CustomjsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('customjs', ctx.authType ?? 'api_key');
		},
	} satisfies InternalCustomjsPlugin;
}

export { CustomjsAPIError } from './client';

export type {
	AuthCheckInput,
	AuthCheckResponse,
	CustomjsEndpointInputs,
	CustomjsEndpointOutputs,
	CustomjsFile,
	JavascriptRunBinaryInput,
	JavascriptRunBinaryResponse,
	JavascriptRunInput,
	JavascriptRunResponse,
	PagesCreateInput,
	PagesCreateResponse,
	PagesDeleteInput,
	PagesDeleteResponse,
	PagesListInput,
	PagesListResponse,
	PagesUpdateInput,
	PagesUpdateResponse,
	PdfFromHtmlInput,
	PdfFromHtmlResponse,
	PdfFromMarkdownInput,
	PdfFromMarkdownResponse,
	ScrapeAgentInput,
	ScrapeAgentResponse,
	ScrapePageInput,
	ScrapePageResponse,
	ScreenshotCaptureInput,
	ScreenshotCaptureResponse,
} from './endpoints/types';
