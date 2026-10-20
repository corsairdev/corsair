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
import { Fetch, Search } from './endpoints';
import type {
	KeenableEndpointInputs,
	KeenableEndpointOutputs,
} from './endpoints/types';
import {
	KeenableEndpointInputSchemas,
	KeenableEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KeenableSchema } from './schema';

export type KeenablePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalKeenablePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof keenableEndpointsNested>;
};

export type KeenableContext = CorsairPluginContext<
	typeof KeenableSchema,
	KeenablePluginOptions
>;

export type KeenableKeyBuilderContext =
	KeyBuilderContext<KeenablePluginOptions>;

export type KeenableBoundEndpoints = BindEndpoints<
	typeof keenableEndpointsNested
>;

type KeenableEndpoint<K extends keyof KeenableEndpointOutputs> =
	CorsairEndpoint<
		KeenableContext,
		KeenableEndpointInputs[K],
		KeenableEndpointOutputs[K]
	>;

export type KeenableEndpoints = {
	search: KeenableEndpoint<'search'>;
	fetch: KeenableEndpoint<'fetch'>;
};

const keenableEndpointsNested = {
	search: {
		post: Search.post,
	},
	fetch: {
		get: Fetch.get,
	},
} as const;

export const keenableEndpointSchemas = {
	'search.post': {
		input: KeenableEndpointInputSchemas.search,
		output: KeenableEndpointOutputSchemas.search,
	},
	'fetch.get': {
		input: KeenableEndpointInputSchemas.fetch,
		output: KeenableEndpointOutputSchemas.fetch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof keenableEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const keenableEndpointMeta = {
	'search.post': {
		riskLevel: 'read',
		description:
			'Search the web and return ranked results (realtime or pro mode)',
	},
	'fetch.get': {
		riskLevel: 'read',
		description:
			'Fetch a page as markdown by URL, optionally extracting with a prompt',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof keenableEndpointsNested>;

export const keenableAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseKeenablePlugin<T extends KeenablePluginOptions> = CorsairPlugin<
	'keenable',
	typeof KeenableSchema,
	typeof keenableEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalKeenablePlugin = BaseKeenablePlugin<KeenablePluginOptions>;

export type ExternalKeenablePlugin<T extends KeenablePluginOptions> =
	BaseKeenablePlugin<T>;

export function keenable<const T extends KeenablePluginOptions>(
	incomingOptions: KeenablePluginOptions & T = {} as KeenablePluginOptions & T,
): ExternalKeenablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'keenable',
		authConfig: keenableAuthConfig,
		schema: KeenableSchema,
		options,
		hooks: options.hooks,
		endpoints: keenableEndpointsNested,
		// Keenable is request/response only: no webhook surface is documented
		// (no webhooks page in llms.txt, no webhook mentions in the docs).
		webhooks: {},
		endpointMeta: keenableEndpointMeta,
		endpointSchemas: keenableEndpointSchemas,
		errorHandlers: (() => {
			// Core selects the first handler whose matcher accepts the error
			// (`Object.keys(...).find`), and DEFAULT matches everything, so
			// DEFAULT must always be evaluated last - otherwise it shadows any
			// custom handler a caller contributes through options. The caller's
			// DEFAULT is destructured out as well: spreading it in place would
			// keep its original key position, ahead of their other handlers.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		// When no key is configured, throw AuthMissingError so Corsair's
		// connect-link layer can generate an onboarding connect link for the
		// tenant. The missing-DEK case resolves to "no stored key" via
		// tryGetStoredKey; other key-manager failures still propagate.
		keyBuilder: async (ctx: KeenableKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('keenable', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalKeenablePlugin;
}

export type {
	FetchInput,
	FetchResponse,
	KeenableEndpointInputs,
	KeenableEndpointOutputs,
	SearchInput,
	SearchResponse,
	SearchResult,
} from './endpoints/types';
