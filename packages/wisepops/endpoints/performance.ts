import { logEventFromContext } from 'corsair/core';
import type { WisepopsEndpoints } from '..';
import { makeWisepopsRequest } from '../client';
import type { WisepopsEndpointOutputs } from './types';

export const get: WisepopsEndpoints['performanceGet'] = async (ctx, input) => {
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['performanceGet']
	>('api2/wisepops', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'wisepops.performance.get',
		{ ...input },
		'completed',
	);
	return response;
};
