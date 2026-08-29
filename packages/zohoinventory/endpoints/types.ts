import { z } from 'zod';
import type {
	ZohoContactsListResponse,
	ZohoItemsListResponse,
	ZohoOrganizationsListResponse,
	ZohoUsersListResponse,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Shared & Common Schemas
// ─────────────────────────────────────────────────────────────────────────────

const organizationIdField = z
	.string()
	.describe('The unique identifier of the Zoho Inventory organization.');

export const PageContextSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		has_more_page: z.boolean().optional(),
		report_name: z.string().optional(),
		applied_filter: z.string().optional(),
		sort_column: z.string().optional(),
		sort_order: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ListOrganizationsInputSchema = z
	.object({})
	.passthrough()
	.describe('Input parameters for listing Zoho Inventory organizations.');

export const ListItemsInputSchema = z
	.object({
		organization_id: organizationIdField,
		page: z.number().optional().describe('Page number for pagination.'),
		per_page: z
			.number()
			.optional()
			.describe('Number of records per page (up to 200).'),
		search_text: z
			.string()
			.optional()
			.describe('Search items by name or description.'),
	})
	.describe('Input parameters for listing inventory items.');

export const ListContactsInputSchema = z
	.object({
		organization_id: organizationIdField,
		page: z.number().optional().describe('Page number for pagination.'),
		per_page: z
			.number()
			.optional()
			.describe('Number of records per page (up to 200).'),
		search_text: z
			.string()
			.optional()
			.describe('Search contacts by name or company.'),
		contact_type: z
			.enum(['customer', 'vendor', 'all'])
			.optional()
			.describe('Filter contacts by customer or vendor type.'),
	})
	.describe('Input parameters for listing contacts.');

export const ListUsersInputSchema = z
	.object({
		organization_id: organizationIdField,
		page: z.number().optional().describe('Page number for pagination.'),
		per_page: z
			.number()
			.optional()
			.describe('Number of records per page (up to 200).'),
	})
	.describe('Input parameters for listing users.');

// ─────────────────────────────────────────────────────────────────────────────
// Output Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const OrganizationSchema = z
	.object({
		organization_id: z.coerce.string(),
		name: z.string(),
		is_default_org: z.boolean().optional(),
		user_role: z.string().optional(),
		time_zone: z.string().optional(),
		language_code: z.string().optional(),
		currency_code: z.string().optional(),
		currency_symbol: z.string().optional(),
		currency_id: z.coerce.string().optional(),
		is_org_active: z.boolean().optional(),
		fiscal_year_start_month: z.number().optional(),
		contact_name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		website: z.string().optional(),
		plan_type: z.number().optional(),
	})
	.passthrough();

export const ListOrganizationsResponseSchema = z
	.object({
		code: z.number().optional(),
		message: z.string().optional(),
		organizations: z.array(OrganizationSchema),
	})
	.passthrough();

export const ItemSchema = z
	.object({
		item_id: z.coerce.string(),
		name: z.string(),
		item_name: z.string().optional(),
		unit: z.string().optional(),
		status: z.string().optional(),
		source: z.string().optional(),
		is_linked_with_zohocrm: z.boolean().optional(),
		zcrm_product_id: z.string().optional(),
		description: z.string().optional(),
		rate: z.number().optional(),
		pricebook_rate: z.number().optional(),
		purchase_rate: z.number().optional(),
		reorder_level: z.union([z.number(), z.string()]).optional(),
		initial_stock: z.number().optional(),
		initial_stock_rate: z.number().optional(),
		item_type: z.string().optional(),
		product_type: z.string().optional(),
		is_taxable: z.boolean().optional(),
		tax_id: z.coerce.string().optional(),
		tax_name: z.string().optional(),
		tax_percentage: z.number().optional(),
		purchase_account_id: z.coerce.string().optional(),
		purchase_account_name: z.string().optional(),
		account_id: z.coerce.string().optional(),
		account_name: z.string().optional(),
		purchase_description: z.string().optional(),
		sku: z.string().optional(),
		upc: z.string().optional(),
		ean: z.string().optional(),
		isbn: z.string().optional(),
		part_number: z.string().optional(),
		track_inventory: z.boolean().optional(),
		inventory_account_id: z.coerce.string().optional(),
		inventory_account_name: z.string().optional(),
		stock_on_hand: z.number().optional(),
		available_stock: z.number().optional(),
		actual_available_stock: z.number().optional(),
		created_time: z.string().optional(),
		last_modified_time: z.string().optional(),
	})
	.passthrough();

export const ListItemsResponseSchema = z
	.object({
		code: z.number().optional(),
		message: z.string().optional(),
		items: z.array(ItemSchema),
		page_context: PageContextSchema.optional(),
	})
	.passthrough();

export const ContactSchema = z
	.object({
		contact_id: z.coerce.string(),
		contact_name: z.string(),
		company_name: z.string().optional(),
		contact_type: z.string().optional(),
		is_portal_enabled: z.boolean().optional(),
		language_code: z.string().optional(),
		is_crm_customer: z.boolean().optional(),
		primary_contact_id: z.coerce.string().optional(),
		payment_terms: z.number().optional(),
		payment_terms_label: z.string().optional(),
		currency_id: z.coerce.string().optional(),
		currency_code: z.string().optional(),
		currency_symbol: z.string().optional(),
		outstanding_receivable_amount: z.number().optional(),
		outstanding_payable_amount: z.number().optional(),
		unused_credits_receivable_amount: z.number().optional(),
		unused_credits_payable_amount: z.number().optional(),
		status: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		mobile: z.string().optional(),
		created_time: z.string().optional(),
		last_modified_time: z.string().optional(),
	})
	.passthrough();

export const ListContactsResponseSchema = z
	.object({
		code: z.number().optional(),
		message: z.string().optional(),
		contacts: z.array(ContactSchema),
		page_context: PageContextSchema.optional(),
	})
	.passthrough();

export const UserSchema = z
	.object({
		user_id: z.coerce.string(),
		name: z.string(),
		email: z.string(),
		user_role: z.string().optional(),
		status: z.string().optional(),
		is_current_user: z.boolean().optional(),
	})
	.passthrough();

export const ListUsersResponseSchema = z
	.object({
		code: z.number().optional(),
		message: z.string().optional(),
		users: z.array(UserSchema),
		page_context: PageContextSchema.optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Input & Output Schemas Mapping
// ─────────────────────────────────────────────────────────────────────────────

export const ZohoInventoryEndpointInputSchemas = {
	organizationsList: ListOrganizationsInputSchema,
	itemsList: ListItemsInputSchema,
	contactsList: ListContactsInputSchema,
	usersList: ListUsersInputSchema,
} as const;

export const ZohoInventoryEndpointOutputSchemas = {
	organizationsList: ListOrganizationsResponseSchema,
	itemsList: ListItemsResponseSchema,
	contactsList: ListContactsResponseSchema,
	usersList: ListUsersResponseSchema,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Type Inferences & Exports
// ─────────────────────────────────────────────────────────────────────────────

export type ListOrganizationsInput = z.infer<
	typeof ListOrganizationsInputSchema
>;
export type ListOrganizationsResponse = ZohoOrganizationsListResponse;

export type ListItemsInput = z.infer<typeof ListItemsInputSchema>;
export type ListItemsResponse = ZohoItemsListResponse;

export type ListContactsInput = z.infer<typeof ListContactsInputSchema>;
export type ListContactsResponse = ZohoContactsListResponse;

export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;
export type ListUsersResponse = ZohoUsersListResponse;

export type ZohoInventoryEndpointInputs = {
	organizationsList: ListOrganizationsInput;
	itemsList: ListItemsInput;
	contactsList: ListContactsInput;
	usersList: ListUsersInput;
};

export type ZohoInventoryEndpointOutputs = {
	organizationsList: ListOrganizationsResponse;
	itemsList: ListItemsResponse;
	contactsList: ListContactsResponse;
	usersList: ListUsersResponse;
};
