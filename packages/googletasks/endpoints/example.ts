import { logEventFromContext } from 'corsair/core';
import type { GoogleTasksEndpoints } from '..';
import type { GoogleTasksEndpointOutputs } from './types';
import { makeGoogleTasksRequest } from '../client';

export const get: GoogleTasksEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGoogleTasksRequest<GoogleTasksEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'googletasks.example.get', { ...input }, 'completed');
	return response;
};
