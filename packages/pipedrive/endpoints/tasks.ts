import { logEventFromContext } from 'corsair/core';
import { makePipedriveRequest } from '../client';
import type { PipedriveEndpoints } from '../index';
import {
	PipedriveEndpointInputSchemas,
	PipedriveEndpointOutputSchemas,
} from './types';

type QueryScalar = string | number | boolean | undefined;

function toQuery(
	input: Record<string, QueryScalar | null>,
): Record<string, QueryScalar> {
	return Object.fromEntries(
		Object.entries(input).map(([key, value]) => [
			key,
			value === null ? 'null' : value,
		]),
	);
}

function authType(ctx: Parameters<PipedriveEndpoints['taskList']>[0]) {
	return ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key';
}

export const listTasks: PipedriveEndpoints['taskList'] = async (ctx, input) => {
	const parsedInput = PipedriveEndpointInputSchemas.taskList.parse(input);
	const response = await makePipedriveRequest(
		'/tasks',
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(parsedInput) },
	);
	const parsed = PipedriveEndpointOutputSchemas.taskList.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.tasks.list',
		{ count: parsed.data?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const getTask: PipedriveEndpoints['taskGet'] = async (ctx, input) => {
	const { id } = PipedriveEndpointInputSchemas.taskGet.parse(input);
	const response = await makePipedriveRequest(
		`/tasks/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'GET' },
	);
	const parsed = PipedriveEndpointOutputSchemas.taskGet.parse(response);
	await logEventFromContext(ctx, 'pipedrive.tasks.get', {}, 'completed');
	return parsed;
};

export const createTask: PipedriveEndpoints['taskCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.taskCreate.parse(input);
	const response = await makePipedriveRequest(
		'/tasks',
		ctx.key,
		authType(ctx),
		{ method: 'POST', body: parsedInput },
	);
	const parsed = PipedriveEndpointOutputSchemas.taskCreate.parse(response);
	await logEventFromContext(ctx, 'pipedrive.tasks.create', {}, 'completed');
	return parsed;
};

export const updateTask: PipedriveEndpoints['taskUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.taskUpdate.parse(input);
	const { id, ...body } = parsedInput;
	const response = await makePipedriveRequest(
		`/tasks/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'PATCH', body },
	);
	const parsed = PipedriveEndpointOutputSchemas.taskUpdate.parse(response);
	await logEventFromContext(ctx, 'pipedrive.tasks.update', {}, 'completed');
	return parsed;
};

export const deleteTask: PipedriveEndpoints['taskDelete'] = async (
	ctx,
	input,
) => {
	const { id } = PipedriveEndpointInputSchemas.taskDelete.parse(input);
	const response = await makePipedriveRequest(
		`/tasks/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'DELETE' },
	);
	const parsed = PipedriveEndpointOutputSchemas.taskDelete.parse(response);
	await logEventFromContext(ctx, 'pipedrive.tasks.delete', {}, 'completed');
	return parsed;
};
