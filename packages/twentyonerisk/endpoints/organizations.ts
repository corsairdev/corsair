import { logEventFromContext } from 'corsair/core';
import type { TwentyOneRiskEndpoints } from '..';
import { makeTwentyOneRiskRequest } from '../client';
import type { TwentyOneRiskEndpointOutputs } from './types';

export const get: TwentyOneRiskEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeTwentyOneRiskRequest<
		TwentyOneRiskEndpointOutputs['organizationsGet']
	>('organizations', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'twentyonerisk.organizations.get',
		{ ...input },
		'completed',
	);

	return response;
};
