import { logEventFromContext } from 'corsair/core';
import type { TwentyOneRiskEndpoints } from '..';
import { makeTwentyOneRiskRequest } from '../client';
import type { TwentyOneRiskEndpointOutputs } from './types';

export const get: TwentyOneRiskEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTwentyOneRiskRequest<
		TwentyOneRiskEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'twentyonerisk.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
