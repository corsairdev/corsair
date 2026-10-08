import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['dataConnectorList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['dataConnectorList']
	>('data-connectors', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.dataConnector.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['dataConnectorCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['dataConnectorCreate']
	>('data-connectors', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.dataConnector.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['dataConnectorGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['dataConnectorGet']
	>(`data-connectors/${input.data_connector_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.dataConnector.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['dataConnectorUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['dataConnectorUpdate']
	>(`data-connectors/${input.data_connector_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.dataConnector.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['dataConnectorDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['dataConnectorDelete']
	>(`data-connectors/${input.data_connector_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.dataConnector.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const createJob: GriptapeEndpoints['dataConnectorCreateJob'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['dataConnectorCreateJob']
	>(`data-connectors/${input.data_connector_id}/data-jobs`, ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.dataConnector.createJob',
		{ ...input },
		'completed',
	);

	return response;
};

export const getDataJob: GriptapeEndpoints['dataJobGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['dataJobGet']
	>(`data-jobs/${input.data_job_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.dataJob.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const cancelDataJob: GriptapeEndpoints['dataJobCancel'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['dataJobCancel']
	>(`data-jobs/${input.data_job_id}/cancel`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'griptape.dataJob.cancel',
		{ ...input },
		'completed',
	);

	return response;
};
