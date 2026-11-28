// Generated from FreshBooks's OpenAPI spec (https://www.freshbooks.com/api/start,
// fetched 2026-11-28); freshbooks-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type FreshBooksJsonValue =
	| null
	| boolean
	| number
	| string
	| FreshBooksJsonValue[]
	| { [key: string]: FreshBooksJsonValue | undefined };

export const FRESHBOOKS_OPERATION_IDS = [
	'abilities.list',
	'accountGateways.delete',
	'accountGateways.list',
	'adjustmentJournalEntries.create',
	'adjustmentJournalEntries.list',
	'adjustmentJournalEntries.update',
	'applications.create',
	'applications.list',
	'applications.update',
	'billPayments.create',
	'billPayments.delete',
	'billPayments.get',
	'billPayments.list',
	'billPayments.update',
	'billVendors.create',
	'billVendors.delete',
	'billVendors.get',
	'billVendors.list',
	'billVendors.update',
	'bills.archive',
	'bills.create',
	'bills.delete',
	'bills.get',
	'bills.list',
	'bills.update',
	'businesses.create',
	'businesses.delete',
	'businesses.listUsers',
	'callbacks.create',
	'callbacks.delete',
	'callbacks.get',
	'callbacks.list',
	'callbacks.resendVerification',
	'callbacks.verify',
	'checkoutLinks.create',
	'checkoutLinks.delete',
	'checkoutLinks.setPaymentOptions',
	'checkoutLinks.update',
	'clients.create',
	'clients.delete',
	'clients.get',
	'clients.list',
	'clients.update',
	'contacts.delete',
	'contacts.update',
	'creditNotes.create',
	'creditNotes.delete',
	'creditNotes.get',
	'creditNotes.list',
	'creditNotes.update',
	'estimates.accept',
	'estimates.create',
	'estimates.delete',
	'estimates.get',
	'estimates.list',
	'estimates.markSent',
	'estimates.sendEmail',
	'estimates.update',
	'expenseCategories.create',
	'expenseCategories.get',
	'expenseCategories.list',
	'expenseProfiles.create',
	'expenses.create',
	'expenses.delete',
	'expenses.get',
	'expenses.list',
	'expenses.listVendors',
	'expenses.summaries',
	'expenses.update',
	'gateways.get',
	'gateways.provisionFreshBooksPayments',
	'invitationRates.list',
	'invitations.create',
	'invoicePaymentOptions.create',
	'invoicePaymentOptions.get',
	'invoiceProfilePaymentOptions.create',
	'invoiceProfiles.create',
	'invoiceProfiles.delete',
	'invoiceProfiles.get',
	'invoiceProfiles.list',
	'invoiceProfiles.update',
	'invoices.create',
	'invoices.delete',
	'invoices.downloadPdf',
	'invoices.get',
	'invoices.getShareLink',
	'invoices.list',
	'invoices.listPresentations',
	'invoices.markSent',
	'invoices.sendEmail',
	'invoices.update',
	'items.create',
	'items.delete',
	'items.get',
	'items.list',
	'items.update',
	'journalEntries.create',
	'journalEntryAccounts.list',
	'journalEntryDetails.list',
	'ledgerAccountSubTypes.get',
	'ledgerAccountSubTypes.list',
	'ledgerAccountTypes.list',
	'ledgerAccounts.create',
	'ledgerAccounts.get',
	'ledgerAccounts.list',
	'ledgerAccounts.update',
	'ledgerReports.accountEntryDetails',
	'ledgerReports.balanceSheet',
	'ledgerReports.cashFlow',
	'ledgerReports.chartOfAccounts',
	'ledgerReports.expenseDetails',
	'ledgerReports.generalLedger',
	'ledgerReports.manualJournalEntries',
	'ledgerReports.profitAndLoss',
	'ledgerReports.trialBalance',
	'otherIncomes.create',
	'otherIncomes.delete',
	'otherIncomes.get',
	'otherIncomes.list',
	'otherIncomes.update',
	'paymentOptions.getDefault',
	'payments.create',
	'payments.delete',
	'payments.get',
	'payments.list',
	'payments.update',
	'projectThreads.create',
	'projectThreads.list',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.list',
	'projects.update',
	'projects.updateServiceRate',
	'reports.accountStatement',
	'reports.accountsAging',
	'reports.balanceSheet',
	'reports.bankReconciliationSummary',
	'reports.download',
	'reports.expenseDetails',
	'reports.invoiceDetails',
	'reports.itemSales',
	'reports.paymentsCollected',
	'reports.profitLossEntity',
	'reports.revenueByClient',
	'reports.taxSummary',
	'reports.trialBalance',
	'retainers.create',
	'retainers.delete',
	'retainers.get',
	'retainers.list',
	'retainers.undelete',
	'retainers.update',
	'serviceRates.list',
	'services.create',
	'services.createRate',
	'services.get',
	'services.getRate',
	'services.list',
	'services.updateRate',
	'staff.delete',
	'staff.get',
	'staff.list',
	'staff.update',
	'systems.get',
	'tasks.create',
	'tasks.delete',
	'tasks.get',
	'tasks.list',
	'tasks.update',
	'taxes.create',
	'taxes.delete',
	'taxes.get',
	'taxes.list',
	'taxes.update',
	'teamMemberRates.list',
	'teamMemberRates.update',
	'teamMembers.get',
	'teamMembers.list',
	'threadComments.create',
	'timeEntries.create',
	'timeEntries.delete',
	'timeEntries.get',
	'timeEntries.list',
	'timeEntries.search',
	'timeEntries.update',
	'tokens.revoke',
	'uploads.attachment',
	'uploads.image',
	'uploads.publicImage',
	'users.me',
] as const;

export type FreshBooksOperationId = (typeof FRESHBOOKS_OPERATION_IDS)[number];

