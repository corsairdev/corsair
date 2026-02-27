import type { TodoistEndpoints } from '..';
import type { TodoistEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeTodoistRequest } from '../client';

export const create: TodoistEndpoints['commentsCreate'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsCreate']
	>('comments', ctx.key, {
		method: 'POST',
		body: {
			task_id: input.task_id,
			project_id: input.project_id,
			content: input.content,
		},
	});

	if (ctx.db.comments && result && (result as any).id) {
		await ctx.db.comments.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteComment: TodoistEndpoints['commentsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsDelete']
	>(`comments/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.comments && input.id) {
		await ctx.db.comments.deleteByEntityId(input.id);
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TodoistEndpoints['commentsGet'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsGet']
	>(`comments/${input.id}`, ctx.key, {
		method: 'GET',
	});

	if (ctx.db.comments && result && (result as any).id) {
		await ctx.db.comments.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMany: TodoistEndpoints['commentsGetMany'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsGetMany']
	>('comments', ctx.key, {
		method: 'GET',
		query: {
			task_id: input.task_id,
			project_id: input.project_id,
		},
	});

	if (ctx.db.comments) {
		const data: any = result;
		const items: any[] = Array.isArray(data) ? data : [];
		for (const comment of items) {
			if (comment && comment.id) {
				await ctx.db.comments.upsertByEntityId(comment.id, comment);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['commentsUpdate'] = async (ctx, input) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsUpdate']
	>(`comments/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	if (ctx.db.comments && result && (result as any).id) {
		await ctx.db.comments.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.update',
		{ ...input },
		'completed',
	);
	return result;
};

