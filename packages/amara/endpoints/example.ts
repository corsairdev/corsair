import { logEventFromContext } from 'corsair/core';
import type { AmaraEndpoints } from '..';
import type { AmaraEndpointOutputs } from './types';
import { makeAmaraRequest } from '../client';

export const get: AmaraEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAmaraRequest<AmaraEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'amara.example.get', { ...input }, 'completed');
	return response;
};
