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
import {
	Curated,
	Directory,
	Episodes,
	Genres,
	Playlists,
	Podcasts,
	Search,
} from './endpoints';
import type {
	ListennotesEndpointInputs,
	ListennotesEndpointOutputs,
} from './endpoints/types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ListennotesSchema } from './schema';

export { ListennotesSchema } from './schema';
export { listennotesEntities } from './schema/database';

export type ListennotesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalListennotesPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof listennotesEndpointsNested>;
};

export type ListennotesContext = CorsairPluginContext<
	typeof ListennotesSchema,
	ListennotesPluginOptions
>;

export type ListennotesKeyBuilderContext =
	KeyBuilderContext<ListennotesPluginOptions>;

export type ListennotesBoundEndpoints = BindEndpoints<
	typeof listennotesEndpointsNested
>;

type ListennotesEndpoint<K extends keyof ListennotesEndpointOutputs> =
	CorsairEndpoint<
		ListennotesContext,
		ListennotesEndpointInputs[K],
		ListennotesEndpointOutputs[K]
	>;

export type ListennotesEndpoints = {
	[K in keyof ListennotesEndpointOutputs]: ListennotesEndpoint<K>;
};

const listennotesEndpointsNested = {
	search: {
		search: Search.search,
		typeahead: Search.typeahead,
		searchEpisodeTitles: Search.searchEpisodeTitles,
		trendingSearches: Search.trendingSearches,
		relatedSearches: Search.relatedSearches,
		spellcheck: Search.spellcheck,
	},
	podcasts: {
		get: Podcasts.get,
		getEpisodes: Podcasts.getEpisodes,
		getRecommendations: Podcasts.getRecommendations,
		getBest: Podcasts.getBest,
		getBatch: Podcasts.getBatch,
		delete: Podcasts.deletePodcast,
		submit: Podcasts.submit,
		refreshRss: Podcasts.refreshRss,
		getAudience: Podcasts.getAudience,
		getByDomain: Podcasts.getByDomain,
	},
	episodes: {
		get: Episodes.get,
		getRecommendations: Episodes.getRecommendations,
		getBatch: Episodes.getBatch,
		justListen: Episodes.justListen,
	},
	genres: {
		list: Genres.list,
	},
	regions: {
		list: Directory.regions,
	},
	languages: {
		list: Directory.languages,
	},
	curated: {
		list: Curated.list,
		get: Curated.get,
	},
	playlists: {
		list: Playlists.list,
		get: Playlists.get,
		create: Playlists.create,
		update: Playlists.update,
		delete: Playlists.remove,
		addItem: Playlists.addItem,
		updateItem: Playlists.updateItem,
		deleteItem: Playlists.deleteItem,
	},
} as const;

