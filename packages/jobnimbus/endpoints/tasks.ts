import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const tasksCreate: JobNimbusEndpoints['tasksCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.tasksCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>('/tasks', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.tasksCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.tasks.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const tasksUpdate: JobNimbusEndpoints['tasksUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.tasksUpdate.parse(input);
	const { jnid, ...body } = parsedInput;

	const response = await makeJobNimbusRequest<unknown>(
		`/tasks/${encodeURIComponent(jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.tasksUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.tasks.update',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const tasksDelete: JobNimbusEndpoints['tasksDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.tasksDelete.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/tasks/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { is_active: false },
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.tasksDelete.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.tasks.delete',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const tasksGet: JobNimbusEndpoints['tasksGet'] = async (ctx, input) => {
	const parsedInput = JobNimbusEndpointInputSchemas.tasksGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/tasks/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.tasksGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.tasks.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const tasksList: JobNimbusEndpoints['tasksList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.tasksList.parse(input);

	const response = await makeJobNimbusRequest<unknown>('/tasks', ctx.key, {
		method: 'GET',
		query: compactQuery({
			size: parsedInput.size,
			from: parsedInput.from,
			sort_field: parsedInput.sort,
			sort_direction: parsedInput.direction,
			actor: parsedInput.actor,
		}),
	});

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.tasksList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.tasks.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const Tasks = {
	create: tasksCreate,
	update: tasksUpdate,
	delete: tasksDelete,
	get: tasksGet,
	list: tasksList,
};
