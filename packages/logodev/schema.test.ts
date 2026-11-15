import { LogoDevSchema } from './schema';
import { LogoDevBrandEntity, LogoDevImageEntity } from './schema/database';

describe('Logo.dev schema', () => {
	it('declares a semver version and the brand and image entities', () => {
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

	it('accepts an image row and rejects one with no content type', () => {
		const parsed = LogoDevImageEntity.parse({
			domain: 'shopify.com',
			contentType: 'image/png',
		});
		expect(parsed.contentType).toBe('image/png');
		expect(
			LogoDevImageEntity.safeParse({ domain: 'shopify.com' }).success,
		).toBe(false);
	});
});
