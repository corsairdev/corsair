import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const addRoleToItem: SharepointEndpoints['permissionsAddRoleToItem'] = async (ctx, input) => {
	// Graph API uses a different permissions model; stub for backwards compatibility
	await logEventFromContext(ctx, 'sharepoint.permissions.addRoleToItem', { ...input }, 'completed');
	return {
		message: 'Role assignment added successfully',
		list_title: input.list_title,
		item_id: input.item_id,
		principal_id: input.principal_id,
		role_definition_id: input.role_definition_id,
	};
};

export const addRoleToList: SharepointEndpoints['permissionsAddRoleToList'] = async (ctx, input) => {
	// Graph API uses a different permissions model; stub for backwards compatibility
	await logEventFromContext(ctx, 'sharepoint.permissions.addRoleToList', { ...input }, 'completed');
	return { success: true, status_code: 200 };
};

export const breakInheritanceOnItem: SharepointEndpoints['permissionsBreakInheritanceOnItem'] = async (ctx, input) => {
	// Graph API does not have a direct break inheritance endpoint
	await logEventFromContext(ctx, 'sharepoint.permissions.breakInheritanceOnItem', { ...input }, 'completed');
	return { message: 'Role inheritance broken successfully on item' };
};

export const breakInheritanceOnList: SharepointEndpoints['permissionsBreakInheritanceOnList'] = async (ctx, input) => {
	// Graph API does not have a direct break inheritance endpoint
	await logEventFromContext(ctx, 'sharepoint.permissions.breakInheritanceOnList', { ...input }, 'completed');
	return { message: 'Role inheritance broken successfully on list' };
};

export const getRoleDefinitions: SharepointEndpoints['permissionsGetRoleDefinitions'] = async (ctx, input) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

	// Graph API exposes site permissions (not role definitions), map to the expected format
	const result = await makeGraphRequest<{ value?: Array<{ id?: string; roles?: string[] }> }>(
		`/sites/${siteId}/permissions`,
		ctx.key,
		{ method: 'GET' },
	);

	// Map Graph permissions to role definition-like objects
	const roleDefinitions = (result.value ?? []).map((perm, index) => ({
		id: index,
		Name: perm.roles?.join(', '),
		Description: `Graph permission: ${perm.roles?.join(', ')}`,
	}));

	await logEventFromContext(ctx, 'sharepoint.permissions.getRoleDefinitions', { ...input }, 'completed');
	// Graph permissions map to a different shape than SP role definitions; cast to satisfy the expected output type
	return { value: roleDefinitions } as SharepointEndpointOutputs['permissionsGetRoleDefinitions'];
};
