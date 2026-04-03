import { logEventFromContext } from '../../utils/events';
import type { SpotifyEndpoints } from '..';
import { makeAuthenticatedSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const addToQueue: SpotifyEndpoints['playerAddToQueue'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | undefined> = {
		uri: input.uri,
	};
	if (input.device_id) {
		query.device_id = input.device_id;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playerAddToQueue']
	>('me/player/queue', ctx, {
		method: 'POST',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.player.addToQueue',
		{ ...input },
		'completed',
	);
	return result;
};

export const getCurrentlyPlaying: SpotifyEndpoints['playerGetCurrentlyPlaying'] =
	async (ctx, input) => {
		const query: Record<string, string | undefined> = {};
		if (input.market) {
			query.market = input.market;
		}
		if (input.additional_types) {
			query.additional_types = input.additional_types;
		}

		const result = await makeAuthenticatedSpotifyRequest<
			SpotifyEndpointOutputs['playerGetCurrentlyPlaying']
		>('me/player/currently-playing', ctx, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'spotify.player.getCurrentlyPlaying',
			{ ...input },
			'completed',
		);
		return result;
	};

export const skipToNext: SpotifyEndpoints['playerSkipToNext'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | undefined> = {};
	if (input.device_id) {
		query.device_id = input.device_id;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playerSkipToNext']
	>('me/player/next', ctx, {
		method: 'POST',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.player.skipToNext',
		{ ...input },
		'completed',
	);
	return result;
};

export const pause: SpotifyEndpoints['playerPause'] = async (ctx, input) => {
	const query: Record<string, string | undefined> = {};
	if (input.device_id) {
		query.device_id = input.device_id;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playerPause']
	>('me/player/pause', ctx, {
		method: 'PUT',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.player.pause',
		{ ...input },
		'completed',
	);
	return result;
};

export const skipToPrevious: SpotifyEndpoints['playerSkipToPrevious'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | undefined> = {};
	if (input.device_id) {
		query.device_id = input.device_id;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playerSkipToPrevious']
	>('me/player/previous', ctx, {
		method: 'POST',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.player.skipToPrevious',
		{ ...input },
		'completed',
	);
	return result;
};

export const getRecentlyPlayed: SpotifyEndpoints['playerGetRecentlyPlayed'] =
	async (ctx, input) => {
		const query: Record<string, string | number | undefined> = {};
		if (input.limit) {
			query.limit = input.limit;
		}
		if (input.after) {
			query.after = input.after;
		}
		if (input.before) {
			query.before = input.before;
		}

		const result = await makeAuthenticatedSpotifyRequest<
			SpotifyEndpointOutputs['playerGetRecentlyPlayed']
		>('me/player/recently-played', ctx, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'spotify.player.getRecentlyPlayed',
			{ ...input },
			'completed',
		);
		return result;
	};

export const resume: SpotifyEndpoints['playerResume'] = async (ctx, input) => {
	const query: Record<string, string | undefined> = {};
	if (input.device_id) {
		query.device_id = input.device_id;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playerResume']
	>('me/player/play', ctx, {
		method: 'PUT',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.player.resume',
		{ ...input },
		'completed',
	);
	return result;
};

export const setVolume: SpotifyEndpoints['playerSetVolume'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {
		volume_percent: input.volume_percent,
	};
	if (input.device_id) {
		query.device_id = input.device_id;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playerSetVolume']
	>('me/player/volume', ctx, {
		method: 'PUT',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.player.setVolume',
		{ ...input },
		'completed',
	);
	return result;
};

export const startPlayback: SpotifyEndpoints['playerStartPlayback'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | undefined> = {};
	if (input.device_id) {
		query.device_id = input.device_id;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playerStartPlayback']
	>('me/player/play', ctx, {
		method: 'PUT',
		query,
		body: input,
	});

	await logEventFromContext(
		ctx,
		'spotify.player.startPlayback',
		{ ...input },
		'completed',
	);
	return result;
};
