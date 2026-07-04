import { logEventFromContext } from 'corsair/core';
import type { ComposioEndpoints } from '..';
import type { ComposioEndpointOutputs } from './types';
import { makeComposioRequest } from '../client';

export const list: ComposioEndpoints['actionsList'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['actionsList']>(
		'/v1/actions',
		ctx.key,
		{ method: 'GET', query: input as Record<string, string | number | boolean | undefined> },
	);

	await logEventFromContext(ctx, 'composio.actions.list', { ...input }, 'completed');
	return response;
};

export const get: ComposioEndpoints['actionGet'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['actionGet']>(
		`/v1/actions/${input.actionId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'composio.actions.get', { ...input }, 'completed');
	return response;
};

export const execute: ComposioEndpoints['actionExecute'] = async (ctx, input) => {
	const response = await makeComposioRequest<ComposioEndpointOutputs['actionExecute']>(
		'/v1/actions/execute',
		ctx.key,
		{
			method: 'POST',
			body: {
				actionId: input.actionId,
				appName: input.appName,
				input: input.input,
				...(input.connectionId ? { connectionId: input.connectionId } : {}),
			},
		},
	);

	await logEventFromContext(ctx, 'composio.actions.execute', { actionId: input.actionId, appName: input.appName }, 'completed');
	return response;
};
