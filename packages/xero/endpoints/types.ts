import { z } from 'zod';
import {
	XeroAccount,
	XeroBankTransaction,
	XeroContact,
	XeroCreditNote,
	XeroInvoice,
	XeroItem,
	XeroPayment,
	XeroPurchaseOrder,
	XeroQuote,
} from '../schema/database';

// ── Shared Types ─────────────────────────────────────────────────────────────

const PaginationInputSchema = z.object({
	page: z.number().int().positive().optional(),
	pageSize: z.number().int().positive().optional(),
	where: z.string().optional(),
	order: z.string().optional(),
	tenantId: z.string().optional(),
});

// ── 1. Bank Transactions ─────────────────────────────────────────────────────

export const BankTransactionsCreateInputSchema = z.object({
	tenantId: z.string().optional(),
	Type: z.enum(['SPEND', 'RECEIVE', 'RECEIVE-TRANSFER', 'SPEND-TRANSFER']),
	Contact: z.object({
		ContactID: z.string().optional(),
		Name: z.string().optional(),
	}),
	BankAccount: z.object({
		AccountID: z.string().optional(),
		Code: z.string().optional(),
	}),
	LineItems: z.array(
		z.object({
			Description: z.string(),
			Quantity: z.number().optional(),
			UnitAmount: z.number(),
			AccountCode: z.string().optional(),
			TaxType: z.string().optional(),
		}),
	),
	Date: z.string().optional(),
	Reference: z.string().optional(),
});

export const BankTransactionsCreateResponseSchema = z.object({
	BankTransactions: z.array(XeroBankTransaction),
});

export const BankTransactionsListInputSchema = PaginationInputSchema.extend({
	bankAccountID: z.string().optional(),
	since: z.string().optional(),
});

export const BankTransactionsListResponseSchema = z.object({
	BankTransactions: z.array(XeroBankTransaction),
});

// ── 2. Contacts ──────────────────────────────────────────────────────────────

export const ContactsCreateInputSchema = z.object({
	tenantId: z.string().optional(),
	Name: z.string(),
	FirstName: z.string().optional(),
	LastName: z.string().optional(),
	EmailAddress: z.string().optional(),
	AccountNumber: z.string().optional(),
	ContactNumber: z.string().optional(),
	TaxNumber: z.string().optional(),
	BankAccountDetails: z.string().optional(),
	IsSupplier: z.boolean().optional(),
	IsCustomer: z.boolean().optional(),
});

export const ContactsCreateResponseSchema = z.object({
	Contacts: z.array(XeroContact),
});

export const ContactsListInputSchema = PaginationInputSchema.extend({
	searchTerm: z.string().optional(),
	includeArchived: z.boolean().optional(),
	summaryOnly: z.boolean().optional(),
});

export const ContactsListResponseSchema = z.object({
	Contacts: z.array(XeroContact),
});

export const ContactsUpdateInputSchema = z.object({
	tenantId: z.string().optional(),
	contactId: z.string(),
	Name: z.string().optional(),
	FirstName: z.string().optional(),
	LastName: z.string().optional(),
	EmailAddress: z.string().optional(),
	AccountNumber: z.string().optional(),
	ContactNumber: z.string().optional(),
	TaxNumber: z.string().optional(),
	BankAccountDetails: z.string().optional(),
	IsSupplier: z.boolean().optional(),
	IsCustomer: z.boolean().optional(),
	ContactStatus: z.string().optional(),
});

export const ContactsUpdateResponseSchema = z.object({
	Contacts: z.array(XeroContact),
});

// ── 3. Invoices ──────────────────────────────────────────────────────────────

export const InvoicesCreateInputSchema = z.object({
	tenantId: z.string().optional(),
	Type: z.enum(['ACCREC', 'ACCPAY']),
	Contact: z.object({
		ContactID: z.string().optional(),
		Name: z.string().optional(),
		ContactNumber: z.string().optional(),
	}),
	LineItems: z.array(
		z.object({
			Description: z.string().optional(),
			Quantity: z.number().optional(),
			UnitAmount: z.number().optional(),
			ItemCode: z.string().optional(),
			AccountCode: z.string().optional(),
			TaxType: z.string().optional(),
			DiscountRate: z.number().optional(),
		}),
	),
	Date: z.string().optional(),
	DueDate: z.string().optional(),
	InvoiceNumber: z.string().optional(),
	Reference: z.string().optional(),
	Status: z.enum(['DRAFT', 'SUBMITTED', 'AUTHORISED']).optional(),
	CurrencyCode: z.string().optional(),
});

