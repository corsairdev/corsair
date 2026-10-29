import { logEventFromContext } from 'corsair/core';
import { makeGoogleMapsRequest } from '../client';
import type { GoogleMapsEndpoints } from '../index';
import type { GeolocateResponse } from './types';
import { GeolocateInputSchema, GeolocateResponseSchema } from './types';

export const geolocate: GoogleMapsEndpoints['geolocate'] = async (
	ctx,
	input,
) => {
	const validatedInput = GeolocateInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<GeolocateResponse>(
		'/geolocation/v1/geolocate',
		ctx,
		{
			method: 'POST',
			baseUrl: 'https://www.googleapis.com',
			body: validatedInput as Record<string, unknown>,
		},
	);

	const response = GeolocateResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.geolocation.geolocate',
		validatedInput,
		'completed',
	);

	return response;
};
