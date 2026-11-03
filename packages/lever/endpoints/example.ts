import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import type { LeverEndpointOutputs } from './types';
import { makeLeverRequest } from '../client';

export const get: LeverEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['exampleGet']>(
		ctx,
		`example/${input.id}`,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'lever.example.get', { ...input }, 'completed');
	return response;
};
