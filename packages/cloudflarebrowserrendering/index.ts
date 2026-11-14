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
	accessibilityTreeCapture,
	browserClose,
	browserCreate,
	browserProtocol,
	browserVersion,
	contentFetch,
	crawlCancel,
	crawlGet,
	crawlStart,
	jsonExtract,
	linksList,
	liveViewCreate,
	markdownConvert,
	pdfRender,
	scrapeExtract,
	screenshotCapture,
	sessionsGet,
	sessionsList,
	snapshotCapture,
	targetsActivate,
	targetsClose,
	targetsCreate,
	targetsGet,
	targetsList,
} from './endpoints';
import type {
	CloudflareBrowserRenderingEndpointInputs,
	CloudflareBrowserRenderingEndpointOutputs,
} from './endpoints/types';
import {
	CloudflareBrowserRenderingEndpointInputSchemas,
	CloudflareBrowserRenderingEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CloudflareBrowserRenderingSchema } from './schema';

export type CloudflareBrowserRenderingPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Request deadline in milliseconds; defaults to 8 minutes and is capped there. */
	requestTimeoutMs?: number;
	hooks?: InternalCloudflareBrowserRenderingPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof cloudflareBrowserRenderingEndpointsNested
	>;
};

export type CloudflareBrowserRenderingContext = CorsairPluginContext<
	typeof CloudflareBrowserRenderingSchema,
	CloudflareBrowserRenderingPluginOptions
>;

export type CloudflareBrowserRenderingKeyBuilderContext =
	KeyBuilderContext<CloudflareBrowserRenderingPluginOptions>;

export type CloudflareBrowserRenderingBoundEndpoints = BindEndpoints<
	typeof cloudflareBrowserRenderingEndpointsNested
>;

type CloudflareBrowserRenderingEndpoint<
	K extends keyof CloudflareBrowserRenderingEndpointOutputs,
> = CorsairEndpoint<
	CloudflareBrowserRenderingContext,
	CloudflareBrowserRenderingEndpointInputs[K],
	CloudflareBrowserRenderingEndpointOutputs[K]
>;

export type CloudflareBrowserRenderingEndpoints = {
	contentFetch: CloudflareBrowserRenderingEndpoint<'contentFetch'>;
	markdownConvert: CloudflareBrowserRenderingEndpoint<'markdownConvert'>;
	snapshotCapture: CloudflareBrowserRenderingEndpoint<'snapshotCapture'>;
	accessibilityTreeCapture: CloudflareBrowserRenderingEndpoint<'accessibilityTreeCapture'>;
	scrapeExtract: CloudflareBrowserRenderingEndpoint<'scrapeExtract'>;
	jsonExtract: CloudflareBrowserRenderingEndpoint<'jsonExtract'>;
	linksList: CloudflareBrowserRenderingEndpoint<'linksList'>;
	screenshotCapture: CloudflareBrowserRenderingEndpoint<'screenshotCapture'>;
	pdfRender: CloudflareBrowserRenderingEndpoint<'pdfRender'>;
	crawlStart: CloudflareBrowserRenderingEndpoint<'crawlStart'>;
	crawlGet: CloudflareBrowserRenderingEndpoint<'crawlGet'>;
	crawlCancel: CloudflareBrowserRenderingEndpoint<'crawlCancel'>;
	sessionsList: CloudflareBrowserRenderingEndpoint<'sessionsList'>;
	sessionsGet: CloudflareBrowserRenderingEndpoint<'sessionsGet'>;
	browserCreate: CloudflareBrowserRenderingEndpoint<'browserCreate'>;
	browserClose: CloudflareBrowserRenderingEndpoint<'browserClose'>;
	browserVersion: CloudflareBrowserRenderingEndpoint<'browserVersion'>;
	browserProtocol: CloudflareBrowserRenderingEndpoint<'browserProtocol'>;
	liveViewCreate: CloudflareBrowserRenderingEndpoint<'liveViewCreate'>;
	targetsCreate: CloudflareBrowserRenderingEndpoint<'targetsCreate'>;
	targetsList: CloudflareBrowserRenderingEndpoint<'targetsList'>;
	targetsGet: CloudflareBrowserRenderingEndpoint<'targetsGet'>;
	targetsActivate: CloudflareBrowserRenderingEndpoint<'targetsActivate'>;
	targetsClose: CloudflareBrowserRenderingEndpoint<'targetsClose'>;
};

