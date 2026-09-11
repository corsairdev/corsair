import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const getAvailableCities: BrightDataEndpoints['getAvailableCities'] =
	async (ctx, input) => {
		const response = await makeBrightDataRequest<unknown>(
			'/zone/static/cities',
			requireBrightDataKey(ctx.key),
			{
				query: {
					country: input.country,
					pool_ip_type: input.pool_ip_type,
				},
			},
		);
		const parsed =
			BrightDataEndpointOutputSchemas.getAvailableCities.parse(response);
		await logEventFromContext(
			ctx,
			'brightdata.get_available_cities',
			{ country: input.country, count: parsed.length },
			'completed',
		);
		return parsed;
	};
