import { HoneybadgerSchema } from './schema';

describe('honeybadger schema', () => {
	it('declares a semver version', () => {
		expect(HoneybadgerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because every read is a live API call', () => {
		expect(Array.isArray(HoneybadgerSchema.entities)).toBe(false);
		expect(HoneybadgerSchema.entities).toEqual({});
	});
});
