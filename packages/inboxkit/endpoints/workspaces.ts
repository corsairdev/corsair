import type { InboxkitEndpoints } from '..';
import { call } from './call';
import { forgetWorkspace, saveWorkspaces } from './store';

export const list: InboxkitEndpoints['workspacesList'] = (ctx, input) =>
	call(
		ctx,
		'workspacesList',
		input,
		() => ({ method: 'GET', path: '/v1/api/workspaces/list' }),
		{ after: (result) => saveWorkspaces(ctx, result.workspaces ?? []) },
	);

export const get: InboxkitEndpoints['workspacesGet'] = (ctx, input) =>
	call(ctx, 'workspacesGet', input, (query) => ({
		method: 'GET',
		path: '/v1/api/workspaces/details',
		query,
	}));

export const create: InboxkitEndpoints['workspacesCreate'] = (ctx, input) =>
	call(ctx, 'workspacesCreate', input, (body) => ({
		method: 'POST',
		path: '/v1/api/workspaces/create',
		body,
	}));

export const update: InboxkitEndpoints['workspacesUpdate'] = (ctx, input) =>
	call(ctx, 'workspacesUpdate', input, (body) => ({
		method: 'PUT',
		path: '/v1/api/workspaces/update',
		body,
	}));

export const deleteOp: InboxkitEndpoints['workspacesDelete'] = (ctx, input) =>
	call(
		ctx,
		'workspacesDelete',
		input,
		(query) => ({ method: 'DELETE', path: '/v1/api/workspaces/delete', query }),
		{ onSuccess: ({ uid }) => forgetWorkspace(ctx, uid) },
	);

export const updateWebhook: InboxkitEndpoints['workspacesUpdateWebhook'] = (
	ctx,
	input,
) =>
	call(ctx, 'workspacesUpdateWebhook', input, (body) => ({
		method: 'POST',
		path: '/v1/api/workspaces/webhook',
		body,
	}));

export const inviteMember: InboxkitEndpoints['workspacesInviteMember'] = (
	ctx,
	input,
) =>
	call(ctx, 'workspacesInviteMember', input, (body) => ({
		method: 'POST',
		path: '/v1/api/workspaces/invite',
		body,
	}));
