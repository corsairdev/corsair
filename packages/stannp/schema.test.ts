import { StannpSchema } from './schema';

describe('Stannp schema', () => {
	it('declares a semver version', () => {
		expect(StannpSchema.version).toBeDefined();
		expect(StannpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: reporting endpoints already answer delivery status, so a local copy would only go stale', () => {
		expect(StannpSchema.entities).toEqual({});
		expect(Array.isArray(StannpSchema.entities)).toBe(false);
	});
});
