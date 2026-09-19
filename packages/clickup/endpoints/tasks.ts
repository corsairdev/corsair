import { logEventFromContext } from 'corsair/core';
import type { ClickupEndpoints } from '..';
import { makeClickupRequest } from '../client';
import type { ClickupEndpointOutputs } from './types';

export const list: ClickupEndpoints['tasksList'] = async (ctx, input) => {
	const { list_id, page } = input;
	const response = await makeClickupRequest<
		ClickupEndpointOutputs['tasksList']
	>(`list/${list_id}/task`, ctx.key, {
		method: 'GET',
		query: page !== undefined ? { page } : undefined,
	});

	await logEventFromContext(
		ctx,
		'clickup.tasks.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: ClickupEndpoints['tasksGet'] = async (ctx, input) => {
	const response = await makeClickupRequest<ClickupEndpointOutputs['tasksGet']>(
		`task/${input.task_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.tasks.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: ClickupEndpoints['tasksCreate'] = async (ctx, input) => {
	const { list_id, ...body } = input;
	const response = await makeClickupRequest<
		ClickupEndpointOutputs['tasksCreate']
	>(`list/${list_id}/task`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'clickup.tasks.create',
		{ list_id },
		'completed',
	);
	return response;
};

export const update: ClickupEndpoints['tasksUpdate'] = async (ctx, input) => {
	const { task_id, ...body } = input;
	const response = await makeClickupRequest<
		ClickupEndpointOutputs['tasksUpdate']
	>(`task/${task_id}`, ctx.key, { method: 'PUT', body });

	await logEventFromContext(
		ctx,
		'clickup.tasks.update',
		{ task_id },
		'completed',
	);
	return response;
};

export const deleteFn: ClickupEndpoints['tasksDelete'] = async (ctx, input) => {
	const response = await makeClickupRequest<
		ClickupEndpointOutputs['tasksDelete']
	>(`task/${input.task_id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'clickup.tasks.delete',
		{ ...input },
		'completed',
	);
	return response;
};
