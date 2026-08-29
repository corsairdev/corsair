import { BeaconstacSchema } from './schema';

describe('Beaconstac schema', () => {
	it('declares a semver version', () => {
		expect(BeaconstacSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official Uniqode entities', () => {
		expect(Object.keys(BeaconstacSchema.entities).sort()).toEqual([
			'bulkQrcodes',
			'organizations',
			'places',
			'qrTemplates',
			'qrcodes',
			'tags',
			'users',
		]);
	});
});
