import { CalBooking } from './database';

export const CalSchema = {
	version: '1.0.0',
	entities: {
		bookings: CalBooking,
	},
} as const;
