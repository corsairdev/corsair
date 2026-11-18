import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const createMember: InstantlyEndpoints['workspaceMembersCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceMembersCreate',
		'workspaceMembers.create',
		input,
		(body) => ({ method: 'POST', path: '/workspace-members', body }),
		{},
	);

export const listMembers: InstantlyEndpoints['workspaceMembersList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceMembersList',
		'workspaceMembers.list',
		input,
		(query) => ({ method: 'GET', path: '/workspace-members', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const getMember: InstantlyEndpoints['workspaceMembersGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceMembersGet',
		'workspaceMembers.get',
		input,
		({ id }) => ({ method: 'GET', path: `/workspace-members/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const updateMember: InstantlyEndpoints['workspaceMembersUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceMembersUpdate',
		'workspaceMembers.update',
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/workspace-members/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const deleteMember: InstantlyEndpoints['workspaceMembersDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceMembersDelete',
		'workspaceMembers.delete',
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/workspace-members/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const createGroupMember: InstantlyEndpoints['workspaceGroupMembersCreate'] =
	(ctx, input) =>
		call(
			ctx,
			'workspaceGroupMembersCreate',
			'workspaceGroupMembers.create',
			input,
			(body) => ({ method: 'POST', path: '/workspace-group-members', body }),
			{},
		);

export const listGroupMembers: InstantlyEndpoints['workspaceGroupMembersList'] =
	(ctx, input) =>
		call(
			ctx,
			'workspaceGroupMembersList',
			'workspaceGroupMembers.list',
			input,
			(query) => ({ method: 'GET', path: '/workspace-group-members', query }),
			{ log: (_, result) => ({ count: result.items.length }) },
		);

export const getGroupMember: InstantlyEndpoints['workspaceGroupMembersGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'workspaceGroupMembersGet',
		'workspaceGroupMembers.get',
		input,
		({ id }) => ({
			method: 'GET',
			path: `/workspace-group-members/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const deleteGroupMember: InstantlyEndpoints['workspaceGroupMembersDelete'] =
	(ctx, input) =>
		call(
			ctx,
			'workspaceGroupMembersDelete',
			'workspaceGroupMembers.delete',
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/workspace-group-members/${segment(id)}`,
			}),
			{ log: ({ id }) => ({ id }) },
		);

export const getGroupAdmin: InstantlyEndpoints['workspaceGroupMembersGetAdmin'] =
	(ctx, input) =>
		call(
			ctx,
			'workspaceGroupMembersGetAdmin',
			'workspaceGroupMembers.getAdmin',
			input,
			() => ({ method: 'GET', path: '/workspace-group-members/admin' }),
			{},
		);
