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
import { Items, Taxonomy } from './endpoints';
import type {
	KontentEndpointInputs,
	KontentEndpointOutputs,
} from './endpoints/types';
import {
	KontentEndpointInputSchemas,
	KontentEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KontentaiSchema } from './schema';

export type KontentPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The environment ID, a GUID such as `975bf280-fd91-488c-994c-2f04416e5ee3`.
	 * It is both the path prefix of every call and the only credential a
	 * published read needs.
	 */
	key?: string;
	hooks?: InternalKontentPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kontentaiEndpointsNested>;
};

/**
 * The account's `api_key` is the environment ID. `delivery_api_key` is optional:
 * a Delivery API key for preview reads and secure-access environments. It is
 * stored with the account, encrypted, so it never travels in a call's
 * arguments, where approval records and logs would keep it.
 */
export const kontentaiAuthConfig = {
	api_key: {
		account: ['delivery_api_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KontentContext = CorsairPluginContext<
	typeof KontentaiSchema,
	KontentPluginOptions,
	undefined,
	typeof kontentaiAuthConfig
>;

export type KontentKeyBuilderContext = KeyBuilderContext<
	KontentPluginOptions,
	typeof kontentaiAuthConfig
>;

export type KontentBoundEndpoints = BindEndpoints<
	typeof kontentaiEndpointsNested
>;

type KontentEndpoint<K extends keyof KontentEndpointOutputs> = CorsairEndpoint<
	KontentContext,
	KontentEndpointInputs[K],
	KontentEndpointOutputs[K]
>;

export type KontentEndpoints = {
	itemsList: KontentEndpoint<'itemsList'>;
	itemsGet: KontentEndpoint<'itemsGet'>;
	typesList: KontentEndpoint<'typesList'>;
	typesGet: KontentEndpoint<'typesGet'>;
	taxonomiesList: KontentEndpoint<'taxonomiesList'>;
	languagesList: KontentEndpoint<'languagesList'>;
};

const kontentaiEndpointsNested = {
	items: {
		list: Items.list,
		get: Items.get,
	},
	types: {
		list: Taxonomy.list,
		get: Taxonomy.get,
	},
	taxonomies: {
		list: Taxonomy.taxonomies,
	},
	languages: {
		list: Taxonomy.languages,
	},
} as const;

export const kontentaiEndpointSchemas = {
	'items.list': {
		input: KontentEndpointInputSchemas.itemsList,
		output: KontentEndpointOutputSchemas.itemsList,
	},
	'items.get': {
		input: KontentEndpointInputSchemas.itemsGet,
		output: KontentEndpointOutputSchemas.itemsGet,
	},
	'types.list': {
		input: KontentEndpointInputSchemas.typesList,
		output: KontentEndpointOutputSchemas.typesList,
	},
	'types.get': {
		input: KontentEndpointInputSchemas.typesGet,
		output: KontentEndpointOutputSchemas.typesGet,
	},
	'taxonomies.list': {
		input: KontentEndpointInputSchemas.taxonomiesList,
		output: KontentEndpointOutputSchemas.taxonomiesList,
	},
	'languages.list': {
		input: KontentEndpointInputSchemas.languagesList,
		output: KontentEndpointOutputSchemas.languagesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof kontentaiEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const kontentEndpointMeta = {
	'items.list': {
		riskLevel: 'read',
		description:
			'Published content items by type, language, collection or filter, with `depth` deciding how far linked items resolve; `next_skip` gives the next page',
	},
	'items.get': {
		riskLevel: 'read',
		description:
			'One content item by codename, with its elements and, on request, its linked items',
	},
	'types.list': {
		riskLevel: 'read',
		description:
			'The content types, each with the element definitions an item of that type carries',
	},
	'types.get': {
		riskLevel: 'read',
		description: 'One content type by codename, with its element definitions',
	},
	'taxonomies.list': {
		riskLevel: 'read',
		description:
			'The taxonomy groups with their nested terms, which an item’s taxonomy element points at',
	},
	'languages.list': {
		riskLevel: 'read',
		description:
			'The environment’s languages, each with the codename to read content in',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof kontentaiEndpointsNested
>;

export type BaseKontentPlugin<T extends KontentPluginOptions> = CorsairPlugin<
	'kontentai',
	typeof KontentaiSchema,
	typeof kontentaiEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof kontentaiAuthConfig
>;

export type InternalKontentPlugin = BaseKontentPlugin<KontentPluginOptions>;

export type ExternalKontentPlugin<T extends KontentPluginOptions> =
	BaseKontentPlugin<T>;

export function kontentai<const T extends KontentPluginOptions>(
	incomingOptions: KontentPluginOptions & T = {} as KontentPluginOptions & T,
): ExternalKontentPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kontentai',
		schema: KontentaiSchema,
		options,
		hooks: options.hooks,
		endpoints: kontentaiEndpointsNested,
		webhooks: {},
		endpointMeta: kontentEndpointMeta,
		endpointSchemas: kontentaiEndpointSchemas,
		authConfig: kontentaiAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KontentKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('kontentai', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKontentPlugin;
}

export { KontentAPIError, kontentErrorFields } from './client';

export type {
	ItemGetInput,
	ItemGetResponse,
	ItemsListInput,
	ItemsListResponse,
	KontentElement,
	KontentItem,
	KontentItemSystem,
	KontentLanguage,
	KontentPagination,
	KontentTaxonomy,
	KontentType,
	LanguagesListInput,
	LanguagesListResponse,
	TaxonomiesListInput,
	TaxonomiesListResponse,
	TypeGetInput,
	TypeGetResponse,
	TypesListInput,
	TypesListResponse,
} from './endpoints/types';
