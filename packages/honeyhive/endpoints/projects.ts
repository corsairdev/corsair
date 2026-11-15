import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import {
	makeHoneyHiveRequest,
	resolveControlPlaneKey,
	resolveControlPlaneUrl,
} from '../client';
import type {
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsDeleteInput,
	ProjectsDeleteResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsUpdateInput,
	ProjectsUpdateResponse,
} from './types';
import {
	HoneyHiveEndpointInputSchemas,
	HoneyHiveEndpointOutputSchemas,
} from './types';

export async function createProject(
	ctx: HoneyHiveContext,
	input: ProjectsCreateInput,
): Promise<ProjectsCreateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.projectsCreate.parse(input);
	const { workspace_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<ProjectsCreateResponse>(
		`/v1/workspaces/${encodeURIComponent(workspace_id)}/projects`,
		await resolveControlPlaneKey(ctx),
		{
			method: 'POST',
			baseUrl: resolveControlPlaneUrl(ctx),
			body,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.projectsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.projects.create',
		{ workspace_id, success: true },
		'completed',
	);

	return parsed;
}

export async function getProject(
	ctx: HoneyHiveContext,
	input: ProjectsGetInput,
): Promise<ProjectsGetResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.projectsGet.parse(input);
	const response = await makeHoneyHiveRequest<ProjectsGetResponse>(
		`/v1/projects/${encodeURIComponent(parsedInput.project_id)}`,
		await resolveControlPlaneKey(ctx),
		{
			method: 'GET',
			baseUrl: resolveControlPlaneUrl(ctx),
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.projectsGet.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.projects.get',
		{ project_id: parsedInput.project_id },
		'completed',
	);

	return parsed;
}

export async function updateProject(
	ctx: HoneyHiveContext,
	input: ProjectsUpdateInput,
): Promise<ProjectsUpdateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.projectsUpdate.parse(input);
	const { project_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<ProjectsUpdateResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}`,
		await resolveControlPlaneKey(ctx),
		{
			method: 'PUT',
			baseUrl: resolveControlPlaneUrl(ctx),
			body,
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.projectsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.projects.update',
		{ project_id },
		'completed',
	);

	return parsed;
}

export async function deleteProject(
	ctx: HoneyHiveContext,
	input: ProjectsDeleteInput,
): Promise<ProjectsDeleteResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.projectsDelete.parse(input);
	const response = await makeHoneyHiveRequest<ProjectsDeleteResponse>(
		`/v1/projects/${encodeURIComponent(parsedInput.project_id)}`,
		await resolveControlPlaneKey(ctx),
		{
			method: 'DELETE',
			baseUrl: resolveControlPlaneUrl(ctx),
		},
	);
	const parsed = HoneyHiveEndpointOutputSchemas.projectsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.projects.delete',
		{ project_id: parsedInput.project_id },
		'completed',
	);

	return parsed;
}

export const Projects = {
	create: createProject,
	get: getProject,
	update: updateProject,
	delete: deleteProject,
};
