import { logEventFromContext } from 'corsair/core';
import type { MetaAdsEndpoints } from '..';
import type { MetaAdsEndpointOutputs } from './types';
import { makeMetaAdsRequest } from '../client';

export const get: MetaAdsEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeMetaAdsRequest<MetaAdsEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'metaads.example.get', { ...input }, 'completed');
	return response;
};
