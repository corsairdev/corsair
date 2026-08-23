import { logEventFromContext } from 'corsair/core';
import type { BouncerEndpoints } from '..';
import { makeBouncerRequest } from '../client';
import type { BouncerEndpointOutputs } from './types';

export const getCredits: BouncerEndpoints['getCredits'] = async (
	ctx,
	_input,
) => {
	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['getCredits']
	>('credits', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'bouncer.account.getCredits', {}, 'completed');
	return response;
};
