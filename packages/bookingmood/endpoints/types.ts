import { z } from 'zod';
import {
	BookingmoodBooking,
	BookingmoodContact,
	BookingmoodMember,
	BookingmoodOrganization,
	BookingmoodProduct,
} from '../schema/database';

// --- Organizations ---
export const OrganizationsGetInputSchema = z.object({
	id: z.string(),
});
export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;
export const OrganizationsGetResponseSchema = BookingmoodOrganization;
export type OrganizationsGetResponse = z.infer<
	typeof OrganizationsGetResponseSchema
>;

export const OrganizationsListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();
export type OrganizationsListInput = z.infer<
	typeof OrganizationsListInputSchema
>;
export const OrganizationsListResponseSchema = z.array(BookingmoodOrganization);
export type OrganizationsListResponse = z.infer<
	typeof OrganizationsListResponseSchema
>;

// --- Bookings ---
export const BookingsGetInputSchema = z.object({
	id: z.string(),
});
export type BookingsGetInput = z.infer<typeof BookingsGetInputSchema>;
export const BookingsGetResponseSchema = BookingmoodBooking;
export type BookingsGetResponse = z.infer<typeof BookingsGetResponseSchema>;

export const BookingsListInputSchema = z
	.object({
		rental_id: z.string().optional(),
		product_id: z.string().optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		status: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();
export type BookingsListInput = z.infer<typeof BookingsListInputSchema>;
export const BookingsListResponseSchema = z.array(BookingmoodBooking);
export type BookingsListResponse = z.infer<typeof BookingsListResponseSchema>;

export const BookingsCreateInputSchema = z.object({
	rental_id: z.string().optional(),
	product_id: z.string().optional(),
	start_date: z.string(),
	end_date: z.string(),
	status: z.string().optional(),
	customer_name: z.string().optional(),
	customer_email: z.string().optional(),
	price: z.number().optional(),
	currency: z.string().optional(),
	notes: z.string().optional(),
});
export type BookingsCreateInput = z.infer<typeof BookingsCreateInputSchema>;
export const BookingsCreateResponseSchema = BookingmoodBooking;
export type BookingsCreateResponse = z.infer<
	typeof BookingsCreateResponseSchema
>;

export const BookingsUpdateInputSchema = z.object({
	id: z.string(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	status: z.string().optional(),
	customer_name: z.string().optional(),
	customer_email: z.string().optional(),
	price: z.number().optional(),
	notes: z.string().optional(),
});
export type BookingsUpdateInput = z.infer<typeof BookingsUpdateInputSchema>;
export const BookingsUpdateResponseSchema = BookingmoodBooking;
export type BookingsUpdateResponse = z.infer<
	typeof BookingsUpdateResponseSchema
>;

export const BookingsDeleteInputSchema = z.object({
	id: z.string(),
});
export type BookingsDeleteInput = z.infer<typeof BookingsDeleteInputSchema>;
export const BookingsDeleteResponseSchema = z.object({
	success: z.boolean(),
	id: z.string(),
});
export type BookingsDeleteResponse = z.infer<
	typeof BookingsDeleteResponseSchema
>;

// --- Products / Rental objects ---
export const ProductsGetInputSchema = z.object({
	id: z.string(),
});
export type ProductsGetInput = z.infer<typeof ProductsGetInputSchema>;
export const ProductsGetResponseSchema = BookingmoodProduct;
export type ProductsGetResponse = z.infer<typeof ProductsGetResponseSchema>;

export const ProductsListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();
export type ProductsListInput = z.infer<typeof ProductsListInputSchema>;
export const ProductsListResponseSchema = z.array(BookingmoodProduct);
export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;

export const ProductsCreateInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	price: z.number().optional(),
	currency: z.string().optional(),
});
export type ProductsCreateInput = z.infer<typeof ProductsCreateInputSchema>;
export const ProductsCreateResponseSchema = BookingmoodProduct;
export type ProductsCreateResponse = z.infer<
	typeof ProductsCreateResponseSchema
>;

export const ProductsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	price: z.number().optional(),
	currency: z.string().optional(),
});
export type ProductsUpdateInput = z.infer<typeof ProductsUpdateInputSchema>;
export const ProductsUpdateResponseSchema = BookingmoodProduct;
export type ProductsUpdateResponse = z.infer<
	typeof ProductsUpdateResponseSchema
>;

export const ProductsDeleteInputSchema = z.object({
	id: z.string(),
});
export type ProductsDeleteInput = z.infer<typeof ProductsDeleteInputSchema>;
export const ProductsDeleteResponseSchema = z.object({
	success: z.boolean(),
	id: z.string(),
});
export type ProductsDeleteResponse = z.infer<
	typeof ProductsDeleteResponseSchema
