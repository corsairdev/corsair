import { DnsfilterSchema } from './schema';

describe('Dnsfilter schema', () => {
	it('declares a semver version', () => {
		expect(DnsfilterSchema.version).toBeDefined();
		expect(DnsfilterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DnsfilterSchema.entities).toBe('object');
		expect(DnsfilterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DnsfilterSchema.entities))).toBe(true);
		for (const entity of Object.values(DnsfilterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
