import { DynapicturesSchema } from './schema';
import { DynapicturesDesign, DynapicturesTemplate } from './schema/database';

describe('Dynapictures schema', () => {
	it('declares a semver version', () => {
		expect(DynapicturesSchema.version).toBeDefined();
		expect(DynapicturesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DynapicturesSchema.entities).toBe('object');
		expect(DynapicturesSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DynapicturesSchema.entities))).toBe(true);
		expect(Object.keys(DynapicturesSchema.entities)).toContain('design');
		expect(Object.keys(DynapicturesSchema.entities)).toContain('template');
		for (const entity of Object.values(DynapicturesSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates design entity schema', () => {
		const parsed = DynapicturesDesign.parse({
			id: 'img-1',
			templateId: 'tpl-1',
			imageUrl: 'https://example.com/image.png',
			width: 1000,
			height: 500,
		});
		expect(parsed.id).toBe('img-1');
		expect(parsed.imageUrl).toBe('https://example.com/image.png');
	});

	it('validates template entity schema', () => {
		const parsed = DynapicturesTemplate.parse({
			id: 'tpl-1',
			name: 'Social Banner',
			width: 1200,
			height: 630,
		});
		expect(parsed.id).toBe('tpl-1');
		expect(parsed.name).toBe('Social Banner');
	});
});
