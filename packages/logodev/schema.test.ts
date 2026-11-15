import { LogoDevSchema } from './schema';
import { LogoDevBrandEntity } from './schema/database';

describe('Logo.dev schema', () => {
	it('declares a semver version and the brands entity', () => {
		expect(LogoDevSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(LogoDevSchema.entities).sort()).toEqual([
			'brands',
			'images',
		]);
	});

	it('accepts a brand row and rejects one with no domain', () => {
		const parsed = LogoDevBrandEntity.parse({
			domain: 'shopify.com',
			name: 'Shopify',
			object: 'search_result',
			logoUrl: 'https://img.logo.dev/shopify.com',
		});
		expect(parsed.domain).toBe('shopify.com');
		expect(LogoDevBrandEntity.safeParse({ name: 'Shopify' }).success).toBe(
			false,
		);
	});
});
