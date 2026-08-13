import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeEndpoints } from '../index';
import type { IliForecastResponse } from './types';
import { IliForecastResponseSchema } from './types';

/**
 * Daily influenza-like-illness risk forecast for a coordinate pair.
 * Coverage: US, Germany, Poland, Croatia, France, Italy and Spain (beta).
 *
 * API: GET api.ambeedata.com/ili/forecast/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/ili
 */
export const getForecastByLatLng: AmbeeEndpoints['iliGetForecastByLatLng'] =
	async (ctx, input) => {
		// `details` is documented as required, so it is always sent — omitting
		// it makes Ambee reject the request rather than assume a default.
		const details = input.details ?? false;

		const raw = await makeAmbeeRequest<IliForecastResponse>(
			'ili/forecast/by-lat-lng',
			ctx.key,
			{ query: { lat: input.lat, lng: input.lng, details } },
		);

		const response = IliForecastResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.ili.getForecastByLatLng',
			{ lat: input.lat, lng: input.lng, details },
			'completed',
		);

		return response;
	};
