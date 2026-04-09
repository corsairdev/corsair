import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const addRoleToItem: SharepointEndpoints['permissionsAddRoleToItem'] =
	async (ctx, input) => {
		await logEventFromContext(
			ctx,
			'sharepoint.permissions.addRoleToItem',
			{ ...input },
			'failed',
		);
		throw new Error(
			'addRoleToItem is not supported via Microsoft Graph API. ' +
				'SharePoint principal_id and role_definition_id integers are not accepted by Graph API. ' +
				'Use the SharePoint REST API (_api/web/lists/getbytitle/roleassignments/addroleassignment) instead.',
		);
	};

export const addRoleToList: SharepointEndpoints['permissionsAddRoleToList'] =
	async (ctx, input) => {
		await logEventFromContext(
			ctx,
			'sharepoint.permissions.addRoleToList',
			{ ...input },
			'failed',
		);
		throw new Error(
			'addRoleToList is not supported via Microsoft Graph API. ' +
				'SharePoint principal_id and role_definition_id integers are not accepted by Graph API. ' +
				'Use the SharePoint REST API (_api/web/lists/getbytitle/roleassignments/addroleassignment) instead.',
		);
	};

export const breakInheritanceOnItem: SharepointEndpoints['permissionsBreakInheritanceOnItem'] =
	async (ctx, input) => {
		await logEventFromContext(
			ctx,
			'sharepoint.permissions.breakInheritanceOnItem',
			{ ...input },
			'failed',
		);
		throw new Error(
			'breakInheritanceOnItem is not supported via Microsoft Graph API. ' +
				'Use the SharePoint REST API (_api/web/lists/getbytitle/items/breakroleinheritance) instead.',
		);
	};

export const breakInheritanceOnList: SharepointEndpoints['permissionsBreakInheritanceOnList'] =
	async (ctx, input) => {
		await logEventFromContext(
			ctx,
			'sharepoint.permissions.breakInheritanceOnList',
			{ ...input },
			'failed',
		);
		throw new Error(
			'breakInheritanceOnList is not supported via Microsoft Graph API. ' +
				'Use the SharePoint REST API (_api/web/lists/getbytitle/breakroleinheritance) instead.',
		);
	};

export const getRoleDefinitions: SharepointEndpoints['permissionsGetRoleDefinitions'] =
	async (ctx, input) => {
		const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

		// Graph API exposes site permissions (not role definitions), map to the expected format
		const result = await makeGraphRequest<{
			value?: Array<{ id?: string; roles?: string[] }>;
		}>(`/sites/${siteId}/permissions`, ctx.key, { method: 'GET' });

		// Map Graph permissions to role definition-like objects
		const roleDefinitions = (result.value ?? []).map((perm, index) => ({
			id: index,
			Name: perm.roles?.join(', '),
			Description: `Graph permission: ${perm.roles?.join(', ')}`,
		}));

		await logEventFromContext(
			ctx,
			'sharepoint.permissions.getRoleDefinitions',
			{ ...input },
			'completed',
		);
		// Graph permissions map to a different shape than SP role definitions; cast to satisfy the expected output type
		return {
			value: roleDefinitions,
		} as SharepointEndpointOutputs['permissionsGetRoleDefinitions'];
	};
