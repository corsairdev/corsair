import type { TodoistEndpoints } from '..';
import type { TodoistEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeTodoistRequest } from '../client';

export const create: TodoistEndpoints['sectionsCreate'] = async (ctx, input) => {
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

	if (ctx.db.sections && result && (result as any).id) {
		await ctx.db.sections.upsertByEntityId((result as any).id, result as any);
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

	if (ctx.db.sections && input.id) {
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
	const result = await makeTodoistRequest<TodoistEndpointOutputs['sectionsGet']>(
		`sections/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (ctx.db.sections && result && (result as any).id) {
		await ctx.db.sections.upsertByEntityId((result as any).id, result as any);
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

	if (ctx.db.sections) {
		const data: any = result;
		const items: any[] = Array.isArray(data) ? data : [];
		for (const section of items) {
			if (section && section.id) {
				await ctx.db.sections.upsertByEntityId(section.id, section);
			}
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

export const update: TodoistEndpoints['sectionsUpdate'] = async (ctx, input) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['sectionsUpdate']
	>(`sections/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	if (ctx.db.sections && result && (result as any).id) {
		await ctx.db.sections.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(
		ctx,
		'todoist.sections.update',
		{ ...input },
		'completed',
	);
	return result;
};

