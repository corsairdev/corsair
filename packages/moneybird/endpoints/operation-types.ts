// Generated from Moneybird's OpenAPI spec (https://github.com/moneybird/openapi,
// fetched 2026-11-26); moneybird-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type MoneybirdJsonValue =
	| null
	| boolean
	| number
	| string
	| MoneybirdJsonValue[]
	| { [key: string]: MoneybirdJsonValue | undefined };

export const MONEYBIRD_OPERATION_IDS = [
	'administrations.list',
	'assets.create',
	'assets.delete',
	'assets.disposals.create',
	'assets.get',
	'assets.list',
	'assets.reinvestmentReservePurchase.create',
	'assets.reinvestmentReservePurchase.delete',
	'assets.reinvestmentReserveSale.create',
	'assets.reinvestmentReserveSale.delete',
	'assets.sources.create',
	'assets.sources.delete',
	'assets.update',
	'assets.valueChanges.createArbitrary',
	'assets.valueChanges.createDivestment',
	'assets.valueChanges.createFullDepreciation',
	'assets.valueChanges.createManual',
	'assets.valueChanges.createRetroactiveLinear',
	'contacts.additionalCharges.create',
	'contacts.additionalCharges.list',
	'contacts.archive',
	'contacts.contactPeople.create',
	'contacts.contactPeople.delete',
	'contacts.contactPeople.get',
	'contacts.contactPeople.update',
	'contacts.create',
	'contacts.delete',
	'contacts.fetchByIds',
	'contacts.filter',
	'contacts.get',
	'contacts.getByCustomerId',
	'contacts.list',
	'contacts.listDuplicates',
	'contacts.listVersions',
	'contacts.notes.create',
	'contacts.notes.delete',
	'contacts.paymentsMandate.createUrl',
	'contacts.paymentsMandate.delete',
	'contacts.paymentsMandate.get',
	'contacts.paymentsMandate.request',
	'contacts.update',
	'customFields.list',
	'customerContactPortal.get',
	'customerContactPortal.getSubscription',
	'customerContactPortal.listInvoices',
	'documentStyles.list',
	'documents.generalDocuments.attachments.create',
	'documents.generalDocuments.attachments.delete',
	'documents.generalDocuments.attachments.download',
	'documents.generalDocuments.create',
	'documents.generalDocuments.delete',
	'documents.generalDocuments.fetchByIds',
	'documents.generalDocuments.get',
	'documents.generalDocuments.list',
	'documents.generalDocuments.listVersions',
	'documents.generalDocuments.notes.create',
	'documents.generalDocuments.notes.delete',
	'documents.generalDocuments.update',
	'documents.generalJournalDocuments.attachments.create',
	'documents.generalJournalDocuments.attachments.delete',
	'documents.generalJournalDocuments.attachments.download',
	'documents.generalJournalDocuments.create',
	'documents.generalJournalDocuments.delete',
	'documents.generalJournalDocuments.fetchByIds',
	'documents.generalJournalDocuments.get',
	'documents.generalJournalDocuments.list',
	'documents.generalJournalDocuments.listVersions',
	'documents.generalJournalDocuments.notes.create',
	'documents.generalJournalDocuments.notes.delete',
	'documents.generalJournalDocuments.update',
	'documents.purchaseInvoices.attachments.create',
	'documents.purchaseInvoices.attachments.delete',
	'documents.purchaseInvoices.attachments.download',
	'documents.purchaseInvoices.create',
	'documents.purchaseInvoices.delete',
	'documents.purchaseInvoices.fetchByIds',
	'documents.purchaseInvoices.get',
	'documents.purchaseInvoices.list',
	'documents.purchaseInvoices.listVersions',
	'documents.purchaseInvoices.notes.create',
	'documents.purchaseInvoices.notes.delete',
	'documents.purchaseInvoices.payments.create',
	'documents.purchaseInvoices.payments.delete',
	'documents.purchaseInvoices.update',
	'documents.receipts.attachments.create',
	'documents.receipts.attachments.delete',
	'documents.receipts.attachments.download',
	'documents.receipts.create',
	'documents.receipts.delete',
	'documents.receipts.fetchByIds',
	'documents.receipts.get',
	'documents.receipts.list',
	'documents.receipts.listVersions',
	'documents.receipts.notes.create',
	'documents.receipts.notes.delete',
	'documents.receipts.payments.create',
	'documents.receipts.payments.delete',
	'documents.receipts.update',
	'documents.typelessDocuments.attachments.create',
	'documents.typelessDocuments.attachments.delete',
	'documents.typelessDocuments.attachments.download',
	'documents.typelessDocuments.create',
	'documents.typelessDocuments.delete',
	'documents.typelessDocuments.fetchByIds',
	'documents.typelessDocuments.get',
	'documents.typelessDocuments.list',
	'documents.typelessDocuments.listVersions',
	'downloads.download',
	'downloads.list',
	'estimates.attachments.create',
	'estimates.attachments.delete',
	'estimates.attachments.download',
	'estimates.bill',
	'estimates.changeState',
	'estimates.create',
	'estimates.delete',
	'estimates.downloadPdf',
	'estimates.downloadSignedPdf',
	'estimates.fetchByIds',
	'estimates.get',
	'estimates.getByEstimateId',
	'estimates.list',
	'estimates.listVersions',
	'estimates.notes.create',
	'estimates.notes.delete',
	'estimates.send',
	'estimates.update',
	'events.list',
	'externalSalesInvoices.attachments.create',
	'externalSalesInvoices.attachments.delete',
	'externalSalesInvoices.attachments.download',
	'externalSalesInvoices.create',
	'externalSalesInvoices.createFromAttachment',
	'externalSalesInvoices.delete',
	'externalSalesInvoices.fetchByIds',
	'externalSalesInvoices.get',
	'externalSalesInvoices.list',
	'externalSalesInvoices.listVersions',
	'externalSalesInvoices.markAsDubious',
	'externalSalesInvoices.markAsUncollectible',
	'externalSalesInvoices.notes.create',
	'externalSalesInvoices.notes.delete',
	'externalSalesInvoices.payments.create',
	'externalSalesInvoices.payments.delete',
	'externalSalesInvoices.update',
	'financialAccounts.list',
	'financialMutations.fetchByIds',
	'financialMutations.get',
	'financialMutations.linkBooking',
	'financialMutations.list',
	'financialMutations.listVersions',
	'financialMutations.unlinkBooking',
	'financialStatements.create',
	'financialStatements.delete',
	'financialStatements.update',
	'identities.create',
	'identities.delete',
	'identities.get',
	'identities.getDefault',
	'identities.list',
	'identities.update',
	'identities.updateDefault',
	'ledgerAccounts.create',
	'ledgerAccounts.delete',
	'ledgerAccounts.get',
	'ledgerAccounts.list',
	'ledgerAccounts.update',
	'payments.get',
	'products.create',
	'products.createSalesLink',
	'products.delete',
	'products.get',
	'products.getByIdentifier',
	'products.list',
	'products.update',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.list',
	'projects.update',
	'purchaseTransactionBatches.createFromSepaFile',
	'purchaseTransactionBatches.download',
	'purchaseTransactionBatches.get',
	'purchaseTransactions.delete',
	'purchaseTransactions.get',
	'purchaseTransactions.list',
	'recurringSalesInvoices.create',
	'recurringSalesInvoices.deactivate',
	'recurringSalesInvoices.delete',
	'recurringSalesInvoices.fetchByIds',
	'recurringSalesInvoices.get',
	'recurringSalesInvoices.list',
	'recurringSalesInvoices.listVersions',
	'recurringSalesInvoices.notes.create',
	'recurringSalesInvoices.notes.delete',
	'recurringSalesInvoices.update',
	'reports.assets',
	'reports.balanceSheet',
	'reports.bankBalance',
	'reports.cashFlow',
	'reports.creditors',
	'reports.creditorsAging',
	'reports.debtors',
	'reports.debtorsAging',
	'reports.expensesByContact',
	'reports.expensesByProject',
	'reports.exportAuditfile',
	'reports.exportBrugstaat',
	'reports.exportLedgerAccounts',
	'reports.generalLedger',
	'reports.journalEntries',
	'reports.profitLoss',
	'reports.revenueByContact',
	'reports.revenueByProject',
	'reports.subscriptions',
	'reports.tax',
	'reports.workingCapital',
	'salesInvoices.attachments.create',
	'salesInvoices.attachments.delete',
	'salesInvoices.attachments.download',
	'salesInvoices.create',
	'salesInvoices.delete',
	'salesInvoices.downloadPackingSlipPdf',
	'salesInvoices.downloadPdf',
	'salesInvoices.downloadUbl',
	'salesInvoices.duplicateAsCreditInvoice',
	'salesInvoices.fetchByIds',
	'salesInvoices.get',
	'salesInvoices.getByInvoiceId',
	'salesInvoices.getByReference',
	'salesInvoices.list',
	'salesInvoices.listVersions',
	'salesInvoices.markAsDubious',
	'salesInvoices.markAsUncollectible',
	'salesInvoices.notes.create',
	'salesInvoices.notes.delete',
	'salesInvoices.pause',
	'salesInvoices.payments.create',
	'salesInvoices.payments.delete',
	'salesInvoices.registerCreditInvoicePayment',
	'salesInvoices.resume',
	'salesInvoices.send',
	'salesInvoices.sendReminders',
	'salesInvoices.update',
	'subscriptionTemplates.createSalesLink',
	'subscriptionTemplates.list',
	'subscriptions.additionalCharges.create',
	'subscriptions.additionalCharges.list',
	'subscriptions.create',
	'subscriptions.createAndScheduleOneOffSalesInvoice',
	'subscriptions.delete',
	'subscriptions.get',
	'subscriptions.list',
	'subscriptions.update',
	'taskListGroups.delete',
	'taskListGroups.get',
	'taskListGroups.tasks.create',
	'taskListGroups.update',
	'taskListTasks.assign',
	'taskListTasks.complete',
	'taskListTasks.delete',
	'taskListTasks.get',
	'taskListTasks.notes.create',
	'taskListTasks.reopen',
	'taskListTasks.unassign',
	'taskListTasks.update',
	'taskListTemplates.create',
	'taskListTemplates.createTaskList',
	'taskListTemplates.delete',
	'taskListTemplates.get',
	'taskListTemplates.groups.create',
	'taskListTemplates.list',
	'taskListTemplates.update',
	'taskLists.create',
	'taskLists.delete',
	'taskLists.get',
	'taskLists.groups.create',
	'taskLists.list',
	'taskLists.update',
	'taxRates.list',
	'timeEntries.create',
	'timeEntries.delete',
	'timeEntries.get',
	'timeEntries.list',
	'timeEntries.notes.create',
	'timeEntries.notes.delete',
	'timeEntries.resume',
	'timeEntries.stop',
	'timeEntries.update',
	'users.list',
	'verifications.list',
	'webhooks.activate',
	'webhooks.create',
	'webhooks.deactivate',
	'webhooks.delete',
	'webhooks.list',
	'workflows.get',
	'workflows.list',
] as const;

export type MoneybirdOperationId = (typeof MONEYBIRD_OPERATION_IDS)[number];

export type MoneybirdCustomFieldsAttributesInput =
	| Record<
			string,
			{
				/** The ID of the custom field to set a value for. Retrieve available custom fields via the custom fields endpoint. */
				id: MoneybirdIdentifierInput;
				/** The value to assign to the custom field. The expected format depends on the custom field's type (e.g. text or dropdown). */
				value: string;
			}
	  >
	| Array<{
			/** The ID of the custom field to set a value for. Retrieve available custom fields via the custom fields endpoint. */
			id?: MoneybirdIdentifierInput;
			/** The value to assign to the custom field. The expected format depends on the custom field's type (e.g. text or dropdown). */
			value?: string;
	  }>;

export type MoneybirdDetailsAttributesInput =
	| Record<
			string,
			{
				/** The ID of an existing detail to update. Required when updating or removing an existing detail; omit when creating a new one. */
				id?: MoneybirdIdentifierInput;
				/** A free-text description for this detail, e.g. the name of the product or service delivered. */
				description?: string;
				/** String with a date range: `20140101..20141231`, presets are also allowed: `this_month`, `prev_month`, `next_month`, `this_quarter`, `prev_quarter`, `next_quarter`, `this_year`, `prev_year`, `next_year`. Used to indicate the period the detail applies to, independent of the document date. Revenue… */
				period?: string;
				/** The unit price for this detail. */
				price?: MoneybirdMoneyInput;
				/** The quantity for this detail, e.g. `1`, `5` or `0.5`. Defaults to 1 if not provided. */
				amount?: number | string;
				/** The ID of the tax rate to apply to this detail. Should be a valid tax rate id. If not provided, the administration's default tax rate is used. */
				tax_rate_id?: MoneybirdIdentifierInput;
				/** The ID of the ledger account (category) to book this detail to. Should be a valid ledger account id. */
				ledger_account_id?: MoneybirdIdentifierInput;
				/** The ID of the project to associate with this detail. Should be a valid project id. Used to track revenue and expenses per project. */
				project_id?: MoneybirdIdentifierInput;
				/** The ID of the product to use for this detail. When provided, the product's default price, tax rate, ledger account, description and period are applied as defaults. Explicitly provided values take precedence. Should be a valid product id. */
				product_id?: MoneybirdIdentifierInput;
				/** The position of this detail in the document, starting at 0. Used to control the display order of details. */
				row_order?: number | string;
				/** Whether this detail is optional. Optional details are shown on estimates but not included in the total unless selected by the client. Only allowed on estimates. */
				is_optional?: boolean | string;
				/** Whether this optional detail has been selected by the client. Only relevant when `is_optional` is true. */
				is_selected?: boolean | string;
				/** Set to `true` to remove this detail from the document. Requires the `id` of the existing detail. */
				_destroy?: boolean | string;
				/** Whether automatic tax calculation is enabled for this detail. When enabled, the tax rate is automatically determined based on the product's type and VAT rate type, combined with the contact's country, tax number and address. Requires a `product_id` with smart tax selection enabled (i.e.… */
				automated_tax_enabled?: boolean | string;
			}
	  >
	| Array<{
			/** The ID of an existing detail to update. Required when updating or removing an existing detail; omit when creating a new one. */
			id?: MoneybirdIdentifierInput;
			/** A free-text description for this detail, e.g. the name of the product or service delivered. */
			description?: string;
			/** String with a date range: `20140101..20141231`, presets are also allowed: `this_month`, `prev_month`, `next_month`, `this_quarter`, `prev_quarter`, `next_quarter`, `this_year`, `prev_year`, `next_year`. Used to indicate the period the detail applies to, independent of the document date. Revenue… */
			period?: string;
			/** The unit price for this detail. */
			price?: MoneybirdMoneyInput;
			/** The quantity for this detail, e.g. `1`, `5` or `0.5`. Defaults to 1 if not provided. */
			amount?: number | string;
			/** The ID of the tax rate to apply to this detail. Should be a valid tax rate id. If not provided, the administration's default tax rate is used. */
			tax_rate_id?: MoneybirdIdentifierInput;
			/** The ID of the ledger account (category) to book this detail to. Should be a valid ledger account id. */
			ledger_account_id?: MoneybirdIdentifierInput;
			/** The ID of the project to associate with this detail. Should be a valid project id. Used to track revenue and expenses per project. */
			project_id?: MoneybirdIdentifierInput;
			/** The ID of the product to use for this detail. When provided, the product's default price, tax rate, ledger account, description and period are applied as defaults. Explicitly provided values take precedence. Should be a valid product id. */
			product_id?: MoneybirdIdentifierInput;
			/** The position of this detail in the document, starting at 0. Used to control the display order of details. */
			row_order?: number | string;
			/** Whether this detail is optional. Optional details are shown on estimates but not included in the total unless selected by the client. Only allowed on estimates. */
			is_optional?: boolean | string;
			/** Whether this optional detail has been selected by the client. Only relevant when `is_optional` is true. */
			is_selected?: boolean | string;
			/** Set to `true` to remove this detail from the document. Requires the `id` of the existing detail. */
			_destroy?: boolean | string;
			/** Whether automatic tax calculation is enabled for this detail. When enabled, the tax rate is automatically determined based on the product's type and VAT rate type, combined with the contact's country, tax number and address. Requires a `product_id` with smart tax selection enabled (i.e.… */
			automated_tax_enabled?: boolean | string;
	  }>;

export type MoneybirdFiscalAllocationsAttributesInput =
	| Record<
			string,
			{
				/** The ID of an existing fiscal allocation to update. Required when updating or removing an existing allocation; omit when creating a new one. */
				id?: MoneybirdIdentifierInput;
				/** The ID of the ledger account (category) this allocation applies to. Must match a ledger account used in the document's details. */
				ledger_account_id?: MoneybirdIdentifierInput;
				/** The ID of the private ledger account (equity account) to allocate the private portion to. */
				private_ledger_account_id?: MoneybirdIdentifierInput;
				/** The percentage of expenses for the given ledger account that is allocated to private use. The total percentage across all allocations for the same ledger account on a document must not exceed 100. */
				percentage?: MoneybirdNumberInput;
				/** Set to `true` to remove this fiscal allocation from the document. Requires the `id` of the existing allocation. */
				_destroy?: boolean | string;
			}
	  >
	| Array<{
			/** The ID of an existing fiscal allocation to update. Required when updating or removing an existing allocation; omit when creating a new one. */
			id?: MoneybirdIdentifierInput;
			/** The ID of the ledger account (category) this allocation applies to. Must match a ledger account used in the document's details. */
			ledger_account_id?: MoneybirdIdentifierInput;
			/** The ID of the private ledger account (equity account) to allocate the private portion to. */
			private_ledger_account_id?: MoneybirdIdentifierInput;
			/** The percentage of expenses for the given ledger account that is allocated to private use. The total percentage across all allocations for the same ledger account on a document must not exceed 100. */
			percentage?: MoneybirdNumberInput;
			/** Set to `true` to remove this fiscal allocation from the document. Requires the `id` of the existing allocation. */
			_destroy?: boolean | string;
	  }>;

/** A unique record identifier */
export type MoneybirdIdentifierInput = string | number;

/** A unique record identifier */
export type MoneybirdIdentifierNullableInput = (string | number) | null;

/** An amount of money. Both a decimal and a string '10,95' are accepted. A string is bound to the same range as a number, -1,000,000,000 <= *n* <= 1,000,000,000. */
export type MoneybirdMoneyInput = (string | number) | null;

export type MoneybirdNumberInput = (string | number) | null;

export type MoneybirdTimestampInput = string;

export type MoneybirdAdministrationId = MoneybirdIdentifier;

export type MoneybirdAdministrationResponse = {
	id?: MoneybirdAdministrationId | null;
	name?: string | null;
	/** The ISO 639-1 language code used in the administration */
	language?: string | null;
	/** The ISO 4217 currency code */
	currency?: string | null;
	/** The ISO 3166-1 alpha-2 code the administration country */
	country?: string | null;
	/** The time zone of the administration */
	time_zone?: string | null;
	/** The type of acess the user has to this administration */
	access?: string | null;
	suspended?: boolean | null;
	period_locked_until?: string | null;
	/** Start of the year in which the administration recorded its first bookkeeping data, based on journal entries. */
	period_start_date?: string | null;
};

/** Aging report data item */
export type MoneybirdAgingReportItem = {
	contact_id?: MoneybirdIdentifierNullable | null;
	amount?: string | null;
	/** In this order: 0 to 30 days, 30 to 60 days, older, and the total of the contact, which equals `amount`. */
	aging_buckets?: Array<{
		/** In the language of the user. */
		name?: string | null;
		amount?: string | null;
	}> | null;
};

export type MoneybirdAssetResponse = {
	id?: MoneybirdIdentifierNullable | null;
	ledger_account_id?: MoneybirdIdentifierNullable | null;
	name?: string | null;
	purchase_date?: string | null;
	purchase_value?: MoneybirdNumber | null;
	/** Purchase value reduced by any reinvestment reserve purchase applied to the asset. */
	calculated_purchase_value?: MoneybirdNumber | null;
	current_value?: MoneybirdNumber | null;
	value_change_plan?: {
		lifespan_in_years?: number | null;
		residual_value?: MoneybirdNumber | null;
		active?: boolean | null;
		monthly_depreciation?: MoneybirdNumber | null;
	} | null;
	disposal?: MoneybirdDisposalResponse | null;
	value_changes?: Array<MoneybirdValueChangeResponse> | null;
	sources?: Array<MoneybirdSourceResponse> | null;
	reinvestment_reserve_purchase?: MoneybirdReinvestmentReservePurchaseResponse | null;
};

export type MoneybirdAttachmentResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	attachable_id?: MoneybirdIdentifier | null;
	attachable_type?: string | null;
	filename?: string | null;
	content_type?: string | null;
	size?: number | null;
	rotation?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Credit side of the balance sheet (equity and liabilities) */
