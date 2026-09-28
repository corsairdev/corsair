import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedTickTickRequest } from '../client';
import type { TickTickEndpoints } from '../index';
import type {
	CreateProjectResponse,
	GetProjectResponse,
	GetUserProjectsResponse,
	TickTickColumn,
	TickTickProject,
	TickTickTask,
	UpdateProjectResponse,
} from './types';

export const create: TickTickEndpoints['createProject'] = async (
	ctx,
	input,
) => {
	const response =
		await makeAuthenticatedTickTickRequest<CreateProjectResponse>(
			'project',
			ctx,
			{
				method: 'POST',
				body: input,
			},
		);

	await logEventFromContext(
		ctx,
		'ticktick.project.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteProject: TickTickEndpoints['deleteProject'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedTickTickRequest<void>(
		`project/${input.projectId}`,
		ctx,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'ticktick.project.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const get: TickTickEndpoints['getProject'] = async (ctx, input) => {
	const response = await makeAuthenticatedTickTickRequest<GetProjectResponse>(
		`project/${input.projectId}`,
		ctx,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'ticktick.project.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const getMany: TickTickEndpoints['getUserProjects'] = async (
	ctx,
	input,
) => {
	const response =
		await makeAuthenticatedTickTickRequest<GetUserProjectsResponse>(
			'project',
			ctx,
			{
				method: 'GET',
			},
		);

	await logEventFromContext(
		ctx,
		'ticktick.project.getMany',
		{ ...input },
		'completed',
	);
	return response;
};

type ProjectDataResponse = {
	project: TickTickProject;
	tasks: TickTickTask[];
	columns?: TickTickColumn[];
};

export const getData: TickTickEndpoints['getProjectWithData'] = async (
	ctx,
	input,
) => {
	// The official endpoint takes no pagination parameters and returns the
	// project plus all of its undone tasks in a single response
	const response = await makeAuthenticatedTickTickRequest<ProjectDataResponse>(
		`project/${input.projectId}/data`,
		ctx,
		{
			method: 'GET',
		},
	);

	if (!response?.project) {
		throw new Error(`Project ${input.projectId} could not be retrieved`);
	}

	await logEventFromContext(
		ctx,
		'ticktick.project.getData',
		{ ...input },
		'completed',
	);
	return {
		project: response.project,
		tasks: Array.isArray(response.tasks) ? response.tasks : [],
		columns: response.columns,
	};
};

export const update: TickTickEndpoints['updateProject'] = async (
	ctx,
	input,
) => {
	const { projectId, ...body } = input;
	const response =
		await makeAuthenticatedTickTickRequest<UpdateProjectResponse>(
			`project/${projectId}`,
			ctx,
			{
				method: 'POST',
				body: body,
			},
		);

	await logEventFromContext(
		ctx,
		'ticktick.project.update',
		{ ...input },
		'completed',
	);
	return response;
};
