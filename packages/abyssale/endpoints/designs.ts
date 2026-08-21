import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import type { AbyssaleEndpointOutputs } from './types';

export const getDesigns: AbyssaleEndpoints['getDesigns'] = async (
	ctx,
	input,
) => {
	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['getDesigns']
	>('designs', ctx.key, {
		method: 'GET',
		query: {
			project_id: input.project_id,
			type: input.type,
		},
	});

	await logEventFromContext(
		ctx,
		'abyssale.designs.list',
		{ project_id: input.project_id, type: input.type },
		'completed',
	);
	return response;
};
