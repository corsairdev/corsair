/**
 * Zoho Inventory API Types & Models
 * @see https://www.zoho.com/inventory/api/v1/
 */

export type ZohoPageContext = {
	page: number;
	per_page: number;
	has_more_page: boolean;
	report_name?: string;
	applied_filter?: string;
	sort_column?: string;
	sort_order?: 'A' | 'D' | string;
};

export type ZohoOrganization = {
	organization_id: string;
	name: string;
	is_default_org?: boolean;
	user_role?: string;
	time_zone?: string;
	language_code?: string;
	currency_code?: string;
	currency_symbol?: string;
	currency_id?: string;
	is_org_active?: boolean;
	fiscal_year_start_month?: number;
	contact_name?: string;
	email?: string;
	phone?: string;
	website?: string;
	plan_type?: number;
	tax_group_preferences?: Record<string, unknown>;
};

export type ZohoItem = {
	item_id: string;
	name: string;
	item_name?: string;
	unit?: string;
	status?: 'active' | 'inactive' | string;
	source?: string;
	is_linked_with_zohocrm?: boolean;
	zcrm_product_id?: string;
	description?: string;
	rate?: number;
	pricebook_rate?: number;
	purchase_rate?: number;
	reorder_level?: number | string;
	initial_stock?: number;
	initial_stock_rate?: number;
	item_type?: 'inventory' | 'non_inventory' | 'service' | string;
	product_type?: 'goods' | 'service' | string;
	is_taxable?: boolean;
	tax_id?: string;
	tax_name?: string;
	tax_percentage?: number;
	purchase_account_id?: string;
	purchase_account_name?: string;
	account_id?: string;
	account_name?: string;
	purchase_description?: string;
	sku?: string;
	upc?: string;
	ean?: string;
	isbn?: string;
	part_number?: string;
	track_inventory?: boolean;
	inventory_account_id?: string;
	inventory_account_name?: string;
	stock_on_hand?: number;
	available_stock?: number;
	actual_available_stock?: number;
	created_time?: string;
	last_modified_time?: string;
};

export type ZohoContact = {
	contact_id: string;
	contact_name: string;
	company_name?: string;
	contact_type?: 'customer' | 'vendor' | string;
	is_portal_enabled?: boolean;
	language_code?: string;
	is_crm_customer?: boolean;
	primary_contact_id?: string;
	payment_terms?: number;
	payment_terms_label?: string;
	currency_id?: string;
	currency_code?: string;
	currency_symbol?: string;
	outstanding_receivable_amount?: number;
	outstanding_payable_amount?: number;
	unused_credits_receivable_amount?: number;
	unused_credits_payable_amount?: number;
	status?: 'active' | 'inactive' | string;
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: string;
	mobile?: string;
	created_time?: string;
	last_modified_time?: string;
};

export type ZohoUser = {
	user_id: string;
	name: string;
	email: string;
	user_role?: string;
	status?: 'active' | 'inactive' | string;
	is_current_user?: boolean;
};

export type ZohoInventoryResponse<T> = {
	code?: number;
	message?: string;
} & T;

export type ZohoOrganizationsListResponse = {
	code?: number;
	message?: string;
	organizations: ZohoOrganization[];
};

export type ZohoItemsListResponse = {
	code?: number;
	message?: string;
	items: ZohoItem[];
	page_context?: ZohoPageContext;
};

export type ZohoContactsListResponse = {
	code?: number;
	message?: string;
	contacts: ZohoContact[];
	page_context?: ZohoPageContext;
};

export type ZohoUsersListResponse = {
	code?: number;
	message?: string;
	users: ZohoUser[];
	page_context?: ZohoPageContext;
};