export type MoneybirdBalanceSheetCredit = {
	/** Total credit amount */
	total?: string | null;
	equity?: MoneybirdBalanceSheetLedgerAccount | null;
	provisions?: MoneybirdBalanceSheetLedgerAccount | null;
	non_current_liabilities?: MoneybirdBalanceSheetLedgerAccount | null;
	current_liabilities?: MoneybirdBalanceSheetLedgerAccount | null;
	/** Results per open year */
	open_years?: Array<{
		year?: string | null;
		value?: string | null;
	}> | null;
};

/** Debit side of the balance sheet (assets) */
export type MoneybirdBalanceSheetDebit = {
	total?: string | null;
	current_assets?: MoneybirdBalanceSheetLedgerAccount | null;
	non_current_assets?: MoneybirdBalanceSheetLedgerAccount | null;
};

/** A list of ledger accounts with their value and child accounts */
export type MoneybirdBalanceSheetLedgerAccount = Array<{
	ledger_account_id?: string | null;
	value?: string | null;
	children?: Array<{
		ledger_account_id?: string | null;
		value?: string | null;
	}> | null;
}>;

export type MoneybirdBankBalanceAmounts = {
	/** The total of `financial_accounts`, the same as `closing_balance` of the cash flow report */
	total?: string | null;
	/** The booked balance of every financial account except private withdrawal accounts. Like the balance sheet, an account with a zero balance in every period is left out. */
	financial_accounts?: Array<{
		financial_account_id?: MoneybirdIdentifier | null;
		name?: string | null;
		/** The kind of financial account, such as `BankAccount` or `CreditCardAccount` */
		type?: string | null;
		balance?: string | null;
	}> | null;
};

export type MoneybirdBaseContactResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	company_name?: MoneybirdJsonValue | null;
	firstname?: string | null;
	lastname?: string | null;
	address1?: string | null;
	address2?: string | null;
	zipcode?: string | null;
	city?: string | null;
	country?: string | null;
	phone?: string | null;
	delivery_method?: string | null;
	/** Will be assigned automatically if empty */
	customer_id?: string | null;
	tax_number?: string | null;
	chamber_of_commerce?: string | null;
	/** The SEPA IBAN of the contact, can be empty if no SEPA IBAN is set */
	bank_account?: string | null;
	is_trusted?: boolean | null;
	max_transfer_amount?: string | null;
	attention?: string | null;
	email?: string | null;
	email_ubl?: boolean | null;
	send_invoices_to_attention?: string | null;
	send_invoices_to_email?: string | null;
	send_estimates_to_attention?: string | null;
	send_estimates_to_email?: string | null;
	send_reminders_to_attention?: string | null;
	send_reminders_to_email?: string | null;
	direct_debit?: boolean | null;
	sepa_active?: boolean | null;
	sepa_iban?: string | null;
	sepa_iban_account_name?: string | null;
	sepa_bic?: string | null;
	sepa_mandate_id?: string | null;
	sepa_mandate_date?: string | null;
	sepa_sequence_type?: string | null;
	credit_card_number?: string | null;
	credit_card_reference?: string | null;
	credit_card_type?: string | null;
	tax_number_validated_at?: string | null;
	tax_number_valid?: boolean | null;
	invoice_workflow_id?: MoneybirdIdentifierNullable | null;
	estimate_workflow_id?: MoneybirdIdentifierNullable | null;
	si_identifier?: string | null;
	si_identifier_type?: string | null;
	/** Whether the contact has a valid Moneybird Payments mandate */
	moneybird_payments_mandate?: boolean | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	version?: number | null;
	sales_invoices_url?: string | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	custom_fields?: Array<MoneybirdCustomFieldValueResponse> | null;
	contact_people?: Array<MoneybirdContactPersonResponse> | null;
	archived?: boolean | null;
};

export type MoneybirdBaseUserResponse = {
	id?: MoneybirdIdentifier | null;
	name?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdCashFlowAmounts = {
	cash_received_by_ledger_account?: MoneybirdLedgerAccountData | null;
	cash_paid_by_ledger_account?: MoneybirdLedgerAccountData | null;
	/** The balance of the financial accounts at the start of the period */
	opening_balance?: string | null;
	/** The balance of the financial accounts at the end of the period */
	closing_balance?: string | null;
};

export type MoneybirdContactPersonResponse = {
	id?: MoneybirdIdentifierNullable | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	administration_id?: MoneybirdAdministrationId | null;
	firstname?: string | null;
	lastname?: string | null;
	phone?: string | null;
	email?: string | null;
	department?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	version?: number | null;
};

/** Contact report data item */
export type MoneybirdContactReportItem = {
	contact_id?: MoneybirdIdentifierNullable | null;
	amount?: string | null;
};

export type MoneybirdContactResponse = MoneybirdBaseContactResponse & {
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
};

/** Creditors report data item */
export type MoneybirdCreditorsReportItem = {
	contact_id?: MoneybirdIdentifierNullable | null;
	amount?: string | null;
};

/** ISO 4217 currency code */
export type MoneybirdCurrency = string;

export type MoneybirdCustomFieldResponse = {
	id?: MoneybirdIdentifierNullable | null;
	administration_id?: MoneybirdAdministrationId | null;
	name?: string | null;
	source?: string | null;
};

export type MoneybirdCustomFieldValueResponse = {
	id?: MoneybirdIdentifier | null;
	name?: string | null;
	value?: string | null;
};

/** Debtors report data item */
export type MoneybirdDebtorsReportItem = {
	contact_id?: MoneybirdIdentifierNullable | null;
	amount?: string | null;
};

export type MoneybirdDetailResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	tax_rate_id?: MoneybirdIdentifier | null;
	ledger_account_id?: MoneybirdIdentifier | null;
	project_id?: MoneybirdIdentifierNullable | null;
	product_id?: MoneybirdIdentifierNullable | null;
	amount?: string | null;
	amount_decimal?: string | null;
	description?: string | null;
	price?: string | null;
	/** The period this detail belongs to for bookkeeping, independent of the document date. Revenue or expenses are spread over this period in the reports, so a detail on an invoice dated in May can belong to January. Use this field, not the document date, to tell which months a detail covers. Null… */
	period?: string | null;
	row_order?: number | null;
	total_price_excl_tax_with_discount?: MoneybirdNumber | null;
	total_price_excl_tax_with_discount_base?: MoneybirdNumber | null;
	tax_report_reference?: Array<string | null> | null;
	mandatory_tax_text?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	is_optional?: boolean | null;
	is_selected?: boolean | null;
};

export type MoneybirdDisposalResponse = {
	date?: string | null;
	reason?: string | null;
	externally_booked?: boolean | null;
	asset_id?: MoneybirdIdentifier | null;
	reinvestment_reserve_sale?: MoneybirdReinvestmentReserveSaleResponse | null;
};

export type MoneybirdDocumentStyleResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	name?: string | null;
	identity_id?: MoneybirdIdentifier | null;
	default?: boolean | null;
	logo_hash?: string | null;
	logo_container_full_width?: boolean | null;
	logo_display_width?: number | null;
	logo_position?: string | null;
	background_hash?: string | null;
	paper_size?: string | null;
	address_position?: string | null;
	font_size?: number | null;
	font_family?: string | null;
	print_on_stationery?: boolean | null;
	custom_css?: string | null;
	invoice_sender_address?: Array<Record<string, string | boolean>> | null;
	invoice_metadata_left?: Array<Record<string, string | boolean>> | null;
	invoice_metadata_right?: Array<Record<string, string | boolean>> | null;
	estimate_sender_address?: Array<Record<string, string | boolean>> | null;
	estimate_metadata_left?: Array<Record<string, string | boolean>> | null;
	estimate_metadata_right?: Array<Record<string, string | boolean>> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MoneybirdDownloadResponse = {
	id?: MoneybirdIdentifier | null;
	/** The user who created the download */
	user_id?: MoneybirdIdentifierNullable | null;
	/** The type of download (e.g., export_contacts, export_sales_invoices, auditfile) */
	download_type?: string | null;
	filename?: string | null;
	content_type?: string | null;
	failed?: boolean | null;
	downloaded?: boolean | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdEstimateResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifier | null;
	contact?: MoneybirdSimpleContactResponse | null;
	contact_person_id?: MoneybirdIdentifierNullable | null;
	contact_person?: MoneybirdContactPersonResponse | null;
	estimate_id?: string | null;
	estimate_sequence_id?: string | null;
	workflow_id?: MoneybirdIdentifier | null;
	document_style_id?: MoneybirdIdentifier | null;
	identity_id?: MoneybirdIdentifier | null;
	draft_id?: number | null;
	state?: string | null;
	estimate_date?: string | null;
	due_date?: string | null;
	reference?: string | null;
	language?: string | null;
	currency?: string | null;
	exchange_rate?: MoneybirdNumber | null;
	discount?: MoneybirdNumber | null;
	original_estimate_id?: MoneybirdIdentifierNullable | null;
	show_tax?: boolean | null;
	sign_online?: boolean | null;
	sent_at?: string | null;
	accepted_at?: string | null;
	rejected_at?: string | null;
	archived_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	public_view_code?: string | null;
	public_view_code_expires_at?: string | null;
	version?: number | null;
	pre_text?: string | null;
	post_text?: string | null;
	details?: Array<MoneybirdDetailResponse> | null;
	prices_are_incl_tax?: boolean | null;
	total_price_excl_tax?: MoneybirdNumber | null;
	total_price_excl_tax_base?: MoneybirdNumber | null;
	total_price_incl_tax?: MoneybirdNumber | null;
	total_price_incl_tax_base?: MoneybirdNumber | null;
	total_discount?: MoneybirdNumber | null;
	url?: string | null;
	custom_fields?: Array<MoneybirdCustomFieldValueResponse> | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
	tax_totals?: Array<MoneybirdTaxSubtotalResponse> | null;
};

export type MoneybirdEventResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	user_id?: MoneybirdIdentifier | null;
	action?: string | null;
	/** The type of the record the event is about, for example `Contact`, `SalesInvoice` or `Document`. Purchase invoices, receipts and the other document types are `Document`. */
	entity_type?: string | null;
	/** The record the event is about. Empty when that record was deleted. */
	entity_id?: MoneybirdIdentifierNullable | null;
	link_entity_id?: MoneybirdIdentifierNullable | null;
	link_entity_type?: string | null;
	/** Details of the event. For an update, the changed attributes are `[old_value, new_value]` pairs. */
	data?: Record<string, MoneybirdJsonValue> | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdExtendedUserResponse = MoneybirdBaseUserResponse & {
	email?: string | null;
	email_validated?: boolean | null;
	language?: string | null;
	time_zone?: string | null;
	user_type?: string | null;
	permissions?: Array<string> | null;
};

export type MoneybirdExternalSalesInvoiceResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	contact?: MoneybirdSimpleContactResponse | null;
	date?: string | null;
	state?: string | null;
	due_date?: string | null;
	reference?: string | null;
	entry_number?: number | null;
	origin?: string | null;
	source?: string | null;
	source_url?: string | null;
	currency?: MoneybirdCurrency | null;
	paid_at?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	version?: MoneybirdVersion | null;
	details?: Array<MoneybirdDetailResponse> | null;
	payments?: Array<MoneybirdPaymentResponse> | null;
	total_paid?: string | null;
	total_unpaid?: string | null;
	total_unpaid_base?: string | null;
	prices_are_incl_tax?: boolean | null;
	total_price_excl_tax?: string | null;
	total_price_excl_tax_base?: string | null;
	total_price_incl_tax?: string | null;
	total_price_incl_tax_base?: string | null;
	marked_dubious_on?: string | null;
	marked_uncollectible_on?: string | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
	tax_totals?: Array<MoneybirdTaxSubtotalResponse> | null;
};

export type MoneybirdFinancialAccountResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	type?: string | null;
	name?: string | null;
	identifier?: string | null;
	currency?: MoneybirdCurrency | null;
	provider?: string | null;
	/** Whether Moneybird provides this account (Moneybird Betaalrekening or Moneybird Online Betaalmethoden), rather than an account at an external bank or provider. */
	moneybird_account?: boolean | null;
	active?: boolean | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdFinancialMutationResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	amount?: string | null;
	code?: string | null;
	date?: string | null;
	message?: string | null;
	contra_account_name?: string | null;
	contra_account_number?: string | null;
	state?: string | null;
	settlement_state?: string | null;
	amount_open?: string | null;
	sepa_fields?: Record<string, MoneybirdJsonValue> | null;
	batch_reference?: string | null;
	financial_account_id?: MoneybirdIdentifier | null;
	currency?: MoneybirdCurrency | null;
	original_amount?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	version?: MoneybirdVersion | null;
	financial_statement_id?: MoneybirdIdentifier | null;
	processed_at?: string | null;
	account_servicer_transaction_id?: string | null;
	payments?: Array<MoneybirdPaymentResponse> | null;
	ledger_account_bookings?: Array<MoneybirdLedgerAccountBookingResponse> | null;
};

export type MoneybirdFinancialStatementResponse = {
	id?: MoneybirdIdentifier | null;
	financial_account_id?: MoneybirdIdentifier | null;
	reference?: string | null;
	official_date?: string | null;
	official_balance?: string | null;
	importer_service?: string | null;
	financial_mutations?: Array<MoneybirdFinancialMutationResponse> | null;
};

export type MoneybirdFiscalAllocationResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	ledger_account_id?: MoneybirdIdentifier | null;
	private_ledger_account_id?: MoneybirdIdentifier | null;
	percentage?: MoneybirdNumber | null;
	price?: MoneybirdNumber | null;
	price_base?: MoneybirdNumber | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdGeneralDocumentResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	contact?: MoneybirdSimpleContactResponse | null;
	reference?: string | null;
	date?: string | null;
	due_date?: string | null;
	entry_number?: number | null;
	state?: string | null;
	exchange_rate?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	version?: MoneybirdVersion | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
};

export type MoneybirdGeneralJournalDocumentEntryResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	ledger_account_id?: MoneybirdIdentifier | null;
	project_id?: MoneybirdIdentifierNullable | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	debit?: string | null;
	credit?: string | null;
	row_order?: number | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	description?: string | null;
};

export type MoneybirdGeneralJournalDocumentResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	reference?: string | null;
	date?: string | null;
	journal_type?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	version?: MoneybirdVersion | null;
	general_journal_document_entries?: Array<MoneybirdGeneralJournalDocumentEntryResponse> | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
};

export type MoneybirdGeneralLedgerAmounts = {
	debit_sums?: MoneybirdLedgerAccountData | null;
	credit_sums?: MoneybirdLedgerAccountData | null;
	start_balance?: MoneybirdLedgerAccountData | null;
	final_balance?: MoneybirdLedgerAccountData | null;
};

/** A unique record identifier */
export type MoneybirdIdentifier = string | number;

/** A unique record identifier */
export type MoneybirdIdentifierNullable = (string | number) | null;

export type MoneybirdIdentityResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	company_name?: string | null;
	city?: string | null;
	country?: string | null;
	zipcode?: string | null;
	address1?: string | null;
	address2?: string | null;
	email?: string | null;
	phone?: string | null;
	bank_account_name?: string | null;
	bank_account_number?: string | null;
	bank_account_bic?: string | null;
	custom_fields?: Array<MoneybirdCustomFieldValueResponse> | null;
	updated_at?: MoneybirdTimestamp | null;
	created_at?: MoneybirdTimestamp | null;
	chamber_of_commerce?: string | null;
	tax_number?: string | null;
};

export type MoneybirdLedgerAccountBookingResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	financial_mutation_id?: MoneybirdIdentifier | null;
	ledger_account_id?: MoneybirdIdentifier | null;
	project_id?: MoneybirdIdentifierNullable | null;
	description?: string | null;
	price?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

/** Data grouped by ledger account. Contains an array of ledger account entries with ledger_account_id and value. */
export type MoneybirdLedgerAccountData = {
	/** Array of ledger account entries with ledger_account_id and value. */
	ledger_accounts?: Array<{
		/** The ID of the ledger account */
		ledger_account_id?: string | null;
		/** The value for this ledger account */
		value?: string | null;
	}> | null;
};

export type MoneybirdLedgerAccountResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	name?: string | null;
	account_type?: string | null;
	account_id?: string | null;
	parent_id?: MoneybirdIdentifierNullable | null;
	active?: boolean | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	allowed_document_types?: Array<string> | null;
	taxonomy_item?: MoneybirdTaxonomyItemResponse | null;
	financial_account_id?: MoneybirdIdentifierNullable | null;
};

export type MoneybirdMinimalContactResponse = {
	id?: MoneybirdIdentifier | null;
	firstname?: string | null;
	lastname?: string | null;
	company_name?: string | null;
};

export type MoneybirdMinimalTimeEntryResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	project_id?: MoneybirdIdentifierNullable | null;
	user_id?: MoneybirdIdentifier | null;
	started_at?: MoneybirdTimestamp | null;
	ended_at?: MoneybirdTimestamp | null;
	description?: string | null;
	paused_duration?: number | null;
	billable?: boolean | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdNoteResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	entity_id?: MoneybirdIdentifierNullable | null;
	entity_type?: string | null;
	user_id?: MoneybirdIdentifier | null;
	assignee_id?: MoneybirdIdentifierNullable | null;
	todo?: (boolean | string) | null;
	note?: string | null;
	completed_at?: string | null;
	completed_by_id?: MoneybirdIdentifierNullable | null;
	todo_type?: string | null;
	data?: Record<string, MoneybirdJsonValue> | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdNumber = (string | number) | null;

export type MoneybirdPaymentResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	invoice_type?: string | null;
	invoice_id?: MoneybirdIdentifier | null;
	financial_account_id?: MoneybirdIdentifierNullable | null;
	user_id?: MoneybirdIdentifier | null;
	payment_transaction_id?: MoneybirdIdentifierNullable | null;
	transaction_identifier?: string | null;
	price?: MoneybirdNumber | null;
	price_base?: MoneybirdNumber | null;
	payment_date?: string | null;
	credit_invoice_id?: MoneybirdIdentifierNullable | null;
	financial_mutation_id?: MoneybirdIdentifierNullable | null;
	ledger_account_id?: MoneybirdIdentifierNullable | null;
	linked_payment_id?: MoneybirdIdentifierNullable | null;
	manual_payment_action?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdProductResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	description?: string | null;
	title?: string | null;
	identifier?: string | null;
	price?: string | null;
	currency?: string | null;
	frequency?: number | null;
	frequency_type?: string | null;
	tax_rate_id?: MoneybirdIdentifierNullable | null;
	ledger_account_id?: MoneybirdIdentifier | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdProfitLossAmounts = {
	revenue_by_ledger_account?: MoneybirdLedgerAccountData | null;
	direct_costs_by_ledger_account?: MoneybirdLedgerAccountData | null;
	expenses_by_ledger_account?: MoneybirdLedgerAccountData | null;
	other_income_expenses_by_ledger_account?: MoneybirdLedgerAccountData | null;
	/** `total_revenue` minus the total of `direct_costs_by_ledger_account` */
	gross_profit?: string | null;
	/** `gross_profit` minus the total of `expenses_by_ledger_account`, so excluding other income and expenses */
	operating_profit?: string | null;
	/** `total_revenue` minus `total_expenses` */
	net_profit?: string | null;
	/** The total of `direct_costs_by_ledger_account` plus `expenses_by_ledger_account` minus `other_income_expenses_by_ledger_account` */
	total_expenses?: string | null;
	/** The total of `revenue_by_ledger_account` */
	total_revenue?: string | null;
};

/** Project report data item */
export type MoneybirdProjectReportItem = {
	project_id?: MoneybirdIdentifierNullable | null;
	amount?: string | null;
};

export type MoneybirdProjectResponse = {
	id?: MoneybirdIdentifier | null;
	name?: string | null;
	state?: string | null;
	budget?: number | null;
};

export type MoneybirdPurchaseInvoiceResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	contact?: MoneybirdSimpleContactResponse | null;
	reference?: string | null;
	/** The date of the record itself. It does not say which periods the amounts belong to, because a detail can carry its own `period` and a record dated in one month can cover another. Read `details[].period` for the periods; only a detail without a period of its own lands on this date. */
	date?: string | null;
	due_date?: string | null;
	entry_number?: number | null;
	state?: string | null;
	currency?: MoneybirdCurrency | null;
	exchange_rate?: string | null;
	revenue_invoice?: boolean | null;
	prices_are_incl_tax?: boolean | null;
	origin?: string | null;
	paid_at?: string | null;
	tax_number?: string | null;
	total_price_excl_tax?: string | null;
	total_price_excl_tax_base?: string | null;
	total_price_incl_tax?: string | null;
	total_price_incl_tax_base?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	version?: MoneybirdVersion | null;
	details?: Array<MoneybirdDetailResponse> | null;
	fiscal_allocations?: Array<MoneybirdFiscalAllocationResponse> | null;
	payments?: Array<MoneybirdPaymentResponse> | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
};

export type MoneybirdPurchaseTransactionBatchResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	financial_account_id?: MoneybirdIdentifier | null;
	state?: string | null;
	identifier?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdPurchaseTransactionResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	financial_account_id?: MoneybirdIdentifier | null;
	purchase_transaction_batch_id?: MoneybirdIdentifierNullable | null;
	payment_instrument_id?: MoneybirdIdentifierNullable | null;
	state?: string | null;
	sepa_iban?: string | null;
	sepa_iban_account_name?: string | null;
	sepa_bic?: string | null;
	source_sepa_iban?: string | null;
	source_sepa_iban_account_name?: string | null;
	date?: string | null;
	description?: string | null;
	end_to_end_id?: string | null;
	contact?: MoneybirdSimpleContactResponse | null;
	amount?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	payable_type?: string | null;
	payable_id?: MoneybirdIdentifierNullable | null;
	payment_method?: string | null;
};

export type MoneybirdReceiptResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	contact?: MoneybirdSimpleContactResponse | null;
	reference?: string | null;
	/** The date of the record itself. It does not say which periods the amounts belong to, because a detail can carry its own `period` and a record dated in one month can cover another. Read `details[].period` for the periods; only a detail without a period of its own lands on this date. */
	date?: string | null;
	due_date?: string | null;
	entry_number?: number | null;
	state?: string | null;
	currency?: string | null;
	exchange_rate?: MoneybirdNumber | null;
	revenue_invoice?: boolean | null;
	prices_are_incl_tax?: boolean | null;
	origin?: string | null;
	paid_at?: string | null;
	tax_number?: string | null;
	total_price_excl_tax?: string | null;
	total_price_excl_tax_base?: string | null;
	total_price_incl_tax?: string | null;
	total_price_incl_tax_base?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	version?: MoneybirdVersion | null;
	details?: Array<MoneybirdDetailResponse> | null;
	fiscal_allocations?: Array<MoneybirdFiscalAllocationResponse> | null;
	payments?: Array<MoneybirdPaymentResponse> | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
};

export type MoneybirdRecurringContractResponse = {
	type?: string | null;
	sepa_mandate?: boolean | null;
	bank?: string | null;
	iban?: string | null;
	bic?: string | null;
	iban_account_name?: string | null;
	card_expiry_month?: string | null;
	card_expiry_year?: string | null;
	card_final_digits?: string | null;
	created_at?: MoneybirdTimestamp | null;
};

export type MoneybirdRecurringSalesInvoiceResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifier | null;
	contact?: MoneybirdSimpleContactResponse | null;
	contact_person_id?: MoneybirdIdentifierNullable | null;
	contact_person?: MoneybirdContactPersonResponse | null;
	workflow_id?: MoneybirdIdentifier | null;
	start_date?: string | null;
	invoice_date?: string | null;
	last_date?: string | null;
	active?: boolean | null;
	payment_conditions?: string | null;
	reference?: string | null;
	language?: string | null;
	currency?: string | null;
	discount?: string | null;
	first_due_interval?: number | null;
	auto_send?: boolean | null;
	sending_scheduled_at?: string | null;
	sending_scheduled_user_id?: MoneybirdIdentifierNullable | null;
	frequency_type?: string | null;
	frequency?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
	version?: MoneybirdVersion | null;
	prices_are_incl_tax?: boolean | null;
	total_price_excl_tax?: string | null;
	total_price_excl_tax_base?: string | null;
	total_price_incl_tax?: string | null;
	total_price_incl_tax_base?: string | null;
	details?: Array<MoneybirdDetailResponse> | null;
	custom_fields?: Array<MoneybirdCustomFieldValueResponse> | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
	subscription?: MoneybirdSubscriptionResponse | null;
};

export type MoneybirdReinvestmentReservePurchaseResponse = {
	id?: MoneybirdIdentifier | null;
	amount?: MoneybirdNumber | null;
	date?: string | null;
	asset_id?: MoneybirdIdentifier | null;
};

export type MoneybirdReinvestmentReserveSaleResponse = {
	id?: MoneybirdIdentifier | null;
	amount?: MoneybirdNumber | null;
	date?: string | null;
	disposal_id?: MoneybirdIdentifier | null;
};

export type MoneybirdSalesInvoiceResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifier | null;
	contact?: MoneybirdSimpleContactResponse | null;
	contact_person_id?: MoneybirdIdentifierNullable | null;
	contact_person?: MoneybirdContactPersonResponse | null;
	/** The invoice number. It is `null` while the invoice is a draft. */
	invoice_id?: string | null;
	recurring_sales_invoice_id?: MoneybirdIdentifierNullable | null;
	subscription_id?: MoneybirdIdentifierNullable | null;
	workflow_id?: MoneybirdIdentifier | null;
	document_style_id?: MoneybirdIdentifier | null;
	identity_id?: MoneybirdIdentifier | null;
	/** Sequence number a draft is referred to by while it has no invoice number yet. */
	draft_id?: number | null;
	state?: string | null;
	/** The date of the record itself. It does not say which periods the amounts belong to, because a detail can carry its own `period` and a record dated in one month can cover another. Read `details[].period` for the periods; only a detail without a period of its own lands on this date. */
	invoice_date?: string | null;
	due_date?: string | null;
	payment_conditions?: string | null;
	payment_reference?: string | null;
	short_payment_reference?: string | null;
	reference?: string | null;
	language?: string | null;
	currency?: string | null;
	discount?: string | null;
	original_sales_invoice_id?: MoneybirdIdentifierNullable | null;
	paused?: boolean | null;
	paid_at?: string | null;
	sent_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	public_view_code?: string | null;
	public_view_code_expires_at?: string | null;
	version?: MoneybirdVersion | null;
	details?: Array<MoneybirdDetailResponse> | null;
	payments?: Array<MoneybirdPaymentResponse> | null;
	total_paid?: string | null;
	total_unpaid?: string | null;
	total_unpaid_base?: string | null;
	prices_are_incl_tax?: boolean | null;
	total_price_excl_tax?: string | null;
	total_price_excl_tax_base?: string | null;
	total_price_incl_tax?: string | null;
	total_price_incl_tax_base?: string | null;
	total_discount?: string | null;
	marked_dubious_on?: string | null;
	marked_uncollectible_on?: string | null;
	reminder_count?: number | null;
	next_reminder?: string | null;
	original_estimate_id?: MoneybirdIdentifierNullable | null;
	url?: string | null;
	payment_url?: string | null;
	custom_fields?: Array<MoneybirdCustomFieldValueResponse> | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
	tax_totals?: Array<MoneybirdTaxSubtotalResponse> | null;
	time_entries?: Array<MoneybirdMinimalTimeEntryResponse> | null;
};

export type MoneybirdSimpleContactResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	company_name?: string | null;
	firstname?: string | null;
	lastname?: string | null;
	address1?: string | null;
	address2?: string | null;
	zipcode?: string | null;
	city?: string | null;
	country?: string | null;
	phone?: string | null;
	delivery_method?: string | null;
	customer_id?: string | null;
	tax_number?: string | null;
	chamber_of_commerce?: string | null;
	bank_account?: string | null;
	is_trusted?: boolean | null;
	max_transfer_amount?: string | null;
	attention?: string | null;
	email?: string | null;
	email_ubl?: boolean | null;
	send_invoices_to_attention?: string | null;
	send_invoices_to_email?: string | null;
	send_estimates_to_attention?: string | null;
	send_estimates_to_email?: string | null;
	send_reminders_to_attention?: string | null;
	send_reminders_to_email?: string | null;
	direct_debit?: boolean | null;
	sepa_active?: boolean | null;
	sepa_iban?: string | null;
	sepa_iban_account_name?: string | null;
	sepa_bic?: string | null;
	sepa_mandate_id?: string | null;
	sepa_mandate_date?: string | null;
	sepa_sequence_type?: string | null;
	credit_card_number?: string | null;
	credit_card_reference?: string | null;
	credit_card_type?: string | null;
	tax_number_validated_at?: string | null;
	tax_number_valid?: boolean | null;
	invoice_workflow_id?: MoneybirdIdentifierNullable | null;
	estimate_workflow_id?: MoneybirdIdentifierNullable | null;
	si_identifier?: string | null;
	si_identifier_type?: string | null;
	moneybird_payments_mandate?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	version?: MoneybirdVersion | null;
	sales_invoices_url?: string | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	custom_fields?: Array<MoneybirdCustomFieldValueResponse> | null;
	contact_people?: Array<MoneybirdContactPersonResponse> | null;
	archived?: boolean | null;
};

export type MoneybirdSourceResponse = {
	id?: MoneybirdIdentifier | null;
	asset_id?: MoneybirdIdentifier | null;
	detail_id?: MoneybirdIdentifier | null;
	general_journal_document_entry_id?: MoneybirdIdentifier | null;
};

export type MoneybirdSubscriptionAdditionalChargeResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	subscription_id?: MoneybirdIdentifierNullable | null;
	product_id?: MoneybirdIdentifier | null;
	detail_id?: MoneybirdIdentifierNullable | null;
	amount?: string | null;
	price?: string | null;
	period?: string | null;
	description?: string | null;
};

export type MoneybirdSubscriptionProductResponse = {
	start_date?: string | null;
	end_date?: string | null;
	product_id?: MoneybirdIdentifier | null;
	product?: MoneybirdProductResponse | null;
	amount?: string | null;
	discount?: string | null;
};

export type MoneybirdSubscriptionResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	start_date?: string | null;
	end_date?: string | null;
	frequency?: number | null;
	frequency_type?: string | null;
	reference?: string | null;
	cancelled_at?: string | null;
	product_id?: MoneybirdIdentifier | null;
	product?: MoneybirdProductResponse | null;
	contact_id?: MoneybirdIdentifier | null;
	contact?: MoneybirdSimpleContactResponse | null;
	contact_person_id?: MoneybirdIdentifierNullable | null;
	contact_person?: MoneybirdContactPersonResponse | null;
	subscription_products?: Array<MoneybirdSubscriptionProductResponse> | null;
	recurring_sales_invoice_id?: MoneybirdIdentifierNullable | null;
};

export type MoneybirdSubscriptionTemplateResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	workflow_id?: MoneybirdIdentifier | null;
	document_style_id?: MoneybirdIdentifier | null;
	mergeable?: boolean | null;
	contact_can_update?: boolean | null;
	products?: Array<MoneybirdProductResponse> | null;
};

export type MoneybirdTaskListGroupResponse = {
	id?: MoneybirdIdentifier | null;
	name?: string | null;
	row_order?: number | null;
	report_type?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	tasks?: Array<MoneybirdTaskListTaskResponse> | null;
};

export type MoneybirdTaskListResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdIdentifier | null;
	name?: string | null;
	description?: string | null;
	deadline_on?: string | null;
	period_begin?: string | null;
	period_end?: string | null;
	completed?: boolean | null;
	template_id?: MoneybirdIdentifierNullable | null;
	total_tasks_count?: number | null;
	completed_tasks_count?: number | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	groups?: Array<MoneybirdTaskListGroupResponse> | null;
};

export type MoneybirdTaskListTaskResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdIdentifier | null;
	name?: string | null;
	description?: string | null;
	row_order?: number | null;
	completed_at?: string | null;
	report_type?: string | null;
	task_lists_group_id?: MoneybirdIdentifierNullable | null;
	parent_task_id?: MoneybirdIdentifierNullable | null;
	assignee_id?: MoneybirdIdentifierNullable | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	subtasks?: Array<MoneybirdTaskListTaskResponse> | null;
	notes?: Array<MoneybirdNoteResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
};

export type MoneybirdTaskListTemplateResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdIdentifier | null;
	name?: string | null;
	description?: string | null;
	/** ISO 8601 duration string (e.g. "P1M" for one month, "P3M" for one quarter, "P1Y" for one year) */
	period?: string | null;
	/** ISO 8601 duration string representing the deadline offset from the period end */
	deadline_after?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	groups?: Array<MoneybirdTaskListGroupResponse> | null;
};

export type MoneybirdTaxRateResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	name?: string | null;
	percentage?: MoneybirdNumber | null;
	tax_rate_type?: string | null;
	show_tax?: boolean | null;
	active?: boolean | null;
	country?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MoneybirdTaxReportAmounts = {
	tax_rates?: Array<{
		tax_rate_id?: MoneybirdIdentifier | null;
		name?: string | null;
		percentage?: string | null;
		report_reference?: string | null;
		amount?: string | null;
		type?: string | null;
		tax?: string | null;
	}> | null;
};

export type MoneybirdTaxSubtotalResponse = {
	tax_rate_id?: MoneybirdIdentifier | null;
	taxable_amount?: MoneybirdNumber | null;
	taxable_amount_base?: MoneybirdNumber | null;
	tax_amount?: MoneybirdNumber | null;
	tax_amount_base?: MoneybirdNumber | null;
};

export type MoneybirdTaxonomyItemResponse = {
	taxonomy_version?: string | null;
	code?: string | null;
	name?: string | null;
	name_english?: string | null;
	reference?: string | null;
};

export type MoneybirdTimeEntryResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	project_id?: MoneybirdIdentifierNullable | null;
	sales_invoice_id?: MoneybirdIdentifierNullable | null;
	user_id?: MoneybirdIdentifier | null;
	started_at?: MoneybirdTimestamp | null;
	ended_at?: MoneybirdTimestamp | null;
	description?: string | null;
	paused_duration?: number | null;
	billable?: boolean | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	contact?: MoneybirdMinimalContactResponse | null;
	user?: MoneybirdUserResponse | null;
	project?: MoneybirdProjectResponse | null;
	sales_invoice?: MoneybirdSalesInvoiceResponse | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
	notes?: Array<MoneybirdNoteResponse> | null;
};

export type MoneybirdTimestamp = string;

export type MoneybirdTypelessDocumentResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	contact_id?: MoneybirdIdentifierNullable | null;
	contact?: MoneybirdSimpleContactResponse | null;
	reference?: string | null;
	date?: string | null;
	state?: string | null;
	origin?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	version?: MoneybirdVersion | null;
	attachments?: Array<MoneybirdAttachmentResponse> | null;
	/** Use `GET /{administration_id}/events` with `entity_type` and `entity_id` instead. */
	events?: Array<MoneybirdEventResponse> | null;
};

export type MoneybirdUserResponse = MoneybirdBaseUserResponse;

export type MoneybirdValueChangeResponse = {
	type?: string | null;
	date?: string | null;
	amount?: MoneybirdNumber | null;
	description?: string | null;
	externally_booked?: boolean | null;
	asset_id?: MoneybirdIdentifier | null;
};

export type MoneybirdVerificationResponse = {
	emails?: Array<string> | null;
	bank_account_numbers?: Array<string> | null;
	chamber_of_commerce_number?: string | null;
	tax_number?: string | null;
};

export type MoneybirdVersion = number;

export type MoneybirdWebhookResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	url?: string | null;
	/** List of events this webhook is subscribed to. See [webhook events](https://developer.moneybird.com/webhooks/events) for all available events and event groups. */
	enabled_events?: Array<string> | null;
	/** HTTP status code of the request last received back from the webhook */
	last_http_status?: (number | string) | null;
	/** Body of the request last received back from the webhook */
	last_http_body?: string | null;
	token?: string | null;
	/** The webhook's secret, used to generate webhook signatures. Only returned at creation. */
	secret?: string | null;
	/** Timestamp when the webhook was deactivated. Null if the webhook is active. */
	deactivated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdWorkflowResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	type?: string | null;
	name?: string | null;
	default?: boolean | null;
	currency?: string | null;
	language?: string | null;
	active?: boolean | null;
	prices_are_incl_tax?: boolean | null;
	payment_methods?: Array<string> | null;
	collection_method?: string | null;
	number_of_collections?: number | null;
	show_qr_code?: boolean | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
	steps?: Array<MoneybirdWorkflowStepResponse> | null;
};

export type MoneybirdWorkflowStepResponse = {
	id?: MoneybirdIdentifier | null;
	administration_id?: MoneybirdAdministrationId | null;
	step_order?: number | null;
	due_interval?: number | null;
	reminder_delay?: number | null;
	reminder_text?: string | null;
	reminder_auto_send?: boolean | null;
	action?: string | null;
	created_at?: MoneybirdTimestamp | null;
	updated_at?: MoneybirdTimestamp | null;
};

export type MoneybirdWorkingCapitalAmounts = {
	/** Current assets minus current liabilities */
	working_capital?: string | null;
	/** The balance of the financial accounts, or zero when that balance is negative */
	bank?: string | null;
	/** The current assets other than `bank` */
	to_receive?: string | null;
	/** The current liabilities, including a negative balance of the financial accounts */
	to_pay?: string | null;
};

