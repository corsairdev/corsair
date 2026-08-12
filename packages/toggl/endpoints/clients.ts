import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheClient, evictEntity } from './persist';
import type { TogglEndpointOutputs } from './types';

export const list: TogglEndpoints['clientsList'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['clientsList']>(
		`workspaces/${input.workspace_id}/clients`,
		ctx.key,
		{
			method: 'GET',
			query: { status: input.status, name: input.name },
		},
	);

	// Toggl answers a workspace with no clients with `null` rather than [].
	const clients = result ?? [];

	for (const client of clients) {
		await cacheClient(ctx.db.clients, client);
	}

	await logEventFromContext(
		ctx,
		'toggl.clients.list',
		auditPayload(input, ['workspace_id', 'status']),
		'completed',
	);
	return clients;
};

export const get: TogglEndpoints['clientsGet'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['clientsGet']>(
		`workspaces/${input.workspace_id}/clients/${input.client_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await cacheClient(ctx.db.clients, result);

	await logEventFromContext(
		ctx,
		'toggl.clients.get',
		auditPayload(input, ['workspace_id', 'client_id']),
		'completed',
	);
	return result;
};

export const create: TogglEndpoints['clientsCreate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['clientsCreate']>(
		`workspaces/${input.workspace_id}/clients`,
		ctx.key,
		{
			method: 'POST',
			body: { name: input.name, wid: input.workspace_id, notes: input.notes },
		},
	);

	await cacheClient(ctx.db.clients, result);

	await logEventFromContext(
		ctx,
		'toggl.clients.create',
		auditPayload(input, ['workspace_id']),
		'completed',
	);
	return result;
};

export const update: TogglEndpoints['clientsUpdate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['clientsUpdate']>(
		`workspaces/${input.workspace_id}/clients/${input.client_id}`,
		ctx.key,
		{
			method: 'PUT',
			// Toggl requires name on every update, and archiving is a separate route.
			body: { name: input.name, notes: input.notes },
		},
	);

	await cacheClient(ctx.db.clients, result);

	await logEventFromContext(
		ctx,
		'toggl.clients.update',
		auditPayload(input, ['workspace_id', 'client_id']),
		'completed',
	);
	return result;
};

export const remove: TogglEndpoints['clientsDelete'] = async (ctx, input) => {
	await makeTogglRequest<unknown>(
		`workspaces/${input.workspace_id}/clients/${input.client_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.clients, input.client_id, 'client');

	await logEventFromContext(
		ctx,
		'toggl.clients.delete',
		auditPayload(input, ['workspace_id', 'client_id']),
		'completed',
	);
	// Toggl returns an empty body on a successful delete.
	return { deleted: true, id: input.client_id };
};

/**
 * Archives a client. Toggl exposes this as its own route rather than an
 * `archived` field on the update call.
 */
export const archive: TogglEndpoints['clientsArchive'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['clientsArchive']>(
		`workspaces/${input.workspace_id}/clients/${input.client_id}/archive`,
		ctx.key,
		{ method: 'POST' },
	);

	await cacheClient(ctx.db.clients, result);

	await logEventFromContext(
		ctx,
		'toggl.clients.archive',
		auditPayload(input, ['workspace_id', 'client_id']),
		'completed',
	);
	return result;
};
