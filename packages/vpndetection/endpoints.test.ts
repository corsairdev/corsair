import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { lookup } from './endpoints/ip';
import type { VpndetectionContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

// Live keyless answers, 2026-11-27.
const VPN_SAMPLE = {
	ip: '185.65.135.230',
	is_bogon: false,
	is_vpn: true,
	is_relay: false,
	is_tor: false,
	is_anycast: false,
	relay: {},
	tor: {},
	location: {
		continent: 'EU',
		continent_name: 'Europe',
		country: 'SE',
		country_name: 'Sweden',
		timezone: 'Europe/Stockholm',
	},
	asn: {
		asn: 39351,
		name: '31173 Services AB',
		domain: '31173.se',
		type: 'isp',
		prefix: '185.65.135.0/24',
		country: 'SE',
		rpki_status: 'valid',
	},
	hostname: '',
};

const RELAY_SAMPLE = {
	ip: '172.224.226.1',
	is_bogon: false,
	is_vpn: false,
	is_relay: true,
	is_tor: false,
	is_anycast: false,
	relay: {
		provider: 'apple_private_relay',
		provider_name: 'Apple iCloud Private Relay',
		confidence: 'high',
		last_seen: '2026-11-26',
	},
	tor: {},
	location: { country: 'GB', country_name: 'United Kingdom' },
	asn: { asn: 36183, name: 'Akamai Technologies, Inc.', type: 'hosting' },
	hostname: '',
};

function context(key: string, upsert?: jest.Mock): VpndetectionContext {
	return {
		key,
		db: upsert ? { lookups: { upsertByEntityId: upsert } } : undefined,
	} as unknown as VpndetectionContext;
}

describe('ip.lookup', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('looks up an address with no key and sends no Authorization', async () => {
		mockRequest.mockResolvedValue(VPN_SAMPLE);

		const result = await lookup(context(''), { ip: '185.65.135.230' });

		expect(result).toEqual(VPN_SAMPLE);
		expect(result.is_vpn).toBe(true);
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://api.vpndetection.io');
		expect(config?.TOKEN).toBeUndefined();
		expect(options).toMatchObject({
			method: 'GET',
			url: '/{ip}',
			path: { ip: '185.65.135.230' },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'vpndetection.ip.lookup',
			{ self: false },
			'completed',
		);
	});

	it('sends a key as the bearer token when one is set', async () => {
		mockRequest.mockResolvedValue(VPN_SAMPLE);

		await lookup(context('test-key'), { ip: '185.65.135.230' });

		expect(mockRequest.mock.calls[0]?.[0].TOKEN).toBe('test-key');
	});

	it('looks up the caller address on /myip when no ip is given', async () => {
		mockRequest.mockResolvedValue({ ...VPN_SAMPLE, ip: '203.0.113.7' });

		const result = await lookup(context(''), {});

		expect(result.ip).toBe('203.0.113.7');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/myip',
		});
		expect(mockRequest.mock.calls[0]?.[1].path).toBeUndefined();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'vpndetection.ip.lookup',
			{ self: true },
			'completed',
		);
	});

	it('keeps the fields a key adds', async () => {
		mockRequest.mockResolvedValue({ ...VPN_SAMPLE, is_hosting: true });

		const result = await lookup(context('test-key'), {
			ip: '185.65.135.230',
		});

		expect(result).toMatchObject({ is_hosting: true });
	});

	it('saves a lookup by address, with the relay provider and ASN', async () => {
		mockRequest.mockResolvedValue(RELAY_SAMPLE);
		const upsert = jest.fn().mockResolvedValue(undefined);

		await lookup(context('', upsert), { ip: '172.224.226.1' });

		expect(upsert).toHaveBeenCalledWith('172.224.226.1', {
			ip: '172.224.226.1',
			is_vpn: false,
			is_tor: false,
			is_relay: true,
			is_bogon: false,
			is_anycast: false,
			tor_provider: undefined,
			relay_provider: 'Apple iCloud Private Relay',
			country: 'GB',
			asn: 36183,
			asn_name: 'Akamai Technologies, Inc.',
			asn_type: 'hosting',
			hostname: undefined,
		});
	});

	it('does not save a lookup of the caller address', async () => {
		mockRequest.mockResolvedValue(VPN_SAMPLE);
		const upsert = jest.fn().mockResolvedValue(undefined);

		await lookup(context('', upsert), {});

		expect(upsert).not.toHaveBeenCalled();
	});

	it('returns the lookup when saving it fails', async () => {
		mockRequest.mockResolvedValue(VPN_SAMPLE);
		const upsert = jest.fn().mockRejectedValue(new Error('db down'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await lookup(context('', upsert), {
			ip: '185.65.135.230',
		});

		expect(result.is_vpn).toBe(true);
		expect(warn).toHaveBeenCalledWith('Failed to save VPNDetection lookup');
		warn.mockRestore();
	});

	it('rejects an answer with no is_vpn', async () => {
		mockRequest.mockResolvedValue({ ip: '8.8.8.8' });

		await expect(lookup(context(''), { ip: '8.8.8.8' })).rejects.toThrow();
	});

	it('lets an API error through as core ApiError, without the address', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/{ip}' },
			{
				url: 'https://api.vpndetection.io/192.0.2.1',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'rate limited' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(error);

		const thrown = await lookup(context(''), { ip: '192.0.2.1' }).catch(
			(e: unknown) => e,
		);
		expect(thrown).toBeInstanceOf(ApiError);
		expect(thrown).toMatchObject({
			status: 429,
			message: 'Too Many Requests',
			body: { error: 'rate limited' },
		});
		expect((thrown as ApiError).url).not.toContain('192.0.2.1');
	});

	it('accepts an IPv6 address', async () => {
		mockRequest.mockResolvedValue({
			...VPN_SAMPLE,
			ip: '2a03:1b20:3:f011::a01f',
		});

		await lookup(context(''), { ip: '2a03:1b20:3:f011::a01f' });

		expect(mockRequest.mock.calls[0]?.[1].path).toEqual({
			ip: '2a03:1b20:3:f011::a01f',
		});
	});

	it('rejects anything but an address before any request', async () => {
		for (const ip of ['', 'myip', 'not-an-ip', '256.1.1.1']) {
			await expect(lookup(context(''), { ip })).rejects.toThrow();
		}
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
