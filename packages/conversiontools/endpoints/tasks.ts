import { logEventFromContext } from 'corsair/core';
import type { ConversiontoolsEndpoints } from '..';
import { makeConversiontoolsRequest } from '../client';
import type {
	JsonObject,
	TasksCreateResponse,
	TasksGetResponse,
	TasksListResponse,
	TasksRemoveResponse,
	TasksUpdateRetentionResponse,
} from './types';
import {
	ConversiontoolsEndpointInputSchemas,
	ConversiontoolsEndpointOutputSchemas,
} from './types';

const create: ConversiontoolsEndpoints['tasks']['create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.tasksCreate.parse(input);
	const body: JsonObject = {
		type: parsedInput.type,
		options: parsedInput.options,
	};
	const response = await makeConversiontoolsRequest<TasksCreateResponse>(
		'/tasks',
		ctx.key,
		{ method: 'POST', body },
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.tasksCreate.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.tasks.create',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

const list: ConversiontoolsEndpoints['tasks']['list'] = async (ctx, input) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.tasksList.parse(input);
	const response = await makeConversiontoolsRequest<TasksListResponse>(
		'/tasks',
		ctx.key,
		{ method: 'GET', query: parsedInput },
	);
	const parsed = ConversiontoolsEndpointOutputSchemas.tasksList.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.tasks.list',
		{ count: parsed.data.length },
		'completed',
	);
	return parsed;
};

const get: ConversiontoolsEndpoints['tasks']['get'] = async (ctx, input) => {
	const parsedInput = ConversiontoolsEndpointInputSchemas.tasksGet.parse(input);
	const response = await makeConversiontoolsRequest<TasksGetResponse>(
		`/tasks/${encodeURIComponent(parsedInput.task_id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = ConversiontoolsEndpointOutputSchemas.tasksGet.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.tasks.get',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

const updateRetention: ConversiontoolsEndpoints['tasks']['updateRetention'] =
	async (ctx, input) => {
		const parsedInput =
			ConversiontoolsEndpointInputSchemas.tasksUpdateRetention.parse(input);
		const response =
			await makeConversiontoolsRequest<TasksUpdateRetentionResponse>(
				`/tasks/${encodeURIComponent(parsedInput.task_id)}/retention`,
				ctx.key,
				{
					method: 'PATCH',
					body: { retentionMode: parsedInput.retentionMode },
				},
			);
		const parsed =
			ConversiontoolsEndpointOutputSchemas.tasksUpdateRetention.parse(response);
		await logEventFromContext(
			ctx,
			'conversiontools.tasks.updateRetention',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

const remove: ConversiontoolsEndpoints['tasks']['remove'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.tasksRemove.parse(input);
	const response = await makeConversiontoolsRequest<TasksRemoveResponse>(
		`/tasks/${encodeURIComponent(parsedInput.task_id)}/delete`,
		ctx.key,
		{ method: 'POST' },
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.tasksRemove.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.tasks.remove',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

export const Tasks = { create, list, get, updateRetention, remove };
