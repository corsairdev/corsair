import { z } from 'zod';

/**
 * Supadata entity schemas.
 *
 * Every schema below mirrors a component of the official Supadata OpenAPI
 * description (v1.3.0, `https://api.supadata.ai/v1`). Each is annotated with
 * the endpoint that returns it and the documentation page it was taken from.
 *
 * Response objects are `.loose()` so that fields Supadata adds later flow
 * through untouched instead of being stripped or rejected; required/optional
 * splits follow each component's documented `required` list exactly.
 */

/**
 * Standard error payload returned by every endpoint on a non-2xx response.
 *
 * Official: `Error` — https://docs.supadata.ai/api-reference/introduction
 *
 * `error` carries a machine-readable code. The documented codes are
 * `invalid-request`, `internal-error`, `forbidden`, `unauthorized`,
 * `upgrade-required`, `transcript-unavailable`, `not-found` and
 * `limit-exceeded`; it stays a plain string so a newly introduced code cannot
 * break parsing of an error that is already being surfaced to the caller.
 */
export const SupadataErrorPayload = z
	.object({
		error: z.string(),
		message: z.string(),
		details: z.string(),
		documentationUrl: z.string().optional(),
	})
	.loose();

export type SupadataErrorPayload = z.infer<typeof SupadataErrorPayload>;

/**
 * Organization, plan and credit usage for the authenticated API key.
 *
 * Official: `Me` — GET /v1/me
 * https://docs.supadata.ai/api-reference/endpoint/account/me
 */
export const SupadataAccount = z
	.object({
		organizationId: z.string(),
		plan: z.string(),
		maxCredits: z.number(),
		usedCredits: z.number(),
	})
	.loose();

export type SupadataAccount = z.infer<typeof SupadataAccount>;

/**
 * One timed segment of a transcript.
 *
 * Official: `TranscriptChunk` — GET /v1/transcript
 * https://docs.supadata.ai/api-reference/endpoint/transcript/transcript
 *
 * `offset` and `duration` are milliseconds.
 */
export const SupadataTranscriptChunk = z
	.object({
		text: z.string(),
		offset: z.number(),
		duration: z.number(),
		lang: z.string().optional(),
	})
	.loose();

export type SupadataTranscriptChunk = z.infer<typeof SupadataTranscriptChunk>;

/**
 * Transcript content: plain text when the request set `text=true`, otherwise
 * an array of timed chunks.
 *
 * Official: `Transcript.content` / `JobResult.content`
 * https://docs.supadata.ai/api-reference/endpoint/transcript/transcript
 */
export const SupadataTranscriptContent = z.union([
	z.string(),
	z.array(SupadataTranscriptChunk),
]);

export type SupadataTranscriptContent = z.infer<
	typeof SupadataTranscriptContent
>;

/**
 * A transcript returned inline (small enough to transcribe within the request).
 *
 * Official: `Transcript` — GET /v1/transcript
 * https://docs.supadata.ai/api-reference/endpoint/transcript/transcript
 */
export const SupadataTranscript = z
	.object({
		content: SupadataTranscriptContent,
		lang: z.string(),
		availableLangs: z.array(z.string()),
	})
	.loose();

export type SupadataTranscript = z.infer<typeof SupadataTranscript>;

/**
 * Handle for an asynchronous transcript, returned instead of a transcript when
 * the video is too large to process inline.
 *
 * Official: `JobId` — GET /v1/transcript
 * https://docs.supadata.ai/api-reference/endpoint/transcript/transcript
 */
export const SupadataTranscriptJobRef = z
	.object({
		jobId: z.string(),
	})
	.loose();

export type SupadataTranscriptJobRef = z.infer<typeof SupadataTranscriptJobRef>;

/**
 * Status and, once finished, the result of an asynchronous transcript job.
 *
 * Official: `JobResult` — GET /v1/transcript/{jobId}
 * https://docs.supadata.ai/api-reference/endpoint/transcript/transcript-get
 *
 * The payload is flat: `status` is the only guaranteed field, and the
 * transcript fields appear alongside it once `status` is `completed`. The job
 * id is not echoed back by the API.
 */
export const SupadataTranscriptJob = z
	.object({
		status: z.enum(['queued', 'active', 'completed', 'failed']),
		error: SupadataErrorPayload.nullish(),
		content: SupadataTranscriptContent.optional(),
		lang: z.string().optional(),
		availableLangs: z.array(z.string()).optional(),
	})
	.loose();

