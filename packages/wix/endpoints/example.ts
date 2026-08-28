import { logEventFromContext } from 'corsair/core';
import type { WixEndpoints } from '..';
import type { WixEndpointOutputs } from './types';
import { makeWixRequest } from '../client';

export const get: WixEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeWixRequest<WixEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'wix.example.get', { ...input }, 'completed');
	return response;
};
