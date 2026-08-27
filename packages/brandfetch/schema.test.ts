import { BrandfetchSchema } from './schema';
import {
	BrandfetchBrand,
	BrandfetchCompany,
	BrandfetchWebhook,
} from './schema/database';

describe('Brandfetch schema', () => {
	it('declares a semver version', () => {
		expect(BrandfetchSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official Brand API and GraphQL entities', () => {
		expect(Object.keys(BrandfetchSchema.entities).sort()).toEqual([
			'brands',
			'companies',
			'webhooks',
		]);
	});

	it('labels brand fields from BrandResponse', () => {
		const parsed = BrandfetchBrand.parse({
			id: 'idL0iThUh6',
			name: 'Brandfetch',
			domain: 'brandfetch.com',
			claimed: true,
			description: 'Brand API',
			longDescription: null,
			qualityScore: 0.9,
			isNsfw: false,
			urn: 'urn:brandfetch:brand:idL0iThUh6',
		});
		expect(parsed.domain).toBe('brandfetch.com');
	});

	it('labels company fields from BrandResponse.company', () => {
		const parsed = BrandfetchCompany.parse({
			brandId: 'idL0iThUh6',
			employees: 201,
			foundedYear: 2017,
			kind: 'PRIVATELY_HELD',
			city: null,
			country: 'Ireland',
			countryCode: 'IE',
		});
		expect(parsed.kind).toBe('PRIVATELY_HELD');
	});

	it('omits webhook secret from the persisted webhook entity', () => {
		const parsed = BrandfetchWebhook.parse({
			urn: 'urn:brandfetch:organization:1:webhook:2',
			url: 'https://example.com/hook',
			description: 'logo updates',
			enabled: true,
			events: ['brand.updated'],
		});
		expect(parsed).not.toHaveProperty('secret');
	});
});
