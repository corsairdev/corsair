import { StatuscakeSchema } from './schema';

describe('StatusCake schema', () => {
	it('declares a semver version', () => {
		expect(StatuscakeSchema.version).toBeDefined();
		expect(StatuscakeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: the API answers history, periods and alerts on demand, so a local copy would only go stale', () => {
		expect(StatuscakeSchema.entities).toEqual({});
		expect(Array.isArray(StatuscakeSchema.entities)).toBe(false);
	});
});
