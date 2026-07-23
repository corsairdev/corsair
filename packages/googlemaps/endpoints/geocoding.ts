import { logEventFromContext } from 'corsair/core';
import { makeGoogleMapsRequest } from '../client';
import type { GoogleMapsEndpoints } from '../index';
import type {
	GeocodeAddressResponse,
	GeocodeAddressWithQueryResponse,
	GeocodeDestinationsResponse,
	GeocodePlaceResponse,
	GeocodingApiResponse,
	ReverseGeocodeLocationResponse,
} from './types';
import {
	GeocodeAddressInputSchema,
	GeocodeAddressResponseSchema,
	GeocodeAddressWithQueryInputSchema,
	GeocodeAddressWithQueryResponseSchema,
	GeocodeDestinationsInputSchema,
	GeocodeDestinationsResponseSchema,
	GeocodePlaceInputSchema,
	GeocodePlaceResponseSchema,
	GeocodingApiInputSchema,
	GeocodingApiResponseSchema,
	ReverseGeocodeLocationInputSchema,
	ReverseGeocodeLocationResponseSchema,
} from './types';

export const geocodeAddress: GoogleMapsEndpoints['geocodeAddress'] = async (
	ctx,
	input,
) => {
	const validatedInput = GeocodeAddressInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<GeocodeAddressResponse>(
		'/maps/api/geocode/json',
		ctx,
		{
			method: 'GET',
			query: {
				address: validatedInput.address,
				bounds: validatedInput.bounds,
				language: validatedInput.language,
				region: validatedInput.region,
				key: validatedInput.key,
			},
		},
	);

	const response = GeocodeAddressResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.geocoding.geocodeAddress',
		validatedInput,
		'completed',
	);

	return response;
};

export const geocodeAddressWithQuery: GoogleMapsEndpoints['geocodeAddressWithQuery'] =
	async (ctx, input) => {
		const validatedInput = GeocodeAddressWithQueryInputSchema.parse(input);

		const rawResponse =
			await makeGoogleMapsRequest<GeocodeAddressWithQueryResponse>(
				'/v1/places:searchText',
				ctx,
				{
					method: 'POST',
					baseUrl: 'https://places.googleapis.com',
					body: {
						textQuery: validatedInput.address,
						regionCode: validatedInput.regionCode,
					},
				},
			);

		const response = GeocodeAddressWithQueryResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'googlemaps.geocoding.geocodeAddressWithQuery',
			validatedInput,
			'completed',
		);

		return response;
	};

export const geocodeDestinations: GoogleMapsEndpoints['geocodeDestinations'] =
	async (ctx, input) => {
		const validatedInput = GeocodeDestinationsInputSchema.parse(input);

		const rawResponse =
			await makeGoogleMapsRequest<GeocodeDestinationsResponse>(
				'/maps/api/geocode/json',
				ctx,
				{
					method: 'GET',
					query: {
						address: validatedInput.address,
						place_id: validatedInput.placeId,
						latlng: validatedInput.latlng,
					},
				},
			);

		const response = GeocodeDestinationsResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'googlemaps.geocoding.geocodeDestinations',
			validatedInput,
			'completed',
		);

		return response;
	};

export const geocodePlace: GoogleMapsEndpoints['geocodePlace'] = async (
	ctx,
	input,
) => {
	const validatedInput = GeocodePlaceInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<GeocodePlaceResponse>(
		'/maps/api/geocode/json',
		ctx,
		{
			method: 'GET',
			query: {
				place_id: validatedInput.place_id,
				language: validatedInput.language,
			},
		},
	);

	const response = GeocodePlaceResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.geocoding.geocodePlace',
		validatedInput,
		'completed',
	);

	return response;
};

export const geocodingApi: GoogleMapsEndpoints['geocodingApi'] = async (
	ctx,
	input,
) => {
	const validatedInput = GeocodingApiInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<GeocodingApiResponse>(
		'/maps/api/geocode/json',
		ctx,
		{
			method: 'GET',
			query: {
				address: validatedInput.address,
				latlng: validatedInput.latlng,
				place_id: validatedInput.place_id,
				language: validatedInput.language,
			},
		},
	);

	const response = GeocodingApiResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.geocoding.geocodingApi',
		validatedInput,
		'completed',
	);

	return response;
};

export const reverseGeocodeLocation: GoogleMapsEndpoints['reverseGeocodeLocation'] =
	async (ctx, input) => {
		const validatedInput = ReverseGeocodeLocationInputSchema.parse(input);

		const rawResponse =
			await makeGoogleMapsRequest<ReverseGeocodeLocationResponse>(
				'/maps/api/geocode/json',
				ctx,
				{
					method: 'GET',
					query: {
						latlng: validatedInput.latlng,
						language: validatedInput.language,
						result_type: validatedInput.result_type,
					},
				},
			);

		const response = ReverseGeocodeLocationResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'googlemaps.geocoding.reverseGeocodeLocation',
			validatedInput,
			'completed',
		);

		return response;
	};
