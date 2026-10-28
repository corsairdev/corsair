import type { InstantlyEndpoints } from '..';
import { call } from './call';

export const get: InstantlyEndpoints['workspaceGet'] = (ctx, input) =>
	call(
		ctx,
		'workspaceGet',
		'workspace.get',
		input,
		() => ({ method: 'GET', path: '/workspaces/current' }),
		{ log: (_, workspace) => ({ planId: workspace.plan_id }) },
	);

export const update: InstantlyEndpoints['workspaceUpdate'] = (ctx, input) =>
	call(
		ctx,
		'workspaceUpdate',
		'workspace.update',
		input,
		(body) => ({ method: 'PATCH', path: '/workspaces/current', body }),
		{},
	);

export const scheduleRemoval: InstantlyEndpoints['workspaceScheduleRemoval'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceScheduleRemoval',
		'workspace.scheduleRemoval',
		input,
		() => ({
			method: 'POST',
			path: '/workspaces/current/schedule-for-removal',
		}),
		{},
	);

export const cancelRemoval: InstantlyEndpoints['workspaceCancelRemoval'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceCancelRemoval',
		'workspace.cancelRemoval',
		input,
		() => ({
			method: 'DELETE',
			path: '/workspaces/current/schedule-for-removal',
		}),
		{},
	);

export const setWhitelabelDomain: InstantlyEndpoints['workspaceSetWhitelabelDomain'] =
	(ctx, input) =>
		call(
			ctx,
			'workspaceSetWhitelabelDomain',
			'workspace.setWhitelabelDomain',
			input,
			(body) => ({
				method: 'POST',
				path: '/workspaces/current/whitelabel-domain',
				body,
			}),
			{},
		);

export const getWhitelabelDomain: InstantlyEndpoints['workspaceGetWhitelabelDomain'] =
	(ctx, input) =>
		call(
			ctx,
			'workspaceGetWhitelabelDomain',
			'workspace.getWhitelabelDomain',
			input,
			() => ({ method: 'GET', path: '/workspaces/current/whitelabel-domain' }),
			{},
		);

export const deleteWhitelabelDomain: InstantlyEndpoints['workspaceDeleteWhitelabelDomain'] =
	(ctx, input) =>
		call(
			ctx,
			'workspaceDeleteWhitelabelDomain',
			'workspace.deleteWhitelabelDomain',
			input,
			() => ({
				method: 'DELETE',
				path: '/workspaces/current/whitelabel-domain',
			}),
			{},
		);

export const changeOwner: InstantlyEndpoints['workspaceChangeOwner'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceChangeOwner',
		'workspace.changeOwner',
		input,
		(body) => ({
			method: 'POST',
			path: '/workspaces/current/change-owner',
			body,
		}),
		{},
	);
