import { logEventFromContext } from 'corsair/core';
import { makeComposioRequest } from '../client';
import type { ComposioEndpoints } from '../index';
import { ComposioEndpointOutputSchemas } from './types';

export const list: ComposioEndpoints['toolkitsList'] = async (ctx, input) => {
	const response = await makeComposioRequest(
		'/toolkits',
		ctx.key,
		ComposioEndpointOutputSchemas.toolkitsList,
		{ query: input },
	);
	await logEventFromContext(ctx, 'composio.toolkits.list', input, 'completed');
	return response;
};
