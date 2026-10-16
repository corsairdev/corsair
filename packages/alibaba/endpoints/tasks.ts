import { logEventFromContext } from 'corsair/core';
import type { AlibabaEndpoints } from '..';
import { makeDashScopeRequest } from '../client';
import {
	AlibabaEndpointInputSchemas,
	AlibabaEndpointOutputSchemas,
} from './types';

// Task ids stay queryable for 24 hours; after that the status is UNKNOWN.
export const get: AlibabaEndpoints['tasksGet'] = async (ctx, input) => {
	const { task_id } = AlibabaEndpointInputSchemas.tasksGet.parse(input);
	const task = AlibabaEndpointOutputSchemas.tasksGet.parse(
		await makeDashScopeRequest('api/v1/tasks/{task_id}', ctx.key, {
			path: { task_id },
			baseUrl: ctx.options.baseUrl,
		}),
	);

	if (ctx.db.videoTasks) {
		try {
			const cached = await ctx.db.videoTasks.findByEntityId(task_id);
			await ctx.db.videoTasks.upsertByEntityId(task_id, {
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