export const InvoicesCreateResponseSchema = z.object({
	Invoices: z.array(XeroInvoice),
});

export const InvoicesGetInputSchema = z.object({
	tenantId: z.string().optional(),
	invoiceId: z.string(),
});

export const InvoicesGetResponseSchema = z.object({
	Invoices: z.array(XeroInvoice),
});

export const InvoicesListInputSchema = PaginationInputSchema.extend({
	Ids: z.array(z.string()).optional(),
	InvoiceNumbers: z.array(z.string()).optional(),
	ContactIDs: z.array(z.string()).optional(),
	Statuses: z.array(z.string()).optional(),
	summaryOnly: z.boolean().optional(),
});

export const InvoicesListResponseSchema = z.object({
	Invoices: z.array(XeroInvoice),
});

export const InvoicesUpdateInputSchema = z.object({
	tenantId: z.string().optional(),
	invoiceId: z.string(),
	Contact: z
		.object({
			ContactID: z.string().optional(),
			Name: z.string().optional(),
		})
		.optional(),
	LineItems: z
		.array(
			z.object({
				Description: z.string().optional(),
				Quantity: z.number().optional(),
				UnitAmount: z.number().optional(),
				ItemCode: z.string().optional(),
				AccountCode: z.string().optional(),
				TaxType: z.string().optional(),
			}),
		)
		.optional(),
	Status: z.enum(['DRAFT', 'SUBMITTED', 'AUTHORISED', 'VOIDED']).optional(),
	DueDate: z.string().optional(),
	Reference: z.string().optional(),
});

export const InvoicesUpdateResponseSchema = z.object({
	Invoices: z.array(XeroInvoice),
});

// ── 4. Items ─────────────────────────────────────────────────────────────────

export const ItemsCreateInputSchema = z.object({
	tenantId: z.string().optional(),
	Code: z.string(),
	Name: z.string().optional(),
	Description: z.string().optional(),
	PurchaseDescription: z.string().optional(),
	PurchaseDetails: z
		.object({
			UnitPrice: z.number().optional(),
			AccountCode: z.string().optional(),
			TaxType: z.string().optional(),
		})
		.optional(),
	SalesDetails: z
		.object({
			UnitPrice: z.number().optional(),
			AccountCode: z.string().optional(),
			TaxType: z.string().optional(),
		})
		.optional(),
	IsTrackedAsInventory: z.boolean().optional(),
	InventoryAssetAccountCode: z.string().optional(),
});

export const ItemsCreateResponseSchema = z.object({
	Items: z.array(XeroItem),
});

export const ItemsGetInputSchema = z.object({
	tenantId: z.string().optional(),
	itemId: z.string(),
});

export const ItemsGetResponseSchema = z.object({
	Items: z.array(XeroItem),
});

export const ItemsListInputSchema = PaginationInputSchema.extend({});

export const ItemsListResponseSchema = z.object({
	Items: z.array(XeroItem),
});

// ── 5. Payments ──────────────────────────────────────────────────────────────

export const PaymentsCreateInputSchema = z.object({
	tenantId: z.string().optional(),
	Invoice: z.object({
		InvoiceID: z.string().optional(),
		InvoiceNumber: z.string().optional(),
	}),
	Account: z.object({
		AccountID: z.string().optional(),
		Code: z.string().optional(),
	}),
	Amount: z.number(),
	Date: z.string().optional(),
	Reference: z.string().optional(),
});

export const PaymentsCreateResponseSchema = z.object({
	Payments: z.array(XeroPayment),
});

export const PaymentsListInputSchema = PaginationInputSchema.extend({});

export const PaymentsListResponseSchema = z.object({
	Payments: z.array(XeroPayment),
});

// ── 6. Purchase Orders ───────────────────────────────────────────────────────

export const PurchaseOrdersCreateInputSchema = z.object({
	tenantId: z.string().optional(),
	Contact: z.object({
		ContactID: z.string().optional(),
		Name: z.string().optional(),
	}),
	LineItems: z.array(
		z.object({
			Description: z.string().optional(),
			Quantity: z.number().optional(),
			UnitAmount: z.number().optional(),
			ItemCode: z.string().optional(),
			AccountCode: z.string().optional(),
			TaxType: z.string().optional(),
		}),
	),
	Date: z.string().optional(),
	DeliveryDate: z.string().optional(),
	Reference: z.string().optional(),
	Status: z.enum(['DRAFT', 'SUBMITTED', 'AUTHORISED', 'BILLED']).optional(),
});

