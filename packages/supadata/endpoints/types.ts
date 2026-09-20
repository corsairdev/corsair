import { z } from 'zod';
import {
	SupadataAccount,
	SupadataTranscript,
	SupadataTranscriptJob,
	SupadataTranscriptJobRef,
	SupadataVideoIds,
	SupadataWebMap,
	SupadataWebPage,
	SupadataYoutubeChannel,
	SupadataYoutubePlaylist,
	SupadataYoutubeSearchResult,
	SupadataYoutubeVideo,
} from '../schema/database';

/**
 * Input and output schemas for every Supadata endpoint.
 *
 * Inputs mirror the documented query parameters one-for-one — a parameter the
 * API does not accept is not accepted here either, so a caller cannot pass a
 * filter that would be silently ignored. Outputs reuse the entity schemas in
 * `schema/database.ts`.
 */

// ==========================================
// 1. Account (GET /me)
// ==========================================

/** GET /v1/me takes no parameters. */
export const AccountMeInputSchema = z.object({}).strict();

export type AccountMeInput = z.infer<typeof AccountMeInputSchema>;

export const AccountMeOutputSchema = SupadataAccount;

export type AccountMeOutput = z.infer<typeof AccountMeOutputSchema>;

// ==========================================
// 2. Transcript (GET /transcript)
// ==========================================

export const TranscriptInputSchema = z.object({
	/** Video URL on a supported platform, or a direct media file URL. */
	url: z.url('A valid URL is required'),
	/** Preferred transcript language (ISO 639-1). Falls back to the first available. */
	lang: z.string().optional(),
	/** Return one plain-text transcript instead of timed chunks. Defaults to false. */
	text: z.boolean().optional(),
	/** Maximum characters per chunk. Only honoured when `text` is false. */
	chunkSize: z.number().min(50).max(10000).optional(),
	/**
	 * `native` uses existing captions only, `generate` always transcribes with
	 * AI, `auto` tries native and falls back to generate. Defaults to `auto`;
	 * a file URL is always treated as `generate`.
	 */
	mode: z.enum(['native', 'auto', 'generate']).optional(),
});

export type TranscriptInput = z.infer<typeof TranscriptInputSchema>;

/**
 * A transcript, or a job handle when the video is too large to transcribe
 * inline. Callers should check for `jobId` and poll `transcript.getJob`.
 *
 * Official: `TranscriptOrJobId`.
 */
export const TranscriptOutputSchema = z.union([
	SupadataTranscript,
	SupadataTranscriptJobRef,
]);

export type TranscriptOutput = z.infer<typeof TranscriptOutputSchema>;

// ==========================================
// 3. Transcript job result (GET /transcript/{jobId})
// ==========================================

export const TranscriptJobInputSchema = z.object({
	jobId: z.string().min(1, 'Job ID is required'),
});

export type TranscriptJobInput = z.infer<typeof TranscriptJobInputSchema>;

export const TranscriptJobOutputSchema = SupadataTranscriptJob;

export type TranscriptJobOutput = z.infer<typeof TranscriptJobOutputSchema>;

// ==========================================
// 4. YouTube video metadata (GET /youtube/video)
// ==========================================

/**
 * `id` accepts a video id or any supported YouTube URL.
 * https://docs.supadata.ai/youtube/supported-url-formats
 */
export const YoutubeVideoInputSchema = z.object({
	id: z.string().min(1, 'A YouTube video ID or URL is required'),
});

export type YoutubeVideoInput = z.infer<typeof YoutubeVideoInputSchema>;

export const YoutubeVideoOutputSchema = SupadataYoutubeVideo;

export type YoutubeVideoOutput = z.infer<typeof YoutubeVideoOutputSchema>;

// ==========================================
// 5. YouTube channel metadata (GET /youtube/channel)
// ==========================================

/** `id` accepts a channel id, an `@handle`, or any supported channel URL. */
export const YoutubeChannelInputSchema = z.object({
	id: z.string().min(1, 'A YouTube channel ID, handle or URL is required'),
});

