import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import { evictEntity, upsertEntity } from './persist';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

export const listRequests: AsinDataApiEndpoints['requestsList'] = async (
	ctx,
	input,
) => {
	const page = input.page ?? 1;
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(input.collection_id)}/requests/${page}`,
		ctx.key,
		{ method: 'GET' },
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsList.parse(raw);

	if (response.requests) {
		for (const req of response.requests) {
			await upsertEntity(ctx.db.requests, req.id, req);
		}
	}

	await logEventFromContext(
		ctx,
		'asindataapi.requests.list',
		{ collection_id: input.collection_id, page },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsList'];
};

export const addRequests: AsinDataApiEndpoints['requestsAdd'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(input.collection_id)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { requests: input.requests },
		},
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsAdd.parse(raw);

	if (response.collection) {
		await upsertEntity(
			ctx.db.collections,
			response.collection.id,
			response.collection,
		);
	}

	await logEventFromContext(
		ctx,
		'asindataapi.requests.add',
		{ collection_id: input.collection_id, count: input.requests.length },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsAdd'];
};

export const updateRequest: AsinDataApiEndpoints['requestsUpdate'] = async (
	ctx,
	input,
) => {
	const { collection_id, request_id, ...fields } = input;
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(collection_id)}/${encodeURIComponent(request_id)}`,
		ctx.key,
		{
			method: 'PUT',
			body: fields,
		},
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsUpdate.parse(raw);

	if (response.request && 'id' in response.request && response.request.id) {
		await upsertEntity(ctx.db.requests, String(response.request.id), {
			...response.request,
			id: String(response.request.id),
		});
	} else {
		await evictEntity(ctx.db.requests, request_id);
	}

	await logEventFromContext(
		ctx,
		'asindataapi.requests.update',
		{ collection_id, request_id },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsUpdate'];
};

export const clearRequests: AsinDataApiEndpoints['requestsClear'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(input.collection_id)}/requests`,
		ctx.key,
		{
			method: 'DELETE',
			body: input.request_ids,
		},
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsClear.parse(raw);

	for (const id of input.request_ids) {
		await evictEntity(ctx.db.requests, id);
	}

	await logEventFromContext(
		ctx,
		'asindataapi.requests.clear',
		{ collection_id: input.collection_id, count: input.request_ids.length },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['requestsClear'];
};

export const deleteRequest: AsinDataApiEndpoints['requestsDelete'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(input.collection_id)}/${encodeURIComponent(input.request_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	const response = AsinDataApiEndpointOutputSchemas.requestsDelete.parse(raw);

	await evictEntity(ctx.db.requests, input.request_id);

	await logEventFromContext(
		ctx,
		'asindataapi.requests.delete',
		{ collection_id: input.collection_id, request_id: input.request_id },
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
