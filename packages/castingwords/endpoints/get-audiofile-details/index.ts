import { logEventFromContext } from 'corsair/core';
import { makeCastingwordsRequest } from '../../client';
import type { CastingwordsEndpoints } from '..';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const getAudiofileDetails: CastingwordsEndpoints['getAudiofileDetails'] =
	async (ctx, input) => {
		const response = await makeCastingwordsRequest<unknown>(
			`audiofile/${encodeURIComponent(String(input.audiofileId))}`,
			ctx.key,
		);
		const parsed =
			CastingwordsEndpointOutputSchemas.getAudiofileDetails.parse(response);
		await logEventFromContext(
			ctx,
			'castingwords.get_audiofile_details',
			{ audiofileId: input.audiofileId },
			'completed',
		);
		return parsed;
	};
