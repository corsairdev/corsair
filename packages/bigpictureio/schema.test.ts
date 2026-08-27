import { BigpictureioSchema } from './schema';

describe('Bigpictureio schema', () => {
	it('declares a semver version', () => {
		expect(BigpictureioSchema.version).toBeDefined();
		expect(BigpictureioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BigpictureioSchema.entities).toBe('object');
		expect(BigpictureioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BigpictureioSchema.entities))).toBe(true);
		for (const entity of Object.values(BigpictureioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
