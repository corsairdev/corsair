import { logEventFromContext } from 'corsair/core';
import { makeComposioRequest } from '../client';
import type { ComposioEndpoints } from '../index';
import { ComposioEndpointOutputSchemas } from './types';

export const list: ComposioEndpoints['connectionsList'] = async (
	ctx,
	input,
) => {
	const response = await makeComposioRequest(
		'/connected_accounts',
		ctx.key,
		ComposioEndpointOutputSchemas.connectionsList,
		{ query: input },
	);
	// user_ids and auth_config_ids identify end users, so they stay out of logs.
	await logEventFromContext(
		ctx,
		'composio.connections.list',
		{ toolkit_slugs: input.toolkit_slugs, statuses: input.statuses },
		'completed',
	);
	return response;
};

export const create: ComposioEndpoints['connectionCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeComposioRequest(
		'/connected_accounts/link',
		ctx.key,
		ComposioEndpointOutputSchemas.connectionCreate,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'composio.connections.create',
		{ auth_config_id: input.auth_config_id },
		'completed',
	);
	return response;
};

export const remove: ComposioEndpoints['connectionDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeComposioRequest(
		`/connected_accounts/${encodeURIComponent(input.connected_account_id)}`,
		ctx.key,
		ComposioEndpointOutputSchemas.connectionDelete,
		{ method: 'DELETE', query: { revoke_on_delete: input.revoke_on_delete } },
	);
	await logEventFromContext(
		ctx,
		'composio.connections.delete',
		{ connected_account_id: input.connected_account_id },
		'completed',
	);
	return response;
};
