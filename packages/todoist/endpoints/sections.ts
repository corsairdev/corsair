import { logEventFromContext } from 'corsair/core';
import { makeTodoistRequest } from '../client';
import type { TodoistEndpoints } from '../index';
import type { TodoistEndpointOutputs } from './types';

export const create: TodoistEndpoints['sectionsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['sectionsCreate']
	>('sections', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			project_id: input.project_id,
			order: input.order,
		},
	});

	if (ctx.db.sections) {
		await ctx.db.sections.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.sections.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSection: TodoistEndpoints['sectionsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['sectionsDelete']
	>(`sections/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.sections) {
		await ctx.db.sections.deleteByEntityId(input.id);
	}

	await logEventFromContext(
		ctx,
		'todoist.sections.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TodoistEndpoints['sectionsGet'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['sectionsGet']
	>(`sections/${input.id}`, ctx.key, {
		method: 'GET',
	});

	if (ctx.db.sections) {
		await ctx.db.sections.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.sections.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMany: TodoistEndpoints['sectionsGetMany'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['sectionsGetMany']
	>('sections', ctx.key, {
		method: 'GET',
		query: {
			project_id: input.project_id,
		},
	});

	if (Array.isArray(result) && ctx.db.sections) {
		for (const section of result) {
			await ctx.db.sections.upsertByEntityId(section.id, {
				...section,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'todoist.sections.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['sectionsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['sectionsUpdate']
	>(`sections/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	if (ctx.db.sections) {
		await ctx.db.sections.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.sections.update',
		{ ...input },
		'completed',
	);
	return result;
};
