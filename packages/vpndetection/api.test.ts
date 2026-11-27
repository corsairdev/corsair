import { makeVpndetectionRequest } from './client';
import { LookupIpResponseSchema } from './endpoints/types';

// The API needs no key, so the live suite is opt-in rather than keyed.
const LIVE = process.env.VPNDETECTION_LIVE === '1';
const KEY = process.env.VPNDETECTION_API_KEY ?? '';
const describeLive = LIVE ? describe : describe.skip;

if (!LIVE) {
	console.warn(
		'VPNDETECTION_LIVE is not 1; the live VPNDetection suite is skipped',
	);
}

describeLive('VPNDetection live', () => {
	it('flags a Mullvad exit as a VPN', async () => {
		const body = await makeVpndetectionRequest<unknown>(KEY, '185.65.135.230');
		const parsed = LookupIpResponseSchema.parse(body);
		expect(parsed.is_vpn).toBe(true);
		expect(parsed.location?.country).toBe('SE');
	});

	it('flags a Tor relay', async () => {
		const body = await makeVpndetectionRequest<unknown>(KEY, '185.220.101.1');
		expect(LookupIpResponseSchema.parse(body).is_tor).toBe(true);
	});

	it('names the relay provider for iCloud Private Relay', async () => {
		const body = await makeVpndetectionRequest<unknown>(KEY, '172.224.226.1');
		const parsed = LookupIpResponseSchema.parse(body);
		expect(parsed.is_relay).toBe(true);
		expect(parsed.relay?.provider_name).toBe('Apple iCloud Private Relay');
	});

	it('reads an IPv6 address', async () => {
		const body = await makeVpndetectionRequest<unknown>(
			KEY,
			'2a03:1b20:3:f011::a01f',
		);
		expect(LookupIpResponseSchema.parse(body).is_vpn).toBe(true);
	});
});
