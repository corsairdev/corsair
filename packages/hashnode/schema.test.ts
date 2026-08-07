import { HashnodeSchema } from './schema';

describe('Hashnode schema', () => {
	it('declares a semver version', () => {
		expect(HashnodeSchema.version).toBeDefined();
		expect(HashnodeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HashnodeSchema.entities).toBe('object');
		expect(HashnodeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HashnodeSchema.entities))).toBe(true);
	});

	it('has no persistent entities since Hashnode is a live API', () => {
		expect(Object.keys(HashnodeSchema.entities)).toHaveLength(0);
	});
});
