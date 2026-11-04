import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	WorkspacesAuthorizedUserInput,
	WorkspacesAuthorizedUserResponse,
	WorkspacesCustomRolesInput,
	WorkspacesCustomRolesResponse,
	WorkspacesCustomTaskTypesInput,
	WorkspacesCustomTaskTypesResponse,
	WorkspacesEverythingViewsCreateInput,
	WorkspacesEverythingViewsCreateResponse,
	WorkspacesEverythingViewsGetInput,
	WorkspacesEverythingViewsGetResponse,
	WorkspacesGetInput,
	WorkspacesGetResponse,
	WorkspacesPlanInput,
	WorkspacesPlanResponse,
	WorkspacesSeatsInput,
	WorkspacesSeatsResponse,
	WorkspacesSharedHierarchyInput,
	WorkspacesSharedHierarchyResponse,
	WorkspacesTeamFieldsInput,
	WorkspacesTeamFieldsResponse,
} from './types';

export async function get(
	ctx: ClickupRequestContext,
	_input: WorkspacesGetInput,
): Promise<WorkspacesGetResponse> {
	const response = await makeClickupRequest<WorkspacesGetResponse>(
		'team',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'clickup.workspaces.get', {}, 'completed');
	return response;
}

export async function authorizedUser(
	ctx: ClickupRequestContext,
	_input: WorkspacesAuthorizedUserInput,
): Promise<WorkspacesAuthorizedUserResponse> {
	const response = await makeClickupRequest<WorkspacesAuthorizedUserResponse>(
		'user',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.authorizedUser',
		{},
		'completed',
	);
	return response;
}

export async function plan(
	ctx: ClickupRequestContext,
	input: WorkspacesPlanInput,
): Promise<WorkspacesPlanResponse> {
	const response = await makeClickupRequest<WorkspacesPlanResponse>(
		`team/${input.team_id}/plan`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.plan',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function seats(
	ctx: ClickupRequestContext,
	input: WorkspacesSeatsInput,
): Promise<WorkspacesSeatsResponse> {
	const response = await makeClickupRequest<WorkspacesSeatsResponse>(
		`workspaces/${input.workspace_id}/seats`,
		ctx.key,
		{ method: 'GET', version: 'v3' },
	);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.seats',
		{ workspace_id: input.workspace_id },
		'completed',
	);
	return response;
}

export async function sharedHierarchy(
	ctx: ClickupRequestContext,
	input: WorkspacesSharedHierarchyInput,
): Promise<WorkspacesSharedHierarchyResponse> {
	const response = await makeClickupRequest<WorkspacesSharedHierarchyResponse>(
		`team/${input.team_id}/shared`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.sharedHierarchy',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function customRoles(
	ctx: ClickupRequestContext,
	input: WorkspacesCustomRolesInput,
): Promise<WorkspacesCustomRolesResponse> {
	const { team_id, ...query } = input;
	const response = await makeClickupRequest<WorkspacesCustomRolesResponse>(
		`team/${team_id}/customroles`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.customRoles',
		{ team_id },
		'completed',
	);
	return response;
}

export async function customTaskTypes(
	ctx: ClickupRequestContext,
	input: WorkspacesCustomTaskTypesInput,
): Promise<WorkspacesCustomTaskTypesResponse> {
	const response = await makeClickupRequest<WorkspacesCustomTaskTypesResponse>(
		`team/${input.team_id}/custom_item`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.customTaskTypes',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function teamFields(
	ctx: ClickupRequestContext,
	input: WorkspacesTeamFieldsInput,
): Promise<WorkspacesTeamFieldsResponse> {
	const response = await makeClickupRequest<WorkspacesTeamFieldsResponse>(
		`team/${input.team_id}/field`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.teamFields',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function everythingViewsGet(
	ctx: ClickupRequestContext,
	input: WorkspacesEverythingViewsGetInput,
): Promise<WorkspacesEverythingViewsGetResponse> {
	const response =
		await makeClickupRequest<WorkspacesEverythingViewsGetResponse>(
			`team/${input.team_id}/view`,
			ctx.key,
			{ method: 'GET' },
		);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.everythingViewsGet',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function everythingViewsCreate(
	ctx: ClickupRequestContext,
	input: WorkspacesEverythingViewsCreateInput,
): Promise<WorkspacesEverythingViewsCreateResponse> {
	const { team_id, ...body } = input;
	const response =
		await makeClickupRequest<WorkspacesEverythingViewsCreateResponse>(
			`team/${team_id}/view`,
			ctx.key,
			{ method: 'POST', body },
		);

	await logEventFromContext(
		ctx,
		'clickup.workspaces.everythingViewsCreate',
		{ team_id },
		'completed',
	);
	return response;
}
