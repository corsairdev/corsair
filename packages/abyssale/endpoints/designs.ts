import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import { cacheEntities, parseInput, parseOutput } from './shared';
import type { AbyssaleEndpointOutputs } from './types';

export const getDesigns: AbyssaleEndpoints['getDesigns'] = async (
	ctx,
	input,
) => {
	const args = parseInput('getDesigns', input);

	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['getDesigns']
	>('designs', ctx.key, {
		method: 'GET',
		query: {
			project_id: args.project_id,
			type: args.type,
		},
	});

	const result = parseOutput('getDesigns', response);

	await cacheEntities(ctx, 'designs', result);

	await logEventFromContext(
		ctx,
		'abyssale.designs.list',
		{ project_id: args.project_id, type: args.type },
		'completed',
	);
	return result;
};
