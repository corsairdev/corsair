import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeXeroRequest, XeroAPIError } from './client';
import {
	Accounts,
	Assets,
	Attachments,
	BankTransactions,
	Budgets,
	Connections,
	Contacts,
	CreditNotes,
	Files,
	Invoices,
	Items,
	Journals,
	ManualJournals,
	Organisations,
	Payments,
	Projects,
	PurchaseOrders,
	Quotes,
	Reports,
	TaxRates,
	TrackingCategories,
} from './endpoints';
import {
	XeroEndpointInputSchemas,
	XeroEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { xero } from './index';
import { XeroSchema } from './schema';
import {
	createXeroEventMatch,
	verifyXeroWebhookSignature,
} from './webhooks/types';

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeXeroRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn(),
	};
});

const mockMakeXeroRequest = makeXeroRequest as jest.MockedFunction<
	typeof makeXeroRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function createMockContext(apiKey = 'test-token', tenantId = 'tenant-123') {
	const upsertByEntityId = jest.fn().mockResolvedValue({ id: 'db-entity-1' });
	return {
		key: apiKey,
		pluginId: 'xero',
		authType: 'oauth_2' as const,
		options: { tenantId },
		schema: XeroSchema,
		db: {
			contacts: { upsertByEntityId },
			invoices: { upsertByEntityId },
			bankTransactions: { upsertByEntityId },
			accounts: { upsertByEntityId },
			items: { upsertByEntityId },
			payments: { upsertByEntityId },
			purchaseOrders: { upsertByEntityId },
			creditNotes: { upsertByEntityId },
			quotes: { upsertByEntityId },
		},
	} as any;
}

