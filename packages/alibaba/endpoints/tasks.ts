import { logEventFromContext } from 'corsair/core';
import type { AlibabaEndpoints } from '..';
import { makeDashScopeRequest } from '../client';
import {
	AlibabaEndpointInputSchemas,
	AlibabaEndpointOutputSchemas,
} from './types';

// Task ids stay queryable for 24 hours; after that the status is UNKNOWN.
// Statuses only move forward. UNKNOWN (expired) ranks lowest, so it never
// replaces what was learned while the task existed.
const STATUS_RANK: Record<string, number> = {
	UNKNOWN: -1,
	PENDING: 0,
	RUNNING: 1,
	SUCCEEDED: 2,
	FAILED: 2,
	CANCELED: 2,
};

// The entity store has no conditional update, so each task's read, compare and
// write run one after another: overlapping polls can't both read the old status.
const pendingWrites = new Map<string, Promise<void>>();

function serializeByTask(taskId: string, write: () => Promise<void>) {
	// A failed earlier write must not block this one.
	const previous =
		pendingWrites.get(taskId)?.catch(() => {}) ?? Promise.resolve();
	const next = previous.then(write);
	pendingWrites.set(taskId, next);
	return next.finally(() => {
		if (pendingWrites.get(taskId) === next) pendingWrites.delete(taskId);
	});
}

export const get: AlibabaEndpoints['tasksGet'] = async (ctx, input) => {
	const { task_id } = AlibabaEndpointInputSchemas.tasksGet.parse(input);
	const task = AlibabaEndpointOutputSchemas.tasksGet.parse(
		await makeDashScopeRequest('api/v1/tasks/{task_id}', ctx.key, {
			path: { task_id },
			baseUrl: ctx.options.baseUrl,
		}),
	);

	const videoTasks = ctx.db.videoTasks;
	if (videoTasks) {
		try {
			await serializeByTask(task_id, async () => {
				const cached = await videoTasks.findByEntityId(task_id);
				const stored = cached?.data.status;
				// A slower poll can return after a newer one; don't move the task back.
				const stale =
					stored !== undefined &&
					(STATUS_RANK[task.output.task_status] ?? -1) <
						(STATUS_RANK[stored] ?? -1);
				if (!stale)
					await videoTasks.upsertByEntityId(task_id, {
						...cached?.data,
						taskId: task_id,
						status: task.output.task_status,
						videoUrl: task.output.video_url ?? undefined,
						submitTime: task.output.submit_time ?? undefined,
						endTime: task.output.end_time ?? undefined,
						durationSeconds: task.usage?.output_video_duration ?? undefined,
						errorCode: task.output.code ?? undefined,
						updatedAt: new Date(),
					});
			});
		} catch (error) {
			console.warn('Failed to save Model Studio task to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'alibaba.tasks.get',
		{ taskId: task_id, status: task.output.task_status },
		'completed',
	);
	return task;
};
