import { CannySchema } from './schema';

describe('Canny schema', () => {
	it('declares a semver version', () => {
		expect(CannySchema.version).toBeDefined();
		expect(CannySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all entities', () => {
		expect(typeof CannySchema.entities).toBe('object');
		expect(CannySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CannySchema.entities))).toBe(true);
		expect(CannySchema.entities.boards).toBeDefined();
		expect(CannySchema.entities.posts).toBeDefined();
		expect(CannySchema.entities.comments).toBeDefined();
		expect(CannySchema.entities.votes).toBeDefined();
	});
});
