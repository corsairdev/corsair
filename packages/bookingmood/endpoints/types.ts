import { z } from 'zod';
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
	MultiLanguageString,
} from '../schema/database';

export const RowSchema = z.object({ id: z.string() }).passthrough();
export type Row = z.infer<typeof RowSchema>;

export const ListInputSchema = z
	.object({
		select: z.string().optional(),
		limit: z.number().int().positive().max(1000).optional(),
		offset: z.number().int().min(0).optional(),
		order: z.string().optional(),
		id: z.string().optional(),
		organization_id: z.string().optional(),
		filters: z.record(z.string(), z.string()).optional(),
	})
	.catchall(z.union([z.string(), z.number(), z.boolean()]));
export type ListInput = z.infer<typeof ListInputSchema>;

export const ListResponseSchema = z.array(RowSchema);
export type ListResponse = z.infer<typeof ListResponseSchema>;

export const WriteInputSchema = z
	.object({
		id: z.string().optional(),
		select: z.string().optional(),
		filters: z.record(z.string(), z.string()).optional(),
		body: z.record(z.string(), z.unknown()).optional(),
		data: z.record(z.string(), z.unknown()).optional(),
	})
	.catchall(z.unknown());
export type WriteInput = z.infer<typeof WriteInputSchema>;

export const WriteResponseSchema = z.array(RowSchema);
export type WriteResponse = z.infer<typeof WriteResponseSchema>;

export const ProductsCreateInputSchema = z
	.object({
		name: MultiLanguageString,
		rent_period: z.enum(['daily', 'nightly']),
		timezone: z.string(),
	})
	.passthrough();
export type ProductsCreateInput = z.infer<typeof ProductsCreateInputSchema>;

export const MembersInviteInputSchema = z.object({
	email: z.string(),
	name: z.string().optional(),
	language: z.string().optional(),
});
export type MembersInviteInput = z.infer<typeof MembersInviteInputSchema>;

export const AvailabilityQueryInputSchema = z.object({
	product_id: z.string().optional(),
	product_ids: z.array(z.string()).optional(),
	perform_sync: z.boolean().optional(),
	show_booked_as: z.enum(['booked', 'unavailable']).optional(),
	show_closed_as: z.enum(['closed', 'unavailable']).optional(),
	show_pending_as: z.enum(['CANCELLED', 'TENTATIVE', 'CONFIRMED']).optional(),
	select: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});
export type AvailabilityQueryInput = z.infer<
	typeof AvailabilityQueryInputSchema
>;

export const AvailabilityQueryResponseSchema = z.array(
	z
		.object({
			product_id: z.string(),
			intervals: z.array(
				z
					.object({
						start: z.string(),
						end: z.string(),
						status: z.string(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
);
export type AvailabilityQueryResponse = z.infer<
	typeof AvailabilityQueryResponseSchema
>;

export const SearchAvailabilityInputSchema = z
	.object({
		interval: z
			.object({
				start: z.string(),
				end: z.string(),
			})
			.optional(),
		occupancy: z.record(z.string(), z.number()).optional(),
		option_ids: z.array(z.string()).optional(),
		show_booked_as: z.enum(['booked', 'unavailable']).optional(),
		show_closed_as: z.enum(['closed', 'unavailable']).optional(),
		show_pending_as: z.enum(['CONFIRMED', 'TENTATIVE', 'CANCELLED']).optional(),
	})
	.passthrough();
export type SearchAvailabilityInput = z.infer<
	typeof SearchAvailabilityInputSchema
>;

export const SearchAvailabilityResponseSchema = z.array(
	z
		.object({
			productId: z.string().optional(),
			product_id: z.string().optional(),
			match: z.boolean().optional(),
			availability: z.string().optional(),
		})
		.passthrough(),
);
export type SearchAvailabilityResponse = z.infer<
	typeof SearchAvailabilityResponseSchema
>;

export const BookingmoodEndpointInputSchemas = {
	list: ListInputSchema,
	write: WriteInputSchema,
	productsCreate: ProductsCreateInputSchema,
	membersInvite: MembersInviteInputSchema,
	availabilityQuery: AvailabilityQueryInputSchema,
	searchAvailability: SearchAvailabilityInputSchema,
};

export const BookingmoodEndpointOutputSchemas = {
	list: ListResponseSchema,
	write: WriteResponseSchema,
	row: RowSchema,
	organization: BookingmoodOrganization,
	booking: BookingmoodBooking,
	product: BookingmoodProduct,
	member: BookingmoodMember,
	contact: BookingmoodContact,
	widget: BookingmoodWidget,
	calendarEvent: BookingmoodCalendarEvent,
	invoice: BookingmoodInvoice,
	payment: BookingmoodPayment,
	availability: AvailabilityQueryResponseSchema,
	search: SearchAvailabilityResponseSchema,
};

export type BookingmoodEndpointInputs = {
	list: ListInput;
	write: WriteInput;
	productsCreate: ProductsCreateInput;
	membersInvite: MembersInviteInput;
	availabilityQuery: AvailabilityQueryInput;
	searchAvailability: SearchAvailabilityInput;
};

export type BookingmoodEndpointOutputs = {
	list: ListResponse;
	write: WriteResponse;
	row: Row;
	availability: AvailabilityQueryResponse;
	search: SearchAvailabilityResponse;
};
