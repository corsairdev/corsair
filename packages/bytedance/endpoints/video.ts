import { logEventFromContext } from 'corsair/core';
import type { BytedanceContext, BytedanceEndpoints } from '..';
import { BytedanceAPIError, makeArkRequest } from '../client';
import type { VideoTask } from './types';
import {
	BytedanceEndpointInputSchemas,
	BytedanceEndpointOutputSchemas,
} from './types';

const TASKS = 'api/v3/contents/generations/tasks';

async function saveTask(ctx: BytedanceContext, task: VideoTask) {
	if (!ctx.db.videoTasks) return;
	try {
		await ctx.db.videoTasks.upsertByEntityId(task.id, {
			id: task.id,
			model: task.model ?? undefined,
			status: task.status,
			videoUrl: task.content?.video_url ?? undefined,
			lastFrameUrl: task.content?.last_frame_url ?? undefined,
			resolution: task.resolution ?? undefined,
			ratio: task.ratio ?? undefined,
			duration: task.duration ?? undefined,
			totalTokens: task.usage?.total_tokens ?? undefined,
			errorCode: task.error?.code,
			createdAt: task.created_at ? new Date(task.created_at * 1000) : undefined,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save ModelArk video task to database:', error);
	}
}

export const create: BytedanceEndpoints['videoCreate'] = async (ctx, input) => {
	const body = BytedanceEndpointInputSchemas.videoCreate.parse(input);
	const result = BytedanceEndpointOutputSchemas.videoCreate.parse(
		await makeArkRequest(TASKS, ctx.key, {
			method: 'POST',
			body,
			baseUrl: ctx.options.baseUrl,
		}),
	);
	if (ctx.db.videoTasks) {
		try {
			await ctx.db.videoTasks.upsertByEntityId(result.id, {
				id: result.id,
				model: body.model,
				status: 'queued',
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save ModelArk video task to database:', error);
		}
	}
	await logEventFromContext(
		ctx,
		'bytedance.video.create',
		{ taskId: result.id, model: body.model },
		'completed',
	);
	return result;
};

export const get: BytedanceEndpoints['tasksGet'] = async (ctx, input) => {
	const { id } = BytedanceEndpointInputSchemas.tasksGet.parse(input);
	const task = BytedanceEndpointOutputSchemas.tasksGet.parse(
		await makeArkRequest(`${TASKS}/{id}`, ctx.key, {
			path: { id },
			baseUrl: ctx.options.baseUrl,
		}),
	);
	await saveTask(ctx, task);
	await logEventFromContext(
		ctx,
		'bytedance.tasks.get',
		{ taskId: id, status: task.status },
		'completed',
	);
	return task;
};

export const list: BytedanceEndpoints['tasksList'] = async (ctx, input) => {
	const filters = BytedanceEndpointInputSchemas.tasksList.parse(input ?? {});
	const result = BytedanceEndpointOutputSchemas.tasksList.parse(
		await makeArkRequest(TASKS, ctx.key, {
			query: {
				page_num: filters.page_num,
				page_size: filters.page_size,
				'filter.status': filters.status,
				'filter.task_ids': filters.task_ids,
				'filter.model': filters.model,
				'filter.service_tier': filters.service_tier,
			},
			baseUrl: ctx.options.baseUrl,
		}),
	);
	for (const task of result.items) await saveTask(ctx, task);
	await logEventFromContext(
		ctx,
		'bytedance.tasks.list',
		{ count: result.items.length, total: result.total },
		'completed',
	);
	return result;
};

export const remove: BytedanceEndpoints['tasksDelete'] = async (ctx, input) => {
	const { id } = BytedanceEndpointInputSchemas.tasksDelete.parse(input);
	// Cancels a queued task, or deletes the record of a finished one.
	const raw = await makeArkRequest(`${TASKS}/{id}`, ctx.key, {
		method: 'DELETE',
		path: { id },
		baseUrl: ctx.options.baseUrl,
	});
	const result = BytedanceEndpointOutputSchemas.tasksDelete.parse(raw ?? {});
	if (ctx.db.videoTasks) {
		// The cache can be stale (a queued task may have finished remotely), so
		// read the task back: a cancelled task is still returned, a deleted one 404s.
		try {
			const after = BytedanceEndpointOutputSchemas.tasksGet.parse(
				await makeArkRequest(`${TASKS}/{id}`, ctx.key, {
					path: { id },
					baseUrl: ctx.options.baseUrl,
				}),
			);
			await saveTask(ctx, after);
		} catch (error) {
			if (error instanceof BytedanceAPIError && error.status === 404) {
				await ctx.db.videoTasks.deleteByEntityId(id).catch((dbError) => {
					console.warn('Failed to remove ModelArk video task:', dbError);
				});
			} else {
				console.warn(
					'Failed to refresh ModelArk video task after delete:',
					error,
				);
			}
		}
	}
	await logEventFromContext(
		ctx,
		'bytedance.tasks.delete',
		{ taskId: id },
		'completed',
	);
	return result;
};
