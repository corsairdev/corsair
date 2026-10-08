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
import { tryGetStoredKey } from './client';
import {
	contentGet,
	downloadCreate,
	functionRun,
	pdfCreate,
	scrapeCreate,
	screenshotCreate,
	unblockCreate,
} from './endpoints';
import type {
	BrowserlessEndpointInputs,
	BrowserlessEndpointOutputs,
} from './endpoints/types';
import {
	BrowserlessEndpointInputSchemas,
	BrowserlessEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrowserlessSchema } from './schema';

export type BrowserlessPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBrowserlessPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browserlessEndpointsNested>;
};

/**
 * Browserless authenticates with an API token as `?token=`.
 *
 * @see https://docs.browserless.io/rest-apis/intro
 */
export const browserlessAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BrowserlessContext = CorsairPluginContext<
	typeof BrowserlessSchema,
	BrowserlessPluginOptions,
	undefined,
	typeof browserlessAuthConfig
>;

export type BrowserlessKeyBuilderContext = KeyBuilderContext<
	BrowserlessPluginOptions,
	typeof browserlessAuthConfig
>;

export type BrowserlessBoundEndpoints = BindEndpoints<
	typeof browserlessEndpointsNested
>;

type BrowserlessEndpoint<K extends keyof BrowserlessEndpointOutputs> =
	CorsairEndpoint<
		BrowserlessContext,
		BrowserlessEndpointInputs[K],
		BrowserlessEndpointOutputs[K]
	>;

export type BrowserlessEndpoints = {
	contentGet: BrowserlessEndpoint<'contentGet'>;
	screenshotCreate: BrowserlessEndpoint<'screenshotCreate'>;
	pdfCreate: BrowserlessEndpoint<'pdfCreate'>;
	scrapeCreate: BrowserlessEndpoint<'scrapeCreate'>;
	functionRun: BrowserlessEndpoint<'functionRun'>;
	unblockCreate: BrowserlessEndpoint<'unblockCreate'>;
	downloadCreate: BrowserlessEndpoint<'downloadCreate'>;
};

const browserlessEndpointsNested = {
	content: {
		get: contentGet,
	},
	screenshot: {
		create: screenshotCreate,
	},
	pdf: {
		create: pdfCreate,
	},
	scrape: {
		create: scrapeCreate,
	},
	function: {
		run: functionRun,
	},
	unblock: {
		create: unblockCreate,
	},
	download: {
		create: downloadCreate,
	},
} as const;

export const browserlessEndpointSchemas = {
	'content.get': {
		input: BrowserlessEndpointInputSchemas.contentGet,
		output: BrowserlessEndpointOutputSchemas.contentGet,
	},
	'screenshot.create': {
		input: BrowserlessEndpointInputSchemas.screenshotCreate,
		output: BrowserlessEndpointOutputSchemas.screenshotCreate,
	},
	'pdf.create': {
		input: BrowserlessEndpointInputSchemas.pdfCreate,
		output: BrowserlessEndpointOutputSchemas.pdfCreate,
	},
	'scrape.create': {
		input: BrowserlessEndpointInputSchemas.scrapeCreate,
		output: BrowserlessEndpointOutputSchemas.scrapeCreate,
	},
	'function.run': {
		input: BrowserlessEndpointInputSchemas.functionRun,
		output: BrowserlessEndpointOutputSchemas.functionRun,
	},
	'unblock.create': {
		input: BrowserlessEndpointInputSchemas.unblockCreate,
		output: BrowserlessEndpointOutputSchemas.unblockCreate,
	},
	'download.create': {
		input: BrowserlessEndpointInputSchemas.downloadCreate,
		output: BrowserlessEndpointOutputSchemas.downloadCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof browserlessEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const browserlessEndpointMeta = {
	'content.get': {
		riskLevel: 'read',
		description:
			'POST /content — fully rendered HTML after JavaScript execution',
	},
	'screenshot.create': {
		riskLevel: 'read',
		description: 'POST /screenshot — PNG, JPEG, or WebP of a page',
	},
	'pdf.create': {
		riskLevel: 'read',
		description: 'POST /pdf — Chrome print-engine PDF of a page',
	},
	'scrape.create': {
		riskLevel: 'read',
		description: 'POST /scrape — structured JSON via CSS selectors',
	},
	'function.run': {
		riskLevel: 'write',
		description: 'POST /function — run custom Puppeteer code in one session',
	},
	'unblock.create': {
		riskLevel: 'read',
		description:
			'POST /unblock — bypass bot detection and return content/cookies/screenshot',
	},
	'download.create': {
		riskLevel: 'write',
		description:
			'POST /download — return files Chrome downloaded during Puppeteer code',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof browserlessEndpointsNested
>;

export type BaseBrowserlessPlugin<T extends BrowserlessPluginOptions> =
	CorsairPlugin<
		'browserless',
		typeof BrowserlessSchema,
		typeof browserlessEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof browserlessAuthConfig
	>;

export type InternalBrowserlessPlugin =
	BaseBrowserlessPlugin<BrowserlessPluginOptions>;

export type ExternalBrowserlessPlugin<T extends BrowserlessPluginOptions> =
	BaseBrowserlessPlugin<T>;

export function browserless<const T extends BrowserlessPluginOptions>(
	incomingOptions: BrowserlessPluginOptions &
		T = {} as BrowserlessPluginOptions & T,
): ExternalBrowserlessPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'browserless',
		authConfig: browserlessAuthConfig,
		schema: BrowserlessSchema,
		options,
		hooks: options.hooks,
		endpoints: browserlessEndpointsNested,
		webhooks: {},
		endpointMeta: browserlessEndpointMeta,
		endpointSchemas: browserlessEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BrowserlessKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await tryGetStoredKey(() => ctx.keys.get_api_key());
				if (!res) {
					throw new AuthMissingError('browserless', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('browserless', 'api_key');
		},
	} satisfies InternalBrowserlessPlugin;
}

export {
	BROWSERLESS_API_BASE,
	BrowserlessAPIError,
	BrowserlessRateLimitError,
} from './client';
export type {
	BrowserlessEndpointInputs,
	BrowserlessEndpointOutputs,
} from './endpoints/types';
