import { logEventFromContext } from 'corsair/core';
import type { GongOpaqueRecord, GongOpaqueValue } from '../client';
import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';
import type { GongPermissionsOutputs } from './permissions-types';

async function call<T>(
	ctx: GongFamilyContext,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	path: string,
	input: GongOpaqueRecord,
	query?: GongOpaqueRecord,
	body?: GongOpaqueValue,
): Promise<T> {
	const credentials = gongCredentials(ctx);
	const result = await gongRequest<T>({
		baseUrl: ctx.options.baseUrl,
		credentials,
		method,
		path,
		query,
		body,
	});
	await logEventFromContext(ctx, 'gong.permissions', { input }, 'completed');
	return result;
}
export const getPermissionProfile = (
	ctx: GongFamilyContext,
	input: import('./permissions-types').GongPermissionsInputs['getPermissionProfile'],
) =>
	call<GongPermissionsOutputs['getPermissionProfile']>(
		ctx,
		'GET',
		'/v2/permission-profile',
		input,
		{ profileId: input.profileId },
	);
export const updatePermissionProfile = (
	ctx: GongFamilyContext,
	input: import('./permissions-types').GongPermissionsInputs['updatePermissionProfile'],
) =>
	call<GongPermissionsOutputs['updatePermissionProfile']>(
		ctx,
		'PUT',
		'/v2/permission-profile',
		input,
		{ profileId: input.profileId },
		input.body,
	);
export const createPermissionProfile = (
	ctx: GongFamilyContext,
	input: import('./permissions-types').GongPermissionsInputs['createPermissionProfile'],
) =>
	call<GongPermissionsOutputs['createPermissionProfile']>(
		ctx,
		'POST',
		'/v2/permission-profile',
		input,
		{ workspaceId: input.workspaceId },
		input.body,
	);
export const addUsersAccessToCalls = (
	ctx: GongFamilyContext,
	input: import('./permissions-types').GongPermissionsInputs['addUsersAccessToCalls'],
) =>
	call<GongPermissionsOutputs['addUsersAccessToCalls']>(
		ctx,
		'PUT',
		'/v2/calls/users-access',
		input,
		undefined,
		{ callAccessList: input.callAccessList },
	);
export const getUsersAccessToCalls = (
	ctx: GongFamilyContext,
	input: import('./permissions-types').GongPermissionsInputs['getUsersAccessToCalls'],
) =>
	call<GongPermissionsOutputs['getUsersAccessToCalls']>(
		ctx,
		'POST',
		'/v2/calls/users-access',
		input,
		undefined,
		input,
	);
export const deleteUsersAccessToCalls = (
	ctx: GongFamilyContext,
	input: import('./permissions-types').GongPermissionsInputs['deleteUsersAccessToCalls'],
) =>
	call<GongPermissionsOutputs['deleteUsersAccessToCalls']>(
		ctx,
		'DELETE',
		'/v2/calls/users-access',
		input,
		undefined,
		{ callAccessList: input.callAccessList },
	);
export const listPermissionProfileUsers = (
	ctx: GongFamilyContext,
	input: import('./permissions-types').GongPermissionsInputs['listPermissionProfileUsers'],
) =>
	call<GongPermissionsOutputs['listPermissionProfileUsers']>(
		ctx,
		'GET',
		'/v2/permission-profile/users',
		input,
		{ profileId: input.profileId },
	);
export const listPermissionProfile = (
	ctx: GongFamilyContext,
	input: import('./permissions-types').GongPermissionsInputs['listPermissionProfile'],
) =>
	call<GongPermissionsOutputs['listPermissionProfile']>(
		ctx,
		'GET',
		'/v2/all-permission-profiles',
		input,
		{ workspaceId: input.workspaceId },
	);
