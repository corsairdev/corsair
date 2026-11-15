import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { SearchApiContext } from './context';
import {
	getAccount,
	getSearch,
	getSearchHtml,
	listLocations,
	runSearch,
} from './endpoints';
import {
	AccountResponseSchema,
	EmptyInputSchema,
	HtmlResponseSchema,
	IdInputSchema,
	LocationInputSchema,
	LocationListResponseSchema,
	SearchInputSchema,
	SearchResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SearchApiSchema } from './schema';

export type { SearchApiContext };

export type SearchApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSearchApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof searchapiEndpointsNested>;
};

export type SearchApiKeyBuilderContext =
	KeyBuilderContext<SearchApiPluginOptions>;

const searchapiEndpointsNested = {
	account: { get: getAccount },
	locations: { list: listLocations },
	searches: { run: runSearch, get: getSearch, html: getSearchHtml },
} as const;

const searchapiWebhooksNested = {} as const;

export const searchapiEndpointSchemas = {
	'account.get': { input: EmptyInputSchema, output: AccountResponseSchema },
	'locations.list': {
		input: LocationInputSchema,
		output: LocationListResponseSchema,
	},
	'searches.run': { input: SearchInputSchema, output: SearchResponseSchema },
	'searches.get': { input: IdInputSchema, output: SearchResponseSchema },
	'searches.html': { input: IdInputSchema, output: HtmlResponseSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof searchapiEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const searchapiEndpointMeta = {
	'account.get': read('Read account usage and the hourly limit.'),
	'locations.list': read('Look up Google locations by name.'),
	'searches.run': {
		riskLevel: 'write',
		description: 'Run a search. This spends a credit. Results are not stored.',
	},
	'searches.get': read(
		'Read a cached search by id. Result rows are not stored.',
	),
	'searches.html': read(
		'Read cached search HTML by id. The HTML is not stored.',
	),
} as const satisfies RequiredPluginEndpointMeta<
	typeof searchapiEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const searchapiAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseSearchApiPlugin<T extends SearchApiPluginOptions> =
	CorsairPlugin<
		'searchapi',
		typeof SearchApiSchema,
		typeof searchapiEndpointsNested,
		typeof searchapiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalSearchApiPlugin =
	BaseSearchApiPlugin<SearchApiPluginOptions>;
export type ExternalSearchApiPlugin<T extends SearchApiPluginOptions> =
	BaseSearchApiPlugin<T>;

export function searchapi<const T extends SearchApiPluginOptions>(
	incomingOptions: SearchApiPluginOptions & T = {} as SearchApiPluginOptions &
		T,
): ExternalSearchApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'searchapi',
		authConfig: searchapiAuthConfig,
		schema: SearchApiSchema,
		options,
		hooks: options.hooks,
		endpoints: searchapiEndpointsNested,
		webhooks: searchapiWebhooksNested,
		endpointMeta: searchapiEndpointMeta,
		endpointSchemas: searchapiEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: SearchApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalSearchApiPlugin;
}
