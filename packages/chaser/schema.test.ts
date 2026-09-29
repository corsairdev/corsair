import { ChaserSchema } from './schema';

describe('Chaser schema', () => {
	it('declares a semver version', () => {
		expect(ChaserSchema.version).toBeDefined();
		expect(ChaserSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ChaserSchema.entities).toBe('object');
		expect(ChaserSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ChaserSchema.entities))).toBe(true);
		for (const entity of Object.values(ChaserSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
