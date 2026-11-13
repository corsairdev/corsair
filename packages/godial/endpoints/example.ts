import { logEventFromContext } from 'corsair/core';
import type { GoDialEndpoints } from '..';
import type { GoDialEndpointOutputs } from './types';
import { makeGoDialRequest } from '../client';

export const get: GoDialEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGoDialRequest<GoDialEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'godial.example.get', { ...input }, 'completed');
	return response;
};
