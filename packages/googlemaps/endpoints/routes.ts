import { logEventFromContext } from 'corsair/core';
import { makeGoogleMapsRequest } from '../client';
import type { GoogleMapsEndpoints } from '../index';
import type {
	ComputeRouteMatrixResponse,
	DistanceMatrixResponse,
	GetDirectionResponse,
	GetRouteResponse,
} from './types';
import {
	ComputeRouteMatrixInputSchema,
	ComputeRouteMatrixResponseSchema,
	DistanceMatrixInputSchema,
	DistanceMatrixResponseSchema,
	GetDirectionInputSchema,
	GetDirectionResponseSchema,
	GetRouteInputSchema,
	GetRouteResponseSchema,
} from './types';

export const computeRouteMatrix: GoogleMapsEndpoints['computeRouteMatrix'] =
	async (ctx, input) => {
		const validatedInput = ComputeRouteMatrixInputSchema.parse(input);

		const rawResponse = await makeGoogleMapsRequest<ComputeRouteMatrixResponse>(
			'/distanceMatrix/v1:computeRouteMatrix',
			ctx,
			{
				method: 'POST',
				baseUrl: 'https://routes.googleapis.com',
				body: validatedInput as Record<string, unknown>,
			},
		);

		const response = ComputeRouteMatrixResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'googlemaps.routes.computeRouteMatrix',
			validatedInput,
			'completed',
		);

		return response;
	};

export const distanceMatrix: GoogleMapsEndpoints['distanceMatrix'] = async (
	ctx,
	input,
) => {
	const validatedInput = DistanceMatrixInputSchema.parse(input);
	const originsStr = Array.isArray(validatedInput.origins)
		? validatedInput.origins.join('|')
		: validatedInput.origins;
	const destinationsStr = Array.isArray(validatedInput.destinations)
		? validatedInput.destinations.join('|')
		: validatedInput.destinations;

	const rawResponse = await makeGoogleMapsRequest<DistanceMatrixResponse>(
		'/maps/api/distancematrix/json',
		ctx,
		{
			method: 'GET',
			query: {
				origins: originsStr,
				destinations: destinationsStr,
				mode: validatedInput.mode,
				units: validatedInput.units,
				departure_time: validatedInput.departure_time,
			},
		},
	);

	const response = DistanceMatrixResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.routes.distanceMatrix',
		validatedInput,
		'completed',
	);

	return response;
};

export const getDirection: GoogleMapsEndpoints['getDirection'] = async (
	ctx,
	input,
) => {
	const validatedInput = GetDirectionInputSchema.parse(input);
	const waypointsStr = Array.isArray(validatedInput.waypoints)
		? validatedInput.waypoints.join('|')
		: validatedInput.waypoints;

	const rawResponse = await makeGoogleMapsRequest<GetDirectionResponse>(
		'/maps/api/directions/json',
		ctx,
		{
			method: 'GET',
			query: {
				origin: validatedInput.origin,
				destination: validatedInput.destination,
				mode: validatedInput.mode,
				waypoints: waypointsStr,
				avoid: validatedInput.avoid,
			},
		},
	);

	const response = GetDirectionResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.routes.getDirection',
		validatedInput,
		'completed',
	);

	return response;
};

export const getRoute: GoogleMapsEndpoints['getRoute'] = async (ctx, input) => {
	const validatedInput = GetRouteInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<GetRouteResponse>(
		'/directions/v2:computeRoutes',
		ctx,
		{
			method: 'POST',
			baseUrl: 'https://routes.googleapis.com',
			body: validatedInput as Record<string, unknown>,
		},
	);

	const response = GetRouteResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.routes.getRoute',
		validatedInput,
		'completed',
	);

	return response;
};
