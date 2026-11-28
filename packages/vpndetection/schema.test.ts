import { VpndetectionSchema } from './schema';
import { VpndetectionLookupEntity } from './schema/database';

describe('VPNDetection schema', () => {
	it('declares a semver version and the lookups entity', () => {
		expect(VpndetectionSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(VpndetectionSchema.entities)).toEqual(['lookups']);
	});

	it('accepts a lookup row and rejects one with no address', () => {
		const parsed = VpndetectionLookupEntity.parse({
			ip: '185.220.101.1',
			is_vpn: false,
			is_tor: true,
			country: 'DE',
		});
		expect(parsed.is_tor).toBe(true);
		expect(VpndetectionLookupEntity.safeParse({ is_vpn: true }).success).toBe(
			false,
		);
	});
});
