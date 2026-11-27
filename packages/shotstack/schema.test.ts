import { ShotstackSchema } from './schema';

describe('Shotstack schema', () => {
	it('declares a semver version', () => {
		expect(ShotstackSchema.version).toBeDefined();
		expect(ShotstackSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because no sync is useful: renders, sources and assets are all read back from the API itself', () => {
		expect(Array.isArray(ShotstackSchema.entities)).toBe(false);
		expect(ShotstackSchema.entities).toEqual({});
	});
});
