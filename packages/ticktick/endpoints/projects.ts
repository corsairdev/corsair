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
	const allTasks: TickTickTask[] = [];
	const taskIds = new Set<string>();
	let page = 1;
	let hasMore = true;
	let project: TickTickProject | null = null;
	let columns: TickTickColumn[] | undefined = undefined;

	while (hasMore) {
		const response =
			await makeAuthenticatedTickTickRequest<ProjectDataResponse>(
				`project/${input.projectId}/data`,
				ctx,
				{
					method: 'GET',
					query: {
						page: page,
						limit: 100,
					},
				},
			);

		if (!project && response?.project) {
			project = response.project;
		}
		if (response?.columns) {
			columns = response.columns;
		}

		if (
			response &&
			Array.isArray(response.tasks) &&
			response.tasks.length > 0
		) {
			for (const task of response.tasks) {
				if (!taskIds.has(task.id)) {
					taskIds.add(task.id);
					allTasks.push(task);
				}
			}
			if (response.tasks.length < 100) {
				hasMore = false;
			} else {
				page++;
			}
		} else {
			hasMore = false;
		}
	}

	if (!project) {
		throw new Error(`Project ${input.projectId} could not be retrieved`);
	}

	await logEventFromContext(
		ctx,
		'ticktick.project.getData',
		{ ...input },
		'completed',
	);
	return {
		project,
		tasks: allTasks,
		columns,
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