export type MoneybirdOperationInputs = {
	'administrations.list': Record<string, never>;
	'assets.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		asset?: {
			/** The name of the asset */
			name: string;
			/** The ID of the ledger account */
			ledger_account_id: MoneybirdIdentifierInput;
			/** The purchase date of the asset */
			purchase_date: string;
			/** The purchase value of the asset */
			purchase_value: MoneybirdMoneyInput;
			/** The depreciation plan of the asset. Required, except on a land or building ledger account, where a depreciation plan is not allowed. */
			value_change_plan_attributes?: {
				/** The lifespan of the asset in years */
				lifespan_in_years: MoneybirdNumberInput;
				/** The residual value of the asset at the end of the lifespan */
				residual_value?: MoneybirdMoneyInput;
			};
		};
	};
	'assets.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'assets.disposals.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** Has to be after the purchase date of the asset, and cannot be in the future or in the locked period of the administration. */
		date: string;
		reason: 'out_of_use' | 'sold' | 'private_withdrawal' | 'divested';
	};
	'assets.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'assets.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filter on the ID of the ledger account */
		ledger_account_id?: MoneybirdIdentifierInput;
		/** Whether to include only active assets */
		active?: boolean | string;
		per_page?: number | string;
		page?: number | string;
	};
	'assets.reinvestmentReservePurchase.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** The amount taken from the reinvestment reserve. */
		amount: MoneybirdMoneyInput;
	};
	'assets.reinvestmentReservePurchase.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'assets.reinvestmentReserveSale.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** The amount of the book result booked to the reinvestment reserve. */
		amount: MoneybirdMoneyInput;
	};
	'assets.reinvestmentReserveSale.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'assets.sources.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'assets.sources.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		source_id: MoneybirdIdentifierInput;
	};
	'assets.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		asset: {
			/** The name of the asset */
			name?: string;
			/** The ID of the ledger account */
			ledger_account_id?: MoneybirdIdentifierInput;
			/** The purchase date of the asset */
			purchase_date?: string;
			/** The purchase value of the asset */
			purchase_value?: MoneybirdMoneyInput;
			value_change_plan_attributes?: {
				/** The lifespan of the asset in years */
				lifespan_in_years?: MoneybirdNumberInput;
				/** The residual value of the asset at the end of the lifespan */
				residual_value?: MoneybirdMoneyInput;
			};
		};
	};
	'assets.valueChanges.createArbitrary': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** Has to be after the purchase date of the asset, and cannot be in the future or in the locked period of the administration. */
		date: string;
		/** Note that a negative amount means the asset decreases in value while a positive amount means the asset increases in value. */
		amount: MoneybirdMoneyInput;
		description: string;
		/** Set to true if the value change is already externally booked and doesn't need to be booked by Moneybird. */
		externally_booked?: boolean;
	};
	'assets.valueChanges.createDivestment': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** Has to be after the purchase date of the asset, and cannot be in the future or in the locked period of the administration. */
		date: string;
	};
	'assets.valueChanges.createFullDepreciation': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** Has to be after the purchase date of the asset, and cannot be in the future or in the locked period of the administration. */
		date: string;
		description: string;
	};
	'assets.valueChanges.createManual': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** Has to be after the purchase date of the asset, and cannot be in the future or in the locked period of the administration. */
		date: string;
		/** Note that a negative amount means the asset decreases in value while a positive amount means the asset increases in value. */
		amount: MoneybirdMoneyInput;
		description: string;
		/** Set to true if the value change is already externally booked and doesn't need to be booked by Moneybird. */
		externally_booked?: boolean;
	};
	'assets.valueChanges.createRetroactiveLinear': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'contacts.additionalCharges.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		product_id: MoneybirdIdentifierInput;
		/** The quantity on the invoice line, e.g. `1` or `5 x`. */
		amount: string | number;
		/** The price per unit. Defaults to the price of the product for this contact at the start of the period. */
		price?: MoneybirdMoneyInput;
		/** The period the charge applies to, e.g. `20250101..20250131`, `202501..202503` or `this_month`. */
		period: string;
		description: string;
		/** Your own reference for this charge. */
		identifier?: string;
	};
	'contacts.additionalCharges.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** If true, includes the additional charges that have already been billed. Default is false. */
		include_billed?: boolean | string;
	};
	'contacts.archive': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'contacts.contactPeople.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		contact_person?: {
			firstname?: string;
			lastname?: string;
			phone?: string;
			/** Should be a valid email addresses. */
			email?: string;
			department?: string;
		};
	};
	'contacts.contactPeople.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'contacts.contactPeople.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'contacts.contactPeople.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		contact_person?: {
			firstname?: string;
			lastname?: string;
			phone?: string;
			/** Should be a valid email addresses. */
			email?: string;
			department?: string;
		};
	};
	'contacts.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact: {
			/** A contact requires a non-blank `company_name`, `firstname` or `lastname`. */
			company_name?: string;
			/** Primary street address of the contact. */
			address1?: string;
			/** Secondary address line (e.g. apartment number, building name). */
			address2?: string;
			/** Postal code or ZIP code of the contact's address. */
			zipcode?: string;
			/** City or town of the contact's address. */
			city?: string;
			/** ISO two-character country code, e.g. NL or DE. */
			country?: string;
			/** Phone number of the contact. */
			phone?: string;
			/** Can be `Email`, `Simplerinvoicing`, `Peppol`, `Manual` or `Post`. */
			delivery_method?: string;
			/** Will be assigned automatically if empty. Should be unique for the administration. */
			customer_id?: string;
			/** The tax identification number (VAT number) of the contact, e.g. `NL123456789B01`. */
			tax_number?: string;
			/** A contact requires a non-blank `company_name`, `firstname` or `lastname`. */
			firstname?: string;
			/** A contact requires a non-blank `company_name`, `firstname` or `lastname`. */
			lastname?: string;
			/** The CoC (Chamber of Commerce) registration number of the contact's business. */
			chamber_of_commerce?: string;
			/** The bank account number (IBAN) of the contact. Used for outgoing payments and displayed on documents. */
			bank_account?: string;
			/** The name of the person to address invoices to (attention line), e.g. "Finance Department". */
			send_invoices_to_attention?: string;
			/** Should be one or more valid email addresses, separated by a comma. */
			send_invoices_to_email?: string;
			/** The name of the person to address estimates to (attention line). */
			send_estimates_to_attention?: string;
			/** Should be one or more valid email addresses, separated by a comma. */
			send_estimates_to_email?: string;
			/** The name of the person to address payment reminders to (attention line). Requires `send_reminders_to_email`. */
			send_reminders_to_attention?: string;
			/** Should be one or more valid email addresses, separated by a comma. When empty, payment reminders go to `send_invoices_to_email`. */
			send_reminders_to_email?: string;
			/** When `true`, all other SEPA fields are required. */
			sepa_active?: boolean | string;
			/** Should be a valid IBAN. */
			sepa_iban?: string;
			/** The account holder name for the SEPA direct debit IBAN. */
			sepa_iban_account_name?: string;
			/** Should be a valid BIC. */
			sepa_bic?: string;
			/** Should be unique for the administration. */
			sepa_mandate_id?: string;
			/** Should be a date in the past. */
			sepa_mandate_date?: string;
			/** Can be `RCUR`, `FRST`, `OOFF` or `FNAL`. */
			sepa_sequence_type?: string;
			/** Can be `0002`, `0007`, `0009`, `0037`, `0060`, `0088`, `0096`, `0097`, `0106`, `0130`, `0135`, `0142`, `0151`, `0183`, `0184`, `0188`, `0190`, `0191`, `0192`, `0193`, `0195`, `0196`, `0198`, `0199`, `0200`, `0201`, `0204`, `0205`, `0208`, `0209`, `0210`, `0211`, `0212`, `0213`, `0215`, `0216`,… */
			si_identifier_type?: string;
			/** The Peppol/e-invoicing identifier value for this contact. The format depends on the `si_identifier_type`. */
			si_identifier?: string;
			/** Should be a valid invoice workflow id. */
			invoice_workflow_id?: MoneybirdIdentifierInput;
			/** Should be a valid estimate workflow id. */
			estimate_workflow_id?: MoneybirdIdentifierInput;
			/** When `true`, a UBL (Universal Business Language) XML file is attached when emailing invoices to this contact. Enables machine-readable invoice processing. */
			email_ubl?: boolean | string;
			/** When `true`, invoices for this contact are collected via SEPA direct debit. Requires SEPA fields to be configured. */
			direct_debit?: boolean | string;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
			/** An optional initial contact person to create along with the contact. Additional contact persons can be managed via the contact persons endpoint. */
			contact_person?: {
				/** First name of the contact person. */
				firstname: string;
				/** Last name of the contact person. */
				lastname: string;
			};
		};
	};
	'contacts.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'contacts.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'contacts.filter': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `first_name:henk,contact_type:company`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | created_after… */
		filter?: string;
		/** Free-text search across name, contact people, email, phone, customer id, tax number, chamber of commerce, IBAN, and address fields. */
		query?: string;
		include_archived?: boolean | string;
		page?: number | string;
		per_page?: number | string;
	};
	'contacts.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		include_archived?: boolean | string;
	};
	'contacts.getByCustomerId': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The customer number of the contact, not the contact's id. */
		customer_id: string;
	};
	'contacts.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		per_page?: number | string;
		page?: number | string;
		/** Free-text search across name, contact people, email, phone, customer id, tax number, chamber of commerce, IBAN, and address fields. */
		query?: string;
		include_archived?: boolean | string;
		todo?: string;
		contact_field?: string;
		contact_value?: string;
		/** Restrict to contacts created by the given contact import batch. */
		contact_import_id?: number | string;
	};
	'contacts.listDuplicates': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		page?: number | string;
	};
	'contacts.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /contacts/filter` — see that operation's description for the available keys. */
		filter?: string;
		include_archived?: boolean | string;
	};
	'contacts.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'contacts.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'contacts.paymentsMandate.createUrl': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		mandate_request?: {
			/** Should be a valid identity id. */
			identity_id?: MoneybirdIdentifierInput;
			/** Should be a valid workflow id. Restricts the available payment methods to the methods available for the selected workflow. */
			workflow_id?: MoneybirdIdentifierInput;
		};
	};
	'contacts.paymentsMandate.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
	};
	'contacts.paymentsMandate.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
	};
	'contacts.paymentsMandate.request': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		mandate_request?: {
			email_message?: string;
			/** Should be a valid identity id. */
			identity_id?: MoneybirdIdentifierInput;
			/** Should be a valid workflow id. Restricts the available payment methods to the methods available for the selected workflow. */
			workflow_id?: MoneybirdIdentifierInput;
		};
	};
	'contacts.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		contact: {
			/** A contact requires a non-blank `company_name`, `firstname` or `lastname`. */
			company_name?: string;
			/** Primary street address of the contact. */
			address1?: string;
			/** Secondary address line (e.g. apartment number, building name). */
			address2?: string;
			/** Postal code or ZIP code of the contact's address. */
			zipcode?: string;
			/** City or town of the contact's address. */
			city?: string;
			/** ISO two-character country code, e.g. NL or DE. */
			country?: string;
			/** Phone number of the contact. */
			phone?: string;
			/** Can be `Email`, `Simplerinvoicing`, `Peppol`, `Manual` or `Post`. */
			delivery_method?: string;
			/** When `true`, a UBL (Universal Business Language) XML file is attached when emailing invoices to this contact. Enables machine-readable invoice processing. */
			email_ubl?: boolean | string;
			/** Will be assigned automatically if empty. Should be unique for the administration. */
			customer_id?: string;
			/** The tax identification number (VAT number) of the contact, e.g. `NL123456789B01`. */
			tax_number?: string;
			/** A contact requires a non-blank `company_name`, `firstname` or `lastname`. */
			firstname?: string;
			/** A contact requires a non-blank `company_name`, `firstname` or `lastname`. */
			lastname?: string;
			/** The CoC (Chamber of Commerce) registration number of the contact's business. */
			chamber_of_commerce?: string;
			/** The bank account number (IBAN) of the contact. Used for outgoing payments and displayed on documents. */
			bank_account?: string;
			/** The name of the person to address invoices to (attention line). */
			send_invoices_to_attention?: string;
			/** Should be one or more valid email addresses, separated by a comma. */
			send_invoices_to_email?: string;
			/** The name of the person to address estimates to (attention line). */
			send_estimates_to_attention?: string;
			/** Should be one or more valid email addresses, separated by a comma. */
			send_estimates_to_email?: string;
			/** The name of the person to address payment reminders to (attention line). Requires `send_reminders_to_email`. */
			send_reminders_to_attention?: string;
			/** Should be one or more valid email addresses, separated by a comma. When empty, payment reminders go to `send_invoices_to_email`. */
			send_reminders_to_email?: string;
			/** When `true`, all other SEPA fields are required. */
			sepa_active?: boolean | string;
			/** Should be a valid IBAN. */
			sepa_iban?: string;
			/** The account holder name for the SEPA direct debit IBAN. */
			sepa_iban_account_name?: string;
			/** Should be a valid BIC. */
			sepa_bic?: string;
			/** Should be unique for the administration. */
			sepa_mandate_id?: string;
			/** Should be a date in the past. */
			sepa_mandate_date?: string;
			/** Can be `RCUR`, `FRST`, `OOFF` or `FNAL`. */
			sepa_sequence_type?: string;
			/** Should be a valid invoice workflow id. */
			invoice_workflow_id?: MoneybirdIdentifierInput;
			/** Should be a valid estimate workflow id. */
			estimate_workflow_id?: MoneybirdIdentifierInput;
			/** Can be `0002`, `0007`, `0009`, `0037`, `0060`, `0088`, `0096`, `0097`, `0106`, `0130`, `0135`, `0142`, `0151`, `0183`, `0184`, `0188`, `0190`, `0191`, `0192`, `0193`, `0195`, `0196`, `0198`, `0199`, `0200`, `0201`, `0204`, `0205`, `0208`, `0209`, `0210`, `0211`, `0212`, `0213`, `0215`, `0216`,… */
			si_identifier_type?: string;
			/** The Peppol/e-invoicing identifier value for this contact. The format depends on the `si_identifier_type`. */
			si_identifier?: string;
			/** When `true`, invoices for this contact are collected via SEPA direct debit. Requires SEPA fields to be configured. */
			direct_debit?: boolean | string;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
	};
	'customFields.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'customerContactPortal.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
	};
	'customerContactPortal.getSubscription': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'customerContactPortal.listInvoices': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
	};
	'documentStyles.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'documents.generalDocuments.attachments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'documents.generalDocuments.attachments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.generalDocuments.attachments.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.generalDocuments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		general_document?: {
			/** **Required**. */
			reference?: string;
			/** **Required**. */
			date?: string;
			due_date?: string;
			reminder_date?: string;
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** Creates a reminder to-do for this document. */
			reminder?: {
				date: string;
				message?: string;
			};
		};
	};
	'documents.generalDocuments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.generalDocuments.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'documents.generalDocuments.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.generalDocuments.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:open`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | period | `String` |… */
		filter?: string;
		/** String terms, example: `key1:value1,key2:value2`. */
		new_filter?: string;
		page?: number | string;
		/** Sorts the list on date, so the newest (`date_desc`) or the oldest (`date_asc`) items come first. */
		sort?: 'date_desc' | 'date_asc';
		per_page?: number | string;
	};
	'documents.generalDocuments.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /documents/general_documents` — see that operation's description for the available keys. */
		filter?: string;
	};
	'documents.generalDocuments.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		general_document_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.generalDocuments.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		general_document_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.generalDocuments.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		general_document?: {
			/** **Required**. */
			reference?: string;
			/** **Required**. */
			date?: string;
			due_date?: string;
			reminder_date?: string;
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** Creates a reminder to-do for this document. */
			reminder?: {
				date: string;
				message?: string;
			};
		};
		remove_contact?: boolean | string;
	};
	'documents.generalJournalDocuments.attachments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'documents.generalJournalDocuments.attachments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.generalJournalDocuments.attachments.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.generalJournalDocuments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		general_journal_document?: {
			reference?: string;
			/** Date of the journal entry. Defaults to today. */
			date?: string;
			/** The only journal type is `fiscal_year_ending`, for the entry that closes a fiscal year. Leave it out for a normal journal entry. */
			journal_type?: 'fiscal_year_ending';
			general_journal_document_entries_attributes?:
				| Array<{
						id?: number;
						/** Should be a valid ledger account id. */
						ledger_account_id?: MoneybirdIdentifierInput;
						/** Should be a valid tax rate id. */
						tax_rate_id?: MoneybirdIdentifierInput;
						description?: string;
						debit?: MoneybirdMoneyInput;
						credit?: MoneybirdMoneyInput;
						/** Should be a valid project id. */
						project_id?: MoneybirdIdentifierInput;
						row_order?: number;
						_destroy?: boolean | string;
						/** Should be a valid contact id. */
						contact_id?: MoneybirdIdentifierInput;
				  }>
				| Record<
						string,
						{
							id?: number;
							/** Should be a valid ledger account id. */
							ledger_account_id?: MoneybirdIdentifierInput;
							/** Should be a valid tax rate id. */
							tax_rate_id?: MoneybirdIdentifierInput;
							description?: string;
							debit?: MoneybirdMoneyInput;
							credit?: MoneybirdMoneyInput;
							/** Should be a valid project id. */
							project_id?: MoneybirdIdentifierInput;
							row_order?: number;
							_destroy?: boolean | string;
							/** Should be a valid contact id. */
							contact_id?: MoneybirdIdentifierInput;
						}
				  >;
		};
	};
	'documents.generalJournalDocuments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.generalJournalDocuments.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'documents.generalJournalDocuments.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.generalJournalDocuments.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:open`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | period | `String` |… */
		filter?: string;
		/** String terms, example: `key1:value1,key2:value2`. */
		new_filter?: string;
		page?: number | string;
		/** Sorts the list on date, so the newest (`date_desc`) or the oldest (`date_asc`) items come first. */
		sort?: 'date_desc' | 'date_asc';
		per_page?: number | string;
		exclude_new_general_journal_documents?: boolean | string;
	};
	'documents.generalJournalDocuments.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /documents/general_journal_documents` — see that operation's description for the available keys. */
		filter?: string;
	};
	'documents.generalJournalDocuments.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		general_journal_document_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.generalJournalDocuments.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		general_journal_document_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.generalJournalDocuments.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		general_journal_document?: {
			reference?: string;
			date?: string;
			/** The only journal type is `fiscal_year_ending`, for the entry that closes a fiscal year. An empty string makes it a normal journal entry. */
			journal_type?: 'fiscal_year_ending' | '';
			general_journal_document_entries_attributes?:
				| Array<{
						id?: number;
						/** Should be a valid ledger account id. */
						ledger_account_id?: MoneybirdIdentifierInput;
						/** Should be a valid tax rate id. */
						tax_rate_id?: MoneybirdIdentifierInput;
						description?: string;
						debit?: MoneybirdMoneyInput;
						credit?: MoneybirdMoneyInput;
						/** Should be a valid project id. */
						project_id?: MoneybirdIdentifierInput;
						row_order?: number;
						_destroy?: boolean | string;
						/** Should be a valid contact id. */
						contact_id?: MoneybirdIdentifierInput;
				  }>
				| Record<
						string,
						{
							id?: number;
							/** Should be a valid ledger account id. */
							ledger_account_id?: MoneybirdIdentifierInput;
							/** Should be a valid tax rate id. */
							tax_rate_id?: MoneybirdIdentifierInput;
							description?: string;
							debit?: MoneybirdMoneyInput;
							credit?: MoneybirdMoneyInput;
							/** Should be a valid project id. */
							project_id?: MoneybirdIdentifierInput;
							row_order?: number;
							_destroy?: boolean | string;
							/** Should be a valid contact id. */
							contact_id?: MoneybirdIdentifierInput;
						}
				  >;
		};
		all_taxes?: boolean | string;
	};
	'documents.purchaseInvoices.attachments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'documents.purchaseInvoices.attachments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.purchaseInvoices.attachments.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.purchaseInvoices.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		purchase_invoice?: {
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** The supplier's invoice number or reference. */
			reference?: string;
			/** The date on the supplier's invoice. */
			date?: string;
			/** The date by which the invoice should be paid. */
			due_date?: string;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Whether the prices on the purchase invoice are inclusive of tax. Defaults to the administration setting. */
			prices_are_incl_tax?: boolean | string;
			/** When `true`, this purchase invoice is treated as a revenue invoice (e.g. a credit note from a supplier). Revenue invoices are booked as income instead of expenses. */
			revenue_invoice?: boolean | string;
			details_attributes?: MoneybirdDetailsAttributesInput;
			fiscal_allocations_attributes?: MoneybirdFiscalAllocationsAttributesInput;
		};
	};
	'documents.purchaseInvoices.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.purchaseInvoices.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'documents.purchaseInvoices.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.purchaseInvoices.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:open`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | period | `String` |… */
		filter?: string;
		/** String terms, example: `key1:value1,key2:value2`. */
		new_filter?: string;
		page?: number | string;
		/** Sorts the list on date, so the newest (`date_desc`) or the oldest (`date_asc`) items come first. */
		sort?: 'date_desc' | 'date_asc';
		per_page?: number | string;
	};
	'documents.purchaseInvoices.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /documents/purchase_invoices` — see that operation's description for the available keys. */
		filter?: string;
	};
	'documents.purchaseInvoices.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		purchase_invoice_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.purchaseInvoices.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		purchase_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.purchaseInvoices.payments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		payment?: {
			/** The date on which the payment was made. */
			payment_date: string;
			/** The amount paid in the document's currency. */
			price: MoneybirdMoneyInput;
			/** Amount paid expressed in the base currency of the administration. Required when the document uses a different currency than the administration's base currency. */
			price_base?: MoneybirdMoneyInput;
			/** The ID of the financial account (bank account or cash register) associated with this payment. Required for `private_payment` and `cash_payment` actions. Should be a valid financial account id. */
			financial_account_id?: MoneybirdIdentifierInput;
			/** The ID of the bank transaction to link this payment to. Required for `bank_transfer` actions. A financial mutation with `state` `processed` has no open amount left and answers 400. */
			financial_mutation_id?: MoneybirdIdentifierInput;
			/** An external transaction reference, e.g. a bank transaction ID or PSP reference. Used to match the payment with financial mutations. */
			transaction_identifier?: string;
			/** Can be `private_payment` (needs financial_account_id), `payment_without_proof`, `cash_payment` (needs financial_account_id), `rounding_error`, `bank_transfer` (needs financial_mutation_id), `balance_settlement` (needs ledger_account_id) or `invoices_settlement` (needs invoice_id).… */
			manual_payment_action?: string;
			/** The ID of the ledger account to book this payment to. Required for `balance_settlement` actions. Should be a valid ledger account id. */
			ledger_account_id?: MoneybirdIdentifierInput;
			/** The ID of the document to settle this payment against. Required for `invoices_settlement` actions. Should be a valid document id (sales invoice, purchase invoice, receipt, etc.). */
			invoice_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.purchaseInvoices.payments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		payment_id: MoneybirdIdentifierInput;
	};
	'documents.purchaseInvoices.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		purchase_invoice?: {
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** The supplier's invoice number or reference. */
			reference?: string;
			/** The date on the supplier's invoice. */
			date?: string;
			/** The date by which the invoice should be paid. */
			due_date?: string;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Whether the prices on the purchase invoice are inclusive of tax. */
			prices_are_incl_tax?: boolean | string;
			/** When `true`, this purchase invoice is treated as a revenue invoice (e.g. a credit note from a supplier). */
			revenue_invoice?: boolean | string;
			details_attributes?: MoneybirdDetailsAttributesInput;
			fiscal_allocations_attributes?: MoneybirdFiscalAllocationsAttributesInput;
		};
	};
	'documents.receipts.attachments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'documents.receipts.attachments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.receipts.attachments.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.receipts.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		receipt?: {
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** A reference for this receipt, e.g. a receipt number or supplier name. */
			reference?: string;
			/** The date of the receipt. */
			date?: string;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Whether the prices on the receipt are inclusive of tax. Defaults to the administration setting. */
			prices_are_incl_tax?: boolean | string;
			details_attributes?: MoneybirdDetailsAttributesInput;
			fiscal_allocations_attributes?: MoneybirdFiscalAllocationsAttributesInput;
		};
		payment?: {
			/** Should be a valid financial account id. */
			financial_account_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.receipts.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.receipts.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'documents.receipts.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.receipts.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:open`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | period | `String` |… */
		filter?: string;
		/** String terms, example: `key1:value1,key2:value2`. */
		new_filter?: string;
		page?: number | string;
		/** Sorts the list on date, so the newest (`date_desc`) or the oldest (`date_asc`) items come first. */
		sort?: 'date_desc' | 'date_asc';
		per_page?: number | string;
	};
	'documents.receipts.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /documents/receipts` — see that operation's description for the available keys. */
		filter?: string;
	};
	'documents.receipts.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		receipt_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.receipts.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		receipt_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.receipts.payments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		payment?: {
			/** The date on which the payment was made. */
			payment_date: string;
			/** The amount paid in the document's currency. */
			price: MoneybirdMoneyInput;
			/** Amount paid expressed in the base currency of the administration. Required when the document uses a different currency than the administration's base currency. */
			price_base?: MoneybirdMoneyInput;
			/** The ID of the financial account (bank account or cash register) associated with this payment. Required for `private_payment` and `cash_payment` actions. Should be a valid financial account id. */
			financial_account_id?: MoneybirdIdentifierInput;
			/** The ID of the bank transaction to link this payment to. Required for `bank_transfer` actions. A financial mutation with `state` `processed` has no open amount left and answers 400. */
			financial_mutation_id?: MoneybirdIdentifierInput;
			/** An external transaction reference, e.g. a bank transaction ID or PSP reference. Used to match the payment with financial mutations. */
			transaction_identifier?: string;
			/** Can be `private_payment` (needs financial_account_id), `payment_without_proof`, `cash_payment` (needs financial_account_id), `rounding_error`, `bank_transfer` (needs financial_mutation_id), `balance_settlement` (needs ledger_account_id) or `invoices_settlement` (needs invoice_id).… */
			manual_payment_action?: string;
			/** The ID of the ledger account to book this payment to. Required for `balance_settlement` actions. Should be a valid ledger account id. */
			ledger_account_id?: MoneybirdIdentifierInput;
			/** The ID of the document to settle this payment against. Required for `invoices_settlement` actions. Should be a valid document id (sales invoice, purchase invoice, receipt, etc.). */
			invoice_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.receipts.payments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		payment_id: MoneybirdIdentifierInput;
	};
	'documents.receipts.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		receipt?: {
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** A reference for this receipt, e.g. a receipt number or supplier name. */
			reference?: string;
			/** The date of the receipt. */
			date?: string;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Whether the prices on the receipt are inclusive of tax. */
			prices_are_incl_tax?: boolean | string;
			details_attributes?: MoneybirdDetailsAttributesInput;
			fiscal_allocations_attributes?: MoneybirdFiscalAllocationsAttributesInput;
		};
		payment?: {
			/** Should be a valid financial account id. */
			financial_account_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.typelessDocuments.attachments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'documents.typelessDocuments.attachments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.typelessDocuments.attachments.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		attachment_id: MoneybirdIdentifierInput;
	};
	'documents.typelessDocuments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		typeless_document?: {
			reference?: string;
			/** Date of the document. Defaults to today. */
			date?: string;
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
		};
	};
	'documents.typelessDocuments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.typelessDocuments.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'documents.typelessDocuments.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'documents.typelessDocuments.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:open`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | period | `String` |… */
		filter?: string;
		/** String terms, example: `key1:value1,key2:value2`. */
		new_filter?: string;
		page?: number | string;
		/** Sorts the list on date, so the newest (`date_desc`) or the oldest (`date_asc`) items come first. */
		sort?: 'date_desc' | 'date_asc';
		per_page?: number | string;
	};
	'documents.typelessDocuments.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /documents/typeless_documents` — see that operation's description for the available keys. */
		filter?: string;
	};
	'downloads.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The download ID */
		id: MoneybirdIdentifierInput;
	};
	'downloads.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		per_page?: number | string;
		page?: number | string;
		/** Filter downloads by type. Common download types include: - `auditfile` - `brugstaat` - `export_ledger_account_report` Check the `download_type` field in the response to see all available types. */
		download_type?: string;
		downloaded?: boolean | string;
		failed?: boolean | string;
	};
	'estimates.attachments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'estimates.attachments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		estimate_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'estimates.attachments.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		estimate_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'estimates.bill': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'estimates.changeState': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** Can be accepted, rejected, open, late, billed or archived. */
		state: string;
	};
	'estimates.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		estimate?: {
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** Should be a valid contact person id. */
			contact_person_id?: MoneybirdIdentifierInput;
			/** Default document style is used when value is not provided. Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** If value is not provided, the workflow saved in the contact is used. If the contact doesn't have a default workflow, the administration's default workflow is used. Should be a valid workflow id. */
			workflow_id?: MoneybirdIdentifierInput;
			/** Your own reference for this estimate, e.g. a project code or PO number. Visible to the recipient. */
			reference?: string;
			/** The date of the estimate. Defaults to the current date. */
			estimate_date?: string;
			/** The sequence number that is put in the estimate number template, e.g. `0042`. If not provided, the next number in the sequence is used when the estimate is sent. */
			estimate_sequence_id?: string | number;
			/** Can be `bg`, `cs`, `da`, `de`, `el`, `en`, `es`, `fr`, `hr`, `hu`, `it`, `no`, `nl`, `nl-be`, `pl`, `pt`, `ro`, `sv`, `tr` or `uk`. */
			language?: string;
			/** ISO three-character currency code, e.g. EUR or USD. Defaults to the workflow's currency. */
			currency?: string;
			/** Whether the prices on the estimate are inclusive of tax. Defaults to the workflow's setting. */
			prices_are_incl_tax?: boolean | string;
			/** Whether to show tax amounts on the estimate. Useful for non-VAT registered businesses or tax-exempt clients. Defaults to the workflow's setting. */
			show_tax?: boolean | string;
			/** The number of days after the estimate date before the estimate expires. Defaults to the first workflow step's due interval. */
			first_due_interval?: number | string;
			/** Introductory text displayed above the details on the estimate document. Defaults to the workflow's pre-text. */
			pre_text?: string;
			/** Closing text displayed below the details on the estimate document. Defaults to the workflow's post-text. */
			post_text?: string;
			/** Discount percentage, e.g. 10,0%. Should be a number 0 <= *n* <= 100. */
			discount?: MoneybirdNumberInput;
			/** The ID of the sales invoice this estimate was created from (e.g. for credit notes or revised estimates). */
			original_sales_invoice_id?: MoneybirdIdentifierInput;
			details_attributes?: MoneybirdDetailsAttributesInput;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
	};
	'estimates.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'estimates.downloadPdf': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** In case you want to hide sender address and logo you can set this to 'stationery'. */
		media?: string;
	};
	'estimates.downloadSignedPdf': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'estimates.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'estimates.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		includes?: Array<string>;
	};
	'estimates.getByEstimateId': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Unique record identifier */
		estimate_id: string;
	};
	'estimates.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:all`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | --- | --- | --- | --- | | state |… */
		filter?: string;
		page?: number | string;
		per_page?: number | string;
	};
	'estimates.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /estimates` — see that operation's description for the available keys. */
		filter?: string;
	};
	'estimates.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		estimate_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'estimates.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		estimate_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'estimates.send': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		estimate_sending?: {
			delivery_method?: 'Email' | 'Manual';
			/** Recipient email address. Only used when `delivery_method` is `Email`; defaults to the contact's email address. */
			email_address?: string;
			/** Message included in the email. Only used when `delivery_method` is `Email`; defaults to the workflow's estimate email text. */
			email_message?: string;
			sign_online?: boolean | string;
		};
		sender?: boolean | string;
		signature_output?: string;
		audit_trail?: string;
		ip_address?: string;
	};
	'estimates.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		estimate?: {
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** Should be a valid contact person id. */
			contact_person_id?: MoneybirdIdentifierInput;
			/** When `true`, the contact's address and other details are updated on the estimate from the current contact record. */
			update_contact?: boolean | string;
			/** Default document style is used when value is not provided. Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** If value is not provided, the workflow saved in the contact is used. If the contact doesn't have a default workflow, the administration's default workflow is used. Should be a valid workflow id. */
			workflow_id?: MoneybirdIdentifierInput;
			/** Your own reference for this estimate, e.g. a project code or PO number. Visible to the recipient. */
			reference?: string;
			/** The date of the estimate. */
			estimate_date?: string;
			/** The sequence number that is put in the estimate number template, e.g. `0042`. */
			estimate_sequence_id?: string | number;
			/** Set to `true` to remove the sequence number of an estimate that is not sent yet. The next number in the sequence is then used when the estimate is sent. */
			remove_estimate_sequence_id?: boolean | string;
			/** Can be `bg`, `cs`, `da`, `de`, `el`, `en`, `es`, `fr`, `hr`, `hu`, `it`, `no`, `nl`, `nl-be`, `pl`, `pt`, `ro`, `sv`, `tr` or `uk`. */
			language?: string;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Whether the prices on the estimate are inclusive of tax. */
			prices_are_incl_tax?: boolean | string;
			/** Whether to show tax amounts on the estimate. */
			show_tax?: boolean | string;
			/** The number of days after the estimate date before the estimate expires. */
			first_due_interval?: number;
			/** Introductory text displayed above the details on the estimate document. */
			pre_text?: string;
			/** Closing text displayed below the details on the estimate document. */
			post_text?: string;
			/** Discount percentage, e.g. 10,0%. Should be a number 0 <= *n* <= 100. */
			discount?: MoneybirdNumberInput;
			/** The ID of the sales invoice this estimate was created from. */
			original_sales_invoice_id?: MoneybirdIdentifierInput;
			details_attributes?: MoneybirdDetailsAttributesInput;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
	};
	'events.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		per_page?: number | string;
		/** Only return events of this record type, for example `Contact`, `SalesInvoice` or `Document`. The user needs permission for this type. */
		entity_type?: string;
		/** Only return the events of this record. Events of a record type the user has no permission for are left out. */
		entity_id?: MoneybirdIdentifierInput;
	};
	'externalSalesInvoices.attachments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'externalSalesInvoices.attachments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		external_sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'externalSalesInvoices.attachments.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		external_sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'externalSalesInvoices.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		external_sales_invoice?: {
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** The invoice number or reference from the external system that created this invoice, e.g. a webshop order ID. */
			reference?: string;
			/** The date of the invoice. */
			date?: string;
			/** The date by which the invoice should be paid. */
			due_date?: string;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Whether the prices on the invoice are inclusive of tax. Defaults to the administration setting. */
			prices_are_incl_tax?: boolean | string;
			/** The name of the external system that created this invoice, e.g. your webshop or POS system name. */
			source?: string;
			/** A URL linking back to the invoice in the external system. */
			source_url?: string;
			details_attributes?: MoneybirdDetailsAttributesInput;
		};
	};
	'externalSalesInvoices.createFromAttachment': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'externalSalesInvoices.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'externalSalesInvoices.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'externalSalesInvoices.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'externalSalesInvoices.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:all`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | --- | --- | --- | --- | | state |… */
		filter?: string;
		page?: number | string;
		per_page?: number | string;
	};
	'externalSalesInvoices.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:all`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | --- | --- | --- | --- | | state |… */
		filter?: string;
	};
	'externalSalesInvoices.markAsDubious': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		dubious_date?: string;
	};
	'externalSalesInvoices.markAsUncollectible': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		uncollectible_date?: string;
		/** Can be `revenue`. */
		book_method?: string;
	};
	'externalSalesInvoices.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		external_sales_invoice_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'externalSalesInvoices.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		external_sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'externalSalesInvoices.payments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		external_sales_invoice_id: MoneybirdIdentifierInput;
		payment?: {
			/** The date on which the payment was made. */
			payment_date: string;
			/** The amount paid in the document's currency. */
			price: MoneybirdMoneyInput;
			/** Amount paid expressed in the base currency of the administration. Required when the document uses a different currency than the administration's base currency. */
			price_base?: MoneybirdMoneyInput;
			/** The ID of the financial account (bank account or cash register) associated with this payment. Required for `private_payment` and `cash_payment` actions. Should be a valid financial account id. */
			financial_account_id?: MoneybirdIdentifierInput;
			/** The ID of the bank transaction to link this payment to. Required for `bank_transfer` actions. A financial mutation with `state` `processed` has no open amount left and answers 400. */
			financial_mutation_id?: MoneybirdIdentifierInput;
			/** An external transaction reference, e.g. a bank transaction ID or PSP reference. Used to match the payment with financial mutations. */
			transaction_identifier?: string;
			/** Can be `private_payment` (needs financial_account_id), `payment_without_proof`, `cash_payment` (needs financial_account_id), `rounding_error`, `bank_transfer` (needs financial_mutation_id), `balance_settlement` (needs ledger_account_id) or `invoices_settlement` (needs invoice_id).… */
			manual_payment_action?: string;
			/** The ID of the ledger account to book this payment to. Required for `balance_settlement` actions. Should be a valid ledger account id. */
			ledger_account_id?: MoneybirdIdentifierInput;
			/** The ID of the document to settle this payment against. Required for `invoices_settlement` actions. Should be a valid document id (sales invoice, purchase invoice, receipt, etc.). */
			invoice_id?: MoneybirdIdentifierInput;
		};
	};
	'externalSalesInvoices.payments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		external_sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'externalSalesInvoices.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		external_sales_invoice?: {
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** The invoice number or reference from the external system that created this invoice, e.g. a webshop order ID. */
			reference?: string;
			/** The date of the invoice. */
			date?: string;
			/** The date by which the invoice should be paid. */
			due_date?: string;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Whether the prices on the invoice are inclusive of tax. */
			prices_are_incl_tax?: boolean | string;
			/** The name of the external system that created this invoice. */
			source?: string;
			/** A URL linking back to the invoice in the external system. */
			source_url?: string;
			details_attributes?: MoneybirdDetailsAttributesInput;
		};
	};
	'financialAccounts.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'financialMutations.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'financialMutations.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'financialMutations.linkBooking': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** The type of record to link the mutation to. */
		booking_type:
			| 'SalesInvoice'
			| 'Document'
			| 'LedgerAccount'
			| 'PaymentTransactionBatch'
			| 'PurchaseTransaction'
			| 'NewPurchaseInvoice'
			| 'NewReceipt'
			| 'PaymentTransaction'
			| 'PurchaseTransactionBatch'
			| 'ExternalSalesInvoice'
			| 'Payment'
			| 'VatDocument';
		/** The id of the record to link, of the type set in `booking_type` (e.g. the ledger account id when `booking_type` is `LedgerAccount`). Not allowed for `NewPurchaseInvoice` and `NewReceipt` — those create a new record instead of linking an existing one. To link an existing purchase invoice or… */
		booking_id?: MoneybirdIdentifierInput;
		/** The booking amount, in the administration's base currency. This is the field that carries the amount for most booking types; when linking a payment to an invoice it is the base-currency counterpart of `price`. For `booking_type` `LedgerAccount` send the amount here — `price` is ignored. Whether… */
		price_base?: MoneybirdMoneyInput;
		/** Amount in the booking's own currency, used when linking a payment to an invoice. The same positive/negative rules apply as for `price_base` (see the table there). For a foreign-currency invoice both `price` and `price_base` are required; otherwise `price_base` alone is enough. Only used when… */
		price?: MoneybirdMoneyInput;
		description?: string;
		payment_batch_identifier?: string;
		/** Should be a valid project id. */
		project_id?: MoneybirdIdentifierInput;
		mark_open_sepa_transaction_as_paid?: boolean | string;
	};
	'financialMutations.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:unprocessed`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | period |… */
		filter?: string;
	};
	'financialMutations.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:all`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | period | `String` |… */
		filter?: string;
	};
	'financialMutations.unlinkBooking': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** Can be `Payment` or `LedgerAccountBooking`. */
		booking_type: 'Payment' | 'LedgerAccountBooking';
		booking_id: MoneybirdIdentifierInput;
	};
	'financialStatements.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		financial_statement?: {
			/** Should be a valid financial account id. */
			financial_account_id?: MoneybirdIdentifierInput;
			/** A unique reference for this financial statement, e.g. the bank statement number. */
			reference: string;
			/** The date of the official bank balance. */
			official_date?: string;
			official_balance?: MoneybirdMoneyInput;
			/** An identifier for the import source or batch, e.g. a bank feed provider reference. */
			importer_key?: string;
			financial_mutations_attributes?:
				| Array<{
						/** The transaction date. */
						date?: string;
						/** The value date of the transaction, i.e. when the funds are actually credited or debited. May differ from the transaction date. */
						valutation_date?: string;
						/** The description or narrative of the bank transaction as provided by the bank. */
						message?: string;
						amount?: MoneybirdMoneyInput;
						/** The bank transaction type code, e.g. a SWIFT transaction code. Primarily used internally for bank statement imports and automatic booking; most API users can omit this. */
						code?: string;
						/** The name of the counterparty's account holder. */
						contra_account_name?: string;
						/** The account number (IBAN) of the counterparty. */
						contra_account_number?: string;
						/** A reference identifying a batch of transactions, e.g. for grouped SEPA payments. */
						batch_reference?: string;
						/** The position offset of this mutation within the statement. Used for ordering. */
						offset?: number;
						/** A unique transaction ID assigned by the bank. Used for deduplication. */
						account_servicer_transaction_id?: string;
						/** Additional metadata provided by the bank for this transaction. */
						account_servicer_metadata?: Record<string, MoneybirdJsonValue>;
						/** Should be a valid adyen payment instrument id. */
						adyen_payment_instrument_id?: MoneybirdIdentifierInput;
						/** Set to `true` to remove this financial mutation from the statement. */
						_destroy?: boolean | string;
						/** Indicates that this financial mutation was created by a smart transfer rule. */
						smart_transfer?: boolean | string;
				  }>
				| Record<
						string,
						{
							/** The transaction date. */
							date?: string;
							/** The value date of the transaction, i.e. when the funds are actually credited or debited. May differ from the transaction date. */
							valutation_date?: string;
							/** The description or narrative of the bank transaction as provided by the bank. */
							message?: string;
							amount?: MoneybirdMoneyInput;
							/** The bank transaction type code, e.g. a SWIFT transaction code. Primarily used internally for bank statement imports and automatic booking; most API users can omit this. */
							code?: string;
							/** The name of the counterparty's account holder. */
							contra_account_name?: string;
							/** The account number (IBAN) of the counterparty. */
							contra_account_number?: string;
							/** A reference identifying a batch of transactions, e.g. for grouped SEPA payments. */
							batch_reference?: string;
							/** The position offset of this mutation within the statement. Used for ordering. */
							offset?: number;
							/** A unique transaction ID assigned by the bank. Used for deduplication. */
							account_servicer_transaction_id?: string;
							/** Additional metadata provided by the bank for this transaction. */
							account_servicer_metadata?: Record<string, MoneybirdJsonValue>;
							/** Should be a valid adyen payment instrument id. */
							adyen_payment_instrument_id?: MoneybirdIdentifierInput;
							/** Set to `true` to remove this financial mutation from the statement. */
							_destroy?: boolean | string;
							/** Indicates that this financial mutation was created by a smart transfer rule. */
							smart_transfer?: boolean | string;
						}
				  >;
		};
	};
	'financialStatements.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'financialStatements.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		financial_statement?: {
			/** A unique reference for this financial statement, e.g. the bank statement number. */
			reference?: string;
			/** The date of the official bank balance. */
			official_date?: string;
			official_balance?: MoneybirdMoneyInput;
			financial_mutations_attributes?:
				| Array<{
						/** The ID of an existing financial mutation to update. Omit when adding a new mutation. */
						id?: number;
						/** The transaction date. */
						date?: string;
						/** The description or narrative of the bank transaction. */
						message?: string;
						amount?: MoneybirdMoneyInput;
						/** The bank transaction type code. Primarily used internally for bank statement imports and automatic booking; most API users can omit this. */
						code?: string;
						/** The name of the counterparty's account holder. */
						contra_account_name?: string;
						/** The account number (IBAN) of the counterparty. */
						contra_account_number?: string;
						/** A reference identifying a batch of transactions. */
						batch_reference?: string;
						/** The position offset of this mutation within the statement. */
						offset?: number;
						/** A unique transaction ID assigned by the bank. Used internally for deduplication when importing bank statements. */
						account_servicer_transaction_id?: string;
						/** Should be a valid adyen payment instrument id. */
						adyen_payment_instrument_id?: MoneybirdIdentifierInput;
						/** Set to `true` to remove this financial mutation from the statement. */
						_destroy?: boolean | string;
				  }>
				| Record<
						string,
						{
							/** The ID of an existing financial mutation to update. Omit when adding a new mutation. */
							id?: number;
							/** The transaction date. */
							date?: string;
							/** The description or narrative of the bank transaction. */
							message?: string;
							amount?: MoneybirdMoneyInput;
							/** The bank transaction type code. Primarily used internally for bank statement imports and automatic booking; most API users can omit this. */
							code?: string;
							/** The name of the counterparty's account holder. */
							contra_account_name?: string;
							/** The account number (IBAN) of the counterparty. */
							contra_account_number?: string;
							/** A reference identifying a batch of transactions. */
							batch_reference?: string;
							/** The position offset of this mutation within the statement. */
							offset?: number;
							/** A unique transaction ID assigned by the bank. Used internally for deduplication when importing bank statements. */
							account_servicer_transaction_id?: string;
							/** Should be a valid adyen payment instrument id. */
							adyen_payment_instrument_id?: MoneybirdIdentifierInput;
							/** Set to `true` to remove this financial mutation from the statement. */
							_destroy?: boolean | string;
						}
				  >;
		};
	};
	'identities.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		identity?: {
			company_name: string;
			/** ISO two-character country code, e.g. NL or DE. */
			country: string;
			city: string;
			zipcode: string;
			address1: string;
			address2?: string;
			/** Should be a valid email addresses. */
			email: string;
			phone?: string;
			bank_account_name?: string;
			bank_account_number?: string;
			bank_account_bic?: string;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
	};
	'identities.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'identities.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'identities.getDefault': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'identities.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'identities.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		identity?: {
			company_name?: string;
			/** ISO two-character country code, e.g. NL or DE. */
			country?: string;
			city?: string;
			zipcode?: string;
			address1?: string;
			address2?: string;
			/** Should be a valid email addresses. */
			email?: string;
			phone?: string;
			bank_account_name?: string;
			bank_account_number?: string;
			bank_account_bic?: string;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
	};
	'identities.updateDefault': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		identity?: {
			company_name?: string;
			legal_entity_type?:
				| 'eenmanszaak'
				| 'maatschap'
				| 'vof'
				| 'bv'
				| 'cv'
				| 'nv'
				| 'stichting'
				| 'vereniging'
				| 'co\u00f6peratie'
				| 'geen_kvk_inschrijving';
			/** ISO two-character country code, e.g. NL or DE. */
			country?: string;
			city?: string;
			zipcode?: string;
			address1?: string;
			address2?: string;
			/** Should be a valid email addresses. */
			email?: string;
			phone?: string;
			bank_account_name?: string;
			bank_account_number?: string;
			bank_account_bic?: string;
			chamber_of_commerce?: string;
			tax_number?: string;
			/** Can be `below_tax_threshold` or `industry_exemption`. */
			tax_number_absence_reason?: string;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
			administration_attributes?: {
				legal_entity_type?:
					| 'eenmanszaak'
					| 'maatschap'
					| 'vof'
					| 'bv'
					| 'cv'
					| 'nv'
					| 'stichting'
					| 'vereniging'
					| 'co\u00f6peratie'
					| 'geen_kvk_inschrijving';
			};
		};
	};
	'ledgerAccounts.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ledger_account?: {
			/** Should be unique for this combination of administration and account type. */
			name: string;
			account_type:
				| 'non_current_assets'
				| 'current_assets'
				| 'equity'
				| 'provisions'
				| 'non_current_liabilities'
				| 'current_liabilities'
				| 'revenue'
				| 'direct_costs'
				| 'expenses'
				| 'other_income_expenses';
			/** Optional field, also known as general ledger code. Uniqueness is not enforced, but the auditfile export fails when a code is missing or used more than once. */
			account_id?: string | number;
			/** Id of the parent ledger account. Should be a valid ledger account id. */
			parent_id?: MoneybirdIdentifierInput;
			/** Restricts the document types this ledger account can be used on. Defaults to a set derived from the `account_type`. */
			allowed_document_types?: Array<
				| 'sales_invoice'
				| 'purchase_invoice'
				| 'general_journal_document'
				| 'financial_mutation'
				| 'payment'
			>;
			description?: string;
		};
		/** Existing RGS version 3.5 code, e.g. 'WMfoBelMfo' */
		rgs_code: string;
	};
	'ledgerAccounts.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'ledgerAccounts.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'ledgerAccounts.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'ledgerAccounts.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		ledger_account?: {
			/** Should be unique for this combination of administration and account type. */
			name?: string;
			/** Optional field, also known as general ledger code. Uniqueness is not enforced, but the auditfile export fails when a code is missing or used more than once. */
			account_id?: string | number;
			account_type?:
				| 'non_current_assets'
				| 'current_assets'
				| 'equity'
				| 'provisions'
				| 'non_current_liabilities'
				| 'current_liabilities'
				| 'revenue'
				| 'direct_costs'
				| 'expenses'
				| 'other_income_expenses';
			/** Id of the parent ledger account. Should be a valid ledger account id. */
			parent_id?: MoneybirdIdentifierInput;
			/** Restricts the document types this ledger account can be used on. Defaults to a set derived from the `account_type`. */
			allowed_document_types?: Array<
				| 'sales_invoice'
				| 'purchase_invoice'
				| 'general_journal_document'
				| 'financial_mutation'
				| 'payment'
			>;
			description?: string;
		};
		/** Existing RGS version 3.5 code, e.g. 'WMfoBelMfo' */
		rgs_code?: string;
	};
	'payments.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'products.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		product?: {
			/** The name of the product, displayed on invoices and estimates. */
			title?: string;
			/** A description of the product. Used as the default detail description when adding this product to a document. */
			description?: string;
			/** A description shown on the checkout page when selling this product online via Moneybird checkout. */
			checkout_description?: string;
			price: MoneybirdMoneyInput;
			/** Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** Should be a valid ledger account id. */
			ledger_account_id: MoneybirdIdentifierInput;
			/** Should be a valid tax rate id. */
			tax_rate_id?: MoneybirdIdentifierInput;
			/** Should be a valid workflow id. */
			workflow_id?: MoneybirdIdentifierInput;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Can be `product` or `subscription`. */
			checkout_type?: string;
			/** Can be `day`, `week`, `month`, `quarter` or `year`. */
			frequency_type?: string;
			/** Should be an integer >= 1. */
			frequency?: number;
			/** Can be `digital_service`, `service` or `product`. */
			product_type?: string;
			/** Can be `standard` or `reduced`. */
			vat_rate_type?: string;
			/** When `checkout_type` is `subscription`, should be an integer 0 <= *n* < 2. */
			max_amount_per_order?: number;
			/** Should be unique for the administration. */
			identifier?: string;
			/** Sets `frequency` and `frequency_type` in one value as `<frequency>:<frequency_type>`, e.g. `1:month` or `3:month`. `custom` is ignored, `nil` (e.g. `0:nil`) removes the billing interval. */
			frequency_preset?: string;
		};
	};
	'products.createSalesLink': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		contact_id?: MoneybirdIdentifierInput;
	};
	'products.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'products.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'products.getByIdentifier': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		identifier: string;
	};
	'products.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Free-text search across the product description, title and identifier. */
		query?: string;
		page?: number | string;
		per_page?: number | string;
		/** ISO three-character currency code, e.g. EUR or USD. */
		currency?: string;
		/** When true, only active products are returned. Set to false to include deactivated products. */
		active?: boolean | string;
		/** When true, returns only products with online checkout enabled. When false, returns only products without checkout. Omit to include both. */
		for_checkout?: boolean | string;
		/** Filters products by their associated ledger account. */
		ledger_account_id?: MoneybirdIdentifierInput;
	};
	'products.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		product?: {
			/** The name of the product, displayed on invoices and estimates. */
			title?: string;
			/** A description of the product. Used as the default detail description when adding this product to a document. */
			description?: string;
			/** A description shown on the checkout page when selling this product online. */
			checkout_description?: string;
			price?: MoneybirdMoneyInput;
			/** Should be a valid tax rate id. */
			tax_rate_id?: MoneybirdIdentifierInput;
			/** Should be a valid ledger account id. */
			ledger_account_id?: MoneybirdIdentifierInput;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Can be `day`, `week`, `month`, `quarter` or `year`. */
			frequency_type?: string;
			/** Should be an integer >= 1. */
			frequency?: number;
			/** Can be `digital_service`, `service` or `product`. */
			product_type?: string;
			/** Can be `standard` or `reduced`. */
			vat_rate_type?: string;
			/** Can be `product` or `subscription`. */
			checkout_type?: string;
			/** When `checkout_type` is `subscription`, should be an integer 0 <= *n* < 2. */
			max_amount_per_order?: number;
			/** Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** Should be a valid workflow id. */
			workflow_id?: MoneybirdIdentifierInput;
			/** Should be unique for the administration. */
			identifier?: string;
			/** Sets `frequency` and `frequency_type` in one value as `<frequency>:<frequency_type>`, e.g. `1:month` or `3:month`. `custom` is ignored, `nil` (e.g. `0:nil`) removes the billing interval. */
			frequency_preset?: string;
		};
	};
	'projects.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		project?: {
			/** Should be unique for the administration. */
			name: string;
			/** The budget for this project in hours. Both a decimal and a string are accepted. */
			budget?: MoneybirdNumberInput;
		};
	};
	'projects.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'projects.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'projects.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `state:active`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | state | `String` | `active` | `all`,… */
		filter?: string;
		per_page?: number | string;
		page?: number | string;
	};
	'projects.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		project?: {
			/** Should be unique for the administration. */
			name: string;
			/** The budget for this project in hours. */
			budget?: MoneybirdNumberInput;
		};
	};
	'purchaseTransactionBatches.createFromSepaFile': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** SEPA credit transfer file (pain.001.001.09/Version 2019) */
		file: FileInput;
		/** The ID of the ledger account that all transactions in the file will be booked on. If omitted, no booking is made and the bank transaction is left to automatic booking. */
		ledger_account_id?: MoneybirdIdentifierInput;
		/** The ID of the Moneybird Banking financial account that will be linked to all the purchase transactions in the file. Must be an active Moneybird Banking account. If not provided, the financial account will be determined based on the debtor account in the file. */
		financial_account_id?: MoneybirdIdentifierInput;
	};
	'purchaseTransactionBatches.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'purchaseTransactionBatches.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'purchaseTransactions.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'purchaseTransactions.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'purchaseTransactions.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:open`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | --- | --- | --- | --- | | state |… */
		filter?: string;
		page?: number | string;
		per_page?: number | string;
	};
	'recurringSalesInvoices.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		recurring_sales_invoice?: {
			/** Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** Should be a valid contact person id. */
			contact_person_id?: MoneybirdIdentifierInput;
			/** When `true`, the contact's address and other details are refreshed from the current contact record each time a new invoice is generated. */
			update_contact?: boolean | string;
			/** A reference to include on each generated invoice, e.g. a contract or project code. */
			reference?: string;
			/** Should be in the future. */
			invoice_date?: string;
			/** Should be a valid workflow id. If not provided, the contact's invoice workflow is used. */
			workflow_id?: MoneybirdIdentifierInput;
			/** ISO three-character currency code, e.g. EUR or USD. Defaults to the workflow's currency. */
			currency?: string;
			/** The number of days after the invoice date before each generated invoice is due. Defaults to the first workflow step's due interval. */
			first_due_interval?: number;
			/** Whether the prices on generated invoices are inclusive of tax. Defaults to the workflow's setting. */
			prices_are_incl_tax?: boolean | string;
			/** Discount percentage, e.g. 10,0%. */
			discount?: MoneybirdNumberInput;
			/** Can be `day`, `week`, `month`, `quarter` or `year`. */
			frequency_type?: string;
			/** The interval multiplier. Combined with `frequency_type` to determine the billing cycle, e.g. `frequency=2` with `frequency_type=month` creates an invoice every 2 months. */
			frequency?: string;
			/** When `true`, the recurring invoice will stop generating new invoices after `desired_count` invoices have been created. */
			has_desired_count?: boolean | string;
			/** The maximum number of invoices to generate. Only applied when `has_desired_count` is `true`. */
			desired_count?: string;
			/** When `true`, each generated invoice is automatically sent to the contact via the configured delivery method. */
			auto_send?: boolean | string;
			/** When `true`, generated invoices may be merged with other mergeable invoices for the same contact, if they share the same workflow, layout, currency, language and other invoice settings. */
			mergeable?: boolean | string;
			details_attributes?: MoneybirdDetailsAttributesInput;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
	};
	'recurringSalesInvoices.deactivate': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'recurringSalesInvoices.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'recurringSalesInvoices.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'recurringSalesInvoices.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'recurringSalesInvoices.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `state:active,contact_id:123`). A filter key you leave out keeps its default below. Available filters: | **Filter** | **Type** | **Default** | **Description** | | --- | --- | --- | --- | | state | `String` | `active` | `active` or… */
		filter?: string;
		page?: number | string;
		per_page?: number | string;
	};
	'recurringSalesInvoices.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /recurring_sales_invoices` — see that operation's description for the available keys. */
		filter?: string;
	};
	'recurringSalesInvoices.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		recurring_sales_invoice_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'recurringSalesInvoices.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		recurring_sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'recurringSalesInvoices.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		recurring_sales_invoice?: {
			/** Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** Should be a valid contact person id. */
			contact_person_id?: MoneybirdIdentifierNullableInput;
			/** When `true`, the contact's address and other details are refreshed from the current contact record each time a new invoice is generated. */
			update_contact?: boolean | string;
			/** A reference to include on each generated invoice, e.g. a contract or project code. */
			reference?: string;
			/** Should be in the future. */
			invoice_date?: string;
			/** Should be a valid workflow id. */
			workflow_id?: MoneybirdIdentifierInput;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** The number of days after the invoice date before each generated invoice is due. */
			first_due_interval?: number;
			/** Whether the prices on generated invoices are inclusive of tax. */
			prices_are_incl_tax?: boolean | string;
			/** Discount percentage, e.g. 10,0%. */
			discount?: MoneybirdNumberInput;
			/** Can be `day`, `week`, `month`, `quarter` or `year`. */
			frequency_type?: string;
			/** The interval multiplier. Combined with `frequency_type` to determine the billing cycle. */
			frequency?: string;
			/** When `true`, the recurring invoice stops after `desired_count` invoices have been created. */
			has_desired_count?: boolean | string;
			/** The maximum number of invoices to generate. Only applied when `has_desired_count` is `true`. */
			desired_count?: string;
			/** When `true`, each generated invoice is automatically sent to the contact. */
			auto_send?: boolean | string;
			/** When `true`, generated invoices may be merged with other mergeable invoices for the same contact, if they share the same workflow, layout, currency, language and other invoice settings. */
			mergeable?: boolean | string;
			details_attributes?: MoneybirdDetailsAttributesInput;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
	};
	'reports.assets': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
	};
	'reports.balanceSheet': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
	};
	'reports.bankBalance': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
	};
	'reports.cashFlow': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
		/** Filter the cash flow report by a specific financial account */
		financial_account_id?: MoneybirdIdentifierInput;
	};
	'reports.creditors': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
		page?: number | string;
		per_page?: number | string;
	};
	'reports.creditorsAging': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** A period until which a report should be generated. **Date range formats:** - `YYYYMM` (e.g., `202501`) **Preset options:** - `this_month` - Current month (default if not specified) - `prev_month` - Previous month - `this_quarter` - Current quarter - `prev_quarter` - Previous quarter -… */
		period_until?: string;
		page?: number | string;
		per_page?: number | string;
	};
	'reports.debtors': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
		page?: number | string;
		per_page?: number | string;
	};
	'reports.debtorsAging': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** A period until which a report should be generated. **Date range formats:** - `YYYYMM` (e.g., `202501`) **Preset options:** - `this_month` - Current month (default if not specified) - `prev_month` - Previous month - `this_quarter` - Current quarter - `prev_quarter` - Previous quarter -… */
		period_until?: string;
		page?: number | string;
		per_page?: number | string;
	};
	'reports.expensesByContact': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
		/** Only returns the amounts of this contact, in the total and in each period. */
		contact_id?: MoneybirdIdentifierInput;
		page?: number | string;
		per_page?: number | string;
	};
	'reports.expensesByProject': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
		page?: number | string;
		per_page?: number | string;
	};
	'reports.exportAuditfile': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The year for which to generate the auditfile */
		year: string;
		/** The XAF version of the auditfile */
		version?: '3.2' | '4.0';
	};
	'reports.exportBrugstaat': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The year for which to generate the brugstaat */
		year: string;
	};
	'reports.exportLedgerAccounts': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The year for which to generate the ledger accounts */
		year: string;
	};
	'reports.generalLedger': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
	};
	'reports.journalEntries': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		page?: number | string;
		per_page?: number | string;
		/** Filter by project ID, use "null" to filter entries without project */
		project_id?: string;
		/** Filter by contact ID, use "null" to filter entries without contact */
		contact_id?: string;
		/** Filter by ledger account ID */
		ledger_account_id?: MoneybirdIdentifierInput;
		/** Filter by ledger account type */
		account_type?:
			| 'non_current_assets'
			| 'current_assets'
			| 'equity'
			| 'non_current_liabilities'
			| 'current_liabilities'
			| 'revenue'
			| 'direct_costs'
			| 'expenses'
			| 'other_income_expenses'
			| 'other'
			| 'temporary'
			| 'provisions';
	};
	'reports.profitLoss': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
		project_id?: MoneybirdIdentifierInput;
	};
	'reports.revenueByContact': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
		/** Only returns the amounts of this contact, in the total and in each period. */
		contact_id?: MoneybirdIdentifierInput;
		page?: number | string;
		per_page?: number | string;
	};
	'reports.revenueByProject': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
		page?: number | string;
		per_page?: number | string;
	};
	'reports.subscriptions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
	};
	'reports.tax': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
	};
	'reports.workingCapital': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The period can be a date range or one of the presets. Date ranges must consist of whole months (start on 1st, end on last day of month). **Date range formats:** - `YYYYMMDD..YYYYMMDD` (e.g., `20250101..20250131`) - `YYYYMM..YYYYMM` (e.g., `202501..202501`) - `YYYYMM` (e.g., `202501`) **Preset… */
		period?: string;
		/** Splits the report into periods of a month, a quarter or a year. The response then also contains `periods`, with the same fields for each period. The first and the last period are cut off at the start and the end of `period`. */
		granularity?: 'month' | 'quarter' | 'year';
	};
	'salesInvoices.attachments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		file?: FileInput;
	};
	'salesInvoices.attachments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.attachments.download': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		sales_invoice: {
			contact_id: MoneybirdIdentifierInput;
			/** The ID of the contact person associated with the sales invoice. Should be a valid contact person id. */
			contact_person_id?: MoneybirdIdentifierInput;
			/** The ID of the estimate this invoice was created from. Used to link an invoice to its originating estimate. */
			original_estimate_id?: MoneybirdIdentifierInput;
			/** Default document style is used if value is not provided. Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** If value is not provided, the workflow saved in the contact is used. If the contact doesn't have a default workflow, the administration's default workflow is used. Should be a valid workflow id. */
			workflow_id?: MoneybirdIdentifierInput;
			/** Your own reference for this invoice, e.g. a project code or PO number. Visible to the recipient. */
			reference?: string;
			/** The sequence number that is put in the invoice number template, e.g. `0042`. If not provided, the next number in the sequence is used when the invoice is sent. */
			invoice_sequence_id?: string | number;
			/** When left empty, it is filled in when the invoice is sent. */
			invoice_date?: string;
			/** The number of days after the invoice date before the invoice is due. Defaults to the first workflow step's due interval. */
			first_due_interval?: number;
			/** ISO three-character currency code, e.g. EUR or USD. Defaults to the workflow's currency. */
			currency?: string;
			/** Whether the prices on the invoice are inclusive of tax. Defaults to the workflow's setting. */
			prices_are_incl_tax?: boolean | string;
			/** Free-text payment conditions printed on the invoice, e.g. "Payment within 30 days". Defaults to the workflow's payment conditions. */
			payment_conditions?: string;
			/** Discount percentage applied to the entire invoice, e.g. `10.0` for 10%. */
			discount?: MoneybirdNumberInput;
			/** An array of time entry IDs to associate with this invoice. Linked time entries will be marked as invoiced. */
			time_entry_ids?: Array<MoneybirdIdentifierInput>;
			details_attributes?: MoneybirdDetailsAttributesInput;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
		/** Set to `true` when the invoice was created from a Moneybird payment request. */
		from_payment_request?: boolean | string;
	};
	'salesInvoices.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.downloadPackingSlipPdf': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** In case you want to hide sender address and logo you can set this to 'stationery'. */
		media?: string;
	};
	'salesInvoices.downloadPdf': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** In case you want to hide sender address and logo you can set this to 'stationery'. */
		media?: string;
	};
	'salesInvoices.downloadUbl': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.duplicateAsCreditInvoice': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** The invoice lines to credit. When left out, all lines of the invoice are credited. */
		detail_ids?: Array<MoneybirdIdentifierInput>;
	};
	'salesInvoices.fetchByIds': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		ids: Array<number | string>;
	};
	'salesInvoices.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.getByInvoiceId': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Unique invoice identifier */
		invoice_id: string;
	};
	'salesInvoices.getByReference': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		reference: string;
	};
	'salesInvoices.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:all`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | - | - | - | - | | state | `String` |… */
		filter?: string;
		page?: number | string;
		/** Sorts the list on date, so the newest (`date_desc`) or the oldest (`date_asc`) items come first. */
		sort?: 'date_desc' | 'date_asc';
		per_page?: number | string;
	};
	'salesInvoices.listVersions': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Comma-separated `key:value` filter terms. Same syntax as `GET /sales_invoices` — see that operation's description for the available keys. */
		filter?: string;
	};
	'salesInvoices.markAsDubious': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		dubious_date?: string;
	};
	'salesInvoices.markAsUncollectible': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		uncollectible_date?: string;
		/** Can be `revenue`. */
		book_method?: string;
	};
	'salesInvoices.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		sales_invoice_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'salesInvoices.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.pause': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.payments.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		sales_invoice_id: MoneybirdIdentifierInput;
		payment?: {
			/** The date on which the payment was made. */
			payment_date: string;
			/** The amount paid in the document's currency. */
			price: MoneybirdMoneyInput;
			/** Amount paid expressed in the base currency of the administration. Required when the document uses a different currency than the administration's base currency. */
			price_base?: MoneybirdMoneyInput;
			/** The ID of the financial account (bank account or cash register) associated with this payment. Required for `private_payment` and `cash_payment` actions. Should be a valid financial account id. */
			financial_account_id?: MoneybirdIdentifierInput;
			/** The ID of the bank transaction to link this payment to. Required for `bank_transfer` actions. A financial mutation with `state` `processed` has no open amount left and answers 400. */
			financial_mutation_id?: MoneybirdIdentifierInput;
			/** An external transaction reference, e.g. a bank transaction ID or PSP reference. Used to match the payment with financial mutations. */
			transaction_identifier?: string;
			/** Can be `private_payment` (needs financial_account_id), `payment_without_proof`, `cash_payment` (needs financial_account_id), `rounding_error`, `bank_transfer` (needs financial_mutation_id), `balance_settlement` (needs ledger_account_id) or `invoices_settlement` (needs invoice_id).… */
			manual_payment_action?: string;
			/** The ID of the ledger account to book this payment to. Required for `balance_settlement` actions. Should be a valid ledger account id. */
			ledger_account_id?: MoneybirdIdentifierInput;
			/** The ID of the document to settle this payment against. Required for `invoices_settlement` actions. Should be a valid document id (sales invoice, purchase invoice, receipt, etc.). */
			invoice_id?: MoneybirdIdentifierInput;
		};
	};
	'salesInvoices.payments.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		sales_invoice_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.registerCreditInvoicePayment': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.resume': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'salesInvoices.send': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		sales_invoice_sending?: {
			delivery_method?: 'Email' | 'Peppol' | 'Manual';
			/** Schedule the invoice to be sent in the future instead of immediately. Combine with `invoice_date` to set the date on which it is sent. */
			sending_scheduled?: boolean | string;
			/** Attach a UBL (e-invoicing) file to the email. Only used when `delivery_method` is `Email`; defaults to the contact's UBL preference. */
			deliver_ubl?: boolean | string;
			/** When multiple scheduled invoices share the same contact, identity, workflow, document style, currency, language and invoice date, merge them into a single invoice before sending. */
			mergeable?: boolean | string;
			/** Recipient email address. Only used when `delivery_method` is `Email`; overrides the contact's default email address. */
			email_address?: string;
			/** Message included in the email. Only used when `delivery_method` is `Email`; defaults to the workflow's invoice email text. */
			email_message?: string;
			/** When scheduling, the date on which the invoice is sent. */
			invoice_date?: string;
		};
	};
	'salesInvoices.sendReminders': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		sales_invoice_reminders: Array<{
			contact_id: MoneybirdIdentifierInput;
			workflow_id: MoneybirdIdentifierInput;
			document_style_id: MoneybirdIdentifierInput;
			identity_id: MoneybirdIdentifierInput;
			/** Sales invoices of this contact to include in the reminder. */
			sales_invoice_ids: Array<MoneybirdIdentifierInput>;
			/** Message shown in the reminder. Defaults to the text of the next step in the workflow. */
			reminder_text?: string;
			/** How the reminder is delivered. Defaults to the contact's delivery method. */
			delivery_method?: 'Email' | 'Manual';
			/** Recipient email address. Only used when `delivery_method` is `Email`; defaults to the contact's email address. */
			email_address?: string;
		}>;
	};
	'salesInvoices.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		sales_invoice?: {
			/** The ID of the contact associated with the sales invoice. This is mandatory when setting the contact_person_id. Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** The ID of the contact person associated with the sales invoice. Should be a valid contact person id. */
			contact_person_id?: MoneybirdIdentifierInput;
			/** When `true`, the contact's address and other details are updated on the invoice from the current contact record. */
			update_contact?: boolean | string;
			/** The ID of the estimate this invoice was created from. Used to link an invoice to its originating estimate. */
			original_estimate_id?: MoneybirdIdentifierInput;
			/** Default document style is used if value is not provided. Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** If value is not provided, the workflow saved in the contact is used. If the contact doesn't have a default workflow, the administration's default workflow is used. Should be a valid workflow id. */
			workflow_id?: MoneybirdIdentifierInput;
			/** Your own reference for this invoice, e.g. a project code or PO number. Visible to the recipient. */
			reference?: string;
			/** The sequence number that is put in the invoice number template, e.g. `0042`. */
			invoice_sequence_id?: string | number;
			/** Set to `true` to remove the sequence number of an invoice that is not sent yet. The next number in the sequence is then used when the invoice is sent. */
			remove_invoice_sequence_id?: boolean | string;
			/** The date of the invoice. */
			invoice_date?: string;
			/** The number of days after the invoice date before the invoice is due. */
			first_due_interval?: number;
			/** ISO three-character currency code, e.g. EUR or USD. */
			currency?: string;
			/** Whether the prices on the invoice are inclusive of tax. */
			prices_are_incl_tax?: boolean | string;
			/** Free-text payment conditions printed on the invoice, e.g. "Payment within 30 days". */
			payment_conditions?: string;
			/** Discount percentage applied to the entire invoice, e.g. `10.0` for 10%. */
			discount?: MoneybirdNumberInput;
			/** An array of time entry IDs to associate with this invoice. Linked time entries will be marked as invoiced. */
			time_entry_ids?: Array<MoneybirdIdentifierInput>;
			details_attributes?: MoneybirdDetailsAttributesInput;
			custom_fields_attributes?: MoneybirdCustomFieldsAttributesInput;
		};
	};
	'subscriptionTemplates.createSalesLink': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		contact_id?: MoneybirdIdentifierInput;
		start_date?: string;
		product_id?: MoneybirdIdentifierInput;
	};
	'subscriptionTemplates.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		per_page?: number | string;
		page?: number | string;
	};
	'subscriptions.additionalCharges.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		product_id: MoneybirdIdentifierInput;
		/** The quantity on the invoice line, e.g. `1` or `5 x`. */
		amount: string | number;
		/** The price per unit. Defaults to the price of the product for this contact at the start of the period. */
		price?: MoneybirdMoneyInput;
		/** The period the charge applies to, e.g. `20250101..20250131`, `202501..202503` or `this_month`. */
		period: string;
		description: string;
		/** Your own reference for this charge. */
		identifier?: string;
	};
	'subscriptions.additionalCharges.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		/** If true, includes the additional charges that have already been billed. Default is false. */
		include_billed?: boolean | string;
	};
	'subscriptions.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		subscription: {
			start_date: string;
			/** Should be a valid product id. */
			product_id: MoneybirdIdentifierInput;
			/** Quantity of the product billed each period. */
			amount?: string;
			/** Both a decimal and a string '10,95' are accepted. */
			discount?: MoneybirdNumberInput;
			/** Should be a valid contact id. */
			contact_id: MoneybirdIdentifierInput;
			/** Should be a valid contact person id. */
			contact_person_id?: MoneybirdIdentifierInput;
			end_date?: string;
			reference?: string;
			/** Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			/** Number of periods between invoices, combined with `frequency_type`. Must be compatible with the product's frequency (e.g. a monthly product can be billed yearly). Defaults to the product's frequency. */
			frequency?: number;
			/** Length of a single billing period, combined with `frequency`. Defaults to the product's frequency type. */
			frequency_type?: 'day' | 'week' | 'month' | 'quarter' | 'year';
			/** Merge invoices from this subscription with other mergeable invoices for the same contact before sending. Only applies when invoices are sent automatically. */
			mergeable?: boolean | string;
			/** Whether the amounts on the generated invoices are inclusive of tax. */
			prices_are_incl_tax?: boolean | string;
		};
	};
	'subscriptions.createAndScheduleOneOffSalesInvoice': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		sales_invoice?: {
			details_attributes?: MoneybirdDetailsAttributesInput;
			/** Date to schedule the invoice for. Defaults to the date of the next subscription invoice. */
			invoice_date?: string;
		};
	};
	'subscriptions.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		subscription?: {
			end_date?: string;
		};
	};
	'subscriptions.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'subscriptions.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		contact_id: MoneybirdIdentifierInput;
	};
	'subscriptions.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		subscription?: {
			/** Should be a valid contact person id. */
			contact_person_id?: MoneybirdIdentifierNullableInput;
			/** Should be a valid document style id. */
			document_style_id?: MoneybirdIdentifierInput;
			reference?: string;
			/** Merge invoices from this subscription with other mergeable invoices for the same contact before sending. Only applies when invoices are sent automatically. */
			mergeable?: boolean | string;
			/** Whether the amounts on the generated invoices are inclusive of tax. */
			prices_are_incl_tax?: boolean | string;
			/** Should be a valid product id. */
			product_id?: MoneybirdIdentifierInput;
			start_date?: string;
			/** Quantity of the product billed each period. */
			amount?: string;
			/** Both a decimal and a string '10,95' are accepted. */
			discount?: MoneybirdNumberInput;
		};
	};
	'taskListGroups.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'taskListGroups.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'taskListGroups.tasks.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_group_id: MoneybirdIdentifierInput;
		task?: {
			name: string;
			description?: string;
			/** Report this task is based on; its content is generated from the report. */
			report_type?:
				| 'balance_sheet'
				| 'profit_loss'
				| 'debtor'
				| 'creditor'
				| 'assets';
			/** ID of the user to assign the task to. */
			assignee_id?: MoneybirdIdentifierInput;
			/** The ID of a ledger account to link to the task */
			related_entity_id?: MoneybirdIdentifierNullableInput;
			/** Whether to generate subtasks based on the related entity's children */
			generate_subtasks?: boolean;
		};
	};
	'taskListGroups.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		group?: {
			name?: string;
			/** Report this group is based on; its tasks are generated from the report. */
			report_type?:
				| 'balance_sheet'
				| 'profit_loss'
				| 'debtor'
				| 'creditor'
				| 'assets';
		};
	};
	'taskListTasks.assign': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_task_id: MoneybirdIdentifierInput;
		/** The ID of the user to assign to the task. A user must have permissions to a task or else a 404 will be thrown. */
		assignee_id: MoneybirdIdentifierInput;
	};
	'taskListTasks.complete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_task_id: MoneybirdIdentifierInput;
	};
	'taskListTasks.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'taskListTasks.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'taskListTasks.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_task_id: MoneybirdIdentifierInput;
		note?: {
			/** The note content */
			note: string;
			/** Whether the note is a to-do item */
			todo?: boolean;
		};
	};
	'taskListTasks.reopen': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_task_id: MoneybirdIdentifierInput;
	};
	'taskListTasks.unassign': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_task_id: MoneybirdIdentifierInput;
	};
	'taskListTasks.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		task?: {
			name?: string;
			description?: string;
			/** Report this task is based on; its content is generated from the report. */
			report_type?:
				| 'balance_sheet'
				| 'profit_loss'
				| 'debtor'
				| 'creditor'
				| 'assets';
			/** ID of the user to assign the task to. */
			assignee_id?: MoneybirdIdentifierInput;
			/** The ID of a ledger account to link to the task */
			related_entity_id?: MoneybirdIdentifierNullableInput;
			/** Whether to generate subtasks based on the related entity's children */
			generate_subtasks?: boolean;
		};
	};
	'taskListTemplates.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_template?: {
			name: string;
			description?: string;
			/** ISO 8601 duration string (e.g. P1M, P3M, P1Y) or friendly name (monthly, quarterly, yearly, none) */
			period?: string;
			/** ISO 8601 duration string representing the deadline offset from the period end */
			deadline_after?: string;
		};
	};
	'taskListTemplates.createTaskList': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_template_id: MoneybirdIdentifierInput;
		task_list?: {
			name?: string;
			description?: string;
			deadline_on?: string;
			period_begin?: string;
			period_end?: string;
		};
	};
	'taskListTemplates.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'taskListTemplates.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'taskListTemplates.groups.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_template_id: MoneybirdIdentifierInput;
		group?: {
			name: string;
			/** Report this group is based on; its tasks are generated from the report. */
			report_type?:
				| 'balance_sheet'
				| 'profit_loss'
				| 'debtor'
				| 'creditor'
				| 'assets';
		};
	};
	'taskListTemplates.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'taskListTemplates.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		task_list_template?: {
			name?: string;
			description?: string;
			/** ISO 8601 duration string (e.g. P1M, P3M, P1Y) or friendly name (monthly, quarterly, yearly, none) */
			period?: string;
			/** ISO 8601 duration string representing the deadline offset from the period end */
			deadline_after?: string;
		};
	};
	'taskLists.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list?: {
			name: string;
			description?: string;
			deadline_on?: string;
			period_begin?: string;
			period_end?: string;
			/** ID of a task list template to create the list from */
			template_id?: MoneybirdIdentifierInput;
		};
	};
	'taskLists.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'taskLists.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'taskLists.groups.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		task_list_id: MoneybirdIdentifierInput;
		group?: {
			name: string;
			/** Report this group is based on; its tasks are generated from the report. */
			report_type?:
				| 'balance_sheet'
				| 'profit_loss'
				| 'debtor'
				| 'creditor'
				| 'assets';
		};
	};
	'taskLists.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		per_page?: number | string;
		page?: number | string;
	};
	'taskLists.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		task_list?: {
			name?: string;
			description?: string;
			deadline_on?: string;
		};
	};
	'taxRates.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `percentage:21,tax_rate_type:sales_invoice`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | --- | --- | --- | --- | |… */
		filter?: string;
		page?: number | string;
		per_page?: number | string;
	};
	'timeEntries.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		time_entry?: {
			/** The employee for which the time should be entered. Should be a valid user id. */
			user_id: MoneybirdIdentifierInput;
			/** The start time of the time entry. Rounded down to full minutes. */
			started_at: MoneybirdTimestampInput;
			/** The end time of the time entry. Rounded down to full minutes. Omit to create a running (active) time entry. */
			ended_at?: MoneybirdTimestampInput;
			/** A description on how the time was spent. May be shown on the invoice. */
			description: string;
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** Should be a valid project id. */
			project_id?: MoneybirdIdentifierInput;
			/** Should be a valid sales invoice id. */
			sales_invoice_id?: MoneybirdIdentifierInput;
			/** Whether this time entry is billable to the client. */
			billable?: boolean | string;
			/** Total paused duration in seconds, is rounded down to full minutes. */
			paused_duration?: number;
		};
	};
	'timeEntries.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'timeEntries.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'timeEntries.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** Filters are `key:value` terms separated by commas (e.g. `period:this_year,state:all`). Any filter you pass replaces the defaults below entirely, so include every key you need. Available filters: | **Filter** | **Type** | **Default** | **Description** | | --- | --- | --- | --- | | state |… */
		filter?: string;
		page?: number | string;
		per_page?: number | string;
		/** Free-text search across the time entry description. */
		query?: string;
	};
	'timeEntries.notes.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		time_entry_id: MoneybirdIdentifierInput;
		note?: {
			/** **Required**. Text for the note or to-do. */
			note?: string;
			/** If `true` the note is a to-do. */
			todo?: boolean | string;
			/** Assign to-do to user. Should be a valid user id. If assignee_id is provided the note will be a to-do. */
			assignee_id?: MoneybirdIdentifierInput;
		};
	};
	'timeEntries.notes.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		time_entry_id: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'timeEntries.resume': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'timeEntries.stop': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'timeEntries.update': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
		time_entry?: {
			/** The start time of the time entry. Rounded down to full minutes. */
			started_at?: string;
			/** The end time of the time entry. Rounded down to full minutes. A time entry without `ended_at` is considered a running (active) time entry. */
			ended_at?: string;
			/** Total paused duration in seconds, is rounded down to full minutes. */
			paused_duration?: number;
			/** Should be a valid contact id. */
			contact_id?: MoneybirdIdentifierInput;
			/** Should be a valid project id. */
			project_id?: MoneybirdIdentifierInput;
			/** Should be a valid sales invoice id. */
			sales_invoice_id?: MoneybirdIdentifierInput;
			/** A description of how the time was spent. May be shown on the invoice. */
			description?: string;
			/** Whether this time entry is billable to the client. */
			billable?: boolean | string;
		};
	};
	'users.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		include_inactive?: boolean | string;
		include_accountants?: boolean | string;
		include_api_users?: boolean | string;
	};
	'verifications.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'webhooks.activate': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'webhooks.create': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		/** The HTTPS endpoint URL that will receive webhook notifications. Must respond with HTTP 200 on creation. */
		url: string;
		/** List of events to subscribe to. See [webhook events](https://developer.moneybird.com/webhooks/events) for all available events and event groups. */
		enabled_events?: Array<string>;
	};
	'webhooks.deactivate': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'webhooks.delete': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'webhooks.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
	'workflows.get': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
		id: MoneybirdIdentifierInput;
	};
	'workflows.list': {
		/** The administration to act on. Leave it out to use the administrationId plugin option or the administration_id saved on the connected account. */
		administration_id?: MoneybirdIdentifierInput;
	};
};

