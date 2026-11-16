import { NeverBounceSchema } from './schema';

describe('NeverBounce schema', () => {
	it('declares a semver version', () => {
		expect(NeverBounceSchema.version).toBeDefined();
		expect(NeverBounceSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NeverBounceSchema.entities).toBe('object');
		expect(NeverBounceSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NeverBounceSchema.entities))).toBe(true);
		for (const entity of Object.values(NeverBounceSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
