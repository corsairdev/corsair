import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['secretList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['secretList']
	>('secrets', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.secret.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['secretCreate'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['secretCreate']
	>('secrets', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.secret.create',
		// Never persist the secret body (CWE-532): it carries the secret value.
		{},
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['secretGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['secretGet']
	>(`secrets/${input.secret_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.secret.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['secretUpdate'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['secretUpdate']
	>(`secrets/${input.secret_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.secret.update',
		// Never persist the secret body (CWE-532): it carries the secret value.
		{ secret_id: input.secret_id },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['secretDelete'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['secretDelete']
	>(`secrets/${input.secret_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.secret.delete',
		{ ...input },
		'completed',
	);

	return response;
};
