import {
	XeroEndpointInputSchemas,
	XeroEndpointOutputSchemas,
} from './endpoints/types';
import { xero } from './index';
import { XeroSchema } from './schema';
import {
	createXeroEventMatch,
	verifyXeroWebhookSignature,
} from './webhooks/types';

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