export const PurchaseOrdersCreateResponseSchema = z.object({
	PurchaseOrders: z.array(XeroPurchaseOrder),
});

export const PurchaseOrdersGetInputSchema = z.object({
	tenantId: z.string().optional(),
	purchaseOrderId: z.string(),
});

export const PurchaseOrdersGetResponseSchema = z.object({
	PurchaseOrders: z.array(XeroPurchaseOrder),
});

export const PurchaseOrdersListInputSchema = PaginationInputSchema.extend({
	status: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
});

export const PurchaseOrdersListResponseSchema = z.object({
	PurchaseOrders: z.array(XeroPurchaseOrder),
});

// ── 7. Accounts ──────────────────────────────────────────────────────────────

export const AccountsGetInputSchema = z.object({
	tenantId: z.string().optional(),
	accountId: z.string(),
});

export const AccountsGetResponseSchema = z.object({
	Accounts: z.array(XeroAccount),
});

export const AccountsListInputSchema = PaginationInputSchema.extend({});

export const AccountsListResponseSchema = z.object({
	Accounts: z.array(XeroAccount),
});

// ── 8. Assets ────────────────────────────────────────────────────────────────

export const AssetsGetInputSchema = z.object({
	tenantId: z.string().optional(),
	assetId: z.string(),
});

export const AssetsGetResponseSchema = z
	.object({
		assetId: z.string().optional(),
		assetName: z.string().optional(),
		assetNumber: z.string().optional(),
		purchaseDate: z.string().optional(),
		purchasePrice: z.number().optional(),
		assetStatus: z.string().optional(),
		bookValue: z.number().optional(),
	})
	.loose();

export const AssetsListInputSchema = PaginationInputSchema.extend({
	status: z.string().optional(),
});

