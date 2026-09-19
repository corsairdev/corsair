import type { AnthropicAdministratorEndpoints } from '../index';
import {
	cacheEntity,
	cacheList,
	callAdminApi,
	evictEntity,
	workspaceMemberKey,
} from './shared';
import type {
	AnthropicAdministratorEndpointOutputs as Outputs,
	WorkspaceMember,
} from './types';

const BASE = '/v1/organizations/workspaces';

function membersPath(workspaceId: string): string {
	return `${BASE}/${encodeURIComponent(workspaceId)}/members`;
}

/** GET /v1/organizations/workspaces/{workspace_id}/members */
export const listWorkspaceMembers: AnthropicAdministratorEndpoints['listWorkspaceMembers'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['listWorkspaceMembers']>(
			ctx,
			'workspaceMembers.listWorkspaceMembers',
			membersPath(input.workspace_id),
			{
				method: 'GET',
				query: {
					after_id: input.after_id,
					before_id: input.before_id,
					limit: input.limit,
				},
			},
			{ workspace_id: input.workspace_id },
		);

		await cacheList(
			ctx,
			'workspaceMembers',
			response.data,
			(m: WorkspaceMember) => workspaceMemberKey(m.workspace_id, m.user_id),
		);
		return response;
	};

/** POST /v1/organizations/workspaces/{workspace_id}/members */
export const createWorkspaceMember: AnthropicAdministratorEndpoints['createWorkspaceMember'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['createWorkspaceMember']>(
			ctx,
			'workspaceMembers.createWorkspaceMember',
			membersPath(input.workspace_id),
			{
				method: 'POST',
				body: {
					user_id: input.user_id,
					workspace_role: input.workspace_role,
				},
			},
			{
				workspace_id: input.workspace_id,
				workspace_role: input.workspace_role,
			},
		);

		await cacheEntity(
			ctx,
			'workspaceMembers',
			workspaceMemberKey(response.workspace_id, response.user_id),
			response,
		);
		return response;
	};

/** GET /v1/organizations/workspaces/{workspace_id}/members/{user_id} */
export const getWorkspaceMember: AnthropicAdministratorEndpoints['getWorkspaceMember'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['getWorkspaceMember']>(
			ctx,
			'workspaceMembers.getWorkspaceMember',
			`${membersPath(input.workspace_id)}/${encodeURIComponent(input.user_id)}`,
			{ method: 'GET' },
			{ workspace_id: input.workspace_id, user_id: input.user_id },
		);

		await cacheEntity(
			ctx,
			'workspaceMembers',
			workspaceMemberKey(response.workspace_id, response.user_id),
			response,
		);
		return response;
	};

/** POST /v1/organizations/workspaces/{workspace_id}/members/{user_id} */
export const updateWorkspaceMember: AnthropicAdministratorEndpoints['updateWorkspaceMember'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['updateWorkspaceMember']>(
			ctx,
			'workspaceMembers.updateWorkspaceMember',
			`${membersPath(input.workspace_id)}/${encodeURIComponent(input.user_id)}`,
			{ method: 'POST', body: { workspace_role: input.workspace_role } },
			{ workspace_id: input.workspace_id, user_id: input.user_id },
		);

		await cacheEntity(
			ctx,
			'workspaceMembers',
			workspaceMemberKey(response.workspace_id, response.user_id),
			response,
		);
		return response;
	};

/** DELETE /v1/organizations/workspaces/{workspace_id}/members/{user_id} */
export const deleteWorkspaceMember: AnthropicAdministratorEndpoints['deleteWorkspaceMember'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['deleteWorkspaceMember']>(
			ctx,
			'workspaceMembers.deleteWorkspaceMember',
			`${membersPath(input.workspace_id)}/${encodeURIComponent(input.user_id)}`,
			{ method: 'DELETE' },
			{ workspace_id: input.workspace_id, user_id: input.user_id },
		);

		await evictEntity(
			ctx,
			'workspaceMembers',
			workspaceMemberKey(input.workspace_id, input.user_id),
		);
		return response;
	};
