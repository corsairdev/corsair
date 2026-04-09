import { logEventFromContext } from 'corsair/core';
import type { SpotifyEndpoints } from '..';
import { makeAuthenticatedSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const get: SpotifyEndpoints['tracksGet'] = async (ctx, input) => {
	const query: Record<string, string | undefined> = { ...input };

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['tracksGet']
	>(`tracks/${input.id}`, ctx, {
		method: 'GET',
		query,
	});

	if (result && ctx.db.tracks) {
		try {
			await ctx.db.tracks.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save track to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'spotify.tracks.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getAudioFeatures: SpotifyEndpoints['tracksGetAudioFeatures'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedSpotifyRequest<
			SpotifyEndpointOutputs['tracksGetAudioFeatures']
		>(`audio-features/${input.id}`, ctx, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'spotify.tracks.getAudioFeatures',
			{ ...input },
			'completed',
		);
		return result;
	};

export const search: SpotifyEndpoints['tracksSearch'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = { ...input };

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['tracksSearch']
	>('search', ctx, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.tracks.search',
		{ ...input },
		'completed',
	);
	return result;
};
