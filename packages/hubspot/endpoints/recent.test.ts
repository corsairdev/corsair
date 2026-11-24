import * as Companies from './companies';
import * as Contacts from './contacts';
import * as Deals from './deals';
import { HubSpotEndpointInputSchemas } from './types';

jest.mock('corsair/core', () => ({ logEventFromContext: jest.fn() }));

type Call = {
	method: string;
	path: string;
	body?: { filterGroups?: { filters: Record<string, string>[] }[] };
};
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

// the endpoints read only ctx.key and ctx.db here
const ctx = { key: 'test-token', db: {} } as unknown as Parameters<
	typeof Companies.searchByDomain
>[0];

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
		expect(calls[0]?.body?.filterGroups?.[0]?.filters[0]).toEqual({
			propertyName: 'createdate',
			operator: 'GTE',
			value: '1738281600000',
		});
	});
});

describe('hubspot recent input', () => {
	const schema = HubSpotEndpointInputSchemas.contactsGetRecentlyCreated;

	it.each(['yesterday', '2025-13-45', '', '12ab'])(
		'rejects since=%p',
		(since) => {
			expect(schema.safeParse({ since }).success).toBe(false);
		},
	);

	it.each(['2025-01-31', '2025-01-31T00:00:00Z', '1738281600000'])(
		'accepts since=%s',
		(since) => {
			expect(schema.safeParse({ since }).success).toBe(true);
		},
	);

	it('caps count at the search maximum of 200', () => {
		expect(schema.safeParse({ count: 200 }).success).toBe(true);
		expect(schema.safeParse({ count: 201 }).success).toBe(false);
	});

	it('does not send NaN when called directly with a bad since', async () => {
		await expect(
			Contacts.getRecentlyCreated(ctx, { since: 'yesterday' }),
		).rejects.toThrow();
		expect(calls).toHaveLength(0);
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

	it('passes after so later matches can be fetched', async () => {
		await Companies.searchByDomain(ctx, { domain: 'example.com', after: '10' });
		expect(calls[0]?.body).toMatchObject({ after: '10' });
	});
});
