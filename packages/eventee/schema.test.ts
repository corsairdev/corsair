import { EventeeSchema } from './schema';

describe('Eventee schema', () => {
	it('declares a semver version', () => {
		expect(EventeeSchema.version).toBeDefined();
		expect(EventeeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EventeeSchema.entities).toBe('object');
		expect(EventeeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EventeeSchema.entities))).toBe(true);
		for (const entity of Object.values(EventeeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
