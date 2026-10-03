import { logEventFromContext } from 'corsair/core';
import type { ClickupEndpoints } from '..';
import { makeClickupRequest } from '../client';
import type { ClickupEndpointOutputs } from './types';

export const list: ClickupEndpoints['foldersList'] = async (ctx, input) => {
	const response = await makeClickupRequest<
		ClickupEndpointOutputs['foldersList']
	>(`space/${input.space_id}/folder`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'clickup.folders.list',
		{ ...input },
		'completed',
	);
	return response;
};
