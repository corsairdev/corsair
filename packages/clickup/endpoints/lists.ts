import { logEventFromContext } from 'corsair/core';
import type { ClickupEndpoints } from '..';
import { makeClickupRequest } from '../client';
import type { ClickupEndpointOutputs } from './types';

export const list: ClickupEndpoints['listsList'] = async (ctx, input) => {
	const response = await makeClickupRequest<
		ClickupEndpointOutputs['listsList']
	>(`folder/${input.folder_id}/list`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'clickup.lists.list',
		{ ...input },
		'completed',
	);
	return response;
};
