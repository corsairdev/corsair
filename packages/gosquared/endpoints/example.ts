import { logEventFromContext } from 'corsair/core';
import type { GoSquaredEndpoints } from '..';
import type { GoSquaredEndpointOutputs } from './types';
import { makeGoSquaredRequest } from '../client';

export const get: GoSquaredEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGoSquaredRequest<GoSquaredEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'gosquared.example.get', { ...input }, 'completed');
	return response;
};
