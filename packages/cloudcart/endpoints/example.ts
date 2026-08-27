import { logEventFromContext } from 'corsair/core';
import type { CloudcartEndpoints } from '..';
import type { CloudcartEndpointOutputs } from './types';
import { makeCloudcartRequest } from '../client';

export const get: CloudcartEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCloudcartRequest<CloudcartEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'cloudcart.example.get', { ...input }, 'completed');
	return response;
};
