import type {
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
import { Cache } from './endpoints';
import type {
	PrerenderEndpointInputs,
	PrerenderEndpointOutputs,
} from './endpoints/types';
import {
	PrerenderEndpointInputSchemas,
	PrerenderEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PrerenderSchema } from './schema';

export const prerenderAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type PrerenderPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Prerender token. Overrides the stored `api_key`. */
	key?: string;
	hooks?: InternalPrerenderPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof prerenderEndpointsNested>;
};

export type PrerenderContext = CorsairPluginContext<
	typeof PrerenderSchema,
	PrerenderPluginOptions,
	undefined,
	typeof prerenderAuthConfig
>;

export type PrerenderKeyBuilderContext = KeyBuilderContext<
	PrerenderPluginOptions,
	typeof prerenderAuthConfig
>;

export type PrerenderBoundEndpoints = BindEndpoints<
	typeof prerenderEndpointsNested
>;

type PrerenderEndpoint<K extends keyof PrerenderEndpointOutputs> =
	CorsairEndpoint<
		PrerenderContext,
		PrerenderEndpointInputs[K],
		PrerenderEndpointOutputs[K]
	>;

export type PrerenderEndpoints = {
	cacheRecache: PrerenderEndpoint<'recache'>;
	cacheSearch: PrerenderEndpoint<'search'>;
	cacheSitemap: PrerenderEndpoint<'sitemap'>;
	cacheClear: PrerenderEndpoint<'cacheClear'>;
	cacheClearStatus: PrerenderEndpoint<'cacheClearStatus'>;
	queueChangeSpeed: PrerenderEndpoint<'changeSpeed'>;
};

const prerenderEndpointsNested = {
	cache: {
		recache: Cache.recache,
		search: Cache.search,
		sitemap: Cache.sitemap,
		clear: Cache.cacheClear,
		clearStatus: Cache.cacheClearStatus,
	},
	queue: {
		changeSpeed: Cache.changeSpeed,
	},
} as const;

export const prerenderEndpointSchemas = {
	'cache.recache': {
		input: PrerenderEndpointInputSchemas.recache,
		output: PrerenderEndpointOutputSchemas.recache,
	},
	'cache.search': {
		input: PrerenderEndpointInputSchemas.search,
		output: PrerenderEndpointOutputSchemas.search,
	},
	'cache.sitemap': {
		input: PrerenderEndpointInputSchemas.sitemap,
		output: PrerenderEndpointOutputSchemas.sitemap,
	},
	'cache.clear': {
		input: PrerenderEndpointInputSchemas.cacheClear,
		output: PrerenderEndpointOutputSchemas.cacheClear,
	},
	'cache.clearStatus': {
		input: PrerenderEndpointInputSchemas.cacheClearStatus,
		output: PrerenderEndpointOutputSchemas.cacheClearStatus,
	},
	'queue.changeSpeed': {
		input: PrerenderEndpointInputSchemas.changeSpeed,
		output: PrerenderEndpointOutputSchemas.changeSpeed,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof prerenderEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const prerenderEndpointMeta = {
	'cache.recache': {
		riskLevel: 'destructive',
		description:
			'Render and cache one URL, or up to 1000 in one call, so crawlers see current content. Each URL spends one render from the plan, billed past the included amount',
	},
	'cache.search': {
		riskLevel: 'read',
		description:
			'Search the cache by substring or exact URL, or list all of it, 200 results per page, optionally filtered by device',
	},
	'cache.sitemap': {
		riskLevel: 'destructive',
		description:
			'Render and cache every URL in a sitemap that is not cached yet, spending one render per new URL. URLs already cached are left as they are',
	},
	'cache.clear': {
		riskLevel: 'destructive',
		description:
			'Delete cached URLs matching a pattern. The clear runs as a job, and only one runs at a time',
	},
	'cache.clearStatus': {
		riskLevel: 'read',
		description:
			'Read whether a cache clear job is still running: inProgress is true while one runs',
	},
	'queue.changeSpeed': {
		riskLevel: 'write',
		description:
			'Set how many URLs the render queue processes per hour, or restore the automatic delay. A faster rate can overload the origin',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof prerenderEndpointsNested
>;

export type BasePrerenderPlugin<T extends PrerenderPluginOptions> =
	CorsairPlugin<
		'prerender',
		typeof PrerenderSchema,
		typeof prerenderEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof prerenderAuthConfig
	>;

export type InternalPrerenderPlugin =
	BasePrerenderPlugin<PrerenderPluginOptions>;

export type ExternalPrerenderPlugin<T extends PrerenderPluginOptions> =
	BasePrerenderPlugin<T>;

export function prerender<const T extends PrerenderPluginOptions>(
	incomingOptions: PrerenderPluginOptions & T = {} as PrerenderPluginOptions &
		T,
): ExternalPrerenderPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'prerender',
		authConfig: prerenderAuthConfig,
		schema: PrerenderSchema,
		options,
		hooks: options.hooks,
		endpoints: prerenderEndpointsNested,
		webhooks: {},
		endpointMeta: prerenderEndpointMeta,
		endpointSchemas: prerenderEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PrerenderKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('prerender', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPrerenderPlugin;
}

export { PrerenderAPIError } from './client';
export type {
	CacheClearInput,
	CacheClearOutput,
	CacheClearStatusInput,
	CacheClearStatusOutput,
	ChangeSpeedInput,
	ChangeSpeedOutput,
	PrerenderCachedUrl,
	PrerenderConfirmation,
	PrerenderEndpointInputs,
	PrerenderEndpointOutputs,
	PrerenderRecacheMetrics,
	RecacheInput,
	SearchInput,
	SearchOutput,
	SitemapInput,
} from './endpoints/types';
