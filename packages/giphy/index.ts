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
import { Categories, Emoji, Gifs, Stickers } from './endpoints';
import type {
	GiphyEndpointInputs,
	GiphyEndpointOutputs,
} from './endpoints/types';
import {
	GiphyEndpointInputSchemas,
	GiphyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GiphySchema } from './schema';

export type GiphyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGiphyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof giphyEndpointsNested>;
};

export type GiphyContext = CorsairPluginContext<
	typeof GiphySchema,
	GiphyPluginOptions,
	undefined,
	typeof giphyAuthConfig
>;

export type GiphyKeyBuilderContext = KeyBuilderContext<
	GiphyPluginOptions,
	typeof giphyAuthConfig
>;

export type GiphyBoundEndpoints = BindEndpoints<typeof giphyEndpointsNested>;

type GiphyEndpoint<K extends keyof GiphyEndpointOutputs> = CorsairEndpoint<
	GiphyContext,
	GiphyEndpointInputs[K],
	GiphyEndpointOutputs[K]
>;

export type GiphyEndpoints = {
	gifsSearch: GiphyEndpoint<'gifsSearch'>;
	gifsTrending: GiphyEndpoint<'gifsTrending'>;
	gifsTranslate: GiphyEndpoint<'gifsTranslate'>;
	gifsRandom: GiphyEndpoint<'gifsRandom'>;
	gifsGetById: GiphyEndpoint<'gifsGetById'>;
	gifsGetByIds: GiphyEndpoint<'gifsGetByIds'>;
	stickersSearch: GiphyEndpoint<'stickersSearch'>;
	stickersTrending: GiphyEndpoint<'stickersTrending'>;
	stickersTranslate: GiphyEndpoint<'stickersTranslate'>;
	stickersRandom: GiphyEndpoint<'stickersRandom'>;
	emojiGet: GiphyEndpoint<'emojiGet'>;
	emojiVariations: GiphyEndpoint<'emojiVariations'>;
	categoriesList: GiphyEndpoint<'categoriesList'>;
};

const giphyEndpointsNested = {
	gifs: {
		search: Gifs.search,
		trending: Gifs.trending,
		translate: Gifs.translate,
		random: Gifs.random,
		getById: Gifs.getById,
		getByIds: Gifs.getByIds,
	},
	stickers: {
		search: Stickers.search,
		trending: Stickers.trending,
		translate: Stickers.translate,
		random: Stickers.random,
	},
	emoji: {
		get: Emoji.get,
		variations: Emoji.variations,
	},
	categories: {
		list: Categories.list,
	},
} as const;

const giphyWebhooksNested = {} as const;

