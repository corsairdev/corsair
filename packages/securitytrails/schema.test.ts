import { SecuritytrailsSchema } from './schema';
import {
	SecuritytrailsCertificate,
	SecuritytrailsCompanyIpRange,
	SecuritytrailsDomain,
	SecuritytrailsIp,
	SecuritytrailsProject,
} from './schema/database';

describe('Securitytrails schema', () => {
	it('declares a semver version', () => {
		expect(SecuritytrailsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers exactly the entities the endpoints write to', () => {
		expect(Object.keys(SecuritytrailsSchema.entities).sort()).toEqual([
			'certificates',
			'companyIpRanges',
			'domains',
			'ips',
			'projects',
		]);
	});

	it('gives every entity a required string id', () => {
		for (const [name, entity] of Object.entries(
			SecuritytrailsSchema.entities,
		)) {
			expect(entity.safeParse({}).success).toBe(false);
			expect(entity.shape.id.safeParse('some-id').success).toBe(true);
			expect(name).toBeTruthy();
		}
	});

	describe('SecuritytrailsDomain', () => {
		it('accepts a flattened domain record', () => {
			const parsed = SecuritytrailsDomain.parse({
				id: 'securitytrails.com',
				hostname: 'securitytrails.com',
				alexa_rank: 83756,
				ipv4: ['200.121.20.1'],
				nameservers: ['ns4.dnsmadeeasy.com'],
				dns_first_seen: '2017-05-26',
			});

			expect(parsed.dns_first_seen).toEqual(new Date('2017-05-26'));
			expect(parsed.ipv4).toEqual(['200.121.20.1']);
		});

		it('requires a hostname', () => {
			expect(SecuritytrailsDomain.safeParse({ id: 'x.com' }).success).toBe(
				false,
			);
		});
	});

	describe('SecuritytrailsCertificate', () => {
		it('stores validity as dates', () => {
			const parsed = SecuritytrailsCertificate.parse({
				id: 'C19C',
				hostname: 'stackoverflow.com',
				sha256: 'C19C',
				not_after: new Date(1587482583 * 1000),
				not_before: new Date(1579706583 * 1000),
			});

			expect(parsed.not_after?.getUTCFullYear()).toBe(2020);
			expect(parsed.not_before).toBeInstanceOf(Date);
		});
	});

	describe('SecuritytrailsIp', () => {
		it('keeps ports as numbers and tolerates a missing PTR', () => {
			const parsed = SecuritytrailsIp.parse({
				id: '138.128.168.3',
				ip: '138.128.168.3',
				ptr: null,
				ports: [21, 22, 80, 443],
			});

			expect(parsed.ports).toEqual([21, 22, 80, 443]);
			expect(parsed.ptr).toBeNull();
		});
	});

	describe('SecuritytrailsProject', () => {
		it('coerces the ASI timestamps to dates', () => {
			const parsed = SecuritytrailsProject.parse({
				id: '1b9e4ec0-0000-4000-8000-000000000000',
				title: 'Primary',
				scanning_enabled: true,
				last_scanned_at: '2026-01-02T03:04:05Z',
				inserted_at: '2025-12-01T00:00:00Z',
				max_exposure_score: 87,
			});

			expect(parsed.last_scanned_at).toEqual(new Date('2026-01-02T03:04:05Z'));
			expect(parsed.max_exposure_score).toBe(87);
		});
	});

	describe('SecuritytrailsCompanyIpRange', () => {
		it('requires the company domain alongside the block', () => {
			expect(
				SecuritytrailsCompanyIpRange.safeParse({
					id: 'amazon.com:52.0.0.0/11',
					cidr: '52.0.0.0/11',
				}).success,
			).toBe(false);

			expect(
				SecuritytrailsCompanyIpRange.parse({
					id: 'amazon.com:52.0.0.0/11',
					domain: 'amazon.com',
					cidr: '52.0.0.0/11',
				}).domain,
			).toBe('amazon.com');
		});
	});
});
