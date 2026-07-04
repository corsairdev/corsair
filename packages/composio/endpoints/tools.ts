import { logEventFromContext } from 'corsair/core';
import type { ComposioEndpoints } from '..';
import type { ComposioEndpointOutputs } from './types';
import { makeComposioRequest } from '../client';

export const list: ComposioEndpoints['toolsList'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['toolsList']>(
		'/v1/tools',
		ctx.key,
		{ method: 'GET', query: input as Record<string, string | number | boolean | undefined> },
	);

	await logEventFromContext(ctx, 'composio.tools.list', { ...input }, 'completed');
	return response;
};

export const get: ComposioEndpoints['toolGet'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['toolGet']>(
		`/v1/tools/${input.toolId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'composio.tools.get', { ...input }, 'completed');
	return response;
};
