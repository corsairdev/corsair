import { logEventFromContext } from 'corsair/core';
import { makeGoogleMapsRequest } from '../client';
import type { GoogleMapsEndpoints } from '../index';
import type {
	LookupAerialVideoResponse,
	RenderAerialVideoResponse,
} from './types';
import {
	LookupAerialVideoInputSchema,
	LookupAerialVideoResponseSchema,
	RenderAerialVideoInputSchema,
	RenderAerialVideoResponseSchema,
} from './types';

export const lookupAerialVideo: GoogleMapsEndpoints['lookupAerialVideo'] =
	async (ctx, input) => {
		const validatedInput = LookupAerialVideoInputSchema.parse(input);

		const rawResponse = await makeGoogleMapsRequest<LookupAerialVideoResponse>(
			'/v1/videos:lookupVideoMetadata',
			ctx,
			{
				method: 'GET',
				baseUrl: 'https://aerialview.googleapis.com',
				query: {
					address: validatedInput.address,
					videoId: validatedInput.videoId,
				},
			},
		);

		const response = LookupAerialVideoResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'googlemaps.aerial.lookupAerialVideo',
			validatedInput,
			'completed',
		);

		return response;
	};

export const renderAerialVideo: GoogleMapsEndpoints['renderAerialVideo'] =
	async (ctx, input) => {
		const validatedInput = RenderAerialVideoInputSchema.parse(input);

		const rawResponse = await makeGoogleMapsRequest<RenderAerialVideoResponse>(
			'/v1/videos:renderVideo',
			ctx,
			{
				method: 'POST',
				baseUrl: 'https://aerialview.googleapis.com',
				body: {
					address: validatedInput.address,
				},
			},
		);

		const response = RenderAerialVideoResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'googlemaps.aerial.renderAerialVideo',
			validatedInput,
			'completed',
		);

		return response;
	};
