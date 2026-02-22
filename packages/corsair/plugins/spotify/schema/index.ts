import {
	SpotifyAlbum,
	SpotifyArtist,
	SpotifyPlaylist,
	SpotifyPlaylistItem,
	SpotifyTrack,
	SpotifyUser,
} from './database';

export const SpotifySchema = {
	version: '1.0.0',
	entities: {
		tracks: SpotifyTrack,
		albums: SpotifyAlbum,
		artists: SpotifyArtist,
		playlists: SpotifyPlaylist,
		playlistItems: SpotifyPlaylistItem,
		users: SpotifyUser,
	},
} as const;