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
import type { SerplyContext } from './context';
import { searchArticles, searchImages, searchPlaces } from './endpoints';
import {
	ArticleResponseSchema,
	ImageInputSchema,
	ImageResponseSchema,
	PlaceResponseSchema,
	QueryInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SerplySchema } from './schema';

export type { SerplyContext };

export type SerplyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSerplyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof serplyEndpointsNested>;
};

export type SerplyKeyBuilderContext = KeyBuilderContext<SerplyPluginOptions>;

const serplyEndpointsNested = {
	images: { search: searchImages },
	places: { search: searchPlaces },
	articles: { search: searchArticles },
} as const;

const serplyWebhooksNested = {} as const;

export const serplyEndpointSchemas = {
	'images.search': { input: ImageInputSchema, output: ImageResponseSchema },
	'places.search': { input: QueryInputSchema, output: PlaceResponseSchema },
	'articles.search': { input: QueryInputSchema, output: ArticleResponseSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof serplyEndpointsNested
>;

const serplyEndpointMeta = {
	'images.search': {
		riskLevel: 'write',
		description:
			'Search Google images. An uncached success spends one Serply credit.',
	},
	'places.search': {
		riskLevel: 'write',
		description:
			'Search Google maps. An uncached success spends one Serply credit.',
	},
	'articles.search': {
		riskLevel: 'write',
		description:
			'Search Google Scholar. An uncached success spends one Serply credit.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof serplyEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const serplyAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseSerplyPlugin<T extends SerplyPluginOptions> = CorsairPlugin<
	'serply',
	typeof SerplySchema,
	typeof serplyEndpointsNested,
	typeof serplyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSerplyPlugin = BaseSerplyPlugin<SerplyPluginOptions>;
export type ExternalSerplyPlugin<T extends SerplyPluginOptions> =
	BaseSerplyPlugin<T>;

export function serply<const T extends SerplyPluginOptions>(
	incomingOptions: SerplyPluginOptions & T = {} as SerplyPluginOptions & T,
): ExternalSerplyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'serply',
		authConfig: serplyAuthConfig,
		schema: SerplySchema,
		options,
		hooks: options.hooks,
		endpoints: serplyEndpointsNested,
		webhooks: serplyWebhooksNested,
		endpointMeta: serplyEndpointMeta,
		endpointSchemas: serplyEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: SerplyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalSerplyPlugin;
}
