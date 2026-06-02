import { logEventFromContext } from 'corsair/core';
import { makeTodoistRequest } from '../client';
import type { TodoistEndpoints } from '../index';
import type { TodoistEndpointOutputs } from './types';

export const archive: TodoistEndpoints['projectsArchive'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsArchive']
	>(`projects/${input.id}/archive`, ctx.key, {
		method: 'POST',
	});

	if (ctx.db.projects) {
		const existing = await ctx.db.projects.findByEntityId(input.id);
		if (existing) {
			await ctx.db.projects.upsertByEntityId(input.id, {
				...existing.data,
				is_archived: true,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'todoist.projects.archive',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TodoistEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsCreate']
	>('projects', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (ctx.db.projects) {
		await ctx.db.projects.upsertByEntityId(result.id, {
			...result,
		});
	}

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

	if (ctx.db.projects) {
		await ctx.db.projects.deleteByEntityId(input.id);
	}

	await logEventFromContext(
		ctx,
		'todoist.projects.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TodoistEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsGet']
	>(`projects/${input.id}`, ctx.key, {
		method: 'GET',
	});

	if (ctx.db.projects) {
		await ctx.db.projects.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.projects.get',
		{ ...input },
		'completed',
	);
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

export const getMany: TodoistEndpoints['projectsGetMany'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsGetMany']
	>('projects', ctx.key, {
		method: 'GET',
	});

	if (Array.isArray(result) && ctx.db.projects) {
		for (const project of result) {
			await ctx.db.projects.upsertByEntityId(project.id, {
				...project,
			});
		}
	}

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

	if (ctx.db.projects) {
		const existing = await ctx.db.projects.findByEntityId(input.id);
		if (existing) {
			await ctx.db.projects.upsertByEntityId(input.id, {
				...existing.data,
				is_archived: false,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'todoist.projects.unarchive',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['projectsUpdate']
	>(`projects/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	if (ctx.db.projects) {
		await ctx.db.projects.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.projects.update',
		{ ...input },
		'completed',
	);
	return result;
};
