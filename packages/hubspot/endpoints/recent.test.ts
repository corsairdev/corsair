import * as Companies from './companies';
import * as Contacts from './contacts';
import * as Deals from './deals';

jest.mock('corsair/core', () => ({ logEventFromContext: jest.fn() }));

type Call = { method: string; path: string; body: any };
const calls: Call[] = [];
const originalFetch = global.fetch;

beforeEach(() => {
	global.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
		const url = new URL(input instanceof Request ? input.url : String(input));
		calls.push({
			method: init?.method ?? 'GET',
			path: url.pathname,
			body: init?.body ? JSON.parse(String(init.body)) : undefined,
		});
		return Response.json({ results: [], total: 0 });
	}) as typeof fetch;
});

afterEach(() => {
	global.fetch = originalFetch;
	calls.length = 0;
});

// unknown: the endpoints read only ctx.key and ctx.db here.
const ctx = { key: 'test-token', db: {} } as any;

const cases = [
	['contacts', Contacts, 'lastmodifieddate'],
	['companies', Companies, 'hs_lastmodifieddate'],
	['deals', Deals, 'hs_lastmodifieddate'],
] as const;

describe.each(cases)('hubspot %s recent', (object, mod, modified) => {
	it('getRecentlyCreated searches newest createdate first', async () => {
		await mod.getRecentlyCreated(ctx, { count: 5, after: '7' });
		expect(calls).toHaveLength(1);
		expect(calls[0]).toMatchObject({
			method: 'POST',
			path: `/crm/v3/objects/${object}/search`,
			body: {
				limit: 5,
				after: '7',
				sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
			},
		});
	});

	it('getRecentlyUpdated sorts by last modified and applies since', async () => {
		await mod.getRecentlyUpdated(ctx, { since: '2025-01-31T00:00:00Z' });
		expect(calls[0]).toMatchObject({
			method: 'POST',
			path: `/crm/v3/objects/${object}/search`,
			body: {
				sorts: [{ propertyName: modified, direction: 'DESCENDING' }],
				filterGroups: [
					{
						filters: [
							{
								propertyName: modified,
								operator: 'GTE',
								value: String(Date.parse('2025-01-31T00:00:00Z')),
							},
						],
					},
				],
			},
		});
	});

	it('getRecentlyCreated filters since on createdate', async () => {
		await mod.getRecentlyCreated(ctx, { since: '1738281600000' });
		expect(calls[0]?.body.filterGroups[0].filters[0]).toEqual({
			propertyName: 'createdate',
			operator: 'GTE',
			value: '1738281600000',
		});
	});
});

describe('hubspot companies.searchByDomain', () => {
	it('POSTs a domain EQ filter to the search endpoint', async () => {
		await Companies.searchByDomain(ctx, {
			domain: 'example.com',
			properties: ['name', 'domain'],
		});
		expect(calls[0]).toMatchObject({
			method: 'POST',
			path: '/crm/v3/objects/companies/search',
			body: {
				filterGroups: [
					{
						filters: [
							{ propertyName: 'domain', operator: 'EQ', value: 'example.com' },
						],
					},
				],
				properties: ['name', 'domain'],
			},
		});
	});
});
