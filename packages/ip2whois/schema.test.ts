import { Ip2whoisSchema } from './schema';
import {
	Ip2whoisDomainEntity,
	Ip2whoisHostedDomainEntity,
} from './schema/database';

const DOMAIN_ROW = {
	domain: 'example.com',
	domain_id: '2336799_DOMAIN_COM-VRSN',
	status: 'client delete prohibited',
	create_date: '1995-08-14T04:00:00Z',
	update_date: '2024-08-14T07:01:38Z',
	expire_date: '2025-08-13T04:00:00Z',
	domain_age: 11323,
	whois_server: 'whois.verisign-grs.com',
	nameservers: ['a.iana-servers.net', 'b.iana-servers.net'],
};

describe('IP2WHOIS schema', () => {
	it('declares a semver version and both entities', () => {
		expect(Ip2whoisSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(Ip2whoisSchema.entities).sort()).toEqual([
			'domains',
			'hostedDomains',
		]);
	});

	it('accepts a domain row and rejects one with no domain', () => {
		expect(Ip2whoisDomainEntity.parse(DOMAIN_ROW)).toEqual(DOMAIN_ROW);
		expect(Ip2whoisDomainEntity.safeParse({ status: 'ok' }).success).toBe(
			false,
		);
		expect(Ip2whoisDomainEntity.safeParse({ domain: '' }).success).toBe(false);
	});

	it('accepts a hosted-domain row and rejects one with no host', () => {
		expect(
			Ip2whoisHostedDomainEntity.parse({
				domain: 'dns.google',
				hostIp: '8.8.8.8',
			}),
		).toEqual({ domain: 'dns.google', hostIp: '8.8.8.8' });
		expect(
			Ip2whoisHostedDomainEntity.safeParse({ domain: 'dns.google' }).success,
		).toBe(false);
	});
});
