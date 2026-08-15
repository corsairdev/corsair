import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

/**
 * List all configured Destinations on the account.
 *
 * Destinations control where Collection Result Sets are exported (S3, GCS, Azure Blob).
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/destinations
 */
const list: AsinDataApiEndpoints['destinationsList'] = async (ctx, input) => {
	const raw = await makeAsinDataApiRequest<unknown>('destinations', ctx.key, {
		method: 'GET',
		query: input as Record<string, string | number | boolean | undefined>,
	});

	const response = AsinDataApiEndpointOutputSchemas.destinationsList.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.destinations.list',
		{},
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['destinationsList'];
};

/**
 * Create a new Destination.
 *
 * Supports Amazon S3, Google Cloud Storage, Microsoft Azure Blob Storage, and S3-compatible.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/destinations
 */
const create: AsinDataApiEndpoints['destinationsCreate'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>('destinations', ctx.key, {
		method: 'POST',
		body: input,
	});

	const response =
		AsinDataApiEndpointOutputSchemas.destinationsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.destinations.create',
		{ name: input.name, type: input.type },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['destinationsCreate'];
};

/**
 * Update an existing Destination's configuration.
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/destinations
 */
const update: AsinDataApiEndpoints['destinationsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } = input;
	const raw = await makeAsinDataApiRequest<unknown>(
		`destinations/${id}`,
		ctx.key,
		{
			method: 'PUT',
			body: fields,
		},
	);

	const response =
		AsinDataApiEndpointOutputSchemas.destinationsUpdate.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.destinations.update',
		{ id },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['destinationsUpdate'];
};

/**
 * Delete one or more Destinations by their IDs.
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/destinations
 */
const deleteDestinations: AsinDataApiEndpoints['destinationsDelete'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>('destinations', ctx.key, {
		method: 'DELETE',
		body: input.ids,
	});

	const response =
		AsinDataApiEndpointOutputSchemas.destinationsDelete.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.destinations.delete',
		{ ids: input.ids },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['destinationsDelete'];
};

export const Destinations = {
	list,
	create,
	update,
	delete: deleteDestinations,
};
