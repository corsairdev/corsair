import {
	BookingmoodBooking,
	BookingmoodCalendarEvent,
	BookingmoodContact,
	BookingmoodInvoice,
	BookingmoodMember,
	BookingmoodOrganization,
	BookingmoodPayment,
	BookingmoodProduct,
	BookingmoodWidget,
} from './database';

export const BookingmoodSchema = {
	version: '1.0.0',
	entities: {
		organizations: BookingmoodOrganization,
		bookings: BookingmoodBooking,
		products: BookingmoodProduct,
		members: BookingmoodMember,
		contacts: BookingmoodContact,
		widgets: BookingmoodWidget,
		calendar_events: BookingmoodCalendarEvent,
		invoices: BookingmoodInvoice,
		payments: BookingmoodPayment,
	},
} as const;

export type {
	BookingmoodBooking,
	BookingmoodCalendarEvent,
	BookingmoodContact,
	BookingmoodInvoice,
	BookingmoodMember,
	BookingmoodOrganization,
	BookingmoodPayment,
	BookingmoodProduct,
	BookingmoodWidget,
};