export type FreshBooksOperationInputs = {
	'abilities.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
	};
	'accountGateways.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The gateway id. */
		gatewayId: string | number;
	};
	'accountGateways.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
	};
	'adjustmentJournalEntries.create': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
	};
	'adjustmentJournalEntries.list': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Page number. */
		page_number?: number;
		/** Results per page. */
		page_size?: number;
		/** Entries on or after, YYYY-MM-DD. */
		start_date?: string;
		/** Entries on or before, YYYY-MM-DD. */
		end_date?: string;
	};
	'adjustmentJournalEntries.update': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** The journal entry uuid. */
		journalEntryUuid: string | number;
	};
	'applications.create': {
		/** The application fields (FreshBooks wraps every body in its resource name). */
		application: Record<string, FreshBooksJsonValue>;
		name?: FreshBooksJsonValue;
		redirect_uri?: FreshBooksJsonValue;
		description?: FreshBooksJsonValue;
		website_url?: FreshBooksJsonValue;
		settings_url?: FreshBooksJsonValue;
		logo_public_id?: FreshBooksJsonValue;
	};
	'applications.list': Record<string, never>;
	'applications.update': {
		/** The client id. */
		clientId: string | number;
		/** The application fields (FreshBooks wraps every body in its resource name). */
		application: Record<string, FreshBooksJsonValue>;
		name?: FreshBooksJsonValue;
		client_secret?: FreshBooksJsonValue;
		redirect_uri?: FreshBooksJsonValue;
		description?: FreshBooksJsonValue;
		website_url?: FreshBooksJsonValue;
		settings_url?: FreshBooksJsonValue;
		logo_public_id?: FreshBooksJsonValue;
	};
	'billPayments.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The bill payment fields (FreshBooks wraps every body in its resource name). */
		bill_payment: {
			[key: string]: FreshBooksJsonValue | undefined;
			billid?: FreshBooksJsonValue;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			payment_type?: FreshBooksJsonValue;
			paid_date?: FreshBooksJsonValue;
			note?: FreshBooksJsonValue;
			bill?: FreshBooksJsonValue;
		};
	};
	'billPayments.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The bill payment id. */
		billPaymentId: string | number;
	};
	'billPayments.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The bill payment id. */
		billPaymentId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
	};
	'billPayments.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'billPayments.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The bill payment id. */
		billPaymentId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The bill payment fields (FreshBooks wraps every body in its resource name). */
		bill_payment: {
			[key: string]: FreshBooksJsonValue | undefined;
			billid?: FreshBooksJsonValue;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			payment_type?: FreshBooksJsonValue;
			paid_date?: FreshBooksJsonValue;
			note?: FreshBooksJsonValue;
			bill?: FreshBooksJsonValue;
		};
	};
	'billVendors.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The bill vendor fields (FreshBooks wraps every body in its resource name). */
		bill_vendor: {
			[key: string]: FreshBooksJsonValue | undefined;
			vendor_name?: FreshBooksJsonValue;
			primary_contact_first_name?: FreshBooksJsonValue;
			primary_contact_last_name?: FreshBooksJsonValue;
			primary_contact_email?: FreshBooksJsonValue;
			primary_contact?: FreshBooksJsonValue;
			street?: FreshBooksJsonValue;
			street2?: FreshBooksJsonValue;
			city?: FreshBooksJsonValue;
			province?: FreshBooksJsonValue;
			postal_code?: FreshBooksJsonValue;
			country?: FreshBooksJsonValue;
			account_number?: FreshBooksJsonValue;
			phone?: FreshBooksJsonValue;
			website?: FreshBooksJsonValue;
			currency_code?: FreshBooksJsonValue;
			language?: FreshBooksJsonValue;
			is_1099?: FreshBooksJsonValue;
			tax_defaults?: Array<FreshBooksJsonValue>;
		};
	};
	'billVendors.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The vendor id. */
		vendorId: string | number;
	};
	'billVendors.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The vendor id. */
		vendorId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
	};
	'billVendors.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'billVendors.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The vendor id. */
		vendorId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The bill vendor fields (FreshBooks wraps every body in its resource name). */
		bill_vendor: {
			[key: string]: FreshBooksJsonValue | undefined;
			vendor_name?: FreshBooksJsonValue;
			primary_contact_first_name?: FreshBooksJsonValue;
			primary_contact_last_name?: FreshBooksJsonValue;
			primary_contact_email?: FreshBooksJsonValue;
			primary_contact?: FreshBooksJsonValue;
			street?: FreshBooksJsonValue;
			street2?: FreshBooksJsonValue;
			city?: FreshBooksJsonValue;
			province?: FreshBooksJsonValue;
			postal_code?: FreshBooksJsonValue;
			country?: FreshBooksJsonValue;
			account_number?: FreshBooksJsonValue;
			phone?: FreshBooksJsonValue;
			website?: FreshBooksJsonValue;
			currency_code?: FreshBooksJsonValue;
			language?: FreshBooksJsonValue;
			is_1099?: FreshBooksJsonValue;
			tax_defaults?: Array<FreshBooksJsonValue>;
		};
	};
	'bills.archive': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The bill id. */
		billId: string | number;
	};
	'bills.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include: vendor (include vendor details in response) */
		include?: Array<'vendor'>;
		/** The bill fields (FreshBooks wraps every body in its resource name). */
		bill: {
			[key: string]: FreshBooksJsonValue | undefined;
			vendorid?: FreshBooksJsonValue;
			previous_vendor_id?: FreshBooksJsonValue;
			bill_number?: FreshBooksJsonValue;
			issue_date?: FreshBooksJsonValue;
			due_offset_days?: FreshBooksJsonValue;
			currency_code?: FreshBooksJsonValue;
			language?: FreshBooksJsonValue;
			lines?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				tax_percent1?: FreshBooksJsonValue;
				tax_percent2?: FreshBooksJsonValue;
				unit_cost?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
				description?: FreshBooksJsonValue;
				tax_name1?: FreshBooksJsonValue;
				quantity?: FreshBooksJsonValue;
				tax_name2?: FreshBooksJsonValue;
				compounded_tax?: FreshBooksJsonValue;
				categoryid?: FreshBooksJsonValue;
			}>;
			attachment?: FreshBooksJsonValue;
		};
	};
	'bills.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The bill id. */
		billId: string | number;
	};
	'bills.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The bill id. */
		billId: string | number;
		/** Extra data to include: vendor (include vendor details in response) */
		include?: Array<'vendor'>;
	};
	'bills.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>: vendorid, statuses, currency_code, ids */
		search?: {
			[key: string]: FreshBooksJsonValue | undefined;
			/** Equals filter on vendorid: matches the id of the vendor */
			vendorid?: FreshBooksJsonValue;
			/** In filter on status: matches list of bill statuses */
			statuses?: FreshBooksJsonValue;
			/** Equals filter on currency_code: Eg. "USD" */
			currency_code?: FreshBooksJsonValue;
			/** In filter on id: matches list of bill ids */
			ids?: FreshBooksJsonValue;
		};
		/** Extra data to include: vendor (include vendor details in response) */
		include?: Array<'vendor'>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'bills.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The bill id. */
		billId: string | number;
		/** Extra data to include: vendor (include vendor details in response) */
		include?: Array<'vendor'>;
		/** The bill fields (FreshBooks wraps every body in its resource name). */
		bill: Record<string, FreshBooksJsonValue>;
	};
	'businesses.create': {
		/** The business fields (FreshBooks wraps every body in its resource name). */
		business: Record<string, FreshBooksJsonValue>;
		name?: FreshBooksJsonValue;
		date_format?: FreshBooksJsonValue;
		address_attributes?: {
			[key: string]: FreshBooksJsonValue | undefined;
			country?: FreshBooksJsonValue;
		};
		phone_number_attributes?: FreshBooksJsonValue;
	};
	'businesses.delete': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
	};
	'businesses.listUsers': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
	};
	'callbacks.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The callback fields (FreshBooks wraps every body in its resource name). */
		callback: {
			[key: string]: FreshBooksJsonValue | undefined;
			event?: FreshBooksJsonValue;
			uri?: FreshBooksJsonValue;
		};
	};
	'callbacks.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The callback id. */
		callbackId: string | number;
	};
	'callbacks.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The callback id. */
		callbackId: string | number;
	};
	'callbacks.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>: event */
		search?: {
			[key: string]: FreshBooksJsonValue | undefined;
			/** Special filter on event: Matches event and parent event. Eg. */
			event?: FreshBooksJsonValue;
		};
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'callbacks.resendVerification': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The callback id. */
		callbackId: string | number;
	};
	'callbacks.verify': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The callback id. */
		callbackId: string | number;
		/** The callback fields (FreshBooks wraps every body in its resource name). */
		callback: {
			[key: string]: FreshBooksJsonValue | undefined;
			callback_id?: FreshBooksJsonValue;
			verifier?: FreshBooksJsonValue;
		};
	};
	'checkoutLinks.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		item_id?: FreshBooksJsonValue;
		amount?: FreshBooksJsonValue;
		currency?: FreshBooksJsonValue;
		note?: FreshBooksJsonValue;
		is_active?: FreshBooksJsonValue;
		send_admin_receipt?: FreshBooksJsonValue;
		created_at?: FreshBooksJsonValue;
		taxes?: Array<{
			[key: string]: FreshBooksJsonValue | undefined;
			name?: FreshBooksJsonValue;
			amount?: FreshBooksJsonValue;
		}>;
		item_name?: FreshBooksJsonValue;
	};
	'checkoutLinks.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The checkout link id. */
		checkoutLinkId: string | number;
	};
	'checkoutLinks.setPaymentOptions': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The checkout link id. */
		checkoutLinkId: string | number;
		has_credit_card?: FreshBooksJsonValue;
		gateway_name?: FreshBooksJsonValue;
		entity_type?: FreshBooksJsonValue;
		entity_id?: FreshBooksJsonValue;
	};
	'checkoutLinks.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The checkout link id. */
		checkoutLinkId: string | number;
		item_id?: FreshBooksJsonValue;
		amount?: FreshBooksJsonValue;
		currency?: FreshBooksJsonValue;
		note?: FreshBooksJsonValue;
		is_active?: FreshBooksJsonValue;
		send_admin_receipt?: FreshBooksJsonValue;
		taxes?: Array<{
			[key: string]: FreshBooksJsonValue | undefined;
			name?: FreshBooksJsonValue;
			amount?: FreshBooksJsonValue;
		}>;
		item_name?: FreshBooksJsonValue;
	};
	'clients.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include: outstanding_balance (include client's outstanding balance); credit_balance (include client's current balance of credit); draft_balance (include balance of draft invoices for client); overdue_balance (include overdue balance for the Client); grand_total_balance (include… */
		include?: Array<
			| 'outstanding_balance'
			| 'credit_balance'
			| 'draft_balance'
			| 'overdue_balance'
			| 'grand_total_balance'
			| 'last_activity'
			| 'late_reminders'
			| 'late_fee'
		>;
		/** The client fields (FreshBooks wraps every body in its resource name). */
		client: {
			[key: string]: FreshBooksJsonValue | undefined;
			fname?: FreshBooksJsonValue;
			lname?: FreshBooksJsonValue;
			email?: FreshBooksJsonValue;
			organization?: FreshBooksJsonValue;
			vat_name?: FreshBooksJsonValue;
			vat_number?: FreshBooksJsonValue;
			status?: FreshBooksJsonValue;
			note?: FreshBooksJsonValue;
			home_phone?: FreshBooksJsonValue;
			userid?: FreshBooksJsonValue;
			source?: FreshBooksJsonValue;
			highlight_string?: FreshBooksJsonValue;
			p_street?: FreshBooksJsonValue;
			p_street2?: FreshBooksJsonValue;
			p_city?: FreshBooksJsonValue;
			p_country?: FreshBooksJsonValue;
			p_province?: FreshBooksJsonValue;
			p_code?: FreshBooksJsonValue;
			currency_code?: FreshBooksJsonValue;
			language?: FreshBooksJsonValue;
			last_activity?: FreshBooksJsonValue;
			face?: FreshBooksJsonValue;
			late_fee?: FreshBooksJsonValue;
			late_reminders?: Array<FreshBooksJsonValue>;
			contacts?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				email?: FreshBooksJsonValue;
				fname?: FreshBooksJsonValue;
				lname?: FreshBooksJsonValue;
				phone1?: FreshBooksJsonValue;
				userid?: FreshBooksJsonValue;
				face?: FreshBooksJsonValue;
			}>;
		};
	};
	'clients.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The client id. */
		clientId: string | number;
	};
	'clients.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The client id. */
		clientId: string | number;
		/** Extra data to include: outstanding_balance (include client's outstanding balance); credit_balance (include client's current balance of credit); draft_balance (include balance of draft invoices for client); overdue_balance (include overdue balance for the Client); grand_total_balance (include… */
		include?: Array<
			| 'outstanding_balance'
			| 'credit_balance'
			| 'draft_balance'
			| 'overdue_balance'
			| 'grand_total_balance'
			| 'last_activity'
			| 'late_reminders'
			| 'late_fee'
		>;
	};
	'clients.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>: address_like, email, has_credit, has_draft, has_outstanding, has_overdue, fname_like, lname_like, note_like, organization_like, phone_like, updated_min, updated_max, user_like, userid, userids, username, vis_state, email_like */
		search?: {
			[key: string]: FreshBooksJsonValue | undefined;
			/** Like filter on address: matches address fields containing the parameter */
			address_like?: FreshBooksJsonValue;
			/** Equals filter on email: matches exact email */
			email?: FreshBooksJsonValue;
			/** Equals filter on special: no input, filters to clients with credit to apply */
			has_credit?: FreshBooksJsonValue;
			/** Equals filter on special: no input, filters to clients with draft invoices */
			has_draft?: FreshBooksJsonValue;
			/** Equals filter on special: no input, filters to clients with outstanding invoices */
			has_outstanding?: FreshBooksJsonValue;
			/** Equals filter on special: no input, filters to clients with overdue invoices */
			has_overdue?: FreshBooksJsonValue;
			/** Like filter on fname: matches first names containing the parameter */
			fname_like?: FreshBooksJsonValue;
			/** Like filter on lname: matches last names containing the parameter */
			lname_like?: FreshBooksJsonValue;
			/** Like filter on note: matches notes containing the parameter */
			note_like?: FreshBooksJsonValue;
			/** Like filter on organization: matches organizations containing the parameter */
			organization_like?: FreshBooksJsonValue;
			/** Like filter on special: matches mobile phone, home phone, business, phone, or fax containing the parameter */
			phone_like?: FreshBooksJsonValue;
			/** Between filter on updated: updated date greater than or equal to parameter, YYYY-MM-DD format */
			updated_min?: FreshBooksJsonValue;
			/** Between filter on updated: updated date less than parameter, YYYY-MM-DD format */
			updated_max?: FreshBooksJsonValue;
			/** Like filter on special: matches fname, lname, or organization containing the parameter */
			user_like?: FreshBooksJsonValue;
			/** Equals filter on userid: matches exact userid */
			userid?: FreshBooksJsonValue;
			/** In filter on userid: matches list of userids, one specified per query arginput several userids to be matched */
			userids?: FreshBooksJsonValue;
			/** Equals filter on username: matches username exactly */
			username?: FreshBooksJsonValue;
			/** Equals filter on vis_state: matches vis_state exactly */
			vis_state?: FreshBooksJsonValue;
			/** Like filter on email: matches client's email addresses containing the parameter */
			email_like?: FreshBooksJsonValue;
		};
		/** Extra data to include: outstanding_balance (include client's outstanding balance); credit_balance (include client's current balance of credit); draft_balance (include balance of draft invoices for client); overdue_balance (include overdue balance for the Client); grand_total_balance (include… */
		include?: Array<
			| 'outstanding_balance'
			| 'credit_balance'
			| 'draft_balance'
			| 'overdue_balance'
			| 'grand_total_balance'
			| 'last_activity'
			| 'late_reminders'
			| 'late_fee'
		>;
		/** Sort field, `<field>_asc` or `<field>_desc` (fields: client_id, organization_name, email, bus_phone, updated, fullname, primarycontact, outstanding, overdue, credit). */
		sort?: string;
	};
	'clients.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The client id. */
		clientId: string | number;
		/** Extra data to include: outstanding_balance (include client's outstanding balance); credit_balance (include client's current balance of credit); draft_balance (include balance of draft invoices for client); overdue_balance (include overdue balance for the Client); grand_total_balance (include… */
		include?: Array<
			| 'outstanding_balance'
			| 'credit_balance'
			| 'draft_balance'
			| 'overdue_balance'
			| 'grand_total_balance'
			| 'last_activity'
			| 'late_reminders'
			| 'late_fee'
		>;
		/** The client fields (FreshBooks wraps every body in its resource name). */
		client: {
			[key: string]: FreshBooksJsonValue | undefined;
			fname?: FreshBooksJsonValue;
			contacts?: Array<FreshBooksJsonValue>;
		};
	};
	'contacts.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The contact id. */
		contactId: string | number;
	};
	'contacts.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The contact id. */
		contactId: string | number;
		/** The contact fields (FreshBooks wraps every body in its resource name). */
		contact: {
			[key: string]: FreshBooksJsonValue | undefined;
			email?: FreshBooksJsonValue;
			fname?: FreshBooksJsonValue;
			lname?: FreshBooksJsonValue;
			phone1?: FreshBooksJsonValue;
		};
	};
	'creditNotes.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The credit note fields (FreshBooks wraps every body in its resource name). */
		credit_note: {
			[key: string]: FreshBooksJsonValue | undefined;
			credit_number?: FreshBooksJsonValue;
			currency_code?: FreshBooksJsonValue;
			create_date?: FreshBooksJsonValue;
			notes?: FreshBooksJsonValue;
			credit_type?: FreshBooksJsonValue;
			terms?: FreshBooksJsonValue;
			language?: FreshBooksJsonValue;
			lines?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				name?: FreshBooksJsonValue;
				description?: FreshBooksJsonValue;
				taxName1?: FreshBooksJsonValue;
				taxAmount1?: FreshBooksJsonValue;
				taxName2?: FreshBooksJsonValue;
				taxAmount2?: FreshBooksJsonValue;
				compounded_tax?: FreshBooksJsonValue;
				qty?: FreshBooksJsonValue;
				unit_cost?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
				credit_note?: FreshBooksJsonValue;
			}>;
			clientid?: FreshBooksJsonValue;
		};
	};
	'creditNotes.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The credit id. */
		creditId: string | number;
	};
	'creditNotes.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The credit id. */
		creditId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
	};
	'creditNotes.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'creditNotes.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The credit id. */
		creditId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The credit note fields (FreshBooks wraps every body in its resource name). */
		credit_note: {
			[key: string]: FreshBooksJsonValue | undefined;
			credit_number?: FreshBooksJsonValue;
			currency_code?: FreshBooksJsonValue;
			create_date?: FreshBooksJsonValue;
			notes?: FreshBooksJsonValue;
			credit_type?: FreshBooksJsonValue;
			terms?: FreshBooksJsonValue;
			language?: FreshBooksJsonValue;
			lines?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				id?: FreshBooksJsonValue;
				name?: FreshBooksJsonValue;
				description?: FreshBooksJsonValue;
				taxName1?: FreshBooksJsonValue;
				taxAmount1?: FreshBooksJsonValue;
				taxName2?: FreshBooksJsonValue;
				taxAmount2?: FreshBooksJsonValue;
				compounded_tax?: FreshBooksJsonValue;
				qty?: FreshBooksJsonValue;
				unit_cost?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
			}>;
			clientid?: FreshBooksJsonValue;
		};
	};
	'estimates.accept': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The estimate id. */
		estimateId: string | number;
	};
	'estimates.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include: audit_logs (Show estimate view/send history); comments (Comments made on estimate); contacts (List of client contacts); lines (Estimate lines); owner (Owner info); presentation (Presentation type); project (Projects); invoices (Invoices); system (Estimate-owner's system) */
		include?: Array<
			| 'audit_logs'
			| 'comments'
			| 'contacts'
			| 'lines'
			| 'owner'
			| 'presentation'
			| 'project'
			| 'invoices'
			| 'system'
		>;
		/** The estimate fields (FreshBooks wraps every body in its resource name). */
		estimate: {
			[key: string]: FreshBooksJsonValue | undefined;
			customerid?: FreshBooksJsonValue;
			create_date?: FreshBooksJsonValue;
			presentation?: {
				[key: string]: FreshBooksJsonValue | undefined;
				theme_primary_color?: FreshBooksJsonValue;
				image_logo_src?: FreshBooksJsonValue;
				theme_font_name?: FreshBooksJsonValue;
				theme_layout?: FreshBooksJsonValue;
				date_format?: FreshBooksJsonValue;
				image_banner_position_y?: FreshBooksJsonValue;
			};
			lines?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				type?: FreshBooksJsonValue;
				description?: FreshBooksJsonValue;
				taxName1?: FreshBooksJsonValue;
				taxAmount1?: FreshBooksJsonValue;
				name?: FreshBooksJsonValue;
				qty?: FreshBooksJsonValue;
				taxName2?: FreshBooksJsonValue;
				taxAmount2?: FreshBooksJsonValue;
				unit_cost?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
				expenseid?: FreshBooksJsonValue;
				compounded_tax?: FreshBooksJsonValue;
				taskno?: FreshBooksJsonValue;
				amount?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
				estimateid?: FreshBooksJsonValue;
			}>;
			rich_proposal?: FreshBooksJsonValue;
			require_client_signature?: FreshBooksJsonValue;
			currency_code?: FreshBooksJsonValue;
			discount_value?: FreshBooksJsonValue;
			estimate_number?: FreshBooksJsonValue;
			template?: FreshBooksJsonValue;
			terms?: FreshBooksJsonValue;
			payment_details?: FreshBooksJsonValue;
			vat_name?: FreshBooksJsonValue;
			vat_number?: FreshBooksJsonValue;
			attachments?: Array<FreshBooksJsonValue>;
			sections?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				body?: FreshBooksJsonValue;
				group_name?: FreshBooksJsonValue;
				title?: FreshBooksJsonValue;
				type?: FreshBooksJsonValue;
			}>;
		};
	};
	'estimates.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The estimate id. */
		estimateId: string | number;
	};
	'estimates.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The estimate id. */
		estimateId: string | number;
		/** Extra data to include: audit_logs (Show estimate view/send history); comments (Comments made on estimate); contacts (List of client contacts); lines (Estimate lines); owner (Owner info); presentation (Presentation type); project (Projects); invoices (Invoices); system (Estimate-owner's system) */
		include?: Array<
			| 'audit_logs'
			| 'comments'
			| 'contacts'
			| 'lines'
			| 'owner'
			| 'presentation'
			| 'project'
			| 'invoices'
			| 'system'
		>;
	};
	'estimates.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Extra data to include: audit_logs (Show estimate view/send history); comments (Comments made on estimate); contacts (List of client contacts); lines (Estimate lines); owner (Owner info); presentation (Presentation type); project (Projects); invoices (Invoices); system (Estimate-owner's system) */
		include?: Array<
			| 'audit_logs'
			| 'comments'
			| 'contacts'
			| 'lines'
			| 'owner'
			| 'presentation'
			| 'project'
			| 'invoices'
			| 'system'
		>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'estimates.markSent': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The estimate id. */
		estimateId: string | number;
	};
	'estimates.sendEmail': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The estimate id. */
		estimateId: string | number;
		/** The estimate fields (FreshBooks wraps every body in its resource name). action_email true is added for you. */
		estimate: {
			[key: string]: FreshBooksJsonValue | undefined;
			email_recipients?: Array<FreshBooksJsonValue>;
			estimate_customized_email?: {
				[key: string]: FreshBooksJsonValue | undefined;
				subject?: FreshBooksJsonValue;
				body?: FreshBooksJsonValue;
			};
			action_email?: FreshBooksJsonValue;
		};
	};
	'estimates.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The estimate id. */
		estimateId: string | number;
		/** Extra data to include: audit_logs (Show estimate view/send history); comments (Comments made on estimate); contacts (List of client contacts); lines (Estimate lines); owner (Owner info); presentation (Presentation type); project (Projects); invoices (Invoices); system (Estimate-owner's system) */
		include?: Array<
			| 'audit_logs'
			| 'comments'
			| 'contacts'
			| 'lines'
			| 'owner'
			| 'presentation'
			| 'project'
			| 'invoices'
			| 'system'
		>;
		/** The estimate fields (FreshBooks wraps every body in its resource name). */
		estimate: {
			[key: string]: FreshBooksJsonValue | undefined;
			customerid?: FreshBooksJsonValue;
			create_date?: FreshBooksJsonValue;
		};
	};
	'expenseCategories.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The category fields (FreshBooks wraps every body in its resource name). */
		category: {
			[key: string]: FreshBooksJsonValue | undefined;
			category?: FreshBooksJsonValue;
			is_cogs?: FreshBooksJsonValue;
			is_editable?: FreshBooksJsonValue;
			parentid?: FreshBooksJsonValue;
			subcategories?: Array<FreshBooksJsonValue>;
		};
	};
	'expenseCategories.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The category id. */
		categoryId: string | number;
	};
	'expenseCategories.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Extra data to include: expense_usage_all_time (include expense usage across all time in category); expense_usage_this_year (include expense usage across this year in category) */
		include?: Array<'expense_usage_all_time' | 'expense_usage_this_year'>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'expenseProfiles.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The expense profile fields (FreshBooks wraps every body in its resource name). */
		expense_profile: {
			[key: string]: FreshBooksJsonValue | undefined;
			frequency?: FreshBooksJsonValue;
			profileid?: FreshBooksJsonValue;
			start_date?: FreshBooksJsonValue;
			end_date?: FreshBooksJsonValue;
			next_issue_date?: FreshBooksJsonValue;
			is_cogs?: FreshBooksJsonValue;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			notes?: FreshBooksJsonValue;
			vendor?: FreshBooksJsonValue;
			staffid?: FreshBooksJsonValue;
			author_name?: FreshBooksJsonValue;
			taxName1?: FreshBooksJsonValue;
			taxName2?: FreshBooksJsonValue;
			taxAmount1?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			taxPercent1?: FreshBooksJsonValue;
			taxPercent2?: FreshBooksJsonValue;
			markup_percent?: FreshBooksJsonValue;
			from_bulk_import?: FreshBooksJsonValue;
			categoryid?: FreshBooksJsonValue;
			clientid?: FreshBooksJsonValue;
		};
	};
	'expenses.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include: attachment (Includes attachment details assocatied with expense receipts); category (Include expense category in expense); expense_profile (Include expense profile info in expense); project (Include related projects in expense); account (Include account info in expense) */
		include?: Array<
			'attachment' | 'category' | 'expense_profile' | 'project' | 'account'
		>;
		/** The expense fields (FreshBooks wraps every body in its resource name). */
		expense: {
			[key: string]: FreshBooksJsonValue | undefined;
			transactionid?: FreshBooksJsonValue;
			status?: FreshBooksJsonValue;
			has_receipt?: FreshBooksJsonValue;
			always_remember?: FreshBooksJsonValue;
			is_cogs?: FreshBooksJsonValue;
			account_name?: FreshBooksJsonValue;
			include_receipt?: FreshBooksJsonValue;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			notes?: FreshBooksJsonValue;
			vendor?: FreshBooksJsonValue;
			date?: FreshBooksJsonValue;
			staffid?: FreshBooksJsonValue;
			author_name?: FreshBooksJsonValue;
			taxName1?: FreshBooksJsonValue;
			taxName2?: FreshBooksJsonValue;
			taxAmount1?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			taxPercent1?: FreshBooksJsonValue;
			taxPercent2?: FreshBooksJsonValue;
			markup_percent?: FreshBooksJsonValue;
			invoiceid?: FreshBooksJsonValue;
			attachment?: {
				[key: string]: FreshBooksJsonValue | undefined;
				jwt?: FreshBooksJsonValue;
				media_type?: FreshBooksJsonValue;
				expenseid?: FreshBooksJsonValue;
			};
			categoryid?: FreshBooksJsonValue;
			category_name?: FreshBooksJsonValue;
			clientid?: FreshBooksJsonValue;
			converse_projectid?: FreshBooksJsonValue;
		};
	};
	'expenses.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The expense id. */
		expenseId: string | number;
	};
	'expenses.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The expense id. */
		expenseId: string | number;
		/** Extra data to include: attachment (Includes attachment details assocatied with expense receipts); category (Include expense category in expense); expense_profile (Include expense profile info in expense); project (Include related projects in expense); account (Include account info in expense) */
		include?: Array<
			'attachment' | 'category' | 'expense_profile' | 'project' | 'account'
		>;
	};
	'expenses.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Extra data to include: attachment (Includes attachment details assocatied with expense receipts); category (Include expense category in expense); expense_profile (Include expense profile info in expense); project (Include related projects in expense); account (Include account info in expense) */
		include?: Array<
			'attachment' | 'category' | 'expense_profile' | 'project' | 'account'
		>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'expenses.listVendors': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
	};
	'expenses.summaries': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'expenses.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The expense id. */
		expenseId: string | number;
		/** Extra data to include: attachment (Includes attachment details assocatied with expense receipts); category (Include expense category in expense); expense_profile (Include expense profile info in expense); project (Include related projects in expense); account (Include account info in expense) */
		include?: Array<
			'attachment' | 'category' | 'expense_profile' | 'project' | 'account'
		>;
		/** The expense fields (FreshBooks wraps every body in its resource name). */
		expense: {
			[key: string]: FreshBooksJsonValue | undefined;
			vendor?: FreshBooksJsonValue;
			transactionid?: FreshBooksJsonValue;
			status?: FreshBooksJsonValue;
			has_receipt?: FreshBooksJsonValue;
			always_remember?: FreshBooksJsonValue;
			is_cogs?: FreshBooksJsonValue;
			account_name?: FreshBooksJsonValue;
			include_receipt?: FreshBooksJsonValue;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			notes?: FreshBooksJsonValue;
			date?: FreshBooksJsonValue;
			staffid?: FreshBooksJsonValue;
			author_name?: FreshBooksJsonValue;
			taxName1?: FreshBooksJsonValue;
			taxName2?: FreshBooksJsonValue;
			taxAmount1?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			taxPercent1?: FreshBooksJsonValue;
			taxPercent2?: FreshBooksJsonValue;
			markup_percent?: FreshBooksJsonValue;
			invoiceid?: FreshBooksJsonValue;
			attachment?: {
				[key: string]: FreshBooksJsonValue | undefined;
				jwt?: FreshBooksJsonValue;
				media_type?: FreshBooksJsonValue;
				expenseid?: FreshBooksJsonValue;
			};
			categoryid?: FreshBooksJsonValue;
			clientid?: FreshBooksJsonValue;
		};
	};
	'gateways.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
	};
	'gateways.provisionFreshBooksPayments': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		fname?: FreshBooksJsonValue;
		lname?: FreshBooksJsonValue;
		email?: FreshBooksJsonValue;
		orgname?: FreshBooksJsonValue;
		redirect_base_uri?: FreshBooksJsonValue;
		country?: FreshBooksJsonValue;
		allow_multiple_provision?: FreshBooksJsonValue;
	};
	'invitationRates.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
	};
	'invitations.create': {
		/** The invitation fields (FreshBooks wraps every body in its resource name). */
		invitation: Record<string, FreshBooksJsonValue>;
		capacity?: FreshBooksJsonValue;
		to_email?: FreshBooksJsonValue;
		invitable_id?: FreshBooksJsonValue;
		invitable_type?: FreshBooksJsonValue;
		groups?: Array<{
			[key: string]: FreshBooksJsonValue | undefined;
			group_id?: FreshBooksJsonValue;
			capacity?: FreshBooksJsonValue;
		}>;
	};
	'invoicePaymentOptions.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
		has_credit_card?: FreshBooksJsonValue;
		has_ach_transfer?: FreshBooksJsonValue;
		allow_partial_payments?: FreshBooksJsonValue;
		gateway_name?: FreshBooksJsonValue;
	};
	'invoicePaymentOptions.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
	};
	'invoiceProfilePaymentOptions.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice profile id. */
		invoiceProfileId: string | number;
		has_credit_card?: FreshBooksJsonValue;
		has_ach_transfer?: FreshBooksJsonValue;
		gateway_name?: FreshBooksJsonValue;
	};
	'invoiceProfiles.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include: allowed_gateways (list of allowed gateways); audit_logs (a summarization of the invoice for audit purposes); contacts (contains contact objects populated with the client's data); late_fee (late fee info); lines (invoice lines); presentation (data representing the stylings… */
		include?: Array<
			| 'allowed_gateways'
			| 'audit_logs'
			| 'contacts'
			| 'late_fee'
			| 'lines'
			| 'presentation'
			| 'system'
			| 'tracking'
			| 'next_issue_date'
			| 'project_format'
		>;
		/** The invoice profile fields (FreshBooks wraps every body in its resource name). */
		invoice_profile: {
			[key: string]: FreshBooksJsonValue | undefined;
			customerid?: FreshBooksJsonValue;
			create_date?: FreshBooksJsonValue;
			frequency?: FreshBooksJsonValue;
			numberRecurring?: FreshBooksJsonValue;
			lines?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				name?: FreshBooksJsonValue;
				qty?: FreshBooksJsonValue;
				unit_cost?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
				amount?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
				description?: FreshBooksJsonValue;
				expenseid?: FreshBooksJsonValue;
				taxName1?: FreshBooksJsonValue;
				taxAmount1?: FreshBooksJsonValue;
				taxName2?: FreshBooksJsonValue;
				taxAmount2?: FreshBooksJsonValue;
				type?: FreshBooksJsonValue;
				profileid?: FreshBooksJsonValue;
			}>;
			profileid?: FreshBooksJsonValue;
			disable?: FreshBooksJsonValue;
			due_offset_days?: FreshBooksJsonValue;
			send_email?: FreshBooksJsonValue;
			include_unbilled_time?: FreshBooksJsonValue;
			project_format?: {
				[key: string]: FreshBooksJsonValue | undefined;
				group_by?: FreshBooksJsonValue;
				method?: FreshBooksJsonValue;
				show_tname?: FreshBooksJsonValue;
				show_pname?: FreshBooksJsonValue;
				show_staff?: FreshBooksJsonValue;
				show_date?: FreshBooksJsonValue;
				show_notes?: FreshBooksJsonValue;
				show_total_hours?: FreshBooksJsonValue;
			};
			skip_generation?: FreshBooksJsonValue;
			retainer_id?: FreshBooksJsonValue;
			require_auto_bill?: FreshBooksJsonValue;
			currency_code?: FreshBooksJsonValue;
			discount_value?: FreshBooksJsonValue;
			template?: FreshBooksJsonValue;
			terms?: FreshBooksJsonValue;
			allowed_gatewayids?: Array<FreshBooksJsonValue>;
			late_fee?: {
				[key: string]: FreshBooksJsonValue | undefined;
				compounded_taxes?: FreshBooksJsonValue;
				days?: FreshBooksJsonValue;
				enabled?: FreshBooksJsonValue;
				first_tax_name?: FreshBooksJsonValue;
				first_tax_percent?: FreshBooksJsonValue;
				repeat?: FreshBooksJsonValue;
				second_tax_name?: FreshBooksJsonValue;
				second_tax_percent?: FreshBooksJsonValue;
				type?: FreshBooksJsonValue;
				value?: FreshBooksJsonValue;
			};
			late_reminders?: Array<FreshBooksJsonValue>;
		};
	};
	'invoiceProfiles.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice profile id. */
		invoiceProfileId: string | number;
	};
	'invoiceProfiles.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice profile id. */
		invoiceProfileId: string | number;
		/** Extra data to include: allowed_gateways (list of allowed gateways); audit_logs (a summarization of the invoice for audit purposes); contacts (contains contact objects populated with the client's data); late_fee (late fee info); lines (invoice lines); presentation (data representing the stylings… */
		include?: Array<
			| 'allowed_gateways'
			| 'audit_logs'
			| 'contacts'
			| 'late_fee'
			| 'lines'
			| 'presentation'
			| 'system'
			| 'tracking'
			| 'next_issue_date'
			| 'project_format'
		>;
	};
	'invoiceProfiles.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Extra data to include: allowed_gateways (list of allowed gateways); audit_logs (a summarization of the invoice for audit purposes); contacts (contains contact objects populated with the client's data); late_fee (late fee info); lines (invoice lines); presentation (data representing the stylings… */
		include?: Array<
			| 'allowed_gateways'
			| 'audit_logs'
			| 'contacts'
			| 'late_fee'
			| 'lines'
			| 'presentation'
			| 'system'
			| 'tracking'
			| 'next_issue_date'
			| 'project_format'
		>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'invoiceProfiles.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice profile id. */
		invoiceProfileId: string | number;
		/** Extra data to include: allowed_gateways (list of allowed gateways); audit_logs (a summarization of the invoice for audit purposes); contacts (contains contact objects populated with the client's data); late_fee (late fee info); lines (invoice lines); presentation (data representing the stylings… */
		include?: Array<
			| 'allowed_gateways'
			| 'audit_logs'
			| 'contacts'
			| 'late_fee'
			| 'lines'
			| 'presentation'
			| 'system'
			| 'tracking'
			| 'next_issue_date'
			| 'project_format'
		>;
		/** The invoice profile fields (FreshBooks wraps every body in its resource name). */
		invoice_profile: {
			[key: string]: FreshBooksJsonValue | undefined;
			frequency?: FreshBooksJsonValue;
			numberRecurring?: FreshBooksJsonValue;
		};
	};
	'invoices.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include: audit_logs (Show invoice view/send/payment history); client_audits (Show the client-visible invoice history); comments (Comments made on invoice); contacts (List of client contacts); lines (Invoice lines); owner (Owner info); latest_journal_entry (Journal entry info);… */
		include?: Array<
			| 'audit_logs'
			| 'client_audits'
			| 'comments'
			| 'contacts'
			| 'lines'
			| 'owner'
			| 'latest_journal_entry'
			| 'allowed_gateways'
			| 'late_fee'
			| 'presentation'
			| 'project_total_amounts'
			| 'late_reminders'
			| 'system'
		>;
		/** The invoice fields (FreshBooks wraps every body in its resource name). */
		invoice: {
			[key: string]: FreshBooksJsonValue | undefined;
			customerid?: FreshBooksJsonValue;
			create_date?: FreshBooksJsonValue;
			lines?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				type?: FreshBooksJsonValue;
				description?: FreshBooksJsonValue;
				taxName1?: FreshBooksJsonValue;
				taxAmount1?: FreshBooksJsonValue;
				name?: FreshBooksJsonValue;
				qty?: FreshBooksJsonValue;
				taxName2?: FreshBooksJsonValue;
				taxAmount2?: FreshBooksJsonValue;
				unit_cost?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
				expenseid?: FreshBooksJsonValue;
			}>;
			presentation?: {
				[key: string]: FreshBooksJsonValue | undefined;
				image_logo_src?: FreshBooksJsonValue;
				theme_primary_color?: FreshBooksJsonValue;
				theme_layout?: FreshBooksJsonValue;
				theme_font_name?: FreshBooksJsonValue;
			};
		};
	};
	'invoices.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
	};
	'invoices.downloadPdf': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
	};
	'invoices.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
		/** Extra data to include: audit_logs (Show invoice view/send/payment history); client_audits (Show the client-visible invoice history); comments (Comments made on invoice); contacts (List of client contacts); lines (Invoice lines); owner (Owner info); latest_journal_entry (Journal entry info);… */
		include?: Array<
			| 'audit_logs'
			| 'client_audits'
			| 'comments'
			| 'contacts'
			| 'lines'
			| 'owner'
			| 'latest_journal_entry'
			| 'allowed_gateways'
			| 'late_fee'
			| 'presentation'
			| 'project_total_amounts'
			| 'late_reminders'
			| 'system'
		>;
	};
	'invoices.getShareLink': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
		/** How the link is shared: share_link (the default in the docs examples). */
		share_method?: string;
	};
	'invoices.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Extra data to include: audit_logs (Show invoice view/send/payment history); client_audits (Show the client-visible invoice history); comments (Comments made on invoice); contacts (List of client contacts); lines (Invoice lines); owner (Owner info); latest_journal_entry (Journal entry info);… */
		include?: Array<
			| 'audit_logs'
			| 'client_audits'
			| 'comments'
			| 'contacts'
			| 'lines'
			| 'owner'
			| 'latest_journal_entry'
			| 'allowed_gateways'
			| 'late_fee'
			| 'presentation'
			| 'project_total_amounts'
			| 'late_reminders'
			| 'system'
		>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'invoices.listPresentations': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
	};
	'invoices.markSent': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
	};
	'invoices.sendEmail': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
		/** The invoice fields (FreshBooks wraps every body in its resource name). action_email true is added for you. */
		invoice: {
			[key: string]: FreshBooksJsonValue | undefined;
			email_recipients?: Array<FreshBooksJsonValue>;
			invoice_customized_email?: {
				[key: string]: FreshBooksJsonValue | undefined;
				subject?: FreshBooksJsonValue;
				body?: FreshBooksJsonValue;
			};
			action_email?: FreshBooksJsonValue;
		};
	};
	'invoices.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The invoice id. */
		invoiceId: string | number;
		/** Extra data to include: audit_logs (Show invoice view/send/payment history); client_audits (Show the client-visible invoice history); comments (Comments made on invoice); contacts (List of client contacts); lines (Invoice lines); owner (Owner info); latest_journal_entry (Journal entry info);… */
		include?: Array<
			| 'audit_logs'
			| 'client_audits'
			| 'comments'
			| 'contacts'
			| 'lines'
			| 'owner'
			| 'latest_journal_entry'
			| 'allowed_gateways'
			| 'late_fee'
			| 'presentation'
			| 'project_total_amounts'
			| 'late_reminders'
			| 'system'
		>;
		/** The invoice fields (FreshBooks wraps every body in its resource name). */
		invoice: {
			[key: string]: FreshBooksJsonValue | undefined;
			status?: FreshBooksJsonValue;
			lines?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				type?: FreshBooksJsonValue;
				description?: FreshBooksJsonValue;
				expenseid?: FreshBooksJsonValue;
				taxName1?: FreshBooksJsonValue;
				taxAmount1?: FreshBooksJsonValue;
				name?: FreshBooksJsonValue;
				qty?: FreshBooksJsonValue;
				taxName2?: FreshBooksJsonValue;
				taxAmount2?: FreshBooksJsonValue;
				unit_cost?: {
					[key: string]: FreshBooksJsonValue | undefined;
					amount?: FreshBooksJsonValue;
					code?: FreshBooksJsonValue;
				};
			}>;
			allowed_gatewayids?: Array<FreshBooksJsonValue>;
		};
	};
	'items.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The item fields (FreshBooks wraps every body in its resource name). */
		item: {
			[key: string]: FreshBooksJsonValue | undefined;
			name?: FreshBooksJsonValue;
			qty?: FreshBooksJsonValue;
			inventory?: FreshBooksJsonValue;
			unit_cost?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			vis_state?: FreshBooksJsonValue;
			description?: FreshBooksJsonValue;
			sku?: FreshBooksJsonValue;
		};
	};
	'items.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The item id. */
		itemId: string | number;
	};
	'items.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The item id. */
		itemId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
	};
	'items.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'items.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The item id. */
		itemId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The item fields (FreshBooks wraps every body in its resource name). */
		item: {
			[key: string]: FreshBooksJsonValue | undefined;
			name?: FreshBooksJsonValue;
			description?: FreshBooksJsonValue;
			inventory?: FreshBooksJsonValue;
		};
	};
	'journalEntries.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The journal entry fields (FreshBooks wraps every body in its resource name). */
		journal_entry: {
			[key: string]: FreshBooksJsonValue | undefined;
			details?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				sub_accountid?: FreshBooksJsonValue;
				debit?: FreshBooksJsonValue;
				credit?: FreshBooksJsonValue;
			}>;
			currency_code?: FreshBooksJsonValue;
			description?: FreshBooksJsonValue;
			name?: FreshBooksJsonValue;
			user_entered_date?: FreshBooksJsonValue;
		};
	};
	'journalEntryAccounts.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'journalEntryDetails.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'ledgerAccountSubTypes.get': {
		/** The sub type id. */
		subTypeId: string | number;
	};
	'ledgerAccountSubTypes.list': Record<string, never>;
	'ledgerAccountTypes.list': Record<string, never>;
	'ledgerAccounts.create': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		name?: FreshBooksJsonValue;
		number?: FreshBooksJsonValue;
		description?: FreshBooksJsonValue;
		sub_type?: FreshBooksJsonValue;
		parent_account?: FreshBooksJsonValue;
		system_account_name?: FreshBooksJsonValue;
		auto_created?: FreshBooksJsonValue;
	};
	'ledgerAccounts.get': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** The account uuid. */
		accountUuid: string | number;
	};
	'ledgerAccounts.list': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
	};
	'ledgerAccounts.update': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** The account uuid. */
		accountUuid: string | number;
		uuid?: FreshBooksJsonValue;
		name?: FreshBooksJsonValue;
		number?: FreshBooksJsonValue;
		description?: FreshBooksJsonValue;
		type?: FreshBooksJsonValue;
		sub_type?: FreshBooksJsonValue;
		parent_account?: FreshBooksJsonValue;
		sub_accounts?: Array<FreshBooksJsonValue>;
	};
	'ledgerReports.accountEntryDetails': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** The account uuid. */
		accountUuid: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Read from ledger entries (the docs examples set true). */
		use_ledger_entries?: boolean;
		/** Include entries of sub-accounts. */
		include_children?: boolean;
	};
	'ledgerReports.balanceSheet': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Report date, YYYY-MM-DD. */
		date1?: string;
		/** Three-letter currency code. */
		currency_code?: string;
		/** Read from ledger entries. */
		use_ledger_entries?: boolean;
	};
	'ledgerReports.cashFlow': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Read from ledger entries (the docs examples set true). */
		use_ledger_entries?: boolean;
	};
	'ledgerReports.chartOfAccounts': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Read from ledger entries (the docs examples set true). */
		use_ledger_entries?: boolean;
		/** Sort, for example account_number_asc. */
		sort?: string;
		/** active or archived accounts. */
		state?: string;
	};
	'ledgerReports.expenseDetails': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Read from ledger entries (the docs examples set true). */
		use_ledger_entries?: boolean;
	};
	'ledgerReports.generalLedger': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Read from ledger entries (the docs examples set true). */
		use_ledger_entries?: boolean;
	};
	'ledgerReports.manualJournalEntries': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Read from ledger entries (the docs examples set true). */
		use_ledger_entries?: boolean;
	};
	'ledgerReports.profitAndLoss': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Read from ledger entries (the docs examples set true). */
		use_ledger_entries?: boolean;
	};
	'ledgerReports.trialBalance': {
		/** The business uuid. Left out, the plugin reads it from users.me (or the businessUuid option). */
		businessUuid?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Read from ledger entries (the docs examples set true). */
		use_ledger_entries?: boolean;
	};
	'otherIncomes.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The other income fields (FreshBooks wraps every body in its resource name). */
		other_income: {
			[key: string]: FreshBooksJsonValue | undefined;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			category_name?: FreshBooksJsonValue;
			date?: FreshBooksJsonValue;
			note?: FreshBooksJsonValue;
			payment_type?: FreshBooksJsonValue;
			source?: FreshBooksJsonValue;
			taxes?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				name?: FreshBooksJsonValue;
			}>;
		};
	};
	'otherIncomes.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The income id. */
		incomeId: string | number;
	};
	'otherIncomes.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The income id. */
		incomeId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
	};
	'otherIncomes.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'otherIncomes.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The income id. */
		incomeId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The other income fields (FreshBooks wraps every body in its resource name). */
		other_income: {
			[key: string]: FreshBooksJsonValue | undefined;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			date?: FreshBooksJsonValue;
			source?: FreshBooksJsonValue;
		};
	};
	'paymentOptions.getDefault': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The entity the defaults are for: invoice. */
		entity_type?: string;
	};
	'payments.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include: client (include client info in payment); invoice (include related invoice info in payment); credit_note (include credit note info in payment); order (include gateway order in payment); gateway (include gateway info in payment) */
		include?: Array<'client' | 'invoice' | 'credit_note' | 'order' | 'gateway'>;
		/** The payment fields (FreshBooks wraps every body in its resource name). */
		payment: {
			[key: string]: FreshBooksJsonValue | undefined;
			invoiceid?: FreshBooksJsonValue;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
			};
			date?: FreshBooksJsonValue;
			type?: FreshBooksJsonValue;
			note?: FreshBooksJsonValue;
		};
	};
	'payments.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The payment id. */
		paymentId: string | number;
	};
	'payments.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The payment id. */
		paymentId: string | number;
		/** Extra data to include: client (include client info in payment); invoice (include related invoice info in payment); credit_note (include credit note info in payment); order (include gateway order in payment); gateway (include gateway info in payment) */
		include?: Array<'client' | 'invoice' | 'credit_note' | 'order' | 'gateway'>;
	};
	'payments.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Extra data to include: client (include client info in payment); invoice (include related invoice info in payment); credit_note (include credit note info in payment); order (include gateway order in payment); gateway (include gateway info in payment) */
		include?: Array<'client' | 'invoice' | 'credit_note' | 'order' | 'gateway'>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'payments.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The payment id. */
		paymentId: string | number;
		/** Extra data to include: client (include client info in payment); invoice (include related invoice info in payment); credit_note (include credit note info in payment); order (include gateway order in payment); gateway (include gateway info in payment) */
		include?: Array<'client' | 'invoice' | 'credit_note' | 'order' | 'gateway'>;
		/** The payment fields (FreshBooks wraps every body in its resource name). */
		payment: {
			[key: string]: FreshBooksJsonValue | undefined;
			amount?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
			note?: FreshBooksJsonValue;
		};
	};
	'projectThreads.create': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The project id. */
		projectId: string | number;
		/** The thread fields (FreshBooks wraps every body in its resource name). */
		thread: {
			[key: string]: FreshBooksJsonValue | undefined;
			message?: FreshBooksJsonValue;
		};
	};
	'projectThreads.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The project id. */
		projectId: string | number;
	};
	'projects.create': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The project fields (FreshBooks wraps every body in its resource name). */
		project: {
			[key: string]: FreshBooksJsonValue | undefined;
			title?: FreshBooksJsonValue;
			client_id?: FreshBooksJsonValue;
			project_type?: FreshBooksJsonValue;
			fixed_price?: FreshBooksJsonValue;
			due_date?: FreshBooksJsonValue;
			services?: Array<{
				[key: string]: FreshBooksJsonValue | undefined;
				id?: FreshBooksJsonValue;
				billable?: FreshBooksJsonValue;
				vis_state?: FreshBooksJsonValue;
			}>;
		};
	};
	'projects.delete': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The project id. */
		projectId: string | number;
	};
	'projects.get': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The project id. */
		projectId: string | number;
	};
	'projects.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** True marks that the project is still an active project. */
		active?: boolean;
		/** True marks that the project has been completed. */
		complete?: boolean;
		/** True returns the time logged for a project (in seconds). */
		include_logged_duration?: boolean;
		/** Matches projects that have been updated at or after the specified utc date/time (ISO 8601, UTC). */
		updated_since?: string;
		/** True returns projects without the group field. */
		skip_group?: boolean;
		/** Sort field (created_at, due_date, title); prefix with - for descending. */
		sort?: string;
	};
	'projects.update': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The project id. */
		projectId: string | number;
		/** The project fields (FreshBooks wraps every body in its resource name). */
		project: {
			[key: string]: FreshBooksJsonValue | undefined;
			title?: FreshBooksJsonValue;
			due_date?: FreshBooksJsonValue;
			client_id?: FreshBooksJsonValue;
		};
	};
	'projects.updateServiceRate': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The project id. */
		projectId: string | number;
		/** The service id. */
		serviceId: string | number;
		/** The service rate fields (FreshBooks wraps every body in its resource name). */
		service_rate: Record<string, FreshBooksJsonValue>;
		project_service_rate?: {
			[key: string]: FreshBooksJsonValue | undefined;
			rate?: FreshBooksJsonValue;
			service_id?: FreshBooksJsonValue;
			project_id?: FreshBooksJsonValue;
		};
	};
	'reports.accountStatement': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** The client id. */
		clientid?: string;
	};
	'reports.accountsAging': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
	};
	'reports.balanceSheet': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Report dates, YYYY-MM-DD. */
		dates?: Array<string>;
		/** Three-letter currency code. */
		currency_code?: string;
	};
	'reports.bankReconciliationSummary': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Three-letter currency code. */
		currency_code?: string;
		/** Reconciliation date, YYYY-MM-DD. */
		date?: string;
		/** The bank account id. */
		bank_accountid?: string;
	};
	'reports.download': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The download token. */
		downloadToken: string | number;
		/** The file name. */
		fileName: string | number;
	};
	'reports.expenseDetails': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
	};
	'reports.invoiceDetails': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Only these client ids. */
		clientids?: Array<string>;
		/** Ask for a CSV download token instead of JSON (see reports.download). */
		download_token?: string;
	};
	'reports.itemSales': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Only this client id. */
		clientids?: string;
		/** Only this item name. */
		item_names?: string;
		/** Invoice status (paid, unpaid...). */
		statusids?: string;
	};
	'reports.paymentsCollected': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Only these client ids. */
		clientids?: Array<string>;
	};
	'reports.profitLossEntity': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Column period: m (month), q (quarter) or y (year). */
		resolution?: string;
		/** Cash basis instead of accrual. */
		cash_based?: boolean;
	};
	'reports.revenueByClient': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** collected or invoiced. */
		sales_type?: string;
	};
	'reports.taxSummary': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
		/** Cash basis instead of accrual. */
		cash_based?: boolean;
	};
	'reports.trialBalance': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Start of the period, YYYY-MM-DD. */
		start_date?: string;
		/** End of the period, YYYY-MM-DD. */
		end_date?: string;
		/** Three-letter currency code (for example USD). */
		currency_code?: string;
	};
	'retainers.create': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The retainer fields (FreshBooks wraps every body in its resource name). */
		retainer: {
			[key: string]: FreshBooksJsonValue | undefined;
			client_user_id?: FreshBooksJsonValue;
			start_date?: FreshBooksJsonValue;
			next_period_start_date?: FreshBooksJsonValue;
			fee?: FreshBooksJsonValue;
			excess_rate?: FreshBooksJsonValue;
			budgeted_time?: FreshBooksJsonValue;
			active?: FreshBooksJsonValue;
			frequency?: FreshBooksJsonValue;
			number_recurring?: FreshBooksJsonValue;
			is_infinitely_recurring?: FreshBooksJsonValue;
		};
	};
	'retainers.delete': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The retainer id. */
		retainerId: string | number;
	};
	'retainers.get': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The retainer id. */
		retainerId: string | number;
	};
	'retainers.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
	};
	'retainers.undelete': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The retainer id. */
		retainerId: string | number;
	};
	'retainers.update': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The retainer id. */
		retainerId: string | number;
		/** The retainer fields (FreshBooks wraps every body in its resource name). */
		retainer: {
			[key: string]: FreshBooksJsonValue | undefined;
			client_user_id?: FreshBooksJsonValue;
			start_date?: FreshBooksJsonValue;
			next_period_start_date?: FreshBooksJsonValue;
			fee?: FreshBooksJsonValue;
			excess_rate?: FreshBooksJsonValue;
			budgeted_time?: FreshBooksJsonValue;
			active?: FreshBooksJsonValue;
			frequency?: FreshBooksJsonValue;
			number_recurring?: FreshBooksJsonValue;
			is_infinitely_recurring?: FreshBooksJsonValue;
		};
	};
	'serviceRates.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
	};
	'services.create': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The service fields (FreshBooks wraps every body in its resource name). */
		service: Record<string, FreshBooksJsonValue>;
	};
	'services.createRate': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The service id. */
		serviceId: string | number;
		/** The service rate fields (FreshBooks wraps every body in its resource name). */
		service_rate: Record<string, FreshBooksJsonValue>;
	};
	'services.get': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The service id. */
		serviceId: string | number;
	};
	'services.getRate': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The service id. */
		serviceId: string | number;
	};
	'services.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Include the accounting task_id of each service. */
		include_task_id?: boolean;
	};
	'services.updateRate': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The service id. */
		serviceId: string | number;
		/** The service rate fields (FreshBooks wraps every body in its resource name). */
		service_rate: Record<string, FreshBooksJsonValue>;
	};
	'staff.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The staff id. */
		staffId: string | number;
	};
	'staff.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The staff id. */
		staffId: string | number;
	};
	'staff.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'staff.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The staff id. */
		staffId: string | number;
		/** The staff fields (FreshBooks wraps every body in its resource name). */
		staff: {
			[key: string]: FreshBooksJsonValue | undefined;
			fname?: FreshBooksJsonValue;
		};
	};
	'systems.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The system id. */
		systemId: string | number;
	};
	'tasks.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include: projects (List of Projects that contain the task) */
		include?: Array<'projects'>;
		/** The task fields (FreshBooks wraps every body in its resource name). */
		task: {
			[key: string]: FreshBooksJsonValue | undefined;
			name?: FreshBooksJsonValue;
			description?: FreshBooksJsonValue;
			rate?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
		};
	};
	'tasks.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The task id. */
		taskId: string | number;
	};
	'tasks.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The task id. */
		taskId: string | number;
		/** Extra data to include: projects (List of Projects that contain the task) */
		include?: Array<'projects'>;
	};
	'tasks.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Extra data to include: projects (List of Projects that contain the task) */
		include?: Array<'projects'>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'tasks.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The task id. */
		taskId: string | number;
		/** Extra data to include: projects (List of Projects that contain the task) */
		include?: Array<'projects'>;
		/** The task fields (FreshBooks wraps every body in its resource name). */
		task: {
			[key: string]: FreshBooksJsonValue | undefined;
			name?: FreshBooksJsonValue;
			rate?: {
				[key: string]: FreshBooksJsonValue | undefined;
				amount?: FreshBooksJsonValue;
				code?: FreshBooksJsonValue;
			};
		};
	};
	'taxes.create': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The tax fields (FreshBooks wraps every body in its resource name). */
		tax: {
			[key: string]: FreshBooksJsonValue | undefined;
			name?: FreshBooksJsonValue;
		};
	};
	'taxes.delete': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The tax id. */
		taxId: string | number;
	};
	'taxes.get': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The tax id. */
		taxId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
	};
	'taxes.list': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** Search filters, sent as search[<name>]=<value>. */
		search?: Record<string, FreshBooksJsonValue>;
		/** Sort field, `<field>_asc` or `<field>_desc`. */
		sort?: string;
	};
	'taxes.update': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The tax id. */
		taxId: string | number;
		/** Extra data to include (see the list operation). */
		include?: Array<string>;
		/** The tax fields (FreshBooks wraps every body in its resource name). */
		tax: {
			[key: string]: FreshBooksJsonValue | undefined;
			name?: FreshBooksJsonValue;
		};
	};
	'teamMemberRates.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
	};
	'teamMemberRates.update': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The identity id. */
		identityId: string | number;
		/** The team member rate fields (FreshBooks wraps every body in its resource name). */
		team_member_rate: {
			[key: string]: FreshBooksJsonValue | undefined;
			identity_id?: FreshBooksJsonValue;
			rate?: FreshBooksJsonValue;
		};
	};
	'teamMembers.get': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The team member uuid. */
		teamMemberUuid: string | number;
	};
	'teamMembers.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** Only active (true) or inactive (false) team members. */
		active?: boolean;
	};
	'threadComments.create': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The thread id. */
		threadId: string | number;
		/** The comment fields (FreshBooks wraps every body in its resource name). */
		comment: {
			[key: string]: FreshBooksJsonValue | undefined;
			content?: FreshBooksJsonValue;
		};
	};
	'timeEntries.create': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The time entry fields (FreshBooks wraps every body in its resource name). */
		time_entry: {
			[key: string]: FreshBooksJsonValue | undefined;
			is_logged?: FreshBooksJsonValue;
			duration?: FreshBooksJsonValue;
			note?: FreshBooksJsonValue;
			started_at?: FreshBooksJsonValue;
			client_id?: FreshBooksJsonValue;
			project_id?: FreshBooksJsonValue;
			service_id?: FreshBooksJsonValue;
			identity_id?: FreshBooksJsonValue;
		};
	};
	'timeEntries.delete': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The time entry id. */
		timeEntryId: string | number;
	};
	'timeEntries.get': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The time entry id. */
		timeEntryId: string | number;
	};
	'timeEntries.list': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** Page number. */
		page?: number;
		/** Results per page (default 15; FreshBooks caps every page at 100). */
		per_page?: number;
		/** True returns entries that can be automatically added to an invoice. */
		billable?: boolean;
		/** True returns entries that have already been added to an invoice. */
		billed?: boolean;
		/** Matches exact client id. */
		client_id?: string;
		/** True returns deleted time entries. */
		include_deleted?: boolean;
		/** True returns entries logged by all members of the business. */
		team?: boolean;
		/** True returns entries currently in progress for a running timer. */
		include_unlogged?: boolean;
		/** Matches entries that take place at or after the specified UTC date/time (ISO 8601, UTC). */
		started_from?: string;
		/** Matches entries that take place before or at the specified UTC date/time (ISO 8601, UTC). */
		started_to?: string;
		/** Matches entries that have been updated at or after the specified UTC date/time (ISO 8601, UTC). */
		updated_since?: string;
		/** Matches entries logged against a specific teammate or user. */
		identity_id?: string;
	};
	'timeEntries.search': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** Text to match (a person, client or project name). */
		q?: string;
		/** Sort, for example -started_at. */
		sort?: string;
		/** Entries at or after this UTC date/time. */
		started_from?: string;
		/** Entries at or before this UTC date/time. */
		started_to?: string;
	};
	'timeEntries.update': {
		/** The numeric business id. Left out, the plugin reads it from users.me (or the businessId option). */
		businessId?: string | number;
		/** The time entry id. */
		timeEntryId: string | number;
		/** The time entry fields (FreshBooks wraps every body in its resource name). */
		time_entry: {
			[key: string]: FreshBooksJsonValue | undefined;
			is_logged?: FreshBooksJsonValue;
			duration?: FreshBooksJsonValue;
			note?: FreshBooksJsonValue;
			started_at?: FreshBooksJsonValue;
			timer?: {
				[key: string]: FreshBooksJsonValue | undefined;
				id?: FreshBooksJsonValue;
			};
			client_id?: FreshBooksJsonValue;
			project_id?: FreshBooksJsonValue;
		};
	};
	'tokens.revoke': {
		/** The OAuth app's client id. */
		client_id: string;
		/** The OAuth app's client secret. */
		client_secret: string;
		/** The refresh token (or access token) to revoke. */
		token: string;
	};
	'uploads.attachment': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The file to upload (form field `content`). */
		content: FileInput;
	};
	'uploads.image': {
		/** The accounting account id (like LJArJ4). Left out, the plugin reads it from users.me (or the accountId option). */
		accountId?: string | number;
		/** The file to upload (form field `content`). */
		content: FileInput;
	};
	'uploads.publicImage': {
		/** The file to upload (form field `content`). */
		content: FileInput;
	};
	'users.me': Record<string, never>;
};

