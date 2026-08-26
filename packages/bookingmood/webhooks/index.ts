import * as events from './events';

export const BookingmoodWebhooks = {
	bookingCreated: events.bookingCreated,
	bookingUpdated: events.bookingUpdated,
	bookingDeleted: events.bookingDeleted,
	productCreated: events.productCreated,
	productUpdated: events.productUpdated,
};

export * from './types';
