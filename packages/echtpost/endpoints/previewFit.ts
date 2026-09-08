import { logEventFromContext } from 'corsair/core';
import type { EchtpostEndpoints } from '..';
import { makeEchtpostRequest } from '../client';
import type { EchtpostEndpointOutputs } from './types';

export const previewFit: EchtpostEndpoints['previewFit'] = async (
	ctx,
	input,
) => {
	const response = await makeEchtpostRequest<
		EchtpostEndpointOutputs['previewFit']
	>('cards/preview_fit', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});
	await logEventFromContext(ctx, 'echtpost.cards.previewFit', {}, 'completed');
	return response;
};
