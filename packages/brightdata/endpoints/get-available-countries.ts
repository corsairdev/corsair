import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const getAvailableCountries: BrightDataEndpoints['getAvailableCountries'] =
	async (ctx, input) => {
		const response = await makeBrightDataRequest<unknown>(
			'/countrieslist',
			requireBrightDataKey(ctx.key),
		);
		const parsed =
			BrightDataEndpointOutputSchemas.getAvailableCountries.parse(response);
		await logEventFromContext(
			ctx,
			'brightdata.get_available_countries',
			{ ...input },
			'completed',
		);
		return parsed;
	};
