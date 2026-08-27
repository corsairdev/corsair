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
import { Sessions } from './endpoints';
import type {
	BrowserbaseEndpointInputs,
	BrowserbaseEndpointOutputs,
} from './endpoints/types';
import {
	BrowserbaseEndpointInputSchemas,
	BrowserbaseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrowserbaseSchema } from './schema';

export type BrowserbasePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBrowserbasePlugin['hooks'];
	webhookHooks?: InternalBrowserbasePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browserbaseEndpointsNested>;
};

export type BrowserbaseContext = CorsairPluginContext<
	typeof BrowserbaseSchema,
	BrowserbasePluginOptions
>;

export type BrowserbaseKeyBuilderContext =
	KeyBuilderContext<BrowserbasePluginOptions>;

export type BrowserbaseBoundEndpoints = BindEndpoints<
	typeof browserbaseEndpointsNested
>;

type BrowserbaseEndpoint<K extends keyof BrowserbaseEndpointOutputs> =
	CorsairEndpoint<
		BrowserbaseContext,
		BrowserbaseEndpointInputs[K],
		BrowserbaseEndpointOutputs[K]
	>;

export type BrowserbaseEndpoints = {
	sessionsCreate: BrowserbaseEndpoint<'sessionsCreate'>;
	sessionsList: BrowserbaseEndpoint<'sessionsList'>;
	sessionsGet: BrowserbaseEndpoint<'sessionsGet'>;
};

const browserbaseEndpointsNested = {
	sessions: {
		create: Sessions.create,
		list: Sessions.list,
		get: Sessions.get,
	},
} as const;

export const browserbaseEndpointSchemas = {
	'sessions.create': {
		input: BrowserbaseEndpointInputSchemas.sessionsCreate,
		output: BrowserbaseEndpointOutputSchemas.sessionsCreate,
	},
	'sessions.list': {
		input: BrowserbaseEndpointInputSchemas.sessionsList,
		output: BrowserbaseEndpointOutputSchemas.sessionsList,
	},
	'sessions.get': {
		input: BrowserbaseEndpointInputSchemas.sessionsGet,
		output: BrowserbaseEndpointOutputSchemas.sessionsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof browserbaseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

export const browserbaseAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

const browserbaseEndpointMeta = {
	'sessions.create': {
		riskLevel: 'write',
		description: 'Create a Browserbase browser session',
	},
	'sessions.list': {
		riskLevel: 'read',
		description: 'List Browserbase browser sessions',
	},
	'sessions.get': {
		riskLevel: 'read',
		description: 'Get a Browserbase browser session',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof browserbaseEndpointsNested
>;

export type BaseBrowserbasePlugin<T extends BrowserbasePluginOptions> =
	CorsairPlugin<
		'browserbase',
		typeof BrowserbaseSchema,
		typeof browserbaseEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalBrowserbasePlugin =
	BaseBrowserbasePlugin<BrowserbasePluginOptions>;

export type ExternalBrowserbasePlugin<T extends BrowserbasePluginOptions> =
	BaseBrowserbasePlugin<T>;

export function browserbase<const T extends BrowserbasePluginOptions>(
	incomingOptions: BrowserbasePluginOptions &
		T = {} as BrowserbasePluginOptions & T,
): ExternalBrowserbasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'browserbase',
		authConfig: browserbaseAuthConfig,
		schema: BrowserbaseSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: browserbaseEndpointsNested,
		webhooks: {},
		endpointMeta: browserbaseEndpointMeta,
		endpointSchemas: browserbaseEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BrowserbaseKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBrowserbasePlugin;
}

export type {
	BrowserbaseEndpointInputs,
	BrowserbaseEndpointOutputs,
	SessionsCreateInput,
	SessionsCreateResponse,
	SessionsGetInput,
	SessionsGetResponse,
	SessionsListInput,
	SessionsListResponse,
} from './endpoints/types';
