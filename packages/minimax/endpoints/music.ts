import { logEventFromContext } from 'corsair/core';
import type { MinimaxEndpoints } from '..';
import { makeMinimaxRequest } from '../client';
import type {
	MusicCoverPreprocessOutput,
	MusicGenerateLyricsOutput,
	MusicGenerateOutput,
} from './types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './types';

export const generate: MinimaxEndpoints['musicGenerate'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.musicGenerate.parse(input);

	const response = await makeMinimaxRequest<MusicGenerateOutput>(
		'/v1/music_generation',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.musicGenerate.parse(response);

	// Lyrics and prompts are user content; only flags and counts are logged.
	await logEventFromContext(
		ctx,
		'minimax.music.generate',
		{
			model: parsedInput.model,
			hasLyrics: parsedInput.lyrics !== undefined,
			instrumental: parsedInput.is_instrumental ?? false,
		},
		'completed',
	);

	return parsed;
};

export const coverPreprocess: MinimaxEndpoints['musicCoverPreprocess'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MinimaxEndpointInputSchemas.musicCoverPreprocess.parse(input);

	const response = await makeMinimaxRequest<MusicCoverPreprocessOutput>(
		'/v1/music_cover_preprocess',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed =
		MinimaxEndpointOutputSchemas.musicCoverPreprocess.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.music.coverPreprocess',
		{ model: parsedInput.model },
		'completed',
	);

	return parsed;
};

export const generateLyrics: MinimaxEndpoints['musicGenerateLyrics'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MinimaxEndpointInputSchemas.musicGenerateLyrics.parse(input);

	const response = await makeMinimaxRequest<MusicGenerateLyricsOutput>(
		'/v1/lyrics_generation',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed =
		MinimaxEndpointOutputSchemas.musicGenerateLyrics.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.music.generateLyrics',
		{ mode: parsedInput.mode },
		'completed',
	);

	return parsed;
};
