import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import { cacheEntities, parseInput, parseOutput } from './shared';
import type { AbyssaleEndpointOutputs } from './types';

export const getFonts: AbyssaleEndpoints['getFonts'] = async (ctx, input) => {
	const args = parseInput('getFonts', input);

	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['getFonts']
	>('fonts', ctx.key, {
		method: 'GET',
		query: {
			type: args.type,
		},
	});

	const result = parseOutput('getFonts', response);

	await cacheEntities(ctx, 'fonts', result);

	await logEventFromContext(
		ctx,
		'abyssale.fonts.list',
		{ type: args.type },
		'completed',
	);
	return result;
};
