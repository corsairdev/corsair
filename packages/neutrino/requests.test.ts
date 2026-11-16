import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NeutrinoPluginOptions } from './index';
import { neutrino, neutrinoEndpointsNested } from './index';
import {
	accessDenied,
	badParameter,
	binLookup,
	convert,
	domainLookup,
	emailValidate,
	emailVerify,
	geocodeAddress,
	geocodeReverse,
	hlrLookup,
	hostReputation,
	ipBlocklist,
	ipInfo,
	ipProbe,
	phoneValidate,
	smsVerify,
	uaLookup,
	urlInfo,
} from './test-fixtures';

const USER_ID = '12345';
const API_KEY = 'test-api-key';

function makeContext() {
	return {
		key: API_KEY,
		authType: 'api_key' as const,
		options: { userId: USER_ID } as NeutrinoPluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: { get_user_id: async () => USER_ID },
		_http: {},
	};
}

// unknown: each operation has its own input and output, and every call site
// passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

const endpoints = neutrinoEndpointsNested;

/** Runs one endpoint and returns the response and the request that made it. */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentType = 'application/json' } = {},
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext() as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

describe('credential transport', () => {
	it('sends the user id and key combined in one API-Key header', async () => {
		const { init } = await capture(
			endpoints.ip.info,
			{ ip: '1.1.1.1' },
			ipInfo,
		);

		const headers = new Headers(init.headers);
		expect(headers.get('api-key')).toBe(`${USER_ID}:${API_KEY}`);
		// Neither credential goes in the query string, where a proxy logs it.
		expect(headers.get('authorization')).toBeNull();
	});

	it('falls back to the stored user id when no option is set', async () => {
		const original = globalThis.fetch;
		let header: string | null = null;
		globalThis.fetch = (async (_url: string, options: RequestInit) => {
			header = new Headers(options.headers).get('api-key');
			return new Response(JSON.stringify(ipInfo), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;

		try {
			const ctx = { ...makeContext(), options: {} as NeutrinoPluginOptions };
			await endpoints.ip.info(ctx as never, { ip: '1.1.1.1' });
			expect(header).toBe(`${USER_ID}:${API_KEY}`);
		} finally {
			globalThis.fetch = original;
		}
	});
});

describe('ip endpoints', () => {
	it('looks up an address with its time zone', async () => {
		const { result, url } = await capture(
			endpoints.ip.info,
			{ ip: '1.1.1.1' },
			ipInfo,
		);

		expect(url).toBe('https://neutrinoapi.net/ip-info?ip=1.1.1.1');
		const info = asRecord(result);
		expect(info?.['country-code']).toBe('AU');
		expect(asRecord(info?.timezone)?.id).toBe('Australia/Brisbane');
	});

	it('reports the blocklist flags and sensor list', async () => {
		const { result, url } = await capture(
			endpoints.ip.blocklist,
			{ ip: '1.1.1.1' },
			ipBlocklist,
		);

		expect(url).toContain('/ip-blocklist?ip=1.1.1.1');
		expect(asRecord(result)?.['is-listed']).toBe(false);
		expect(asRecord(result)?.sensors).toEqual([]);
	});

	it('reports the hosting provider', async () => {
		const { result } = await capture(
			endpoints.ip.probe,
			{ ip: '1.1.1.1' },
			ipProbe,
		);

		expect(asRecord(result)?.['is-hosting']).toBe(true);
		expect(asRecord(result)?.['provider-domain']).toBe('cloudflare.com');
	});
});

describe('email endpoints', () => {
	it('sends the address and reads the domain flags', async () => {
		const { result, url } = await capture(
			endpoints.email.validate,
			{ email: 'tech@neutrinoapi.com' },
			emailValidate,
		);

		expect(url).toContain('/email-validate?email=tech%40neutrinoapi.com');
		expect(asRecord(result)?.domain).toBe('neutrinoapi.com');
		expect(asRecord(result)?.['is-disposable']).toBe(false);
	});

	it('keeps verified separate from valid on a verify', async () => {
		const { result } = await capture(
			endpoints.email.verify,
			{ email: 'tech@neutrinoapi.com' },
			emailVerify,
		);

		expect(asRecord(result)?.valid).toBe(true);
		expect(asRecord(result)?.verified).toBe(true);
		expect(asRecord(result)?.verified).toBe(true);
		expect(asRecord(result)?.['is-catch-all']).toBe(false);
	});
});

describe('phone endpoints', () => {
	it('sends the ISO country code as country-code', async () => {
		const { result, url } = await capture(
			endpoints.phone.validate,
			{ number: '0412345678', countryCode: 'AU' },
			phoneValidate,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/phone-validate');
		expect(parsed.searchParams.get('country-code')).toBe('AU');
		expect(asRecord(result)?.['international-number']).toBe('+61412345678');
	});

	it('rejects a country code that is not two characters', async () => {
		await expect(
			endpoints.phone.validate(makeContext() as never, {
				number: '0412345678',
				countryCode: 'AUS',
			}),
		).rejects.toThrow();
	});

	it('reads the HLR status and ported network', async () => {
		const { result, url } = await capture(
			endpoints.phone.hlrLookup,
			{ number: '+61412345678' },
			hlrLookup,
		);

		expect(new URL(url).pathname).toBe('/hlr-lookup');
		expect(asRecord(result)?.['hlr-status']).toBe('active');
		expect(asRecord(result)?.['is-ported']).toBe(false);
	});
});

describe('web endpoints', () => {
	it('parses a user agent', async () => {
		const { result } = await capture(
			endpoints.web.uaLookup,
			{ ua: 'Mozilla/5.0 Chrome/130.0' },
			uaLookup,
		);

		expect(asRecord(result)?.name).toBe('Chrome');
		expect(asRecord(result)?.['is-mobile']).toBe(false);
	});

	it('reads domain facts including the blocklists', async () => {
		const { result } = await capture(
			endpoints.web.domainLookup,
			{ host: 'neutrinoapi.com' },
			domainLookup,
		);

		expect(asRecord(result)?.tld).toBe('com');
		expect(asRecord(result)?.['is-malicious']).toBe(false);
		expect(asRecord(result)?.blocklists).toEqual([]);
	});

	it('reads one entry per DNSBL checked', async () => {
		const { result } = await capture(
			endpoints.web.hostReputation,
			{ host: 'neutrinoapi.com' },
			hostReputation,
		);

		const lists = asRecord(result)?.lists;
		const first = asRecord(Array.isArray(lists) ? lists[0] : null);
		expect(first?.['list-host']).toBe('zen.spamhaus.org');
		expect(first?.['return-code']).toBe('NXDOMAIN');
	});

	it('sends the literal fetch-content parameter, not camelCase', async () => {
		const { url } = await capture(
			endpoints.web.urlInfo,
			{ url: 'https://neutrinoapi.com', fetchContent: true },
			urlInfo,
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('fetch-content')).toBe('true');
		expect(parsed.searchParams.has('fetchContent')).toBe(false);
	});
});

describe('geocode endpoints', () => {
	it('accepts a full address on its own', async () => {
		const { result, url } = await capture(
			endpoints.geocode.address,
			{ address: '48 Greys Avenue, Auckland' },
			geocodeAddress,
		);

		expect(new URL(url).searchParams.get('address')).toBe(
			'48 Greys Avenue, Auckland',
		);
		const locations = asRecord(result)?.locations;
		expect(Array.isArray(locations) ? locations.length : 0).toBe(1);
	});

	it('accepts the structured parts instead', async () => {
		const { url } = await capture(
			endpoints.geocode.address,
			{ street: 'Greys Avenue', city: 'Auckland', country: 'NZ' },
			geocodeAddress,
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('street')).toBe('Greys Avenue');
		expect(parsed.searchParams.get('postal-code')).toBeNull();
	});

	it('sends the country as country-code, which is the name the spec reads', async () => {
		const { url } = await capture(
			endpoints.geocode.address,
			{ address: '48 Greys Avenue, Auckland', country: 'NZ' },
			geocodeAddress,
		);

		const parsed = new URL(url);
		// A `country` parameter is silently ignored by the provider.
		expect(parsed.searchParams.get('country-code')).toBe('NZ');
		expect(parsed.searchParams.has('country')).toBe(false);
	});

	it('rejects a geocode with no address at all', async () => {
		await expect(
			endpoints.geocode.address(makeContext() as never, {}),
		).rejects.toThrow(/address or at least one address part/);
	});

	it('sends the coordinate and reads both address forms', async () => {
		const { result, url } = await capture(
			endpoints.geocode.reverse,
			{ latitude: -36.8499, longitude: 174.7611 },
			geocodeReverse,
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('latitude')).toBe('-36.8499');
		expect(parsed.searchParams.get('longitude')).toBe('174.7611');
		const reverse = asRecord(result);
		expect(reverse?.address).toContain('Greys Avenue');
		expect(asRecord(reverse?.['address-structured'])?.street).toBe(
			'Greys Avenue',
		);
	});

	it('rejects a latitude outside the valid range', async () => {
		await expect(
			endpoints.geocode.reverse(makeContext() as never, {
				latitude: 91,
				longitude: 0,
			}),
		).rejects.toThrow();
	});
});

describe('commerce endpoints', () => {
	it('sends the BIN as bin-number', async () => {
		const { result, url } = await capture(
			endpoints.commerce.binLookup,
			{ binNumber: '48334884' },
			binLookup,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/bin-lookup');
		expect(parsed.searchParams.get('bin-number')).toBe('48334884');
		expect(asRecord(result)?.['card-category']).toBe('PLATINUM');
	});

	it('rejects a BIN shorter than six digits', async () => {
		await expect(
			endpoints.commerce.binLookup(makeContext() as never, {
				binNumber: '4833',
			}),
		).rejects.toThrow();
	});

	it('converts and reports both the string and numeric result', async () => {
		const { result, url } = await capture(
			endpoints.commerce.convert,
			{ fromValue: 100, fromType: 'USD', toType: 'EUR' },
			convert,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/convert');
		expect(parsed.searchParams.get('from-value')).toBe('100');
		expect(parsed.searchParams.get('to-type')).toBe('EUR');
		const body = asRecord(result);
		expect(body?.result).toBe('92.41');
		expect(body?.['result-float']).toBe(92.41);
	});
});

describe('messaging.smsVerify', () => {
	it('sends the code settings and reports that it was sent', async () => {
		const { result, url } = await capture(
			endpoints.messaging.smsVerify,
			{ number: '+61412345678', codeLength: 6 },
			smsVerify,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/sms-verify');
		expect(parsed.searchParams.get('code-length')).toBe('6');
		expect(asRecord(result)?.sent).toBe(true);
		expect(asRecord(result)?.['security-code']).toBe('482913');
	});

	it('rejects a code length outside the documented range', async () => {
		await expect(
			endpoints.messaging.smsVerify(makeContext() as never, {
				number: '+61412345678',
				codeLength: 12,
			}),
		).rejects.toThrow();
	});
});

describe('neutrino error reporting', () => {
	it('reads the numeric code and message', async () => {
		const error = await capture(
			endpoints.ip.info,
			{ ip: '1.1.1.1' },
			accessDenied,
			{ status: 403 },
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('43');
		expect(String(error)).toContain('ACCESS DENIED');
	});

	it('reports a bad parameter by its own code', async () => {
		const error = await capture(
			endpoints.ip.info,
			{ ip: 'notanip' },
			badParameter,
			{ status: 400 },
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('21');
		expect(String(error)).toContain('IP ADDRESS IS NOT VALID');
	});

	it('does not leak the credentials into the error message', async () => {
		const error = await capture(
			endpoints.ip.info,
			{ ip: '1.1.1.1' },
			accessDenied,
			{ status: 403 },
		).catch((caught: unknown) => caught);

		expect(String(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(USER_ID);
	});
});

describe('neutrino plugin definition', () => {
	it('registers as neutrino with api_key auth and no webhooks', () => {
		const plugin = neutrino();
		expect(plugin.id).toBe('neutrino');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the user id as an account field beside the key', () => {
		expect(neutrino().authConfig).toEqual({
			api_key: { account: ['user_id'] },
		});
	});

	it('exposes exactly the 16 catalog operations', () => {
		const nested = Object.entries(neutrinoEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'commerce.binLookup',
			'commerce.convert',
			'email.validate',
			'email.verify',
			'geocode.address',
			'geocode.reverse',
			'ip.blocklist',
			'ip.info',
			'ip.probe',
			'messaging.smsVerify',
			'phone.hlrLookup',
			'phone.validate',
			'web.domainLookup',
			'web.hostReputation',
			'web.uaLookup',
			'web.urlInfo',
		]);
	});

	it('marks only the SMS send as a write', () => {
		const meta = neutrino().endpointMeta ?? {};
		for (const [name, entry] of Object.entries(meta)) {
			const expected = name === 'messaging.smsVerify' ? 'write' : 'read';
			expect({ name, risk: entry.riskLevel }).toEqual({
				name,
				risk: expected,
			});
		}
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = neutrino();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve('stored') },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve(undefined) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('is creatable through createCorsair', () => {
		const corsair = createCorsair({
			plugins: [neutrino({ key: 'k', userId: USER_ID })],
		});
		expect(corsair.neutrino).toBeDefined();
	});
});
