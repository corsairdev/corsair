import {
	YoutubeActivity,
	YoutubeCaption,
	YoutubeChannel,
	YoutubeComment,
	YoutubePlaylist,
	YoutubePlaylistItem,
	YoutubeSubscription,
	YoutubeVideo,
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
	YoutubeActivity,
	YoutubeCaption,
	YoutubeChannel,
	YoutubeComment,
	YoutubePlaylist,
	YoutubePlaylistItem,
	YoutubeSubscription,
	YoutubeVideo,
} from './database';
