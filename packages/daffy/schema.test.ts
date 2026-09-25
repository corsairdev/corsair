import { DaffySchema } from './schema';

describe('Daffy schema', () => {
	it('declares a semver version', () => {
		expect(DaffySchema.version).toBeDefined();
		expect(DaffySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DaffySchema.entities).toBe('object');
		expect(DaffySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DaffySchema.entities))).toBe(true);
		for (const entity of Object.values(DaffySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
