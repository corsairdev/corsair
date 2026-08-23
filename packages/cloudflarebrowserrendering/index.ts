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
import {
	CaptureScreenshot,
	ListAccounts,
	ScrapeHtmlElements,
	TakeWebpageSnapshot,
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
	listAccounts: CloudflareBrowserRenderingEndpoint<'listAccounts'>;
	captureScreenshot: CloudflareBrowserRenderingEndpoint<'captureScreenshot'>;
	takeWebpageSnapshot: CloudflareBrowserRenderingEndpoint<'takeWebpageSnapshot'>;
	scrapeHtmlElements: CloudflareBrowserRenderingEndpoint<'scrapeHtmlElements'>;
};

const cloudflareBrowserRenderingEndpointsNested = {
	listAccounts: {
		get: ListAccounts.get,
	},
	captureScreenshot: {
		create: CaptureScreenshot.create,
	},
	takeWebpageSnapshot: {
		create: TakeWebpageSnapshot.create,
	},
	scrapeHtmlElements: {
		create: ScrapeHtmlElements.create,
	},
} as const;

export const cloudflareBrowserRenderingEndpointSchemas = {
	'listAccounts.get': {
		input: CloudflareBrowserRenderingEndpointInputSchemas.listAccountsGet,
		output: CloudflareBrowserRenderingEndpointOutputSchemas.listAccountsGet,
	},
	'captureScreenshot.create': {
		input:
			CloudflareBrowserRenderingEndpointInputSchemas.captureScreenshotCreate,
		output:
			CloudflareBrowserRenderingEndpointOutputSchemas.captureScreenshotCreate,
	},
	'takeWebpageSnapshot.create': {
		input:
			CloudflareBrowserRenderingEndpointInputSchemas.takeWebpageSnapshotCreate,
		output:
			CloudflareBrowserRenderingEndpointOutputSchemas.takeWebpageSnapshotCreate,
	},
	'scrapeHtmlElements.create': {
		input:
			CloudflareBrowserRenderingEndpointInputSchemas.scrapeHtmlElementsCreate,
		output:
			CloudflareBrowserRenderingEndpointOutputSchemas.scrapeHtmlElementsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cloudflareBrowserRenderingEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudflareBrowserRenderingEndpointMeta = {
	'listAccounts.get': {
		riskLevel: 'read',
		description:
			'List all Cloudflare accounts accessible to the authenticated API token',
	},
	'captureScreenshot.create': {
		riskLevel: 'read',
		description: 'Capture a webpage screenshot',
	},
	'takeWebpageSnapshot.create': {
		riskLevel: 'read',
		description:
			'Capture both rendered HTML content and a screenshot of a webpage',
	},
	'scrapeHtmlElements.create': {
		riskLevel: 'read',
		description:
			'Scrape HTML elements for text, HTML, attributes, and box metrics',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cloudflareBrowserRenderingEndpointsNested
>;

export const cloudflareBrowserRenderingAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCloudflareBrowserRenderingPlugin<
	T extends CloudflareBrowserRenderingPluginOptions,
> = CorsairPlugin<
	'cloudflarebrowserrendering',
	typeof CloudflareBrowserRenderingSchema,
	typeof cloudflareBrowserRenderingEndpointsNested,
	Record<string, never>, // No webhooks
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
		options: options,
		hooks: options.hooks,
		endpoints: cloudflareBrowserRenderingEndpointsNested,
		webhooks: {} as any, // Bypassing webhook typing since we don't use them
		endpointMeta: cloudflareBrowserRenderingEndpointMeta,
		endpointSchemas: cloudflareBrowserRenderingEndpointSchemas,
		webhookSchemas: {} as any,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: CloudflareBrowserRenderingKeyBuilderContext,
			source,
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCloudflareBrowserRenderingPlugin;
}

export type {
	CloudflareBrowserRenderingEndpointInputs,
	CloudflareBrowserRenderingEndpointOutputs,
} from './endpoints/types';
