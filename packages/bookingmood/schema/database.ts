import { z } from 'zod';

/** Official Bookingmood localized string: `{ default: string, [locale]: string }`. */
export const MultiLanguageString = z
	.object({ default: z.string().optional() })
	.catchall(z.string())
	.loose();

export const Coordinates = z
	.object({
		lat: z.number(),
		lng: z.number(),
	})
	.loose();

const timestamps = {
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
};

export const BookingmoodOrganization = z
	.object({
		id: z.string(),
		company_name: z.string().optional(),
		name: MultiLanguageString.optional(),
		active: z.boolean().optional(),
		country_code: z.string().optional(),
		subscription_type: z.string().optional(),
		tier: z.string().optional(),
		...timestamps,
		deleted_at: z.string().nullable().optional(),
	})
	.loose();

export type BookingmoodOrganization = z.infer<typeof BookingmoodOrganization>;

/** Official booking object — no start/end/customer fields; those live on calendar_events. */
export const BookingmoodBooking = z
	.object({
		id: z.string(),
		creator_id: z.string().nullable().optional(),
		organization_id: z.string().optional(),
		site_id: z.string().nullable().optional(),
		widget_id: z.string().nullable().optional(),
		confirmed_at: z.string().nullable().optional(),
		currency: z.string().optional(),
		display_currency: z.string().optional(),
		exchange_rate: z.number().optional(),
		method: z.string().optional(),
		reference: z.string().optional(),
		secret: z.string().optional(),
		silent: z.boolean().optional(),
		...timestamps,
	})
	.loose();

export type BookingmoodBooking = z.infer<typeof BookingmoodBooking>;

export const BookingmoodProduct = z
	.object({
		id: z.string(),
		organization_id: z.string().optional(),
		name: MultiLanguageString.optional(),
		description: MultiLanguageString.optional(),
		currency: z.string().optional(),
		interaction: z.enum(['request', 'book']).optional(),
		rent_period: z.enum(['daily', 'nightly']).optional(),
		timezone: z.string().optional(),
		approximate_address: z.string().optional(),
		exact_address: z.string().optional(),
		approximate_coordinates: Coordinates.nullable().optional(),
		exact_coordinates: Coordinates.nullable().optional(),
		...timestamps,
		deleted_at: z.string().nullable().optional(),
	})
	.loose();

export type BookingmoodProduct = z.infer<typeof BookingmoodProduct>;

export const BookingmoodMember = z
	.object({
		id: z.string(),
		organization_id: z.string().optional(),
		user_id: z.string().optional(),
		role: z.enum(['user', 'admin', 'superuser']).optional(),
		...timestamps,
	})
	.loose();

export type BookingmoodMember = z.infer<typeof BookingmoodMember>;

export const BookingmoodContact = z
	.object({
		id: z.string(),
		creator_id: z.string().nullable().optional(),
		organization_id: z.string().optional(),
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		company_name: z.string().optional(),
		language: z.string().nullable().optional(),
		...timestamps,
	})
	.loose();

export type BookingmoodContact = z.infer<typeof BookingmoodContact>;

export const BookingmoodWidget = z
	.object({
		id: z.string(),
		organization_id: z.string().optional(),
		title: z.string().optional(),
		type: z.string().optional(),
		language: z.string().optional(),
		currency: z.string().nullable().optional(),
		...timestamps,
	})
	.loose();

export type BookingmoodWidget = z.infer<typeof BookingmoodWidget>;

export const BookingmoodCalendarEvent = z
	.object({
		id: z.string(),
		organization_id: z.string().optional(),
		product_id: z.string().optional(),
		status: z.string().optional(),
		...timestamps,
	})
	.loose();

export type BookingmoodCalendarEvent = z.infer<typeof BookingmoodCalendarEvent>;

export const BookingmoodInvoice = z
	.object({
		id: z.string(),
		organization_id: z.string().optional(),
		...timestamps,
	})
	.loose();

export type BookingmoodInvoice = z.infer<typeof BookingmoodInvoice>;

export const BookingmoodPayment = z
	.object({
		id: z.string(),
		organization_id: z.string().optional(),
		invoice_id: z.string().optional(),
		booking_id: z.string().optional(),
		...timestamps,
	})
	.loose();

export type BookingmoodPayment = z.infer<typeof BookingmoodPayment>;
