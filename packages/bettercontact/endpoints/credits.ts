import { logEventFromContext } from 'corsair/core';
import type { BetterContactEndpoints } from '..';
import { makeBetterContactRequest } from '../client';
import { BetterContactEndpointOutputSchemas } from './types';

export const get: BetterContactEndpoints['creditsGet'] = async (ctx, input) => {
	const raw = await makeBetterContactRequest<unknown>('account', ctx.key, {
		method: 'GET',
	});

	const response = BetterContactEndpointOutputSchemas.creditsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'bettercontact.credits.get',
		{ ...input },
		'completed',
	);
	return response;
};
