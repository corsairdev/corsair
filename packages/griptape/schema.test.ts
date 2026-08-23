import { GriptapeSchema } from './schema';

describe('Griptape schema', () => {
	it('declares a semver version', () => {
		expect(GriptapeSchema.version).toBeDefined();
		expect(GriptapeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GriptapeSchema.entities).toBe('object');
		expect(GriptapeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GriptapeSchema.entities))).toBe(true);
		for (const entity of Object.values(GriptapeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
