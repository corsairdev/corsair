import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import type { DynapicturesEndpointOutputs } from './types';

/**
 * Lists available design templates defined in the Dynapictures account.
 *
 * @param ctx - Corsair plugin context containing API authentication key
 * @param input - Optional pagination parameters (limit and offset)
 * @returns Array of available template design definitions
 */
export const listTemplates: DynapicturesEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['listTemplates']
	>('templates', ctx.key, {
		method: 'GET',
		query: {
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'dynapictures.templates.list',
		{ ...input },
		'completed',
	);

	return response;
};