export type YoutubeChannelInput = z.infer<typeof YoutubeChannelInputSchema>;

export const YoutubeChannelOutputSchema = SupadataYoutubeChannel;

export type YoutubeChannelOutput = z.infer<typeof YoutubeChannelOutputSchema>;

// ==========================================
// 6. YouTube channel videos (GET /youtube/channel/videos)
// ==========================================

export const YoutubeChannelVideosInputSchema = z.object({
	id: z.string().min(1, 'A YouTube channel ID, handle or URL is required'),
	/** Maximum ids to return, 1–5000. Defaults to 30. */
	limit: z.number().int().min(1).max(5000).optional(),
	/**
	 * Which kinds of upload to return. Defaults to `all`, which fills regular
	 * videos first, then Shorts, then live streams.
	 */
	type: z.enum(['all', 'video', 'short', 'live']).optional(),
});

export type YoutubeChannelVideosInput = z.infer<
	typeof YoutubeChannelVideosInputSchema
>;

export const YoutubeChannelVideosOutputSchema = SupadataVideoIds;

export type YoutubeChannelVideosOutput = z.infer<
	typeof YoutubeChannelVideosOutputSchema
>;

// ==========================================
// 7. YouTube playlist metadata (GET /youtube/playlist)
// ==========================================

/** `id` accepts a playlist id or any supported playlist URL. */
export const YoutubePlaylistInputSchema = z.object({
	id: z.string().min(1, 'A YouTube playlist ID or URL is required'),
});

export type YoutubePlaylistInput = z.infer<typeof YoutubePlaylistInputSchema>;

export const YoutubePlaylistOutputSchema = SupadataYoutubePlaylist;

export type YoutubePlaylistOutput = z.infer<typeof YoutubePlaylistOutputSchema>;

// ==========================================
// 8. YouTube playlist videos (GET /youtube/playlist/videos)
// ==========================================

export const YoutubePlaylistVideosInputSchema = z.object({
	id: z.string().min(1, 'A YouTube playlist ID or URL is required'),
	/** Maximum ids to return, 1–5000. Defaults to 100. */
	limit: z.number().int().min(1).max(5000).optional(),
});

export type YoutubePlaylistVideosInput = z.infer<
	typeof YoutubePlaylistVideosInputSchema
>;

export const YoutubePlaylistVideosOutputSchema = SupadataVideoIds;

export type YoutubePlaylistVideosOutput = z.infer<
	typeof YoutubePlaylistVideosOutputSchema
>;

// ==========================================
// 9. YouTube search (GET /youtube/search)
// ==========================================

export const YoutubeSearchInputSchema = z.object({
	query: z.string().min(1, 'Query is required'),
	/** Content type filter. Defaults to `all`. */
	type: z.enum(['all', 'video', 'channel', 'playlist', 'movie']).optional(),
	/** Maximum results to return, 1–5000. */
	limit: z.number().int().min(1).max(5000).optional(),
	/** Age filter. Defaults to `all`. Applies to videos and movies only. */
	uploadDate: z
		.enum(['all', 'hour', 'today', 'week', 'month', 'year'])
		.optional(),
	/** Sort order. Defaults to `relevance`. */
	sortBy: z.enum(['relevance', 'rating', 'date', 'views']).optional(),
	/** Length filter. Defaults to `all`. Applies to videos and movies only. */
	duration: z.enum(['all', 'short', 'medium', 'long']).optional(),
	/**
	 * Special feature filters.
	 * @example ['hd', 'subtitles']
	 */
	features: z
		.array(
			z.enum([
				'hd',
				'subtitles',
				'creative-commons',
				'3d',
				'live',
				'4k',
				'360',
				'location',
				'hdr',
				'vr180',
			]),
		)
		.optional(),
	/**
	 * Page token from a previous response. When supplied, every other filter is
	 * ignored. Supadata only returns a token when `limit` is omitted.
	 */
	nextPageToken: z.string().optional(),
});

export type YoutubeSearchInput = z.infer<typeof YoutubeSearchInputSchema>;

