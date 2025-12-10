// This file simulates a database or external API
// In production, this would be replaced with actual API calls

import albumsData from '@/data/albums.json';
import artistsData from '@/data/artists.json';
import tracksData from '@/data/tracks.json';
import type {
	SpotifyAlbum,
	SpotifyArtist,
	SpotifyTracksResponse,
} from '@/lib/types';

// Simulated data store with mutable state for mutations
const artists = artistsData as SpotifyArtist[];
const albums = albumsData as SpotifyAlbum[];
const tracksResponse = tracksData[0] as SpotifyTracksResponse;
const tracks = tracksResponse.items;

// Simulate network delay
const delay = (ms: number = 100) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// QUERIES (Read Operations)
// ============================================

export async function getAllArtists(): Promise<SpotifyArtist[]> {
	await delay();
	return artists;
}

export async function getArtistById(id: string): Promise<SpotifyArtist | null> {
	await delay();
	return artists.find((artist) => artist.id === id) || null;
}

export async function getAllAlbums(): Promise<SpotifyAlbum[]> {
	await delay();
	return albums;
}

export async function getAlbumById(id: string): Promise<SpotifyAlbum | null> {
	await delay();
	return albums.find((album) => album.id === id) || null;
}

export async function getAllAlbumsByArtistId(
	artistId: string,
): Promise<SpotifyAlbum[]> {
	await delay();
	return albums.filter((album) =>
		album.artists.some((artist) => artist.id === artistId),
	);
}

export async function getAllTracks() {
	await delay();
	return tracks;
}

export async function getTracksByAlbumId(_albumId: string) {
	await delay();
	// In real implementation, tracks would have album_id
	// For demo data, we return all tracks since they're from one album
	return tracks;
}

export async function getTracksByArtistId(artistId: string) {
	await delay();
	return tracks.filter((track) =>
		track.artists.some((artist) => artist.id === artistId),
	);
}

export async function searchArtists(query: string): Promise<SpotifyArtist[]> {
	await delay();
	const lowerQuery = query.toLowerCase();
	return artists.filter((artist) =>
		artist.name.toLowerCase().includes(lowerQuery),
	);
}

export async function searchAlbums(query: string): Promise<SpotifyAlbum[]> {
	await delay();
	const lowerQuery = query.toLowerCase();
	return albums.filter((album) =>
		album.name.toLowerCase().includes(lowerQuery),
	);
}

// ============================================
// MUTATIONS (Write Operations)
// ============================================

export async function updateArtistPopularity(
	artistId: string,
	popularity: number,
): Promise<SpotifyArtist | null> {
	await delay();
	const artist = artists.find((a) => a.id === artistId);
	if (artist) {
		artist.popularity = Math.max(0, Math.min(100, popularity));
		return artist;
	}
	return null;
}

export async function updateAlbumType(
	albumId: string,
	albumType: string,
): Promise<SpotifyAlbum | null> {
	await delay();
	const album = albums.find((a) => a.id === albumId);
	if (album) {
		album.album_type = albumType;
		return album;
	}
	return null;
}

export async function toggleTrackExplicit(trackId: string) {
	await delay();
	const track = tracks.find((t) => t.id === trackId);
	if (track) {
		track.explicit = !track.explicit;
		return track;
	}
	return null;
}

export async function addArtistGenre(
	artistId: string,
	genre: string,
): Promise<SpotifyArtist | null> {
	await delay();
	const artist = artists.find((a) => a.id === artistId);
	if (artist && artist.genres) {
		if (!artist.genres.includes(genre)) {
			artist.genres.push(genre);
		}
		return artist;
	}
	return null;
}

export async function removeArtistGenre(
	artistId: string,
	genre: string,
): Promise<SpotifyArtist | null> {
	await delay();
	const artist = artists.find((a) => a.id === artistId);
	if (artist && artist.genres) {
		artist.genres = artist.genres.filter((g) => g !== genre);
		return artist;
	}
	return null;
}
