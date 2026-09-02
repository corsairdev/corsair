import { TinyurlSchema } from './schema';

describe('Tinyurl schema', () => {
	it('declares a semver version', () => {
		expect(TinyurlSchema.version).toBeDefined();
		expect(TinyurlSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TinyurlSchema.entities).toBe('object');
		expect(TinyurlSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TinyurlSchema.entities))).toBe(true);
		for (const entity of Object.values(TinyurlSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
