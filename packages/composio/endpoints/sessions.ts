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
	if (ctx.db.sessions) {
		try {
			await ctx.db.sessions.upsertByEntityId(response.session_id, {
				id: response.session_id,
				session_id: response.session_id,
				user_id: input.user_id,
				mcp: response.mcp,
				tool_router_tools: response.tool_router_tools,
				config_version: response.config_version,
			});
		} catch (error) {
			console.warn(
				`[composio] failed to save session ${response.session_id}:`,
				error,
			);
		}
	}
	await logEventFromContext(
		ctx,
		'composio.sessions.create',
		{ session_id: response.session_id },
		'completed',
	);
	return response;
};
