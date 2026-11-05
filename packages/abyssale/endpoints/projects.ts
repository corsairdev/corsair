import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import { cacheEntities, parseInput, parseOutput } from './shared';
import type { AbyssaleEndpointOutputs } from './types';

export const createProject: AbyssaleEndpoints['createProject'] = async (
	ctx,
	input,
) => {
	const args = parseInput('createProject', input);

	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['createProject']
	>('projects', ctx.key, {
		method: 'POST',
		body: {
			name: args.name,
		},
	});

	const result = parseOutput('createProject', response);

	await cacheEntities(ctx, 'projects', [result]);

	await logEventFromContext(
		ctx,
		'abyssale.projects.create',
		{ name: args.name },
		'completed',
	);
	return result;
};
