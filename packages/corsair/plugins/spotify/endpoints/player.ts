import type { SpotifyEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeSpotifyRequest } from '../client';
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

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playerAddToQueue']
	>('me/player/queue', ctx.key, {
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

		const result = await makeSpotifyRequest<
			SpotifyEndpointOutputs['playerGetCurrentlyPlaying']
		>('me/player/currently-playing', ctx.key, {
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

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playerSkipToNext']
	>('me/player/next', ctx.key, {
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

	const result = await makeSpotifyRequest<SpotifyEndpointOutputs['playerPause']>(
		'me/player/pause',
		ctx.key,
		{
			method: 'PUT',
			query,
		},
	);

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

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playerSkipToPrevious']
	>('me/player/previous', ctx.key, {
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

		const result = await makeSpotifyRequest<
			SpotifyEndpointOutputs['playerGetRecentlyPlayed']
		>('me/player/recently-played', ctx.key, {
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

	const result = await makeSpotifyRequest<SpotifyEndpointOutputs['playerResume']>(
		'me/player/play',
		ctx.key,
		{
			method: 'PUT',
			query,
		},
	);

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

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playerSetVolume']
	>('me/player/volume', ctx.key, {
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

	const body: Record<string, unknown> = {};
	if (input.context_uri) {
		body.context_uri = input.context_uri;
	}
	if (input.uris) {
		body.uris = input.uris;
	}
	if (input.offset) {
		body.offset = input.offset;
	}
	if (input.position_ms) {
		body.position_ms = input.position_ms;
	}

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playerStartPlayback']
	>('me/player/play', ctx.key, {
		method: 'PUT',
		query,
		body: Object.keys(body).length > 0 ? body : undefined,
	});

	await logEventFromContext(
		ctx,
		'spotify.player.startPlayback',
		{ ...input },
		'completed',
	);
	return result;
};