import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeEndpoints } from '../index';
import { persistGeocodeResults } from './persist';
import type { GeocodeResponse } from './types';
import { GeocodeResponseSchema } from './types';

/**
 * Geocode a place name or address into coordinates.
 *
 * API: GET api.ambeedata.com/geocode/by-place
 * Docs: https://docs.ambeedata.com/apis/location
 */
export const byPlace: AmbeeEndpoints['geocodeByPlace'] = async (ctx, input) => {
	const raw = await makeAmbeeRequest<GeocodeResponse>(
		'geocode/by-place',
		ctx.key,
		{ query: { place: input.place } },
	);

	const response = GeocodeResponseSchema.parse(raw);

	await persistGeocodeResults(ctx, input.place, response.data);
	await logEventFromContext(
		ctx,
		'ambee.geocode.byPlace',
		{ place: input.place },
		'completed',
	);

	return response;
};

/**
 * Reverse-geocode a coordinate pair into a human-readable address.
 *
 * API: GET api.ambeedata.com/geocode/reverse/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/location
 */
export const reverseByLatLng: AmbeeEndpoints['geocodeReverseByLatLng'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmbeeRequest<GeocodeResponse>(
		'geocode/reverse/by-lat-lng',
		ctx.key,
		{ query: { lat: input.lat, lng: input.lng } },
	);

	const response = GeocodeResponseSchema.parse(raw);

	await persistGeocodeResults(ctx, `${input.lat},${input.lng}`, response.data);
	await logEventFromContext(
		ctx,
		'ambee.geocode.reverseByLatLng',
		{ lat: input.lat, lng: input.lng },
		'completed',
	);

	return response;
};