export const listennotesEndpointSchemas = {
	'search.search': {
		input: ListennotesEndpointInputSchemas['search.search'],
		output: ListennotesEndpointOutputSchemas['search.search'],
	},
	'search.typeahead': {
		input: ListennotesEndpointInputSchemas['search.typeahead'],
		output: ListennotesEndpointOutputSchemas['search.typeahead'],
	},
	'search.searchEpisodeTitles': {
		input: ListennotesEndpointInputSchemas['search.searchEpisodeTitles'],
		output: ListennotesEndpointOutputSchemas['search.searchEpisodeTitles'],
	},
	'search.trendingSearches': {
		input: ListennotesEndpointInputSchemas['search.trendingSearches'],
		output: ListennotesEndpointOutputSchemas['search.trendingSearches'],
	},
	'search.relatedSearches': {
		input: ListennotesEndpointInputSchemas['search.relatedSearches'],
		output: ListennotesEndpointOutputSchemas['search.relatedSearches'],
	},
	'search.spellcheck': {
		input: ListennotesEndpointInputSchemas['search.spellcheck'],
		output: ListennotesEndpointOutputSchemas['search.spellcheck'],
	},
	'podcasts.get': {
		input: ListennotesEndpointInputSchemas['podcasts.get'],
		output: ListennotesEndpointOutputSchemas['podcasts.get'],
	},
	'podcasts.getEpisodes': {
		input: ListennotesEndpointInputSchemas['podcasts.getEpisodes'],
		output: ListennotesEndpointOutputSchemas['podcasts.getEpisodes'],
	},
	'podcasts.getRecommendations': {
		input: ListennotesEndpointInputSchemas['podcasts.getRecommendations'],
		output: ListennotesEndpointOutputSchemas['podcasts.getRecommendations'],
	},
	'podcasts.getBest': {
		input: ListennotesEndpointInputSchemas['podcasts.getBest'],
		output: ListennotesEndpointOutputSchemas['podcasts.getBest'],
	},
	'podcasts.getBatch': {
		input: ListennotesEndpointInputSchemas['podcasts.getBatch'],
		output: ListennotesEndpointOutputSchemas['podcasts.getBatch'],
	},
	'podcasts.delete': {
		input: ListennotesEndpointInputSchemas['podcasts.delete'],
		output: ListennotesEndpointOutputSchemas['podcasts.delete'],
	},
	'podcasts.submit': {
		input: ListennotesEndpointInputSchemas['podcasts.submit'],
		output: ListennotesEndpointOutputSchemas['podcasts.submit'],
	},
	'podcasts.refreshRss': {
		input: ListennotesEndpointInputSchemas['podcasts.refreshRss'],
		output: ListennotesEndpointOutputSchemas['podcasts.refreshRss'],
	},
	'podcasts.getAudience': {
		input: ListennotesEndpointInputSchemas['podcasts.getAudience'],
		output: ListennotesEndpointOutputSchemas['podcasts.getAudience'],
	},
	'podcasts.getByDomain': {
		input: ListennotesEndpointInputSchemas['podcasts.getByDomain'],
		output: ListennotesEndpointOutputSchemas['podcasts.getByDomain'],
	},
	'episodes.get': {
		input: ListennotesEndpointInputSchemas['episodes.get'],
		output: ListennotesEndpointOutputSchemas['episodes.get'],
	},
	'episodes.getRecommendations': {
		input: ListennotesEndpointInputSchemas['episodes.getRecommendations'],
		output: ListennotesEndpointOutputSchemas['episodes.getRecommendations'],
	},
	'episodes.getBatch': {
		input: ListennotesEndpointInputSchemas['episodes.getBatch'],
		output: ListennotesEndpointOutputSchemas['episodes.getBatch'],
	},
	'episodes.justListen': {
		input: ListennotesEndpointInputSchemas['episodes.justListen'],
		output: ListennotesEndpointOutputSchemas['episodes.justListen'],
	},
	'genres.list': {
		input: ListennotesEndpointInputSchemas['genres.list'],
		output: ListennotesEndpointOutputSchemas['genres.list'],
	},
	'regions.list': {
		input: ListennotesEndpointInputSchemas['regions.list'],
		output: ListennotesEndpointOutputSchemas['regions.list'],
	},
	'languages.list': {
		input: ListennotesEndpointInputSchemas['languages.list'],
		output: ListennotesEndpointOutputSchemas['languages.list'],
	},
	'curated.list': {
		input: ListennotesEndpointInputSchemas['curated.list'],
		output: ListennotesEndpointOutputSchemas['curated.list'],
	},
	'curated.get': {
		input: ListennotesEndpointInputSchemas['curated.get'],
		output: ListennotesEndpointOutputSchemas['curated.get'],
	},
	'playlists.list': {
		input: ListennotesEndpointInputSchemas['playlists.list'],
		output: ListennotesEndpointOutputSchemas['playlists.list'],
	},
	'playlists.get': {
		input: ListennotesEndpointInputSchemas['playlists.get'],
		output: ListennotesEndpointOutputSchemas['playlists.get'],
	},
	'playlists.create': {
		input: ListennotesEndpointInputSchemas['playlists.create'],
		output: ListennotesEndpointOutputSchemas['playlists.create'],
	},
	'playlists.update': {
		input: ListennotesEndpointInputSchemas['playlists.update'],
		output: ListennotesEndpointOutputSchemas['playlists.update'],
	},
	'playlists.delete': {
		input: ListennotesEndpointInputSchemas['playlists.delete'],
		output: ListennotesEndpointOutputSchemas['playlists.delete'],
	},
	'playlists.addItem': {
		input: ListennotesEndpointInputSchemas['playlists.addItem'],
		output: ListennotesEndpointOutputSchemas['playlists.addItem'],
	},
	'playlists.updateItem': {
		input: ListennotesEndpointInputSchemas['playlists.updateItem'],
		output: ListennotesEndpointOutputSchemas['playlists.updateItem'],
	},
	'playlists.deleteItem': {
		input: ListennotesEndpointInputSchemas['playlists.deleteItem'],
		output: ListennotesEndpointOutputSchemas['playlists.deleteItem'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof listennotesEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const listennotesEndpointMeta = {
	'search.search': {
		riskLevel: 'read',
		description:
			'Full-text search for podcast episodes, channels, or curated lists',
	},
	'search.typeahead': {
		riskLevel: 'read',
		description: 'Typeahead search for podcast titles, genres, and terms',
	},
	'search.searchEpisodeTitles': {
		riskLevel: 'read',
		description: 'Search for episodes by title with optional podcast filtering',
	},
	'search.trendingSearches': {
		riskLevel: 'read',
		description: 'Fetch the latest trending search terms',
	},
	'search.relatedSearches': {
		riskLevel: 'read',
		description: 'Find search terms related to a supplied topic',
	},
	'search.spellcheck': {
		riskLevel: 'read',
		description: 'Suggest spelling corrections for a search term',
	},
	'podcasts.get': {
		riskLevel: 'read',
		description: 'Fetch detailed metadata and episodes for a podcast by ID',
	},
	'podcasts.getEpisodes': {
		riskLevel: 'read',
		description: 'Fetch paginated episodes for a podcast by ID',
	},
	'podcasts.getRecommendations': {
		riskLevel: 'read',
		description: 'Fetch recommended podcasts based on a given podcast ID',
	},
	'podcasts.getBest': {
		riskLevel: 'read',
		description: 'Fetch best podcasts by genre and region',
	},
	'podcasts.getBatch': {
		riskLevel: 'read',
		description: 'Fetch basic metadata for up to 10 podcasts by supported IDs',
	},
	'podcasts.delete': {
		riskLevel: 'destructive',
		description: 'Request removal of a podcast from the Listen Notes directory',
	},
	'podcasts.submit': {
		riskLevel: 'write',
		description: 'Submit an RSS feed for review in the Listen Notes directory',
	},
	'podcasts.refreshRss': {
		riskLevel: 'write',
		description: 'Request an RSS refresh for a podcast (limited to hourly)',
	},
	'podcasts.getAudience': {
		riskLevel: 'read',
		description: 'Fetch available audience region demographics for a podcast',
	},
	'podcasts.getByDomain': {
		riskLevel: 'read',
		description: 'Fetch podcasts published by a domain, with page pagination',
	},
	'episodes.get': {
		riskLevel: 'read',
		description: 'Fetch detailed metadata for an episode by ID',
	},
	'episodes.getRecommendations': {
		riskLevel: 'read',
		description: 'Fetch recommended episodes based on a given episode ID',
	},
	'episodes.getBatch': {
		riskLevel: 'read',
		description: 'Fetch basic metadata for up to 10 episodes',
	},
	'episodes.justListen': {
		riskLevel: 'read',
		description: 'Fetch a random recently published podcast episode',
	},
	'genres.list': {
		riskLevel: 'read',
		description: 'Fetch a list of podcast genres supported by Listen Notes',
	},
	'regions.list': {
		riskLevel: 'read',
		description: 'Fetch supported country and region codes',
	},
	'languages.list': {
		riskLevel: 'read',
		description: 'Fetch languages supported by the Listen Notes directory',
	},
	'curated.list': {
		riskLevel: 'read',
		description: 'Fetch curated lists of podcasts',
	},
	'curated.get': {
		riskLevel: 'read',
		description: 'Fetch a curated list of podcasts by ID',
	},
	'playlists.list': {
		riskLevel: 'read',
		description: 'Fetch a list of user playlists',
	},
	'playlists.get': {
		riskLevel: 'read',
		description: 'Fetch a playlist and its items by ID',
	},
	'playlists.create': {
		riskLevel: 'write',
		description: 'Create a playlist owned by the authenticated API account',
	},
	'playlists.update': {
		riskLevel: 'write',
		description: 'Update playlist metadata or its saved default view',
	},
	'playlists.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a playlist and its saved references',
	},
	'playlists.addItem': {
		riskLevel: 'write',
		description: 'Add an episode or podcast to a playlist',
	},
	'playlists.updateItem': {
		riskLevel: 'write',
		description: 'Update notes attached to a playlist item',
	},
	'playlists.deleteItem': {
		riskLevel: 'destructive',
		description: 'Remove an episode or podcast reference from a playlist',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof listennotesEndpointsNested
>;

export const listennotesAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseListennotesPlugin<T extends ListennotesPluginOptions> =
	CorsairPlugin<
		'listennotes',
		typeof ListennotesSchema,
		typeof listennotesEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalListennotesPlugin =
	BaseListennotesPlugin<ListennotesPluginOptions>;

export type ExternalListennotesPlugin<T extends ListennotesPluginOptions> =
	BaseListennotesPlugin<T>;

const PUBLIC_ENDPOINTS = new Set<string>();

export function listennotes<const T extends ListennotesPluginOptions>(
	incomingOptions: ListennotesPluginOptions &
		T = {} as ListennotesPluginOptions & T,
): ExternalListennotesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInErrorHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerErrorHandlers } =
		options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callerErrorHandlers,
		...builtInErrorHandlers,
		...callerErrorHandlers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'listennotes',
		authConfig: listennotesAuthConfig,
		schema: ListennotesSchema,
		options,
		hooks: options.hooks,
		endpoints: listennotesEndpointsNested,
		webhooks: {},
		endpointMeta: listennotesEndpointMeta,
		endpointSchemas: listennotesEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: ListennotesKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) throw new AuthMissingError('listennotes', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('listennotes', 'api_key');
			return apiKey;
		},
	} satisfies InternalListennotesPlugin;
}

