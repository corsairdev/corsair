import { logEventFromContext } from 'corsair/core';
import type { EchtpostEndpoints } from '..';
import { makeEchtpostRequest } from '../client';
import type { EchtpostEndpointOutputs } from './types';

export const createCard: EchtpostEndpoints['createCard'] = async (
	ctx,
	input,
) => {
	const response = await makeEchtpostRequest<
		EchtpostEndpointOutputs['createCard']
	>('cards', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});
	await logEventFromContext(
		ctx,
		'echtpost.cards.create',
		{ motive_id: input.motive_id },
		'completed',
	);
	return response;
};
