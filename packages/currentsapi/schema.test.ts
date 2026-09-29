import { CurrentsApiSchema } from './schema';

describe('CurrentsApi schema', () => {
	it('declares a semver version', () => {
		expect(CurrentsApiSchema.version).toBeDefined();
		expect(CurrentsApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(Object.keys(CurrentsApiSchema.entities)).toEqual([]);
	});
});
