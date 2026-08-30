import { logEventFromContext } from 'corsair/core';
import type { CastingwordsEndpoints } from '..';
import { makeCastingwordsRequest } from '../../client';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const refundAudiofile: CastingwordsEndpoints['refundAudiofile'] = async (ctx, input) => {
	const response = await makeCastingwordsRequest<unknown>(
		`audiofile/${encodeURIComponent(String(input.audiofileId))}/refund`,
		ctx.key,
		{ method: 'POST', form: { test: input.test ? '1' : undefined } },
	);
	const parsed = CastingwordsEndpointOutputSchemas.refundAudiofile.parse(
		typeof response === 'string' ? { message: response } : response,
	);
	await logEventFromContext(
		ctx,
		'castingwords.refund_audiofile',
		{ audiofileId: input.audiofileId },
		'completed',
	);
	return parsed;
};
