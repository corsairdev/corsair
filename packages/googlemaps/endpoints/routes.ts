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

function toRoutesTravelMode(mode?: string): string {
	if (!mode) return 'DRIVE';
	const map: Record<string, string> = {
		driving: 'DRIVE',
		walking: 'WALK',
		bicycling: 'BICYCLE',
		transit: 'TRANSIT',
		drive: 'DRIVE',
		walk: 'WALK',
		bicycle: 'BICYCLE',
	};
	return map[mode.toLowerCase()] ?? mode.toUpperCase();
}

function toRouteWaypoint(location: string): { address: string } {
	return { address: location };
}

function toRouteModifiers(avoid?: string): Record<string, boolean> | undefined {
	if (!avoid) return undefined;
	const items = avoid.split('|').map((a) => a.trim().toLowerCase());
	const modifiers: Record<string, boolean> = {};
	if (items.includes('tolls')) modifiers.avoidTolls = true;
	if (items.includes('highways')) modifiers.avoidHighways = true;
	if (items.includes('ferries')) modifiers.avoidFerries = true;
	return Object.keys(modifiers).length > 0 ? modifiers : undefined;
}

function formatMatrixElement(elem: Record<string, unknown>) {
	return {
		status:
			elem?.condition === 'ROUTE_EXISTS' || !elem?.condition
				? 'OK'
				: 'ZERO_RESULTS',
		distance:
			elem?.distanceMeters !== undefined
				? { text: `${elem.distanceMeters} m`, value: elem.distanceMeters }
				: undefined,
		duration: elem?.duration
			? {
					text: elem.duration,
					value: parseInt(String(elem.duration).replace('s', ''), 10),
				}
			: undefined,
		...elem,
	};
}

function adaptComputeRouteMatrixToLegacy(
	elementsArray: Record<string, unknown>[],
	originsList: string[],
	destinationsList: string[],
): DistanceMatrixResponse {
	const numOrigins = originsList.length;
	const numDestinations = destinationsList.length;

	const rows = Array.from({ length: numOrigins }, () => ({
		elements: Array.from({ length: numDestinations }, () => ({
			status: 'ZERO_RESULTS',
		})),
	}));

	for (const elem of elementsArray) {
		const originIdx = (elem.originIndex as number) ?? 0;
		const destIdx = (elem.destinationIndex as number) ?? 0;
		if (originIdx < numOrigins && destIdx < numDestinations) {
			rows[originIdx]!.elements[destIdx] = formatMatrixElement(elem);
		}
	}

	return {
		status: 'OK',
		origin_addresses: originsList,
		destination_addresses: destinationsList,
		rows,
	};
}

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

	let rawResponse: DistanceMatrixResponse;

	const isOAuth =
		(ctx as any).authType === 'oauth_2' ||
		(ctx as any).options?.authType === 'oauth_2';

	if (isOAuth) {
		const originsList = Array.isArray(validatedInput.origins)
			? validatedInput.origins
			: [validatedInput.origins];
		const destinationsList = Array.isArray(validatedInput.destinations)
			? validatedInput.destinations
			: [validatedInput.destinations];

		const matrixBody = {
			origins: originsList.map((o) => ({ waypoint: { address: o } })),
			destinations: destinationsList.map((d) => ({ waypoint: { address: d } })),
			travelMode: toRoutesTravelMode(validatedInput.mode),
		};

		const res = await makeGoogleMapsRequest<unknown>(
			'/distanceMatrix/v1:computeRouteMatrix',
			ctx,
			{
				method: 'POST',
				baseUrl: 'https://routes.googleapis.com',
				body: matrixBody,
			},
		);

		const elementsArray = (
			Array.isArray(res) ? res : ((res as any)?.elements ?? [res])
		) as Record<string, unknown>[];

		rawResponse = adaptComputeRouteMatrixToLegacy(
			elementsArray,
			originsList,
			destinationsList,
		);
	} else {
		const originsStr = Array.isArray(validatedInput.origins)
			? validatedInput.origins.join('|')
			: validatedInput.origins;
		const destinationsStr = Array.isArray(validatedInput.destinations)
			? validatedInput.destinations.join('|')
			: validatedInput.destinations;

		rawResponse = await makeGoogleMapsRequest<DistanceMatrixResponse>(
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
	}

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

	let rawResponse: GetDirectionResponse;

	const isOAuth =
		(ctx as any).authType === 'oauth_2' ||
		(ctx as any).options?.authType === 'oauth_2';

	if (isOAuth) {
		const routeBody: Record<string, unknown> = {
			origin: toRouteWaypoint(validatedInput.origin),
			destination: toRouteWaypoint(validatedInput.destination),
			travelMode: toRoutesTravelMode(validatedInput.mode),
		};

		const waypointsList = validatedInput.waypoints
			? Array.isArray(validatedInput.waypoints)
				? validatedInput.waypoints
				: validatedInput.waypoints.split('|')
			: undefined;

		if (waypointsList?.length) {
			routeBody.intermediates = waypointsList.map(toRouteWaypoint);
		}

		const routeModifiers = toRouteModifiers(validatedInput.avoid);
		if (routeModifiers) {
			routeBody.routeModifiers = routeModifiers;
		}

		const res = await makeGoogleMapsRequest<Record<string, unknown>>(
			'/directions/v2:computeRoutes',
			ctx,
			{
				method: 'POST',
				baseUrl: 'https://routes.googleapis.com',
				body: routeBody,
			},
		);

		rawResponse = {
			status: 'OK',
			routes: Array.isArray(res.routes)
				? (res.routes as Record<string, unknown>[])
				: [res],
		};
	} else {
		const waypointsStr = Array.isArray(validatedInput.waypoints)
			? validatedInput.waypoints.join('|')
			: validatedInput.waypoints;

		rawResponse = await makeGoogleMapsRequest<GetDirectionResponse>(
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
	}

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
