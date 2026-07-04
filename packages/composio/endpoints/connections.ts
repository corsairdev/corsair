import { logEventFromContext } from 'corsair/core';
import type { ComposioEndpoints } from '..';
import type { ComposioEndpointOutputs } from './types';
import { makeComposioRequest } from '../client';

export const list: ComposioEndpoints['connectionsList'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['connectionsList']>(
		'/v1/connections',
		ctx.key,
		{ method: 'GET', query: input as Record<string, string | number | boolean | undefined> },
	);

	await logEventFromContext(ctx, 'composio.connections.list', { ...input }, 'completed');
	return response;
};

export const create: ComposioEndpoints['connectionCreate'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['connectionCreate']>(
		'/v1/connections',
		ctx.key,
		{
			method: 'POST',
			body: {
				appName: input.appName,
				...(input.integrationId ? { integrationId: input.integrationId } : {}),
				...(input.authConfig ? { authConfig: input.authConfig } : {}),
				...(input.redirectUri ? { redirectUri: input.redirectUri } : {}),
			},
		},
	);

	await logEventFromContext(ctx, 'composio.connections.create', { appName: input.appName }, 'completed');
	return response;
};

export const deleteConnection: ComposioEndpoints['connectionDelete'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['connectionDelete']>(
		`/v1/connections/${input.connectionId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'composio.connections.delete', { ...input }, 'completed');
	return response;
};
