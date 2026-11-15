import { TeamcampSchema } from './schema';

describe('Teamcamp schema', () => {
	it('declares a semver version', () => {
		expect(TeamcampSchema.version).toBeDefined();
		expect(TeamcampSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TeamcampSchema.entities).toBe('object');
		expect(TeamcampSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TeamcampSchema.entities))).toBe(true);
		for (const entity of Object.values(TeamcampSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
