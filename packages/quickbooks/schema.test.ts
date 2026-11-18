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
		];
		expect(Object.keys(quickbooksEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(QuickBooksEndpointInputSchemas)).toHaveLength(5);
		expect(Object.keys(QuickBooksEndpointOutputSchemas)).toHaveLength(5);
		const plugin = quickbooks();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(operations);
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

	it('keeps the persistence schema empty and versioned', () => {
		expect(QuickBooksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(QuickBooksSchema.entities).toEqual({});
	});
});
