import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import type { SalesflareEndpointOutputs } from './types';

export const listPipelines: SalesflareEndpoints['listPipelines'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listPipelines']
	>(ctx, '/pipelines', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.pipelines.listPipelines',
		input,
		'completed',
	);
	return response;
};
