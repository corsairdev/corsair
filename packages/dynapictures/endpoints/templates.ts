import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import type { DynapicturesEndpointOutputs } from './types';

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
