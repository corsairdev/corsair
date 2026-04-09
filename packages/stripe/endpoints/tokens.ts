import { logEventFromContext } from 'corsair/core';
import type { StripeEndpoints } from '..';
import { makeStripeRequest } from '../client';
import type { StripeEndpointOutputs } from './types';

export const create: StripeEndpoints['tokensCreate'] = async (ctx, input) => {
	const result = await makeStripeRequest<StripeEndpointOutputs['tokensCreate']>(
		'tokens',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(
		ctx,
		'stripe.tokens.create',
		{ ...input },
		'completed',
	);
	return result;
};
