/**
 * Guards persisted entity schemas against dropping an official field or
 * requiring a field Salesforce omits.
 *
 * Key lists are the standard fields from the official object reference
 * (Summer '26 / API 67.0), excluding license-gated and person-account-only
 * fields that a typical org never returns.
 */

import { SalesforceSchema } from './schema';
import {
	SalesforceAccountEntity,
	SalesforceCampaignEntity,
	SalesforceContactEntity,
	SalesforceLeadEntity,
	SalesforceOpportunityEntity,
	SalesforceTaskEntity,
} from './schema/database';

const OFFICIAL_ACCOUNT_KEYS = [
	'Id',
	'AccountNumber',
	'AccountSource',
	'AnnualRevenue',
	'BillingCity',
	'BillingCountry',
	'BillingPostalCode',
	'BillingState',
	'BillingStreet',
	'CreatedById',
	'CreatedDate',
	'Description',
	'Fax',
	'Industry',
	'IsDeleted',
	'LastModifiedById',
	'LastModifiedDate',
	'Name',
	'NumberOfEmployees',
	'OwnerId',
	'ParentId',
	'Phone',
	'Rating',
	'ShippingCity',
	'ShippingCountry',
	'ShippingPostalCode',
	'ShippingState',
	'ShippingStreet',
	'Sic',
	'Site',
	'SystemModstamp',
	'Type',
	'Website',
] as const;

const OFFICIAL_CONTACT_KEYS = [
	'Id',
	'AccountId',
	'Email',
	'FirstName',
	'LastName',
	'Phone',
	'Title',
	'MailingCity',
	'MailingCountry',
	'MailingStreet',
	'OwnerId',
	'CreatedDate',
	'LastModifiedDate',
] as const;

const OFFICIAL_LEAD_KEYS = [
	'Id',
	'Company',
	'Email',
	'FirstName',
	'LastName',
	'Status',
	'Phone',
	'IsConverted',
	'OwnerId',
	'CreatedDate',
] as const;

const OFFICIAL_OPPORTUNITY_KEYS = [
	'Id',
	'AccountId',
	'Amount',
	'CloseDate',
	'Name',
	'StageName',
	'IsClosed',
	'IsWon',
	'Probability',
	'OwnerId',
] as const;

function declaredKeys(schema: { shape: Record<string, unknown> }): string[] {
	return Object.keys(schema.shape);
}

describe('Salesforce schema', () => {
	it('declares a semver version', () => {
		expect(SalesforceSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares CRM entities from the official object reference', () => {
		expect(Object.keys(SalesforceSchema.entities).sort()).toEqual(
			[
				'account',
				'campaign',
				'campaignMember',
				'contact',
				'contentDocument',
				'emailMessage',
				'lead',
				'note',
				'opportunity',
				'opportunityLineItem',
				'pricebook',
				'pricebookEntry',
				'task',
				'user',
			].sort(),
		);
	});
});

describe('entity schemas declare official API names', () => {
	it('account uses PascalCase Id/Name, not snake_case', () => {
		const keys = declaredKeys(SalesforceAccountEntity);
		expect(keys).toContain('Id');
		expect(keys).toContain('Name');
		expect(keys).toContain('CreatedDate');
		expect(keys).not.toContain('id');
		expect(keys).not.toContain('created_at');
	});

	it.each([
		['account', SalesforceAccountEntity, OFFICIAL_ACCOUNT_KEYS],
		['contact', SalesforceContactEntity, OFFICIAL_CONTACT_KEYS],
		['lead', SalesforceLeadEntity, OFFICIAL_LEAD_KEYS],
		['opportunity', SalesforceOpportunityEntity, OFFICIAL_OPPORTUNITY_KEYS],
	] as const)('%s declares official fields', (_label, schema, official) => {
		const keys = new Set(declaredKeys(schema));
		for (const field of official) {
			expect(keys.has(field)).toBe(true);
		}
	});

	it('parses a REST retrieve Account with attributes envelope', () => {
		const parsed = SalesforceAccountEntity.parse({
			attributes: {
				type: 'Account',
				url: '/services/data/v60.0/sobjects/Account/001xx000003DGb2AAG',
			},
			Id: '001xx000003DGb2AAG',
			Name: 'Acme',
			Type: 'Customer',
			Industry: 'Technology',
			CreatedDate: '2026-08-13T00:00:00.000+0000',
		});
		expect(parsed.Id).toBe('001xx000003DGb2AAG');
		expect(parsed.Name).toBe('Acme');
	});

	it('parses a SOQL Contact row that omits most fields', () => {
		const parsed = SalesforceContactEntity.parse({
			Id: '003xx000004TmiqAAC',
			LastName: 'Doe',
		});
		expect(parsed.Id).toBe('003xx000004TmiqAAC');
	});

	it('parses Campaign and Task rows', () => {
		expect(
			SalesforceCampaignEntity.parse({ Id: '701xx0000000001AAA', Name: 'Q1' })
				.Name,
		).toBe('Q1');
		expect(
			SalesforceTaskEntity.parse({
				Id: '00Txx0000000001EAA',
				Status: 'Completed',
			}).Status,
		).toBe('Completed');
	});
});
