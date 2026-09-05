/**
 * Unit tests for every WhoisFreaks endpoint: the exact method, path, and
 * parameters each operation sends, the event it logs, and input validation.
 * The HTTP layer is mocked — live shape checks live in api.test.ts.
 */
import { logEventFromContext } from 'corsair/core';
import { makeWhoisfreaksRequest } from './client';
import { AsnWhois, IpWhois } from './endpoints/asn-ip';
import { Availability } from './endpoints/availability';
import { Dns } from './endpoints/dns';
import { Geolocation } from './endpoints/geolocation';
import { DomainReputation, IpReputation } from './endpoints/reputation';
import { Ssl } from './endpoints/ssl';
import { Subdomains } from './endpoints/subdomains';
import { Typosquatting } from './endpoints/typosquatting';
import {
	BulkWhois,
	WhoisHistory,
	WhoisLive,
	WhoisReverse,
} from './endpoints/whois';
import { whoisfreaksEndpointSchemas } from './index';

jest.mock('./client', () => ({
	makeWhoisfreaksRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

// unknown casts below bridge the mocked transport boundary: the mock
// replaces the typed HTTP helper with jest.Mock, and endpoint responses
// pass through unvalidated by design (shape checks live in api.test.ts).
const mockRequest = makeWhoisfreaksRequest as unknown as jest.Mock;
const mockLogEvent = logEventFromContext as unknown as jest.Mock;

type Ctx = Parameters<typeof WhoisLive.lookupV2>[0];

function makeCtx(): Ctx {
	return { key: 'test-key' } as unknown as Ctx;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockReset();
});

type Case = {
	name: keyof typeof whoisfreaksEndpointSchemas;
	run: (ctx: Ctx) => Promise<unknown>;
	response: unknown;
	expectedArgs: [string, string, Record<string, unknown>];
	event: string;
};

const cases: Case[] = [
	{
		name: 'whoisLive.lookupV2',
		run: (ctx) => WhoisLive.lookupV2(ctx, { domainName: 'example.com' }),
		response: { status: true, domain_name: 'example.com' },
		expectedArgs: [
			'/v2.0/whois/live',
			'test-key',
			{
				method: 'GET',
				query: { whois: 'live', domainName: 'example.com' },
			},
		],
		event: 'whoisfreaks.whois.live_lookup_v2',
	},
	{
		name: 'whoisHistory.lookup',
		run: (ctx) =>
			WhoisHistory.lookup(ctx, { domainName: 'example.com', page: 2 }),
		response: { total_records: 3, whois_domains_historical: [] },
		expectedArgs: [
			'/v2.0/whois/history',
			'test-key',
			{
				method: 'GET',
				query: { domainName: 'example.com', page: 2 },
			},
		],
		event: 'whoisfreaks.whois.history_lookup',
	},
	{
		name: 'whoisReverse.lookup',
		run: (ctx) => WhoisReverse.lookup(ctx, { keyword: 'Example Corp' }),
		response: { Total_Result: 10, Total_Pages: 1, Current_Page: 1 },
		expectedArgs: [
			'/v2.0/whois/reverse',
			'test-key',
			{
				method: 'GET',
				query: { keyword: 'Example Corp', page: undefined },
			},
		],
		event: 'whoisfreaks.whois.reverse_lookup',
	},
	{
		name: 'bulkWhois.lookup',
		run: (ctx) =>
			BulkWhois.lookup(ctx, { domainNames: ['example.com', 'example.org'] }),
		response: { bulk_whois_response: [{ domain_name: 'example.com' }] },
		expectedArgs: [
			'/v2.0/bulkwhois/live',
			'test-key',
			{
				method: 'POST',
				body: { domainNames: ['example.com', 'example.org'] },
			},
		],
		event: 'whoisfreaks.whois.bulk_lookup',
	},
	{
		name: 'dns.live',
		run: (ctx) => Dns.live(ctx, { domainName: 'example.com', type: 'A' }),
		response: { domainName: 'example.com', status: true },
		expectedArgs: [
			'/v2.0/dns/live',
			'test-key',
			{
				method: 'GET',
				query: {
					domainName: 'example.com',
					ipAddress: undefined,
					type: 'A',
				},
			},
		],
		event: 'whoisfreaks.dns.live_lookup',
	},
	{
		name: 'dns.historical',
		run: (ctx) =>
			Dns.historical(ctx, { domainName: 'example.com', type: 'all', page: 1 }),
		response: { totalPages: 1, currenPage: 1, totalRecords: 5 },
		expectedArgs: [
			'/v2.0/dns/historical',
			'test-key',
			{
				method: 'GET',
				query: { domainName: 'example.com', type: 'all', page: 1 },
			},
		],
		event: 'whoisfreaks.dns.historical_lookup',
	},
	{
		name: 'dns.reverse',
		run: (ctx) =>
			Dns.reverse(ctx, {
				value: '93.184.216.34',
				type: 'a',
				exact: true,
				page: 1,
			}),
		response: { totalRecords: 2, reverseDnsRecords: [] },
		expectedArgs: [
			'/v2.1/dns/reverse',
			'test-key',
			{
				method: 'GET',
				query: { value: '93.184.216.34', type: 'a', exact: true, page: 1 },
			},
		],
		event: 'whoisfreaks.dns.reverse_lookup',
	},
	{
		name: 'dns.bulk',
		run: (ctx) => Dns.bulk(ctx, { domainNames: ['example.com'], type: 'all' }),
		response: { bulk_dns_info: [] },
		expectedArgs: [
			'/v2.0/dns/bulk/live',
			'test-key',
			{
				method: 'POST',
				body: { domainNames: ['example.com'], ipAddresses: undefined },
				query: { type: 'all' },
			},
		],
		event: 'whoisfreaks.dns.bulk_lookup',
	},
	{
		name: 'availability.check',
		run: (ctx) =>
			Availability.check(ctx, { domain: 'example.com', sug: false, count: 5 }),
		response: { domain: 'example.com', availability: 'unavailable' },
		expectedArgs: [
			'/v2.0/domain/availability',
			'test-key',
			{
				method: 'GET',
				query: { domain: 'example.com', sug: false, count: 5 },
			},
		],
		event: 'whoisfreaks.availability.check',
	},
	{
		name: 'availability.bulkCheck',
		run: (ctx) => Availability.bulkCheck(ctx, { domainNames: ['example.com'] }),
		response: { bulk_domain_availability_response: [] },
		expectedArgs: [
			'/v2.0/domain/availability',
			'test-key',
			{
				method: 'POST',
				body: { domainNames: ['example.com'], tld: undefined },
				query: { domain: undefined },
			},
		],
		event: 'whoisfreaks.availability.bulk_check',
	},
	{
		name: 'typosquatting.lookup',
		run: (ctx) => Typosquatting.lookup(ctx, { keyword: 'example' }),
		response: { status: true, totalRecords: 4 },
		expectedArgs: [
			'/v3.0/domain/typos',
			'test-key',
			{
				method: 'GET',
				query: {
					keyword: 'example',
					pattern: undefined,
					pageToken: undefined,
				},
			},
		],
		event: 'whoisfreaks.typosquatting.lookup',
	},
	{
		name: 'ssl.lookup',
		run: (ctx) =>
			Ssl.lookup(ctx, {
				domainName: 'example.com',
				chain: false,
				sslRaw: false,
			}),
		response: { domainName: 'example.com', sslCertificates: [] },
		expectedArgs: [
			'/v1.0/ssl/live',
			'test-key',
			{
				method: 'GET',
				query: { domainName: 'example.com', chain: false, sslRaw: false },
			},
		],
		event: 'whoisfreaks.ssl.lookup',
	},
	{
		name: 'geolocation.lookup',
		run: (ctx) => Geolocation.lookup(ctx, { ip: '8.8.8.8' }),
		response: { ip: '8.8.8.8' },
		expectedArgs: [
			'/v1.0/geolocation',
			'test-key',
			{ method: 'GET', query: { ip: '8.8.8.8' } },
		],
		event: 'whoisfreaks.geolocation.lookup',
	},
	{
		name: 'geolocation.bulkLookup',
		run: (ctx) => Geolocation.bulkLookup(ctx, { ips: ['8.8.8.8'] }),
		response: [{ ip: '8.8.8.8' }],
		expectedArgs: [
			'/v1.0/geolocation',
			'test-key',
			{ method: 'POST', body: { ips: ['8.8.8.8'] } },
		],
		event: 'whoisfreaks.geolocation.bulk_lookup',
	},
	{
		name: 'subdomains.lookup',
		run: (ctx) => Subdomains.lookup(ctx, { domain: 'example.com', page: 1 }),
		response: { domain: 'example.com', total_records: 1 },
		expectedArgs: [
			'/v1.0/subdomains',
			'test-key',
			{
				method: 'GET',
				query: {
					domain: 'example.com',
					after: undefined,
					before: undefined,
					status: undefined,
					page: 1,
				},
			},
		],
		event: 'whoisfreaks.subdomains.lookup',
	},
	{
		name: 'ipReputation.lookup',
		run: (ctx) => IpReputation.lookup(ctx, { ip: '8.8.8.8' }),
		response: { ip: '8.8.8.8' },
		expectedArgs: [
			'/v1.0/security',
			'test-key',
			{ method: 'GET', query: { ip: '8.8.8.8' } },
		],
		event: 'whoisfreaks.ip_reputation.lookup',
	},
	{
		name: 'ipReputation.bulkLookup',
		run: (ctx) => IpReputation.bulkLookup(ctx, { ips: ['8.8.8.8'] }),
		response: [{ ip: '8.8.8.8' }],
		expectedArgs: [
			'/v1.0/security',
			'test-key',
			{ method: 'POST', body: { ips: ['8.8.8.8'] } },
		],
		event: 'whoisfreaks.ip_reputation.bulk_lookup',
	},
	{
		name: 'domainReputation.lookup',
		run: (ctx) => DomainReputation.lookup(ctx, { domainName: 'example.com' }),
		response: { version: '1.0' },
		expectedArgs: [
			'/v1/domain/security',
			'test-key',
			{ method: 'GET', query: { domainName: 'example.com' } },
		],
		event: 'whoisfreaks.domain_reputation.lookup',
	},
	{
		name: 'asnWhois.lookup',
		run: (ctx) => AsnWhois.lookup(ctx, { asn: 'AS15169' }),
		response: { asn: { number: 'AS15169' } },
		expectedArgs: [
			'/v2.0/asn-whois',
			'test-key',
			{ method: 'GET', query: { asn: 'AS15169' } },
		],
		event: 'whoisfreaks.asn_whois.lookup',
	},
	{
		name: 'ipWhois.lookup',
		run: (ctx) => IpWhois.lookup(ctx, { ip: '8.8.8.8' }),
		response: { ip_address: '8.8.8.8', status: true },
		expectedArgs: [
			'/v1.0/ip-whois',
			'test-key',
			{ method: 'GET', query: { ip: '8.8.8.8' } },
		],
		event: 'whoisfreaks.ip_whois.lookup',
	},
];

describe('whoisfreaks endpoints', () => {
	it('covers every registered endpoint', () => {
		const tested = new Set(cases.map((c) => c.name));
		for (const name of Object.keys(whoisfreaksEndpointSchemas)) {
			expect(tested.has(name as Case['name'])).toBe(true);
		}
		expect(tested.size).toBe(Object.keys(whoisfreaksEndpointSchemas).length);
	});

	for (const c of cases) {
		it(`${c.name} calls the provider and logs completion`, async () => {
			mockRequest.mockResolvedValue(c.response);
			const ctx = makeCtx();

			const result = await c.run(ctx);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest).toHaveBeenCalledWith(...c.expectedArgs);
			expect(result).toEqual(c.response);
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent).toHaveBeenCalledWith(
				ctx,
				c.event,
				expect.anything(),
				'completed',
			);
		});
	}
});
