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
	browsersCreate,
	browsersGet,
	browsersList,
	browsersStop,
	runsCancel,
	runsCreate,
	runsGet,
	runsGetStatus,
} from './endpoints';
import type {
	BrowserUseEndpointInputs,
	BrowserUseEndpointOutputs,
} from './endpoints/types';
import {
	BrowserUseEndpointInputSchemas,
	BrowserUseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrowserUseSchema } from './schema';

export type BrowserUsePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBrowserUsePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browserUseEndpointsNested>;
};

/**
 * Browser Use Cloud authenticates with a project API key (`bu_...`)
 * sent as `X-Browser-Use-API-Key`.
 *
 * @see https://docs.browser-use.com/cloud/api-v4-overview
 */
export const browserUseAuthConfig = {
	api_key: {
		// The project key is the only credential. An extra account field
		// would leave a saved key looking incomplete.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BrowserUseContext = CorsairPluginContext<
	typeof BrowserUseSchema,
	BrowserUsePluginOptions,
	undefined,
	typeof browserUseAuthConfig
>;

export type BrowserUseKeyBuilderContext = KeyBuilderContext<
	BrowserUsePluginOptions,
	typeof browserUseAuthConfig
>;

export type BrowserUseBoundEndpoints = BindEndpoints<
	typeof browserUseEndpointsNested
>;

type BrowserUseEndpoint<K extends keyof BrowserUseEndpointOutputs> =
	CorsairEndpoint<
		BrowserUseContext,
		BrowserUseEndpointInputs[K],
		BrowserUseEndpointOutputs[K]
	>;

export type BrowserUseEndpoints = {
	browsersCreate: BrowserUseEndpoint<'browsersCreate'>;
	browsersGet: BrowserUseEndpoint<'browsersGet'>;
	browsersList: BrowserUseEndpoint<'browsersList'>;
	browsersStop: BrowserUseEndpoint<'browsersStop'>;
	runsCreate: BrowserUseEndpoint<'runsCreate'>;
	runsGet: BrowserUseEndpoint<'runsGet'>;
	runsGetStatus: BrowserUseEndpoint<'runsGetStatus'>;
	runsCancel: BrowserUseEndpoint<'runsCancel'>;
};

const browserUseEndpointsNested = {
	browsers: {
		create: browsersCreate,
		get: browsersGet,
		list: browsersList,
		stop: browsersStop,
	},
	runs: {
		create: runsCreate,
		get: runsGet,
		getStatus: runsGetStatus,
		cancel: runsCancel,
	},
} as const;

export const browserUseEndpointSchemas = {
	'browsers.create': {
		input: BrowserUseEndpointInputSchemas.browsersCreate,
		output: BrowserUseEndpointOutputSchemas.browsersCreate,
	},
	'browsers.get': {
		input: BrowserUseEndpointInputSchemas.browsersGet,
		output: BrowserUseEndpointOutputSchemas.browsersGet,
	},
	'browsers.list': {
		input: BrowserUseEndpointInputSchemas.browsersList,
		output: BrowserUseEndpointOutputSchemas.browsersList,
	},
	'browsers.stop': {
		input: BrowserUseEndpointInputSchemas.browsersStop,
		output: BrowserUseEndpointOutputSchemas.browsersStop,
	},
	'runs.create': {
		input: BrowserUseEndpointInputSchemas.runsCreate,
		output: BrowserUseEndpointOutputSchemas.runsCreate,
	},
	'runs.get': {
		input: BrowserUseEndpointInputSchemas.runsGet,
		output: BrowserUseEndpointOutputSchemas.runsGet,
	},
	'runs.getStatus': {
		input: BrowserUseEndpointInputSchemas.runsGetStatus,
		output: BrowserUseEndpointOutputSchemas.runsGetStatus,
	},
	'runs.cancel': {
		input: BrowserUseEndpointInputSchemas.runsCancel,
		output: BrowserUseEndpointOutputSchemas.runsCancel,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof browserUseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const browserUseEndpointMeta = {
	'browsers.create': {
		riskLevel: 'write',
		description:
			'POST /browsers — start a cloud browser; returns cdpUrl for Playwright/Puppeteer and a liveUrl',
	},
	'browsers.get': {
		riskLevel: 'read',
		description: 'GET /browsers/{id} — browser status, URLs, cost, recording',
	},
	'browsers.list': {
		riskLevel: 'read',
		description: 'GET /browsers — paginated browsers, filter by active/stopped',
	},
	'browsers.stop': {
		riskLevel: 'write',
		description: 'PATCH /browsers/{id} — stop a browser and refund unused time',
	},
	'runs.create': {
		riskLevel: 'write',
		description:
			'POST /runs — start a browser agent run for a natural-language task',
	},
	'runs.get': {
		riskLevel: 'read',
		description:
			'GET /runs/{id} — full run once status is terminal: result, tokens, cost',
	},
	'runs.getStatus': {
		riskLevel: 'read',
		description:
			'GET /runs/{id}/status — cheap poll until completed, failed, or cancelled',
	},
	'runs.cancel': {
		riskLevel: 'write',
		description: 'POST /runs/{id}/cancel — cancel an in-flight run',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof browserUseEndpointsNested
>;

export type BaseBrowserUsePlugin<T extends BrowserUsePluginOptions> =
	CorsairPlugin<
		'browseruse',
		typeof BrowserUseSchema,
		typeof browserUseEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof browserUseAuthConfig
	>;

export type InternalBrowserUsePlugin =
	BaseBrowserUsePlugin<BrowserUsePluginOptions>;

export type ExternalBrowserUsePlugin<T extends BrowserUsePluginOptions> =
	BaseBrowserUsePlugin<T>;

function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	// DEFAULT matches every error. It stays last so a caller handler can run.
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user ?? {};
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}

export function browseruse<const T extends BrowserUsePluginOptions>(
	// Factory default is an empty options object. T is the caller's options.
	incomingOptions: BrowserUsePluginOptions & T = {} as BrowserUsePluginOptions &
		T,
): ExternalBrowserUsePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'browseruse',
		authConfig: browserUseAuthConfig,
		schema: BrowserUseSchema,
		options,
		hooks: options.hooks,
		endpoints: browserUseEndpointsNested,
		webhooks: {},
		endpointMeta: browserUseEndpointMeta,
		endpointSchemas: browserUseEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: BrowserUseKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await tryGetStoredKey(() => ctx.keys.get_api_key());
				if (!res) {
					throw new AuthMissingError('browseruse', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('browseruse', 'api_key');
		},
	} satisfies InternalBrowserUsePlugin;
}

export {
	BROWSER_USE_API_BASE,
	BrowserUseAPIError,
	BrowserUseRateLimitError,
} from './client';
export type {
	BrowserUseEndpointInputs,
	BrowserUseEndpointOutputs,
} from './endpoints/types';
