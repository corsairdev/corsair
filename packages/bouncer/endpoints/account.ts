import { logEventFromContext } from 'corsair/core';
import type { BouncerEndpoints } from '..';
import { makeBouncerRequest } from '../client';
import { GetCreditsResponseSchema } from './types';

export const getCredits: BouncerEndpoints['getCredits'] = async (
	ctx,
	_input,
) => {
	const raw = await makeBouncerRequest<unknown>('v1.1/credits', ctx.key, {
		method: 'GET',
	});
	// Validated at runtime: the provider response is not typed at compile time.
	const response = GetCreditsResponseSchema.parse(raw);

	await logEventFromContext(ctx, 'bouncer.account.getCredits', {}, 'completed');
	return response;
};
