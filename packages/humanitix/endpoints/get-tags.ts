import { logEventFromContext } from 'corsair/core';
import type { HumanitixEndpoints } from '..';
import { makeHumanitixRequest } from '../client';
import type { HumanitixEndpointOutputs } from './types';

export const getTags: HumanitixEndpoints['getTags'] = async (ctx, input) => {
	const response = await makeHumanitixRequest<
		HumanitixEndpointOutputs['getTags']
	>('/tags', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			pageSize: input.pageSize,
		},
	});

	await logEventFromContext(
		ctx,
		'humanitix.tags.list',
		{ ...input },
		'completed',
	);
	return response;
};
