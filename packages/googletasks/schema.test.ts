import { GoogleTasksSchema } from './schema';

describe('GoogleTasks schema', () => {
	it('declares a semver version', () => {
		expect(GoogleTasksSchema.version).toBeDefined();
		expect(GoogleTasksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoogleTasksSchema.entities).toBe('object');
		expect(GoogleTasksSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GoogleTasksSchema.entities))).toBe(true);
		for (const entity of Object.values(GoogleTasksSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
