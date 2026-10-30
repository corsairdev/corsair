import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['libraryList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['libraryList']
	>('libraries', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.library.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['libraryCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['libraryCreate']
	>('libraries', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.library.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['libraryGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['libraryGet']
	>(`libraries/${input.library_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.library.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['libraryUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['libraryUpdate']
	>(`libraries/${input.library_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.library.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['libraryDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['libraryDelete']
	>(`libraries/${input.library_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.library.delete',
		{ ...input },
		'completed',
	);

	return response;
};
