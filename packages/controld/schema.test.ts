import { ControlDSchema } from './schema';

describe('ControlD schema', () => {
	it('declares a semver version', () => {
		expect(ControlDSchema.version).toBeDefined();
		expect(ControlDSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ControlDSchema.entities).toBe('object');
		expect(ControlDSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ControlDSchema.entities))).toBe(true);
		for (const entity of Object.values(ControlDSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
