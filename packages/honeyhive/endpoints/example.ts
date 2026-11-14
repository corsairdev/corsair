import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveEndpoints } from '..';
import type { HoneyHiveEndpointOutputs } from './types';
import { makeHoneyHiveRequest } from '../client';

export const get: HoneyHiveEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeHoneyHiveRequest<HoneyHiveEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'honeyhive.example.get', { ...input }, 'completed');
	return response;
};
