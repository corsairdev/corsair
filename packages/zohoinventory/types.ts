/**
 * Zoho Inventory API models.
 * @see https://www.zoho.com/inventory/api/v1/
 */

export type ZohoPageContext = {
	page?: number;
	per_page?: number;
	has_more_page?: boolean;
	report_name?: string;
	applied_filter?: string;
	sort_column?: string;
	sort_order?: string;
};

export type ZohoOrganization = {
	organization_id: string;
	name: string;
	is_default_org?: boolean;
	contact_name?: string;
	email?: string;
	phone?: string;
	website?: string;
	language_code?: string;
	fiscal_year_start_month?: number;
	account_created_date?: string;
	time_zone?: string;
	is_org_active?: boolean;
	currency_id?: string;
	currency_code?: string;
	currency_symbol?: string;
	currency_format?: string;
	price_precision?: number;
	user_role?: string;
	plan_type?: number;
};

export type ZohoItem = {
	item_id: string;
	name: string;
	sku?: string;
	status?: string;
	rate?: number;
	purchase_rate?: number;
	item_type?: string;
	product_type?: string;
	stock_on_hand?: number;
	available_stock?: number;
	actual_available_stock?: number;
	description?: string;
	unit?: string;
	track_inventory?: boolean;
};

export type ZohoContact = {
	contact_id: string;
	contact_name: string;
	company_name?: string;
	contact_type?: string;
	status?: string;
	email?: string;
	phone?: string;
	mobile?: string;
	currency_id?: string;
	currency_code?: string;
	outstanding_receivable_amount?: number;
	outstanding_payable_amount?: number;
};

export type ZohoUser = {
	user_id: string;
	name: string;
	email: string;
	user_role?: string;
	status?: string;
	is_current_user?: boolean;
};

export type ZohoInventoryResponse<T> = {
	code?: number;
	message?: string;
} & T;

export type ZohoOrganizationsListResponse = ZohoInventoryResponse<{
	organizations: ZohoOrganization[];
}>;
