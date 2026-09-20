import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import { evictEntity, upsertEntity } from './persist';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

const list: AsinDataApiEndpoints['destinationsList'] = async (ctx, input) => {
	const raw = await makeAsinDataApiRequest<unknown>('destinations', ctx.key, {
		method: 'GET',
		query: input as Record<string, string | number | boolean | undefined>,
	});

	const response = AsinDataApiEndpointOutputSchemas.destinationsList.parse(raw);

	if (response.destinations) {
		for (const dest of response.destinations) {
			await upsertEntity(ctx.db.destinations, dest.id, dest);
		}
	}

	await logEventFromContext(
		ctx,
		'asindataapi.destinations.list',
		{},
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['destinationsList'];
};

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

	if (response.destination) {
		await upsertEntity(
			ctx.db.destinations,
			response.destination.id,
			response.destination,
		);
	}

	await logEventFromContext(
		ctx,
		'asindataapi.destinations.create',
		{ name: input.name, type: input.type },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['destinationsCreate'];
};

const update: AsinDataApiEndpoints['destinationsUpdate'] = async (
	ctx,
	input,
) => {
	const { destination_id, ...fields } = input;
	const raw = await makeAsinDataApiRequest<unknown>(
		`destinations/${encodeURIComponent(destination_id)}`,
		ctx.key,
		{
			method: 'PUT',
			body: fields,
		},
	);

	const response =
		AsinDataApiEndpointOutputSchemas.destinationsUpdate.parse(raw);

	if (response.destination) {
		await upsertEntity(
			ctx.db.destinations,
			response.destination.id,
			response.destination,
		);
	}

	await logEventFromContext(
		ctx,
		'asindataapi.destinations.update',
		{ destination_id },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['destinationsUpdate'];
};

const deleteDestination: AsinDataApiEndpoints['destinationsDelete'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`destinations/${encodeURIComponent(input.destination_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	const response =
		AsinDataApiEndpointOutputSchemas.destinationsDelete.parse(raw);

	await evictEntity(ctx.db.destinations, input.destination_id);

	await logEventFromContext(
		ctx,
		'asindataapi.destinations.delete',
		{ destination_id: input.destination_id },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['destinationsDelete'];
};

export const Destinations = {
	list,
	create,
	update,
	delete: deleteDestination,
};