export const giphyEndpointSchemas = {
	'gifs.search': {
		input: GiphyEndpointInputSchemas.gifsSearch,
		output: GiphyEndpointOutputSchemas.gifsSearch,
	},
	'gifs.trending': {
		input: GiphyEndpointInputSchemas.gifsTrending,
		output: GiphyEndpointOutputSchemas.gifsTrending,
	},
	'gifs.translate': {
		input: GiphyEndpointInputSchemas.gifsTranslate,
		output: GiphyEndpointOutputSchemas.gifsTranslate,
	},
	'gifs.random': {
		input: GiphyEndpointInputSchemas.gifsRandom,
		output: GiphyEndpointOutputSchemas.gifsRandom,
	},
	'gifs.getById': {
		input: GiphyEndpointInputSchemas.gifsGetById,
		output: GiphyEndpointOutputSchemas.gifsGetById,
	},
	'gifs.getByIds': {
		input: GiphyEndpointInputSchemas.gifsGetByIds,
		output: GiphyEndpointOutputSchemas.gifsGetByIds,
	},
	'stickers.search': {
		input: GiphyEndpointInputSchemas.stickersSearch,
		output: GiphyEndpointOutputSchemas.stickersSearch,
	},
	'stickers.trending': {
		input: GiphyEndpointInputSchemas.stickersTrending,
		output: GiphyEndpointOutputSchemas.stickersTrending,
	},
	'stickers.translate': {
		input: GiphyEndpointInputSchemas.stickersTranslate,
		output: GiphyEndpointOutputSchemas.stickersTranslate,
	},
	'stickers.random': {
		input: GiphyEndpointInputSchemas.stickersRandom,
		output: GiphyEndpointOutputSchemas.stickersRandom,
	},
	'emoji.get': {
		input: GiphyEndpointInputSchemas.emojiGet,
		output: GiphyEndpointOutputSchemas.emojiGet,
	},
	'emoji.variations': {
		input: GiphyEndpointInputSchemas.emojiVariations,
		output: GiphyEndpointOutputSchemas.emojiVariations,
	},
	'categories.list': {
		input: GiphyEndpointInputSchemas.categoriesList,
		output: GiphyEndpointOutputSchemas.categoriesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof giphyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const giphyEndpointMeta = {
	'gifs.search': {
		riskLevel: 'read',
		description: 'Search all GIPHY GIFs for a word or phrase',
	},
	'gifs.trending': {
		riskLevel: 'read',
		description: 'Fetch currently trending GIFs from GIPHY',
	},
	'gifs.translate': {
		riskLevel: 'read',
		description:
			'Translate a word or phrase into a GIF using GIPHY translate endpoint',
	},
	'gifs.random': {
		riskLevel: 'read',
		description: 'Fetch a random GIF from GIPHY optionally filtered by tag',
	},
	'gifs.getById': {
		riskLevel: 'read',
		description: 'Get details and renditions of a specific GIF by ID',
	},
	'gifs.getByIds': {
		riskLevel: 'read',
		description: 'Get details and renditions for multiple GIFs by their IDs',
	},
	'stickers.search': {
		riskLevel: 'read',
		description: 'Search GIPHY animated stickers for a word or phrase',
	},
	'stickers.trending': {
		riskLevel: 'read',
		description: 'Fetch currently trending stickers from GIPHY',
	},
	'stickers.translate': {
		riskLevel: 'read',
		description: 'Translate a word or phrase into a sticker',
	},
	'stickers.random': {
		riskLevel: 'read',
		description: 'Fetch a random sticker from GIPHY optionally filtered by tag',
	},
	'emoji.get': {
		riskLevel: 'read',
		description: 'Fetch animated emojis from GIPHY',
	},
	'emoji.variations': {
		riskLevel: 'read',
		description: 'Get variations of a specific GIPHY emoji by ID',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List all categories and subcategories on GIPHY',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof giphyEndpointsNested>;

export const giphyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGiphyPlugin<T extends GiphyPluginOptions> = CorsairPlugin<
	'giphy',
	typeof GiphySchema,
	typeof giphyEndpointsNested,
	typeof giphyWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof giphyAuthConfig
>;

export type InternalGiphyPlugin = BaseGiphyPlugin<GiphyPluginOptions>;

export type ExternalGiphyPlugin<T extends GiphyPluginOptions> =
	BaseGiphyPlugin<T>;

export function giphy<const T extends GiphyPluginOptions>(
	incomingOptions: GiphyPluginOptions & T = {} as GiphyPluginOptions & T,
): ExternalGiphyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'giphy',
		authConfig: giphyAuthConfig,
		schema: GiphySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: giphyEndpointsNested,
		webhooks: giphyWebhooksNested,
		endpointMeta: giphyEndpointMeta,
		endpointSchemas: giphyEndpointSchemas,
		webhookSchemas: {} as const,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GiphyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				try {
					const res = await ctx.keys?.get_api_key();
					return res ?? '';
				} catch {
					return '';
				}
			}

			return '';
		},
	} satisfies InternalGiphyPlugin;
}

export type {
	CategoriesListInput,
	EmojiGetInput,
	EmojiVariationsInput,
	GifsGetByIdInput,
	GifsGetByIdsInput,
	GifsRandomInput,
	GifsSearchInput,
	GifsTranslateInput,
	GifsTrendingInput,
	GiphyCategoriesResponse,
	GiphyEndpointInputs,
	GiphyEndpointOutputs,
	GiphyGif,
	GiphyImageRendition,
	GiphyListResponse,
	GiphySingleResponse,
	GiphyUser,
	StickersRandomInput,
	StickersSearchInput,
	StickersTranslateInput,
	StickersTrendingInput,
} from './endpoints/types';

export {
	CategoriesListInputSchema,
	EmojiGetInputSchema,
	EmojiVariationsInputSchema,
	GifsGetByIdInputSchema,
	GifsGetByIdsInputSchema,
	GifsRandomInputSchema,
	GifsSearchInputSchema,
	GifsTranslateInputSchema,
	GifsTrendingInputSchema,
	GiphyCategoriesResponseSchema,
	GiphyCategoryItemSchema,
	GiphyCategorySubcategorySchema,
	GiphyEndpointInputSchemas,
	GiphyEndpointOutputSchemas,
	GiphyGifSchema,
	GiphyImageRenditionSchema,
	GiphyListResponseSchema,
	GiphyMetaSchema,
	GiphyPaginationSchema,
	GiphySingleResponseSchema,
	GiphyUserSchema,
	StickersRandomInputSchema,
	StickersSearchInputSchema,
	StickersTranslateInputSchema,
	StickersTrendingInputSchema,
} from './endpoints/types';
