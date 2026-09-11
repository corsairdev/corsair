import { logEventFromContext } from 'corsair/core';
import type { ComposioEndpoints } from '..';
import { makeComposioRequest, omitUndefined } from '../client';
import type { ComposioEndpointOutputs } from './types';

export const list: ComposioEndpoints['connectionsList'] = async (
	ctx,
	input,
) => {
	const toolkitSlugs = input.toolkit_slugs ?? input.appName;
	const response = await makeComposioRequest<
		ComposioEndpointOutputs['connectionsList']
	>('/v3/connected_accounts', ctx.key, {
		method: 'GET',
		query: omitUndefined({
			toolkit_slugs: toolkitSlugs,
			statuses: input.statuses,
			user_ids: input.user_ids,
			auth_config_ids: input.auth_config_ids,
			limit: input.limit,
			cursor: input.cursor,
			account_type: input.account_type,
		}),
	});

	await logEventFromContext(
		ctx,
		'composio.connections.list',
		{
			toolkit_slugs: toolkitSlugs,
			statuses: input.statuses,
			limit: input.limit,
			// omit user_ids / auth_config_ids — PII / sensitive identifiers
		},
		'completed',
	);
	return response;
};

export const create: ComposioEndpoints['connectionCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeComposioRequest<
		ComposioEndpointOutputs['connectionCreate']
	>('/v3/connected_accounts/link', ctx.key, {
		method: 'POST',
		body: {
			auth_config_id: input.auth_config_id,
			user_id: input.user_id,
			...(input.alias ? { alias: input.alias } : {}),
			...(input.callback_url || input.redirectUri
				? { callback_url: input.callback_url ?? input.redirectUri }
				: {}),
		},
	});

	await logEventFromContext(
		ctx,
		'composio.connections.create',
		{ auth_config_id: input.auth_config_id },
		'completed',
	);
	return response;
};

export const deleteConnection: ComposioEndpoints['connectionDelete'] = async (
	ctx,
	input,
) => {
	const id = input.connected_account_id ?? input.connectionId;
	if (!id) {
		throw new Error('connected_account_id is required');
	}

	const response = await makeComposioRequest<
		ComposioEndpointOutputs['connectionDelete']
	>(`/v3/connected_accounts/${encodeURIComponent(id)}`, ctx.key, {
		method: 'DELETE',
		query: omitUndefined({
			revoke_on_delete: input.revoke_on_delete,
		}),
	});

	await logEventFromContext(
		ctx,
		'composio.connections.delete',
		{ connected_account_id: id },
		'completed',
	);
	return response;
};
