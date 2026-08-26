import { logEventFromContext } from 'corsair/core';
import type { BetterContactEndpoints } from '..';
import { makeBetterContactRequest } from '../client';
import type { BetterContactEndpointOutputs } from './types';

export const get: BetterContactEndpoints['creditsGet'] = async (ctx, input) => {
	const response = await makeBetterContactRequest<
		BetterContactEndpointOutputs['creditsGet']
	>('account', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'bettercontact.credits.get',
		{ ...input },
		'completed',
	);
	return response;
};
