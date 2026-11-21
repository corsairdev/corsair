import { QuickBooksCatalogEndpointSchemas } from './endpoints/catalog';
import { QuickBooksModelSchemas } from './endpoints/models';
import { QuickBooksSpecialEndpointSchemas } from './endpoints/special';
import {
	QuickBooksEndpointInputSchemas,
	QuickBooksEndpointOutputSchemas,
} from './endpoints/types';
import { quickbooks, quickbooksEndpointSchemas } from './index';
import { QuickBooksSchema } from './schema';

const account = {
	Id: '35',
	SyncToken: '0',
	Name: 'Operating Checking',
	AccountType: 'Bank',
	domain: 'QBO',
	sparse: false,
};

describe('QuickBooks endpoint schemas', () => {
	it('keeps endpoint inputs, outputs, metadata, and typed exports in sync', () => {
		const operations = [
			'accounts.create',
			'accounts.get',
			'accounts.list',
			'company.get',
			'company.list',
			...Object.keys(QuickBooksCatalogEndpointSchemas),
			...Object.keys(QuickBooksSpecialEndpointSchemas),
		].sort();
		expect(Object.keys(quickbooksEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(QuickBooksCatalogEndpointSchemas)).toHaveLength(229);
		expect(Object.keys(QuickBooksEndpointInputSchemas)).toHaveLength(5);
		expect(Object.keys(QuickBooksEndpointOutputSchemas)).toHaveLength(5);
		const plugin = quickbooks();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(operations);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operations,
		);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('oauth_2');
	});

	it('validates Account create requirements and rejects undocumented fields', () => {
		const schema = QuickBooksEndpointInputSchemas.accountsCreate;
		expect(
			schema.safeParse({
				realmId: '12345678',
				name: 'Checking',
				accountType: 'Bank',
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				realmId: 'company-id',
				name: 'Checking',
				accountType: 'Bank',
			}).success,
		).toBe(false);
		expect(schema.safeParse({ realmId: '123', name: 'No type' }).success).toBe(
			false,
		);
		expect(
			schema.safeParse({
				realmId: '123',
				name: 'Bad: name',
				accountType: 'Bank',
			}).success,
		).toBe(false);
		expect(
			schema.safeParse({
				realmId: '123',
				name: 'Checking',
				accountType: 'Non-Posting',
			}).success,
		).toBe(false);
		expect(
			schema.safeParse({
				realmId: '123',
				name: 'Checking',
				accountType: 'Bank',
				acctNum: '100:1',
			}).success,
		).toBe(false);
		expect(
			schema.safeParse({
				realmId: '123',
				name: 'Checking',
				accountType: 'Bank',
				undocumented: true,
			}).success,
		).toBe(false);
	});

	it('validates pagination bounds and the Account query envelope', () => {
		const inputSchema = QuickBooksEndpointInputSchemas.accountsList;
		expect(
			inputSchema.safeParse({
				realmId: '123',
				startPosition: 1,
				maxResults: 1000,
			}).success,
		).toBe(true);
		expect(
			inputSchema.safeParse({ realmId: '123', maxResults: 1001 }).success,
		).toBe(false);
		const outputSchema = QuickBooksEndpointOutputSchemas.accountsList;
		expect(
			outputSchema.safeParse({
				QueryResponse: { startPosition: 1, maxResults: 1, Account: [account] },
				time: '2026-11-18T12:00:00Z',
			}).success,
		).toBe(true);
		expect(
			outputSchema.safeParse({
				QueryResponse: { Account: [{ ...account, unexpected: true }] },
				time: '2026-11-18T12:00:00Z',
			}).success,
		).toBe(false);
	});

	it('validates Account and CompanyInfo response envelopes strictly', () => {
		expect(
			QuickBooksEndpointOutputSchemas.accountsGet.safeParse({
				Account: account,
				time: '2026-11-18T12:00:00Z',
			}).success,
		).toBe(true);
		expect(
			QuickBooksEndpointOutputSchemas.accountsCreate.safeParse({
				Account: { ...account, unverified: 'field' },
				time: '2026-11-18T12:00:00Z',
			}).success,
		).toBe(false);
		expect(
			QuickBooksEndpointOutputSchemas.companyGet.safeParse({
				CompanyInfo: {
					Id: '123',
					CompanyName: 'Demo Company',
					DefaultTimeZone: 'America/Los_Angeles',
				},
				time: '2026-11-18T12:00:00Z',
			}).success,
		).toBe(true);
		expect(
			QuickBooksEndpointOutputSchemas.companyGet.safeParse({
				CompanyInfo: { Id: '123', unverified: true },
				time: '2026-11-18T12:00:00Z',
			}).success,
		).toBe(false);
		expect(
			QuickBooksEndpointOutputSchemas.companyList.safeParse({
				QueryResponse: {
					CompanyInfo: [{ Id: '123', CompanyName: 'Demo Company' }],
				},
				time: '2026-11-18T12:00:00Z',
			}).success,
		).toBe(true);
	});

	it('accepts both documented expense-line variants in Bill and Purchase responses', () => {
		const accountBasedLine = {
			Id: '2',
			Amount: 125,
			DetailType: 'AccountBasedExpenseLineDetail',
			AccountBasedExpenseLineDetail: {
				AccountRef: { value: 'expense-account' },
			},
		};
		const itemBasedLine = {
			Id: '1',
			Amount: 50,
			DetailType: 'ItemBasedExpenseLineDetail',
			ItemBasedExpenseLineDetail: { ItemRef: { value: 'item' } },
		};
		const billFields = {
			VendorRef: { value: 'vendor' },
			Line: [accountBasedLine, itemBasedLine],
			Id: 'bill-1',
		};
		const purchaseFields = {
			PaymentType: 'Check',
			AccountRef: { value: 'bank' },
			Line: [accountBasedLine, itemBasedLine],
			Id: 'purchase-1',
		};

		expect(
			QuickBooksModelSchemas.billresponse.safeParse(billFields).success,
		).toBe(true);
		expect(
			QuickBooksModelSchemas.purchaseresponse.safeParse(purchaseFields).success,
		).toBe(true);
		expect(
			QuickBooksModelSchemas.billresponse.safeParse({
				...billFields,
				Line: [
					{
						...accountBasedLine,
						DetailType: 'ItemBasedExpenseLineDetail',
					},
				],
			}).success,
		).toBe(false);
	});

	it('validates linked-transaction and DepositLineDetail response lines strictly', () => {
		const depositDetailLine = {
			Id: 'line-2',
			Amount: 75,
			DetailType: 'DepositLineDetail',
			Description: 'Other deposit income',
			CustomField: {
				DefinitionId: '1',
				Name: 'Reference',
				Type: 'StringType',
				StringValue: 'A-7',
			},
			DepositLineDetail: {
				AccountRef: { value: 'income-account' },
				CheckNum: 'A-7',
				Entity: { value: 'customer-1' },
			},
		};
		const response = {
			DepositToAccountRef: { value: 'bank' },
			Line: [
				{
					Amount: 50,
					LinkedTxn: [{ TxnId: 'payment-1', TxnType: 'Payment' }],
				},
				depositDetailLine,
			],
			Id: 'deposit-1',
		};

		expect(
			QuickBooksModelSchemas.depositresponse.safeParse(response).success,
		).toBe(true);
		expect(
			QuickBooksModelSchemas.depositresponse.safeParse({
				...response,
				Line: [
					{
						...depositDetailLine,
						DepositLineDetail: {
							...depositDetailLine.DepositLineDetail,
							undocumented: true,
						},
					},
				],
			}).success,
		).toBe(false);
	});

	it('accepts only documented invoice-linked payment lines', () => {
		const schema = QuickBooksModelSchemas.paymentrequest;
		const payment = {
			TotalAmt: 125,
			CustomerRef: { value: 'customer-1' },
			Line: [
				{
					Amount: 125,
					LinkedTxn: [{ TxnId: 'invoice-1', TxnType: 'Invoice' }],
				},
			],
		};

		expect(schema.safeParse(payment).success).toBe(true);
		expect(
			schema.safeParse({
				...payment,
				Line: [{ ...payment.Line[0], UndocumentedLineField: 'rejected' }],
			}).success,
		).toBe(false);
	});

	it('keeps the persistence schema empty and versioned', () => {
		expect(QuickBooksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(QuickBooksSchema.entities).toEqual({});
	});

	it('strictly models the Batch item operation variants and 30-item cap', () => {
		const inputSchema = QuickBooksSpecialEndpointSchemas['batch.execute'].input;
		const realmId = '12345678';
		const cases = [
			{ bId: 'query-1', Query: 'SELECT * FROM Account' },
			{
				bId: 'create-1',
				operation: 'create',
				Customer: { DisplayName: 'Sample Customer' },
			},
			{
				bId: 'update-1',
				operation: 'update',
				Customer: { Id: '35', SyncToken: '0', DisplayName: 'Sample Customer' },
			},
			{
				bId: 'delete-1',
				operation: 'delete',
				Bill: { Id: '35', SyncToken: '0' },
			},
			{
				bId: 'void-1',
				operation: 'update',
				optionsData: 'void',
				Invoice: { Id: '35', SyncToken: '0', sparse: true },
			},
		];
		for (const item of cases) {
			expect(inputSchema.safeParse({ realmId, items: [item] }).success).toBe(
				true,
			);
		}
		expect(
			inputSchema.safeParse({
				realmId,
				items: [{ bId: 'bad-1', Query: 'SELECT * FROM Account', extra: true }],
			}).success,
		).toBe(false);
		expect(
			inputSchema.safeParse({
				realmId,
				items: Array.from({ length: 31 }, (_, index) => ({
					bId: String(index),
					Query: 'SELECT * FROM Account',
				})),
			}).success,
		).toBe(false);
	});
});
