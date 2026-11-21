import { logEventFromContext } from 'corsair/core';
import type { MetabaseEndpoints } from '..';
import type { MetabaseEndpointOutputs } from './types';
import { makeMetabaseRequest } from '../client';

export const get: MetabaseEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeMetabaseRequest<MetabaseEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'metabase.example.get', { ...input }, 'completed');
	return response;
};
