import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpointOutputs } from './types';

export const listTemplates: DynapicturesEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['listTemplates']
	>('templates', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'dynapictures.templates.list',
		{ ...input },
		'completed',
	);
	return response;
};
