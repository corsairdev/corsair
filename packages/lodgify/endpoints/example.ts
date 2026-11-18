import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import type { LodgifyEndpointOutputs } from './types';
import { makeLodgifyRequest } from '../client';

export const get: LodgifyEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeLodgifyRequest<LodgifyEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'lodgify.example.get', { ...input }, 'completed');
	return response;
};