export type MoneybirdOperationOutputs = {
	'administrations.list': Array<MoneybirdAdministrationResponse>;
	'assets.create': MoneybirdAssetResponse;
	'assets.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'assets.disposals.create': MoneybirdDisposalResponse;
	'assets.get': MoneybirdAssetResponse;
	'assets.list': {
		/** One page of results. */
		items: Array<MoneybirdAssetResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'assets.reinvestmentReservePurchase.create': MoneybirdReinvestmentReservePurchaseResponse;
	'assets.reinvestmentReservePurchase.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'assets.reinvestmentReserveSale.create': MoneybirdReinvestmentReserveSaleResponse;
	'assets.reinvestmentReserveSale.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'assets.sources.create': MoneybirdSourceResponse;
	'assets.sources.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'assets.update': MoneybirdAssetResponse;
	'assets.valueChanges.createArbitrary': MoneybirdValueChangeResponse;
	'assets.valueChanges.createDivestment': MoneybirdValueChangeResponse;
	'assets.valueChanges.createFullDepreciation': MoneybirdValueChangeResponse;
	'assets.valueChanges.createManual': MoneybirdValueChangeResponse;
	'assets.valueChanges.createRetroactiveLinear': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.additionalCharges.create': MoneybirdSubscriptionAdditionalChargeResponse;
	'contacts.additionalCharges.list': Array<MoneybirdSubscriptionAdditionalChargeResponse>;
	'contacts.archive': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.contactPeople.create': MoneybirdContactPersonResponse;
	'contacts.contactPeople.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.contactPeople.get': MoneybirdContactPersonResponse;
	'contacts.contactPeople.update': MoneybirdContactPersonResponse;
	'contacts.create': MoneybirdContactResponse;
	'contacts.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.fetchByIds': Array<MoneybirdContactResponse>;
	'contacts.filter': {
		/** One page of results. */
		items: Array<MoneybirdContactResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'contacts.get': MoneybirdContactResponse;
	'contacts.getByCustomerId': MoneybirdContactResponse;
	'contacts.list': {
		/** One page of results. */
		items: Array<MoneybirdContactResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'contacts.listDuplicates': {
		/** One page of results. */
		items: Array<{
			contacts?: Array<MoneybirdSimpleContactResponse> | null;
		}>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'contacts.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'contacts.notes.create': MoneybirdNoteResponse;
	'contacts.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.paymentsMandate.createUrl': {
		url?: string | null;
	};
	'contacts.paymentsMandate.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.paymentsMandate.get': MoneybirdRecurringContractResponse;
	'contacts.paymentsMandate.request': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.update': MoneybirdContactResponse;
	'customFields.list': Array<MoneybirdCustomFieldResponse>;
	'customerContactPortal.get': string;
	'customerContactPortal.getSubscription': string;
	'customerContactPortal.listInvoices': string;
	'documentStyles.list': Array<MoneybirdDocumentStyleResponse>;
	'documents.generalDocuments.attachments.create': number;
	'documents.generalDocuments.attachments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.generalDocuments.attachments.download': FileOutput;
	'documents.generalDocuments.create': MoneybirdGeneralDocumentResponse;
	'documents.generalDocuments.delete':
		| number
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'documents.generalDocuments.fetchByIds': Array<MoneybirdGeneralDocumentResponse>;
	'documents.generalDocuments.get': MoneybirdGeneralDocumentResponse;
	'documents.generalDocuments.list': {
		/** One page of results. */
		items: Array<MoneybirdGeneralDocumentResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'documents.generalDocuments.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'documents.generalDocuments.notes.create': MoneybirdNoteResponse;
	'documents.generalDocuments.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.generalDocuments.update': MoneybirdGeneralDocumentResponse;
	'documents.generalJournalDocuments.attachments.create': number;
	'documents.generalJournalDocuments.attachments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.generalJournalDocuments.attachments.download': FileOutput;
	'documents.generalJournalDocuments.create': MoneybirdGeneralJournalDocumentResponse;
	'documents.generalJournalDocuments.delete':
		| number
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'documents.generalJournalDocuments.fetchByIds': Array<MoneybirdGeneralJournalDocumentResponse>;
	'documents.generalJournalDocuments.get': MoneybirdGeneralJournalDocumentResponse;
	'documents.generalJournalDocuments.list': {
		/** One page of results. */
		items: Array<MoneybirdGeneralJournalDocumentResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'documents.generalJournalDocuments.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'documents.generalJournalDocuments.notes.create': MoneybirdNoteResponse;
	'documents.generalJournalDocuments.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.generalJournalDocuments.update': MoneybirdGeneralJournalDocumentResponse;
	'documents.purchaseInvoices.attachments.create': number;
	'documents.purchaseInvoices.attachments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.purchaseInvoices.attachments.download': FileOutput;
	'documents.purchaseInvoices.create': MoneybirdPurchaseInvoiceResponse;
	'documents.purchaseInvoices.delete':
		| number
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'documents.purchaseInvoices.fetchByIds': Array<MoneybirdPurchaseInvoiceResponse>;
	'documents.purchaseInvoices.get': MoneybirdPurchaseInvoiceResponse;
	'documents.purchaseInvoices.list': {
		/** One page of results. */
		items: Array<MoneybirdPurchaseInvoiceResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'documents.purchaseInvoices.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'documents.purchaseInvoices.notes.create': MoneybirdNoteResponse;
	'documents.purchaseInvoices.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.purchaseInvoices.payments.create': MoneybirdPaymentResponse;
	'documents.purchaseInvoices.payments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.purchaseInvoices.update': MoneybirdPurchaseInvoiceResponse;
	'documents.receipts.attachments.create': number;
	'documents.receipts.attachments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.receipts.attachments.download': FileOutput;
	'documents.receipts.create': MoneybirdReceiptResponse;
	'documents.receipts.delete':
		| number
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'documents.receipts.fetchByIds': Array<MoneybirdReceiptResponse>;
	'documents.receipts.get': MoneybirdReceiptResponse;
	'documents.receipts.list': {
		/** One page of results. */
		items: Array<MoneybirdReceiptResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'documents.receipts.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'documents.receipts.notes.create': MoneybirdNoteResponse;
	'documents.receipts.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.receipts.payments.create': MoneybirdPaymentResponse;
	'documents.receipts.payments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.receipts.update': MoneybirdReceiptResponse;
	'documents.typelessDocuments.attachments.create': number;
	'documents.typelessDocuments.attachments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'documents.typelessDocuments.attachments.download': FileOutput;
	'documents.typelessDocuments.create': MoneybirdTypelessDocumentResponse;
	'documents.typelessDocuments.delete':
		| number
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'documents.typelessDocuments.fetchByIds': Array<MoneybirdTypelessDocumentResponse>;
	'documents.typelessDocuments.get': MoneybirdTypelessDocumentResponse;
	'documents.typelessDocuments.list': {
		/** One page of results. */
		items: Array<MoneybirdTypelessDocumentResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'documents.typelessDocuments.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'downloads.download': FileOutput;
	'downloads.list': {
		/** One page of results. */
		items: Array<MoneybirdDownloadResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'estimates.attachments.create': number;
	'estimates.attachments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'estimates.attachments.download': FileOutput;
	'estimates.bill': MoneybirdSalesInvoiceResponse;
	'estimates.changeState': MoneybirdEstimateResponse;
	'estimates.create': MoneybirdEstimateResponse;
	'estimates.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'estimates.downloadPdf': FileOutput;
	'estimates.downloadSignedPdf': FileOutput;
	'estimates.fetchByIds': Array<MoneybirdEstimateResponse>;
	'estimates.get': MoneybirdEstimateResponse;
	'estimates.getByEstimateId': MoneybirdEstimateResponse;
	'estimates.list': {
		/** One page of results. */
		items: Array<MoneybirdEstimateResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'estimates.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'estimates.notes.create': MoneybirdNoteResponse;
	'estimates.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'estimates.send': MoneybirdEstimateResponse;
	'estimates.update': MoneybirdEstimateResponse;
	'events.list': Array<MoneybirdEventResponse>;
	'externalSalesInvoices.attachments.create': number;
	'externalSalesInvoices.attachments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'externalSalesInvoices.attachments.download': FileOutput;
	'externalSalesInvoices.create': MoneybirdExternalSalesInvoiceResponse;
	'externalSalesInvoices.createFromAttachment': number;
	'externalSalesInvoices.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'externalSalesInvoices.fetchByIds': Array<MoneybirdExternalSalesInvoiceResponse>;
	'externalSalesInvoices.get': MoneybirdExternalSalesInvoiceResponse;
	'externalSalesInvoices.list': {
		/** One page of results. */
		items: Array<MoneybirdExternalSalesInvoiceResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'externalSalesInvoices.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'externalSalesInvoices.markAsDubious': MoneybirdExternalSalesInvoiceResponse;
	'externalSalesInvoices.markAsUncollectible': MoneybirdExternalSalesInvoiceResponse;
	'externalSalesInvoices.notes.create': MoneybirdNoteResponse;
	'externalSalesInvoices.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'externalSalesInvoices.payments.create': MoneybirdPaymentResponse;
	'externalSalesInvoices.payments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'externalSalesInvoices.update': MoneybirdExternalSalesInvoiceResponse;
	'financialAccounts.list': Array<MoneybirdFinancialAccountResponse>;
	'financialMutations.fetchByIds': Array<MoneybirdFinancialMutationResponse>;
	'financialMutations.get': MoneybirdFinancialMutationResponse;
	'financialMutations.linkBooking': MoneybirdFinancialMutationResponse;
	'financialMutations.list': Array<MoneybirdFinancialMutationResponse>;
	'financialMutations.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'financialMutations.unlinkBooking':
		| MoneybirdFinancialMutationResponse
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'financialStatements.create': MoneybirdFinancialStatementResponse;
	'financialStatements.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'financialStatements.update': MoneybirdFinancialStatementResponse;
	'identities.create': MoneybirdIdentityResponse;
	'identities.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'identities.get': MoneybirdIdentityResponse;
	'identities.getDefault': MoneybirdIdentityResponse;
	'identities.list': Array<MoneybirdIdentityResponse>;
	'identities.update': MoneybirdIdentityResponse;
	'identities.updateDefault': MoneybirdIdentityResponse;
	'ledgerAccounts.create': MoneybirdLedgerAccountResponse;
	'ledgerAccounts.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'ledgerAccounts.get': MoneybirdLedgerAccountResponse;
	'ledgerAccounts.list': Array<MoneybirdLedgerAccountResponse>;
	'ledgerAccounts.update': MoneybirdLedgerAccountResponse;
	'payments.get': MoneybirdPaymentResponse;
	'products.create': MoneybirdProductResponse;
	'products.createSalesLink': string;
	'products.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'products.get': MoneybirdProductResponse;
	'products.getByIdentifier': MoneybirdProductResponse;
	'products.list': {
		/** One page of results. */
		items: Array<MoneybirdProductResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.update': MoneybirdProductResponse;
	'projects.create': MoneybirdProjectResponse;
	'projects.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'projects.get': MoneybirdProjectResponse;
	'projects.list': {
		/** One page of results. */
		items: Array<MoneybirdProjectResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.update': MoneybirdProjectResponse;
	'purchaseTransactionBatches.createFromSepaFile': Array<MoneybirdPurchaseTransactionBatchResponse>;
	'purchaseTransactionBatches.download': FileOutput;
	'purchaseTransactionBatches.get': MoneybirdPurchaseTransactionBatchResponse;
	'purchaseTransactions.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'purchaseTransactions.get': MoneybirdPurchaseTransactionResponse;
	'purchaseTransactions.list': {
		/** One page of results. */
		items: Array<MoneybirdPurchaseTransactionResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'recurringSalesInvoices.create': MoneybirdRecurringSalesInvoiceResponse;
	'recurringSalesInvoices.deactivate': MoneybirdRecurringSalesInvoiceResponse;
	'recurringSalesInvoices.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'recurringSalesInvoices.fetchByIds': Array<MoneybirdRecurringSalesInvoiceResponse>;
	'recurringSalesInvoices.get': MoneybirdRecurringSalesInvoiceResponse;
	'recurringSalesInvoices.list': {
		/** One page of results. */
		items: Array<MoneybirdRecurringSalesInvoiceResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'recurringSalesInvoices.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'recurringSalesInvoices.notes.create': MoneybirdNoteResponse;
	'recurringSalesInvoices.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'recurringSalesInvoices.update': MoneybirdRecurringSalesInvoiceResponse;
	'reports.assets': Array<{
		asset_id?: MoneybirdIdentifier | null;
		ledger_account_id?: MoneybirdIdentifier | null;
		name?: string | null;
		purchase_date?: string | null;
		/** In seconds */
		lifespan?: string | null;
		purchase_value?: string | null;
		calculated_purchase_value?: string | null;
		residual_value?: string | null;
		total_value_changes_since_purchase?: string | null;
		value_at_begin?: string | null;
		investment?: string | null;
		depreciation?: string | null;
		divestment?: string | null;
		value_changes?: string | null;
		value_at_end?: string | null;
		/** Amount booked on an asset whose purchase date is after the end of the period */
		value_not_in_use?: string | null;
	}>;
	'reports.balanceSheet': {
		debit?: MoneybirdBalanceSheetDebit | null;
		credit?: MoneybirdBalanceSheetCredit | null;
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<{
			/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
			period?: string | null;
			debit?: MoneybirdBalanceSheetDebit | null;
			credit?: MoneybirdBalanceSheetCredit | null;
		}> | null;
	};
	'reports.bankBalance': MoneybirdBankBalanceAmounts & {
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<
			{
				/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
				period?: string | null;
			} & MoneybirdBankBalanceAmounts
		> | null;
	};
	'reports.cashFlow': MoneybirdCashFlowAmounts & {
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<
			{
				/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
				period?: string | null;
			} & MoneybirdCashFlowAmounts
		> | null;
	};
	'reports.creditors': {
		creditors?: Array<MoneybirdCreditorsReportItem> | null;
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<{
			/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
			period?: string | null;
			creditors?: Array<MoneybirdCreditorsReportItem> | null;
		}> | null;
	};
	'reports.creditorsAging': {
		creditors?: Array<MoneybirdAgingReportItem> | null;
	};
	'reports.debtors': {
		debtors?: Array<MoneybirdDebtorsReportItem> | null;
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<{
			/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
			period?: string | null;
			debtors?: Array<MoneybirdDebtorsReportItem> | null;
		}> | null;
	};
	'reports.debtorsAging': {
		debtors?: Array<MoneybirdAgingReportItem> | null;
	};
	'reports.expensesByContact': {
		expenses_by_contact?: Array<MoneybirdContactReportItem> | null;
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<{
			/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
			period?: string | null;
			expenses_by_contact?: Array<MoneybirdContactReportItem> | null;
		}> | null;
	};
	'reports.expensesByProject': {
		expenses_by_project?: Array<MoneybirdProjectReportItem> | null;
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<{
			/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
			period?: string | null;
			expenses_by_project?: Array<MoneybirdProjectReportItem> | null;
		}> | null;
	};
	'reports.exportAuditfile': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'reports.exportBrugstaat': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'reports.exportLedgerAccounts': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'reports.generalLedger': MoneybirdGeneralLedgerAmounts & {
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<
			{
				/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
				period?: string | null;
			} & MoneybirdGeneralLedgerAmounts
		> | null;
	};
	'reports.journalEntries': {
		/** One page of results. */
		items: Array<{
			/** Unique identifier for the journal entry */
			id?: string | null;
			/** Date of the journal entry */
			date?: string | null;
			/** Type of document this entry relates to */
			document_type?: string | null;
			/** ID of the related document */
			document_id?: MoneybirdIdentifier | null;
			/** ID of the ledger account */
			ledger_account_id?: MoneybirdIdentifier | null;
			/** ID of the related project, if any */
			project_id?: MoneybirdIdentifierNullable | null;
			/** ID of the related contact, if any */
			contact_id?: MoneybirdIdentifierNullable | null;
			/** ID of the applied tax rate, if any */
			tax_rate_id?: MoneybirdIdentifierNullable | null;
			/** ID of the financial account, if any */
			financial_account_id?: MoneybirdIdentifierNullable | null;
			/** Amount of the journal entry in the administration's currency */
			amount?: string | null;
			/** Description of the journal entry */
			description?: string | null;
		}>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'reports.profitLoss': MoneybirdProfitLossAmounts & {
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<
			{
				/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
				period?: string | null;
			} & MoneybirdProfitLossAmounts
		> | null;
	};
	'reports.revenueByContact': {
		revenue_by_contact?: Array<MoneybirdContactReportItem> | null;
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<{
			/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
			period?: string | null;
			revenue_by_contact?: Array<MoneybirdContactReportItem> | null;
		}> | null;
	};
	'reports.revenueByProject': {
		revenue_by_project?: Array<MoneybirdProjectReportItem> | null;
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<{
			/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
			period?: string | null;
			revenue_by_project?: Array<MoneybirdProjectReportItem> | null;
		}> | null;
	};
	'reports.subscriptions': {
		monthly_recurring_revenue?: string | null;
		annual_run_rate?: string | null;
		churn_rate?: string | null;
		lifetime_value?: string | null;
	};
	'reports.tax': MoneybirdTaxReportAmounts & {
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<
			{
				/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
				period?: string | null;
			} & MoneybirdTaxReportAmounts
		> | null;
	};
	'reports.workingCapital': MoneybirdWorkingCapitalAmounts & {
		/** Only present when `granularity` is given. One item for each month, quarter or year in `period`, oldest first. */
		periods?: Array<
			{
				/** The period of this item, in the same format as the `period` parameter (e.g. `202501..202503`). */
				period?: string | null;
			} & MoneybirdWorkingCapitalAmounts
		> | null;
	};
	'salesInvoices.attachments.create': number;
	'salesInvoices.attachments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'salesInvoices.attachments.download': FileOutput;
	'salesInvoices.create': MoneybirdSalesInvoiceResponse;
	'salesInvoices.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'salesInvoices.downloadPackingSlipPdf': FileOutput;
	'salesInvoices.downloadPdf': FileOutput;
	'salesInvoices.downloadUbl': FileOutput;
	'salesInvoices.duplicateAsCreditInvoice': MoneybirdSalesInvoiceResponse;
	'salesInvoices.fetchByIds': Array<MoneybirdSalesInvoiceResponse>;
	'salesInvoices.get': MoneybirdSalesInvoiceResponse;
	'salesInvoices.getByInvoiceId': MoneybirdSalesInvoiceResponse;
	'salesInvoices.getByReference': MoneybirdSalesInvoiceResponse;
	'salesInvoices.list': {
		/** One page of results. */
		items: Array<MoneybirdSalesInvoiceResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'salesInvoices.listVersions': Array<{
		id?: (number | string) | null;
		version?: (number | string) | null;
	}>;
	'salesInvoices.markAsDubious': MoneybirdSalesInvoiceResponse;
	'salesInvoices.markAsUncollectible': MoneybirdSalesInvoiceResponse;
	'salesInvoices.notes.create': MoneybirdNoteResponse;
	'salesInvoices.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'salesInvoices.pause': MoneybirdSalesInvoiceResponse;
	'salesInvoices.payments.create': MoneybirdPaymentResponse;
	'salesInvoices.payments.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'salesInvoices.registerCreditInvoicePayment': MoneybirdSalesInvoiceResponse;
	'salesInvoices.resume': MoneybirdSalesInvoiceResponse;
	'salesInvoices.send': MoneybirdSalesInvoiceResponse;
	'salesInvoices.sendReminders': number;
	'salesInvoices.update': MoneybirdSalesInvoiceResponse;
	'subscriptionTemplates.createSalesLink': string;
	'subscriptionTemplates.list': {
		/** One page of results. */
		items: Array<MoneybirdSubscriptionTemplateResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'subscriptions.additionalCharges.create': MoneybirdSubscriptionAdditionalChargeResponse;
	'subscriptions.additionalCharges.list': Array<MoneybirdSubscriptionAdditionalChargeResponse>;
	'subscriptions.create': MoneybirdSubscriptionResponse;
	'subscriptions.createAndScheduleOneOffSalesInvoice': MoneybirdSalesInvoiceResponse;
	'subscriptions.delete':
		| MoneybirdSubscriptionResponse
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'subscriptions.get': MoneybirdSubscriptionResponse;
	'subscriptions.list': Array<MoneybirdSubscriptionResponse>;
	'subscriptions.update': MoneybirdSubscriptionResponse;
	'taskListGroups.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'taskListGroups.get': MoneybirdTaskListGroupResponse;
	'taskListGroups.tasks.create': MoneybirdTaskListTaskResponse;
	'taskListGroups.update': MoneybirdTaskListGroupResponse;
	'taskListTasks.assign': MoneybirdTaskListTaskResponse;
	'taskListTasks.complete': MoneybirdTaskListTaskResponse;
	'taskListTasks.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'taskListTasks.get': MoneybirdTaskListTaskResponse;
	'taskListTasks.notes.create': MoneybirdNoteResponse;
	'taskListTasks.reopen':
		| MoneybirdTaskListTaskResponse
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'taskListTasks.unassign':
		| MoneybirdTaskListTaskResponse
		| {
				/** Moneybird accepted the call; it answered with no body. */ success: true;
		  };
	'taskListTasks.update': MoneybirdTaskListTaskResponse;
	'taskListTemplates.create': MoneybirdTaskListTemplateResponse;
	'taskListTemplates.createTaskList': MoneybirdTaskListResponse;
	'taskListTemplates.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'taskListTemplates.get': MoneybirdTaskListTemplateResponse;
	'taskListTemplates.groups.create': MoneybirdTaskListGroupResponse;
	'taskListTemplates.list': Array<MoneybirdTaskListTemplateResponse>;
	'taskListTemplates.update': MoneybirdTaskListTemplateResponse;
	'taskLists.create': MoneybirdTaskListResponse;
	'taskLists.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'taskLists.get': MoneybirdTaskListResponse;
	'taskLists.groups.create': MoneybirdTaskListGroupResponse;
	'taskLists.list': {
		/** One page of results. */
		items: Array<MoneybirdTaskListResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'taskLists.update': MoneybirdTaskListResponse;
	'taxRates.list': {
		/** One page of results. */
		items: Array<MoneybirdTaxRateResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'timeEntries.create': MoneybirdTimeEntryResponse;
	'timeEntries.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'timeEntries.get': MoneybirdTimeEntryResponse;
	'timeEntries.list': {
		/** One page of results. */
		items: Array<MoneybirdTimeEntryResponse>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'timeEntries.notes.create': MoneybirdNoteResponse;
	'timeEntries.notes.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'timeEntries.resume': MoneybirdTimeEntryResponse;
	'timeEntries.stop': MoneybirdTimeEntryResponse;
	'timeEntries.update': MoneybirdTimeEntryResponse;
	'users.list': Array<MoneybirdExtendedUserResponse>;
	'verifications.list': MoneybirdVerificationResponse;
	'webhooks.activate': MoneybirdWebhookResponse;
	'webhooks.create': MoneybirdWebhookResponse;
	'webhooks.deactivate': MoneybirdWebhookResponse;
	'webhooks.delete': {
		/** Moneybird accepted the call; it answered with no body. */
		success: true;
	};
	'webhooks.list': Array<MoneybirdWebhookResponse>;
	'workflows.get': MoneybirdWorkflowResponse;
	'workflows.list': Array<MoneybirdWorkflowResponse>;
};