export type SupadataTranscriptJob = z.infer<typeof SupadataTranscriptJob>;

/**
 * Channel reference embedded in video, playlist and search payloads.
 *
 * Official: `YoutubeVideo.channel`, `YoutubePlaylist.channel` and
 * `YoutubeSearch.results[].channel`. `thumbnail` is only populated in search
 * results.
 * https://docs.supadata.ai/api-reference/endpoint/youtube/video-get
 */
export const SupadataYoutubeChannelRef = z
	.object({
		id: z.string(),
		name: z.string(),
		thumbnail: z.string().optional(),
	})
	.loose();

export type SupadataYoutubeChannelRef = z.infer<
	typeof SupadataYoutubeChannelRef
>;

/**
 * Full metadata for a single YouTube video.
 *
 * Official: `YoutubeVideo` — GET /v1/youtube/video
 * https://docs.supadata.ai/api-reference/endpoint/youtube/video-get
 *
 * `uploadDate`, `viewCount` and `likeCount` are documented as nullable.
 * `isLive` is returned by the API but absent from the published component, so
 * it is optional here.
 */
export const SupadataYoutubeVideo = z
	.object({
		id: z.string(),
		title: z.string(),
		description: z.string(),
		duration: z.number(),
		channel: SupadataYoutubeChannelRef,
		tags: z.array(z.string()),
		transcriptLanguages: z.array(z.string()),
		thumbnail: z.string().optional(),
		uploadDate: z.string().nullish(),
		viewCount: z.number().nullish(),
		likeCount: z.number().nullish(),
		isLive: z.boolean().optional(),
	})
	.loose();

export type SupadataYoutubeVideo = z.infer<typeof SupadataYoutubeVideo>;

/**
 * Full metadata for a YouTube channel.
 *
 * Official: `YoutubeChannel` — GET /v1/youtube/channel
 * https://docs.supadata.ai/api-reference/endpoint/youtube/channel
 *
 * Only `id` and `name` are guaranteed. `handle` and `banner` are documented as
 * empty strings when the channel has none, so they are not validated as URLs.
 */
export const SupadataYoutubeChannel = z
	.object({
		id: z.string(),
		name: z.string(),
		handle: z.string().optional(),
		description: z.string().optional(),
		subscriberCount: z.number().optional(),
		videoCount: z.number().optional(),
		viewCount: z.number().optional(),
		thumbnail: z.string().optional(),
		banner: z.string().optional(),
	})
	.loose();

export type SupadataYoutubeChannel = z.infer<typeof SupadataYoutubeChannel>;

/**
 * Full metadata for a YouTube playlist.
 *
 * Official: `YoutubePlaylist` — GET /v1/youtube/playlist
 * https://docs.supadata.ai/api-reference/endpoint/youtube/playlist
 */
export const SupadataYoutubePlaylist = z
	.object({
		id: z.string(),
		title: z.string(),
		videoCount: z.number(),
		channel: SupadataYoutubeChannelRef,
		description: z.string().optional(),
		viewCount: z.number().optional(),
		lastUpdated: z.string().optional(),
	})
	.loose();

export type SupadataYoutubePlaylist = z.infer<typeof SupadataYoutubePlaylist>;

/**
 * Video ids grouped by kind, returned by the channel and playlist listings.
 *
 * Official: `VideoIds` — GET /v1/youtube/channel/videos and
 * GET /v1/youtube/playlist/videos
 * https://docs.supadata.ai/api-reference/endpoint/youtube/channel-videos
 *
 * All three buckets are always present; a bucket with no matches is an empty
 * array. Ids are ordered latest first.
 */
export const SupadataVideoIds = z
	.object({
		videoIds: z.array(z.string()),
		shortIds: z.array(z.string()),
		liveIds: z.array(z.string()),
	})
	.loose();

export type SupadataVideoIds = z.infer<typeof SupadataVideoIds>;

/**
 * One hit from a YouTube search.
 *
 * Official: `YoutubeSearch.results[]` — GET /v1/youtube/search
 * https://docs.supadata.ai/api-reference/endpoint/youtube/search
 *
 * Which optional fields are populated depends on `type`: `duration`,
 * `viewCount` and `uploadDate` for videos, `handle` for channels, and
 * `videoCount` for channels and playlists. `uploadDate` is a human-readable
 * relative string (for example `11 years ago`), not a timestamp.
 */
