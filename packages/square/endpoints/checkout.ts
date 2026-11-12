import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** GET /v2/online-checkout/location-settings/{location_id} (RetrieveLocationSettings). */
export const getLocationSettings: SquareEndpoints['checkoutGetLocationSettings'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.checkoutGetLocationSettings.parse(rawInput);
		return callSquare(
			ctx,
			'/v2/online-checkout/location-settings/{location_id}',
			{
				path: { location_id: input.location_id },
				output: SquareEndpointOutputSchemas.checkoutGetLocationSettings,
				event: 'checkout.getLocationSettings',
				logged: { location_id: input.location_id },
			},
		);
	};

/** PUT /v2/online-checkout/location-settings/{location_id} (UpdateLocationSettings). */
export const updateLocationSettings: SquareEndpoints['checkoutUpdateLocationSettings'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.checkoutUpdateLocationSettings.parse(rawInput);
		const { location_id, ...body } = input;
		return callSquare(
			ctx,
			'/v2/online-checkout/location-settings/{location_id}',
			{
				method: 'PUT',
				body,
				path: { location_id },
				output: SquareEndpointOutputSchemas.checkoutUpdateLocationSettings,
				event: 'checkout.updateLocationSettings',
				logged: { location_id },
			},
		);
	};
