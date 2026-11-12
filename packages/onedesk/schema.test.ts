import { OnedeskSchema } from './schema';

describe('Onedesk schema', () => {
	it('declares a semver version', () => {
		expect(OnedeskSchema.version).toBeDefined();
		expect(OnedeskSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because every read is a live filter call', () => {
		expect(typeof OnedeskSchema.entities).toBe('object');
		expect(OnedeskSchema.entities).not.toBeNull();
		// Asserting on the value, not on Object.keys, which is always an array.
		expect(Array.isArray(OnedeskSchema.entities)).toBe(false);
		expect(OnedeskSchema.entities).toEqual({});
	});
});
