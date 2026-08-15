import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';

/**
 * List all Requests in a Collection (paginated, 1000 per page).
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/requests/list
 */
export const listRequests: AsinDataApiEndpoints['requestsList'] = async (
	ctx,
	input,
) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['requestsList']
	>(`collections/${input.collectionId}/requests/${input.page}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'asindataapi.requests.list',
		{ collectionId: input.collectionId, page: input.page },
		'completed',
	);
	return response;
};

/**
 * Add Requests to a Collection (up to 1000 per call, call sequentially).
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/requests/create
 */
export const addRequests: AsinDataApiEndpoints['requestsAdd'] = async (
	ctx,
	input,
) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['requestsAdd']
	>(`collections/${input.collectionId}`, ctx.key, {
		method: 'PUT',
		body: { requests: input.requests },
	});

	await logEventFromContext(
		ctx,
		'asindataapi.requests.add',
		{ collectionId: input.collectionId, count: input.requests.length },
		'completed',
	);
	return response;
};

/**
 * Update a single Request within a Collection.
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/requests/update
 */
export const updateRequest: AsinDataApiEndpoints['requestsUpdate'] = async (
	ctx,
	input,
) => {
	const { collectionId, requestId, ...fields } = input;
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['requestsUpdate']
	>(`collections/${collectionId}/${requestId}`, ctx.key, {
		method: 'PUT',
		body: fields,
	});

	await logEventFromContext(
		ctx,
		'asindataapi.requests.update',
		{ collectionId, requestId },
		'completed',
	);
	return response;
};

/**
 * Bulk-delete multiple Requests from a Collection by their IDs.
 *
 * Only works when the collection is not running.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/requests/delete
 */
export const clearRequests: AsinDataApiEndpoints['requestsClear'] = async (
	ctx,
	input,
) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['requestsClear']
	>(`collections/${input.collectionId}/requests`, ctx.key, {
		method: 'DELETE',
		body: input.requestIds,
	});

	await logEventFromContext(
		ctx,
		'asindataapi.requests.clear',
		{ collectionId: input.collectionId, count: input.requestIds.length },
		'completed',
	);
	return response;
};

/**
 * Delete a single Request from a Collection.
 *
 * Only works when the collection is not running.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/requests/delete
 */
export const deleteRequest: AsinDataApiEndpoints['requestsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['requestsDelete']
	>(`collections/${input.collectionId}/${input.requestId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'asindataapi.requests.delete',
		{ collectionId: input.collectionId, requestId: input.requestId },
		'completed',
	);
	return response;
};

export const Requests = {
	list: listRequests,
	add: addRequests,
	update: updateRequest,
	clear: clearRequests,
	delete: deleteRequest,
};
