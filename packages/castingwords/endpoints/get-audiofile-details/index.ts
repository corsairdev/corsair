import { logEventFromContext } from 'corsair/core';
import type { CastingwordsEndpoints } from '..';
import { makeCastingwordsRequest } from '../../client';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const getAudiofileDetails: CastingwordsEndpoints['getAudiofileDetails'] = async (
	ctx,
	input,
) => {
	const response = await makeCastingwordsRequest<unknown>(
		`audiofile/${encodeURIComponent(String(input.audiofileId))}`,
		ctx.key,
	);
	const parsed = CastingwordsEndpointOutputSchemas.getAudiofileDetails.parse(response);
	await logEventFromContext(
		ctx,
		'castingwords.get_audiofile_details',
		{ audiofileId: input.audiofileId },
		'completed',
	);
	return parsed;
};