const cloudflareBrowserRenderingEndpointsNested = {
	content: { fetch: contentFetch },
	markdown: { convert: markdownConvert },
	snapshot: { capture: snapshotCapture },
	accessibilityTree: { capture: accessibilityTreeCapture },
	scrape: { extract: scrapeExtract },
	json: { extract: jsonExtract },
	links: { list: linksList },
	screenshot: { capture: screenshotCapture },
	pdf: { render: pdfRender },
	crawl: {
		start: crawlStart,
		get: crawlGet,
		cancel: crawlCancel,
	},
	sessions: { list: sessionsList, get: sessionsGet },
	browser: {
		create: browserCreate,
		close: browserClose,
		version: browserVersion,
		protocol: browserProtocol,
		liveView: { create: liveViewCreate },
	},
	targets: {
		create: targetsCreate,
		list: targetsList,
		get: targetsGet,
		activate: targetsActivate,
		close: targetsClose,
	},
} as const;

export const cloudflareBrowserRenderingEndpointSchemas = {
	'content.fetch': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.contentFetch,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.contentFetch,
	},
	'markdown.convert': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.markdownConvert,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.markdownConvert,
	},
	'snapshot.capture': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.snapshotCapture,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.snapshotCapture,
	},
	'accessibilityTree.capture': {
		input:
			CloudflareBrowserRenderingEndpointInputSchemas.accessibilityTreeCapture,
		output:
			CloudflareBrowserRenderingEndpointOutputSchemas.accessibilityTreeCapture,
	},
	'scrape.extract': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.scrapeExtract,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.scrapeExtract,
	},
	'json.extract': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.jsonExtract,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.jsonExtract,
	},
	'links.list': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.linksList,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.linksList,
	},
	'screenshot.capture': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.screenshotCapture,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.screenshotCapture,
	},
	'pdf.render': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.pdfRender,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.pdfRender,
	},
	'crawl.start': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.crawlStart,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.crawlStart,
	},
	'crawl.get': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.crawlGet,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.crawlGet,
	},
	'crawl.cancel': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.crawlCancel,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.crawlCancel,
	},
	'sessions.list': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.sessionsList,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.sessionsList,
	},
	'sessions.get': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.sessionsGet,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.sessionsGet,
	},
	'browser.create': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.browserCreate,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.browserCreate,
	},
	'browser.close': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.browserClose,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.browserClose,
	},
	'browser.version': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.browserVersion,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.browserVersion,
	},
	'browser.protocol': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.browserProtocol,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.browserProtocol,
	},
	'browser.liveView.create': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.liveViewCreate,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.liveViewCreate,
	},
	'targets.create': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.targetsCreate,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.targetsCreate,
	},
	'targets.list': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.targetsList,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.targetsList,
	},
	'targets.get': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.targetsGet,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.targetsGet,
	},
	'targets.activate': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.targetsActivate,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.targetsActivate,
	},
	'targets.close': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.targetsClose,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.targetsClose,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cloudflareBrowserRenderingEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudflareBrowserRenderingEndpointMeta = {
	'content.fetch': {
		riskLevel: 'read',
		description:
			'Fetch rendered HTML through Browser Run Quick Actions: https://developers.cloudflare.com/browser-run/quick-actions/content-endpoint/.',
	},
	'markdown.convert': {
		riskLevel: 'read',
		description:
			'Convert rendered page content to Markdown: https://developers.cloudflare.com/browser-run/quick-actions/markdown-endpoint/.',
	},
	'snapshot.capture': {
		riskLevel: 'destructive',
		description:
			'Capture multiple page formats in one request: https://developers.cloudflare.com/browser-run/quick-actions/snapshot/.',
	},
	'accessibilityTree.capture': {
		riskLevel: 'read',
		description:
			'Capture a page accessibility tree: https://developers.cloudflare.com/browser-run/quick-actions/accessibility-tree-endpoint/.',
	},
	'scrape.extract': {
		riskLevel: 'read',
		description:
			'Extract selected HTML elements: https://developers.cloudflare.com/browser-run/quick-actions/scrape-endpoint/.',
	},
	'json.extract': {
		riskLevel: 'read',
		description:
			'Extract structured page data using a prompt or JSON schema: https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/.',
	},
	'links.list': {
		riskLevel: 'read',
		description:
			'Retrieve links from a rendered page: https://developers.cloudflare.com/browser-run/quick-actions/links-endpoint/.',
	},
	'screenshot.capture': {
		riskLevel: 'destructive',
		description:
			'Capture a screenshot as JSON-safe base64 data: https://developers.cloudflare.com/browser-run/quick-actions/screenshot-endpoint/.',
	},
	'pdf.render': {
		riskLevel: 'destructive',
		description:
			'Render a page to JSON-safe base64 PDF data: https://developers.cloudflare.com/browser-run/quick-actions/pdf-endpoint/.',
	},
	'crawl.start': {
		riskLevel: 'destructive',
		description:
			'Start an asynchronous site crawl: https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/.',
	},
	'crawl.get': {
		riskLevel: 'read',
		description:
			'Get crawl status or paginated results: https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/.',
	},
	'crawl.cancel': {
		riskLevel: 'write',
		description:
			'Cancel an active crawl job: https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/.',
	},
	'sessions.list': {
		riskLevel: 'read',
		description:
			'List active Browser Rendering sessions: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/session/methods/list/.',
	},
	'sessions.get': {
		riskLevel: 'read',
		description:
			'Get details for a Browser Rendering session: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/session/methods/get/.',
	},
	'browser.create': {
		riskLevel: 'destructive',
		description:
			'Acquire a browser session with optional guardrails: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/methods/create/.',
	},
	'browser.close': {
		riskLevel: 'write',
		description:
			'Close a Browser Rendering session: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/methods/delete/.',
	},
	'browser.version': {
		riskLevel: 'read',
		description:
			'Get browser and DevTools version metadata: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/methods/version/.',
	},
	'browser.protocol': {
		riskLevel: 'read',
		description:
			'Retrieve the dynamic Chrome DevTools Protocol schema: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/methods/protocol/.',
	},
	'browser.liveView.create': {
		riskLevel: 'write',
		description:
			'Mint time-limited browser live-view URLs: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/live_view/methods/create/.',
	},
	'targets.create': {
		riskLevel: 'write',
		description:
			'Open a browser tab: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/create/.',
	},
	'targets.list': {
		riskLevel: 'read',
		description:
			'List debuggable browser targets: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/list/.',
	},
	'targets.get': {
		riskLevel: 'read',
		description:
			'Get a debuggable target by ID: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/get/.',
	},
	'targets.activate': {
		riskLevel: 'write',
		description:
			'Activate a browser target: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/activate/.',
	},
	'targets.close': {
		riskLevel: 'write',
		description:
			'Close a browser target: https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/close/.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cloudflareBrowserRenderingEndpointsNested
>;

export const cloudflareBrowserRenderingAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCloudflareBrowserRenderingPlugin<
	T extends CloudflareBrowserRenderingPluginOptions,
> = CorsairPlugin<
	'cloudflarebrowserrendering',
	typeof CloudflareBrowserRenderingSchema,
	typeof cloudflareBrowserRenderingEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalCloudflareBrowserRenderingPlugin =
	BaseCloudflareBrowserRenderingPlugin<CloudflareBrowserRenderingPluginOptions>;

export type ExternalCloudflareBrowserRenderingPlugin<
	T extends CloudflareBrowserRenderingPluginOptions,
> = BaseCloudflareBrowserRenderingPlugin<T>;

export function cloudflarebrowserrendering<
	const T extends CloudflareBrowserRenderingPluginOptions,
>(
	incomingOptions: CloudflareBrowserRenderingPluginOptions &
		T = {} as CloudflareBrowserRenderingPluginOptions & T,
): ExternalCloudflareBrowserRenderingPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'cloudflarebrowserrendering',
		authConfig: cloudflareBrowserRenderingAuthConfig,
		schema: CloudflareBrowserRenderingSchema,
		options,
		hooks: options.hooks,
		endpoints: cloudflareBrowserRenderingEndpointsNested,
		// Browser Run documents REST Quick Actions, not inbound webhook delivery.
		webhooks: {},
		endpointMeta: cloudflareBrowserRenderingEndpointMeta,
		endpointSchemas: cloudflareBrowserRenderingEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: CloudflareBrowserRenderingKeyBuilderContext,
			source,
		) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					throw new AuthMissingError('cloudflarebrowserrendering', 'api_key');
				}
				return apiKey;
			}
			if (source === 'endpoint') {
				throw new AuthMissingError('cloudflarebrowserrendering', 'api_key');
			}
			return '';
		},
	} satisfies InternalCloudflareBrowserRenderingPlugin;
}

export type {
	CloudflareBrowserRenderingEndpointInputs,
	CloudflareBrowserRenderingEndpointOutputs,
	JsonValue,
} from './endpoints/types';
