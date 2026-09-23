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
import { Account, Metadata, Transcript, Web, Youtube } from './endpoints';
import type {
	SupadataEndpointInputs,
	SupadataEndpointOutputs,
} from './endpoints/types';
import {
	SupadataEndpointInputSchemas,
	SupadataEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SupadataSchema } from './schema';

export type SupadataPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSupadataPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof supadataEndpointsNested>;
};

export type SupadataContext = CorsairPluginContext<
	typeof SupadataSchema,
	SupadataPluginOptions
>;

export type SupadataKeyBuilderContext =
	KeyBuilderContext<SupadataPluginOptions>;

export type SupadataBoundEndpoints = BindEndpoints<
	typeof supadataEndpointsNested
>;

type SupadataEndpoint<K extends keyof SupadataEndpointOutputs> =
	CorsairEndpoint<
		SupadataContext,
		SupadataEndpointInputs[K],
		SupadataEndpointOutputs[K]
	>;

export type SupadataEndpoints = {
	accountMe: SupadataEndpoint<'accountMe'>;
	transcriptGet: SupadataEndpoint<'transcriptGet'>;
	transcriptGetJob: SupadataEndpoint<'transcriptGetJob'>;
	metadataGet: SupadataEndpoint<'metadataGet'>;
	youtubeVideo: SupadataEndpoint<'youtubeVideo'>;
	youtubeChannel: SupadataEndpoint<'youtubeChannel'>;
	youtubeChannelVideos: SupadataEndpoint<'youtubeChannelVideos'>;
	youtubePlaylist: SupadataEndpoint<'youtubePlaylist'>;
	youtubePlaylistVideos: SupadataEndpoint<'youtubePlaylistVideos'>;
	youtubeSearch: SupadataEndpoint<'youtubeSearch'>;
	webScrape: SupadataEndpoint<'webScrape'>;
	webMap: SupadataEndpoint<'webMap'>;
};

const supadataEndpointsNested = {
	account: {
		me: Account.me,
	},
	transcript: {
		get: Transcript.get,
		getJob: Transcript.getJob,
	},
	metadata: {
		get: Metadata.get,
	},
	youtube: {
		video: Youtube.video,
		channel: Youtube.channel,
		channelVideos: Youtube.channelVideos,
		playlist: Youtube.playlist,
		playlistVideos: Youtube.playlistVideos,
		search: Youtube.search,
	},
	web: {
		scrape: Web.scrape,
		map: Web.map,
	},
} as const;

/** Supadata has no webhook capability: results are polled, never pushed. */
const supadataWebhooksNested = {} as const;

