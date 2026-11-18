import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import type { TurbotPipesEndpointOutputs } from './types';

export const installUserWorkspaceFlowpipeMod: TurbotPipesEndpoints['installUserWorkspaceFlowpipeMod'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, path } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['installUserWorkspaceFlowpipeMod']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/flowpipe/mod`,
			ctx.key,
			{ method: 'POST', body: { path } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.install_flowpipe_mod',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceFlowpipeMod: TurbotPipesEndpoints['getUserWorkspaceFlowpipeMod'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceFlowpipeMod']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/mod/${pathSegment(input.mod_alias)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.get_flowpipe_mod',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const uninstallFlowpipeMod: TurbotPipesEndpoints['uninstallFlowpipeMod'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['uninstallFlowpipeMod']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/mod/${pathSegment(input.mod_alias)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.uninstall_flowpipe_mod',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const uninstallOrgWorkspaceFlowpipeMod: TurbotPipesEndpoints['uninstallOrgWorkspaceFlowpipeMod'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['uninstallOrgWorkspaceFlowpipeMod']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/mod/${pathSegment(input.mod_alias)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.uninstall_org_flowpipe_mod',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listOrgWorkspaceFlowpipeModVariables: TurbotPipesEndpoints['listOrgWorkspaceFlowpipeModVariables'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgWorkspaceFlowpipeModVariables']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/mod/${pathSegment(input.mod_alias)}/variable`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.list_org_flowpipe_mod_vars',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceFlowpipeModVariables: TurbotPipesEndpoints['listUserWorkspaceFlowpipeModVariables'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceFlowpipeModVariables']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/mod/${pathSegment(input.mod_alias)}/variable`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.list_user_flowpipe_mod_vars',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceFlowpipePipeline: TurbotPipesEndpoints['getUserWorkspaceFlowpipePipeline'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceFlowpipePipeline']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/pipeline/${pathSegment(input.pipeline_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.get_flowpipe_pipeline',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceFlowpipePipelines: TurbotPipesEndpoints['listUserWorkspaceFlowpipePipelines'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceFlowpipePipelines']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/pipeline`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.list_flowpipe_pipelines',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const runUserWorkspaceFlowpipePipelineCommand: TurbotPipesEndpoints['runUserWorkspaceFlowpipePipelineCommand'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, pipeline_id, command } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['runUserWorkspaceFlowpipePipelineCommand']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/flowpipe/pipeline/${pathSegment(pipeline_id)}/command`,
			ctx.key,
			{ method: 'POST', body: { command } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.run_flowpipe_pipeline_cmd',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceFlowpipeTrigger: TurbotPipesEndpoints['getOrgWorkspaceFlowpipeTrigger'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceFlowpipeTrigger']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/trigger/${pathSegment(input.trigger_name)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.get_org_flowpipe_trigger',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceFlowpipeTriggers: TurbotPipesEndpoints['listUserWorkspaceFlowpipeTriggers'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceFlowpipeTriggers']
		>(
			// Not in the OpenAPI document, but the live API serves it: an unknown
			// workspace gets a resource 404, not "API Not Found" (checked 2026-11-05).
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/trigger`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.list_flowpipe_triggers',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const runUserWorkspaceFlowpipeTriggerCommand: TurbotPipesEndpoints['runUserWorkspaceFlowpipeTriggerCommand'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, trigger_name, command } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['runUserWorkspaceFlowpipeTriggerCommand']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/flowpipe/trigger/${pathSegment(trigger_name)}/command`,
			ctx.key,
			{ method: 'POST', body: { command } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.run_flowpipe_trigger_cmd',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceFlowpipeInputs: TurbotPipesEndpoints['listUserWorkspaceFlowpipeInputs'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceFlowpipeInputs']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/input`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.list_flowpipe_inputs',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspacePipelineTriggers: TurbotPipesEndpoints['listUserWorkspacePipelineTriggers'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspacePipelineTriggers']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/flowpipe/pipeline/${pathSegment(input.pipeline_id)}/trigger`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.list_pipeline_triggers',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const deleteUserWorkspacePipeline: TurbotPipesEndpoints['deleteUserWorkspacePipeline'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserWorkspacePipeline']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/pipeline/${pathSegment(input.pipeline_id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.delete_user_pipeline',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspacePipeline: TurbotPipesEndpoints['getUserWorkspacePipeline'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspacePipeline']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/pipeline/${pathSegment(input.pipeline_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.get_user_pipeline',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspacePipelines: TurbotPipesEndpoints['listUserWorkspacePipelines'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspacePipelines']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/pipeline`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.list_user_pipelines',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listOrgWorkspacePipelines: TurbotPipesEndpoints['listOrgWorkspacePipelines'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgWorkspacePipelines']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/pipeline`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.pipelines.list_org_pipelines',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};
