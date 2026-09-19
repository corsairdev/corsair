import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['integrationList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['integrationList']
	>('integrations', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.integration.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['integrationCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['integrationCreate']
	>('integrations', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.integration.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['integrationGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['integrationGet']
	>(`integrations/${input.integration_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.integration.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['integrationUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['integrationUpdate']
	>(`integrations/${input.integration_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.integration.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['integrationDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['integrationDelete']
	>(`integrations/${input.integration_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.integration.delete',
		{ ...input },
		'completed',
	);

	return response;
};