describe('Xero Schema Tests', () => {
	it('declares a semver version', () => {
		expect(XeroSchema.version).toBeDefined();
		expect(XeroSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares all requested entities in the database map', () => {
		const expectedEntities = [
			'contacts',
			'invoices',
			'bankTransactions',
			'accounts',
			'items',
			'payments',
			'purchaseOrders',
			'creditNotes',
			'quotes',
		];
		for (const key of expectedEntities) {
			expect((XeroSchema.entities as any)[key]).toBeDefined();
		}
	});

	it('validates contact schema successfully', () => {
		const validContact = {
			ContactID: '00000000-0000-0000-0000-000000000001',
			Name: 'Acme Corp',
			EmailAddress: 'billing@acme.com',
			IsCustomer: true,
			IsSupplier: false,
		};
		const result = XeroSchema.entities.contacts.safeParse(validContact);
		expect(result.success).toBe(true);
	});

	it('validates invoice schema successfully', () => {
		const validInvoice = {
			InvoiceID: '00000000-0000-0000-0000-000000000002',
			Type: 'ACCREC',
			InvoiceNumber: 'INV-001',
			Total: 150.5,
			Contact: {
				ContactID: '00000000-0000-0000-0000-000000000001',
				Name: 'Acme Corp',
			},
		};
		const result = XeroSchema.entities.invoices.safeParse(validInvoice);
		expect(result.success).toBe(true);
	});
});

describe('Xero All 39 Endpoints Schema & Execution Tests', () => {
	const plugin = xero({ key: 'test_token', tenantId: 'tenant-123' });

	it('registers all 39 endpoints', () => {
		expect(plugin.id).toBe('xero');
		expect(Object.keys(plugin.endpointSchemas!).length).toBe(39);
	});

	// 1. bankTransactionsCreate
	it('bankTransactionsCreate schema validates input & output', () => {
		const input = {
			Type: 'SPEND' as const,
			Contact: { Name: 'Stationery World' },
			BankAccount: { AccountID: 'acc-1' },
			LineItems: [{ Description: 'Paper', UnitAmount: 20 }],
		};
		expect(
			XeroEndpointInputSchemas.bankTransactionsCreate.safeParse(input).success,
		).toBe(true);
		const output = {
			BankTransactions: [
				{
					BankTransactionID: 'bt-1',
					Type: 'SPEND' as const,
					BankAccount: { AccountID: 'acc-1' },
				},
			],
		};
		expect(
			XeroEndpointOutputSchemas.bankTransactionsCreate.safeParse(output)
				.success,
		).toBe(true);
	});

	// 2. bankTransactionsList
	it('bankTransactionsList schema validates input & output', () => {
		const input = { page: 1, bankAccountID: 'acc-1' };
		expect(
			XeroEndpointInputSchemas.bankTransactionsList.safeParse(input).success,
		).toBe(true);
		const output = { BankTransactions: [] };
		expect(
			XeroEndpointOutputSchemas.bankTransactionsList.safeParse(output).success,
		).toBe(true);
	});

	// 3. contactsCreate
	it('contactsCreate schema validates input & output', () => {
		const input = { Name: 'Supplier Inc', IsSupplier: true };
		expect(
			XeroEndpointInputSchemas.contactsCreate.safeParse(input).success,
		).toBe(true);
		const output = { Contacts: [{ ContactID: 'c-1', Name: 'Supplier Inc' }] };
		expect(
			XeroEndpointOutputSchemas.contactsCreate.safeParse(output).success,
		).toBe(true);
	});

	// 4. contactsList
	it('contactsList schema validates input & output', () => {
		const input = { searchTerm: 'Supplier', summaryOnly: true };
		expect(XeroEndpointInputSchemas.contactsList.safeParse(input).success).toBe(
			true,
		);
		const output = { Contacts: [] };
		expect(
			XeroEndpointOutputSchemas.contactsList.safeParse(output).success,
		).toBe(true);
	});

	// 5. contactsUpdate
	it('contactsUpdate schema validates input & output', () => {
		const input = { contactId: 'c-1', Name: 'Supplier Updated Ltd' };
		expect(
			XeroEndpointInputSchemas.contactsUpdate.safeParse(input).success,
		).toBe(true);
		const output = {
			Contacts: [{ ContactID: 'c-1', Name: 'Supplier Updated Ltd' }],
		};
		expect(
			XeroEndpointOutputSchemas.contactsUpdate.safeParse(output).success,
		).toBe(true);
	});

	// 6. invoicesCreate
	it('invoicesCreate schema validates input & output', () => {
		const input = {
			Type: 'ACCREC' as const,
			Contact: { ContactID: 'c-1' },
			LineItems: [{ Description: 'Services', UnitAmount: 500 }],
		};
		expect(
			XeroEndpointInputSchemas.invoicesCreate.safeParse(input).success,
		).toBe(true);
		const output = { Invoices: [{ InvoiceID: 'inv-1', Type: 'ACCREC' }] };
		expect(
			XeroEndpointOutputSchemas.invoicesCreate.safeParse(output).success,
		).toBe(true);
	});

	// 7. invoicesGet
	it('invoicesGet schema validates input & output', () => {
		const input = { invoiceId: 'inv-1' };
		expect(XeroEndpointInputSchemas.invoicesGet.safeParse(input).success).toBe(
			true,
		);
		const output = { Invoices: [{ InvoiceID: 'inv-1', Type: 'ACCREC' }] };
		expect(
			XeroEndpointOutputSchemas.invoicesGet.safeParse(output).success,
		).toBe(true);
	});

	// 8. invoicesList
	it('invoicesList schema validates input & output', () => {
		const input = { page: 1, Statuses: ['AUTHORISED'] };
		expect(XeroEndpointInputSchemas.invoicesList.safeParse(input).success).toBe(
			true,
		);
		const output = { Invoices: [] };
		expect(
			XeroEndpointOutputSchemas.invoicesList.safeParse(output).success,
		).toBe(true);
	});

	// 9. invoicesUpdate
	it('invoicesUpdate schema validates input & output', () => {
		const input = { invoiceId: 'inv-1', Status: 'AUTHORISED' as const };
		expect(
			XeroEndpointInputSchemas.invoicesUpdate.safeParse(input).success,
		).toBe(true);
		const output = { Invoices: [{ InvoiceID: 'inv-1', Type: 'ACCREC' }] };
		expect(
			XeroEndpointOutputSchemas.invoicesUpdate.safeParse(output).success,
		).toBe(true);
	});

	// 10. itemsCreate
	it('itemsCreate schema validates input & output', () => {
		const input = { Code: 'ITEM-01', Name: 'Widget' };
		expect(XeroEndpointInputSchemas.itemsCreate.safeParse(input).success).toBe(
			true,
		);
		const output = { Items: [{ ItemID: 'it-1', Code: 'ITEM-01' }] };
		expect(
			XeroEndpointOutputSchemas.itemsCreate.safeParse(output).success,
		).toBe(true);
	});

	// 11. itemsGet
	it('itemsGet schema validates input & output', () => {
		const input = { itemId: 'it-1' };
		expect(XeroEndpointInputSchemas.itemsGet.safeParse(input).success).toBe(
			true,
		);
		const output = { Items: [{ ItemID: 'it-1', Code: 'ITEM-01' }] };
		expect(XeroEndpointOutputSchemas.itemsGet.safeParse(output).success).toBe(
			true,
		);
	});

	// 12. itemsList
	it('itemsList schema validates input & output', () => {
		const input = { page: 1 };
		expect(XeroEndpointInputSchemas.itemsList.safeParse(input).success).toBe(
			true,
		);
		const output = { Items: [] };
		expect(XeroEndpointOutputSchemas.itemsList.safeParse(output).success).toBe(
			true,
		);
	});

	// 13. paymentsCreate
	it('paymentsCreate schema validates input & output', () => {
		const input = {
			Invoice: { InvoiceID: 'inv-1' },
			Account: { AccountID: 'acc-1' },
			Amount: 100,
		};
		expect(
			XeroEndpointInputSchemas.paymentsCreate.safeParse(input).success,
		).toBe(true);
		const output = { Payments: [{ PaymentID: 'pay-1', Amount: 100 }] };
		expect(
			XeroEndpointOutputSchemas.paymentsCreate.safeParse(output).success,
		).toBe(true);
	});

	// 14. paymentsList
	it('paymentsList schema validates input & output', () => {
		const input = { page: 1 };
		expect(XeroEndpointInputSchemas.paymentsList.safeParse(input).success).toBe(
			true,
		);
		const output = { Payments: [] };
		expect(
			XeroEndpointOutputSchemas.paymentsList.safeParse(output).success,
		).toBe(true);
	});

	// 15. purchaseOrdersCreate
	it('purchaseOrdersCreate schema validates input & output', () => {
		const input = {
			Contact: { ContactID: 'c-1' },
			LineItems: [{ Description: 'Stock delivery', UnitAmount: 1200 }],
		};
		expect(
			XeroEndpointInputSchemas.purchaseOrdersCreate.safeParse(input).success,
		).toBe(true);
		const output = { PurchaseOrders: [{ PurchaseOrderID: 'po-1' }] };
		expect(
			XeroEndpointOutputSchemas.purchaseOrdersCreate.safeParse(output).success,
		).toBe(true);
	});

	// 16. purchaseOrdersGet
	it('purchaseOrdersGet schema validates input & output', () => {
		const input = { purchaseOrderId: 'po-1' };
		expect(
			XeroEndpointInputSchemas.purchaseOrdersGet.safeParse(input).success,
		).toBe(true);
		const output = { PurchaseOrders: [{ PurchaseOrderID: 'po-1' }] };
		expect(
			XeroEndpointOutputSchemas.purchaseOrdersGet.safeParse(output).success,
		).toBe(true);
	});

	// 17. purchaseOrdersList
	it('purchaseOrdersList schema validates input & output', () => {
		const input = { status: 'AUTHORISED' };
		expect(
			XeroEndpointInputSchemas.purchaseOrdersList.safeParse(input).success,
		).toBe(true);
		const output = { PurchaseOrders: [] };
		expect(
			XeroEndpointOutputSchemas.purchaseOrdersList.safeParse(output).success,
		).toBe(true);
	});

	// 18. accountsGet
	it('accountsGet schema validates input & output', () => {
		const input = { accountId: 'acc-1' };
		expect(XeroEndpointInputSchemas.accountsGet.safeParse(input).success).toBe(
			true,
		);
		const output = {
			Accounts: [{ AccountID: 'acc-1', Name: 'Sales', Type: 'REVENUE' }],
		};
		expect(
			XeroEndpointOutputSchemas.accountsGet.safeParse(output).success,
		).toBe(true);
	});

	// 19. accountsList
	it('accountsList schema validates input & output', () => {
		const input = { page: 1 };
		expect(XeroEndpointInputSchemas.accountsList.safeParse(input).success).toBe(
			true,
		);
		const output = { Accounts: [] };
		expect(
			XeroEndpointOutputSchemas.accountsList.safeParse(output).success,
		).toBe(true);
	});

	// 20. assetsGet
	it('assetsGet schema validates input & output', () => {
		const input = { assetId: 'ast-1' };
		expect(XeroEndpointInputSchemas.assetsGet.safeParse(input).success).toBe(
			true,
		);
		const output = { assetId: 'ast-1', assetName: 'MacBook Pro' };
		expect(XeroEndpointOutputSchemas.assetsGet.safeParse(output).success).toBe(
			true,
		);
	});

	// 21. assetsList
	it('assetsList schema validates input & output', () => {
		const input = { page: 1, pageSize: 10 };
		expect(XeroEndpointInputSchemas.assetsList.safeParse(input).success).toBe(
			true,
		);
		const output = { items: [{ assetId: 'ast-1' }] };
		expect(XeroEndpointOutputSchemas.assetsList.safeParse(output).success).toBe(
			true,
		);
	});

	// 22. reportsGetBalanceSheet
	it('reportsGetBalanceSheet schema validates input & output', () => {
		const input = { date: '2026-09-08' };
		expect(
			XeroEndpointInputSchemas.reportsGetBalanceSheet.safeParse(input).success,
		).toBe(true);
		const output = { Reports: [{ ReportID: 'BalanceSheet' }] };
		expect(
			XeroEndpointOutputSchemas.reportsGetBalanceSheet.safeParse(output)
				.success,
		).toBe(true);
	});

	// 23. reportsGetProfitLoss
	it('reportsGetProfitLoss schema validates input & output', () => {
		const input = { fromDate: '2026-01-01', toDate: '2026-09-08' };
		expect(
			XeroEndpointInputSchemas.reportsGetProfitLoss.safeParse(input).success,
		).toBe(true);
		const output = { Reports: [{ ReportID: 'ProfitAndLoss' }] };
		expect(
			XeroEndpointOutputSchemas.reportsGetProfitLoss.safeParse(output).success,
		).toBe(true);
	});

	// 24. budgetsGet
	it('budgetsGet schema validates input & output', () => {
		const input = { budgetId: 'b-1' };
		expect(XeroEndpointInputSchemas.budgetsGet.safeParse(input).success).toBe(
			true,
		);
		const output = { Budgets: [{ BudgetID: 'b-1' }] };
		expect(XeroEndpointOutputSchemas.budgetsGet.safeParse(output).success).toBe(
			true,
		);
	});

	// 25. connectionsGet
	it('connectionsGet schema validates input & output', () => {
		const input = {};
		expect(
			XeroEndpointInputSchemas.connectionsGet.safeParse(input).success,
		).toBe(true);
		const output = [
			{ id: 'conn-1', tenantId: 't-1', tenantType: 'ORGANISATION' },
		];
		expect(
			XeroEndpointOutputSchemas.connectionsGet.safeParse(output).success,
		).toBe(true);
	});

	// 26. manualJournalsGet
	it('manualJournalsGet schema validates input & output', () => {
		const input = { manualJournalId: 'mj-1' };
		expect(
			XeroEndpointInputSchemas.manualJournalsGet.safeParse(input).success,
		).toBe(true);
		const output = {
			ManualJournals: [
				{ ManualJournalID: 'mj-1', Narration: 'Adjust depreciation' },
			],
		};
		expect(
			XeroEndpointOutputSchemas.manualJournalsGet.safeParse(output).success,
		).toBe(true);
	});

	// 27. manualJournalsList
	it('manualJournalsList schema validates input & output', () => {
		const input = { page: 1 };
		expect(
			XeroEndpointInputSchemas.manualJournalsList.safeParse(input).success,
		).toBe(true);
		const output = { ManualJournals: [] };
		expect(
			XeroEndpointOutputSchemas.manualJournalsList.safeParse(output).success,
		).toBe(true);
	});

	// 28. organisationsGet
	it('organisationsGet schema validates input & output', () => {
		const input = {};
		expect(
			XeroEndpointInputSchemas.organisationsGet.safeParse(input).success,
		).toBe(true);
		const output = { Organisations: [{ Name: 'Xero Demo Company' }] };
		expect(
			XeroEndpointOutputSchemas.organisationsGet.safeParse(output).success,
		).toBe(true);
	});

	// 29. projectsGet
	it('projectsGet schema validates input & output', () => {
		const input = { projectId: 'p-1' };
		expect(XeroEndpointInputSchemas.projectsGet.safeParse(input).success).toBe(
			true,
		);
		const output = { projectId: 'p-1', name: 'Website Redesign' };
		expect(
			XeroEndpointOutputSchemas.projectsGet.safeParse(output).success,
		).toBe(true);
	});

	// 30. projectsList
	it('projectsList schema validates input & output', () => {
		const input = { states: 'INPROGRESS' };
		expect(XeroEndpointInputSchemas.projectsList.safeParse(input).success).toBe(
			true,
		);
		const output = { items: [{ projectId: 'p-1', name: 'Website Redesign' }] };
		expect(
			XeroEndpointOutputSchemas.projectsList.safeParse(output).success,
		).toBe(true);
	});

	// 31. quotesList
	it('quotesList schema validates input & output', () => {
		const input = { status: 'SENT' };
		expect(XeroEndpointInputSchemas.quotesList.safeParse(input).success).toBe(
			true,
		);
		const output = { Quotes: [{ QuoteID: 'q-1' }] };
		expect(XeroEndpointOutputSchemas.quotesList.safeParse(output).success).toBe(
			true,
		);
	});

	// 32. attachmentsList
	it('attachmentsList schema validates input & output', () => {
		const input = { endpoint: 'Invoices' as const, entityId: 'inv-1' };
		expect(
			XeroEndpointInputSchemas.attachmentsList.safeParse(input).success,
		).toBe(true);
		const output = {
			Attachments: [{ AttachmentID: 'att-1', FileName: 'receipt.pdf' }],
		};
		expect(
			XeroEndpointOutputSchemas.attachmentsList.safeParse(output).success,
		).toBe(true);
	});

	// 33. attachmentsUpload
	it('attachmentsUpload schema validates input & output', () => {
		const input = {
			endpoint: 'Invoices' as const,
			entityId: 'inv-1',
			fileName: 'receipt.pdf',
			fileContent: 'base64data...',
		};
		expect(
			XeroEndpointInputSchemas.attachmentsUpload.safeParse(input).success,
		).toBe(true);
		const output = {
			Attachments: [{ AttachmentID: 'att-1', FileName: 'receipt.pdf' }],
		};
		expect(
			XeroEndpointOutputSchemas.attachmentsUpload.safeParse(output).success,
		).toBe(true);
	});

	// 34. creditNotesList
	it('creditNotesList schema validates input & output', () => {
		const input = { page: 1 };
		expect(
			XeroEndpointInputSchemas.creditNotesList.safeParse(input).success,
		).toBe(true);
		const output = { CreditNotes: [{ CreditNoteID: 'cn-1' }] };
		expect(
			XeroEndpointOutputSchemas.creditNotesList.safeParse(output).success,
		).toBe(true);
	});

	// 35. filesList
	it('filesList schema validates input & output', () => {
		const input = { page: 1 };
		expect(XeroEndpointInputSchemas.filesList.safeParse(input).success).toBe(
			true,
		);
		const output = { Items: [{ Id: 'f-1', Name: 'doc.txt' }] };
		expect(XeroEndpointOutputSchemas.filesList.safeParse(output).success).toBe(
			true,
		);
	});

	// 36. filesListFolders
	it('filesListFolders schema validates input & output', () => {
		const input = {};
		expect(
			XeroEndpointInputSchemas.filesListFolders.safeParse(input).success,
		).toBe(true);
		const output = [{ Id: 'fol-1', Name: 'Tax 2026' }];
		expect(
			XeroEndpointOutputSchemas.filesListFolders.safeParse(output).success,
		).toBe(true);
	});

	// 37. journalsList
	it('journalsList schema validates input & output', () => {
		const input = { offset: 0, paymentsOnly: false };
		expect(XeroEndpointInputSchemas.journalsList.safeParse(input).success).toBe(
			true,
		);
		const output = {
			Journals: [
				{
					JournalID: 'j-1',
					JournalDate: '2026-09-08',
					JournalNumber: 1,
					CreatedDateUTC: '2026-09-08T00:00:00Z',
				},
			],
		};
		expect(
			XeroEndpointOutputSchemas.journalsList.safeParse(output).success,
		).toBe(true);
	});

	// 38. taxRatesList
	it('taxRatesList schema validates input & output', () => {
		const input = { page: 1 };
		expect(XeroEndpointInputSchemas.taxRatesList.safeParse(input).success).toBe(
			true,
		);
		const output = {
			TaxRates: [{ Name: 'GST on Income', TaxType: 'OUTPUT' }],
		};
		expect(
			XeroEndpointOutputSchemas.taxRatesList.safeParse(output).success,
		).toBe(true);
	});

	// 39. trackingCategoriesList
	it('trackingCategoriesList schema validates input & output', () => {
		const input = { includeArchived: false };
		expect(
			XeroEndpointInputSchemas.trackingCategoriesList.safeParse(input).success,
		).toBe(true);
		const output = {
			TrackingCategories: [{ TrackingCategoryID: 'tc-1', Name: 'Region' }],
		};
		expect(
			XeroEndpointOutputSchemas.trackingCategoriesList.safeParse(output)
				.success,
		).toBe(true);
	});
});

describe('Xero Webhooks & Matchers', () => {
	it('correctly matches Xero webhook events by category and eventType', () => {
		const invoiceMatcher = createXeroEventMatch('INVOICE', 'CREATE');
		const matchingRequest: any = {
			headers: { 'x-xero-signature': 'sig123' },
			body: JSON.stringify({
				events: [
					{
						resourceId: 'inv-1',
						eventCategory: 'INVOICE',
						eventType: 'CREATE',
						tenantId: 'tenant-1',
					},
				],
			}),
		};
		expect(invoiceMatcher(matchingRequest)).toBe(true);

		const nonMatchingRequest: any = {
			headers: { 'x-xero-signature': 'sig123' },
			body: JSON.stringify({
				events: [
					{
						resourceId: 'cont-1',
						eventCategory: 'CONTACT',
						eventType: 'UPDATE',
						tenantId: 'tenant-1',
					},
				],
			}),
		};
		expect(invoiceMatcher(nonMatchingRequest)).toBe(false);
	});

	it('rejects signature verification when secret or signature is missing', () => {
		const req: any = {
			headers: {},
			rawBody: '{"events":[]}',
		};
		expect(verifyXeroWebhookSignature(req, 'my-secret').valid).toBe(false);
		expect(verifyXeroWebhookSignature(req, '').valid).toBe(false);
	});
});

describe('Xero Endpoint Behavioral Execution Tests (All 39 Endpoints)', () => {
	let ctx: any;

	beforeEach(() => {
		jest.clearAllMocks();
		ctx = createMockContext('test-key', 'tenant-xyz');
	});

	// 1. BankTransactions.create
	it('executes BankTransactions.create and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			BankTransactions: [
				{
					BankTransactionID: 'bt-1',
					Type: 'SPEND',
					BankAccount: { AccountID: 'acc-1' },
				},
			],
		});
		const res = await BankTransactions.create(ctx, {
			Type: 'SPEND',
			Contact: { Name: 'Stationery World' },
			BankAccount: { AccountID: 'acc-1' },
			LineItems: [{ Description: 'Paper', UnitAmount: 20 }],
		});
		expect(res.BankTransactions?.[0]?.BankTransactionID).toBe('bt-1');
		expect(ctx.db.bankTransactions.upsertByEntityId).toHaveBeenCalledWith(
			'bt-1',
			expect.objectContaining({ BankTransactionID: 'bt-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.bankTransactions.create',
			expect.any(Object),
			'completed',
		);
	});

	// 2. BankTransactions.list
	it('executes BankTransactions.list and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			BankTransactions: [
				{
					BankTransactionID: 'bt-1',
					Type: 'SPEND',
					BankAccount: { AccountID: 'acc-1' },
				},
			],
		});
		const res = await BankTransactions.list(ctx, { page: 1 });
		expect(res.BankTransactions).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.bankTransactions.list',
			expect.any(Object),
			'completed',
		);
	});

	// 3. Contacts.create
	it('executes Contacts.create and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Contacts: [{ ContactID: 'c-1', Name: 'Supplier Inc' }],
		});
		const res = await Contacts.create(ctx, {
			Name: 'Supplier Inc',
			IsSupplier: true,
		});
		expect(res.Contacts?.[0]?.ContactID).toBe('c-1');
		expect(ctx.db.contacts.upsertByEntityId).toHaveBeenCalledWith(
			'c-1',
			expect.objectContaining({ ContactID: 'c-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.contacts.create',
			expect.any(Object),
			'completed',
		);
	});

	// 4. Contacts.list
	it('executes Contacts.list and upserts contacts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Contacts: [{ ContactID: 'c-1', Name: 'Supplier Inc' }],
		});
		const res = await Contacts.list(ctx, { searchTerm: 'Supplier' });
		expect(res.Contacts).toHaveLength(1);
		expect(ctx.db.contacts.upsertByEntityId).toHaveBeenCalledWith(
			'c-1',
			expect.objectContaining({ ContactID: 'c-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.contacts.list',
			expect.any(Object),
			'completed',
		);
	});

	// 5. Contacts.update
	it('executes Contacts.update and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Contacts: [{ ContactID: 'c-1', Name: 'Supplier Updated Ltd' }],
		});
		const res = await Contacts.update(ctx, {
			contactId: 'c-1',
			Name: 'Supplier Updated Ltd',
		});
		expect(res.Contacts?.[0]?.Name).toBe('Supplier Updated Ltd');
		expect(ctx.db.contacts.upsertByEntityId).toHaveBeenCalledWith(
			'c-1',
			expect.objectContaining({ ContactID: 'c-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.contacts.update',
			expect.any(Object),
			'completed',
		);
	});

	// 6. Invoices.create
	it('executes Invoices.create and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Invoices: [{ InvoiceID: 'inv-1', Type: 'ACCREC' }],
		});
		const res = await Invoices.create(ctx, {
			Type: 'ACCREC',
			Contact: { ContactID: 'c-1' },
			LineItems: [{ Description: 'Services', UnitAmount: 500 }],
		});
		expect(res.Invoices?.[0]?.InvoiceID).toBe('inv-1');
		expect(ctx.db.invoices.upsertByEntityId).toHaveBeenCalledWith(
			'inv-1',
			expect.objectContaining({ InvoiceID: 'inv-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.invoices.create',
			expect.any(Object),
			'completed',
		);
	});

	// 7. Invoices.get
	it('executes Invoices.get and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Invoices: [{ InvoiceID: 'inv-1', Type: 'ACCREC' }],
		});
		const res = await Invoices.get(ctx, { invoiceId: 'inv-1' });
		expect(res.Invoices?.[0]?.InvoiceID).toBe('inv-1');
		expect(ctx.db.invoices.upsertByEntityId).toHaveBeenCalledWith(
			'inv-1',
			expect.objectContaining({ InvoiceID: 'inv-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.invoices.get',
			expect.any(Object),
			'completed',
		);
	});

	// 8. Invoices.list
	it('executes Invoices.list and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Invoices: [{ InvoiceID: 'inv-1', Type: 'ACCREC' }],
		});
		const res = await Invoices.list(ctx, { page: 1 });
		expect(res.Invoices).toHaveLength(1);
		expect(ctx.db.invoices.upsertByEntityId).toHaveBeenCalledWith(
			'inv-1',
			expect.objectContaining({ InvoiceID: 'inv-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.invoices.list',
			expect.any(Object),
			'completed',
		);
	});

	// 9. Invoices.update
	it('executes Invoices.update and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Invoices: [{ InvoiceID: 'inv-1', Type: 'ACCREC' }],
		});
		const res = await Invoices.update(ctx, {
			invoiceId: 'inv-1',
			Status: 'AUTHORISED',
		});
		expect(res.Invoices?.[0]?.InvoiceID).toBe('inv-1');
		expect(ctx.db.invoices.upsertByEntityId).toHaveBeenCalledWith(
			'inv-1',
			expect.objectContaining({ InvoiceID: 'inv-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.invoices.update',
			expect.any(Object),
			'completed',
		);
	});

	// 10. Items.create
	it('executes Items.create and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Items: [{ ItemID: 'it-1', Code: 'ITEM-01' }],
		});
		const res = await Items.create(ctx, { Code: 'ITEM-01', Name: 'Widget' });
		expect(res.Items?.[0]?.ItemID).toBe('it-1');
		expect(ctx.db.items.upsertByEntityId).toHaveBeenCalledWith(
			'it-1',
			expect.objectContaining({ ItemID: 'it-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.items.create',
			expect.any(Object),
			'completed',
		);
	});

	// 11. Items.get
	it('executes Items.get and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Items: [{ ItemID: 'it-1', Code: 'ITEM-01' }],
		});
		const res = await Items.get(ctx, { itemId: 'it-1' });
		expect(res.Items?.[0]?.ItemID).toBe('it-1');
		expect(ctx.db.items.upsertByEntityId).toHaveBeenCalledWith(
			'it-1',
			expect.objectContaining({ ItemID: 'it-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.items.get',
			expect.any(Object),
			'completed',
		);
	});

	// 12. Items.list
	it('executes Items.list and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Items: [{ ItemID: 'it-1', Code: 'ITEM-01' }],
		});
		const res = await Items.list(ctx, { page: 1 });
		expect(res.Items).toHaveLength(1);
		expect(ctx.db.items.upsertByEntityId).toHaveBeenCalledWith(
			'it-1',
			expect.objectContaining({ ItemID: 'it-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.items.list',
			expect.any(Object),
			'completed',
		);
	});

	// 13. Payments.create
	it('executes Payments.create and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Payments: [{ PaymentID: 'pay-1', Amount: 100 }],
		});
		const res = await Payments.create(ctx, {
			Invoice: { InvoiceID: 'inv-1' },
			Account: { AccountID: 'acc-1' },
			Amount: 100,
		});
		expect(res.Payments?.[0]?.PaymentID).toBe('pay-1');
		expect(ctx.db.payments.upsertByEntityId).toHaveBeenCalledWith(
			'pay-1',
			expect.objectContaining({ PaymentID: 'pay-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.payments.create',
			expect.any(Object),
			'completed',
		);
	});

	// 14. Payments.list
	it('executes Payments.list and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Payments: [{ PaymentID: 'pay-1', Amount: 100 }],
		});
		const res = await Payments.list(ctx, { page: 1 });
		expect(res.Payments).toHaveLength(1);
		expect(ctx.db.payments.upsertByEntityId).toHaveBeenCalledWith(
			'pay-1',
			expect.objectContaining({ PaymentID: 'pay-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.payments.list',
			expect.any(Object),
			'completed',
		);
	});

	// 15. PurchaseOrders.create
	it('executes PurchaseOrders.create and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			PurchaseOrders: [{ PurchaseOrderID: 'po-1' }],
		});
		const res = await PurchaseOrders.create(ctx, {
			Contact: { ContactID: 'c-1' },
			LineItems: [{ Description: 'Stock delivery', UnitAmount: 1200 }],
		});
		expect(res.PurchaseOrders?.[0]?.PurchaseOrderID).toBe('po-1');
		expect(ctx.db.purchaseOrders.upsertByEntityId).toHaveBeenCalledWith(
			'po-1',
			expect.objectContaining({ PurchaseOrderID: 'po-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.purchaseOrders.create',
			expect.any(Object),
			'completed',
		);
	});

	// 16. PurchaseOrders.get
	it('executes PurchaseOrders.get and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			PurchaseOrders: [{ PurchaseOrderID: 'po-1' }],
		});
		const res = await PurchaseOrders.get(ctx, { purchaseOrderId: 'po-1' });
		expect(res.PurchaseOrders?.[0]?.PurchaseOrderID).toBe('po-1');
		expect(ctx.db.purchaseOrders.upsertByEntityId).toHaveBeenCalledWith(
			'po-1',
			expect.objectContaining({ PurchaseOrderID: 'po-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.purchaseOrders.get',
			expect.any(Object),
			'completed',
		);
	});

	// 17. PurchaseOrders.list
	it('executes PurchaseOrders.list and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			PurchaseOrders: [{ PurchaseOrderID: 'po-1' }],
		});
		const res = await PurchaseOrders.list(ctx, { status: 'AUTHORISED' });
		expect(res.PurchaseOrders).toHaveLength(1);
		expect(ctx.db.purchaseOrders.upsertByEntityId).toHaveBeenCalledWith(
			'po-1',
			expect.objectContaining({ PurchaseOrderID: 'po-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.purchaseOrders.list',
			expect.any(Object),
			'completed',
		);
	});

	// 18. Accounts.get
	it('executes Accounts.get and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Accounts: [{ AccountID: 'acc-1', Name: 'Sales', Type: 'REVENUE' }],
		});
		const res = await Accounts.get(ctx, { accountId: 'acc-1' });
		expect(res.Accounts?.[0]?.AccountID).toBe('acc-1');
		expect(ctx.db.accounts.upsertByEntityId).toHaveBeenCalledWith(
			'acc-1',
			expect.objectContaining({ AccountID: 'acc-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.accounts.get',
			expect.any(Object),
			'completed',
		);
	});

	// 19. Accounts.list
	it('executes Accounts.list and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Accounts: [{ AccountID: 'acc-1', Name: 'Sales', Type: 'REVENUE' }],
		});
		const res = await Accounts.list(ctx, { page: 1 });
		expect(res.Accounts).toHaveLength(1);
		expect(ctx.db.accounts.upsertByEntityId).toHaveBeenCalledWith(
			'acc-1',
			expect.objectContaining({ AccountID: 'acc-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.accounts.list',
			expect.any(Object),
			'completed',
		);
	});

	// 20. Assets.get
	it('executes Assets.get and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			assetId: 'ast-1',
			assetName: 'MacBook Pro',
		});
		const res = await Assets.get(ctx, { assetId: 'ast-1' });
		expect(res.assetId).toBe('ast-1');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.assets.get',
			expect.any(Object),
			'completed',
		);
	});

	// 21. Assets.list
	it('executes Assets.list and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			items: [{ assetId: 'ast-1' }],
		});
		const res = await Assets.list(ctx, { page: 1 });
		expect(res.items).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.assets.list',
			expect.any(Object),
			'completed',
		);
	});

	// 22. Reports.getBalanceSheet
	it('executes Reports.getBalanceSheet and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Reports: [{ ReportID: 'BalanceSheet' }],
		});
		const res = await Reports.getBalanceSheet(ctx, { date: '2026-09-08' });
		expect(res.Reports?.[0]?.ReportID).toBe('BalanceSheet');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.reports.getBalanceSheet',
			expect.any(Object),
			'completed',
		);
	});

	// 23. Reports.getProfitLoss
	it('executes Reports.getProfitLoss and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Reports: [{ ReportID: 'ProfitAndLoss' }],
		});
		const res = await Reports.getProfitLoss(ctx, {
			fromDate: '2026-01-01',
			toDate: '2026-09-08',
		});
		expect(res.Reports?.[0]?.ReportID).toBe('ProfitAndLoss');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.reports.getProfitLoss',
			expect.any(Object),
			'completed',
		);
	});

	// 24. Budgets.get
	it('executes Budgets.get and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Budgets: [{ BudgetID: 'b-1' }],
		});
		const res = await Budgets.get(ctx, { budgetId: 'b-1' });
		expect(res.Budgets?.[0]?.BudgetID).toBe('b-1');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.budgets.get',
			expect.any(Object),
			'completed',
		);
	});

	// 25. Connections.get
	it('executes Connections.get with raw URL and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce([
			{ id: 'conn-1', tenantId: 't-1', tenantType: 'ORGANISATION' },
		]);
		const res = await Connections.get(ctx, {});
		expect(res).toHaveLength(1);
		expect(mockMakeXeroRequest).toHaveBeenCalledWith(
			'https://api.xero.com/connections',
			ctx.key,
			expect.objectContaining({ isRawUrl: true }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.connections.get',
			expect.any(Object),
			'completed',
		);
	});

	// 26. ManualJournals.get
	it('executes ManualJournals.get and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			ManualJournals: [{ ManualJournalID: 'mj-1', Narration: 'Adjust' }],
		});
		const res = await ManualJournals.get(ctx, { manualJournalId: 'mj-1' });
		expect(res.ManualJournals?.[0]?.ManualJournalID).toBe('mj-1');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.manualJournals.get',
			expect.any(Object),
			'completed',
		);
	});

	// 27. ManualJournals.list
	it('executes ManualJournals.list and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			ManualJournals: [{ ManualJournalID: 'mj-1' }],
		});
		const res = await ManualJournals.list(ctx, { page: 1 });
		expect(res.ManualJournals).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.manualJournals.list',
			expect.any(Object),
			'completed',
		);
	});

	// 28. Organisations.get
	it('executes Organisations.get and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Organisations: [{ Name: 'Xero Demo Company' }],
		});
		const res = await Organisations.get(ctx, {});
		expect(res.Organisations?.[0]?.Name).toBe('Xero Demo Company');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.organisations.get',
			expect.any(Object),
			'completed',
		);
	});

	// 29. Projects.get
	it('executes Projects.get with raw projects URL and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			projectId: 'p-1',
			name: 'Website',
		});
		const res = await Projects.get(ctx, { projectId: 'p-1' });
		expect(res.projectId).toBe('p-1');
		expect(mockMakeXeroRequest).toHaveBeenCalledWith(
			'https://api.xero.com/projects.xro/2.0/Projects/p-1',
			ctx.key,
			expect.objectContaining({ isRawUrl: true }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.projects.get',
			expect.any(Object),
			'completed',
		);
	});

	// 30. Projects.list
	it('executes Projects.list with raw projects URL and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			items: [{ projectId: 'p-1', name: 'Website' }],
		});
		const res = await Projects.list(ctx, { states: 'INPROGRESS' });
		expect(res.items).toHaveLength(1);
		expect(mockMakeXeroRequest).toHaveBeenCalledWith(
			'https://api.xero.com/projects.xro/2.0/Projects',
			ctx.key,
			expect.objectContaining({ isRawUrl: true }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.projects.list',
			expect.any(Object),
			'completed',
		);
	});

	// 31. Quotes.list
	it('executes Quotes.list and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Quotes: [{ QuoteID: 'q-1' }],
		});
		const res = await Quotes.list(ctx, { status: 'SENT' });
		expect(res.Quotes).toHaveLength(1);
		expect(ctx.db.quotes.upsertByEntityId).toHaveBeenCalledWith(
			'q-1',
			expect.objectContaining({ QuoteID: 'q-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.quotes.list',
			expect.any(Object),
			'completed',
		);
	});

	// 32. Attachments.list
	it('executes Attachments.list and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Attachments: [{ AttachmentID: 'att-1', FileName: 'invoice.pdf' }],
		});
		const res = await Attachments.list(ctx, {
			endpoint: 'Invoices',
			entityId: 'inv-1',
		});
		expect(res.Attachments).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.attachments.list',
			expect.any(Object),
			'completed',
		);
	});

	// 33. Attachments.upload
	it('executes Attachments.upload redacting fileContent from event log and wrapping raw body in Blob', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Attachments: [{ AttachmentID: 'att-1', FileName: 'data.json' }],
		});
		const res = await Attachments.upload(ctx, {
			endpoint: 'Invoices',
			entityId: 'inv-1',
			fileName: 'data.json',
			mimeType: 'application/json',
			fileContent: '{"key":"value"}',
		});
		expect(res.Attachments).toHaveLength(1);

		// Verify Blob payload passed to makeXeroRequest
		expect(mockMakeXeroRequest).toHaveBeenCalledWith(
			'Invoices/inv-1/Attachments/data.json',
			ctx.key,
			expect.objectContaining({
				method: 'POST',
				mediaType: 'application/json',
				body: expect.any(Blob),
			}),
		);

		// Verify fileContent is NOT in logged event
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.attachments.upload',
			{
				endpoint: 'Invoices',
				entityId: 'inv-1',
				fileName: 'data.json',
				mimeType: 'application/json',
				contentLength: '{"key":"value"}'.length,
			},
			'completed',
		);
		const loggedPayload = mockLogEvent.mock.calls[0]?.[2] as any;
		expect(loggedPayload.fileContent).toBeUndefined();
	});

	// 34. CreditNotes.list
	it('executes CreditNotes.list and upserts into database', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			CreditNotes: [{ CreditNoteID: 'cn-1' }],
		});
		const res = await CreditNotes.list(ctx, { page: 1 });
		expect(res.CreditNotes).toHaveLength(1);
		expect(ctx.db.creditNotes.upsertByEntityId).toHaveBeenCalledWith(
			'cn-1',
			expect.objectContaining({ CreditNoteID: 'cn-1' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.creditNotes.list',
			expect.any(Object),
			'completed',
		);
	});

	// 35. Files.list
	it('executes Files.list with raw files URL and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Items: [{ Id: 'f-1', Name: 'doc.pdf' }],
		});
		const res = await Files.list(ctx, { page: 1 });
		expect(res.Items).toHaveLength(1);
		expect(mockMakeXeroRequest).toHaveBeenCalledWith(
			'https://api.xero.com/files.xro/1.0/Files',
			ctx.key,
			expect.objectContaining({ isRawUrl: true }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.files.list',
			expect.any(Object),
			'completed',
		);
	});

	// 36. Files.listFolders
	it('executes Files.listFolders with raw files URL and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce([
			{ Id: 'fol-1', Name: 'Receipts' },
		]);
		const res = await Files.listFolders(ctx, {});
		expect(res).toHaveLength(1);
		expect(mockMakeXeroRequest).toHaveBeenCalledWith(
			'https://api.xero.com/files.xro/1.0/Folders',
			ctx.key,
			expect.objectContaining({ isRawUrl: true }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.files.listFolders',
			expect.any(Object),
			'completed',
		);
	});

	// 37. Journals.list
	it('executes Journals.list and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			Journals: [
				{
					JournalID: 'j-1',
					JournalDate: '2026-09-08',
					JournalNumber: 1,
					CreatedDateUTC: '2026-09-08T00:00:00Z',
				},
			],
		});
		const res = await Journals.list(ctx, { offset: 0 });
		expect(res.Journals).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.journals.list',
			expect.any(Object),
			'completed',
		);
	});

	// 38. TaxRates.list
	it('executes TaxRates.list and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			TaxRates: [{ Name: 'GST', TaxType: 'OUTPUT' }],
		});
		const res = await TaxRates.list(ctx, { page: 1 });
		expect(res.TaxRates).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.taxRates.list',
			expect.any(Object),
			'completed',
		);
	});

	// 39. TrackingCategories.list
	it('executes TrackingCategories.list and logs completion', async () => {
		mockMakeXeroRequest.mockResolvedValueOnce({
			TrackingCategories: [{ TrackingCategoryID: 'tc-1', Name: 'Region' }],
		});
		const res = await TrackingCategories.list(ctx, { includeArchived: false });
		expect(res.TrackingCategories).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'xero.trackingCategories.list',
			expect.any(Object),
			'completed',
		);
	});
});

