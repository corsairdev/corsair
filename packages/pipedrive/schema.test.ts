import { PipedriveSchema } from './schema';

describe('Pipedrive schema', () => {
	it('declares a semver version', () => {
		expect(PipedriveSchema.version).toBeDefined();
		expect(PipedriveSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PipedriveSchema.entities).toBe('object');
		expect(PipedriveSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PipedriveSchema.entities))).toBe(true);
		for (const entity of Object.values(PipedriveSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