export const SupadataYoutubeSearchResult = z
	.object({
		type: z.enum(['video', 'channel', 'playlist']),
		id: z.string(),
		title: z.string(),
		description: z.string().optional(),
		thumbnail: z.string().optional(),
		duration: z.number().optional(),
		viewCount: z.number().optional(),
		uploadDate: z.string().optional(),
		channel: SupadataYoutubeChannelRef.optional(),
		handle: z.string().optional(),
		videoCount: z.number().optional(),
	})
	.loose();

export type SupadataYoutubeSearchResult = z.infer<
	typeof SupadataYoutubeSearchResult
>;

/**
 * A web page extracted to Markdown.
 *
 * Official: `Scrape` — GET /v1/web/scrape
 * https://docs.supadata.ai/api-reference/endpoint/web/scrape
 *
 * `name` is the page title. `countCharacters` counts characters in `content`.
 */
export const SupadataWebPage = z
	.object({
		url: z.string(),
		content: z.string(),
		countCharacters: z.number(),
		urls: z.array(z.string()),
		name: z.string().optional(),
		description: z.string().optional(),
		ogUrl: z.string().optional(),
	})
	.loose();

export type SupadataWebPage = z.infer<typeof SupadataWebPage>;

/**
 * Every URL discovered while crawling a site.
 *
 * Official: `Map` — GET /v1/web/map
 * https://docs.supadata.ai/api-reference/endpoint/web/map
 */
export const SupadataWebMap = z
	.object({
		urls: z.array(z.string()),
	})
	.loose();

export type SupadataWebMap = z.infer<typeof SupadataWebMap>;

/**
 * Unified media metadata from YouTube, TikTok, Instagram, X or Facebook.
 *
 * Official: `Metadata` — GET /v1/metadata
 * https://docs.supadata.ai/api-reference/endpoint/metadata/metadata
 *
 * `platform`, `type` and `id` are required. Stats likes/comments/shares are
 * documented as required but nullable when a platform does not expose them.
 */
export const SupadataMetadataAuthor = z
	.object({
		displayName: z.string(),
		username: z.string().optional(),
		avatarUrl: z.string().optional(),
		verified: z.boolean().optional(),
	})
	.loose();

export type SupadataMetadataAuthor = z.infer<typeof SupadataMetadataAuthor>;

export const SupadataMetadataStats = z
	.object({
		likes: z.number().nullable(),
		comments: z.number().nullable(),
		shares: z.number().nullable(),
		views: z.number().nullable().optional(),
	})
	.loose();

export type SupadataMetadataStats = z.infer<typeof SupadataMetadataStats>;

export const SupadataMetadataMedia = z
	.object({
		type: z.enum(['video', 'image', 'carousel', 'post']),
		duration: z.number().optional(),
		thumbnailUrl: z.string().optional(),
		url: z.string().optional(),
		items: z.array(z.unknown()).optional(),
	})
	.loose();

export type SupadataMetadataMedia = z.infer<typeof SupadataMetadataMedia>;

export const SupadataMetadata = z
	.object({
		platform: z.enum([
			'youtube',
			'tiktok',
			'instagram',
			'twitter',
			'facebook',
		]),
		type: z.enum(['video', 'image', 'carousel', 'post']),
		id: z.string(),
		url: z.string().optional(),
		title: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		author: SupadataMetadataAuthor.optional(),
		stats: SupadataMetadataStats.optional(),
		media: SupadataMetadataMedia.optional(),
		tags: z.array(z.string()).optional(),
		createdAt: z.string().optional(),
		additionalData: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type SupadataMetadata = z.infer<typeof SupadataMetadata>;

export const databaseEntities = {
	accounts: SupadataAccount,
	transcripts: SupadataTranscript,
	transcriptJobs: SupadataTranscriptJob,
	youtubeVideos: SupadataYoutubeVideo,
	youtubeChannels: SupadataYoutubeChannel,
	youtubePlaylists: SupadataYoutubePlaylist,
	youtubeSearchResults: SupadataYoutubeSearchResult,
	webPages: SupadataWebPage,
	webMaps: SupadataWebMap,
	mediaMetadata: SupadataMetadata,
} as const;
