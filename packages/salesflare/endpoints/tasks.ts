import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listTasks: SalesflareEndpoints['listTasks'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listTasks']
	>(ctx, '/tasks', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.tasks.listTasks',
		input,
		'completed',
	);
	return response;
};

export const createTask: SalesflareEndpoints['createTask'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['createTask']
	>(ctx, '/tasks', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'salesflare.tasks.createTask',
		input,
		'completed',
	);
	return response;
};

export const updateTask: SalesflareEndpoints['updateTask'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateTask']
	>(ctx, salesflarePathParameter('/tasks/{id}', 'id', input.id), {
		method: 'PUT',
		body: body,
	});
	await logEventFromContext(
		ctx,
		'salesflare.tasks.updateTask',
		input,
		'completed',
	);
	return response;
};

export const deleteTask: SalesflareEndpoints['deleteTask'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['deleteTask']
	>(ctx, salesflarePathParameter('/tasks/{id}', 'id', input.id), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'salesflare.tasks.deleteTask',
		input,
		'completed',
	);
	return response;
};
