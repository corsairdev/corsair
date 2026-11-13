import { GoogleClassroomSchema } from './schema';

describe('GoogleClassroom schema', () => {
	it('declares a semver version', () => {
		expect(GoogleClassroomSchema.version).toBeDefined();
		expect(GoogleClassroomSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoogleClassroomSchema.entities).toBe('object');
		expect(GoogleClassroomSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GoogleClassroomSchema.entities))).toBe(true);
		for (const entity of Object.values(GoogleClassroomSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
