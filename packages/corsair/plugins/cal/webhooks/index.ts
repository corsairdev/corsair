import {
	bookingCancelled,
	bookingCreated,
	bookingRescheduled,
	meetingEnded,
} from './bookings';
import { ping } from './ping';

export const BookingWebhooks = {
	bookingCreated,
	bookingCancelled,
	bookingRescheduled,
	meetingEnded,
};

export const PingWebhooks = {
	ping,
};

export * from './types';
