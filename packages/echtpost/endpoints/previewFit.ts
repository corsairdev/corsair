import { logEventFromContext } from 'corsair/core';
import type { EchtpostEndpoints } from '..';
import { makeEchtpostRequest } from '../client';
import {
	EchtpostEndpointInputSchemas,
	EchtpostEndpointOutputSchemas,
} from './types';

export const previewFit: EchtpostEndpoints['previewFit'] = async (
	ctx,
	input,
) => {
	const validatedInput = EchtpostEndpointInputSchemas.previewFit.parse(input);
	const raw = await makeEchtpostRequest<unknown>('cards/preview_fit', ctx.key, {
		method: 'POST',
		body: validatedInput as Record<string, unknown>,
	});
	const response = EchtpostEndpointOutputSchemas.previewFit.parse(raw);
	try {
		await logEventFromContext(
			ctx,
			'echtpost.cards.previewFit',
			{},
			'completed',
		);
	} catch {
		/* best effort */
	}
	return response;
};
