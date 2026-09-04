import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['threadList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['threadList']
	>('threads', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
			alias: input.alias,
			starts_with: input.starts_with,
			created_by: input.created_by,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.thread.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['threadCreate'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['threadCreate']
	>('threads', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.thread.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['threadGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['threadGet']
	>(`threads/${input.thread_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.thread.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['threadUpdate'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['threadUpdate']
	>(`threads/${input.thread_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.thread.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['threadDelete'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['threadDelete']
	>(`threads/${input.thread_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.thread.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const listMessages: GriptapeEndpoints['threadMessageList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['threadMessageList']
	>(`threads/${input.thread_id}/messages`, ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.threadMessage.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const createMessage: GriptapeEndpoints['threadMessageCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['threadMessageCreate']
	>(`threads/${input.thread_id}/messages`, ctx.key, {
		method: 'POST',
		body: {
			input: input.input,
			output: input.output,
			...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.threadMessage.create',
		{ ...input },
		'completed',
	);

	return response;
};
