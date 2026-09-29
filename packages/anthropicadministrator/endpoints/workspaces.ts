import type { AnthropicAdministratorEndpoints } from '../index';
import { cacheEntity, cacheList, callAdminApi, compact } from './shared';
import type {
	AnthropicAdministratorEndpointOutputs as Outputs,
	Workspace,
} from './types/index';

const BASE = '/v1/organizations/workspaces';

/** GET /v1/organizations/workspaces */
export const listWorkspaces: AnthropicAdministratorEndpoints['listWorkspaces'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['listWorkspaces']>(
			ctx,
			'workspaces.listWorkspaces',
			BASE,
			{
				method: 'GET',
				query: {
					after_id: input.after_id,
					before_id: input.before_id,
					include_archived: input.include_archived,
					limit: input.limit,
				},
			},
		);

		await cacheList(ctx, 'workspaces', response.data, (w: Workspace) => w.id);
		return response;
	};

/** POST /v1/organizations/workspaces */
export const createWorkspace: AnthropicAdministratorEndpoints['createWorkspace'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['createWorkspace']>(
			ctx,
			'workspaces.createWorkspace',
			BASE,
			{
				method: 'POST',
				body: compact({
					name: input.name,
					data_residency: input.data_residency,
					external_key_id: input.external_key_id,
					tags: input.tags,
				}),
			},
			{ name: input.name },
		);

		await cacheEntity(ctx, 'workspaces', response.id, response);
		return response;
	};

/** GET /v1/organizations/workspaces/{workspace_id} */
export const getWorkspace: AnthropicAdministratorEndpoints['getWorkspace'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['getWorkspace']>(
			ctx,
			'workspaces.getWorkspace',
			`${BASE}/${encodeURIComponent(input.workspace_id)}`,
			{ method: 'GET' },
			{ workspace_id: input.workspace_id },
		);

		await cacheEntity(ctx, 'workspaces', response.id, response);
		return response;
	};

/** POST /v1/organizations/workspaces/{workspace_id} */
export const updateWorkspace: AnthropicAdministratorEndpoints['updateWorkspace'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['updateWorkspace']>(
			ctx,
			'workspaces.updateWorkspace',
			`${BASE}/${encodeURIComponent(input.workspace_id)}`,
			{
				method: 'POST',
				body: compact({
					name: input.name,
					data_residency: input.data_residency,
					external_key_id: input.external_key_id,
					tags: input.tags,
				}),
			},
			{ workspace_id: input.workspace_id },
		);

		await cacheEntity(ctx, 'workspaces', response.id, response);
		return response;
	};

/** POST /v1/organizations/workspaces/{workspace_id}/archive */
export const archiveWorkspace: AnthropicAdministratorEndpoints['archiveWorkspace'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['archiveWorkspace']>(
			ctx,
			'workspaces.archiveWorkspace',
			`${BASE}/${encodeURIComponent(input.workspace_id)}/archive`,
			{ method: 'POST' },
			{ workspace_id: input.workspace_id },
		);

		// Archived workspaces remain readable, so refresh rather than evict.
		await cacheEntity(ctx, 'workspaces', response.id, response);
		return response;
	};
