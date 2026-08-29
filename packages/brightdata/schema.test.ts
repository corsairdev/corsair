import { BrightDataSchema } from './schema';

describe('BrightData schema', () => {
	it('declares a semver version', () => {
		expect(BrightDataSchema.version).toBeDefined();
		expect(BrightDataSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map for live-only API', () => {
		expect(typeof BrightDataSchema.entities).toBe('object');
		expect(BrightDataSchema.entities).not.toBeNull();
		expect(Object.keys(BrightDataSchema.entities)).toEqual([]);
	});
});