export type {
	CuratedGetInput,
	CuratedGetResponse,
	CuratedListFull,
	CuratedListInput,
	CuratedListResponse,
	CuratedListSimple,
	EpisodeFull,
	EpisodeMinimum,
	EpisodeSimple,
	EpisodesBatchInput,
	EpisodesBatchResponse,
	EpisodesGetInput,
	EpisodesGetRecommendationsInput,
	EpisodesGetRecommendationsResponse,
	EpisodesGetResponse,
	EpisodesJustListenInput,
	EpisodesJustListenResponse,
	Genre,
	GenresListInput,
	GenresListResponse,
	LanguagesListInput,
	LanguagesListResponse,
	ListennotesEndpointInputs,
	ListennotesEndpointOutputs,
	PlaylistItem,
	PlaylistSummary,
	PlaylistsAddItemInput,
	PlaylistsCreateInput,
	PlaylistsDeleteInput,
	PlaylistsDeleteItemInput,
	PlaylistsDeleteItemResponse,
	PlaylistsDeleteResponse,
	PlaylistsGetInput,
	PlaylistsGetResponse,
	PlaylistsListInput,
	PlaylistsListResponse,
	PlaylistsUpdateInput,
	PlaylistsUpdateItemInput,
	PodcastFull,
	PodcastMinimum,
	PodcastSimple,
	PodcastsAudienceInput,
	PodcastsAudienceResponse,
	PodcastsBatchInput,
	PodcastsBatchResponse,
	PodcastsByDomainInput,
	PodcastsByDomainResponse,
	PodcastsDeleteInput,
	PodcastsDeleteResponse,
	PodcastsGetBestInput,
	PodcastsGetBestResponse,
	PodcastsGetEpisodesInput,
	PodcastsGetEpisodesResponse,
	PodcastsGetInput,
	PodcastsGetRecommendationsInput,
	PodcastsGetRecommendationsResponse,
	PodcastsGetResponse,
	PodcastsRefreshRssInput,
	PodcastsRefreshRssResponse,
	PodcastsSubmitInput,
	PodcastsSubmitResponse,
	PodcastTypeaheadResult,
	RegionsListInput,
	RegionsListResponse,
	SearchEpisodeTitlesInput,
	SearchEpisodeTitlesResponse,
	SearchInput,
	SearchResponse,
	SearchTermInput,
	SearchTermsResponse,
	SearchTrendingInput,
	SpellcheckResponse,
	TypeaheadInput,
	TypeaheadResponse,
} from './endpoints/types';
