import {
	bookingCreated,
	bookingCancelled,
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
