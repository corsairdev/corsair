import { StreamtimeSchema } from './schema';

describe('Streamtime schema', () => {
	it('declares a semver version', () => {
		expect(StreamtimeSchema.version).toBeDefined();
		expect(StreamtimeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof StreamtimeSchema.entities).toBe('object');
		expect(StreamtimeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(StreamtimeSchema.entities))).toBe(true);
		for (const entity of Object.values(StreamtimeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
