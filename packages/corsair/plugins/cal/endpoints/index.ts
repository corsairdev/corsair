import {
	cancel,
	confirm,
	create,
	decline,
	get,
	list,
	reschedule,
} from './bookings';

export const Bookings = {
	list,
	get,
	create,
	cancel,
	reschedule,
	confirm,
	decline,
};

export * from './types';
