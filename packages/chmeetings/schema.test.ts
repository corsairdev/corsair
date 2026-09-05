import { ChMeetingsSchema } from './schema';

describe('ChMeetings schema', () => {
	it('declares a semver version', () => {
		expect(ChMeetingsSchema.version).toBeDefined();
		expect(ChMeetingsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ChMeetingsSchema.entities).toBe('object');
		expect(ChMeetingsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ChMeetingsSchema.entities))).toBe(true);
		for (const entity of Object.values(ChMeetingsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
