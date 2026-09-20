import {
	getMe,
	getTranscript,
	getTranscriptJob,
	getYoutubeChannel,
	getYoutubeChannelVideos,
	getYoutubePlaylist,
	getYoutubePlaylistVideos,
	getYoutubeVideo,
	mapWeb,
	scrapeWeb,
	searchYoutube,
} from './operations';

export const Account = {
	me: getMe,
};

export const Transcript = {
	get: getTranscript,
	getJob: getTranscriptJob,
};

export const Youtube = {
	video: getYoutubeVideo,
	channel: getYoutubeChannel,
	channelVideos: getYoutubeChannelVideos,
	playlist: getYoutubePlaylist,
	playlistVideos: getYoutubePlaylistVideos,
	search: searchYoutube,
};

export const Web = {
	scrape: scrapeWeb,
	map: mapWeb,
};

export * from './types';
