import { logEventFromContext } from 'corsair/core';
import { makeComposioRequest } from '../client';
import type { ComposioEndpoints } from '../index';
import { ComposioEndpointOutputSchemas } from './types';

export const create: ComposioEndpoints['sessionCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeComposioRequest(
		'/tool_router/session',
		ctx.key,
		ComposioEndpointOutputSchemas.sessionCreate,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'composio.sessions.create',
		{ session_id: response.session_id },
		'completed',
	);
	return response;
};
