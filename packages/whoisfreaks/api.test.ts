import { makeWhoisfreaksRequest } from './client';
import {
	WhoisfreaksEndpointInputSchemas,
	WhoisfreaksEndpointOutputSchemas,
} from './endpoints/types';

// Live API tests — skipped unless WHOISFREAKS_API_KEY is set. They hit the
// real WhoisFreaks API and prove the output schemas accept the shapes the
// provider actually returns.
const WHOISFREAKS_API_KEY = process.env.WHOISFREAKS_API_KEY;

const describeLive = WHOISFREAKS_API_KEY ? describe : describe.skip;

describeLive('WhoisFreaks API type tests', () => {
	// Note: responses are typed unknown here on purpose — the
	// output-schema parse in each test is the shape assertion.
	it('whois live lookup returns the documented shape', async () => {
		const response = await makeWhoisfreaksRequest<unknown>(
			'/v2.0/whois/live',
			WHOISFREAKS_API_KEY!,
			{
				query: { whois: 'live', domainName: 'example.com' },
			},
		);

		const parsed =
			WhoisfreaksEndpointOutputSchemas.whoisLiveLookupV2.parse(response);
		expect(parsed.domain_name).toBe('example.com');
		expect(typeof parsed.status).toBe('boolean');
	});

	it('dns live lookup returns the documented shape', async () => {
		const response = await makeWhoisfreaksRequest<unknown>(
			'/v2.0/dns/live',
			WHOISFREAKS_API_KEY!,
			{ query: { domainName: 'example.com', type: 'all' } },
		);

		const parsed =
			WhoisfreaksEndpointOutputSchemas.dnsLiveLookup.parse(response);
		expect(parsed).toBeDefined();
		expect(parsed.domainName ?? parsed.ipAddress).toBeDefined();
	});

	it('domain availability check returns the documented shape', async () => {
		const response = await makeWhoisfreaksRequest<unknown>(
			'/v2.0/domain/availability',
			WHOISFREAKS_API_KEY!,
			{ query: { domain: 'example.com', sug: false, count: 5 } },
		);

		const parsed =
			WhoisfreaksEndpointOutputSchemas.domainAvailabilityCheck.parse(response);
		expect(parsed).toBeDefined();
		expect(parsed.domain ?? parsed.availability).toBeDefined();
	});

	it('ip geolocation lookup returns the documented shape', async () => {
		const response = await makeWhoisfreaksRequest<unknown>(
			'/v1.0/geolocation',
			WHOISFREAKS_API_KEY!,
			{ query: { ip: '8.8.8.8' } },
		);

		const parsed =
			WhoisfreaksEndpointOutputSchemas.geolocationLookup.parse(response);
		expect(parsed.ip).toBe('8.8.8.8');
	});

	it('ssl lookup returns the documented shape', async () => {
		const response = await makeWhoisfreaksRequest<unknown>(
			'/v1.0/ssl/live',
			WHOISFREAKS_API_KEY!,
			{ query: { domainName: 'example.com', chain: false, sslRaw: false } },
		);

		const parsed = WhoisfreaksEndpointOutputSchemas.sslLookup.parse(response);
		expect(parsed).toBeDefined();
		expect(parsed.domainName).toBe('example.com');
	});

	it('rejects an empty domain name before any request', () => {
		expect(() =>
			WhoisfreaksEndpointInputSchemas.whoisLiveLookupV2.parse({
				domainName: '',
			}),
		).toThrow();
	});
});
