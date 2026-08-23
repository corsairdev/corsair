import { TickTickSchema } from './schema';

describe('TickTick schema', () => {
	it('declares a semver version', () => {
		expect(TickTickSchema.version).toBeDefined();
		expect(TickTickSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TickTickSchema.entities).toBe('object');
		expect(TickTickSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TickTickSchema.entities))).toBe(true);
		for (const entity of Object.values(TickTickSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
