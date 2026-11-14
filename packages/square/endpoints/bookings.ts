import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** GET /v2/bookings/business-booking-profile (RetrieveBusinessBookingProfile). */
export const getBusinessProfile: SquareEndpoints['bookingsGetBusinessProfile'] =
	async (ctx, rawInput) => {
		const input = SquareEndpointInputSchemas.bookingsGetBusinessProfile.parse(
			rawInput ?? {},
		);
		return callSquare(ctx, '/v2/bookings/business-booking-profile', {
			output: SquareEndpointOutputSchemas.bookingsGetBusinessProfile,
			event: 'bookings.getBusinessProfile',
		});
	};
