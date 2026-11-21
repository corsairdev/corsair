import { StormboardSchema } from './schema';

describe('StormboardSchema', () => {
	it('declares a semver version', () => {
		expect(StormboardSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because storms and ideas are read live from the workspace', () => {
		expect(Array.isArray(StormboardSchema.entities)).toBe(false);
		expect(StormboardSchema.entities).toEqual({});
	});
});
