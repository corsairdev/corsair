import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['functionList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['functionList']
	>('functions', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.function.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['functionCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['functionCreate']
	>('functions', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.function.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['functionGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['functionGet']
	>(`functions/${input.function_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.function.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['functionUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['functionUpdate']
	>(`functions/${input.function_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.function.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['functionDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['functionDelete']
	>(`functions/${input.function_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.function.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const listDeployments: GriptapeEndpoints['functionListDeployments'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['functionListDeployments']
		>(`functions/${input.function_id}/deployments`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'griptape.function.listDeployments',
			{ ...input },
			'completed',
		);

		return response;
	};

export const createDeployment: GriptapeEndpoints['functionCreateDeployment'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['functionCreateDeployment']
		>(`functions/${input.function_id}/deployments`, ctx.key, {
			method: 'POST',
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'griptape.function.createDeployment',
			{ ...input },
			'completed',
		);

		return response;
	};
