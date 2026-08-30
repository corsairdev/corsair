import { logEventFromContext } from 'corsair/core';
import type { CastingwordsEndpoints } from '..';
import { makeCastingwordsRequest } from '../../client';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const getTranscript: CastingwordsEndpoints['getTranscript'] = async (ctx, input) => {
	const response = await makeCastingwordsRequest<unknown>(
		`audiofile/${encodeURIComponent(String(input.audiofileId))}/transcript.${input.extension}`,
		ctx.key,
		{ query: { test: input.test ? '1' : undefined } },
	);
	const parsed = CastingwordsEndpointOutputSchemas.getTranscript.parse(response);
	await logEventFromContext(
		ctx,
		'castingwords.get_transcript',
		{ audiofileId: input.audiofileId, extension: input.extension },
		'completed',
	);
	return parsed;
};