export const AssetsListResponseSchema = z
	.object({
		items: z.array(z.record(z.string(), z.unknown())),
		pagination: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

// ── 9. Reports ───────────────────────────────────────────────────────────────

export const ReportsGetBalanceSheetInputSchema = z.object({
	tenantId: z.string().optional(),
	date: z.string().optional(),
	periods: z.number().optional(),
	timeframe: z.enum(['MONTH', 'QUARTER', 'YEAR']).optional(),
	trackingCategoryID: z.string().optional(),
	trackingOptionID: z.string().optional(),
	paymentsOnly: z.boolean().optional(),
});

export const ReportsGetBalanceSheetResponseSchema = z.object({
	Reports: z.array(
		z
			.object({
				ReportID: z.string().optional(),
				ReportName: z.string().optional(),
				ReportType: z.string().optional(),
				ReportDate: z.string().optional(),
				Rows: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.loose(),
	),
});

export const ReportsGetProfitLossInputSchema = z.object({
	tenantId: z.string().optional(),
	fromDate: z.string().optional(),
	toDate: z.string().optional(),
	periods: z.number().optional(),
	timeframe: z.enum(['MONTH', 'QUARTER', 'YEAR']).optional(),
	trackingCategoryID: z.string().optional(),
	trackingOptionID: z.string().optional(),
	paymentsOnly: z.boolean().optional(),
});

export const ReportsGetProfitLossResponseSchema = z.object({
	Reports: z.array(
		z
			.object({
				ReportID: z.string().optional(),
				ReportName: z.string().optional(),
				ReportType: z.string().optional(),
				ReportDate: z.string().optional(),
				Rows: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.loose(),
	),
});

// ── 10. Budgets ──────────────────────────────────────────────────────────────

export const BudgetsGetInputSchema = z.object({
	tenantId: z.string().optional(),
	budgetId: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
});

export const BudgetsGetResponseSchema = z.object({
	Budgets: z.array(
		z
			.object({
				BudgetID: z.string().optional(),
				Type: z.string().optional(),
				Description: z.string().optional(),
				UpdatedDateUTC: z.string().optional(),
				BudgetLines: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.loose(),
	),
});

// ── 11. Connections ──────────────────────────────────────────────────────────

export const ConnectionsGetInputSchema = z.object({});

export const ConnectionItemSchema = z
	.object({
		id: z.string(),
		tenantId: z.string(),
		tenantType: z.string(),
		tenantName: z.string().optional(),
		createdDateUtc: z.string().optional(),
		updatedDateUtc: z.string().optional(),
	})
	.loose();

export const ConnectionsGetResponseSchema = z.array(ConnectionItemSchema);

// ── 12. Manual Journals ──────────────────────────────────────────────────────

export const ManualJournalsGetInputSchema = z.object({
	tenantId: z.string().optional(),
	manualJournalId: z.string(),
});

export const ManualJournalsGetResponseSchema = z.object({
	ManualJournals: z.array(
		z
			.object({
				ManualJournalID: z.string(),
				Narration: z.string(),
				Date: z.string().optional(),
				Status: z.string().optional(),
				Lines: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.loose(),
	),
});

export const ManualJournalsListInputSchema = PaginationInputSchema.extend({});

export const ManualJournalsListResponseSchema = z.object({
	ManualJournals: z.array(
		z
			.object({
				ManualJournalID: z.string(),
				Narration: z.string(),
				Date: z.string().optional(),
				Status: z.string().optional(),
			})
			.loose(),
	),
});

// ── 13. Organisation ─────────────────────────────────────────────────────────

export const OrganisationsGetInputSchema = z.object({
	tenantId: z.string().optional(),
});

export const OrganisationsGetResponseSchema = z.object({
	Organisations: z.array(
		z
			.object({
				OrganisationID: z.string().optional(),
				Name: z.string(),
				LegalName: z.string().optional(),
				PaysTax: z.boolean().optional(),
				Version: z.string().optional(),
				OrganisationType: z.string().optional(),
				BaseCurrency: z.string().optional(),
				CountryCode: z.string().optional(),
				Timezone: z.string().optional(),
				SalesTaxBasis: z.string().optional(),
				SalesTaxPeriod: z.string().optional(),
			})
			.loose(),
	),
});

// ── 14. Projects ─────────────────────────────────────────────────────────────

export const ProjectsGetInputSchema = z.object({
	tenantId: z.string().optional(),
	projectId: z.string(),
});

export const ProjectsGetResponseSchema = z
	.object({
		projectId: z.string(),
		contactId: z.string().optional(),
		name: z.string(),
		currencyCode: z.string().optional(),
		deadlineUtc: z.string().optional(),
		totalTaskAmount: z.number().optional(),
		totalExpenseAmount: z.number().optional(),
		estimateAmount: z.number().optional(),
		status: z.string().optional(),
	})
	.loose();

export const ProjectsListInputSchema = PaginationInputSchema.extend({
	contactId: z.string().optional(),
	states: z.string().optional(),
});

export const ProjectsListResponseSchema = z
	.object({
		items: z.array(
			z
				.object({
					projectId: z.string(),
					name: z.string(),
					contactId: z.string().optional(),
					status: z.string().optional(),
				})
				.loose(),
		),
		pagination: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

// ── 15. Quotes ───────────────────────────────────────────────────────────────

export const QuotesListInputSchema = PaginationInputSchema.extend({
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	expiryDateFrom: z.string().optional(),
	expiryDateTo: z.string().optional(),
	status: z.string().optional(),
	contactID: z.string().optional(),
});

export const QuotesListResponseSchema = z.object({
	Quotes: z.array(XeroQuote),
});

// ── 16. Attachments ──────────────────────────────────────────────────────────

export const AttachmentsListInputSchema = z.object({
	tenantId: z.string().optional(),
	endpoint: z.enum([
		'Invoices',
		'Contacts',
		'ManualJournals',
		'PurchaseOrders',
		'BankTransactions',
	]),
	entityId: z.string(),
});

export const AttachmentItemSchema = z
	.object({
		AttachmentID: z.string(),
		FileName: z.string(),
		Url: z.string().optional(),
		MimeType: z.string().optional(),
		ContentLength: z.number().optional(),
	})
	.loose();

export const AttachmentsListResponseSchema = z.object({
	Attachments: z.array(AttachmentItemSchema),
});

export const AttachmentsUploadInputSchema = z.object({
	tenantId: z.string().optional(),
	endpoint: z.enum([
		'Invoices',
		'Contacts',
		'ManualJournals',
		'PurchaseOrders',
		'BankTransactions',
	]),
	entityId: z.string(),
	fileName: z.string(),
	mimeType: z.string().optional(),
	fileContent: z.string(), // base64 or raw string
});

export const AttachmentsUploadResponseSchema = z.object({
	Attachments: z.array(AttachmentItemSchema),
});

// ── 17. Credit Notes ─────────────────────────────────────────────────────────

export const CreditNotesListInputSchema = PaginationInputSchema.extend({});

export const CreditNotesListResponseSchema = z.object({
	CreditNotes: z.array(XeroCreditNote),
});

// ── 18. Files & Folders ──────────────────────────────────────────────────────

export const FilesListInputSchema = PaginationInputSchema.extend({});

export const FilesListResponseSchema = z
	.object({
		Items: z.array(
			z
				.object({
					Id: z.string(),
					Name: z.string(),
					Size: z.number().optional(),
					MimeType: z.string().optional(),
					CreatedDateUtc: z.string().optional(),
				})
				.loose(),
		),
		TotalCount: z.number().optional(),
	})
	.loose();

export const FilesListFoldersInputSchema = z.object({
	tenantId: z.string().optional(),
});

export const FilesListFoldersResponseSchema = z.array(
	z
		.object({
			Id: z.string(),
			Name: z.string(),
			FileCount: z.number().optional(),
			IsInbox: z.boolean().optional(),
		})
		.loose(),
);

// ── 19. Journals ─────────────────────────────────────────────────────────────

export const JournalsListInputSchema = PaginationInputSchema.extend({
	offset: z.number().optional(),
	paymentsOnly: z.boolean().optional(),
});

export const JournalsListResponseSchema = z.object({
	Journals: z.array(
		z
			.object({
				JournalID: z.string(),
				JournalDate: z.string(),
				JournalNumber: z.number(),
				CreatedDateUTC: z.string(),
				JournalLines: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.loose(),
	),
});

// ── 20. Tax Rates ────────────────────────────────────────────────────────────

export const TaxRatesListInputSchema = PaginationInputSchema.extend({});

export const TaxRatesListResponseSchema = z.object({
	TaxRates: z.array(
		z
			.object({
				Name: z.string(),
				TaxType: z.string(),
				Status: z.string().optional(),
				EffectiveRate: z.number().optional(),
				CanApplyToAssets: z.boolean().optional(),
				CanApplyToEquity: z.boolean().optional(),
				CanApplyToExpenses: z.boolean().optional(),
				CanApplyToLiabilities: z.boolean().optional(),
				CanApplyToRevenue: z.boolean().optional(),
			})
			.loose(),
	),
});

// ── 21. Tracking Categories ──────────────────────────────────────────────────

export const TrackingCategoriesListInputSchema = PaginationInputSchema.extend({
	includeArchived: z.boolean().optional(),
});

export const TrackingCategoriesListResponseSchema = z.object({
	TrackingCategories: z.array(
		z
			.object({
				TrackingCategoryID: z.string(),
				Name: z.string(),
				Status: z.string().optional(),
				Options: z
					.array(
						z
							.object({
								TrackingOptionID: z.string().optional(),
								Name: z.string(),
								Status: z.string().optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	),
});

// ── Aggregate Input & Output Types ───────────────────────────────────────────

export type BankTransactionsCreateInput = z.infer<
	typeof BankTransactionsCreateInputSchema
>;
export type BankTransactionsCreateResponse = z.infer<
	typeof BankTransactionsCreateResponseSchema
>;
export type BankTransactionsListInput = z.infer<
	typeof BankTransactionsListInputSchema
>;
export type BankTransactionsListResponse = z.infer<
	typeof BankTransactionsListResponseSchema
>;

export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;
export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

export type InvoicesCreateInput = z.infer<typeof InvoicesCreateInputSchema>;
export type InvoicesCreateResponse = z.infer<
	typeof InvoicesCreateResponseSchema
>;
export type InvoicesGetInput = z.infer<typeof InvoicesGetInputSchema>;
export type InvoicesGetResponse = z.infer<typeof InvoicesGetResponseSchema>;
export type InvoicesListInput = z.infer<typeof InvoicesListInputSchema>;
export type InvoicesListResponse = z.infer<typeof InvoicesListResponseSchema>;
export type InvoicesUpdateInput = z.infer<typeof InvoicesUpdateInputSchema>;
export type InvoicesUpdateResponse = z.infer<
	typeof InvoicesUpdateResponseSchema
>;

export type ItemsCreateInput = z.infer<typeof ItemsCreateInputSchema>;
export type ItemsCreateResponse = z.infer<typeof ItemsCreateResponseSchema>;
export type ItemsGetInput = z.infer<typeof ItemsGetInputSchema>;
export type ItemsGetResponse = z.infer<typeof ItemsGetResponseSchema>;
export type ItemsListInput = z.infer<typeof ItemsListInputSchema>;
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;

export type PaymentsCreateInput = z.infer<typeof PaymentsCreateInputSchema>;
export type PaymentsCreateResponse = z.infer<
	typeof PaymentsCreateResponseSchema
>;
export type PaymentsListInput = z.infer<typeof PaymentsListInputSchema>;
export type PaymentsListResponse = z.infer<typeof PaymentsListResponseSchema>;

export type PurchaseOrdersCreateInput = z.infer<
	typeof PurchaseOrdersCreateInputSchema
>;
export type PurchaseOrdersCreateResponse = z.infer<
	typeof PurchaseOrdersCreateResponseSchema
>;
export type PurchaseOrdersGetInput = z.infer<
	typeof PurchaseOrdersGetInputSchema
>;
export type PurchaseOrdersGetResponse = z.infer<
	typeof PurchaseOrdersGetResponseSchema
>;
export type PurchaseOrdersListInput = z.infer<
	typeof PurchaseOrdersListInputSchema
>;
export type PurchaseOrdersListResponse = z.infer<
	typeof PurchaseOrdersListResponseSchema
>;

export type AccountsGetInput = z.infer<typeof AccountsGetInputSchema>;
export type AccountsGetResponse = z.infer<typeof AccountsGetResponseSchema>;
export type AccountsListInput = z.infer<typeof AccountsListInputSchema>;
export type AccountsListResponse = z.infer<typeof AccountsListResponseSchema>;

export type AssetsGetInput = z.infer<typeof AssetsGetInputSchema>;
export type AssetsGetResponse = z.infer<typeof AssetsGetResponseSchema>;
export type AssetsListInput = z.infer<typeof AssetsListInputSchema>;
export type AssetsListResponse = z.infer<typeof AssetsListResponseSchema>;

export type ReportsGetBalanceSheetInput = z.infer<
	typeof ReportsGetBalanceSheetInputSchema
>;
export type ReportsGetBalanceSheetResponse = z.infer<
	typeof ReportsGetBalanceSheetResponseSchema
>;
export type ReportsGetProfitLossInput = z.infer<
	typeof ReportsGetProfitLossInputSchema
>;
export type ReportsGetProfitLossResponse = z.infer<
	typeof ReportsGetProfitLossResponseSchema
>;

export type BudgetsGetInput = z.infer<typeof BudgetsGetInputSchema>;
export type BudgetsGetResponse = z.infer<typeof BudgetsGetResponseSchema>;

export type ConnectionsGetInput = z.infer<typeof ConnectionsGetInputSchema>;
export type ConnectionsGetResponse = z.infer<
	typeof ConnectionsGetResponseSchema
>;

export type ManualJournalsGetInput = z.infer<
	typeof ManualJournalsGetInputSchema
>;
export type ManualJournalsGetResponse = z.infer<
	typeof ManualJournalsGetResponseSchema
>;
export type ManualJournalsListInput = z.infer<
	typeof ManualJournalsListInputSchema
>;
export type ManualJournalsListResponse = z.infer<
	typeof ManualJournalsListResponseSchema
>;

export type OrganisationsGetInput = z.infer<typeof OrganisationsGetInputSchema>;
export type OrganisationsGetResponse = z.infer<
	typeof OrganisationsGetResponseSchema
>;

export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

export type QuotesListInput = z.infer<typeof QuotesListInputSchema>;
export type QuotesListResponse = z.infer<typeof QuotesListResponseSchema>;

export type AttachmentsListInput = z.infer<typeof AttachmentsListInputSchema>;
export type AttachmentsListResponse = z.infer<
	typeof AttachmentsListResponseSchema
>;
export type AttachmentsUploadInput = z.infer<
	typeof AttachmentsUploadInputSchema
>;
export type AttachmentsUploadResponse = z.infer<
	typeof AttachmentsUploadResponseSchema
>;

export type CreditNotesListInput = z.infer<typeof CreditNotesListInputSchema>;
export type CreditNotesListResponse = z.infer<
	typeof CreditNotesListResponseSchema
>;

export type FilesListInput = z.infer<typeof FilesListInputSchema>;
export type FilesListResponse = z.infer<typeof FilesListResponseSchema>;
export type FilesListFoldersInput = z.infer<typeof FilesListFoldersInputSchema>;
export type FilesListFoldersResponse = z.infer<
	typeof FilesListFoldersResponseSchema
>;

export type JournalsListInput = z.infer<typeof JournalsListInputSchema>;
export type JournalsListResponse = z.infer<typeof JournalsListResponseSchema>;

export type TaxRatesListInput = z.infer<typeof TaxRatesListInputSchema>;
export type TaxRatesListResponse = z.infer<typeof TaxRatesListResponseSchema>;

export type TrackingCategoriesListInput = z.infer<
	typeof TrackingCategoriesListInputSchema
>;
export type TrackingCategoriesListResponse = z.infer<
	typeof TrackingCategoriesListResponseSchema
>;

export type XeroEndpointInputs = {
	bankTransactionsCreate: BankTransactionsCreateInput;
	bankTransactionsList: BankTransactionsListInput;
	contactsCreate: ContactsCreateInput;
	contactsList: ContactsListInput;
	contactsUpdate: ContactsUpdateInput;
	invoicesCreate: InvoicesCreateInput;
	invoicesGet: InvoicesGetInput;
	invoicesList: InvoicesListInput;
	invoicesUpdate: InvoicesUpdateInput;
	itemsCreate: ItemsCreateInput;
	itemsGet: ItemsGetInput;
	itemsList: ItemsListInput;
	paymentsCreate: PaymentsCreateInput;
	paymentsList: PaymentsListInput;
	purchaseOrdersCreate: PurchaseOrdersCreateInput;
	purchaseOrdersGet: PurchaseOrdersGetInput;
	purchaseOrdersList: PurchaseOrdersListInput;
	accountsGet: AccountsGetInput;
	accountsList: AccountsListInput;
	assetsGet: AssetsGetInput;
	assetsList: AssetsListInput;
	reportsGetBalanceSheet: ReportsGetBalanceSheetInput;
	reportsGetProfitLoss: ReportsGetProfitLossInput;
	budgetsGet: BudgetsGetInput;
	connectionsGet: ConnectionsGetInput;
	manualJournalsGet: ManualJournalsGetInput;
	manualJournalsList: ManualJournalsListInput;
	organisationsGet: OrganisationsGetInput;
	projectsGet: ProjectsGetInput;
	projectsList: ProjectsListInput;
	quotesList: QuotesListInput;
	attachmentsList: AttachmentsListInput;
	attachmentsUpload: AttachmentsUploadInput;
	creditNotesList: CreditNotesListInput;
	filesList: FilesListInput;
	filesListFolders: FilesListFoldersInput;
	journalsList: JournalsListInput;
	taxRatesList: TaxRatesListInput;
	trackingCategoriesList: TrackingCategoriesListInput;
};

export type XeroEndpointOutputs = {
	bankTransactionsCreate: BankTransactionsCreateResponse;
	bankTransactionsList: BankTransactionsListResponse;
	contactsCreate: ContactsCreateResponse;
	contactsList: ContactsListResponse;
	contactsUpdate: ContactsUpdateResponse;
	invoicesCreate: InvoicesCreateResponse;
	invoicesGet: InvoicesGetResponse;
	invoicesList: InvoicesListResponse;
	invoicesUpdate: InvoicesUpdateResponse;
	itemsCreate: ItemsCreateResponse;
	itemsGet: ItemsGetResponse;
	itemsList: ItemsListResponse;
	paymentsCreate: PaymentsCreateResponse;
	paymentsList: PaymentsListResponse;
	purchaseOrdersCreate: PurchaseOrdersCreateResponse;
	purchaseOrdersGet: PurchaseOrdersGetResponse;
	purchaseOrdersList: PurchaseOrdersListResponse;
	accountsGet: AccountsGetResponse;
	accountsList: AccountsListResponse;
	assetsGet: AssetsGetResponse;
	assetsList: AssetsListResponse;
	reportsGetBalanceSheet: ReportsGetBalanceSheetResponse;
	reportsGetProfitLoss: ReportsGetProfitLossResponse;
	budgetsGet: BudgetsGetResponse;
	connectionsGet: ConnectionsGetResponse;
	manualJournalsGet: ManualJournalsGetResponse;
	manualJournalsList: ManualJournalsListResponse;
	organisationsGet: OrganisationsGetResponse;
	projectsGet: ProjectsGetResponse;
	projectsList: ProjectsListResponse;
	quotesList: QuotesListResponse;
	attachmentsList: AttachmentsListResponse;
	attachmentsUpload: AttachmentsUploadResponse;
	creditNotesList: CreditNotesListResponse;
	filesList: FilesListResponse;
	filesListFolders: FilesListFoldersResponse;
	journalsList: JournalsListResponse;
	taxRatesList: TaxRatesListResponse;
	trackingCategoriesList: TrackingCategoriesListResponse;
};

export const XeroEndpointInputSchemas = {
	bankTransactionsCreate: BankTransactionsCreateInputSchema,
	bankTransactionsList: BankTransactionsListInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsList: ContactsListInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	invoicesCreate: InvoicesCreateInputSchema,
	invoicesGet: InvoicesGetInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesUpdate: InvoicesUpdateInputSchema,
	itemsCreate: ItemsCreateInputSchema,
	itemsGet: ItemsGetInputSchema,
	itemsList: ItemsListInputSchema,
	paymentsCreate: PaymentsCreateInputSchema,
	paymentsList: PaymentsListInputSchema,
	purchaseOrdersCreate: PurchaseOrdersCreateInputSchema,
	purchaseOrdersGet: PurchaseOrdersGetInputSchema,
	purchaseOrdersList: PurchaseOrdersListInputSchema,
	accountsGet: AccountsGetInputSchema,
	accountsList: AccountsListInputSchema,
	assetsGet: AssetsGetInputSchema,
	assetsList: AssetsListInputSchema,
	reportsGetBalanceSheet: ReportsGetBalanceSheetInputSchema,
	reportsGetProfitLoss: ReportsGetProfitLossInputSchema,
	budgetsGet: BudgetsGetInputSchema,
	connectionsGet: ConnectionsGetInputSchema,
	manualJournalsGet: ManualJournalsGetInputSchema,
	manualJournalsList: ManualJournalsListInputSchema,
	organisationsGet: OrganisationsGetInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsList: ProjectsListInputSchema,
	quotesList: QuotesListInputSchema,
	attachmentsList: AttachmentsListInputSchema,
	attachmentsUpload: AttachmentsUploadInputSchema,
	creditNotesList: CreditNotesListInputSchema,
	filesList: FilesListInputSchema,
	filesListFolders: FilesListFoldersInputSchema,
	journalsList: JournalsListInputSchema,
	taxRatesList: TaxRatesListInputSchema,
	trackingCategoriesList: TrackingCategoriesListInputSchema,
} as const;

export const XeroEndpointOutputSchemas = {
	bankTransactionsCreate: BankTransactionsCreateResponseSchema,
	bankTransactionsList: BankTransactionsListResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	invoicesCreate: InvoicesCreateResponseSchema,
	invoicesGet: InvoicesGetResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesUpdate: InvoicesUpdateResponseSchema,
	itemsCreate: ItemsCreateResponseSchema,
	itemsGet: ItemsGetResponseSchema,
	itemsList: ItemsListResponseSchema,
	paymentsCreate: PaymentsCreateResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	purchaseOrdersCreate: PurchaseOrdersCreateResponseSchema,
	purchaseOrdersGet: PurchaseOrdersGetResponseSchema,
	purchaseOrdersList: PurchaseOrdersListResponseSchema,
	accountsGet: AccountsGetResponseSchema,
	accountsList: AccountsListResponseSchema,
	assetsGet: AssetsGetResponseSchema,
	assetsList: AssetsListResponseSchema,
	reportsGetBalanceSheet: ReportsGetBalanceSheetResponseSchema,
	reportsGetProfitLoss: ReportsGetProfitLossResponseSchema,
	budgetsGet: BudgetsGetResponseSchema,
	connectionsGet: ConnectionsGetResponseSchema,
	manualJournalsGet: ManualJournalsGetResponseSchema,
	manualJournalsList: ManualJournalsListResponseSchema,
	organisationsGet: OrganisationsGetResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsList: ProjectsListResponseSchema,
	quotesList: QuotesListResponseSchema,
	attachmentsList: AttachmentsListResponseSchema,
	attachmentsUpload: AttachmentsUploadResponseSchema,
	creditNotesList: CreditNotesListResponseSchema,
	filesList: FilesListResponseSchema,
	filesListFolders: FilesListFoldersResponseSchema,
	journalsList: JournalsListResponseSchema,
	taxRatesList: TaxRatesListResponseSchema,
	trackingCategoriesList: TrackingCategoriesListResponseSchema,
} as const;
