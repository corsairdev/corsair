import { logEventFromContext } from 'corsair/core';
import { makeBoxheroRequest } from '../client';
import type { BoxheroEndpoints } from '../index.ts';
import type { BoxheroEndpointOutputs } from './types';

export const listLocations: BoxheroEndpoints['locationsList'] = async (
	ctx,
	input,
) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['locationsList']
	>('/v1/locations', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'boxhero.locations.list', input, 'completed');
	return response;
};

export const getLocation: BoxheroEndpoints['locationsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['locationsGet']
	>(`/v1/locations/${input.location_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'boxhero.locations.get', input, 'completed');
	return response;
};

export const deleteLocation: BoxheroEndpoints['locationsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['locationsDelete']
	>(`/v1/locations/${input.location_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'boxhero.locations.delete',
		{ location_id: input.location_id },
		'completed',
	);
	return response;
};
