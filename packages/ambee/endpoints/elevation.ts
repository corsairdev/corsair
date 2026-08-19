import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeEndpoints } from '../index';
import type { ElevationResponse } from './types';
import { ElevationResponseSchema } from './types';

/**
 * Ground elevation at a coordinate pair.
 *
 * API: GET api.ambeedata.com/elevation/latest/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/elevation
 */
export const getByLatLng: AmbeeEndpoints['elevationGetByLatLng'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmbeeRequest<ElevationResponse>(
		'elevation/latest/by-lat-lng',
		ctx.key,
		{ query: { lat: input.lat, lng: input.lng } },
	);

	const response = ElevationResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.elevation.getByLatLng',
		{ lat: input.lat, lng: input.lng },
		'completed',
	);

	return response;
};

/**
 * Ground elevation for a named place.
 *
 * API: GET api.ambeedata.com/elevation/latest/by-place
 * Docs: https://docs.ambeedata.com/apis/elevation
 */
export const getByPlace: AmbeeEndpoints['elevationGetByPlace'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmbeeRequest<ElevationResponse>(
		'elevation/latest/by-place',
		ctx.key,
		{ query: { place: input.place } },
	);

	const response = ElevationResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.elevation.getByPlace',
		{ place: input.place },
		'completed',
	);

	return response;
};
