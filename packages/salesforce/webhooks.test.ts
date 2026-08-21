import { flattenFields } from './endpoints/shared';
import {
	cloneableFields,
	escapeSoql,
	parseCsvRecords,
	soqlWhere,
} from './utils';
import { resolveSalesforceOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import {
	createSalesforceChangeMatch,
	recordIdFromPayload,
} from './webhooks/types';

describe('flattenFields', () => {
	it('spreads CustomFields onto the Salesforce body', () => {
		expect(
			flattenFields({
				Name: 'Acme',
				CustomFields: { Region__c: 'West' },
			}),
		).toEqual({ Name: 'Acme', Region__c: 'West' });
	});
});

describe('escapeSoql', () => {
	it('escapes quotes, backslashes, and LIKE wildcards', () => {
		expect(escapeSoql("O'Brien%_")).toBe("O\\'Brien\\%\\_");
	});
});

describe('parseCsvRecords', () => {
	it('keeps quoted newlines inside a single record', () => {
		expect(parseCsvRecords('Name,Notes\n"Acme","line1\nline2"\n')).toEqual([
			{ Name: 'Acme', Notes: 'line1\nline2' },
		]);
	});

	it('preserves whitespace inside quoted fields', () => {
		expect(parseCsvRecords('Name,Notes\nAcme,"  padded  "\n')).toEqual([
			{ Name: 'Acme', Notes: '  padded  ' },
		]);
	});
});

describe('cloneableFields', () => {
	it('keeps only createable fields from the record and overrides', () => {
		const allowed = new Set(['Name', 'Phone']);
		expect(
			cloneableFields(
				{ Id: '001xx', Name: 'Acme', LastModifiedDate: '2026-01-01' },
				allowed,
			),
		).toEqual({ Name: 'Acme' });
		expect(
			cloneableFields({ Name: 'Beta', OwnerId: '005xx' }, allowed),
		).toEqual({ Name: 'Beta' });
	});
});

describe('Salesforce webhook matchers', () => {
	it('matches Account CREATE CDC payloads', () => {
		const match = createSalesforceChangeMatch({
			entityName: 'Account',
			changeTypes: ['CREATE', 'CREATED'],
		});
		expect(
			match({
				headers: {},
				body: {
					ChangeEventHeader: {
						entityName: 'Account',
						changeType: 'CREATE',
						recordIds: ['001xx000003DGb2AAG'],
					},
				},
			}),
		).toBe(true);
		expect(
			match({
				headers: {},
				body: {
					ChangeEventHeader: {
						entityName: 'Contact',
						changeType: 'CREATE',
					},
				},
			}),
		).toBe(false);
	});

	it('does not treat GAP_CREATE as CREATE', () => {
		const match = createSalesforceChangeMatch({
			entityName: 'Account',
			changeTypes: ['CREATE', 'CREATED'],
		});
		expect(
			match({
				headers: {},
				body: {
					ChangeEventHeader: {
						entityName: 'Account',
						changeType: 'GAP_CREATE',
					},
				},
			}),
		).toBe(false);
	});

	it('reads the record id from ChangeEventHeader', () => {
		expect(
			recordIdFromPayload({
				ChangeEventHeader: { recordIds: ['001xx'] },
			}),
		).toBe('001xx');
	});
});

describe('soqlWhere', () => {
	it('accepts allowlisted field/operator clauses', () => {
		expect(soqlWhere("Name = 'Acme' AND Status IN ('Open','Closed')")).toBe(
			"Name = 'Acme' AND Status IN ('Open','Closed')",
		);
	});

	it('accepts inclusive comparison operators', () => {
		expect(soqlWhere('Amount >= 10')).toBe('Amount >= 10');
		expect(soqlWhere('Amount <= 25')).toBe('Amount <= 25');
	});

	it('rejects concatenated SOQL fragments', () => {
		expect(() => soqlWhere("Name = 'x' OR Id != '' LIMIT 1")).toThrow(
			'Invalid SOQL WHERE clause',
		);
	});
});

describe('resolveSalesforceOAuthWebhookTenantLink', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('extracts a 15-character org id from a Salesforce identity URL', async () => {
		await expect(
			resolveSalesforceOAuthWebhookTenantLink({
				access_token: 'token',
				id: 'https://login.salesforce.com/id/00D000000000123/005xx',
			} as never),
		).resolves.toEqual({
			linkType: 'tenant_external_id',
			externalId: '00D000000000123',
		});
	});

	it('does not send the bearer token to a non-Salesforce host', async () => {
		let fetched = false;
		global.fetch = (async () => {
			fetched = true;
			return { ok: true, json: async () => ({}) } as Response;
		}) as typeof fetch;
		await expect(
			resolveSalesforceOAuthWebhookTenantLink({
				access_token: 'token',
				id: 'https://evil.example/id/00D000000000123/005xx',
			} as never),
		).resolves.toBeNull();
		expect(fetched).toBe(false);
	});
});
