import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/locations (CreateLocation). */
export const create: SquareEndpoints['locationsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.locationsCreate.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/locations', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.locationsCreate,
		event: 'locations.create',
	});
};

/** GET /v2/locations (ListLocations). */
export const list: SquareEndpoints['locationsList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.locationsList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/locations', {
		output: SquareEndpointOutputSchemas.locationsList,
		event: 'locations.list',
	});
};

/** GET /v2/locations/{location_id} (RetrieveLocation). */
export const get: SquareEndpoints['locationsGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.locationsGet.parse(rawInput);
	return callSquare(ctx, '/v2/locations/{location_id}', {
		path: { location_id: input.location_id },
		output: SquareEndpointOutputSchemas.locationsGet,
		event: 'locations.get',
		logged: { location_id: input.location_id },
	});
};

/** PUT /v2/locations/{location_id} (UpdateLocation). */
export const update: SquareEndpoints['locationsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.locationsUpdate.parse(rawInput);
	const { location_id, ...body } = input;
	return callSquare(ctx, '/v2/locations/{location_id}', {
		method: 'PUT',
		body,
		path: { location_id },
		output: SquareEndpointOutputSchemas.locationsUpdate,
		event: 'locations.update',
		logged: { location_id },
	});
};
