import { logEventFromContext } from 'corsair/core';
import { makeTripadvisorRequest } from '../client';
import type { TripadvisorEndpoints } from '../index';
import type { TripadvisorEndpointOutputs } from './types';
import {
	LocationDetailsResponseSchema,
	LocationPhotosResponseSchema,
	LocationReviewsResponseSchema,
	LocationsNearbyResponseSchema,
	LocationsSearchNearbyResponseSchema,
} from './types';

/** Searches the Tripadvisor catalog for locations near the requested area. */
export const nearby: TripadvisorEndpoints['locationsNearby'] = async (
	ctx,
	input,
) => {
	const response = LocationsNearbyResponseSchema.parse(
		await makeTripadvisorRequest<TripadvisorEndpointOutputs['locationsNearby']>(
			'/catalog/locations/nearby',
			ctx.key,
			{
				method: 'GET',
				query: input,
			},
		),
	);

	// Telemetry keeps filter values and counts only; precise search
	// coordinates, bounding boxes, and location ids are omitted.
	await logEventFromContext(
		ctx,
		'tripadvisor.catalog.locationsNearby',
		{
			category: input.category,
			locale: input.locale,
			min_rating: input.min_rating,
			page: input.page,
			radius: input.radius,
			size: input.size,
			sort: input.sort,
			unit: input.unit,
			resultCount: response.data.length,
		},
		'completed',
	);

	return response;
};

/** Retrieves the full details of a single Tripadvisor Location by its ID. */
export const locationDetails: TripadvisorEndpoints['locationDetails'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = input;
	const response = LocationDetailsResponseSchema.parse(
		await makeTripadvisorRequest<TripadvisorEndpointOutputs['locationDetails']>(
			`/locations/${encodeURIComponent(String(id))}`,
			ctx.key,
			{
				method: 'GET',
				query,
			},
		),
	);

	await logEventFromContext(
		ctx,
		'tripadvisor.location.details',
		{ id },
		'completed',
	);

	return response;
};

/** Retrieves photos for a Tripadvisor Location. */
export const locationPhotos: TripadvisorEndpoints['locationPhotos'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = input;
	const response = LocationPhotosResponseSchema.parse(
		await makeTripadvisorRequest<TripadvisorEndpointOutputs['locationPhotos']>(
			`/locations/${encodeURIComponent(String(id))}/photos`,
			ctx.key,
			{
				method: 'GET',
				query,
			},
		),
	);

	await logEventFromContext(
		ctx,
		'tripadvisor.location.photos',
		{ id, resultCount: response.data.length },
		'completed',
	);

	return response;
};

/** Retrieves traveler reviews for a Tripadvisor Location. */
export const locationReviews: TripadvisorEndpoints['locationReviews'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = input;
	const response = LocationReviewsResponseSchema.parse(
		await makeTripadvisorRequest<TripadvisorEndpointOutputs['locationReviews']>(
			`/locations/${encodeURIComponent(String(id))}/reviews`,
			ctx.key,
			{
				method: 'GET',
				query,
			},
		),
	);

	await logEventFromContext(
		ctx,
		'tripadvisor.location.reviews',
		{ id, resultCount: response.data.length },
		'completed',
	);

	return response;
};

/**
 * Finds full Location representations near the requested area.
 * Use category HOTEL with a small size to list hotels near a destination.
 */
export const nearbyLocations: TripadvisorEndpoints['locationsSearchNearby'] =
	async (ctx, input) => {
		const response = LocationsSearchNearbyResponseSchema.parse(
			await makeTripadvisorRequest<
				TripadvisorEndpointOutputs['locationsSearchNearby']
			>('/locations/nearby', ctx.key, {
				method: 'GET',
				query: input,
			}),
		);

		// Telemetry keeps filter values and counts only; precise search
		// coordinates, bounding boxes, and location ids are omitted.
		await logEventFromContext(
			ctx,
			'tripadvisor.locations.searchNearby',
			{
				category: input.category,
				include_photo: input.include_photo,
				locale: input.locale,
				min_rating: input.min_rating,
				page: input.page,
				radius: input.radius,
				size: input.size,
				sort: input.sort,
				unit: input.unit,
				resultCount: response.data.length,
			},
			'completed',
		);

		return response;
	};
