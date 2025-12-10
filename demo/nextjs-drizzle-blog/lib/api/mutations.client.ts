'use client';

// Client-side mutation hooks (for Client Components)
// These simulate React Query / tRPC-style mutation hooks

import { useCallback, useState } from 'react';
import type { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/lib/types';
import {
	addArtistGenre,
	removeArtistGenre,
	toggleTrackExplicit,
	updateAlbumType,
	updateArtistPopularity,
} from './data';

// Generic mutation hook type
interface UseMutationResult<TData, TVariables> {
	mutate: (variables: TVariables) => Promise<void>;
	data: TData | null;
	isLoading: boolean;
	error: Error | null;
	reset: () => void;
}

// Generic mutation hook
function useMutation<TData, TVariables>(
	mutationFn: (variables: TVariables) => Promise<TData>,
): UseMutationResult<TData, TVariables> {
	const [data, setData] = useState<TData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const mutate = useCallback(
		async (variables: TVariables) => {
			setIsLoading(true);
			setError(null);
			try {
				const result = await mutationFn(variables);
				setData(result);
			} catch (err) {
				setError(err instanceof Error ? err : new Error('An error occurred'));
			} finally {
				setIsLoading(false);
			}
		},
		[mutationFn],
	);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
	}, []);

	return { mutate, data, isLoading, error, reset };
}

// ============================================
// MUTATION HOOKS
// ============================================

export function useUpdateArtistPopularity() {
	return useMutation<
		SpotifyArtist | null,
		{ artistId: string; popularity: number }
	>(({ artistId, popularity }) => updateArtistPopularity(artistId, popularity));
}

export function useUpdateAlbumType() {
	return useMutation<
		SpotifyAlbum | null,
		{ albumId: string; albumType: string }
	>(({ albumId, albumType }) => updateAlbumType(albumId, albumType));
}

export function useToggleTrackExplicit() {
	return useMutation<SpotifyTrack | null, { trackId: string }>(({ trackId }) =>
		toggleTrackExplicit(trackId),
	);
}

export function useAddArtistGenre() {
	return useMutation<SpotifyArtist | null, { artistId: string; genre: string }>(
		({ artistId, genre }) => addArtistGenre(artistId, genre),
	);
}

export function useRemoveArtistGenre() {
	return useMutation<SpotifyArtist | null, { artistId: string; genre: string }>(
		({ artistId, genre }) => removeArtistGenre(artistId, genre),
	);
}
