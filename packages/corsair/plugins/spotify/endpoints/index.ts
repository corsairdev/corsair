import {
	get as albumsGet,
	getTracks as albumsGetTracks,
	search as albumsSearch,
	getNewReleases,
} from './albums';
import {
	get as artistsGet,
	search as artistsSearch,
	getAlbums,
	getRelatedArtists,
	getTopTracks,
} from './artists';
import { getLikedTracks } from './library';
import { getFollowedArtists } from './my-data';
import {
	addToQueue,
	getCurrentlyPlaying,
	getRecentlyPlayed,
	pause,
	resume,
	setVolume,
	skipToNext,
	skipToPrevious,
	startPlayback,
} from './player';
import {
	addItem,
	create,
	getUserPlaylists,
	get as playlistsGet,
	getTracks as playlistsGetTracks,
	search as playlistsSearch,
	removeItem,
} from './playlists';
import {
	getAudioFeatures,
	get as tracksGet,
	search as tracksSearch,
} from './tracks';

export const Albums = {
	get: albumsGet,
	getNewReleases,
	getTracks: albumsGetTracks,
	search: albumsSearch,
};

export const Artists = {
	get: artistsGet,
	getAlbums,
	getRelatedArtists,
	getTopTracks,
	search: artistsSearch,
};

export const Library = {
	getLikedTracks,
};

export const MyData = {
	getFollowedArtists,
};

export const Player = {
	addToQueue,
	getCurrentlyPlaying,
	getRecentlyPlayed,
	pause,
	resume,
	setVolume,
	skipToNext,
	skipToPrevious,
	startPlayback,
};

export const Playlists = {
	addItem,
	create,
	get: playlistsGet,
	getTracks: playlistsGetTracks,
	getUserPlaylists,
	removeItem,
	search: playlistsSearch,
};

export const Tracks = {
	get: tracksGet,
	getAudioFeatures,
	search: tracksSearch,
};

export * from './types';
