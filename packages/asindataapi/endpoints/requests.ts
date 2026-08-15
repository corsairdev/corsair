import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

/**
 * List all Requests in a Collection (paginated, 1000 per page).
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/requests/list
 */
export const listRequests: AsinDataApiEndpoints['requestsList'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${input.collectionId}/requests/${input.page}`,
		ctx.key,
		{ method: 'GET' },
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsList.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.requests.list',
		{ collectionId: input.collectionId, page: input.page },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsList'];
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
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${input.collectionId}`,
		ctx.key,
		{
			method: 'PUT',
			body: { requests: input.requests },
		},
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsAdd.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.requests.add',
		{ collectionId: input.collectionId, count: input.requests.length },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsAdd'];
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
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${collectionId}/${requestId}`,
		ctx.key,
		{
			method: 'PUT',
			body: fields,
		},
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsUpdate.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.requests.update',
		{ collectionId, requestId },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsUpdate'];
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
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${input.collectionId}/requests`,
		ctx.key,
		{
			method: 'DELETE',
			body: input.requestIds,
		},
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsClear.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.requests.clear',
		{ collectionId: input.collectionId, count: input.requestIds.length },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsClear'];
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
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${input.collectionId}/${input.requestId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsDelete.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.requests.delete',
		{ collectionId: input.collectionId, requestId: input.requestId },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsDelete'];
};

export const Requests = {
	list: listRequests,
	add: addRequests,
	update: updateRequest,
	clear: clearRequests,
	delete: deleteRequest,
};
