import { BoltIotSchema } from './schema';

describe('BoltIot schema', () => {
	it('declares a semver version', () => {
		expect(BoltIotSchema.version).toBeDefined();
		expect(BoltIotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BoltIotSchema.entities).toBe('object');
		expect(BoltIotSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BoltIotSchema.entities))).toBe(true);
	});
});
