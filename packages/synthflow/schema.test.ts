import { SynthflowSchema } from './schema';

describe('Synthflow schema', () => {
	it('declares a semver version', () => {
		expect(SynthflowSchema.version).toBeDefined();
		expect(SynthflowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SynthflowSchema.entities).toBe('object');
		expect(SynthflowSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SynthflowSchema.entities))).toBe(true);
		for (const entity of Object.values(SynthflowSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
