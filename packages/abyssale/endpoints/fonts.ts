import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import { cacheEntities } from './shared';
import type { AbyssaleEndpointOutputs } from './types';

export const getFonts: AbyssaleEndpoints['getFonts'] = async (ctx, input) => {
	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['getFonts']
	>('fonts', ctx.key, {
		method: 'GET',
		query: {
			type: input.type,
		},
	});

	await cacheEntities(ctx, 'fonts', response);

	await logEventFromContext(
		ctx,
		'abyssale.fonts.list',
		{ type: input.type },
		'completed',
	);
	return response;
};
