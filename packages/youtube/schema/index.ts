import {
	YoutubeVideo,
	YoutubePlaylist,
	YoutubePlaylistItem,
	YoutubeChannel,
	YoutubeComment,
	YoutubeSubscription,
	YoutubeCaption,
	YoutubeActivity,
} from './database';

export const YoutubeSchema = {
	version: '1.0.0',
	entities: {
		videos: YoutubeVideo,
		playlists: YoutubePlaylist,
		playlistItems: YoutubePlaylistItem,
		channels: YoutubeChannel,
		comments: YoutubeComment,
		subscriptions: YoutubeSubscription,
		captions: YoutubeCaption,
		activities: YoutubeActivity,
	},
} as const;

export type YoutubeCredentials = {
	accessToken?: string;
};

export type {
	YoutubeVideo,
	YoutubePlaylist,
	YoutubePlaylistItem,
	YoutubeChannel,
	YoutubeComment,
	YoutubeSubscription,
	YoutubeCaption,
	YoutubeActivity,
} from './database';
