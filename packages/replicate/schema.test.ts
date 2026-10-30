import { ReplicateSchema } from './schema';

describe('Replicate schema', () => {
	it('declares a semver version', () => {
		expect(ReplicateSchema.version).toBeDefined();
		expect(ReplicateSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ReplicateSchema.entities).toBe('object');
		expect(ReplicateSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ReplicateSchema.entities))).toBe(true);
		for (const entity of Object.values(ReplicateSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