export const supadataEndpointSchemas = {
	'account.me': {
		input: SupadataEndpointInputSchemas.accountMe,
		output: SupadataEndpointOutputSchemas.accountMe,
	},
	'transcript.get': {
		input: SupadataEndpointInputSchemas.transcriptGet,
		output: SupadataEndpointOutputSchemas.transcriptGet,
	},
	'transcript.getJob': {
		input: SupadataEndpointInputSchemas.transcriptGetJob,
		output: SupadataEndpointOutputSchemas.transcriptGetJob,
	},
	'metadata.get': {
		input: SupadataEndpointInputSchemas.metadataGet,
		output: SupadataEndpointOutputSchemas.metadataGet,
	},
	'youtube.video': {
		input: SupadataEndpointInputSchemas.youtubeVideo,
		output: SupadataEndpointOutputSchemas.youtubeVideo,
	},
	'youtube.channel': {
		input: SupadataEndpointInputSchemas.youtubeChannel,
		output: SupadataEndpointOutputSchemas.youtubeChannel,
	},
	'youtube.channelVideos': {
		input: SupadataEndpointInputSchemas.youtubeChannelVideos,
		output: SupadataEndpointOutputSchemas.youtubeChannelVideos,
	},
	'youtube.playlist': {
		input: SupadataEndpointInputSchemas.youtubePlaylist,
		output: SupadataEndpointOutputSchemas.youtubePlaylist,
	},
	'youtube.playlistVideos': {
		input: SupadataEndpointInputSchemas.youtubePlaylistVideos,
		output: SupadataEndpointOutputSchemas.youtubePlaylistVideos,
	},
	'youtube.search': {
		input: SupadataEndpointInputSchemas.youtubeSearch,
		output: SupadataEndpointOutputSchemas.youtubeSearch,
	},
	'web.scrape': {
		input: SupadataEndpointInputSchemas.webScrape,
		output: SupadataEndpointOutputSchemas.webScrape,
	},
	'web.map': {
		input: SupadataEndpointInputSchemas.webMap,
		output: SupadataEndpointOutputSchemas.webMap,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof supadataEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const supadataEndpointMeta = {
	'account.me': {
		riskLevel: 'read',
		description:
			'Retrieve organization details, plan information and credit usage',
	},
	'transcript.get': {
		riskLevel: 'read',
		description: 'Retrieve a transcript for a video or file URL',
	},
	'transcript.getJob': {
		riskLevel: 'read',
		description:
			'Retrieve the status or result of an asynchronous transcript job',
	},
	'metadata.get': {
		riskLevel: 'read',
		description: 'Retrieve unified metadata for media from social platforms',
	},
	'youtube.video': {
		riskLevel: 'read',
		description: 'Retrieve metadata for a YouTube video',
	},
	'youtube.channel': {
		riskLevel: 'read',
		description: 'Retrieve metadata for a YouTube channel',
	},
	'youtube.channelVideos': {
		riskLevel: 'read',
		description: 'List video, Shorts and live stream IDs for a YouTube channel',
	},
	'youtube.playlist': {
		riskLevel: 'read',
		description: 'Retrieve metadata for a YouTube playlist',
	},
	'youtube.playlistVideos': {
		riskLevel: 'read',
		description:
			'List video, Shorts and live stream IDs for a YouTube playlist',
	},
	'youtube.search': {
		riskLevel: 'read',
		description: 'Search YouTube for videos, channels or playlists',
	},
	'web.scrape': {
		riskLevel: 'read',
		description: 'Extract web page content as Markdown',
	},
	'web.map': {
		riskLevel: 'read',
		description: 'Discover every URL on a website',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof supadataEndpointsNested>;

export const supadataAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseSupadataPlugin<T extends SupadataPluginOptions> = CorsairPlugin<
	'supadata',
	typeof SupadataSchema,
	typeof supadataEndpointsNested,
	typeof supadataWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSupadataPlugin = BaseSupadataPlugin<SupadataPluginOptions>;

export type ExternalSupadataPlugin<T extends SupadataPluginOptions> =
	BaseSupadataPlugin<T>;

export function supadata<const T extends SupadataPluginOptions>(
	incomingOptions: SupadataPluginOptions & T = {} as SupadataPluginOptions & T,
): ExternalSupadataPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'supadata',
		authConfig: supadataAuthConfig,
		schema: SupadataSchema,
		options: options,
		hooks: options.hooks,
		endpoints: supadataEndpointsNested,
		webhooks: supadataWebhooksNested,
		endpointMeta: supadataEndpointMeta,
		endpointSchemas: supadataEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SupadataKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) {
					return res;
				}
				throw new AuthMissingError('supadata', 'api_key');
			}

			throw new AuthMissingError('supadata', 'api_key');
		},
	} satisfies InternalSupadataPlugin;
}

export type {
	AccountMeInput,
	AccountMeOutput,
	MetadataInput,
	MetadataOutput,
	SupadataEndpointInputs,
	SupadataEndpointOutputs,
	TranscriptInput,
	TranscriptJobInput,
	TranscriptJobOutput,
	TranscriptOutput,
	WebMapInput,
	WebMapOutput,
	WebScrapeInput,
	WebScrapeOutput,
	YoutubeChannelInput,
	YoutubeChannelOutput,
	YoutubeChannelVideosInput,
	YoutubeChannelVideosOutput,
	YoutubePlaylistInput,
	YoutubePlaylistOutput,
	YoutubePlaylistVideosInput,
	YoutubePlaylistVideosOutput,
	YoutubeSearchInput,
	YoutubeSearchOutput,
	YoutubeVideoInput,
	YoutubeVideoOutput,
} from './endpoints/types';
export {
	SupadataEndpointInputSchemas,
	SupadataEndpointOutputSchemas,
} from './endpoints/types';
export type {
	SupadataAccount,
	SupadataErrorPayload,
	SupadataMetadata,
	SupadataMetadataAuthor,
	SupadataMetadataMedia,
	SupadataMetadataStats,
	SupadataTranscript,
	SupadataTranscriptChunk,
	SupadataTranscriptContent,
	SupadataTranscriptJob,
	SupadataTranscriptJobRef,
	SupadataVideoIds,
	SupadataWebMap,
	SupadataWebPage,
	SupadataYoutubeChannel,
	SupadataYoutubeChannelRef,
	SupadataYoutubePlaylist,
	SupadataYoutubeSearchResult,
	SupadataYoutubeVideo,
} from './schema/database';
