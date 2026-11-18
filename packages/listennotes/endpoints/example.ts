import { logEventFromContext } from 'corsair/core';
import type { ListenNotesEndpoints } from '..';
import type { ListenNotesEndpointOutputs } from './types';
import { makeListenNotesRequest } from '../client';

export const get: ListenNotesEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeListenNotesRequest<ListenNotesEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'listennotes.example.get', { ...input }, 'completed');
	return response;
};
