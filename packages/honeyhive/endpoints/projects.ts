import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest } from '../client';
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

export async function createProject(
	ctx: HoneyHiveContext,
	input: ProjectsCreateInput,
): Promise<ProjectsCreateResponse> {
	const { workspace_id, ...body } = input;
	const response = await makeHoneyHiveRequest<ProjectsCreateResponse>(
		`/v1/workspaces/${encodeURIComponent(workspace_id)}/projects`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.projects.create',
		{ workspace_id, name: input.name },
		'completed',
	);

	return response;
}

export async function getProject(
	ctx: HoneyHiveContext,
	input: ProjectsGetInput,
): Promise<ProjectsGetResponse> {
	const response = await makeHoneyHiveRequest<ProjectsGetResponse>(
		`/v1/projects/${encodeURIComponent(input.project_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.projects.get',
		{ project_id: input.project_id },
		'completed',
	);

	return response;
}

export async function updateProject(
	ctx: HoneyHiveContext,
	input: ProjectsUpdateInput,
): Promise<ProjectsUpdateResponse> {
	const { project_id, ...body } = input;
	const response = await makeHoneyHiveRequest<ProjectsUpdateResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.projects.update',
		{ project_id },
		'completed',
	);

	return response;
}

export async function deleteProject(
	ctx: HoneyHiveContext,
	input: ProjectsDeleteInput,
): Promise<ProjectsDeleteResponse> {
	const response = await makeHoneyHiveRequest<ProjectsDeleteResponse>(
		`/v1/projects/${encodeURIComponent(input.project_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.projects.delete',
		{ project_id: input.project_id },
		'completed',
	);

	return response;
}

export const Projects = {
	create: createProject,
	get: getProject,
	update: updateProject,
	delete: deleteProject,
};
