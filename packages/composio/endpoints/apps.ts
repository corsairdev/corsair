import { logEventFromContext } from 'corsair/core';
import type { ComposioEndpoints } from '..';
import type { ComposioEndpointOutputs } from './types';
import { makeComposioRequest } from '../client';

export const list: ComposioEndpoints['appsList'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['appsList']>(
		'/v1/apps',
		ctx.key,
		{ method: 'GET', query: input as Record<string, string | number | boolean | undefined> },
	);

	await logEventFromContext(ctx, 'composio.apps.list', { ...input }, 'completed');
	return response;
};
