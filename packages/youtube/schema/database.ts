import { z } from 'zod';

export const YoutubeVideo = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	channelId: z.string().optional(),
	publishedAt: z.string().optional(),
	privacyStatus: z.string().optional(),
	duration: z.string().optional(),
	viewCount: z.string().optional(),
	likeCount: z.string().optional(),
	commentCount: z.string().optional(),
	categoryId: z.string().optional(),
	tags: z.array(z.string()).optional(),
	defaultThumbnailUrl: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const YoutubePlaylist = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	channelId: z.string().optional(),
	privacyStatus: z.string().optional(),
	itemCount: z.number().optional(),
	publishedAt: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const YoutubePlaylistItem = z.object({
	id: z.string(),
	playlistId: z.string().optional(),
	videoId: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	position: z.number().optional(),
	publishedAt: z.string().optional(),
	channelId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const YoutubeChannel = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	customUrl: z.string().optional(),
	publishedAt: z.string().optional(),
	subscriberCount: z.string().optional(),
	videoCount: z.string().optional(),
	viewCount: z.string().optional(),
	country: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const YoutubeComment = z.object({
	id: z.string(),
	videoId: z.string().optional(),
	parentId: z.string().optional(),
	textDisplay: z.string().optional(),
	textOriginal: z.string().optional(),
	authorDisplayName: z.string().optional(),
	authorChannelId: z.string().optional(),
	likeCount: z.number().optional(),
	publishedAt: z.string().optional(),
	updatedAt: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const YoutubeSubscription = z.object({
	id: z.string(),
	channelId: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	publishedAt: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const YoutubeCaption = z.object({
	id: z.string(),
	videoId: z.string().optional(),
	language: z.string().optional(),
	name: z.string().optional(),
	isDraft: z.boolean().optional(),
	trackKind: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const YoutubeActivity = z.object({
	id: z.string(),
	channelId: z.string().optional(),
	type: z.string().optional(),
	publishedAt: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type YoutubeVideo = z.infer<typeof YoutubeVideo>;
export type YoutubePlaylist = z.infer<typeof YoutubePlaylist>;
export type YoutubePlaylistItem = z.infer<typeof YoutubePlaylistItem>;
export type YoutubeChannel = z.infer<typeof YoutubeChannel>;
export type YoutubeComment = z.infer<typeof YoutubeComment>;
export type YoutubeSubscription = z.infer<typeof YoutubeSubscription>;
export type YoutubeCaption = z.infer<typeof YoutubeCaption>;
export type YoutubeActivity = z.infer<typeof YoutubeActivity>;
