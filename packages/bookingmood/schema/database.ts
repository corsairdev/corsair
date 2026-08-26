import { z } from 'zod';

export const BookingmoodOrganization = z.object({
	id: z.string(),
	name: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type BookingmoodOrganization = z.infer<typeof BookingmoodOrganization>;

export const BookingmoodBooking = z.object({
	id: z.string(),
	organization_id: z.string().optional(),
	product_id: z.string().optional(),
	rental_id: z.string().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	status: z.string().optional(),
	customer_name: z.string().optional(),
	customer_email: z.string().optional(),
	price: z.number().optional(),
	currency: z.string().optional(),
	notes: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type BookingmoodBooking = z.infer<typeof BookingmoodBooking>;

export const BookingmoodProduct = z.object({
	id: z.string(),
	organization_id: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	price: z.number().optional(),
	currency: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type BookingmoodProduct = z.infer<typeof BookingmoodProduct>;

export const BookingmoodMember = z.object({
	id: z.string(),
	organization_id: z.string().optional(),
	email: z.string().optional(),
	name: z.string().optional(),
	role: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type BookingmoodMember = z.infer<typeof BookingmoodMember>;

export const BookingmoodContact = z.object({
	id: z.string(),
	organization_id: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type BookingmoodContact = z.infer<typeof BookingmoodContact>;
