import { HERE_HOSTS, makeHereRequest } from '../client';
import type { HereEndpoints } from '../index';
import { runHereEndpoint } from './call';
import {
	ComputeMatrixInputSchema,
	ComputeMatrixResponseSchema,
	DecodeRouteHandleInputSchema,
	DecodeRouteHandleResponseSchema,
	FindWaypointSequenceInputSchema,
	FindWaypointSequenceResponseSchema,
	GetIsolinesInputSchema,
	GetIsolinesResponseSchema,
	GetMatrixProfileInputSchema,
	GetMatrixProfileResponseSchema,
	GetMatrixResultInputSchema,
	GetMatrixResultResponseSchema,
	GetRoutesInputSchema,
	GetRoutesResponseSchema,
	ListMatrixProfilesInputSchema,
	ListMatrixProfilesResponseSchema,
	PostRoutesInputSchema,
	PostRoutesResponseSchema,
} from './types';

export const getRoutes: HereEndpoints['getRoutes'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.routing.getRoutes',
		GetRoutesInputSchema,
		GetRoutesResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.router, '/v8/routes', apiKey, {
				query: {
					origin: validated.origin,
					destination: validated.destination,
					transportMode: validated.transportMode,
					via: validated.via,
					return: validated.return,
					departureTime: validated.departureTime,
					routingMode: validated.routingMode,
					lang: validated.lang,
				},
			}),
	);

export const postRoutes: HereEndpoints['postRoutes'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.routing.postRoutes',
		PostRoutesInputSchema,
		PostRoutesResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.router, '/v8/routes', apiKey, {
				method: 'POST',
				query: {
					origin: validated.origin,
					destination: validated.destination,
					transportMode: validated.transportMode,
					via: validated.via,
					return: validated.return,
					departureTime: validated.departureTime,
					routingMode: validated.routingMode,
					lang: validated.lang,
				},
				body: validated.body,
			}),
	);

export const getIsolines: HereEndpoints['getIsolines'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.routing.getIsolines',
		GetIsolinesInputSchema,
		GetIsolinesResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.isoline, '/v8/isolines', apiKey, {
				query: {
					origin: validated.origin,
					transportMode: validated.transportMode,
					range: {
						type: validated.rangeType,
						values: validated.rangeValues,
					},
					departureTime: validated.departureTime,
				},
			}),
	);

export const computeMatrix: HereEndpoints['computeMatrix'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.routing.computeMatrix',
		ComputeMatrixInputSchema,
		ComputeMatrixResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.matrix, '/v8/matrix', apiKey, {
				method: 'POST',
				query: {
					async: validated.async ?? false,
				},
				body: {
					origins: validated.origins,
					destinations: validated.destinations,
					regionDefinition: validated.regionDefinition ?? { type: 'world' },
					transportMode: validated.transportMode,
					departureTime: validated.departureTime,
					matrixAttributes: validated.matrixAttributes ?? [
						'travelTimes',
						'distances',
					],
				},
			}),
	);

export const getMatrixResult: HereEndpoints['getMatrixResult'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.routing.getMatrixResult',
		GetMatrixResultInputSchema,
		GetMatrixResultResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(
				HERE_HOSTS.matrix,
				`/v8/matrix/${encodeURIComponent(validated.matrixId)}`,
				apiKey,
			),
	);

export const listMatrixProfiles: HereEndpoints['listMatrixProfiles'] = (
	ctx,
	input,
) =>
	runHereEndpoint(
		ctx,
		'here.routing.listMatrixProfiles',
		ListMatrixProfilesInputSchema,
		ListMatrixProfilesResponseSchema,
		input,
		(_validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.matrix, '/v8/matrix/profiles', apiKey),
	);

export const getMatrixProfile: HereEndpoints['getMatrixProfile'] = (
	ctx,
	input,
) =>
	runHereEndpoint(
		ctx,
		'here.routing.getMatrixProfile',
		GetMatrixProfileInputSchema,
		GetMatrixProfileResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(
				HERE_HOSTS.matrix,
				`/v8/matrix/profiles/${encodeURIComponent(validated.profileId)}`,
				apiKey,
			),
	);

export const decodeRouteHandle: HereEndpoints['decodeRouteHandle'] = (
	ctx,
	input,
) =>
	runHereEndpoint(
		ctx,
		'here.routing.decodeRouteHandle',
		DecodeRouteHandleInputSchema,
		DecodeRouteHandleResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(
				HERE_HOSTS.router,
				`/v8/routes/${encodeURIComponent(validated.routeHandle)}`,
				apiKey,
				{
					query: {
						return: validated.return,
						transportMode: validated.transportMode,
					},
				},
			),
	);

export const findWaypointSequence: HereEndpoints['findWaypointSequence'] = (
	ctx,
	input,
) =>
	runHereEndpoint(
		ctx,
		'here.routing.findWaypointSequence',
		FindWaypointSequenceInputSchema,
		FindWaypointSequenceResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.wps, '/v8/findsequence2', apiKey, {
				query: {
					start: validated.start,
					end: validated.destination,
					destination1: validated.destination1,
					destination2: validated.destination2,
					destination3: validated.destination3,
					destination4: validated.destination4,
					destination5: validated.destination5,
					mode: validated.mode ?? 'fastest;car;traffic:disabled',
					improveFor: validated.improveFor,
				},
			}),
	);