>;

// --- Members ---
export const MembersGetInputSchema = z.object({
	id: z.string(),
});
export type MembersGetInput = z.infer<typeof MembersGetInputSchema>;
export const MembersGetResponseSchema = BookingmoodMember;
export type MembersGetResponse = z.infer<typeof MembersGetResponseSchema>;

export const MembersListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();
export type MembersListInput = z.infer<typeof MembersListInputSchema>;
export const MembersListResponseSchema = z.array(BookingmoodMember);
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;

// --- Contacts ---
export const ContactsGetInputSchema = z.object({
	id: z.string(),
});
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;
export const ContactsGetResponseSchema = BookingmoodContact;
export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

export const ContactsListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;
export const ContactsListResponseSchema = z.array(BookingmoodContact);
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

export const ContactsCreateInputSchema = z.object({
	name: z.string(),
	email: z.string().optional(),
	phone: z.string().optional(),
});
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;
export const ContactsCreateResponseSchema = BookingmoodContact;
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

export const ContactsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
});
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;
export const ContactsUpdateResponseSchema = BookingmoodContact;
export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

export const ContactsDeleteInputSchema = z.object({
	id: z.string(),
});
export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;
export const ContactsDeleteResponseSchema = z.object({
	success: z.boolean(),
	id: z.string(),
});
export type ContactsDeleteResponse = z.infer<
	typeof ContactsDeleteResponseSchema
>;

// Map of all endpoints inputs and outputs
export type BookingmoodEndpointInputs = {
	organizationsGet: OrganizationsGetInput;
	organizationsList: OrganizationsListInput;
	bookingsGet: BookingsGetInput;
	bookingsList: BookingsListInput;
	bookingsCreate: BookingsCreateInput;
	bookingsUpdate: BookingsUpdateInput;
	bookingsDelete: BookingsDeleteInput;
	productsGet: ProductsGetInput;
	productsList: ProductsListInput;
	productsCreate: ProductsCreateInput;
	productsUpdate: ProductsUpdateInput;
	productsDelete: ProductsDeleteInput;
	membersGet: MembersGetInput;
	membersList: MembersListInput;
	contactsGet: ContactsGetInput;
	contactsList: ContactsListInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
};

export type BookingmoodEndpointOutputs = {
	organizationsGet: OrganizationsGetResponse;
	organizationsList: OrganizationsListResponse;
	bookingsGet: BookingsGetResponse;
	bookingsList: BookingsListResponse;
	bookingsCreate: BookingsCreateResponse;
	bookingsUpdate: BookingsUpdateResponse;
	bookingsDelete: BookingsDeleteResponse;
	productsGet: ProductsGetResponse;
	productsList: ProductsListResponse;
	productsCreate: ProductsCreateResponse;
	productsUpdate: ProductsUpdateResponse;
	productsDelete: ProductsDeleteResponse;
	membersGet: MembersGetResponse;
	membersList: MembersListResponse;
	contactsGet: ContactsGetResponse;
	contactsList: ContactsListResponse;
	contactsCreate: ContactsCreateResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsDelete: ContactsDeleteResponse;
};

export const BookingmoodEndpointInputSchemas = {
	organizationsGet: OrganizationsGetInputSchema,
	organizationsList: OrganizationsListInputSchema,
	bookingsGet: BookingsGetInputSchema,
	bookingsList: BookingsListInputSchema,
	bookingsCreate: BookingsCreateInputSchema,
	bookingsUpdate: BookingsUpdateInputSchema,
	bookingsDelete: BookingsDeleteInputSchema,
	productsGet: ProductsGetInputSchema,
	productsList: ProductsListInputSchema,
	productsCreate: ProductsCreateInputSchema,
	productsUpdate: ProductsUpdateInputSchema,
	productsDelete: ProductsDeleteInputSchema,
	membersGet: MembersGetInputSchema,
	membersList: MembersListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsList: ContactsListInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
};

export const BookingmoodEndpointOutputSchemas = {
	organizationsGet: OrganizationsGetResponseSchema,
	organizationsList: OrganizationsListResponseSchema,
	bookingsGet: BookingsGetResponseSchema,
	bookingsList: BookingsListResponseSchema,
	bookingsCreate: BookingsCreateResponseSchema,
	bookingsUpdate: BookingsUpdateResponseSchema,
	bookingsDelete: BookingsDeleteResponseSchema,
	productsGet: ProductsGetResponseSchema,
	productsList: ProductsListResponseSchema,
	productsCreate: ProductsCreateResponseSchema,
	productsUpdate: ProductsUpdateResponseSchema,
	productsDelete: ProductsDeleteResponseSchema,
	membersGet: MembersGetResponseSchema,
	membersList: MembersListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
};
