import { logEventFromContext } from 'corsair/core';
import { makeTwittrApiRequest } from '../client';
import type { TwittrApiEndpoints } from '../index';
import type { TwittrApiEndpointOutputs } from './types';

export const getByLocation: TwittrApiEndpoints['trendsGetByLocation'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['trendsGetByLocation']
	>(`/trends/${encodeURIComponent(input.locationId)}`, ctx.key, {
		method: 'GET',
		query: { format: 'simple' },
	});

	if (response.data && ctx.db.trends) {
		// Guarded: persistence is best-effort and must never fail the request.
		if (Array.isArray(response.data)) {
			for (const trend of response.data) {
				try {
					// Composite key: the same topic name trends in many locations.
					await ctx.db.trends.upsertByEntityId(
						`${input.locationId}:${trend.name}`,
						trend,
					);
				} catch {
					// best-effort
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.trends.getByLocation',
		{ ...input },
		'completed',
	);
	return response;
};

export const getLocations: TwittrApiEndpoints['trendsGetLocations'] = async (
	ctx,
	_input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['trendsGetLocations']
	>('/misc/locations', ctx.key, {
		method: 'GET',
		query: { format: 'simple' },
	});

	if (response.data && ctx.db.trendLocations) {
		if (Array.isArray(response.data)) {
			for (const location of response.data) {
				try {
					await ctx.db.trendLocations.upsertByEntityId(
						String(location.woeid),
						location,
					);
				} catch {
					// best-effort
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.trends.getLocations',
		{},
		'completed',
	);
	return response;
};