describe('Xero Error Handlers & Rate Limiting Metadata Preservation', () => {
	it('RATE_LIMIT_ERROR matches 429 status on ApiError and extracts retryAfter', async () => {
		const apiErr = new ApiError(
			{ method: 'GET', url: '/Invoices' },
			{
				url: 'https://api.xero.com/api.xro/2.0/Invoices',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { Message: 'Rate limit exceeded' },
			},
			'Too Many Requests',
			{ retryAfter: 3500 },
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiErr)).toBe(true);
		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(apiErr);
		expect(res.maxRetries).toBe(5);
		expect(res.headersRetryAfterMs).toBe(3500);
	});

	it('RATE_LIMIT_ERROR matches 429 status and preserves retryAfter on XeroAPIError', async () => {
		const xeroErr = new XeroAPIError('Too Many Requests', 429, {
			status: 429,
			retryAfter: 4500,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(xeroErr)).toBe(true);
		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(xeroErr);
		expect(res.maxRetries).toBe(5);
		expect(res.headersRetryAfterMs).toBe(4500);
	});

	it('RATE_LIMIT_ERROR matches rate limit messages', async () => {
		const msgErr = new Error('rate_limited error occurred');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(msgErr)).toBe(true);
	});

	it('AUTH_ERROR matches 401 status on ApiError and XeroAPIError', () => {
		const apiErr = new ApiError(
			{ method: 'GET', url: '/Invoices' },
			{
				url: 'https://api.xero.com/api.xro/2.0/Invoices',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: {},
			},
			'Unauthorized',
		);
		expect(errorHandlers.AUTH_ERROR.match(apiErr)).toBe(true);

		const xeroErr = new XeroAPIError('Token expired', 401, { status: 401 });
		expect(errorHandlers.AUTH_ERROR.match(xeroErr)).toBe(true);
	});
});
