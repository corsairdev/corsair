import { logEventFromContext } from 'corsair/core';
import type { BonsaiEndpoints } from '..';
import type { BonsaiEndpointOutputs } from './types';
import { makeBonsaiRequest } from '../client';

export const get: BonsaiEndpoints['clustersGet'] = async (ctx, input) => {
	const response = await makeBonsaiRequest<BonsaiEndpointOutputs['clustersGet']>(
		`clusters/${input.slug}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'bonsai.clusters.get', { ...input }, 'completed');
	return response;
};

export const Clusters = {
	get,
} as const;
