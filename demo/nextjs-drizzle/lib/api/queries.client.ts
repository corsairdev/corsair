"use client";

// Client-side query hooks (for Client Components)
// These simulate React Query / tRPC-style hooks

import { useCallback, useState } from "react";
import type { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/lib/types";
import {
	getAlbumById,
	getAllAlbums,
	getAllAlbumsByArtistId,
	getAllArtists,
	getAllTracks,
	getArtistById,
	getTracksByAlbumId,
	getTracksByArtistId,
} from "./data";

// Generic hook type
interface UseQueryResult<T> {
	data: T | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

// Generic query hook
function useQuery<T>(
	queryFn: () => Promise<T>,
	key: string = "default",
): UseQueryResult<T> {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const result = await queryFn();
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("An error occurred"));
		} finally {
			setIsLoading(false);
		}
	}, [queryFn]);

	// useEffect(() => {
	// 	fetchData();
	// }, [key]);

	return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// QUERY HOOKS
// ============================================

export function useAllArtists(): UseQueryResult<SpotifyArtist[]> {
	return useQuery(getAllArtists, "all-artists");
}

export function useAllAlbums(): UseQueryResult<SpotifyAlbum[]> {
	return useQuery(getAllAlbums, "all-albums");
}

export function useAllTracks(): UseQueryResult<SpotifyTrack[]> {
	return useQuery(getAllTracks, "all-tracks");
}

export function useArtistById(
	id: string | null,
): UseQueryResult<SpotifyArtist | null> {
	return useQuery(
		() => (id ? getArtistById(id) : Promise.resolve(null)),
		`artist-${id}`,
	);
}

export function useAlbumById(
	id: string | null,
): UseQueryResult<SpotifyAlbum | null> {
	return useQuery(
		() => (id ? getAlbumById(id) : Promise.resolve(null)),
		`album-${id}`,
	);
}

export function useAlbumsByArtistId(
	artistId: string | null,
): UseQueryResult<SpotifyAlbum[]> {
	return useQuery(
		() => (artistId ? getAllAlbumsByArtistId(artistId) : Promise.resolve([])),
		`albums-by-artist-${artistId}`,
	);
}

export function useTracksByAlbumId(
	albumId: string | null,
): UseQueryResult<SpotifyTrack[]> {
	return useQuery(
		() => (albumId ? getTracksByAlbumId(albumId) : Promise.resolve([])),
		`tracks-by-album-${albumId}`,
	);
}

export function useTracksByArtistId(
	artistId: string | null,
): UseQueryResult<SpotifyTrack[]> {
	return useQuery(
		() => (artistId ? getTracksByArtistId(artistId) : Promise.resolve([])),
		`tracks-by-artist-${artistId}`,
	);
}
