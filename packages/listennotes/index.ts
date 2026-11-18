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
	'search.search': ListennotesEndpoint<'search.search'>;
	'search.typeahead': ListennotesEndpoint<'search.typeahead'>;
	'podcasts.get': ListennotesEndpoint<'podcasts.get'>;
	'podcasts.getEpisodes': ListennotesEndpoint<'podcasts.getEpisodes'>;
	'podcasts.getRecommendations': ListennotesEndpoint<'podcasts.getRecommendations'>;
	'podcasts.getBest': ListennotesEndpoint<'podcasts.getBest'>;
	'episodes.get': ListennotesEndpoint<'episodes.get'>;
	'episodes.getRecommendations': ListennotesEndpoint<'episodes.getRecommendations'>;
	'genres.list': ListennotesEndpoint<'genres.list'>;
	'curated.list': ListennotesEndpoint<'curated.list'>;
	'curated.get': ListennotesEndpoint<'curated.get'>;
	'playlists.list': ListennotesEndpoint<'playlists.list'>;
	'playlists.get': ListennotesEndpoint<'playlists.get'>;
};

const listennotesEndpointsNested = {
	search: {
		search: Search.search,
		typeahead: Search.typeahead,
	},
	podcasts: {
		get: Podcasts.get,
		getEpisodes: Podcasts.getEpisodes,
		getRecommendations: Podcasts.getRecommendations,
		getBest: Podcasts.getBest,
	},
	episodes: {
		get: Episodes.get,
		getRecommendations: Episodes.getRecommendations,
	},
	genres: {
		list: Genres.list,
	},
	curated: {
		list: Curated.list,
		get: Curated.get,
	},
	playlists: {
		list: Playlists.list,
		get: Playlists.get,
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
	'episodes.get': {
		input: ListennotesEndpointInputSchemas['episodes.get'],
		output: ListennotesEndpointOutputSchemas['episodes.get'],
	},
	'episodes.getRecommendations': {
		input: ListennotesEndpointInputSchemas['episodes.getRecommendations'],
		output: ListennotesEndpointOutputSchemas['episodes.getRecommendations'],
	},
	'genres.list': {
		input: ListennotesEndpointInputSchemas['genres.list'],
		output: ListennotesEndpointOutputSchemas['genres.list'],
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
		description:
			'Typeahead search for podcast titles, genres, and terms',
	},
	'podcasts.get': {
		riskLevel: 'read',
		description:
			'Fetch detailed metadata and episodes for a podcast by ID',
	},
	'podcasts.getEpisodes': {
		riskLevel: 'read',
		description:
			'Fetch paginated episodes for a podcast by ID',
	},
	'podcasts.getRecommendations': {
		riskLevel: 'read',
		description:
			'Fetch recommended podcasts based on a given podcast ID',
	},
	'podcasts.getBest': {
		riskLevel: 'read',
		description: 'Fetch best podcasts by genre and region',
	},
	'episodes.get': {
		riskLevel: 'read',
		description:
			'Fetch detailed metadata for an episode by ID',
	},
	'episodes.getRecommendations': {
		riskLevel: 'read',
		description:
			'Fetch recommended episodes based on a given episode ID',
	},
	'genres.list': {
		riskLevel: 'read',
		description:
			'Fetch a list of podcast genres supported by Listen Notes',
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
	EpisodesGetInput,
	EpisodesGetRecommendationsInput,
	EpisodesGetRecommendationsResponse,
	EpisodesGetResponse,
	Genre,
	GenresListInput,
	GenresListResponse,
	ListennotesEndpointInputs,
	ListennotesEndpointOutputs,
	PlaylistItem,
	PlaylistsGetInput,
	PlaylistsGetResponse,
	PlaylistsListInput,
	PlaylistsListResponse,
	PlaylistSummary,
	PodcastFull,
	PodcastSimple,
	PodcastsGetBestInput,
	PodcastsGetBestResponse,
	PodcastsGetEpisodesInput,
	PodcastsGetEpisodesResponse,
	PodcastsGetInput,
	PodcastsGetRecommendationsInput,
	PodcastsGetRecommendationsResponse,
	PodcastsGetResponse,
	PodcastTypeaheadResult,
	SearchInput,
	SearchResponse,
	TypeaheadInput,
	TypeaheadResponse,
} from './endpoints/types';
