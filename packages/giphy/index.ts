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
	Analytics,
	Categories,
	Channels,
	Emoji,
	Gifs,
	RandomId,
	Stickers,
	Tags,
} from './endpoints';
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
	gifsUpload: GiphyEndpoint<'gifsUpload'>;
	stickersSearch: GiphyEndpoint<'stickersSearch'>;
	stickersTrending: GiphyEndpoint<'stickersTrending'>;
	stickersTranslate: GiphyEndpoint<'stickersTranslate'>;
	stickersRandom: GiphyEndpoint<'stickersRandom'>;
	emojiGet: GiphyEndpoint<'emojiGet'>;
	emojiVariations: GiphyEndpoint<'emojiVariations'>;
	categoriesList: GiphyEndpoint<'categoriesList'>;
	categoriesGetById: GiphyEndpoint<'categoriesGetById'>;
	categoriesGifs: GiphyEndpoint<'categoriesGifs'>;
	tagsAutocomplete: GiphyEndpoint<'tagsAutocomplete'>;
	tagsTrending: GiphyEndpoint<'tagsTrending'>;
	tagsRelated: GiphyEndpoint<'tagsRelated'>;
	channelsSearch: GiphyEndpoint<'channelsSearch'>;
	randomIdGet: GiphyEndpoint<'randomIdGet'>;
	analyticsRegister: GiphyEndpoint<'analyticsRegister'>;
};

const giphyEndpointsNested = {
	gifs: {
		search: Gifs.search,
		trending: Gifs.trending,
		translate: Gifs.translate,
		random: Gifs.random,
		getById: Gifs.getById,
		getByIds: Gifs.getByIds,
		upload: Gifs.upload,
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
		getById: Categories.getById,
		gifs: Categories.gifs,
	},
	tags: {
		autocomplete: Tags.autocomplete,
		trending: Tags.trending,
		related: Tags.related,
	},
	channels: {
		search: Channels.search,
	},
	randomId: {
		get: RandomId.get,
	},
	analytics: {
		register: Analytics.register,
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
	'gifs.upload': {
		input: GiphyEndpointInputSchemas.gifsUpload,
		output: GiphyEndpointOutputSchemas.gifsUpload,
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
	'categories.getById': {
		input: GiphyEndpointInputSchemas.categoriesGetById,
		output: GiphyEndpointOutputSchemas.categoriesGetById,
	},
	'categories.gifs': {
		input: GiphyEndpointInputSchemas.categoriesGifs,
		output: GiphyEndpointOutputSchemas.categoriesGifs,
	},
	'tags.autocomplete': {
		input: GiphyEndpointInputSchemas.tagsAutocomplete,
		output: GiphyEndpointOutputSchemas.tagsAutocomplete,
	},
	'tags.trending': {
		input: GiphyEndpointInputSchemas.tagsTrending,
		output: GiphyEndpointOutputSchemas.tagsTrending,
	},
	'tags.related': {
		input: GiphyEndpointInputSchemas.tagsRelated,
		output: GiphyEndpointOutputSchemas.tagsRelated,
	},
	'channels.search': {
		input: GiphyEndpointInputSchemas.channelsSearch,
		output: GiphyEndpointOutputSchemas.channelsSearch,
	},
	'randomId.get': {
		input: GiphyEndpointInputSchemas.randomIdGet,
		output: GiphyEndpointOutputSchemas.randomIdGet,
	},
	'analytics.register': {
		input: GiphyEndpointInputSchemas.analyticsRegister,
		output: GiphyEndpointOutputSchemas.analyticsRegister,
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
	'gifs.upload': {
		riskLevel: 'write',
		description:
			'Upload an animated GIF or video to GIPHY from a file or a public URL',
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
	'categories.getById': {
		riskLevel: 'read',
		description: 'Get subcategories of a specific GIPHY category by ID',
	},
	'categories.gifs': {
		riskLevel: 'read',
		description: 'Fetch GIFs associated with a specific GIPHY category',
	},
	'tags.autocomplete': {
		riskLevel: 'read',
		description: 'Autocomplete a tag term on the GIPHY network',
	},
	'tags.trending': {
		riskLevel: 'read',
		description: 'List the most popular trending search terms on GIPHY',
	},
	'tags.related': {
		riskLevel: 'read',
		description: 'List tag terms related to the given tag on GIPHY',
	},
	'channels.search': {
		riskLevel: 'read',
		description: 'Search GIPHY channels matching a query term',
	},
	'randomId.get': {
		riskLevel: 'read',
		description:
			'Generate a privacy-safe random ID to use as customer_id on other endpoints',
	},
	'analytics.register': {
		riskLevel: 'write',
		description:
			'Register a GIF view, click, or send via its analytics pingback URL',
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
	AnalyticsRegisterInput,
	CategoriesGetByIdInput,
	CategoriesGifsInput,
	CategoriesListInput,
	ChannelsSearchInput,
	EmojiGetInput,
	EmojiVariationsInput,
	GifsGetByIdInput,
	GifsGetByIdsInput,
	GifsRandomInput,
	GifsSearchInput,
	GifsTranslateInput,
	GifsTrendingInput,
	GifsUploadInput,
	GiphyAnalyticsRegisterResponse,
	GiphyCategoriesResponse,
	GiphyChannel,
	GiphyChannelsResponse,
	GiphyEndpointInputs,
	GiphyEndpointOutputs,
	GiphyGif,
	GiphyImageRendition,
	GiphyListResponse,
	GiphyRandomIdResponse,
	GiphySingleResponse,
	GiphyTerm,
	GiphyTermsResponse,
	GiphyTrendingSearchesResponse,
	GiphyUploadResponse,
	GiphyUser,
	RandomIdGetInput,
	StickersRandomInput,
	StickersSearchInput,
	StickersTranslateInput,
	StickersTrendingInput,
	TagsAutocompleteInput,
	TagsRelatedInput,
	TagsTrendingInput,
} from './endpoints/types';

export {
	AnalyticsRegisterInputSchema,
	CategoriesGetByIdInputSchema,
	CategoriesGifsInputSchema,
	CategoriesListInputSchema,
	ChannelsSearchInputSchema,
	EmojiGetInputSchema,
	EmojiVariationsInputSchema,
	GifsGetByIdInputSchema,
	GifsGetByIdsInputSchema,
	GifsRandomInputSchema,
	GifsSearchInputSchema,
	GifsTranslateInputSchema,
	GifsTrendingInputSchema,
	GifsUploadInputSchema,
	GiphyAnalyticsRegisterResponseSchema,
	GiphyCategoriesResponseSchema,
	GiphyCategoryItemSchema,
	GiphyCategorySubcategorySchema,
	GiphyChannelSchema,
	GiphyChannelsResponseSchema,
	GiphyEndpointInputSchemas,
	GiphyEndpointOutputSchemas,
	GiphyGifSchema,
	GiphyImageRenditionSchema,
	GiphyListResponseSchema,
	GiphyMetaSchema,
	GiphyPaginationSchema,
	GiphyRandomIdResponseSchema,
	GiphyRatingSchema,
	GiphySingleResponseSchema,
	GiphyTermSchema,
	GiphyTermsResponseSchema,
	GiphyTrendingSearchesResponseSchema,
	GiphyUploadResponseSchema,
	GiphyUserSchema,
	RandomIdGetInputSchema,
	StickersRandomInputSchema,
	StickersSearchInputSchema,
	StickersTranslateInputSchema,
	StickersTrendingInputSchema,
	TagsAutocompleteInputSchema,
	TagsRelatedInputSchema,
	TagsTrendingInputSchema,
} from './endpoints/types';
