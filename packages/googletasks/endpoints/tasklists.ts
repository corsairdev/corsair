import { logEventFromContext } from 'corsair/core';
import { makeGoogleTasksRequest } from '../client';
import type { GoogleTasksEndpoints } from '../index';
import {
	GoogleTasksEndpointInputSchemas,
	GoogleTasksEndpointOutputSchemas,
} from './types';

const pathId = (id: string) => encodeURIComponent(id);
const listsPath = '/tasks/v1/users/@me/lists';

export const list: GoogleTasksEndpoints['taskListsList'] = async (
	ctx,
	input,
) => {
	const args = GoogleTasksEndpointInputSchemas.taskListsList.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.taskListsList.parse(
		await makeGoogleTasksRequest(listsPath, ctx, {
			query: { maxResults: args.maxResults, pageToken: args.pageToken },
		}),
	);
	await logEventFromContext(ctx, 'googletasks.taskLists.list', {}, 'completed');
	return result;
};

export const get: GoogleTasksEndpoints['taskListsGet'] = async (ctx, input) => {
	const args = GoogleTasksEndpointInputSchemas.taskListsGet.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.taskListsGet.parse(
		await makeGoogleTasksRequest(
			`${listsPath}/${pathId(args.taskListId)}`,
			ctx,
		),
	);
	await logEventFromContext(ctx, 'googletasks.taskLists.get', {}, 'completed');
	return result;
};

export const insert: GoogleTasksEndpoints['taskListsInsert'] = async (
	ctx,
	input,
) => {
	const args = GoogleTasksEndpointInputSchemas.taskListsInsert.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.taskListsInsert.parse(
		await makeGoogleTasksRequest(listsPath, ctx, {
			method: 'POST',
			body: args.taskList,
		}),
	);
	await logEventFromContext(
		ctx,
		'googletasks.taskLists.insert',
		{},
		'completed',
	);
	return result;
};

export const update: GoogleTasksEndpoints['taskListsUpdate'] = async (
	ctx,
	input,
) => {
	const args = GoogleTasksEndpointInputSchemas.taskListsUpdate.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.taskListsUpdate.parse(
		await makeGoogleTasksRequest(
			`${listsPath}/${pathId(args.taskListId)}`,
			ctx,
			{
				method: 'PUT',
				body: args.taskList,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'googletasks.taskLists.update',
		{},
		'completed',
	);
	return result;
};

export const patch: GoogleTasksEndpoints['taskListsPatch'] = async (
	ctx,
	input,
) => {
	const args = GoogleTasksEndpointInputSchemas.taskListsPatch.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.taskListsPatch.parse(
		await makeGoogleTasksRequest(
			`${listsPath}/${pathId(args.taskListId)}`,
			ctx,
			{
				method: 'PATCH',
				body: args.taskList,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'googletasks.taskLists.patch',
		{},
		'completed',
	);
	return result;
};

export const deleteTaskList: GoogleTasksEndpoints['taskListsDelete'] = async (
	ctx,
	input,
) => {
	const args = GoogleTasksEndpointInputSchemas.taskListsDelete.parse(input);
	const result = GoogleTasksEndpointOutputSchemas.taskListsDelete.parse(
		await makeGoogleTasksRequest(
			`${listsPath}/${pathId(args.taskListId)}`,
			ctx,
			{
				method: 'DELETE',
			},
		),
	);
	await logEventFromContext(
		ctx,
		'googletasks.taskLists.delete',
		{},
		'completed',
	);
	return result;
};
