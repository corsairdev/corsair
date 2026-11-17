import { Ip2proxySchema } from './schema';
import { Ip2proxyCheckEntity } from './schema/database';

describe('IP2Proxy schema', () => {
	it('declares a semver version and the checks entity', () => {
		expect(Ip2proxySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(Ip2proxySchema.entities)).toEqual(['checks']);
	});

	it('accepts a lookup row and rejects one with no address', () => {
		const parsed = Ip2proxyCheckEntity.parse({
			ip: '8.8.8.8',
			response: 'OK',
			isProxy: 'NO',
			creditsConsumed: 1,
		});
		expect(parsed.ip).toBe('8.8.8.8');
		expect(parsed.isProxy).toBe('NO');
		expect(Ip2proxyCheckEntity.safeParse({ response: 'OK' }).success).toBe(
			false,
		);
		expect(
			Ip2proxyCheckEntity.safeParse({
				ip: '3.5.140.1',
				response: 'OK',
				isProxy: 'DCH',
				lastSeen: '1',
			}).success,
		).toBe(true);
	});
});
