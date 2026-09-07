import {
	list as appointmentsList,
	getAvailability,
	upsertConfig,
} from './appointments';
import {
	create as bookingsCreate,
	list as bookingsList,
	cancel,
	reschedule,
	update,
} from './bookings';
import { list as productsList } from './products';
import { list as subscriptionsList } from './subscriptions';

export const Products = {
	list: productsList,
};

export const Appointments = {
	list: appointmentsList,
	getAvailability,
	upsertConfig,
};

export const Bookings = {
	list: bookingsList,
	create: bookingsCreate,
	reschedule,
	cancel,
	update,
};

export const Subscriptions = {
	list: subscriptionsList,
};

export * from './types';