export type FreshBooksOperationOutputs = {
	'abilities.list': {
		abilities?: Array<{
			name?: FreshBooksJsonValue | null;
			value?: FreshBooksJsonValue | null;
		}> | null;
	};
	'accountGateways.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'accountGateways.list': Record<string, FreshBooksJsonValue>;
	'adjustmentJournalEntries.create': Record<string, FreshBooksJsonValue>;
	'adjustmentJournalEntries.list': Record<string, FreshBooksJsonValue>;
	'adjustmentJournalEntries.update': Record<string, FreshBooksJsonValue>;
	'applications.create': Record<string, FreshBooksJsonValue>;
	'applications.list': {
		id?: FreshBooksJsonValue | null;
		profile?: {
			setup_complete?: FreshBooksJsonValue | null;
			first_name?: FreshBooksJsonValue | null;
			last_name?: FreshBooksJsonValue | null;
			phone_number?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			professions?: Array<{
				id?: FreshBooksJsonValue | null;
				business_id?: FreshBooksJsonValue | null;
				title?: FreshBooksJsonValue | null;
				company?: FreshBooksJsonValue | null;
				designation?: FreshBooksJsonValue | null;
			}> | null;
		} | null;
		first_name?: FreshBooksJsonValue | null;
		last_name?: FreshBooksJsonValue | null;
		email?: FreshBooksJsonValue | null;
		language?: FreshBooksJsonValue | null;
		confirmed_at?: FreshBooksJsonValue | null;
		created_at?: FreshBooksJsonValue | null;
		unconfirmed_email?: FreshBooksJsonValue | null;
		setup_complete?: FreshBooksJsonValue | null;
		phone_numbers?: Array<{
			title?: FreshBooksJsonValue | null;
			phone_number?: FreshBooksJsonValue | null;
		}> | null;
		addresses?: Array<FreshBooksJsonValue> | null;
		profession?: {
			id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			title?: FreshBooksJsonValue | null;
			company?: FreshBooksJsonValue | null;
			designation?: FreshBooksJsonValue | null;
		} | null;
		links?: {
			me?: FreshBooksJsonValue | null;
			roles?: FreshBooksJsonValue | null;
		} | null;
		permissions?: {
			rAlTo?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'onboarding_checklist.access'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			E86QZ?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'quickbooks_integration.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'retainers.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			RmpKp?: {
				'client.limit'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			J9hAK?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'onboarding_checklist.access'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			gr1ndR?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			apwodA?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'quickbooks_integration.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			XgGiT?: {
				'client.limit'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
			} | null;
			'7lwxR'?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
			} | null;
			'4WMVg'?: {
				'client.limit'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			x34yX?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
			} | null;
			e1rYq?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			'3ErwB'?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			'8NppA'?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			j1412?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
			} | null;
			BRAVo?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			M1oaR?: {
				'client.limit'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			E4MaY?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			M1GeK?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			'7Po26'?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			ZaZdo?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			pPLMZ?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			EeCnZ?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			pe4MW?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			oN6yL?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			dowO0g?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			yA0R2P?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			LJZ1p3?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			wkMd2g?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			'3x42x2'?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			lWn0vG?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
		} | null;
		groups?: Array<{
			id?: FreshBooksJsonValue | null;
			group_id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
		}> | null;
		subscription_statuses?: {
			rALYo?: FreshBooksJsonValue | null;
			E86Qp?: FreshBooksJsonValue | null;
			RnPKp?: FreshBooksJsonValue | null;
			J7nAK?: FreshBooksJsonValue | null;
			gjndR?: FreshBooksJsonValue | null;
			apw1A?: FreshBooksJsonValue | null;
			'0XaOw'?: FreshBooksJsonValue | null;
			'7lwxr'?: FreshBooksJsonValue | null;
			'4VMVg'?: FreshBooksJsonValue | null;
			x33xX?: FreshBooksJsonValue | null;
			e1yRq?: FreshBooksJsonValue | null;
			'3eRwB'?: FreshBooksJsonValue | null;
			'8nPPA'?: FreshBooksJsonValue | null;
			j1322?: FreshBooksJsonValue | null;
			B3AVo?: FreshBooksJsonValue | null;
			M1OaR?: FreshBooksJsonValue | null;
			E3MAY?: FreshBooksJsonValue | null;
			M1GeK?: FreshBooksJsonValue | null;
			'7PO26'?: FreshBooksJsonValue | null;
			ZAZdo?: FreshBooksJsonValue | null;
			'0PJMZ'?: FreshBooksJsonValue | null;
			Ee0nZ?: FreshBooksJsonValue | null;
			pe6MW?: FreshBooksJsonValue | null;
			oM6yL?: FreshBooksJsonValue | null;
			dowQ0g?: FreshBooksJsonValue | null;
			yA0R2P?: FreshBooksJsonValue | null;
			LJZ1p4?: FreshBooksJsonValue | null;
			wkMd2g?: FreshBooksJsonValue | null;
			'3x62x2'?: FreshBooksJsonValue | null;
			lwy0vG?: FreshBooksJsonValue | null;
		} | null;
		integrations?: Record<string, FreshBooksJsonValue> | null;
		business_memberships?: Array<{
			id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			unacknowledged_change?: FreshBooksJsonValue | null;
			fasttrack_token?: FreshBooksJsonValue | null;
			business?: {
				id?: FreshBooksJsonValue | null;
				name?: FreshBooksJsonValue | null;
				account_id?: FreshBooksJsonValue | null;
				date_format?: FreshBooksJsonValue | null;
				address?: {
					id?: FreshBooksJsonValue | null;
					street?: FreshBooksJsonValue | null;
					city?: FreshBooksJsonValue | null;
					province?: FreshBooksJsonValue | null;
					country?: FreshBooksJsonValue | null;
					postal_code?: FreshBooksJsonValue | null;
				} | null;
				phone_number?: {
					id?: FreshBooksJsonValue | null;
					phone_number?: FreshBooksJsonValue | null;
				} | null;
				business_clients?: Array<{
					id?: FreshBooksJsonValue | null;
					business_id?: FreshBooksJsonValue | null;
					account_id?: FreshBooksJsonValue | null;
					userid?: FreshBooksJsonValue | null;
					client_business?: {
						business_id?: FreshBooksJsonValue | null;
					} | null;
					account_business?: {
						account_business_id?: FreshBooksJsonValue | null;
						account_id?: FreshBooksJsonValue | null;
					} | null;
				}> | null;
			} | null;
		}> | null;
		identity_origin?: FreshBooksJsonValue | null;
		roles?: Array<{
			id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			systemid?: FreshBooksJsonValue | null;
			userid?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			links?: {
				destroy?: FreshBooksJsonValue | null;
			} | null;
			accountid?: FreshBooksJsonValue | null;
		}> | null;
	};
	'applications.update': Record<string, FreshBooksJsonValue>;
	'billPayments.create': {
		bill_payment?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			billid?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			matched_with_expense?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			paid_date?: FreshBooksJsonValue | null;
			payment_type?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'billPayments.delete':
		| {
				bill_payment?: {
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					billid?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					matched_with_expense?: FreshBooksJsonValue | null;
					note?: FreshBooksJsonValue | null;
					paid_date?: FreshBooksJsonValue | null;
					payment_type?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'billPayments.get': {
		bill_payment?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			billid?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			matched_with_expense?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			paid_date?: FreshBooksJsonValue | null;
			payment_type?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'billPayments.list': {
		bill_payments?: Array<{
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			billid?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			matched_with_expense?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			paid_date?: FreshBooksJsonValue | null;
			payment_type?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'billPayments.update': {
		bill_payment?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			billid?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			matched_with_expense?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			paid_date?: FreshBooksJsonValue | null;
			payment_type?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'billVendors.create': {
		bill_vendor?: {
			account_number?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			is_1099?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			outstanding_balance?: Array<FreshBooksJsonValue> | null;
			overdue_balance?: Array<FreshBooksJsonValue> | null;
			phone?: FreshBooksJsonValue | null;
			postal_code?: FreshBooksJsonValue | null;
			primary_contact_email?: FreshBooksJsonValue | null;
			primary_contact_first_name?: FreshBooksJsonValue | null;
			primary_contact_last_name?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			tax_defaults?: Array<FreshBooksJsonValue> | null;
			updated_at?: FreshBooksJsonValue | null;
			vendor_name?: FreshBooksJsonValue | null;
			vendorid?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			website?: FreshBooksJsonValue | null;
		} | null;
	};
	'billVendors.delete':
		| {
				bill_vendor?: {
					account_number?: FreshBooksJsonValue | null;
					city?: FreshBooksJsonValue | null;
					country?: FreshBooksJsonValue | null;
					created_at?: FreshBooksJsonValue | null;
					currency_code?: FreshBooksJsonValue | null;
					is_1099?: FreshBooksJsonValue | null;
					language?: FreshBooksJsonValue | null;
					outstanding_balance?: Array<FreshBooksJsonValue> | null;
					overdue_balance?: Array<FreshBooksJsonValue> | null;
					phone?: FreshBooksJsonValue | null;
					postal_code?: FreshBooksJsonValue | null;
					primary_contact_email?: FreshBooksJsonValue | null;
					primary_contact_first_name?: FreshBooksJsonValue | null;
					primary_contact_last_name?: FreshBooksJsonValue | null;
					province?: FreshBooksJsonValue | null;
					street?: FreshBooksJsonValue | null;
					street2?: FreshBooksJsonValue | null;
					tax_defaults?: Array<FreshBooksJsonValue> | null;
					updated_at?: FreshBooksJsonValue | null;
					vendor_name?: FreshBooksJsonValue | null;
					vendorid?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
					website?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'billVendors.get': {
		bill_vendor?: {
			account_number?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			is_1099?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			outstanding_balance?: Array<{
				amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			overdue_balance?: Array<FreshBooksJsonValue> | null;
			phone?: FreshBooksJsonValue | null;
			postal_code?: FreshBooksJsonValue | null;
			primary_contact_email?: FreshBooksJsonValue | null;
			primary_contact_first_name?: FreshBooksJsonValue | null;
			primary_contact_last_name?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			tax_defaults?: Array<FreshBooksJsonValue> | null;
			updated_at?: FreshBooksJsonValue | null;
			vendor_name?: FreshBooksJsonValue | null;
			vendorid?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			website?: FreshBooksJsonValue | null;
		} | null;
	};
	'billVendors.list': {
		bill_vendors?: Array<{
			account_number?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			is_1099?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			outstanding_balance?: Array<{
				amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			overdue_balance?: Array<FreshBooksJsonValue> | null;
			phone?: FreshBooksJsonValue | null;
			postal_code?: FreshBooksJsonValue | null;
			primary_contact_email?: FreshBooksJsonValue | null;
			primary_contact_first_name?: FreshBooksJsonValue | null;
			primary_contact_last_name?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			tax_defaults?: Array<FreshBooksJsonValue> | null;
			updated_at?: FreshBooksJsonValue | null;
			vendor_name?: FreshBooksJsonValue | null;
			vendorid?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			website?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'billVendors.update': {
		bill_vendor?: {
			account_number?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			is_1099?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			outstanding_balance?: Array<{
				amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			overdue_balance?: Array<FreshBooksJsonValue> | null;
			phone?: FreshBooksJsonValue | null;
			postal_code?: FreshBooksJsonValue | null;
			primary_contact_email?: FreshBooksJsonValue | null;
			primary_contact_first_name?: FreshBooksJsonValue | null;
			primary_contact_last_name?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			tax_defaults?: Array<FreshBooksJsonValue> | null;
			updated_at?: FreshBooksJsonValue | null;
			vendor_name?: FreshBooksJsonValue | null;
			vendorid?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			website?: FreshBooksJsonValue | null;
		} | null;
	};
	'bills.archive': {
		bill?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			attachment?: FreshBooksJsonValue | null;
			bill_number?: FreshBooksJsonValue | null;
			bill_payments?: Array<FreshBooksJsonValue> | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			issue_date?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lines?: Array<{
				amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				category?: {
					category?: FreshBooksJsonValue | null;
					categoryid?: FreshBooksJsonValue | null;
					created_at?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					is_cogs?: FreshBooksJsonValue | null;
					is_editable?: FreshBooksJsonValue | null;
					parentid?: FreshBooksJsonValue | null;
					updated_at?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
				description?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				list_index?: FreshBooksJsonValue | null;
				quantity?: FreshBooksJsonValue | null;
				tax_amount1?: FreshBooksJsonValue | null;
				tax_amount2?: FreshBooksJsonValue | null;
				tax_authorityid1?: FreshBooksJsonValue | null;
				tax_authorityid2?: FreshBooksJsonValue | null;
				tax_name1?: FreshBooksJsonValue | null;
				tax_name2?: FreshBooksJsonValue | null;
				tax_percent1?: FreshBooksJsonValue | null;
				tax_percent2?: FreshBooksJsonValue | null;
				total_amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				unit_cost?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			overall_category?: FreshBooksJsonValue | null;
			overall_description?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			status?: FreshBooksJsonValue | null;
			tax_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			total_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'bills.create': {
		bill?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			attachment?: FreshBooksJsonValue | null;
			bill_number?: FreshBooksJsonValue | null;
			bill_payments?: Array<FreshBooksJsonValue> | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			issue_date?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lines?: Array<{
				amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				category?: {
					category?: FreshBooksJsonValue | null;
					categoryid?: FreshBooksJsonValue | null;
					created_at?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					is_cogs?: FreshBooksJsonValue | null;
					is_editable?: FreshBooksJsonValue | null;
					parentid?: FreshBooksJsonValue | null;
					updated_at?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
				description?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				list_index?: FreshBooksJsonValue | null;
				quantity?: FreshBooksJsonValue | null;
				tax_amount1?: FreshBooksJsonValue | null;
				tax_amount2?: FreshBooksJsonValue | null;
				tax_authorityid1?: FreshBooksJsonValue | null;
				tax_authorityid2?: FreshBooksJsonValue | null;
				tax_name1?: FreshBooksJsonValue | null;
				tax_name2?: FreshBooksJsonValue | null;
				tax_percent1?: FreshBooksJsonValue | null;
				tax_percent2?: FreshBooksJsonValue | null;
				total_amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				unit_cost?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			overall_category?: FreshBooksJsonValue | null;
			overall_description?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			status?: FreshBooksJsonValue | null;
			tax_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			total_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'bills.delete':
		| {
				bill?: {
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					attachment?: FreshBooksJsonValue | null;
					bill_number?: FreshBooksJsonValue | null;
					bill_payments?: Array<FreshBooksJsonValue> | null;
					created_at?: FreshBooksJsonValue | null;
					currency_code?: FreshBooksJsonValue | null;
					due_date?: FreshBooksJsonValue | null;
					due_offset_days?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					issue_date?: FreshBooksJsonValue | null;
					language?: FreshBooksJsonValue | null;
					lines?: Array<{
						amount?: {
							amount?: FreshBooksJsonValue | null;
							code?: FreshBooksJsonValue | null;
						} | null;
						category?: {
							category?: FreshBooksJsonValue | null;
							categoryid?: FreshBooksJsonValue | null;
							created_at?: FreshBooksJsonValue | null;
							id?: FreshBooksJsonValue | null;
							is_cogs?: FreshBooksJsonValue | null;
							is_editable?: FreshBooksJsonValue | null;
							parentid?: FreshBooksJsonValue | null;
							updated_at?: FreshBooksJsonValue | null;
							vis_state?: FreshBooksJsonValue | null;
						} | null;
						description?: FreshBooksJsonValue | null;
						id?: FreshBooksJsonValue | null;
						list_index?: FreshBooksJsonValue | null;
						quantity?: FreshBooksJsonValue | null;
						tax_amount1?: FreshBooksJsonValue | null;
						tax_amount2?: FreshBooksJsonValue | null;
						tax_authorityid1?: FreshBooksJsonValue | null;
						tax_authorityid2?: FreshBooksJsonValue | null;
						tax_name1?: FreshBooksJsonValue | null;
						tax_name2?: FreshBooksJsonValue | null;
						tax_percent1?: FreshBooksJsonValue | null;
						tax_percent2?: FreshBooksJsonValue | null;
						total_amount?: {
							amount?: FreshBooksJsonValue | null;
							code?: FreshBooksJsonValue | null;
						} | null;
						unit_cost?: {
							amount?: FreshBooksJsonValue | null;
							code?: FreshBooksJsonValue | null;
						} | null;
					}> | null;
					outstanding?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					overall_category?: FreshBooksJsonValue | null;
					overall_description?: FreshBooksJsonValue | null;
					paid?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					status?: FreshBooksJsonValue | null;
					tax_amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					total_amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					updated_at?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'bills.get': {
		bill?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			attachment?: FreshBooksJsonValue | null;
			bill_number?: FreshBooksJsonValue | null;
			bill_payments?: Array<FreshBooksJsonValue> | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			issue_date?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lines?: Array<{
				amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				category?: {
					category?: FreshBooksJsonValue | null;
					categoryid?: FreshBooksJsonValue | null;
					created_at?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					is_cogs?: FreshBooksJsonValue | null;
					is_editable?: FreshBooksJsonValue | null;
					parentid?: FreshBooksJsonValue | null;
					updated_at?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
				description?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				list_index?: FreshBooksJsonValue | null;
				quantity?: FreshBooksJsonValue | null;
				tax_amount1?: FreshBooksJsonValue | null;
				tax_amount2?: FreshBooksJsonValue | null;
				tax_authorityid1?: FreshBooksJsonValue | null;
				tax_authorityid2?: FreshBooksJsonValue | null;
				tax_name1?: FreshBooksJsonValue | null;
				tax_name2?: FreshBooksJsonValue | null;
				tax_percent1?: FreshBooksJsonValue | null;
				tax_percent2?: FreshBooksJsonValue | null;
				total_amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				unit_cost?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			overall_category?: FreshBooksJsonValue | null;
			overall_description?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			status?: FreshBooksJsonValue | null;
			tax_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			total_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'bills.list': {
		bill_vendors?: Array<{
			account_number?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			is_1099?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			outstanding_balance?: Array<{
				amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			overdue_balance?: Array<FreshBooksJsonValue> | null;
			phone?: FreshBooksJsonValue | null;
			postal_code?: FreshBooksJsonValue | null;
			primary_contact_email?: FreshBooksJsonValue | null;
			primary_contact_first_name?: FreshBooksJsonValue | null;
			primary_contact_last_name?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			tax_defaults?: Array<{
				amount?: FreshBooksJsonValue | null;
				created_at?: FreshBooksJsonValue | null;
				enabled?: FreshBooksJsonValue | null;
				name?: FreshBooksJsonValue | null;
				system_taxid?: FreshBooksJsonValue | null;
				tax_authorityid?: FreshBooksJsonValue | null;
				taxid?: FreshBooksJsonValue | null;
				updated_at?: FreshBooksJsonValue | null;
				vendorid?: FreshBooksJsonValue | null;
			}> | null;
			updated_at?: FreshBooksJsonValue | null;
			vendor_name?: FreshBooksJsonValue | null;
			vendorid?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			website?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'bills.update': {
		bill?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			attachment?: FreshBooksJsonValue | null;
			bill_number?: FreshBooksJsonValue | null;
			bill_payments?: Array<FreshBooksJsonValue> | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			issue_date?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lines?: Array<{
				amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				category?: {
					category?: FreshBooksJsonValue | null;
					categoryid?: FreshBooksJsonValue | null;
					created_at?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					is_cogs?: FreshBooksJsonValue | null;
					is_editable?: FreshBooksJsonValue | null;
					parentid?: FreshBooksJsonValue | null;
					updated_at?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
				description?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				list_index?: FreshBooksJsonValue | null;
				quantity?: FreshBooksJsonValue | null;
				tax_amount1?: FreshBooksJsonValue | null;
				tax_amount2?: FreshBooksJsonValue | null;
				tax_authorityid1?: FreshBooksJsonValue | null;
				tax_authorityid2?: FreshBooksJsonValue | null;
				tax_name1?: FreshBooksJsonValue | null;
				tax_name2?: FreshBooksJsonValue | null;
				tax_percent1?: FreshBooksJsonValue | null;
				tax_percent2?: FreshBooksJsonValue | null;
				total_amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				unit_cost?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			overall_category?: FreshBooksJsonValue | null;
			overall_description?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			status?: FreshBooksJsonValue | null;
			tax_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			total_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'businesses.create': {
		id?: FreshBooksJsonValue | null;
		name?: FreshBooksJsonValue | null;
		account_id?: FreshBooksJsonValue | null;
		business_group?: {
			id?: FreshBooksJsonValue | null;
			category?: FreshBooksJsonValue | null;
			members?: Array<{
				id?: FreshBooksJsonValue | null;
				group_id?: FreshBooksJsonValue | null;
				role?: FreshBooksJsonValue | null;
				identity_id?: FreshBooksJsonValue | null;
				first_name?: FreshBooksJsonValue | null;
				last_name?: FreshBooksJsonValue | null;
				email?: FreshBooksJsonValue | null;
				company?: FreshBooksJsonValue | null;
				business_id?: FreshBooksJsonValue | null;
				unacknowledged_change?: FreshBooksJsonValue | null;
				active?: FreshBooksJsonValue | null;
			}> | null;
		} | null;
		date_format?: FreshBooksJsonValue | null;
		address?: {
			id?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			postal_code?: FreshBooksJsonValue | null;
		} | null;
		phone_number?: FreshBooksJsonValue | null;
		business_clients?: Array<FreshBooksJsonValue> | null;
	};
	'businesses.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'businesses.listUsers': {
		id?: FreshBooksJsonValue | null;
		name?: FreshBooksJsonValue | null;
		account_id?: FreshBooksJsonValue | null;
		business_group?: {
			id?: FreshBooksJsonValue | null;
			category?: FreshBooksJsonValue | null;
			members?: Array<{
				id?: FreshBooksJsonValue | null;
				group_id?: FreshBooksJsonValue | null;
				role?: FreshBooksJsonValue | null;
				identity_id?: FreshBooksJsonValue | null;
				first_name?: FreshBooksJsonValue | null;
				last_name?: FreshBooksJsonValue | null;
				email?: FreshBooksJsonValue | null;
				company?: FreshBooksJsonValue | null;
				business_id?: FreshBooksJsonValue | null;
				unacknowledged_change?: FreshBooksJsonValue | null;
				active?: FreshBooksJsonValue | null;
			}> | null;
		} | null;
		date_format?: FreshBooksJsonValue | null;
		address?: {
			id?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			postal_code?: FreshBooksJsonValue | null;
		} | null;
		phone_number?: FreshBooksJsonValue | null;
		business_clients?: Array<FreshBooksJsonValue> | null;
	};
	'callbacks.create': Record<string, FreshBooksJsonValue>;
	'callbacks.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'callbacks.get': Record<string, FreshBooksJsonValue>;
	'callbacks.list': {
		callbacks?: Array<FreshBooksJsonValue> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'callbacks.resendVerification': Record<string, FreshBooksJsonValue>;
	'callbacks.verify': Record<string, FreshBooksJsonValue>;
	'checkoutLinks.create': Record<string, FreshBooksJsonValue>;
	'checkoutLinks.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'checkoutLinks.setPaymentOptions': Record<string, FreshBooksJsonValue>;
	'checkoutLinks.update': Record<string, FreshBooksJsonValue>;
	'clients.create': {
		client?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			allow_late_fees?: FreshBooksJsonValue | null;
			allow_late_notifications?: FreshBooksJsonValue | null;
			bus_phone?: FreshBooksJsonValue | null;
			company_industry?: FreshBooksJsonValue | null;
			company_size?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			direct_link_token?: FreshBooksJsonValue | null;
			email?: FreshBooksJsonValue | null;
			fax?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			has_retainer?: FreshBooksJsonValue | null;
			home_phone?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_activity?: FreshBooksJsonValue | null;
			last_login?: FreshBooksJsonValue | null;
			level?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			mob_phone?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			notified?: FreshBooksJsonValue | null;
			num_logins?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			p_city?: FreshBooksJsonValue | null;
			p_code?: FreshBooksJsonValue | null;
			p_country?: FreshBooksJsonValue | null;
			p_province?: FreshBooksJsonValue | null;
			p_street?: FreshBooksJsonValue | null;
			p_street2?: FreshBooksJsonValue | null;
			pref_email?: FreshBooksJsonValue | null;
			pref_gmail?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			s_city?: FreshBooksJsonValue | null;
			s_code?: FreshBooksJsonValue | null;
			s_country?: FreshBooksJsonValue | null;
			s_province?: FreshBooksJsonValue | null;
			s_street?: FreshBooksJsonValue | null;
			s_street2?: FreshBooksJsonValue | null;
			signup_date?: FreshBooksJsonValue | null;
			statement_token?: FreshBooksJsonValue | null;
			subdomain?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			userid?: FreshBooksJsonValue | null;
			username?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'clients.delete':
		| {
				client?: {
					accounting_systemid?: FreshBooksJsonValue | null;
					allow_late_fees?: FreshBooksJsonValue | null;
					allow_late_notifications?: FreshBooksJsonValue | null;
					bus_phone?: FreshBooksJsonValue | null;
					company_industry?: FreshBooksJsonValue | null;
					company_size?: FreshBooksJsonValue | null;
					currency_code?: FreshBooksJsonValue | null;
					direct_link_token?: FreshBooksJsonValue | null;
					email?: FreshBooksJsonValue | null;
					fax?: FreshBooksJsonValue | null;
					fname?: FreshBooksJsonValue | null;
					has_retainer?: FreshBooksJsonValue | null;
					home_phone?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					language?: FreshBooksJsonValue | null;
					last_activity?: FreshBooksJsonValue | null;
					last_login?: FreshBooksJsonValue | null;
					level?: FreshBooksJsonValue | null;
					lname?: FreshBooksJsonValue | null;
					mob_phone?: FreshBooksJsonValue | null;
					note?: FreshBooksJsonValue | null;
					notified?: FreshBooksJsonValue | null;
					num_logins?: FreshBooksJsonValue | null;
					organization?: FreshBooksJsonValue | null;
					p_city?: FreshBooksJsonValue | null;
					p_code?: FreshBooksJsonValue | null;
					p_country?: FreshBooksJsonValue | null;
					p_province?: FreshBooksJsonValue | null;
					p_street?: FreshBooksJsonValue | null;
					p_street2?: FreshBooksJsonValue | null;
					pref_email?: FreshBooksJsonValue | null;
					pref_gmail?: FreshBooksJsonValue | null;
					retainer_id?: FreshBooksJsonValue | null;
					role?: FreshBooksJsonValue | null;
					s_city?: FreshBooksJsonValue | null;
					s_code?: FreshBooksJsonValue | null;
					s_country?: FreshBooksJsonValue | null;
					s_province?: FreshBooksJsonValue | null;
					s_street?: FreshBooksJsonValue | null;
					s_street2?: FreshBooksJsonValue | null;
					signup_date?: FreshBooksJsonValue | null;
					statement_token?: FreshBooksJsonValue | null;
					subdomain?: FreshBooksJsonValue | null;
					updated?: FreshBooksJsonValue | null;
					userid?: FreshBooksJsonValue | null;
					username?: FreshBooksJsonValue | null;
					vat_name?: FreshBooksJsonValue | null;
					vat_number?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'clients.get': {
		client?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			allow_late_fees?: FreshBooksJsonValue | null;
			allow_late_notifications?: FreshBooksJsonValue | null;
			bus_phone?: FreshBooksJsonValue | null;
			company_industry?: FreshBooksJsonValue | null;
			company_size?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			direct_link_token?: FreshBooksJsonValue | null;
			email?: FreshBooksJsonValue | null;
			fax?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			has_retainer?: FreshBooksJsonValue | null;
			home_phone?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_activity?: FreshBooksJsonValue | null;
			last_login?: FreshBooksJsonValue | null;
			level?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			mob_phone?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			notified?: FreshBooksJsonValue | null;
			num_logins?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			p_city?: FreshBooksJsonValue | null;
			p_code?: FreshBooksJsonValue | null;
			p_country?: FreshBooksJsonValue | null;
			p_province?: FreshBooksJsonValue | null;
			p_street?: FreshBooksJsonValue | null;
			p_street2?: FreshBooksJsonValue | null;
			pref_email?: FreshBooksJsonValue | null;
			pref_gmail?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			s_city?: FreshBooksJsonValue | null;
			s_code?: FreshBooksJsonValue | null;
			s_country?: FreshBooksJsonValue | null;
			s_province?: FreshBooksJsonValue | null;
			s_street?: FreshBooksJsonValue | null;
			s_street2?: FreshBooksJsonValue | null;
			signup_date?: FreshBooksJsonValue | null;
			statement_token?: FreshBooksJsonValue | null;
			subdomain?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			userid?: FreshBooksJsonValue | null;
			username?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'clients.list': {
		clients?: Array<{
			accounting_systemid?: FreshBooksJsonValue | null;
			allow_late_fees?: FreshBooksJsonValue | null;
			allow_late_notifications?: FreshBooksJsonValue | null;
			bus_phone?: FreshBooksJsonValue | null;
			company_industry?: FreshBooksJsonValue | null;
			company_size?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			direct_link_token?: FreshBooksJsonValue | null;
			email?: FreshBooksJsonValue | null;
			fax?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			has_retainer?: FreshBooksJsonValue | null;
			home_phone?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_activity?: FreshBooksJsonValue | null;
			last_login?: FreshBooksJsonValue | null;
			level?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			mob_phone?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			notified?: FreshBooksJsonValue | null;
			num_logins?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			p_city?: FreshBooksJsonValue | null;
			p_code?: FreshBooksJsonValue | null;
			p_country?: FreshBooksJsonValue | null;
			p_province?: FreshBooksJsonValue | null;
			p_street?: FreshBooksJsonValue | null;
			p_street2?: FreshBooksJsonValue | null;
			pref_email?: FreshBooksJsonValue | null;
			pref_gmail?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			s_city?: FreshBooksJsonValue | null;
			s_code?: FreshBooksJsonValue | null;
			s_country?: FreshBooksJsonValue | null;
			s_province?: FreshBooksJsonValue | null;
			s_street?: FreshBooksJsonValue | null;
			s_street2?: FreshBooksJsonValue | null;
			signup_date?: FreshBooksJsonValue | null;
			statement_token?: FreshBooksJsonValue | null;
			subdomain?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			userid?: FreshBooksJsonValue | null;
			username?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'clients.update': {
		client?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			allow_late_fees?: FreshBooksJsonValue | null;
			allow_late_notifications?: FreshBooksJsonValue | null;
			bus_phone?: FreshBooksJsonValue | null;
			company_industry?: FreshBooksJsonValue | null;
			company_size?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			direct_link_token?: FreshBooksJsonValue | null;
			email?: FreshBooksJsonValue | null;
			fax?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			has_retainer?: FreshBooksJsonValue | null;
			home_phone?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_activity?: FreshBooksJsonValue | null;
			last_login?: FreshBooksJsonValue | null;
			level?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			mob_phone?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			notified?: FreshBooksJsonValue | null;
			num_logins?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			p_city?: FreshBooksJsonValue | null;
			p_code?: FreshBooksJsonValue | null;
			p_country?: FreshBooksJsonValue | null;
			p_province?: FreshBooksJsonValue | null;
			p_street?: FreshBooksJsonValue | null;
			p_street2?: FreshBooksJsonValue | null;
			pref_email?: FreshBooksJsonValue | null;
			pref_gmail?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			s_city?: FreshBooksJsonValue | null;
			s_code?: FreshBooksJsonValue | null;
			s_country?: FreshBooksJsonValue | null;
			s_province?: FreshBooksJsonValue | null;
			s_street?: FreshBooksJsonValue | null;
			s_street2?: FreshBooksJsonValue | null;
			signup_date?: FreshBooksJsonValue | null;
			statement_token?: FreshBooksJsonValue | null;
			subdomain?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			userid?: FreshBooksJsonValue | null;
			username?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'contacts.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'contacts.update': Record<string, FreshBooksJsonValue>;
	'creditNotes.create': {
		credit_note?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			credit_number?: FreshBooksJsonValue | null;
			credit_type?: FreshBooksJsonValue | null;
			creditid?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			payment_status?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'creditNotes.delete':
		| {
				credit_note?: {
					accounting_systemid?: FreshBooksJsonValue | null;
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					city?: FreshBooksJsonValue | null;
					clientid?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
					country?: FreshBooksJsonValue | null;
					create_date?: FreshBooksJsonValue | null;
					credit_number?: FreshBooksJsonValue | null;
					credit_type?: FreshBooksJsonValue | null;
					creditid?: FreshBooksJsonValue | null;
					currency_code?: FreshBooksJsonValue | null;
					current_organization?: FreshBooksJsonValue | null;
					description?: FreshBooksJsonValue | null;
					display_status?: FreshBooksJsonValue | null;
					dispute_status?: FreshBooksJsonValue | null;
					ext_archive?: FreshBooksJsonValue | null;
					fname?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					language?: FreshBooksJsonValue | null;
					last_order_status?: FreshBooksJsonValue | null;
					lname?: FreshBooksJsonValue | null;
					notes?: FreshBooksJsonValue | null;
					organization?: FreshBooksJsonValue | null;
					paid?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					payment_status?: FreshBooksJsonValue | null;
					province?: FreshBooksJsonValue | null;
					sentid?: FreshBooksJsonValue | null;
					status?: FreshBooksJsonValue | null;
					street?: FreshBooksJsonValue | null;
					street2?: FreshBooksJsonValue | null;
					template?: FreshBooksJsonValue | null;
					terms?: FreshBooksJsonValue | null;
					vat_name?: FreshBooksJsonValue | null;
					vat_number?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'creditNotes.get': {
		credit_note?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			credit_number?: FreshBooksJsonValue | null;
			credit_type?: FreshBooksJsonValue | null;
			creditid?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			payment_status?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'creditNotes.list': {
		credit_notes?: Array<{
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			credit_number?: FreshBooksJsonValue | null;
			credit_type?: FreshBooksJsonValue | null;
			creditid?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			payment_status?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'creditNotes.update': {
		credit_note?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			credit_number?: FreshBooksJsonValue | null;
			credit_type?: FreshBooksJsonValue | null;
			creditid?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			payment_status?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'estimates.accept': {
		estimate?: {
			accepted?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			estimate_number?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiced?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			reply_status?: FreshBooksJsonValue | null;
			require_client_signature?: FreshBooksJsonValue | null;
			rich_proposal?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			ui_status?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'estimates.create': {
		estimate?: {
			accepted?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			estimate_number?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiced?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			reply_status?: FreshBooksJsonValue | null;
			require_client_signature?: FreshBooksJsonValue | null;
			rich_proposal?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			ui_status?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'estimates.delete':
		| {
				estimate?: {
					accepted?: FreshBooksJsonValue | null;
					accounting_systemid?: FreshBooksJsonValue | null;
					address?: FreshBooksJsonValue | null;
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					city?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
					country?: FreshBooksJsonValue | null;
					create_date?: FreshBooksJsonValue | null;
					created_at?: FreshBooksJsonValue | null;
					currency_code?: FreshBooksJsonValue | null;
					current_organization?: FreshBooksJsonValue | null;
					customerid?: FreshBooksJsonValue | null;
					description?: FreshBooksJsonValue | null;
					discount_total?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					discount_value?: FreshBooksJsonValue | null;
					display_status?: FreshBooksJsonValue | null;
					estimate_number?: FreshBooksJsonValue | null;
					estimateid?: FreshBooksJsonValue | null;
					ext_archive?: FreshBooksJsonValue | null;
					fname?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					invoiced?: FreshBooksJsonValue | null;
					language?: FreshBooksJsonValue | null;
					lname?: FreshBooksJsonValue | null;
					notes?: FreshBooksJsonValue | null;
					organization?: FreshBooksJsonValue | null;
					ownerid?: FreshBooksJsonValue | null;
					po_number?: FreshBooksJsonValue | null;
					province?: FreshBooksJsonValue | null;
					reply_status?: FreshBooksJsonValue | null;
					require_client_signature?: FreshBooksJsonValue | null;
					rich_proposal?: FreshBooksJsonValue | null;
					sentid?: FreshBooksJsonValue | null;
					status?: FreshBooksJsonValue | null;
					street?: FreshBooksJsonValue | null;
					street2?: FreshBooksJsonValue | null;
					template?: FreshBooksJsonValue | null;
					terms?: FreshBooksJsonValue | null;
					ui_status?: FreshBooksJsonValue | null;
					updated?: FreshBooksJsonValue | null;
					vat_name?: FreshBooksJsonValue | null;
					vat_number?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'estimates.get': {
		estimate?: {
			accepted?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			estimate_number?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiced?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			reply_status?: FreshBooksJsonValue | null;
			require_client_signature?: FreshBooksJsonValue | null;
			rich_proposal?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			ui_status?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'estimates.list': {
		estimates?: Array<{
			accepted?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			estimate_number?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiced?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			reply_status?: FreshBooksJsonValue | null;
			require_client_signature?: FreshBooksJsonValue | null;
			rich_proposal?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			ui_status?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'estimates.markSent': {
		estimate?: {
			accepted?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			estimate_number?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiced?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			reply_status?: FreshBooksJsonValue | null;
			require_client_signature?: FreshBooksJsonValue | null;
			rich_proposal?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			ui_status?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'estimates.sendEmail': {
		estimate?: {
			accepted?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			estimate_number?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiced?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			reply_status?: FreshBooksJsonValue | null;
			require_client_signature?: FreshBooksJsonValue | null;
			rich_proposal?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			ui_status?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'estimates.update': {
		estimate?: {
			accepted?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			estimate_number?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiced?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			reply_status?: FreshBooksJsonValue | null;
			require_client_signature?: FreshBooksJsonValue | null;
			rich_proposal?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			ui_status?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'expenseCategories.create': {
		category?: {
			category?: FreshBooksJsonValue | null;
			categoryid?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			is_cogs?: FreshBooksJsonValue | null;
			is_editable?: FreshBooksJsonValue | null;
			parentid?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'expenseCategories.get': {
		category?: {
			category?: FreshBooksJsonValue | null;
			categoryid?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			is_cogs?: FreshBooksJsonValue | null;
			is_editable?: FreshBooksJsonValue | null;
			parentid?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'expenseCategories.list': {
		categories?: Array<{
			category?: FreshBooksJsonValue | null;
			categoryid?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			is_cogs?: FreshBooksJsonValue | null;
			is_editable?: FreshBooksJsonValue | null;
			parentid?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'expenseProfiles.create': Record<string, FreshBooksJsonValue>;
	'expenses.create': {
		expense?: {
			account_name?: FreshBooksJsonValue | null;
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			attachment?: {
				attachmentid?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				jwt?: FreshBooksJsonValue | null;
				media_type?: FreshBooksJsonValue | null;
			} | null;
			background_jobid?: FreshBooksJsonValue | null;
			bank_name?: FreshBooksJsonValue | null;
			categoryid?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			compounded_tax?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			expenseid?: FreshBooksJsonValue | null;
			ext_invoiceid?: FreshBooksJsonValue | null;
			ext_systemid?: FreshBooksJsonValue | null;
			from_bulk_import?: FreshBooksJsonValue | null;
			has_receipt?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_receipt?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			is_cogs?: FreshBooksJsonValue | null;
			isduplicate?: FreshBooksJsonValue | null;
			markup_percent?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			projectid?: FreshBooksJsonValue | null;
			staffid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			taxAmount1?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taxAmount2?: FreshBooksJsonValue | null;
			taxName1?: FreshBooksJsonValue | null;
			taxName2?: FreshBooksJsonValue | null;
			taxPercent1?: FreshBooksJsonValue | null;
			taxPercent2?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vendor?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'expenses.delete':
		| {
				expense?: {
					account_name?: FreshBooksJsonValue | null;
					accountid?: FreshBooksJsonValue | null;
					accounting_systemid?: FreshBooksJsonValue | null;
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					background_jobid?: FreshBooksJsonValue | null;
					bank_name?: FreshBooksJsonValue | null;
					categoryid?: FreshBooksJsonValue | null;
					clientid?: FreshBooksJsonValue | null;
					compounded_tax?: FreshBooksJsonValue | null;
					date?: FreshBooksJsonValue | null;
					expenseid?: FreshBooksJsonValue | null;
					ext_invoiceid?: FreshBooksJsonValue | null;
					ext_systemid?: FreshBooksJsonValue | null;
					from_bulk_import?: FreshBooksJsonValue | null;
					has_receipt?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					include_receipt?: FreshBooksJsonValue | null;
					invoiceid?: FreshBooksJsonValue | null;
					is_cogs?: FreshBooksJsonValue | null;
					isduplicate?: FreshBooksJsonValue | null;
					markup_percent?: FreshBooksJsonValue | null;
					notes?: FreshBooksJsonValue | null;
					profileid?: FreshBooksJsonValue | null;
					projectid?: FreshBooksJsonValue | null;
					staffid?: FreshBooksJsonValue | null;
					status?: FreshBooksJsonValue | null;
					taxAmount1?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					taxAmount2?: FreshBooksJsonValue | null;
					taxName1?: FreshBooksJsonValue | null;
					taxName2?: FreshBooksJsonValue | null;
					taxPercent1?: FreshBooksJsonValue | null;
					taxPercent2?: FreshBooksJsonValue | null;
					transactionid?: FreshBooksJsonValue | null;
					updated?: FreshBooksJsonValue | null;
					vendor?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'expenses.get': {
		expense?: {
			account_name?: FreshBooksJsonValue | null;
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			background_jobid?: FreshBooksJsonValue | null;
			bank_name?: FreshBooksJsonValue | null;
			categoryid?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			compounded_tax?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			expenseid?: FreshBooksJsonValue | null;
			ext_invoiceid?: FreshBooksJsonValue | null;
			ext_systemid?: FreshBooksJsonValue | null;
			from_bulk_import?: FreshBooksJsonValue | null;
			has_receipt?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_receipt?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			is_cogs?: FreshBooksJsonValue | null;
			isduplicate?: FreshBooksJsonValue | null;
			markup_percent?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			projectid?: FreshBooksJsonValue | null;
			staffid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			taxAmount1?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taxAmount2?: FreshBooksJsonValue | null;
			taxName1?: FreshBooksJsonValue | null;
			taxName2?: FreshBooksJsonValue | null;
			taxPercent1?: FreshBooksJsonValue | null;
			taxPercent2?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vendor?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'expenses.list': {
		expenses?: Array<{
			account_name?: FreshBooksJsonValue | null;
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			attachment?: {
				attachmentid?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				jwt?: FreshBooksJsonValue | null;
				media_type?: FreshBooksJsonValue | null;
			} | null;
			background_jobid?: FreshBooksJsonValue | null;
			bank_name?: FreshBooksJsonValue | null;
			category?: {
				category?: FreshBooksJsonValue | null;
				categoryid?: FreshBooksJsonValue | null;
				created_at?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				is_cogs?: FreshBooksJsonValue | null;
				is_editable?: FreshBooksJsonValue | null;
				parentid?: FreshBooksJsonValue | null;
				updated_at?: FreshBooksJsonValue | null;
				vis_state?: FreshBooksJsonValue | null;
			} | null;
			categoryid?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			compounded_tax?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			expense_profile?: FreshBooksJsonValue | null;
			expenseid?: FreshBooksJsonValue | null;
			ext_invoiceid?: FreshBooksJsonValue | null;
			ext_systemid?: FreshBooksJsonValue | null;
			from_bulk_import?: FreshBooksJsonValue | null;
			has_receipt?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_receipt?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			is_cogs?: FreshBooksJsonValue | null;
			isduplicate?: FreshBooksJsonValue | null;
			markup_percent?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			project?: FreshBooksJsonValue | null;
			projectid?: FreshBooksJsonValue | null;
			staffid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			taxAmount1?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taxAmount2?: FreshBooksJsonValue | null;
			taxName1?: FreshBooksJsonValue | null;
			taxName2?: FreshBooksJsonValue | null;
			taxPercent1?: FreshBooksJsonValue | null;
			taxPercent2?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vendor?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'expenses.listVendors': {
		expense?: {
			account_name?: FreshBooksJsonValue | null;
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			background_jobid?: FreshBooksJsonValue | null;
			bank_name?: FreshBooksJsonValue | null;
			categoryid?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			compounded_tax?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			expenseid?: FreshBooksJsonValue | null;
			ext_invoiceid?: FreshBooksJsonValue | null;
			ext_systemid?: FreshBooksJsonValue | null;
			from_bulk_import?: FreshBooksJsonValue | null;
			has_receipt?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_receipt?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			is_cogs?: FreshBooksJsonValue | null;
			isduplicate?: FreshBooksJsonValue | null;
			markup_percent?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			projectid?: FreshBooksJsonValue | null;
			staffid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			taxAmount1?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taxAmount2?: FreshBooksJsonValue | null;
			taxName1?: FreshBooksJsonValue | null;
			taxName2?: FreshBooksJsonValue | null;
			taxPercent1?: FreshBooksJsonValue | null;
			taxPercent2?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vendor?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'expenses.summaries': {
		summaries?: Array<{
			amounts?: Array<{
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
				count?: FreshBooksJsonValue | null;
			}> | null;
			counts?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
		}> | null;
	};
	'expenses.update': {
		expense?: {
			account_name?: FreshBooksJsonValue | null;
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			background_jobid?: FreshBooksJsonValue | null;
			bank_name?: FreshBooksJsonValue | null;
			categoryid?: FreshBooksJsonValue | null;
			clientid?: FreshBooksJsonValue | null;
			compounded_tax?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			expenseid?: FreshBooksJsonValue | null;
			ext_invoiceid?: FreshBooksJsonValue | null;
			ext_systemid?: FreshBooksJsonValue | null;
			from_bulk_import?: FreshBooksJsonValue | null;
			has_receipt?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_receipt?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			is_cogs?: FreshBooksJsonValue | null;
			isduplicate?: FreshBooksJsonValue | null;
			markup_percent?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			projectid?: FreshBooksJsonValue | null;
			staffid?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			taxAmount1?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taxAmount2?: FreshBooksJsonValue | null;
			taxName1?: FreshBooksJsonValue | null;
			taxName2?: FreshBooksJsonValue | null;
			taxPercent1?: FreshBooksJsonValue | null;
			taxPercent2?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vendor?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'gateways.get': {
		gateway_connections?: Array<{
			stripe?: {
				currencies?: Array<FreshBooksJsonValue> | null;
				country?: FreshBooksJsonValue | null;
				gateway_user_id?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				user_state?: FreshBooksJsonValue | null;
				email?: FreshBooksJsonValue | null;
			} | null;
			fbpay?: {
				currencies?: Array<FreshBooksJsonValue> | null;
				account_id?: FreshBooksJsonValue | null;
				action_reasons?: Array<FreshBooksJsonValue> | null;
				country?: FreshBooksJsonValue | null;
				tos_accepted?: FreshBooksJsonValue | null;
				email?: FreshBooksJsonValue | null;
				manage_account_url?: FreshBooksJsonValue | null;
				state?: FreshBooksJsonValue | null;
				bank_info?: {
					bank_name?: FreshBooksJsonValue | null;
					withdrawal_period?: FreshBooksJsonValue | null;
					last_payment_date?: FreshBooksJsonValue | null;
					withdrawal_schedule?: Array<FreshBooksJsonValue> | null;
					next_payout_date?: FreshBooksJsonValue | null;
					incoming_pending_amount?: FreshBooksJsonValue | null;
					last_payment_amount?: FreshBooksJsonValue | null;
					withdrawal_type?: FreshBooksJsonValue | null;
					outgoing_withdrawal_schedule?: Array<FreshBooksJsonValue> | null;
					total_payout?: FreshBooksJsonValue | null;
				} | null;
				pricing?: {
					ach_tier_3?: FreshBooksJsonValue | null;
					percent_amex?: FreshBooksJsonValue | null;
					percent_non_amex_with_card?: FreshBooksJsonValue | null;
					percent_non_amex?: FreshBooksJsonValue | null;
					percent_virtual_terminal?: FreshBooksJsonValue | null;
					percent_amex_with_card?: FreshBooksJsonValue | null;
					ach_tier_1?: FreshBooksJsonValue | null;
					ach_tier_2?: FreshBooksJsonValue | null;
					tier_id?: FreshBooksJsonValue | null;
					per_transaction_fee?: FreshBooksJsonValue | null;
				} | null;
				visa_debit_accepted?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				bank_transfer_enabled?: FreshBooksJsonValue | null;
			} | null;
		}> | null;
	};
	'gateways.provisionFreshBooksPayments': Record<string, FreshBooksJsonValue>;
	'invitationRates.list': {
		invitation_rates?: Array<FreshBooksJsonValue> | null;
	};
	'invitations.create': Record<string, FreshBooksJsonValue>;
	'invoicePaymentOptions.create': Record<string, FreshBooksJsonValue>;
	'invoicePaymentOptions.get': Record<string, FreshBooksJsonValue>;
	'invoiceProfilePaymentOptions.create': Record<string, FreshBooksJsonValue>;
	'invoiceProfiles.create': {
		invoice_profile?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			bill_gateway?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			disable?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			frequency?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_unbilled_time?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			numberRecurring?: FreshBooksJsonValue | null;
			occurrences_to_date?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			require_auto_bill?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			send_email?: FreshBooksJsonValue | null;
			send_gmail?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			total_accrued_revenue?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'invoiceProfiles.delete':
		| {
				invoice_profile?: {
					accounting_systemid?: FreshBooksJsonValue | null;
					address?: FreshBooksJsonValue | null;
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					auto_bill?: FreshBooksJsonValue | null;
					bill_gateway?: FreshBooksJsonValue | null;
					city?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
					country?: FreshBooksJsonValue | null;
					create_date?: FreshBooksJsonValue | null;
					currency_code?: FreshBooksJsonValue | null;
					customerid?: FreshBooksJsonValue | null;
					description?: FreshBooksJsonValue | null;
					disable?: FreshBooksJsonValue | null;
					discount_total?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					discount_value?: FreshBooksJsonValue | null;
					due_offset_days?: FreshBooksJsonValue | null;
					ext_archive?: FreshBooksJsonValue | null;
					fname?: FreshBooksJsonValue | null;
					frequency?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					include_unbilled_time?: FreshBooksJsonValue | null;
					language?: FreshBooksJsonValue | null;
					lname?: FreshBooksJsonValue | null;
					notes?: FreshBooksJsonValue | null;
					numberRecurring?: FreshBooksJsonValue | null;
					occurrences_to_date?: FreshBooksJsonValue | null;
					organization?: FreshBooksJsonValue | null;
					ownerid?: FreshBooksJsonValue | null;
					payment_details?: FreshBooksJsonValue | null;
					po_number?: FreshBooksJsonValue | null;
					profileid?: FreshBooksJsonValue | null;
					province?: FreshBooksJsonValue | null;
					require_auto_bill?: FreshBooksJsonValue | null;
					retainer_id?: FreshBooksJsonValue | null;
					send_email?: FreshBooksJsonValue | null;
					send_gmail?: FreshBooksJsonValue | null;
					street?: FreshBooksJsonValue | null;
					street2?: FreshBooksJsonValue | null;
					terms?: FreshBooksJsonValue | null;
					total_accrued_revenue?: FreshBooksJsonValue | null;
					updated?: FreshBooksJsonValue | null;
					vat_name?: FreshBooksJsonValue | null;
					vat_number?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'invoiceProfiles.get': {
		invoice_profile?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			bill_gateway?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			disable?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			frequency?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_unbilled_time?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			numberRecurring?: FreshBooksJsonValue | null;
			occurrences_to_date?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			require_auto_bill?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			send_email?: FreshBooksJsonValue | null;
			send_gmail?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			total_accrued_revenue?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'invoiceProfiles.list': {
		invoice_profiles?: Array<{
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			bill_gateway?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			disable?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			frequency?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_unbilled_time?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			numberRecurring?: FreshBooksJsonValue | null;
			occurrences_to_date?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			require_auto_bill?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			send_email?: FreshBooksJsonValue | null;
			send_gmail?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			total_accrued_revenue?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'invoiceProfiles.update': {
		invoice_profile?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			bill_gateway?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			disable?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			frequency?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			include_unbilled_time?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			numberRecurring?: FreshBooksJsonValue | null;
			occurrences_to_date?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			ownerid?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			profileid?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			require_auto_bill?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			send_email?: FreshBooksJsonValue | null;
			send_gmail?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			total_accrued_revenue?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'invoices.create': {
		invoice?: {
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			autobill_status?: FreshBooksJsonValue | null;
			basecampid?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			date_paid?: FreshBooksJsonValue | null;
			deposit_amount?: FreshBooksJsonValue | null;
			deposit_percentage?: FreshBooksJsonValue | null;
			deposit_status?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			fulfillment_date?: FreshBooksJsonValue | null;
			generation_date?: FreshBooksJsonValue | null;
			gmail?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoice_number?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			ownerid?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			parent?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			payment_status?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			return_uri?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			show_attachments?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			v3_status?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'invoices.delete':
		| {
				invoice?: {
					accountid?: FreshBooksJsonValue | null;
					accounting_systemid?: FreshBooksJsonValue | null;
					address?: FreshBooksJsonValue | null;
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					auto_bill?: FreshBooksJsonValue | null;
					autobill_status?: FreshBooksJsonValue | null;
					basecampid?: FreshBooksJsonValue | null;
					city?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
					country?: FreshBooksJsonValue | null;
					create_date?: FreshBooksJsonValue | null;
					created_at?: FreshBooksJsonValue | null;
					currency_code?: FreshBooksJsonValue | null;
					current_organization?: FreshBooksJsonValue | null;
					customerid?: FreshBooksJsonValue | null;
					date_paid?: FreshBooksJsonValue | null;
					deposit_amount?: FreshBooksJsonValue | null;
					deposit_percentage?: FreshBooksJsonValue | null;
					deposit_status?: FreshBooksJsonValue | null;
					description?: FreshBooksJsonValue | null;
					discount_description?: FreshBooksJsonValue | null;
					discount_total?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					discount_value?: FreshBooksJsonValue | null;
					display_status?: FreshBooksJsonValue | null;
					dispute_status?: FreshBooksJsonValue | null;
					due_date?: FreshBooksJsonValue | null;
					due_offset_days?: FreshBooksJsonValue | null;
					estimateid?: FreshBooksJsonValue | null;
					ext_archive?: FreshBooksJsonValue | null;
					fname?: FreshBooksJsonValue | null;
					fulfillment_date?: FreshBooksJsonValue | null;
					generation_date?: FreshBooksJsonValue | null;
					gmail?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					invoice_number?: FreshBooksJsonValue | null;
					invoiceid?: FreshBooksJsonValue | null;
					language?: FreshBooksJsonValue | null;
					last_order_status?: FreshBooksJsonValue | null;
					lname?: FreshBooksJsonValue | null;
					notes?: FreshBooksJsonValue | null;
					organization?: FreshBooksJsonValue | null;
					outstanding?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					ownerid?: FreshBooksJsonValue | null;
					paid?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					parent?: FreshBooksJsonValue | null;
					payment_details?: FreshBooksJsonValue | null;
					payment_status?: FreshBooksJsonValue | null;
					po_number?: FreshBooksJsonValue | null;
					province?: FreshBooksJsonValue | null;
					return_uri?: FreshBooksJsonValue | null;
					sentid?: FreshBooksJsonValue | null;
					show_attachments?: FreshBooksJsonValue | null;
					status?: FreshBooksJsonValue | null;
					street?: FreshBooksJsonValue | null;
					street2?: FreshBooksJsonValue | null;
					template?: FreshBooksJsonValue | null;
					terms?: FreshBooksJsonValue | null;
					updated?: FreshBooksJsonValue | null;
					v3_status?: FreshBooksJsonValue | null;
					vat_name?: FreshBooksJsonValue | null;
					vat_number?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'invoices.downloadPdf': FileOutput;
	'invoices.get': {
		invoice?: {
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			autobill_status?: FreshBooksJsonValue | null;
			basecampid?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			date_paid?: FreshBooksJsonValue | null;
			deposit_amount?: FreshBooksJsonValue | null;
			deposit_percentage?: FreshBooksJsonValue | null;
			deposit_status?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			fulfillment_date?: FreshBooksJsonValue | null;
			generation_date?: FreshBooksJsonValue | null;
			gmail?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoice_number?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			ownerid?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			parent?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			payment_status?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			return_uri?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			show_attachments?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			v3_status?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			presentation?: {
				date_format?: FreshBooksJsonValue | null;
				description_heading?: FreshBooksJsonValue | null;
				hours_heading?: FreshBooksJsonValue | null;
				image_banner_position_y?: FreshBooksJsonValue | null;
				image_banner_src?: FreshBooksJsonValue | null;
				image_logo_src?: FreshBooksJsonValue | null;
				invoiceid?: FreshBooksJsonValue | null;
				item_heading?: FreshBooksJsonValue | null;
				label?: FreshBooksJsonValue | null;
				quantity_heading?: FreshBooksJsonValue | null;
				rate_heading?: FreshBooksJsonValue | null;
				task_heading?: FreshBooksJsonValue | null;
				theme_font_name?: FreshBooksJsonValue | null;
				theme_layout?: FreshBooksJsonValue | null;
				theme_primary_color?: FreshBooksJsonValue | null;
				time_entry_notes_heading?: FreshBooksJsonValue | null;
				unit_cost_heading?: FreshBooksJsonValue | null;
			} | null;
		} | null;
	};
	'invoices.getShareLink': {
		share_link?: {
			clientid?: FreshBooksJsonValue | null;
			resource_type?: FreshBooksJsonValue | null;
			resourceid?: FreshBooksJsonValue | null;
			share_link?: FreshBooksJsonValue | null;
			share_method?: FreshBooksJsonValue | null;
		} | null;
	};
	'invoices.list': {
		invoices?: Array<{
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			autobill_status?: FreshBooksJsonValue | null;
			basecampid?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			date_paid?: FreshBooksJsonValue | null;
			deposit_amount?: FreshBooksJsonValue | null;
			deposit_percentage?: FreshBooksJsonValue | null;
			deposit_status?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			fulfillment_date?: FreshBooksJsonValue | null;
			generation_date?: FreshBooksJsonValue | null;
			gmail?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoice_number?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			ownerid?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			parent?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			payment_status?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			return_uri?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			show_attachments?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			v3_status?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'invoices.listPresentations': {
		presentation?: {
			date_format?: FreshBooksJsonValue | null;
			description_heading?: FreshBooksJsonValue | null;
			hours_heading?: FreshBooksJsonValue | null;
			image_banner_position_y?: FreshBooksJsonValue | null;
			image_banner_src?: FreshBooksJsonValue | null;
			image_logo_src?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			item_heading?: FreshBooksJsonValue | null;
			label?: FreshBooksJsonValue | null;
			quantity_heading?: FreshBooksJsonValue | null;
			rate_heading?: FreshBooksJsonValue | null;
			task_heading?: FreshBooksJsonValue | null;
			theme_font_name?: FreshBooksJsonValue | null;
			theme_layout?: FreshBooksJsonValue | null;
			theme_primary_color?: FreshBooksJsonValue | null;
			time_entry_notes_heading?: FreshBooksJsonValue | null;
			unit_cost_heading?: FreshBooksJsonValue | null;
		} | null;
	};
	'invoices.markSent': {
		invoice?: {
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			autobill_status?: FreshBooksJsonValue | null;
			basecampid?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			date_paid?: FreshBooksJsonValue | null;
			deposit_amount?: FreshBooksJsonValue | null;
			deposit_percentage?: FreshBooksJsonValue | null;
			deposit_status?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			fulfillment_date?: FreshBooksJsonValue | null;
			generation_date?: FreshBooksJsonValue | null;
			gmail?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoice_number?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			ownerid?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			parent?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			payment_status?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			return_uri?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			show_attachments?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			v3_status?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			presentation?: {
				date_format?: FreshBooksJsonValue | null;
				description_heading?: FreshBooksJsonValue | null;
				hours_heading?: FreshBooksJsonValue | null;
				image_banner_position_y?: FreshBooksJsonValue | null;
				image_banner_src?: FreshBooksJsonValue | null;
				image_logo_src?: FreshBooksJsonValue | null;
				invoiceid?: FreshBooksJsonValue | null;
				item_heading?: FreshBooksJsonValue | null;
				label?: FreshBooksJsonValue | null;
				quantity_heading?: FreshBooksJsonValue | null;
				rate_heading?: FreshBooksJsonValue | null;
				task_heading?: FreshBooksJsonValue | null;
				theme_font_name?: FreshBooksJsonValue | null;
				theme_layout?: FreshBooksJsonValue | null;
				theme_primary_color?: FreshBooksJsonValue | null;
				time_entry_notes_heading?: FreshBooksJsonValue | null;
				unit_cost_heading?: FreshBooksJsonValue | null;
			} | null;
		} | null;
	};
	'invoices.sendEmail': {
		invoice?: {
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			autobill_status?: FreshBooksJsonValue | null;
			basecampid?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			date_paid?: FreshBooksJsonValue | null;
			deposit_amount?: FreshBooksJsonValue | null;
			deposit_percentage?: FreshBooksJsonValue | null;
			deposit_status?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			fulfillment_date?: FreshBooksJsonValue | null;
			generation_date?: FreshBooksJsonValue | null;
			gmail?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoice_number?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			ownerid?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			parent?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			payment_status?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			return_uri?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			show_attachments?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			v3_status?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			presentation?: {
				date_format?: FreshBooksJsonValue | null;
				description_heading?: FreshBooksJsonValue | null;
				hours_heading?: FreshBooksJsonValue | null;
				image_banner_position_y?: FreshBooksJsonValue | null;
				image_banner_src?: FreshBooksJsonValue | null;
				image_logo_src?: FreshBooksJsonValue | null;
				invoiceid?: FreshBooksJsonValue | null;
				item_heading?: FreshBooksJsonValue | null;
				label?: FreshBooksJsonValue | null;
				quantity_heading?: FreshBooksJsonValue | null;
				rate_heading?: FreshBooksJsonValue | null;
				task_heading?: FreshBooksJsonValue | null;
				theme_font_name?: FreshBooksJsonValue | null;
				theme_layout?: FreshBooksJsonValue | null;
				theme_primary_color?: FreshBooksJsonValue | null;
				time_entry_notes_heading?: FreshBooksJsonValue | null;
				unit_cost_heading?: FreshBooksJsonValue | null;
			} | null;
		} | null;
	};
	'invoices.update': {
		invoice?: {
			accountid?: FreshBooksJsonValue | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			auto_bill?: FreshBooksJsonValue | null;
			autobill_status?: FreshBooksJsonValue | null;
			basecampid?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			create_date?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			current_organization?: FreshBooksJsonValue | null;
			customerid?: FreshBooksJsonValue | null;
			date_paid?: FreshBooksJsonValue | null;
			deposit_amount?: FreshBooksJsonValue | null;
			deposit_percentage?: FreshBooksJsonValue | null;
			deposit_status?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			discount_description?: FreshBooksJsonValue | null;
			discount_total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			discount_value?: FreshBooksJsonValue | null;
			display_status?: FreshBooksJsonValue | null;
			dispute_status?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			due_offset_days?: FreshBooksJsonValue | null;
			estimateid?: FreshBooksJsonValue | null;
			ext_archive?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			fulfillment_date?: FreshBooksJsonValue | null;
			generation_date?: FreshBooksJsonValue | null;
			gmail?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoice_number?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_order_status?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			notes?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			outstanding?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			ownerid?: FreshBooksJsonValue | null;
			paid?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			parent?: FreshBooksJsonValue | null;
			payment_details?: FreshBooksJsonValue | null;
			payment_status?: FreshBooksJsonValue | null;
			po_number?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			return_uri?: FreshBooksJsonValue | null;
			sentid?: FreshBooksJsonValue | null;
			show_attachments?: FreshBooksJsonValue | null;
			status?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			template?: FreshBooksJsonValue | null;
			terms?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			v3_status?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
			allowed_gateways?: Array<{
				allowedid?: FreshBooksJsonValue | null;
				connectionid?: FreshBooksJsonValue | null;
				gateway_name?: FreshBooksJsonValue | null;
				gatewayid?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
			}> | null;
		} | null;
	};
	'items.create': {
		item?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			inventory?: FreshBooksJsonValue | null;
			itemid?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			qty?: FreshBooksJsonValue | null;
			tax1?: FreshBooksJsonValue | null;
			tax2?: FreshBooksJsonValue | null;
			unit_cost?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'items.delete':
		| {
				item?: {
					accounting_systemid?: FreshBooksJsonValue | null;
					description?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					inventory?: FreshBooksJsonValue | null;
					itemid?: FreshBooksJsonValue | null;
					name?: FreshBooksJsonValue | null;
					qty?: FreshBooksJsonValue | null;
					tax1?: FreshBooksJsonValue | null;
					tax2?: FreshBooksJsonValue | null;
					unit_cost?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					updated?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'items.get': {
		item?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			inventory?: FreshBooksJsonValue | null;
			itemid?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			qty?: FreshBooksJsonValue | null;
			tax1?: FreshBooksJsonValue | null;
			tax2?: FreshBooksJsonValue | null;
			unit_cost?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'items.list': {
		item?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			inventory?: FreshBooksJsonValue | null;
			itemid?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			qty?: FreshBooksJsonValue | null;
			tax1?: FreshBooksJsonValue | null;
			tax2?: FreshBooksJsonValue | null;
			unit_cost?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'items.update': {
		item?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			inventory?: FreshBooksJsonValue | null;
			itemid?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			qty?: FreshBooksJsonValue | null;
			tax1?: FreshBooksJsonValue | null;
			tax2?: FreshBooksJsonValue | null;
			unit_cost?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'journalEntries.create': {
		journal_entry?: {
			currency_code?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			details?: Array<{
				credit?: FreshBooksJsonValue | null;
				currency_code?: FreshBooksJsonValue | null;
				debit?: FreshBooksJsonValue | null;
				description?: FreshBooksJsonValue | null;
				detailid?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				name?: FreshBooksJsonValue | null;
				sub_accountid?: FreshBooksJsonValue | null;
				user_entered_date?: FreshBooksJsonValue | null;
			}> | null;
			entryid?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			user_entered_date?: FreshBooksJsonValue | null;
		} | null;
	};
	'journalEntryAccounts.list': Record<string, FreshBooksJsonValue>;
	'journalEntryDetails.list': {
		journal_entry_details?: Array<{
			account?: {
				account_name?: FreshBooksJsonValue | null;
				account_number?: FreshBooksJsonValue | null;
				account_type?: FreshBooksJsonValue | null;
				accountid?: FreshBooksJsonValue | null;
				accounting_systemid?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
			} | null;
			accounting_systemid?: FreshBooksJsonValue | null;
			balance?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			credit?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			debit?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			description?: FreshBooksJsonValue | null;
			detail_type?: FreshBooksJsonValue | null;
			detailid?: FreshBooksJsonValue | null;
			entry?: {
				accounting_systemid?: FreshBooksJsonValue | null;
				clientid?: FreshBooksJsonValue | null;
				creditid?: FreshBooksJsonValue | null;
				entryid?: FreshBooksJsonValue | null;
				expenseid?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				incomeid?: FreshBooksJsonValue | null;
				invoiceid?: FreshBooksJsonValue | null;
				paymentid?: FreshBooksJsonValue | null;
			} | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			sub_account?: {
				account_sub_name?: FreshBooksJsonValue | null;
				account_sub_number?: FreshBooksJsonValue | null;
				accounting_systemid?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				parentid?: FreshBooksJsonValue | null;
				sub_accountid?: FreshBooksJsonValue | null;
			} | null;
			user_entered_date?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'ledgerAccountSubTypes.get': Record<string, FreshBooksJsonValue>;
	'ledgerAccountSubTypes.list': Record<string, FreshBooksJsonValue>;
	'ledgerAccountTypes.list': Record<string, FreshBooksJsonValue>;
	'ledgerAccounts.create': {
		data?: {
			uuid?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			number?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			type?: FreshBooksJsonValue | null;
			sub_type?: FreshBooksJsonValue | null;
			parent_account?: FreshBooksJsonValue | null;
			sub_accounts?: Array<FreshBooksJsonValue> | null;
			auto_created?: FreshBooksJsonValue | null;
			state?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		} | null;
	};
	'ledgerAccounts.get': {
		data?: {
			uuid?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			number?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			type?: FreshBooksJsonValue | null;
			sub_type?: FreshBooksJsonValue | null;
			system_account_name?: FreshBooksJsonValue | null;
			parent_account?: FreshBooksJsonValue | null;
			sub_accounts?: Array<FreshBooksJsonValue> | null;
			auto_created?: FreshBooksJsonValue | null;
			state?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		} | null;
	};
	'ledgerAccounts.list': {
		data?: Array<{
			uuid?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			number?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			type?: FreshBooksJsonValue | null;
			sub_type?: FreshBooksJsonValue | null;
			system_account_name?: FreshBooksJsonValue | null;
			parent_account?: FreshBooksJsonValue | null;
			sub_accounts?: Array<FreshBooksJsonValue> | null;
			auto_created?: FreshBooksJsonValue | null;
			state?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		}> | null;
	};
	'ledgerAccounts.update': {
		data?: {
			uuid?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			number?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			type?: FreshBooksJsonValue | null;
			sub_type?: FreshBooksJsonValue | null;
			parent_account?: FreshBooksJsonValue | null;
			sub_accounts?: Array<FreshBooksJsonValue> | null;
			auto_created?: FreshBooksJsonValue | null;
			state?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		} | null;
	};
	'ledgerReports.accountEntryDetails': Record<string, FreshBooksJsonValue>;
	'ledgerReports.balanceSheet': Record<string, FreshBooksJsonValue>;
	'ledgerReports.cashFlow': Record<string, FreshBooksJsonValue>;
	'ledgerReports.chartOfAccounts': Record<string, FreshBooksJsonValue>;
	'ledgerReports.expenseDetails': Record<string, FreshBooksJsonValue>;
	'ledgerReports.generalLedger': Record<string, FreshBooksJsonValue>;
	'ledgerReports.manualJournalEntries': Record<string, FreshBooksJsonValue>;
	'ledgerReports.profitAndLoss': Record<string, FreshBooksJsonValue>;
	'ledgerReports.trialBalance': Record<string, FreshBooksJsonValue>;
	'otherIncomes.create': {
		other_income?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			category_name?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			incomeid?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			payment_type?: FreshBooksJsonValue | null;
			source?: FreshBooksJsonValue | null;
			taxes?: Array<{
				amount?: FreshBooksJsonValue | null;
				name?: FreshBooksJsonValue | null;
			}> | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'otherIncomes.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'otherIncomes.get': {
		other_income?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			category_name?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			incomeid?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			payment_type?: FreshBooksJsonValue | null;
			source?: FreshBooksJsonValue | null;
			taxes?: Array<FreshBooksJsonValue> | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'otherIncomes.list': {
		other_income?: Array<{
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			category_name?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			incomeid?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			payment_type?: FreshBooksJsonValue | null;
			source?: FreshBooksJsonValue | null;
			taxes?: Array<{
				amount?: FreshBooksJsonValue | null;
				name?: FreshBooksJsonValue | null;
			}> | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'otherIncomes.update': {
		other_income?: {
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			category_name?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			incomeid?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			payment_type?: FreshBooksJsonValue | null;
			source?: FreshBooksJsonValue | null;
			taxes?: Array<FreshBooksJsonValue> | null;
			updated_at?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'paymentOptions.getDefault': Record<string, FreshBooksJsonValue>;
	'payments.create': {
		payment?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			clientid?: FreshBooksJsonValue | null;
			creditid?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			from_credit?: FreshBooksJsonValue | null;
			gateway?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			logid?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			orderid?: FreshBooksJsonValue | null;
			overpaymentid?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			type?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'payments.delete':
		| {
				payment?: {
					accounting_systemid?: FreshBooksJsonValue | null;
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					clientid?: FreshBooksJsonValue | null;
					creditid?: FreshBooksJsonValue | null;
					date?: FreshBooksJsonValue | null;
					from_credit?: FreshBooksJsonValue | null;
					gateway?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					invoiceid?: FreshBooksJsonValue | null;
					logid?: FreshBooksJsonValue | null;
					note?: FreshBooksJsonValue | null;
					orderid?: FreshBooksJsonValue | null;
					overpaymentid?: FreshBooksJsonValue | null;
					transactionid?: FreshBooksJsonValue | null;
					type?: FreshBooksJsonValue | null;
					updated?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'payments.get': {
		payment?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			clientid?: FreshBooksJsonValue | null;
			creditid?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			from_credit?: FreshBooksJsonValue | null;
			gateway?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			logid?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			orderid?: FreshBooksJsonValue | null;
			overpaymentid?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			type?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'payments.list': {
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		payments?: Array<{
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			clientid?: FreshBooksJsonValue | null;
			creditid?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			from_credit?: FreshBooksJsonValue | null;
			gateway?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			logid?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			orderid?: FreshBooksJsonValue | null;
			overpaymentid?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			type?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		per_page?: FreshBooksJsonValue | null;
		total?: FreshBooksJsonValue | null;
	};
	'payments.update': {
		payment?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			clientid?: FreshBooksJsonValue | null;
			creditid?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			from_credit?: FreshBooksJsonValue | null;
			gateway?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			invoiceid?: FreshBooksJsonValue | null;
			logid?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			orderid?: FreshBooksJsonValue | null;
			overpaymentid?: FreshBooksJsonValue | null;
			transactionid?: FreshBooksJsonValue | null;
			type?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'projectThreads.create': Record<string, FreshBooksJsonValue>;
	'projectThreads.list': Record<string, FreshBooksJsonValue>;
	'projects.create': {
		project?: {
			id?: FreshBooksJsonValue | null;
			title?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			client_id?: FreshBooksJsonValue | null;
			internal?: FreshBooksJsonValue | null;
			budget?: FreshBooksJsonValue | null;
			fixed_price?: FreshBooksJsonValue | null;
			rate?: FreshBooksJsonValue | null;
			billing_method?: FreshBooksJsonValue | null;
			project_type?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			complete?: FreshBooksJsonValue | null;
			sample?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
			logged_duration?: FreshBooksJsonValue | null;
			services?: Array<FreshBooksJsonValue> | null;
			billed_amount?: FreshBooksJsonValue | null;
			billed_status?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			group?: {
				id?: FreshBooksJsonValue | null;
				members?: Array<{
					id?: FreshBooksJsonValue | null;
					identity_id?: FreshBooksJsonValue | null;
					role?: FreshBooksJsonValue | null;
					first_name?: FreshBooksJsonValue | null;
					last_name?: FreshBooksJsonValue | null;
					email?: FreshBooksJsonValue | null;
					company?: FreshBooksJsonValue | null;
					active?: FreshBooksJsonValue | null;
				}> | null;
				pending_invitations?: FreshBooksJsonValue | null;
			} | null;
		} | null;
	};
	'projects.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'projects.get': {
		project?: {
			id?: FreshBooksJsonValue | null;
			title?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			client_id?: FreshBooksJsonValue | null;
			internal?: FreshBooksJsonValue | null;
			budget?: FreshBooksJsonValue | null;
			fixed_price?: FreshBooksJsonValue | null;
			rate?: FreshBooksJsonValue | null;
			billing_method?: FreshBooksJsonValue | null;
			project_type?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			complete?: FreshBooksJsonValue | null;
			sample?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
			logged_duration?: FreshBooksJsonValue | null;
			services?: Array<{
				business_id?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				name?: FreshBooksJsonValue | null;
				billable?: FreshBooksJsonValue | null;
				vis_state?: FreshBooksJsonValue | null;
			}> | null;
			billed_amount?: FreshBooksJsonValue | null;
			billed_status?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			group?: {
				id?: FreshBooksJsonValue | null;
				members?: Array<{
					id?: FreshBooksJsonValue | null;
					identity_id?: FreshBooksJsonValue | null;
					role?: FreshBooksJsonValue | null;
					first_name?: FreshBooksJsonValue | null;
					last_name?: FreshBooksJsonValue | null;
					email?: FreshBooksJsonValue | null;
					company?: FreshBooksJsonValue | null;
					active?: FreshBooksJsonValue | null;
				}> | null;
				pending_invitations?: Array<FreshBooksJsonValue> | null;
			} | null;
		} | null;
		abilities?: Array<{
			name?: FreshBooksJsonValue | null;
			value?: FreshBooksJsonValue | null;
		}> | null;
	};
	'projects.list': {
		meta?: {
			sort?: Array<FreshBooksJsonValue> | null;
			total?: FreshBooksJsonValue | null;
			per_page?: FreshBooksJsonValue | null;
			page?: FreshBooksJsonValue | null;
			pages?: FreshBooksJsonValue | null;
		} | null;
		projects?: Array<{
			id?: FreshBooksJsonValue | null;
			title?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			client_id?: FreshBooksJsonValue | null;
			internal?: FreshBooksJsonValue | null;
			budget?: FreshBooksJsonValue | null;
			fixed_price?: FreshBooksJsonValue | null;
			rate?: FreshBooksJsonValue | null;
			billing_method?: FreshBooksJsonValue | null;
			project_type?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			complete?: FreshBooksJsonValue | null;
			sample?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
			logged_duration?: FreshBooksJsonValue | null;
			services?: Array<{
				business_id?: FreshBooksJsonValue | null;
				id?: FreshBooksJsonValue | null;
				name?: FreshBooksJsonValue | null;
				billable?: FreshBooksJsonValue | null;
				vis_state?: FreshBooksJsonValue | null;
			}> | null;
			billed_amount?: FreshBooksJsonValue | null;
			billed_status?: FreshBooksJsonValue | null;
			group_id?: FreshBooksJsonValue | null;
		}> | null;
	};
	'projects.update': {
		project?: {
			id?: FreshBooksJsonValue | null;
			title?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			due_date?: FreshBooksJsonValue | null;
			client_id?: FreshBooksJsonValue | null;
			internal?: FreshBooksJsonValue | null;
			budget?: FreshBooksJsonValue | null;
			fixed_price?: FreshBooksJsonValue | null;
			rate?: FreshBooksJsonValue | null;
			billing_method?: FreshBooksJsonValue | null;
			project_type?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			complete?: FreshBooksJsonValue | null;
			sample?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
			logged_duration?: FreshBooksJsonValue | null;
			services?: Array<FreshBooksJsonValue> | null;
			billed_amount?: FreshBooksJsonValue | null;
			billed_status?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			group?: {
				id?: FreshBooksJsonValue | null;
				members?: Array<{
					id?: FreshBooksJsonValue | null;
					identity_id?: FreshBooksJsonValue | null;
					role?: FreshBooksJsonValue | null;
					first_name?: FreshBooksJsonValue | null;
					last_name?: FreshBooksJsonValue | null;
					email?: FreshBooksJsonValue | null;
					company?: FreshBooksJsonValue | null;
					active?: FreshBooksJsonValue | null;
				}> | null;
				pending_invitations?: Array<FreshBooksJsonValue> | null;
			} | null;
		} | null;
		abilities?: Array<{
			name?: FreshBooksJsonValue | null;
			value?: FreshBooksJsonValue | null;
		}> | null;
	};
	'projects.updateServiceRate': {
		project_service_rate?: {
			rate?: FreshBooksJsonValue | null;
			service_id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			project_id?: FreshBooksJsonValue | null;
		} | null;
	};
	'reports.accountStatement': Record<string, FreshBooksJsonValue>;
	'reports.accountsAging': {
		accounts_aging?: {
			accounts?: Array<{
				'0-30'?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				'31-60'?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				'61-90'?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				'91+'?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				email?: FreshBooksJsonValue | null;
				fname?: FreshBooksJsonValue | null;
				lname?: FreshBooksJsonValue | null;
				organization?: FreshBooksJsonValue | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				userid?: FreshBooksJsonValue | null;
			}> | null;
			company_name?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			download_token?: FreshBooksJsonValue | null;
			end_date?: FreshBooksJsonValue | null;
			totals?: {
				'0-30'?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				'31-60'?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				'61-90'?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				'91+'?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			} | null;
		} | null;
	};
	'reports.balanceSheet': {
		balance_sheet?: {
			assets_total?: Array<{
				balance?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				date?: FreshBooksJsonValue | null;
			}> | null;
			company_name?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			data?: Array<{
				account_type?: FreshBooksJsonValue | null;
				accounts?: Array<{
					account_name?: FreshBooksJsonValue | null;
					account_number?: FreshBooksJsonValue | null;
					balances?: Array<{
						balance?: {
							amount?: FreshBooksJsonValue | null;
							code?: FreshBooksJsonValue | null;
						} | null;
						date?: FreshBooksJsonValue | null;
					}> | null;
					sub_accounts?: Array<{
						balances?: Array<{
							balance?: {
								amount?: FreshBooksJsonValue | null;
								code?: FreshBooksJsonValue | null;
							} | null;
							date?: FreshBooksJsonValue | null;
						}> | null;
						sub_account_name?: FreshBooksJsonValue | null;
						sub_account_number?: FreshBooksJsonValue | null;
					}> | null;
				}> | null;
				balances?: Array<{
					balance?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					date?: FreshBooksJsonValue | null;
				}> | null;
				category?: FreshBooksJsonValue | null;
			}> | null;
			dates?: Array<FreshBooksJsonValue> | null;
			download_token?: FreshBooksJsonValue | null;
			liabilities_and_equity_total?: Array<{
				balance?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				date?: FreshBooksJsonValue | null;
			}> | null;
		} | null;
	};
	'reports.bankReconciliationSummary': Record<string, FreshBooksJsonValue>;
	'reports.download': FileOutput;
	'reports.expenseDetails': Record<string, FreshBooksJsonValue>;
	'reports.invoiceDetails': {
		invoice_details?: {
			clientids?: Array<FreshBooksJsonValue> | null;
			clients?: Array<FreshBooksJsonValue> | null;
			company_name?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			date_type?: FreshBooksJsonValue | null;
			download_token?: FreshBooksJsonValue | null;
			end_date?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			statusids?: Array<FreshBooksJsonValue> | null;
			summary?: {
				outstanding?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				paid?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			} | null;
			summary_only?: FreshBooksJsonValue | null;
		} | null;
	};
	'reports.itemSales': {
		item_sales?: {
			clientids?: Array<FreshBooksJsonValue> | null;
			company_name?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			download_token?: FreshBooksJsonValue | null;
			end_date?: FreshBooksJsonValue | null;
			item_names?: Array<FreshBooksJsonValue> | null;
			items?: Array<{
				invoices?: Array<{
					amount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					create_date?: FreshBooksJsonValue | null;
					discount?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					fname?: FreshBooksJsonValue | null;
					invoice_number?: FreshBooksJsonValue | null;
					invoiceid?: FreshBooksJsonValue | null;
					lname?: FreshBooksJsonValue | null;
					organization?: FreshBooksJsonValue | null;
					qty?: FreshBooksJsonValue | null;
					unit_cost?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					v3_status?: FreshBooksJsonValue | null;
				}> | null;
				name?: FreshBooksJsonValue | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				total_discount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				total_qty?: FreshBooksJsonValue | null;
			}> | null;
			start_date?: FreshBooksJsonValue | null;
			statusids?: Array<FreshBooksJsonValue> | null;
			total?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			total_discount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			total_qty?: FreshBooksJsonValue | null;
		} | null;
	};
	'reports.paymentsCollected': {
		payments_collected?: {
			clientids?: Array<FreshBooksJsonValue> | null;
			currency_codes?: Array<FreshBooksJsonValue> | null;
			download_token?: FreshBooksJsonValue | null;
			end_date?: FreshBooksJsonValue | null;
			payment_methods?: Array<FreshBooksJsonValue> | null;
			payments?: Array<FreshBooksJsonValue> | null;
			start_date?: FreshBooksJsonValue | null;
			totals?: Array<FreshBooksJsonValue> | null;
		} | null;
	};
	'reports.profitLossEntity': {
		profitloss?: {
			cash_based?: FreshBooksJsonValue | null;
			company_name?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			download_token?: FreshBooksJsonValue | null;
			end_date?: FreshBooksJsonValue | null;
			expenses?: Array<{
				children?: Array<{
					children?: Array<FreshBooksJsonValue> | null;
					data?: Array<FreshBooksJsonValue> | null;
					description?: FreshBooksJsonValue | null;
					entry_type?: FreshBooksJsonValue | null;
					total?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
				}> | null;
				data?: Array<FreshBooksJsonValue> | null;
				description?: FreshBooksJsonValue | null;
				entry_type?: FreshBooksJsonValue | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			income?: Array<{
				children?: Array<FreshBooksJsonValue> | null;
				data?: Array<FreshBooksJsonValue> | null;
				description?: FreshBooksJsonValue | null;
				entry_type?: FreshBooksJsonValue | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			labels?: Array<FreshBooksJsonValue> | null;
			net_profit?: {
				children?: Array<FreshBooksJsonValue> | null;
				data?: Array<FreshBooksJsonValue> | null;
				description?: FreshBooksJsonValue | null;
				entry_type?: FreshBooksJsonValue | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			} | null;
			resolution?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			total_expenses?: {
				children?: Array<FreshBooksJsonValue> | null;
				data?: Array<FreshBooksJsonValue> | null;
				description?: FreshBooksJsonValue | null;
				entry_type?: FreshBooksJsonValue | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			} | null;
			total_income?: {
				children?: Array<FreshBooksJsonValue> | null;
				data?: Array<FreshBooksJsonValue> | null;
				description?: FreshBooksJsonValue | null;
				entry_type?: FreshBooksJsonValue | null;
				total?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			} | null;
		} | null;
	};
	'reports.revenueByClient': {
		revenue_by_client?: {
			clientids?: Array<FreshBooksJsonValue> | null;
			clients?: Array<FreshBooksJsonValue> | null;
			currency_code?: FreshBooksJsonValue | null;
			download_token?: FreshBooksJsonValue | null;
			end_date?: FreshBooksJsonValue | null;
			labels?: Array<FreshBooksJsonValue> | null;
			sales_type?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			total_sales?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			total_sales_data?: Array<{
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			}> | null;
		} | null;
	};
	'reports.taxSummary': {
		taxsummary?: {
			cash_based?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			download_token?: FreshBooksJsonValue | null;
			end_date?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			taxes?: Array<{
				net_tax?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				net_taxable_amount?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				tax_collected?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				tax_name?: FreshBooksJsonValue | null;
				tax_paid?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				taxable_amount_collected?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				taxable_amount_paid?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
			}> | null;
			total_invoiced?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
		} | null;
	};
	'reports.trialBalance': {
		trial_balance?: {
			company_name?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			data?: Array<{
				account_name?: FreshBooksJsonValue | null;
				account_number?: FreshBooksJsonValue | null;
				account_sub_name?: FreshBooksJsonValue | null;
				account_sub_number?: FreshBooksJsonValue | null;
				credit?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				debit?: {
					amount?: FreshBooksJsonValue | null;
					code?: FreshBooksJsonValue | null;
				} | null;
				sub_accountid?: FreshBooksJsonValue | null;
			}> | null;
			download_token?: FreshBooksJsonValue | null;
			end_date?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
		} | null;
	};
	'retainers.create': {
		retainer?: {
			id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			system_id?: FreshBooksJsonValue | null;
			invoice_profile_id?: FreshBooksJsonValue | null;
			client_user_id?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			next_period_start_date?: FreshBooksJsonValue | null;
			fee?: FreshBooksJsonValue | null;
			excess_rate?: FreshBooksJsonValue | null;
			budgeted_time?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		} | null;
	};
	'retainers.delete':
		| {
				retainer?: {
					id?: FreshBooksJsonValue | null;
					business_id?: FreshBooksJsonValue | null;
					system_id?: FreshBooksJsonValue | null;
					invoice_profile_id?: FreshBooksJsonValue | null;
					client_user_id?: FreshBooksJsonValue | null;
					start_date?: FreshBooksJsonValue | null;
					next_period_start_date?: FreshBooksJsonValue | null;
					fee?: FreshBooksJsonValue | null;
					excess_rate?: FreshBooksJsonValue | null;
					budgeted_time?: FreshBooksJsonValue | null;
					active?: FreshBooksJsonValue | null;
					created_at?: FreshBooksJsonValue | null;
					updated_at?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'retainers.get': {
		retainer?: {
			id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			system_id?: FreshBooksJsonValue | null;
			invoice_profile_id?: FreshBooksJsonValue | null;
			client_user_id?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			next_period_start_date?: FreshBooksJsonValue | null;
			fee?: FreshBooksJsonValue | null;
			excess_rate?: FreshBooksJsonValue | null;
			budgeted_time?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		} | null;
	};
	'retainers.list': {
		retainers?: Array<{
			id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			system_id?: FreshBooksJsonValue | null;
			invoice_profile_id?: FreshBooksJsonValue | null;
			client_user_id?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			next_period_start_date?: FreshBooksJsonValue | null;
			fee?: FreshBooksJsonValue | null;
			excess_rate?: FreshBooksJsonValue | null;
			budgeted_time?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		}> | null;
	};
	'retainers.undelete': {
		retainer?: {
			id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			system_id?: FreshBooksJsonValue | null;
			invoice_profile_id?: FreshBooksJsonValue | null;
			client_user_id?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			next_period_start_date?: FreshBooksJsonValue | null;
			fee?: FreshBooksJsonValue | null;
			excess_rate?: FreshBooksJsonValue | null;
			budgeted_time?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		} | null;
	};
	'retainers.update': {
		retainer?: {
			id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			system_id?: FreshBooksJsonValue | null;
			invoice_profile_id?: FreshBooksJsonValue | null;
			client_user_id?: FreshBooksJsonValue | null;
			start_date?: FreshBooksJsonValue | null;
			next_period_start_date?: FreshBooksJsonValue | null;
			fee?: FreshBooksJsonValue | null;
			excess_rate?: FreshBooksJsonValue | null;
			budgeted_time?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		} | null;
	};
	'serviceRates.list': {
		service_rates?: Array<{
			rate?: FreshBooksJsonValue | null;
			service_id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
		}> | null;
	};
	'services.create': Record<string, FreshBooksJsonValue>;
	'services.createRate': Record<string, FreshBooksJsonValue>;
	'services.get': Record<string, FreshBooksJsonValue>;
	'services.getRate': Record<string, FreshBooksJsonValue>;
	'services.list': Record<string, FreshBooksJsonValue>;
	'services.updateRate': Record<string, FreshBooksJsonValue>;
	'staff.delete':
		| {
				staff?: {
					accounting_systemid?: FreshBooksJsonValue | null;
					api_token?: FreshBooksJsonValue | null;
					bus_phone?: FreshBooksJsonValue | null;
					currency_code?: FreshBooksJsonValue | null;
					display_name?: FreshBooksJsonValue | null;
					email?: FreshBooksJsonValue | null;
					fax?: FreshBooksJsonValue | null;
					fname?: FreshBooksJsonValue | null;
					home_phone?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					language?: FreshBooksJsonValue | null;
					last_login?: FreshBooksJsonValue | null;
					level?: FreshBooksJsonValue | null;
					lname?: FreshBooksJsonValue | null;
					mob_phone?: FreshBooksJsonValue | null;
					note?: FreshBooksJsonValue | null;
					num_logins?: FreshBooksJsonValue | null;
					organization?: FreshBooksJsonValue | null;
					p_city?: FreshBooksJsonValue | null;
					p_code?: FreshBooksJsonValue | null;
					p_country?: FreshBooksJsonValue | null;
					p_province?: FreshBooksJsonValue | null;
					p_street?: FreshBooksJsonValue | null;
					p_street2?: FreshBooksJsonValue | null;
					rate?: FreshBooksJsonValue | null;
					role?: FreshBooksJsonValue | null;
					signup_date?: FreshBooksJsonValue | null;
					updated?: FreshBooksJsonValue | null;
					userid?: FreshBooksJsonValue | null;
					username?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'staff.get': {
		staff?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			api_token?: FreshBooksJsonValue | null;
			bus_phone?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			display_name?: FreshBooksJsonValue | null;
			email?: FreshBooksJsonValue | null;
			fax?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			home_phone?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_login?: FreshBooksJsonValue | null;
			level?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			mob_phone?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			num_logins?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			p_city?: FreshBooksJsonValue | null;
			p_code?: FreshBooksJsonValue | null;
			p_country?: FreshBooksJsonValue | null;
			p_province?: FreshBooksJsonValue | null;
			p_street?: FreshBooksJsonValue | null;
			p_street2?: FreshBooksJsonValue | null;
			rate?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			signup_date?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			userid?: FreshBooksJsonValue | null;
			username?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'staff.list': Record<string, FreshBooksJsonValue>;
	'staff.update': {
		staff?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			api_token?: FreshBooksJsonValue | null;
			bus_phone?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			display_name?: FreshBooksJsonValue | null;
			email?: FreshBooksJsonValue | null;
			fax?: FreshBooksJsonValue | null;
			fname?: FreshBooksJsonValue | null;
			home_phone?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			language?: FreshBooksJsonValue | null;
			last_login?: FreshBooksJsonValue | null;
			level?: FreshBooksJsonValue | null;
			lname?: FreshBooksJsonValue | null;
			mob_phone?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			num_logins?: FreshBooksJsonValue | null;
			organization?: FreshBooksJsonValue | null;
			p_city?: FreshBooksJsonValue | null;
			p_code?: FreshBooksJsonValue | null;
			p_country?: FreshBooksJsonValue | null;
			p_province?: FreshBooksJsonValue | null;
			p_street?: FreshBooksJsonValue | null;
			p_street2?: FreshBooksJsonValue | null;
			rate?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			signup_date?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			userid?: FreshBooksJsonValue | null;
			username?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'systems.get': {
		system?: {
			accountid?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			auto_bill?: FreshBooksJsonValue | null;
			billing_status?: FreshBooksJsonValue | null;
			bus_phone?: FreshBooksJsonValue | null;
			business_type?: FreshBooksJsonValue | null;
			business_uuid?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			code?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			currency_code?: FreshBooksJsonValue | null;
			date?: FreshBooksJsonValue | null;
			discountid?: FreshBooksJsonValue | null;
			dst?: FreshBooksJsonValue | null;
			duration?: FreshBooksJsonValue | null;
			email?: FreshBooksJsonValue | null;
			fax?: FreshBooksJsonValue | null;
			gst_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			heard_about_us_via?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			info_email?: FreshBooksJsonValue | null;
			ip?: FreshBooksJsonValue | null;
			landing_url?: FreshBooksJsonValue | null;
			masterlock_billing?: FreshBooksJsonValue | null;
			migrated_to_smux_at?: FreshBooksJsonValue | null;
			mob_phone?: FreshBooksJsonValue | null;
			modern_system?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			num_clients?: FreshBooksJsonValue | null;
			num_staff?: FreshBooksJsonValue | null;
			payment_amount?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			payment_frequency?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			referralid?: FreshBooksJsonValue | null;
			referring_url?: FreshBooksJsonValue | null;
			salutation?: FreshBooksJsonValue | null;
			size_limit?: FreshBooksJsonValue | null;
			split_token?: FreshBooksJsonValue | null;
			street?: FreshBooksJsonValue | null;
			street2?: FreshBooksJsonValue | null;
			systemid?: FreshBooksJsonValue | null;
			test_system?: FreshBooksJsonValue | null;
			timezone?: FreshBooksJsonValue | null;
			timezoneid?: FreshBooksJsonValue | null;
			vat_name?: FreshBooksJsonValue | null;
			vat_number?: FreshBooksJsonValue | null;
		} | null;
	};
	'tasks.create': {
		task?: {
			billable?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			rate?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taskid?: FreshBooksJsonValue | null;
			tax1?: FreshBooksJsonValue | null;
			tax2?: FreshBooksJsonValue | null;
			tdesc?: FreshBooksJsonValue | null;
			tname?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'tasks.delete':
		| {
				task?: {
					billable?: FreshBooksJsonValue | null;
					description?: FreshBooksJsonValue | null;
					id?: FreshBooksJsonValue | null;
					name?: FreshBooksJsonValue | null;
					rate?: {
						amount?: FreshBooksJsonValue | null;
						code?: FreshBooksJsonValue | null;
					} | null;
					taskid?: FreshBooksJsonValue | null;
					tax1?: FreshBooksJsonValue | null;
					tax2?: FreshBooksJsonValue | null;
					tdesc?: FreshBooksJsonValue | null;
					tname?: FreshBooksJsonValue | null;
					updated?: FreshBooksJsonValue | null;
					vis_state?: FreshBooksJsonValue | null;
				} | null;
		  }
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'tasks.get': {
		task?: {
			billable?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			rate?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taskid?: FreshBooksJsonValue | null;
			tax1?: FreshBooksJsonValue | null;
			tax2?: FreshBooksJsonValue | null;
			tdesc?: FreshBooksJsonValue | null;
			tname?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'tasks.list': {
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		tasks?: Array<{
			billable?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			rate?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taskid?: FreshBooksJsonValue | null;
			tax1?: FreshBooksJsonValue | null;
			tax2?: FreshBooksJsonValue | null;
			tdesc?: FreshBooksJsonValue | null;
			tname?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		}> | null;
		total?: FreshBooksJsonValue | null;
	};
	'tasks.update': {
		task?: {
			billable?: FreshBooksJsonValue | null;
			description?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			rate?: {
				amount?: FreshBooksJsonValue | null;
				code?: FreshBooksJsonValue | null;
			} | null;
			taskid?: FreshBooksJsonValue | null;
			tax1?: FreshBooksJsonValue | null;
			tax2?: FreshBooksJsonValue | null;
			tdesc?: FreshBooksJsonValue | null;
			tname?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
			vis_state?: FreshBooksJsonValue | null;
		} | null;
	};
	'taxes.create': {
		tax?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: FreshBooksJsonValue | null;
			compound?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			number?: FreshBooksJsonValue | null;
			taxid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
		} | null;
	};
	'taxes.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'taxes.get': {
		tax?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: FreshBooksJsonValue | null;
			compound?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			number?: FreshBooksJsonValue | null;
			taxid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
		} | null;
	};
	'taxes.list': {
		page?: FreshBooksJsonValue | null;
		pages?: FreshBooksJsonValue | null;
		per_page?: FreshBooksJsonValue | null;
		taxes?: Array<{
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: FreshBooksJsonValue | null;
			compound?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			number?: FreshBooksJsonValue | null;
			taxid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
		}> | null;
		total?: FreshBooksJsonValue | null;
	};
	'taxes.update': {
		tax?: {
			accounting_systemid?: FreshBooksJsonValue | null;
			amount?: FreshBooksJsonValue | null;
			compound?: FreshBooksJsonValue | null;
			id?: FreshBooksJsonValue | null;
			name?: FreshBooksJsonValue | null;
			number?: FreshBooksJsonValue | null;
			taxid?: FreshBooksJsonValue | null;
			updated?: FreshBooksJsonValue | null;
		} | null;
	};
	'teamMemberRates.list': {
		team_member_rates?: Array<{
			rate?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
		}> | null;
	};
	'teamMemberRates.update': {
		team_member_rate?: {
			rate?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
		} | null;
	};
	'teamMembers.get': {
		uuid?: FreshBooksJsonValue | null;
		first_name?: FreshBooksJsonValue | null;
		middle_name?: FreshBooksJsonValue | null;
		last_name?: FreshBooksJsonValue | null;
		email?: FreshBooksJsonValue | null;
		job_title?: FreshBooksJsonValue | null;
		street_1?: FreshBooksJsonValue | null;
		street_2?: FreshBooksJsonValue | null;
		city?: FreshBooksJsonValue | null;
		province?: FreshBooksJsonValue | null;
		country?: FreshBooksJsonValue | null;
		postal_code?: FreshBooksJsonValue | null;
		phone_number?: FreshBooksJsonValue | null;
		business_id?: FreshBooksJsonValue | null;
		business_role_name?: FreshBooksJsonValue | null;
		active?: FreshBooksJsonValue | null;
		identity_id?: FreshBooksJsonValue | null;
		invitation_date_accepted?: FreshBooksJsonValue | null;
		created_at?: FreshBooksJsonValue | null;
		updated_at?: FreshBooksJsonValue | null;
	};
	'teamMembers.list': {
		response?: Array<{
			uuid?: FreshBooksJsonValue | null;
			first_name?: FreshBooksJsonValue | null;
			middle_name?: FreshBooksJsonValue | null;
			last_name?: FreshBooksJsonValue | null;
			email?: FreshBooksJsonValue | null;
			job_title?: FreshBooksJsonValue | null;
			street_1?: FreshBooksJsonValue | null;
			street_2?: FreshBooksJsonValue | null;
			city?: FreshBooksJsonValue | null;
			province?: FreshBooksJsonValue | null;
			country?: FreshBooksJsonValue | null;
			postal_code?: FreshBooksJsonValue | null;
			phone_number?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			business_role_name?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			invitation_date_accepted?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			updated_at?: FreshBooksJsonValue | null;
		}> | null;
		meta?: {
			page?: FreshBooksJsonValue | null;
			per_page?: FreshBooksJsonValue | null;
			total?: FreshBooksJsonValue | null;
		} | null;
	};
	'threadComments.create': Record<string, FreshBooksJsonValue>;
	'timeEntries.create': {
		time_entry?: {
			id?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			timer?: FreshBooksJsonValue | null;
			is_logged?: FreshBooksJsonValue | null;
			started_at?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			duration?: FreshBooksJsonValue | null;
			client_id?: FreshBooksJsonValue | null;
			project_id?: FreshBooksJsonValue | null;
			pending_client?: FreshBooksJsonValue | null;
			pending_project?: FreshBooksJsonValue | null;
			pending_task?: FreshBooksJsonValue | null;
			task_id?: FreshBooksJsonValue | null;
			service_id?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			billable?: FreshBooksJsonValue | null;
			billed?: FreshBooksJsonValue | null;
			internal?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
		} | null;
	};
	'timeEntries.delete':
		| Record<string, FreshBooksJsonValue>
		| {
				/** FreshBooks accepted the call; it answered with no body. */ success: true;
		  };
	'timeEntries.get': Record<string, FreshBooksJsonValue>;
	'timeEntries.list': {
		meta?: {
			total_logged?: FreshBooksJsonValue | null;
			total_unbilled?: FreshBooksJsonValue | null;
			total?: FreshBooksJsonValue | null;
			per_page?: FreshBooksJsonValue | null;
			page?: FreshBooksJsonValue | null;
			pages?: FreshBooksJsonValue | null;
		} | null;
		time_entries?: Array<{
			id?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			timer?: FreshBooksJsonValue | null;
			is_logged?: FreshBooksJsonValue | null;
			started_at?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			duration?: FreshBooksJsonValue | null;
			client_id?: FreshBooksJsonValue | null;
			project_id?: FreshBooksJsonValue | null;
			pending_client?: FreshBooksJsonValue | null;
			pending_project?: FreshBooksJsonValue | null;
			pending_task?: FreshBooksJsonValue | null;
			task_id?: FreshBooksJsonValue | null;
			service_id?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			billable?: FreshBooksJsonValue | null;
			billed?: FreshBooksJsonValue | null;
			internal?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
		}> | null;
	};
	'timeEntries.search': {
		time_entries?: Array<{
			id?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			timer?: FreshBooksJsonValue | null;
			is_logged?: FreshBooksJsonValue | null;
			started_at?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			duration?: FreshBooksJsonValue | null;
			client_id?: FreshBooksJsonValue | null;
			project_id?: FreshBooksJsonValue | null;
			pending_client?: FreshBooksJsonValue | null;
			pending_project?: FreshBooksJsonValue | null;
			pending_task?: FreshBooksJsonValue | null;
			task_id?: FreshBooksJsonValue | null;
			service_id?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			billable?: FreshBooksJsonValue | null;
			billed?: FreshBooksJsonValue | null;
			internal?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
			highlight?: FreshBooksJsonValue | null;
		}> | null;
		meta?: {
			total?: FreshBooksJsonValue | null;
			per_page?: FreshBooksJsonValue | null;
			page?: FreshBooksJsonValue | null;
			pages?: FreshBooksJsonValue | null;
			total_logged?: FreshBooksJsonValue | null;
			total_unbilled?: FreshBooksJsonValue | null;
		} | null;
		aggregations?: FreshBooksJsonValue | null;
		download_token?: FreshBooksJsonValue | null;
		abilities?: Array<{
			time_entry_id?: FreshBooksJsonValue | null;
			abilities?: Array<{
				name?: FreshBooksJsonValue | null;
				value?: FreshBooksJsonValue | null;
			}> | null;
		}> | null;
	};
	'timeEntries.update': {
		time_entry?: {
			id?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			timer?: FreshBooksJsonValue | null;
			is_logged?: FreshBooksJsonValue | null;
			started_at?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			duration?: FreshBooksJsonValue | null;
			client_id?: FreshBooksJsonValue | null;
			project_id?: FreshBooksJsonValue | null;
			pending_client?: FreshBooksJsonValue | null;
			pending_project?: FreshBooksJsonValue | null;
			pending_task?: FreshBooksJsonValue | null;
			task_id?: FreshBooksJsonValue | null;
			service_id?: FreshBooksJsonValue | null;
			note?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
			billable?: FreshBooksJsonValue | null;
			billed?: FreshBooksJsonValue | null;
			internal?: FreshBooksJsonValue | null;
			retainer_id?: FreshBooksJsonValue | null;
		} | null;
	};
	'tokens.revoke': Record<string, FreshBooksJsonValue>;
	'uploads.attachment': Record<string, FreshBooksJsonValue>;
	'uploads.image': {
		image?: {
			jwt?: FreshBooksJsonValue | null;
			public_id?: FreshBooksJsonValue | null;
			filename?: FreshBooksJsonValue | null;
		} | null;
		link?: FreshBooksJsonValue | null;
	};
	'uploads.publicImage': Record<string, FreshBooksJsonValue>;
	'users.me': {
		id?: FreshBooksJsonValue | null;
		profile?: {
			setup_complete?: FreshBooksJsonValue | null;
			first_name?: FreshBooksJsonValue | null;
			last_name?: FreshBooksJsonValue | null;
			phone_number?: FreshBooksJsonValue | null;
			address?: FreshBooksJsonValue | null;
			professions?: Array<{
				id?: FreshBooksJsonValue | null;
				business_id?: FreshBooksJsonValue | null;
				title?: FreshBooksJsonValue | null;
				company?: FreshBooksJsonValue | null;
				designation?: FreshBooksJsonValue | null;
			}> | null;
		} | null;
		first_name?: FreshBooksJsonValue | null;
		last_name?: FreshBooksJsonValue | null;
		email?: FreshBooksJsonValue | null;
		language?: FreshBooksJsonValue | null;
		confirmed_at?: FreshBooksJsonValue | null;
		created_at?: FreshBooksJsonValue | null;
		unconfirmed_email?: FreshBooksJsonValue | null;
		setup_complete?: FreshBooksJsonValue | null;
		phone_numbers?: Array<{
			title?: FreshBooksJsonValue | null;
			phone_number?: FreshBooksJsonValue | null;
		}> | null;
		addresses?: Array<FreshBooksJsonValue> | null;
		profession?: {
			id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			title?: FreshBooksJsonValue | null;
			company?: FreshBooksJsonValue | null;
			designation?: FreshBooksJsonValue | null;
		} | null;
		links?: {
			me?: FreshBooksJsonValue | null;
			roles?: FreshBooksJsonValue | null;
		} | null;
		permissions?: {
			rAlTo?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'onboarding_checklist.access'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			E86QZ?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'quickbooks_integration.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'retainers.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			RmpKp?: {
				'client.limit'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			J9hAK?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'onboarding_checklist.access'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			gr1ndR?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			apwodA?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'quickbooks_integration.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			XgGiT?: {
				'client.limit'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
			} | null;
			'7lwxR'?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
			} | null;
			'4WMVg'?: {
				'client.limit'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			x34yX?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
			} | null;
			e1rYq?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			'3ErwB'?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			'8NppA'?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			j1412?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
			} | null;
			BRAVo?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			M1oaR?: {
				'client.limit'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			E4MaY?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			M1GeK?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			'7Po26'?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
			} | null;
			ZaZdo?: {
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			pPLMZ?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			EeCnZ?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			pe4MW?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			oN6yL?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			dowO0g?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'advanced_payments.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'autobill.limit'?: FreshBooksJsonValue | null;
				'bank_import.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'document.limit'?: FreshBooksJsonValue | null;
				'edit_subject_line.access'?: FreshBooksJsonValue | null;
				'late_fee.access'?: FreshBooksJsonValue | null;
				'late_reminder.access'?: FreshBooksJsonValue | null;
				'payments_fees_report.access'?: FreshBooksJsonValue | null;
				'recurring_revenue_report.access'?: FreshBooksJsonValue | null;
				'remove_branding.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			yA0R2P?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			LJZ1p3?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			wkMd2g?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			'3x42x2'?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'inline_expense_edit.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
			lWn0vG?: {
				'advanced_accounting.access'?: FreshBooksJsonValue | null;
				'attachments.access'?: FreshBooksJsonValue | null;
				'business_accountant.limit'?: FreshBooksJsonValue | null;
				'client.limit'?: FreshBooksJsonValue | null;
				'proposals_candidate.access'?: FreshBooksJsonValue | null;
				'rich_proposals.access'?: FreshBooksJsonValue | null;
				'staff.limit'?: FreshBooksJsonValue | null;
				'BetaHeliosAsyncExpenses.access'?: FreshBooksJsonValue | null;
				'beta_mobile_create_expense_subcategory.access'?: FreshBooksJsonValue | null;
				'ios_beta_zendesk_widget.access'?: FreshBooksJsonValue | null;
				'mobile_receipt_rebilling.access'?: FreshBooksJsonValue | null;
				'helios_pushnotifications.beta.access'?: FreshBooksJsonValue | null;
				'ios_beta_payment_schedules.access'?: FreshBooksJsonValue | null;
				'helios_rebill_time.access'?: FreshBooksJsonValue | null;
				'esignatures.access'?: FreshBooksJsonValue | null;
				'helios_dashboard.access'?: FreshBooksJsonValue | null;
				'helios_late_fee_reminder.beta.access'?: FreshBooksJsonValue | null;
				'helios_bulk_actions_invoices.beta.access'?: FreshBooksJsonValue | null;
				'auto_bank_import.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal.beta.access'?: FreshBooksJsonValue | null;
				'helios_expense_rebilling.beta.access'?: FreshBooksJsonValue | null;
				'helios_company_taxes.beta.access'?: FreshBooksJsonValue | null;
				'helios_invoice_archive.beta.access'?: FreshBooksJsonValue | null;
				'accountant_invite.access'?: FreshBooksJsonValue | null;
				'helios_sync_throttle.beta.access'?: FreshBooksJsonValue | null;
				'BankReconciliation.access'?: FreshBooksJsonValue | null;
				'helios_push_resource_to_use_execute.beta.access'?: FreshBooksJsonValue | null;
				'new_time_tracking.access'?: FreshBooksJsonValue | null;
				'bank_rec_smart_match.access'?: FreshBooksJsonValue | null;
				'balance_sheet.access'?: FreshBooksJsonValue | null;
				'invoice_v2_search.access'?: FreshBooksJsonValue | null;
				'import_items_csv.access'?: FreshBooksJsonValue | null;
				'export_clients_csv.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_tutorial.beta.access'?: FreshBooksJsonValue | null;
				'helios_virtual_terminal_advertising.beta.access'?: FreshBooksJsonValue | null;
			} | null;
		} | null;
		groups?: Array<{
			id?: FreshBooksJsonValue | null;
			group_id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			identity_id?: FreshBooksJsonValue | null;
			business_id?: FreshBooksJsonValue | null;
			active?: FreshBooksJsonValue | null;
		}> | null;
		subscription_statuses?: {
			rALYo?: FreshBooksJsonValue | null;
			E86Qp?: FreshBooksJsonValue | null;
			RnPKp?: FreshBooksJsonValue | null;
			J7nAK?: FreshBooksJsonValue | null;
			gjndR?: FreshBooksJsonValue | null;
			apw1A?: FreshBooksJsonValue | null;
			'0XaOw'?: FreshBooksJsonValue | null;
			'7lwxr'?: FreshBooksJsonValue | null;
			'4VMVg'?: FreshBooksJsonValue | null;
			x33xX?: FreshBooksJsonValue | null;
			e1yRq?: FreshBooksJsonValue | null;
			'3eRwB'?: FreshBooksJsonValue | null;
			'8nPPA'?: FreshBooksJsonValue | null;
			j1322?: FreshBooksJsonValue | null;
			B3AVo?: FreshBooksJsonValue | null;
			M1OaR?: FreshBooksJsonValue | null;
			E3MAY?: FreshBooksJsonValue | null;
			M1GeK?: FreshBooksJsonValue | null;
			'7PO26'?: FreshBooksJsonValue | null;
			ZAZdo?: FreshBooksJsonValue | null;
			'0PJMZ'?: FreshBooksJsonValue | null;
			Ee0nZ?: FreshBooksJsonValue | null;
			pe6MW?: FreshBooksJsonValue | null;
			oM6yL?: FreshBooksJsonValue | null;
			dowQ0g?: FreshBooksJsonValue | null;
			yA0R2P?: FreshBooksJsonValue | null;
			LJZ1p4?: FreshBooksJsonValue | null;
			wkMd2g?: FreshBooksJsonValue | null;
			'3x62x2'?: FreshBooksJsonValue | null;
			lwy0vG?: FreshBooksJsonValue | null;
		} | null;
		integrations?: Record<string, FreshBooksJsonValue> | null;
		business_memberships?: Array<{
			id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			unacknowledged_change?: FreshBooksJsonValue | null;
			fasttrack_token?: FreshBooksJsonValue | null;
			business?: {
				id?: FreshBooksJsonValue | null;
				name?: FreshBooksJsonValue | null;
				account_id?: FreshBooksJsonValue | null;
				date_format?: FreshBooksJsonValue | null;
				address?: {
					id?: FreshBooksJsonValue | null;
					street?: FreshBooksJsonValue | null;
					city?: FreshBooksJsonValue | null;
					province?: FreshBooksJsonValue | null;
					country?: FreshBooksJsonValue | null;
					postal_code?: FreshBooksJsonValue | null;
				} | null;
				phone_number?: {
					id?: FreshBooksJsonValue | null;
					phone_number?: FreshBooksJsonValue | null;
				} | null;
				business_clients?: Array<{
					id?: FreshBooksJsonValue | null;
					business_id?: FreshBooksJsonValue | null;
					account_id?: FreshBooksJsonValue | null;
					userid?: FreshBooksJsonValue | null;
					client_business?: {
						business_id?: FreshBooksJsonValue | null;
					} | null;
					account_business?: {
						account_business_id?: FreshBooksJsonValue | null;
						account_id?: FreshBooksJsonValue | null;
					} | null;
				}> | null;
			} | null;
		}> | null;
		identity_origin?: FreshBooksJsonValue | null;
		roles?: Array<{
			id?: FreshBooksJsonValue | null;
			role?: FreshBooksJsonValue | null;
			systemid?: FreshBooksJsonValue | null;
			userid?: FreshBooksJsonValue | null;
			created_at?: FreshBooksJsonValue | null;
			links?: {
				destroy?: FreshBooksJsonValue | null;
			} | null;
			accountid?: FreshBooksJsonValue | null;
		}> | null;
	};
};
