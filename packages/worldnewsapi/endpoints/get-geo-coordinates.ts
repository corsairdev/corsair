import { logEventFromContext } from 'corsair/core';
import { makeWorldNewsApiRequest } from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import type { WorldNewsApiEndpointOutputs } from './types';

export const getGeoCoordinates: WorldNewsApiEndpoints['newsGetGeoCoordinates'] =
	async (ctx, input) => {
		const query: Record<string, string | number | boolean | undefined> = {
			location: input.location,
		};

		const response = await makeWorldNewsApiRequest<
			WorldNewsApiEndpointOutputs['news.getGeoCoordinates']
		>('geo-coordinates', ctx.key, {
			method: 'GET',
			query,
		});

		try {
			await ctx.db.geoCoordinates.upsertByEntityId(input.location, {
				location: input.location,
				latitude: response.latitude,
				longitude: response.longitude,
				city: response.city,
				resolvedAt: new Date(),
			});
		} catch (error) {
			// Ignore DB cache errors
		}

		await logEventFromContext(
			ctx,
			'worldnewsapi.news.getGeoCoordinates',
			{
				location: input.location,
				latitude: response.latitude,
				longitude: response.longitude,
			},
			'completed',
		);

		return response;
	};
