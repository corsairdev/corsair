import { logEventFromContext } from 'corsair/core';
import {
	GoogleMapsAPIError,
	isGoogleMapsOAuth,
	makeGoogleMapsRequest,
	resolvePlacePhotoUrl,
} from '../client';
import type { GoogleMapsEndpoints } from '../index';
import type {
	AutocompleteResponse,
	GetPlaceDetailsResponse,
	NearbySearchResponse,
	TextSearchResponse,
} from './types';
import {
	AutocompleteInputSchema,
	AutocompleteResponseSchema,
	GetPlaceDetailsInputSchema,
	GetPlaceDetailsResponseSchema,
	GetPlacePhotoInputSchema,
	GetPlacePhotoResponseSchema,
	NearbySearchInputSchema,
	NearbySearchResponseSchema,
	TextSearchInputSchema,
	TextSearchResponseSchema,
} from './types';

export const autocomplete: GoogleMapsEndpoints['autocomplete'] = async (
	ctx,
	input,
) => {
	const validatedInput = AutocompleteInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<AutocompleteResponse>(
		'/v1/places:autocomplete',
		ctx,
		{
			method: 'POST',
			baseUrl: 'https://places.googleapis.com',
			body: validatedInput as Record<string, unknown>,
		},
	);

	const response = AutocompleteResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.places.autocomplete',
		validatedInput,
		'completed',
	);

	return response;
};

export const getPlaceDetails: GoogleMapsEndpoints['getPlaceDetails'] = async (
	ctx,
	input,
) => {
	const validatedInput = GetPlaceDetailsInputSchema.parse(input);
	const placePath = validatedInput.place_id.startsWith('places/')
		? validatedInput.place_id
		: `places/${validatedInput.place_id}`;

	const headers: Record<string, string> = {
		'X-Goog-FieldMask':
			validatedInput.fields ??
			'id,formattedAddress,location,displayName,photos',
	};

	const rawResponse = await makeGoogleMapsRequest<GetPlaceDetailsResponse>(
		`/v1/${placePath}`,
		ctx,
		{
			method: 'GET',
			baseUrl: 'https://places.googleapis.com',
			headers,
			query: validatedInput.languageCode
				? { languageCode: validatedInput.languageCode }
				: undefined,
		},
	);

	const response = GetPlaceDetailsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.places.getPlaceDetails',
		validatedInput,
		'completed',
	);

	return response;
};

export const getPlacePhoto: GoogleMapsEndpoints['getPlacePhoto'] = async (
	ctx,
	input,
) => {
	const validatedInput = GetPlacePhotoInputSchema.parse(input);
	const { photo_reference, maxwidth, maxheight } = validatedInput;

	if (!photo_reference.startsWith('places/') && isGoogleMapsOAuth(ctx)) {
		throw new GoogleMapsAPIError(
			'Legacy photo references require API key authentication. Use Places API (New) photo names (places/...) with OAuth.',
			400,
			'INVALID_ARGUMENT',
		);
	}

	let photoRequestUrl: string;
	if (photo_reference.startsWith('places/')) {
		photoRequestUrl = `https://places.googleapis.com/v1/${photo_reference}/media?maxHeightPx=${maxheight ?? 400}&maxWidthPx=${maxwidth ?? 400}`;
	} else {
		photoRequestUrl = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${encodeURIComponent(photo_reference)}&maxwidth=${maxwidth ?? 400}${maxheight ? `&maxheight=${maxheight}` : ''}`;
	}

	const photoUrl = await resolvePlacePhotoUrl(ctx, photoRequestUrl);

	const response = GetPlacePhotoResponseSchema.parse({
		photoUrl,
	});

	await logEventFromContext(
		ctx,
		'googlemaps.places.getPlacePhoto',
		validatedInput,
		'completed',
	);

	return response;
};

export const nearbySearch: GoogleMapsEndpoints['nearbySearch'] = async (
	ctx,
	input,
) => {
	const validatedInput = NearbySearchInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<NearbySearchResponse>(
		'/v1/places:searchNearby',
		ctx,
		{
			method: 'POST',
			baseUrl: 'https://places.googleapis.com',
			headers: {
				'X-Goog-FieldMask':
					'places.displayName,places.formattedAddress,places.location,places.id',
			},
			body: validatedInput as Record<string, unknown>,
		},
	);

	const response = NearbySearchResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.places.nearbySearch',
		validatedInput,
		'completed',
	);

	return response;
};

export const textSearch: GoogleMapsEndpoints['textSearch'] = async (
	ctx,
	input,
) => {
	const validatedInput = TextSearchInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<TextSearchResponse>(
		'/v1/places:searchText',
		ctx,
		{
			method: 'POST',
			baseUrl: 'https://places.googleapis.com',
			headers: {
				'X-Goog-FieldMask':
					'places.displayName,places.formattedAddress,places.location,places.id',
			},
			body: validatedInput as Record<string, unknown>,
		},
	);

	const response = TextSearchResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.places.textSearch',
		validatedInput,
		'completed',
	);

	return response;
};
