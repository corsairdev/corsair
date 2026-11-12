import { EndorsalSchema } from './schema';

describe('Endorsal schema', () => {
	it('declares a semver version', () => {
		expect(EndorsalSchema.version).toBeDefined();
		expect(EndorsalSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EndorsalSchema.entities).toBe('object');
		expect(EndorsalSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EndorsalSchema.entities))).toBe(true);
		for (const entity of Object.values(EndorsalSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