export const YoutubeSearchOutputSchema = z
	.object({
		query: z.string(),
		results: z.array(SupadataYoutubeSearchResult),
		totalResults: z.number().optional(),
		/** Only returned when `limit` was omitted from the request. */
		nextPageToken: z.string().optional(),
	})
	.loose();

export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;

// ==========================================
// 10. Web scrape (GET /web/scrape)
// ==========================================

export const WebScrapeInputSchema = z.object({
	url: z.url('A valid URL is required'),
	/** Strip Markdown links from the extracted content. Defaults to false. */
	noLinks: z.boolean().optional(),
	/** Preferred content language (ISO 639-1). Defaults to `en`. */
	lang: z.string().optional(),
});

export type WebScrapeInput = z.infer<typeof WebScrapeInputSchema>;

export const WebScrapeOutputSchema = SupadataWebPage;

export type WebScrapeOutput = z.infer<typeof WebScrapeOutputSchema>;

// ==========================================
// 11. Website URL map (GET /web/map)
// ==========================================

/** GET /v1/web/map takes no parameters other than `url`. */
export const WebMapInputSchema = z.object({
	url: z.url('A valid URL is required'),
});

export type WebMapInput = z.infer<typeof WebMapInputSchema>;

export const WebMapOutputSchema = SupadataWebMap;

export type WebMapOutput = z.infer<typeof WebMapOutputSchema>;

// ==========================================
// Schema collections
// ==========================================

export type SupadataEndpointInputs = {
	accountMe: AccountMeInput;
	transcriptGet: TranscriptInput;
	transcriptGetJob: TranscriptJobInput;
	youtubeVideo: YoutubeVideoInput;
	youtubeChannel: YoutubeChannelInput;
	youtubeChannelVideos: YoutubeChannelVideosInput;
	youtubePlaylist: YoutubePlaylistInput;
	youtubePlaylistVideos: YoutubePlaylistVideosInput;
	youtubeSearch: YoutubeSearchInput;
	webScrape: WebScrapeInput;
	webMap: WebMapInput;
};

export type SupadataEndpointOutputs = {
	accountMe: AccountMeOutput;
	transcriptGet: TranscriptOutput;
	transcriptGetJob: TranscriptJobOutput;
	youtubeVideo: YoutubeVideoOutput;
	youtubeChannel: YoutubeChannelOutput;
	youtubeChannelVideos: YoutubeChannelVideosOutput;
	youtubePlaylist: YoutubePlaylistOutput;
	youtubePlaylistVideos: YoutubePlaylistVideosOutput;
	youtubeSearch: YoutubeSearchOutput;
	webScrape: WebScrapeOutput;
	webMap: WebMapOutput;
};

export const SupadataEndpointInputSchemas = {
	accountMe: AccountMeInputSchema,
	transcriptGet: TranscriptInputSchema,
	transcriptGetJob: TranscriptJobInputSchema,
	youtubeVideo: YoutubeVideoInputSchema,
	youtubeChannel: YoutubeChannelInputSchema,
	youtubeChannelVideos: YoutubeChannelVideosInputSchema,
	youtubePlaylist: YoutubePlaylistInputSchema,
	youtubePlaylistVideos: YoutubePlaylistVideosInputSchema,
	youtubeSearch: YoutubeSearchInputSchema,
	webScrape: WebScrapeInputSchema,
	webMap: WebMapInputSchema,
} as const;

export const SupadataEndpointOutputSchemas = {
	accountMe: AccountMeOutputSchema,
	transcriptGet: TranscriptOutputSchema,
	transcriptGetJob: TranscriptJobOutputSchema,
	youtubeVideo: YoutubeVideoOutputSchema,
	youtubeChannel: YoutubeChannelOutputSchema,
	youtubeChannelVideos: YoutubeChannelVideosOutputSchema,
	youtubePlaylist: YoutubePlaylistOutputSchema,
	youtubePlaylistVideos: YoutubePlaylistVideosOutputSchema,
	youtubeSearch: YoutubeSearchOutputSchema,
	webScrape: WebScrapeOutputSchema,
	webMap: WebMapOutputSchema,
} as const;
