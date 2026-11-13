import { logEventFromContext } from 'corsair/core';
import { makeGoogleTasksRequest } from '../client';
import type { GoogleTasksEndpoints } from '../index';
import {
	GoogleTasksEndpointInputSchemas,
	GoogleTasksEndpointOutputSchemas,
} from './types';

const pathId = (id: string) => encodeURIComponent(id);
const tasksPath = (taskListId: string) =>
	`/tasks/v1/lists/${pathId(taskListId)}/tasks`;

export const list: GoogleTasksEndpoints['tasksList'] = async (ctx, input) => {
	const args = GoogleTasksEndpointInputSchemas.tasksList.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.tasksList.parse(
		await makeGoogleTasksRequest(tasksPath(args.taskListId), ctx, {
			query: {
				completedMax: args.completedMax,
				completedMin: args.completedMin,
				dueMax: args.dueMax,
				dueMin: args.dueMin,
				maxResults: args.maxResults,
				pageToken: args.pageToken,
				showAssigned: args.showAssigned,
				showCompleted: args.showCompleted,
				showDeleted: args.showDeleted,
				showHidden: args.showHidden,
				updatedMin: args.updatedMin,
			},
		}),
	);
	await logEventFromContext(ctx, 'googletasks.tasks.list', {}, 'completed');
	return result;
};

export const get: GoogleTasksEndpoints['tasksGet'] = async (ctx, input) => {
	const args = GoogleTasksEndpointInputSchemas.tasksGet.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.tasksGet.parse(
		await makeGoogleTasksRequest(
			`${tasksPath(args.taskListId)}/${pathId(args.taskId)}`,
			ctx,
		),
	);
	await logEventFromContext(ctx, 'googletasks.tasks.get', {}, 'completed');
	return result;
};

export const insert: GoogleTasksEndpoints['tasksInsert'] = async (
	ctx,
	input,
) => {
	const args = GoogleTasksEndpointInputSchemas.tasksInsert.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.tasksInsert.parse(
		await makeGoogleTasksRequest(tasksPath(args.taskListId), ctx, {
			method: 'POST',
			body: args.task,
			query: { parent: args.parent, previous: args.previous },
		}),
	);
	await logEventFromContext(ctx, 'googletasks.tasks.insert', {}, 'completed');
	return result;
};

export const update: GoogleTasksEndpoints['tasksUpdate'] = async (
	ctx,
	input,
) => {
	const args = GoogleTasksEndpointInputSchemas.tasksUpdate.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.tasksUpdate.parse(
		await makeGoogleTasksRequest(
			`${tasksPath(args.taskListId)}/${pathId(args.taskId)}`,
			ctx,
			{ method: 'PUT', body: args.task },
		),
	);
	await logEventFromContext(ctx, 'googletasks.tasks.update', {}, 'completed');
	return result;
};

export const patch: GoogleTasksEndpoints['tasksPatch'] = async (ctx, input) => {
	const args = GoogleTasksEndpointInputSchemas.tasksPatch.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.tasksPatch.parse(
		await makeGoogleTasksRequest(
			`${tasksPath(args.taskListId)}/${pathId(args.taskId)}`,
			ctx,
			{ method: 'PATCH', body: args.task },
		),
	);
	await logEventFromContext(ctx, 'googletasks.tasks.patch', {}, 'completed');
	return result;
};

export const deleteTask: GoogleTasksEndpoints['tasksDelete'] = async (
	ctx,
	input,
) => {
	const args = GoogleTasksEndpointInputSchemas.tasksDelete.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.tasksDelete.parse(
		await makeGoogleTasksRequest(
			`${tasksPath(args.taskListId)}/${pathId(args.taskId)}`,
			ctx,
			{ method: 'DELETE' },
		),
	);
	await logEventFromContext(ctx, 'googletasks.tasks.delete', {}, 'completed');
	return result;
};

export const move: GoogleTasksEndpoints['tasksMove'] = async (ctx, input) => {
	const args = GoogleTasksEndpointInputSchemas.tasksMove.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.tasksMove.parse(
		await makeGoogleTasksRequest(
			`${tasksPath(args.taskListId)}/${pathId(args.taskId)}/move`,
			ctx,
			{
				method: 'POST',
				query: {
					destinationTasklist: args.destinationTasklist,
					parent: args.parent,
					previous: args.previous,
				},
			},
		),
	);
	await logEventFromContext(ctx, 'googletasks.tasks.move', {}, 'completed');
	return result;
};

export const clear: GoogleTasksEndpoints['tasksClear'] = async (ctx, input) => {
	const args = GoogleTasksEndpointInputSchemas.tasksClear.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.tasksClear.parse(
		await makeGoogleTasksRequest(
			`/tasks/v1/lists/${pathId(args.taskListId)}/clear`,
			ctx,
			{
				method: 'POST',
			},
		),
	);
	await logEventFromContext(ctx, 'googletasks.tasks.clear', {}, 'completed');
	return result;
};
