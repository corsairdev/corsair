import {
	BookingmoodBooking,
	BookingmoodContact,
	BookingmoodMember,
	BookingmoodOrganization,
	BookingmoodProduct,
} from './database';

export const BookingmoodSchema = {
	version: '1.0.0',
	entities: {
		organizations: BookingmoodOrganization,
		bookings: BookingmoodBooking,
		products: BookingmoodProduct,
		members: BookingmoodMember,
		contacts: BookingmoodContact,
	},
} as const;

export type {
	BookingmoodOrganization,
	BookingmoodBooking,
	BookingmoodProduct,
	BookingmoodMember,
	BookingmoodContact,
};
