import type { TodoistEndpoints } from '..';
import type { TodoistEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeTodoistRequest } from '../client';

export const archive: TodoistEndpoints['projectsArchive'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsArchive']
	>(`projects/${input.id}/archive`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'todoist.projects.archive',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TodoistEndpoints['projectsCreate'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsCreate']
	>('projects', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			color: input.color,
			favorite: input.favorite,
			parent_id: input.parent_id,
			order: input.order,
		},
	});

	await logEventFromContext(
		ctx,
		'todoist.projects.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteProject: TodoistEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsDelete']
	>(`projects/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'todoist.projects.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TodoistEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['projectsGet']>(
		`projects/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'todoist.projects.get', { ...input }, 'completed');
	return result;
};

export const getCollaborators: TodoistEndpoints['projectsGetCollaborators'] =
	async (ctx, input) => {
		const result = await makeTodoistRequest<
			TodoistEndpointOutputs['projectsGetCollaborators']
		>(`projects/${input.id}/collaborators`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'todoist.projects.getCollaborators',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getMany: TodoistEndpoints['projectsGetMany'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsGetMany']
	>('projects', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'todoist.projects.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const unarchive: TodoistEndpoints['projectsUnarchive'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsUnarchive']
	>(`projects/${input.id}/unarchive`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'todoist.projects.unarchive',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['projectsUpdate'] = async (ctx, input) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsUpdate']
	>(`projects/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	await logEventFromContext(
		ctx,
		'todoist.projects.update',
		{ ...input },
		'completed',
	);
	return result;
};

