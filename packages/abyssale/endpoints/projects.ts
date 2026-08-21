import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import type { AbyssaleEndpointOutputs } from './types';

export const createProject: AbyssaleEndpoints['createProject'] = async (
	ctx,
	input,
) => {
	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['createProject']
	>('projects', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
		},
	});

	await logEventFromContext(
		ctx,
		'abyssale.projects.create',
		{ name: input.name },
		'completed',
	);
	return response;
};
