import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import type { ZohoBiginEndpointOutputs } from './types';
import { makeZohoBiginRequest } from '../client';

export const get: ZohoBiginEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'zohobigin.example.get', { ...input }, 'completed');
	return response;
};
