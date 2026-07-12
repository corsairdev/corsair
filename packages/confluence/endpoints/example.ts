import { logEventFromContext } from 'corsair/core';
import type { ConfluenceEndpoints } from '..';
import type { ConfluenceEndpointOutputs } from './types';
import { makeConfluenceRequest } from '../client';

export const get: ConfluenceEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeConfluenceRequest<ConfluenceEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'confluence.example.get', { ...input }, 'completed');
	return response;
};
